# 🔧 Build Troubleshooting Guide

This guide helps resolve common build issues with the KSR Learner website on Netlify.

## 🚨 Common Build Issues

### 1. Prisma Generation Failures

**Error**: `Error: P1001: Can't reach database server`

**Cause**: Prisma tries to connect to the database during build time, but the database might not be accessible or environment variables might not be set.

**Solutions**:

#### Option A: Use Fallback Build (Recommended)
```bash
# In Netlify, change build command to:
npm run build:fallback
```

#### Option B: Set Environment Variables in Netlify
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add `DATABASE_URL` with your Supabase connection string
3. Redeploy

#### Option C: Skip Prisma Generation During Build
```bash
# In Netlify, change build command to:
npm run build:next
```

### 2. Node.js Version Issues

**Error**: `The engine "node" is incompatible with this module`

**Solution**: Ensure Netlify is using Node.js 20.x
- Go to Netlify Dashboard → Site Settings → Environment Variables
- Add: `NODE_VERSION = "20"`

### 3. Prisma Binary Target Issues

**Error**: `Prisma Client binary target not found`

**Solution**: The Prisma schema now includes multiple binary targets:
```prisma
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-1.0.x"]
}
```

### 4. Memory Issues During Build

**Error**: `JavaScript heap out of memory`

**Solution**: Add to Netlify environment variables:
```
NODE_OPTIONS = "--max-old-space-size=4096"
```

## 🛠️ Build Commands Available

### Primary Build Commands

1. **`npm run build`** - Full build with Prisma generation
2. **`npm run build:fallback`** - Build with optional Prisma generation
3. **`npm run build:next`** - Next.js build only (no Prisma)

### Development Commands

1. **`npm run dev`** - Start development server
2. **`npm run prisma:generate`** - Generate Prisma client
3. **`npm run db:push`** - Push schema to database

## 🔍 Debugging Steps

### 1. Check Build Logs
- Go to Netlify Dashboard → Deploys
- Click on the failed deploy
- Check the build log for specific error messages

### 2. Test Locally
```bash
# Test the build process locally
npm run build

# If that fails, try fallback
npm run build:fallback

# If that fails, try Next.js only
npm run build:next
```

### 3. Verify Environment Variables
```bash
# Check if environment variables are loaded
node -e "console.log(process.env.DATABASE_URL)"
```

### 4. Check Prisma Client Generation
```bash
# Generate Prisma client manually
npx prisma generate

# Check if client was generated
ls node_modules/.prisma/client/
```

## 🚀 Recommended Netlify Configuration

### Build Settings
- **Build Command**: `npm run build:fallback`
- **Publish Directory**: `.next`
- **Node Version**: `20`

### Environment Variables (Required)
```
DATABASE_URL=postgresql://postgres.xxx:xxx@db.xxx.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
JWT_SECRET=xxx
NEXT_PUBLIC_AI_PROVIDER=groq
GROQ_API_KEY=xxx
GROQ_MODEL=llama-3.1-8b-instant
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
```

### Environment Variables (Optional)
```
NODE_OPTIONS=--max-old-space-size=4096
PRISMA_GENERATE_SKIP_AUTOINSTALL=true
PRISMA_CLI_BINARY_TARGETS=native,rhel-openssl-1.0.x
```

## 🔄 Build Process Flow

1. **Install Dependencies** (`npm install`)
2. **Generate Prisma Client** (`prisma generate`)
3. **Build Next.js App** (`next build`)
4. **Deploy to Netlify**

## 🆘 Still Having Issues?

### Check These Files
- `package.json` - Scripts and dependencies
- `netlify.toml` - Netlify configuration
- `prisma/schema.prisma` - Database schema
- `.env` - Environment variables (local only)

### Common Solutions
1. **Clear Netlify cache** - Trigger a new deploy
2. **Update dependencies** - Run `npm update`
3. **Check Node.js version** - Ensure compatibility
4. **Verify environment variables** - All required vars must be set

### Get Help
- Check Netlify build logs for specific errors
- Test build commands locally first
- Verify all environment variables are set correctly
- Ensure database is accessible from Netlify

---

**Remember**: The fallback build (`npm run build:fallback`) is designed to work even if the database is not accessible during build time, making it the most reliable option for Netlify deployment.
