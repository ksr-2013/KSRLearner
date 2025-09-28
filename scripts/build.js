#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting build process...');

try {
  // Step 1: Generate Prisma client
  console.log('📦 Generating Prisma client...');
  
  // Set environment variables for Prisma generation
  process.env.PRISMA_GENERATE_SKIP_AUTOINSTALL = 'true';
  process.env.PRISMA_CLI_BINARY_TARGETS = 'rhel-openssl-1.0.x,rhel-openssl-3.0.x';
  
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
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
