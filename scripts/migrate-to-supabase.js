#!/usr/bin/env node

/**
 * Migration script to help migrate from Neon to Supabase
 * This script provides utilities for database migration
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 KSR Learner - Supabase Migration Helper\n')

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local')
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!')
  console.log('📝 Please create .env.local with your Supabase configuration first.')
  console.log('📖 See SUPABASE_MIGRATION_GUIDE.md for details.\n')
  process.exit(1)
}

// Read environment variables
require('dotenv').config({ path: envPath })

// Validate required environment variables
const requiredVars = [
  'DATABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
]

const missingVars = requiredVars.filter(varName => !process.env[varName])

if (missingVars.length > 0) {
  console.log('❌ Missing required environment variables:')
  missingVars.forEach(varName => console.log(`   - ${varName}`))
  console.log('\n📝 Please add these to your .env.local file.')
  process.exit(1)
}

console.log('✅ Environment variables validated')

// Check if DATABASE_URL is Supabase
const isSupabase = process.env.DATABASE_URL?.includes('supabase.co')
if (!isSupabase) {
  console.log('⚠️  DATABASE_URL does not appear to be a Supabase URL')
  console.log('   Make sure you\'re using the correct Supabase connection string')
}

console.log('✅ Database URL validated')

// Generate Prisma client
console.log('\n🔄 Generating Prisma client...')
try {
  execSync('npx prisma generate', { stdio: 'inherit' })
  console.log('✅ Prisma client generated successfully')
} catch (error) {
  console.log('❌ Failed to generate Prisma client')
  console.error(error.message)
  process.exit(1)
}

// Push schema to database
console.log('\n🔄 Pushing schema to Supabase...')
try {
  execSync('npx prisma db push', { stdio: 'inherit' })
  console.log('✅ Schema pushed to Supabase successfully')
} catch (error) {
  console.log('❌ Failed to push schema to Supabase')
  console.error(error.message)
  process.exit(1)
}

// Test database connection
console.log('\n🔄 Testing database connection...')
try {
  execSync('npx prisma db pull --print', { stdio: 'pipe' })
  console.log('✅ Database connection successful')
} catch (error) {
  console.log('❌ Database connection failed')
  console.error(error.message)
  process.exit(1)
}

console.log('\n🎉 Migration to Supabase completed successfully!')
console.log('\n📋 Next steps:')
console.log('   1. Test your application: npm run dev')
console.log('   2. Verify data integrity in Supabase dashboard')
console.log('   3. Update your production environment variables')
console.log('   4. Deploy your updated application')

console.log('\n🔗 Useful links:')
console.log('   - Supabase Dashboard: https://supabase.com/dashboard')
console.log('   - Prisma Studio: npx prisma studio')
console.log('   - Migration Guide: SUPABASE_MIGRATION_GUIDE.md')
