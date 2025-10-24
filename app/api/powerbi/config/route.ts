import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Power BI configuration
    const config = {
      workspaceId: process.env.POWERBI_WORKSPACE_ID || 'your-workspace-id',
      reportId: process.env.POWERBI_REPORT_ID || 'your-report-id',
      groupId: process.env.POWERBI_GROUP_ID || 'your-group-id',
      clientId: process.env.POWERBI_CLIENT_ID || 'your-client-id',
      clientSecret: process.env.POWERBI_CLIENT_SECRET || 'your-client-secret',
      tenantId: process.env.POWERBI_TENANT_ID || 'your-tenant-id',
      // Embed URL for the report
      embedUrl: process.env.POWERBI_EMBED_URL || 'https://app.powerbi.com/reportEmbed',
      // Authentication endpoint
      authUrl: process.env.POWERBI_AUTH_URL || 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      // Scopes for Power BI
      scopes: [
        'https://analysis.windows.net/powerbi/api/Report.Read.All',
        'https://analysis.windows.net/powerbi/api/Dataset.Read.All'
      ]
    }

    return NextResponse.json({
      success: true,
      config: {
        workspaceId: config.workspaceId,
        reportId: config.reportId,
        groupId: config.groupId,
        clientId: config.clientId,
        embedUrl: config.embedUrl,
        scopes: config.scopes
      },
      setup: {
        required: [
          'POWERBI_WORKSPACE_ID',
          'POWERBI_REPORT_ID', 
          'POWERBI_GROUP_ID',
          'POWERBI_CLIENT_ID',
          'POWERBI_CLIENT_SECRET',
          'POWERBI_TENANT_ID'
        ],
        optional: [
          'POWERBI_EMBED_URL',
          'POWERBI_AUTH_URL'
        ]
      }
    })
  } catch (error) {
    console.error('Power BI config error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to load Power BI configuration',
        message: 'Please check your environment variables'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, credentials } = body

    if (action === 'test-connection') {
      // Test Power BI connection
      const testResult = await testPowerBIConnection(credentials)
      return NextResponse.json({
        success: testResult.success,
        message: testResult.message,
        details: testResult.details
      })
    }

    if (action === 'get-access-token') {
      // Get access token for Power BI
      const tokenResult = await getPowerBIAccessToken(credentials)
      return NextResponse.json({
        success: tokenResult.success,
        accessToken: tokenResult.accessToken,
        expiresIn: tokenResult.expiresIn,
        message: tokenResult.message
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Power BI API error:', error)
    return NextResponse.json(
      { success: false, error: 'Power BI API request failed' },
      { status: 500 }
    )
  }
}

async function testPowerBIConnection(credentials: any) {
  try {
    // Test basic connectivity to Power BI service
    const response = await fetch('https://api.powerbi.com/v1.0/myorg/groups', {
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      return {
        success: true,
        message: 'Power BI connection successful',
        details: 'Successfully connected to Power BI service'
      }
    } else {
      return {
        success: false,
        message: 'Power BI connection failed',
        details: `HTTP ${response.status}: ${response.statusText}`
      }
    }
  } catch (error) {
    return {
      success: false,
      message: 'Power BI connection error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function getPowerBIAccessToken(credentials: any) {
  try {
    const { clientId, clientSecret, tenantId } = credentials
    
    const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`
    
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'https://analysis.windows.net/powerbi/api/.default'
    })

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    })

    if (response.ok) {
      const tokenData = await response.json()
      return {
        success: true,
        accessToken: tokenData.access_token,
        expiresIn: tokenData.expires_in,
        message: 'Access token obtained successfully'
      }
    } else {
      const errorData = await response.json()
      return {
        success: false,
        accessToken: null,
        expiresIn: 0,
        message: `Token request failed: ${errorData.error_description || errorData.error}`
      }
    }
  } catch (error) {
    return {
      success: false,
      accessToken: null,
      expiresIn: 0,
      message: `Token request error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}
