#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting fallback build process...');

try {
  // Step 1: Try to generate Prisma client (may fail if no DB connection)
  console.log('📦 Attempting to generate Prisma client...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated successfully');
  } catch (prismaError) {
    console.log('⚠️ Prisma generation failed, continuing with build...');
    console.log('This is expected if DATABASE_URL is not available during build');
  }

  // Step 2: Build Next.js application
  console.log('🏗️ Building Next.js application...');
  execSync('npx next build', { stdio: 'inherit' });
  console.log('✅ Next.js build completed successfully');

  console.log('🎉 Fallback build process completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
