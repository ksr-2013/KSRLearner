import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const envCheck = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      JWT_SECRET: !!process.env.JWT_SECRET,
    }
    
    const missingVars = Object.entries(envCheck)
      .filter(([key, exists]) => !exists)
      .map(([key]) => key)
    
    return NextResponse.json({
      success: true,
      environmentVariables: envCheck,
      missingVariables: missingVars,
      hasAllRequired: missingVars.length === 0,
      message: missingVars.length === 0 
        ? 'All required environment variables are set' 
        : `Missing variables: ${missingVars.join(', ')}`
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
