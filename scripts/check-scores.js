#!/usr/bin/env node

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function checkScores() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  try {
    console.log('🔍 Checking database for scores...');
    
    // Check users
    const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
    console.log(`👥 Users: ${usersResult.rows[0].count}`);
    
    // Check scores
    const scoresResult = await pool.query('SELECT COUNT(*) as count FROM scores');
    console.log(`📊 Scores: ${scoresResult.rows[0].count}`);
    
    if (scoresResult.rows[0].count > 0) {
      // Show recent scores
      const recentScores = await pool.query(`
        SELECT s.*, u.email, u.name 
        FROM scores s 
        JOIN users u ON s."userId" = u.id 
        ORDER BY s."createdAt" DESC 
        LIMIT 10
      `);
      
      console.log('\n📈 Recent Scores:');
      recentScores.rows.forEach(score => {
        console.log(`- ${score.kind}: ${score.value} (${score.email}) - ${score.createdAt}`);
      });
    }
    
    // Check for any demo/test scores
    const demoScores = await pool.query(`
      SELECT s.*, u.email 
      FROM scores s 
      JOIN users u ON s."userId" = u.id 
      WHERE u.email LIKE '%test%' OR u.email LIKE '%demo%' OR u.email LIKE '%example%'
    `);
    
    if (demoScores.rows.length > 0) {
      console.log('\n🧪 Demo/Test Scores Found:');
      demoScores.rows.forEach(score => {
        console.log(`- ${score.kind}: ${score.value} (${score.email})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking scores:', error.message);
  } finally {
    await pool.end();
  }
}

checkScores();
