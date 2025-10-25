import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../lib/db'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Test score API endpoint called')
    
    // Test database connection
    const result = await db.query('SELECT COUNT(*) as count FROM scores')
    console.log('📊 Database connection test:', result.rows[0])
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test endpoint working',
      databaseConnected: true,
      scoreCount: result.rows[0].count
    })
  } catch (error: any) {
    console.error('❌ Test score API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Test score POST endpoint called')
    
    const body = await request.json()
    console.log('📤 Request body:', body)
    
    // Test inserting a score
    const id = 'test_' + Date.now().toString(36)
    const result = await db.query(`
      INSERT INTO scores (id, "userId", kind, value, meta, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *
    `, [id, 'test-user', 'quiz', 85, JSON.stringify({ test: true })])
    
    console.log('✅ Test score inserted:', result.rows[0])
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test score saved successfully',
      score: result.rows[0]
    })
  } catch (error: any) {
    console.error('❌ Test score POST error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
