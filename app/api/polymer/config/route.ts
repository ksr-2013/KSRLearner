import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Polymer AI configuration
    const config = {
      workspaceId: process.env.POLYMER_WORKSPACE_ID || 'ksrlearner',
      dashboardId: process.env.POLYMER_DASHBOARD_ID || '',
      apiKey: process.env.POLYMER_API_KEY || '8dafdfaf-4477-41b9-bd42-88a6c377809e',
      embedUrl: process.env.POLYMER_EMBED_URL || 'https://v3.polymersearch.com/ksrlearner/Ksr\'s Workspace',
      // Polymer API endpoints
      apiUrl: process.env.POLYMER_API_URL || 'https://v3.polymersearch.com/api/v1',
      // Authentication endpoint
      authUrl: process.env.POLYMER_AUTH_URL || 'https://v3.polymersearch.com/api/v1/auth',
      // Scopes for Polymer AI
      scopes: [
        'dashboard:read',
        'analytics:read',
        'insights:read'
      ]
    }

    return NextResponse.json({
      success: true,
      config: {
        workspaceId: config.workspaceId,
        dashboardId: config.dashboardId,
        apiKey: config.apiKey,
        embedUrl: config.embedUrl,
        apiUrl: config.apiUrl,
        scopes: config.scopes
      },
      setup: {
        required: [
          'POLYMER_API_KEY'
        ],
        optional: [
          'POLYMER_WORKSPACE_ID',
          'POLYMER_DASHBOARD_ID',
          'POLYMER_EMBED_URL',
          'POLYMER_API_URL',
          'POLYMER_AUTH_URL'
        ]
      }
    })
  } catch (error) {
    console.error('Polymer config error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to load Polymer configuration',
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
      // Test Polymer AI connection
      const testResult = await testPolymerConnection(credentials)
      return NextResponse.json({
        success: testResult.success,
        message: testResult.message,
        details: testResult.details
      })
    }

    if (action === 'get-access-token') {
      // Get access token for Polymer AI
      const tokenResult = await getPolymerAccessToken(credentials)
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
    console.error('Polymer API error:', error)
    return NextResponse.json(
      { success: false, error: 'Polymer API request failed' },
      { status: 500 }
    )
  }
}

async function testPolymerConnection(credentials: any) {
  try {
    // Test basic connectivity to Polymer AI service
    const response = await fetch(`${credentials.apiUrl || 'https://api.polymersearch.com'}/v1/workspaces`, {
      headers: {
        'Authorization': `Bearer ${credentials.apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      return {
        success: true,
        message: 'Polymer AI connection successful',
        details: 'Successfully connected to Polymer AI service'
      }
    } else {
      return {
        success: false,
        message: 'Polymer AI connection failed',
        details: `HTTP ${response.status}: ${response.statusText}`
      }
    }
  } catch (error) {
    return {
      success: false,
      message: 'Polymer AI connection error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function getPolymerAccessToken(credentials: any) {
  try {
    const { apiKey, workspaceId } = credentials
    
    const tokenUrl = `${credentials.apiUrl || 'https://api.polymersearch.com'}/v1/auth/token`
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        workspaceId: workspaceId,
        scopes: ['dashboard:read', 'analytics:read', 'insights:read']
      })
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
        message: `Token request failed: ${errorData.error || errorData.message}`
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
