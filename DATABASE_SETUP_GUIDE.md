# 🗄️ Database Setup Guide

This guide helps you set up and verify your Supabase database for the KSR Learner website.

## 🚨 Common Database Issues

### 1. "Table does not exist" Error

**Error**: `The table 'public.users' does not exist in the current database`

**Cause**: Database tables haven't been created yet or schema is out of sync.

**Solution**: Run database setup commands to create tables.

## 🛠️ Database Setup Commands

### 1. Create/Update Database Tables

```bash
# Push schema to database (creates tables if they don't exist)
npx prisma db push

# Force reset and recreate all tables (if needed)
npx prisma db push --force-reset
```

### 2. Verify Database Connection

```bash
# Verify database tables exist
npm run db:verify

# Or run directly
node scripts/verify-database.js
```

### 3. View Database in Browser

```bash
# Open Prisma Studio to view/edit data
npm run db:studio
```

## 🔧 Troubleshooting Steps

### Step 1: Check Database Connection

Verify your `DATABASE_URL` in `.env` file:

```env
DATABASE_URL=postgresql://postgres.omyhkchdincqmskuozek:NUeYxXnUeNlZ8rm2@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1
```

### Step 2: Create Tables

If tables don't exist, create them:

```bash
# Option 1: Push schema (recommended)
npx prisma db push

# Option 2: Force reset (if push fails)
npx prisma db push --force-reset
```

### Step 3: Verify Tables Exist

```bash
npm run db:verify
```

Expected output:
```
🔍 Verifying database connection and tables...
✅ Database connection successful
✅ Users table exists with 0 users
✅ Scores table exists with 0 scores
🎉 Database verification completed successfully!
```

### Step 4: Test Application

Start the development server and test signup:

```bash
npm run dev
```

Visit `http://localhost:3001/auth` and try to sign up.

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE "users" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "name" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "avatarUrl" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "lastLoginAt" TIMESTAMP(3)
);
```

### Scores Table
```sql
CREATE TABLE "scores" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "kind" TEXT NOT NULL,
  "value" INTEGER NOT NULL,
  "meta" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "scores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
```

## 🚀 Production Deployment

### For Netlify Deployment

1. **Ensure tables exist** in your Supabase database
2. **Add environment variables** to Netlify:
   ```
   DATABASE_URL=your-supabase-connection-string
   ```
3. **Use fallback build** that handles Prisma generation:
   ```
   Build Command: npm run build:fallback
   ```

### Database Migration Commands

```bash
# For production deployment
npx prisma migrate deploy

# For development
npx prisma migrate dev
```

## 🔍 Verification Commands

### Check Database Status
```bash
# Verify connection and tables
npm run db:verify

# Check Prisma client
npx prisma generate

# View database schema
npx prisma db pull
```

### Test Database Operations
```bash
# Test user creation (in Node.js)
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.create({
  data: {
    email: 'test@example.com',
    passwordHash: 'test',
    name: 'Test User'
  }
}).then(console.log).catch(console.error);
"
```

## 🆘 Still Having Issues?

### Check These Files
- `.env` - Database connection string
- `prisma/schema.prisma` - Database schema
- `lib/prisma.ts` - Prisma client configuration

### Common Solutions
1. **Reset database**: `npx prisma db push --force-reset`
2. **Regenerate client**: `npx prisma generate`
3. **Check connection**: Verify `DATABASE_URL` is correct
4. **Clear cache**: Delete `node_modules/.prisma` and regenerate

### Get Help
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Database verification**: Run `npm run db:verify`

---

**Remember**: Always run `npm run db:verify` after setting up the database to ensure everything is working correctly!
