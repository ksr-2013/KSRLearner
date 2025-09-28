#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

async function verifyDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Verifying database connection and tables...');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Check if users table exists by trying to count users
    const userCount = await prisma.user.count();
    console.log(`✅ Users table exists with ${userCount} users`);
    
    // Check if scores table exists by trying to count scores
    const scoreCount = await prisma.score.count();
    console.log(`✅ Scores table exists with ${scoreCount} scores`);
    
    console.log('🎉 Database verification completed successfully!');
    
  } catch (error) {
    console.error('❌ Database verification failed:', error.message);
    
    if (error.message.includes('does not exist')) {
      console.log('\n🔧 Solution: Run the following command to create tables:');
      console.log('npx prisma db push --force-reset');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabase();
