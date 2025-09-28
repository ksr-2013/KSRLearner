# 🔧 Environment Setup Guide - Where to Get Your API Keys

## 📋 Step-by-Step Instructions

### 1️⃣ **Create Your .env.local File**
Copy the template below and save it as `.env.local` in your project root:

```env
# ===========================================
# KSR Learner - Environment Configuration
# ===========================================

# ===========================================
# DATABASE CONFIGURATION (Supabase)
# ===========================================
# 📍 WHERE TO GET: Supabase Dashboard > Settings > Database > Connection string
# 📋 COPY FROM: Connection string section (URI format)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# ===========================================
# SUPABASE CONFIGURATION
# ===========================================
# 📍 WHERE TO GET: Supabase Dashboard > Settings > API
# 📋 COPY FROM: Project URL section
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"

# 📍 WHERE TO GET: Supabase Dashboard > Settings > API
# 📋 COPY FROM: Project API keys > anon public
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"

# 📍 WHERE TO GET: Supabase Dashboard > Settings > API
# 📋 COPY FROM: Project API keys > service_role
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"

# ===========================================
# AUTHENTICATION
# ===========================================
# 🔐 GENERATE: Run this command in terminal: openssl rand -base64 32
JWT_SECRET="your-super-secret-jwt-key-here"

# ===========================================
# AI API KEYS
# ===========================================
# 🤖 GROQ API: https://console.groq.com/keys
GROQ_API_KEY="your-groq-api-key"

# 🤖 GEMINI API: https://makersuite.google.com/app/apikey
GEMINI_API_KEY="your-gemini-api-key"

# 🤖 OPENAI API: https://platform.openai.com/api-keys
OPENAI_API_KEY="your-openai-api-key"

# 🎵 ELEVENLABS API: https://elevenlabs.io/app/settings/api-keys
ELEVENLABS_API_KEY="your-elevenlabs-api-key"

# 📞 VAPI API: https://dashboard.vapi.ai/api-keys
VAPI_API_KEY="your-vapi-api-key"

# ===========================================
# APP CONFIGURATION
# ===========================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🎯 **Detailed Instructions for Each Key**

### **🗄️ Database Configuration**

#### **DATABASE_URL**
1. **Go to**: [Supabase Dashboard](https://supabase.com/dashboard)
2. **Select**: Your project
3. **Navigate**: Settings → Database
4. **Find**: "Connection string" section
5. **Select**: "URI" format
6. **Copy**: The entire connection string
7. **Paste**: Replace the `DATABASE_URL` value

**Example:**
```
DATABASE_URL="postgresql://postgres:yourpassword123@db.abcdefghijklmnop.supabase.co:5432/postgres"
```

---

### **🔑 Supabase API Keys**

#### **NEXT_PUBLIC_SUPABASE_URL**
1. **Go to**: [Supabase Dashboard](https://supabase.com/dashboard)
2. **Select**: Your project
3. **Navigate**: Settings → API
4. **Find**: "Project URL" section
5. **Copy**: The URL (starts with https://)
6. **Paste**: Replace the `NEXT_PUBLIC_SUPABASE_URL` value

**Example:**
```
NEXT_PUBLIC_SUPABASE_URL="https://abcdefghijklmnop.supabase.co"
```

#### **NEXT_PUBLIC_SUPABASE_ANON_KEY**
1. **Go to**: [Supabase Dashboard](https://supabase.com/dashboard)
2. **Select**: Your project
3. **Navigate**: Settings → API
4. **Find**: "Project API keys" section
5. **Copy**: The "anon public" key (long string starting with "eyJ")
6. **Paste**: Replace the `NEXT_PUBLIC_SUPABASE_ANON_KEY` value

**Example:**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### **SUPABASE_SERVICE_ROLE_KEY**
1. **Go to**: [Supabase Dashboard](https://supabase.com/dashboard)
2. **Select**: Your project
3. **Navigate**: Settings → API
4. **Find**: "Project API keys" section
5. **Copy**: The "service_role" key (long string starting with "eyJ")
6. **Paste**: Replace the `SUPABASE_SERVICE_ROLE_KEY` value

**Example:**
```
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### **🔐 Authentication**

#### **JWT_SECRET**
1. **Open**: Terminal/Command Prompt
2. **Run**: `openssl rand -base64 32`
3. **Copy**: The generated string
4. **Paste**: Replace the `JWT_SECRET` value

**Example:**
```
JWT_SECRET="aBcD1234EfGh5678IjKl9012MnOp3456QrSt7890"
```

---

### **🤖 AI API Keys**

#### **GROQ_API_KEY**
1. **Go to**: [Groq Console](https://console.groq.com/keys)
2. **Sign in**: With your account
3. **Click**: "Create API Key"
4. **Copy**: The generated key
5. **Paste**: Replace the `GROQ_API_KEY` value

#### **GEMINI_API_KEY**
1. **Go to**: [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Sign in**: With your Google account
3. **Click**: "Create API Key"
4. **Copy**: The generated key
5. **Paste**: Replace the `GEMINI_API_KEY` value

#### **OPENAI_API_KEY**
1. **Go to**: [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Sign in**: With your account
3. **Click**: "Create new secret key"
4. **Copy**: The generated key
5. **Paste**: Replace the `OPENAI_API_KEY` value

#### **ELEVENLABS_API_KEY**
1. **Go to**: [ElevenLabs](https://elevenlabs.io/app/settings/api-keys)
2. **Sign in**: With your account
3. **Click**: "Create API Key"
4. **Copy**: The generated key
5. **Paste**: Replace the `ELEVENLABS_API_KEY` value

#### **VAPI_API_KEY**
1. **Go to**: [VAPI Dashboard](https://dashboard.vapi.ai/api-keys)
2. **Sign in**: With your account
3. **Click**: "Create API Key"
4. **Copy**: The generated key
5. **Paste**: Replace the `VAPI_API_KEY` value

---

## ✅ **After Setting Up**

1. **Save** the `.env.local` file
2. **Run**: `npm run migrate:supabase`
3. **Test**: `npm run dev`
4. **Verify**: Visit `http://localhost:3000`

---

## 🆘 **Need Help?**

- **Supabase Issues**: Check [Supabase Docs](https://supabase.com/docs)
- **API Key Problems**: Verify you copied the complete key
- **Connection Issues**: Ensure your DATABASE_URL is correct
- **Migration Errors**: Run `npm run migrate:supabase` again

---

## 🔒 **Security Notes**

- ✅ **Never commit** `.env.local` to git
- ✅ **Keep your keys** private and secure
- ✅ **Use strong passwords** for database
- ✅ **Rotate keys** regularly for security
