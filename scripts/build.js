#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting build process...');

try {
  // Step 1: Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated successfully');

  // Step 2: Build Next.js application
  console.log('🏗️ Building Next.js application...');
  execSync('npx next build', { stdio: 'inherit' });
  console.log('✅ Next.js build completed successfully');

  console.log('🎉 Build process completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
