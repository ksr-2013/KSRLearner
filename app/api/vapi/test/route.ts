import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY || ''
    
    return NextResponse.json({
      success: true,
      apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
      apiKeyLength: apiKey.length,
      apiKeyFormat: apiKey.startsWith('vapi_') ? 'API Key' : 'Assistant ID',
      environment: process.env.NODE_ENV,
      message: apiKey.startsWith('vapi_') 
        ? 'This looks like a proper API key' 
        : 'This looks like an Assistant ID - you might need a different approach'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to check API key'
    }, { status: 500 })
  }
}
