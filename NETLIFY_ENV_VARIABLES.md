# 🌐 Netlify Environment Variables for KSR Learner

This guide provides the complete list of environment variables you need to configure in Netlify for your KSR Learner website with Supabase database.

## 📋 Required Environment Variables

### 1. Database Configuration (Supabase)
```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

**How to get this:**
1. Go to your Supabase dashboard
2. Navigate to **Settings** → **Database**
3. Find the **Connection string** section
4. Copy the **URI** connection string
5. Replace `[YOUR-PASSWORD]` with your actual database password
6. Replace `[YOUR-PROJECT-REF]` with your actual project reference

### 2. Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]
```

**How to get these:**
1. Go to your Supabase dashboard
2. Navigate to **Settings** → **API**
3. Copy the **Project URL** for `NEXT_PUBLIC_SUPABASE_URL`
4. Copy the **anon public** key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Copy the **service_role** key for `SUPABASE_SERVICE_ROLE_KEY`

### 3. Authentication
```
JWT_SECRET=0974420354
```

### 4. AI API Keys
```
NEXT_PUBLIC_AI_PROVIDER=groq
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=llama-3.1-8b-instant
```

### 5. App Configuration
```
NEXT_PUBLIC_APP_URL=https://your-netlify-site-name.netlify.app
```

**Replace `your-netlify-site-name` with your actual Netlify site name.**

### 6. Optional AI API Keys (Add if you want to use these services)
```
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key
ELEVENLABS_API_KEY=your-elevenlabs-api-key
VAPI_API_KEY=your-vapi-api-key
```

## 🚀 How to Add Variables in Netlify

### Method 1: Netlify Dashboard (Recommended)

1. **Go to your Netlify dashboard**
2. **Select your site**
3. **Navigate to Site settings** → **Environment variables**
4. **Click "Add variable"** for each variable above
5. **Enter the variable name and value**
6. **Click "Save"**

### Method 2: Netlify CLI

1. **Install Netlify CLI** (if not already installed):
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Set variables** (replace with your actual values):
   ```bash
   netlify env:set DATABASE_URL "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://[YOUR-PROJECT-REF].supabase.co"
   netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "[YOUR-ANON-KEY]"
   netlify env:set SUPABASE_SERVICE_ROLE_KEY "[YOUR-SERVICE-ROLE-KEY]"
   netlify env:set JWT_SECRET "0974420354"
   netlify env:set NEXT_PUBLIC_AI_PROVIDER "groq"
   netlify env:set GROQ_API_KEY "your-groq-api-key"
   netlify env:set GROQ_MODEL "llama-3.1-8b-instant"
   netlify env:set NEXT_PUBLIC_APP_URL "https://your-netlify-site-name.netlify.app"
   ```

## 🔧 Environment Variable Categories

### Public Variables (NEXT_PUBLIC_*)
These are exposed to the browser and should be safe to share:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_AI_PROVIDER`
- `NEXT_PUBLIC_APP_URL`

### Private Variables (Server-side only)
These are only available on the server and should be kept secret:
- `DATABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- `GROQ_API_KEY`
- `GROQ_MODEL`
- `GEMINI_API_KEY`
- `OPENAI_API_KEY`
- `ELEVENLABS_API_KEY`
- `VAPI_API_KEY`

## 🚨 Important Security Notes

1. **Never commit environment variables to Git**
2. **Keep your service role key secret** - it has admin access
3. **Use different JWT secrets for different environments**
4. **Regularly rotate your API keys**
5. **Monitor your Supabase usage** to avoid unexpected charges

## 🧪 Testing Your Configuration

After setting up the environment variables:

1. **Trigger a new deployment** in Netlify
2. **Check the build logs** for any errors
3. **Test the following features**:
   - User registration/login
   - Quiz score saving
   - Dashboard data loading
   - AI chat functionality

## 🔍 Troubleshooting

### Common Issues:

1. **Build fails with "DATABASE_URL not found"**
   - Check that `DATABASE_URL` is set correctly
   - Verify the connection string format

2. **"Supabase connection failed"**
   - Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Check that your Supabase project is active

3. **"JWT_SECRET not defined"**
   - Ensure `JWT_SECRET` is set in Netlify
   - Redeploy after adding the variable

4. **AI features not working**
   - Check that `GROQ_API_KEY` is set correctly
   - Verify the API key is valid and has credits

### Getting Help:

- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Environment Variables**: [nextjs.org/docs/basic-features/environment-variables](https://nextjs.org/docs/basic-features/environment-variables)

## 📊 Monitoring

After deployment, monitor:

1. **Netlify Function logs** for any errors
2. **Supabase dashboard** for database activity
3. **API usage** to ensure you're within limits
4. **Site performance** and response times

---

**Need Help?** If you encounter any issues, check the troubleshooting section or reach out for support!
