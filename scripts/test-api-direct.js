#!/usr/bin/env node

const fetch = require('node-fetch');

async function testAPIDirect() {
  try {
    console.log('🔍 Testing API endpoint directly...');
    
    // Test the scores API endpoint
    const response = await fetch('http://localhost:3000/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        kind: 'quiz',
        value: 85,
        meta: {
          title: 'Test Quiz',
          score: 85,
          completed: true
        }
      })
    });
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response ok:', response.ok);
    
    const data = await response.json();
    console.log('📥 Response data:', data);
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testAPIDirect();
