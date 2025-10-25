#!/usr/bin/env node

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function testUpdatedScoreSave() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  try {
    console.log('🔍 Testing updated score save functionality...');
    
    // Get the first user (your current user)
    const usersResult = await pool.query('SELECT id, email, name FROM users LIMIT 1');
    if (usersResult.rows.length === 0) {
      console.log('❌ No users found');
      return;
    }
    
    const user = usersResult.rows[0];
    console.log(`👤 Testing with user: ${user.email} (${user.id})`);
    
    // Test inserting a score with proper ID generation
    const testScore = {
      kind: 'quiz',
      value: 85,
      meta: { title: 'Test Quiz', score: 85, completed: true }
    };
    
    // Generate a unique ID using cuid-like format
    const id = 'c' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
    console.log(`🆔 Generated ID: ${id}`);
    
    console.log('📊 Attempting to insert test score...');
    const insertResult = await pool.query(`
      INSERT INTO scores (id, "userId", kind, value, meta, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *
    `, [id, user.id, testScore.kind, testScore.value, JSON.stringify(testScore.meta)]);
    
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

testUpdatedScoreSave();

