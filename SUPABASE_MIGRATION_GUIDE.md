# 🚀 Migration Guide: Neon to Supabase Database

This guide will help you migrate your KSR Learner website from Neon database to Supabase.

## 📋 Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Current Database Backup**: Ensure you have a backup of your current data
3. **Environment Variables**: Access to your current database configuration

## 🔧 Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `ksr-learner`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be ready (2-3 minutes)

## 🔑 Step 2: Get Supabase Connection Details

Once your project is ready:

1. Go to **Settings** → **Database**
2. Find the **Connection string** section
3. Copy the **URI** connection string
4. Go to **Settings** → **API**
5. Copy the following keys:
   - **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public** key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **service_role** key (`SUPABASE_SERVICE_ROLE_KEY`)

## 📝 Step 3: Update Environment Variables

Create a `.env.local` file in your project root with:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"

# JWT Secret for authentication
JWT_SECRET="your-jwt-secret-key-here"

# AI API Keys (keep your existing ones)
GROQ_API_KEY="your-groq-api-key"
GEMINI_API_KEY="your-gemini-api-key"
OPENAI_API_KEY="your-openai-api-key"
ELEVENLABS_API_KEY="your-elevenlabs-api-key"
VAPI_API_KEY="your-vapi-api-key"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 🗄️ Step 4: Update Prisma Schema (Optional)

The current Prisma schema is already compatible with Supabase PostgreSQL. No changes needed!

## 🚀 Step 5: Run Database Migration

1. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

2. **Push Schema to Supabase**:
   ```bash
   npx prisma db push
   ```

3. **Verify Connection**:
   ```bash
   npx prisma studio
   ```

## 📊 Step 6: Migrate Data (If Needed)

If you have existing data in Neon:

1. **Export from Neon**:
   ```bash
   pg_dump "your-neon-connection-string" > backup.sql
   ```

2. **Import to Supabase**:
   ```bash
   psql "your-supabase-connection-string" < backup.sql
   ```

## 🧪 Step 7: Test the Migration

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Test Key Features**:
   - User registration/login
   - Quiz score saving
   - Dashboard data loading
   - AI chat functionality

## 🌐 Step 8: Update Production Deployment

### For Netlify:

1. Go to your Netlify dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Update the following variables:
   - `DATABASE_URL` → Your new Supabase URL
   - `NEXT_PUBLIC_SUPABASE_URL` → Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` → Your Supabase service role key

4. **Redeploy** your site

## ✅ Step 9: Verify Everything Works

1. **Check Database Connection**: Visit `/dashboard` and ensure data loads
2. **Test User Registration**: Create a new account
3. **Test Score Saving**: Complete a quiz and verify score is saved
4. **Test AI Features**: Ensure AI chat and assistants work
5. **Check Performance**: Monitor response times

## 🔧 Troubleshooting

### Common Issues:

1. **Connection Refused**: Check your DATABASE_URL format
2. **Authentication Failed**: Verify your password is correct
3. **SSL Error**: Ensure `?sslmode=require` is in your connection string
4. **Permission Denied**: Check that your service role key has proper permissions

### Getting Help:

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)
- **Discord Support**: Join the Supabase Discord community

## 🎉 Benefits of Supabase

- **Better Performance**: Faster queries and connections
- **Real-time Features**: Built-in real-time subscriptions
- **Authentication**: Built-in auth with multiple providers
- **Storage**: File storage capabilities
- **Edge Functions**: Serverless functions at the edge
- **Better Monitoring**: Comprehensive analytics and monitoring

## 📈 Next Steps

After migration, consider:

1. **Enable Row Level Security (RLS)** for better data protection
2. **Set up real-time subscriptions** for live updates
3. **Use Supabase Auth** instead of custom JWT
4. **Implement file storage** for user avatars
5. **Add database backups** and monitoring

---

**Need Help?** If you encounter any issues during migration, check the troubleshooting section or reach out for support!
