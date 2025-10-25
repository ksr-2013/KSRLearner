#!/usr/bin/env node

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function testScoreSave() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  try {
    console.log('🔍 Testing score save functionality...');
    
    // Get the first user (your current user)
    const usersResult = await pool.query('SELECT id, email, name FROM users LIMIT 1');
    if (usersResult.rows.length === 0) {
      console.log('❌ No users found');
      return;
    }
    
    const user = usersResult.rows[0];
    console.log(`👤 Testing with user: ${user.email} (${user.id})`);
    
    // Test inserting a score directly
    const testScore = {
      kind: 'quiz',
      value: 85,
      meta: { title: 'Test Quiz', score: 85, completed: true }
    };
    
    console.log('📊 Attempting to insert test score...');
    const insertResult = await pool.query(`
      INSERT INTO scores ("userId", kind, value, meta, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *
    `, [user.id, testScore.kind, testScore.value, JSON.stringify(testScore.meta)]);
    
    console.log('✅ Score inserted successfully:', insertResult.rows[0]);
    
    // Clean up test score
    await pool.query('DELETE FROM scores WHERE id = $1', [insertResult.rows[0].id]);
    console.log('🧹 Test score cleaned up');
    
  } catch (error) {
    console.error('❌ Error testing score save:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

testScoreSave();

