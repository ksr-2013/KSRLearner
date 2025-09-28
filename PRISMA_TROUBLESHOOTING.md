# 🔧 Prisma Troubleshooting Guide

This guide helps resolve Prisma client generation issues during Netlify deployment.

## 🚨 Common Prisma Issues

### 1. "Unknown binaryTarget native" Error

**Error**: `Unknown binaryTarget native and no custom engine files were provided`

**Cause**: Prisma is trying to use the "native" binary target which isn't available in the Netlify build environment.

**Solution**: Use Linux-compatible binary targets for Netlify deployment.

### 2. Binary Target Configuration

**Current Configuration** (in `prisma/schema.prisma`):
```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
  binaryTargets = ["rhel-openssl-1.0.x", "rhel-openssl-3.0.x"]
}
```

**Netlify Environment Variables** (in `netlify.toml`):
```toml
[build.environment]
  PRISMA_GENERATE_SKIP_AUTOINSTALL = "true"
  PRISMA_CLI_BINARY_TARGETS = "rhel-openssl-1.0.x,rhel-openssl-3.0.x"
```

### 3. Build Script Configuration

**Fallback Build Script** (`scripts/build-fallback.js`):
- Handles Prisma generation failures gracefully
- Continues build even if Prisma generation fails
- Sets proper environment variables

**Full Build Script** (`scripts/build.js`):
- Attempts Prisma generation with proper binary targets
- Fails fast if Prisma generation is critical

## 🛠️ Troubleshooting Steps

### Step 1: Check Binary Targets

Ensure your `prisma/schema.prisma` has the correct binary targets:

```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
  binaryTargets = ["rhel-openssl-1.0.x", "rhel-openssl-3.0.x"]
}
```

### Step 2: Verify Environment Variables

Check that Netlify has the correct environment variables:

```
PRISMA_GENERATE_SKIP_AUTOINSTALL=true
PRISMA_CLI_BINARY_TARGETS=rhel-openssl-1.0.x,rhel-openssl-3.0.x
```

### Step 3: Test Build Locally

```bash
# Test fallback build (recommended for Netlify)
npm run build:fallback

# Test full build
npm run build
```

### Step 4: Check Build Logs

In Netlify dashboard:
1. Go to Deploys
2. Click on failed deploy
3. Check build logs for Prisma errors

## 🔄 Alternative Solutions

### Option 1: Skip Prisma Generation During Build

If Prisma generation continues to fail, you can skip it during build:

```bash
# In Netlify, change build command to:
npm run build:next
```

### Option 2: Use Different Binary Targets

Try different binary targets for your specific environment:

```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
  binaryTargets = ["linux-musl", "rhel-openssl-1.0.x"]
}
```

### Option 3: Pre-generate Prisma Client

Generate Prisma client locally and commit it:

```bash
# Generate Prisma client locally
npx prisma generate

# Commit the generated client
git add node_modules/.prisma
git commit -m "Add pre-generated Prisma client"
```

## 📊 Binary Target Compatibility

| Environment | Binary Target | Notes |
|-------------|---------------|-------|
| Netlify | `rhel-openssl-1.0.x` | Recommended for Netlify |
| Netlify | `rhel-openssl-3.0.x` | Alternative for newer Netlify |
| Local Windows | `native` | For local development |
| Local macOS | `native` | For local development |
| Local Linux | `native` | For local development |

## 🚀 Recommended Netlify Configuration

### Build Command
```
npm run build:fallback
```

### Environment Variables
```
NODE_VERSION=18
PRISMA_GENERATE_SKIP_AUTOINSTALL=true
PRISMA_CLI_BINARY_TARGETS=rhel-openssl-1.0.x,rhel-openssl-3.0.x
NODE_OPTIONS=--max-old-space-size=4096
```

### Package.json Scripts
```json
{
  "scripts": {
    "build": "node scripts/build.js",
    "build:fallback": "node scripts/build-fallback.js",
    "build:next": "next build",
    "postinstall": "PRISMA_GENERATE_SKIP_AUTOINSTALL=true PRISMA_CLI_BINARY_TARGETS=rhel-openssl-1.0.x,rhel-openssl-3.0.x prisma generate || echo 'Prisma generation failed, continuing...'"
  }
}
```

## 🔍 Debugging Commands

### Check Prisma Version
```bash
npx prisma --version
```

### Generate Prisma Client Manually
```bash
npx prisma generate
```

### Check Generated Client
```bash
ls node_modules/.prisma/client/
```

### Test Database Connection
```bash
npx prisma db push
```

## 🆘 Still Having Issues?

### Check These Files
- `prisma/schema.prisma` - Binary targets configuration
- `netlify.toml` - Environment variables
- `package.json` - Scripts and dependencies
- `scripts/build-fallback.js` - Build script

### Common Solutions
1. **Clear Netlify cache** - Trigger a new deploy
2. **Update Prisma** - `npm update prisma @prisma/client`
3. **Check Node.js version** - Ensure compatibility
4. **Verify environment variables** - All required vars must be set

### Get Help
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)
- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **Prisma Community**: [prisma.io/community](https://prisma.io/community)

---

**Remember**: The fallback build script is designed to work even if Prisma generation fails, making it the most reliable option for Netlify deployment.
