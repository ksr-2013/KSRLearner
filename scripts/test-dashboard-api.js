#!/usr/bin/env node

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function testDashboardAPI() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  try {
    console.log('🔍 Testing dashboard API logic...');
    
    // Get the first user (assuming it's you)
    const usersResult = await pool.query('SELECT id, email, name FROM users LIMIT 1');
    if (usersResult.rows.length === 0) {
      console.log('❌ No users found');
      return;
    }
    
    const user = usersResult.rows[0];
    console.log(`👤 Testing with user: ${user.email} (${user.id})`);
    
    // Get scores for this user
    const scoresResult = await pool.query(`
      SELECT * FROM scores 
      WHERE "userId" = $1 
      ORDER BY "createdAt" DESC
    `, [user.id]);
    
    console.log(`📊 Found ${scoresResult.rows.length} scores:`);
    scoresResult.rows.forEach(score => {
      console.log(`  - ${score.kind}: ${score.value} (${score.createdAt})`);
    });
    
    // Simulate the dashboard API logic
    const scores = scoresResult.rows;
    const quizScores = scores.filter(s => s.kind === 'quiz');
    const typingScores = scores.filter(s => s.kind === 'typing');
    const puzzleScores = scores.filter(s => s.kind === 'puzzle');
    
    console.log('\n📈 Calculated stats:');
    console.log(`  - Quizzes: ${quizScores.length}`);
    console.log(`  - Typing: ${typingScores.length}`);
    console.log(`  - Puzzles: ${puzzleScores.length}`);
    
    // Generate progress data (last 14 days)
    const progressMap = {};
    for (const s of scores) {
      const key = s.createdAt.toISOString().split('T')[0];
      if (!progressMap[key]) progressMap[key] = { quizzes: 0, typing: 0, puzzles: 0 };
      if (s.kind === 'quiz') progressMap[key].quizzes += 1;
      if (s.kind === 'typing') progressMap[key].typing += 1;
      if (s.kind === 'puzzle') progressMap[key].puzzles += 1;
    }
    
    const progress = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const bucket = progressMap[key] || { quizzes: 0, typing: 0, puzzles: 0 };
      progress.push({ date: key, ...bucket });
    }
    
    console.log('\n📅 Progress data (last 14 days):');
    progress.forEach(p => {
      if (p.quizzes > 0 || p.typing > 0 || p.puzzles > 0) {
        console.log(`  ${p.date}: quizzes=${p.quizzes}, typing=${p.typing}, puzzles=${p.puzzles}`);
      }
    });
    
    const nonZeroDays = progress.filter(p => p.quizzes > 0 || p.typing > 0 || p.puzzles > 0);
    console.log(`\n📊 Non-zero progress days: ${nonZeroDays.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

testDashboardAPI();
