# 📧 Complete SMTP Setup Guide for Supabase

This guide will walk you through setting up SMTP (email service) for your Supabase project so confirmation emails can be sent.

---

## 🎯 Quick Overview

**What is SMTP?**  
SMTP (Simple Mail Transfer Protocol) is the service that sends emails. Supabase needs SMTP credentials to send confirmation emails.

**Why do I need it?**  
Without SMTP configured, Supabase can't send emails, so users won't receive confirmation emails after signing up.

---

## 🚀 Step-by-Step: Setting Up SMTP in Supabase

### Step 1: Choose an SMTP Provider

You have several options. Here are the most popular:

| Provider | Free Tier | Best For |
|----------|-----------|----------|
| **SendGrid** | 100 emails/day | Most popular, easy setup |
| **Mailgun** | 5,000 emails/month | High volume, reliable |
| **Gmail** | Unlimited* | Personal projects, testing |
| **AWS SES** | 62,000 emails/month** | Production, scalable |
| **Resend** | 3,000 emails/month | Developer-friendly |

*Gmail requires App Password and has daily limits  
**AWS SES has a free tier for first 12 months

---

## 📝 Option 1: SendGrid (Recommended for Beginners)

### A. Create SendGrid Account

1. Go to https://sendgrid.com
2. Click **"Start for free"** or **"Sign Up"**
3. Fill in your details:
   - Email address
   - Password
   - Company name (optional)
4. Verify your email address
5. Complete the onboarding (skip if not needed)

### B. Create API Key in SendGrid

1. In SendGrid dashboard, go to **Settings** → **API Keys**
2. Click **"Create API Key"**
3. Name it: `Supabase Email Service`
4. Select **"Full Access"** or **"Restricted Access"** (with Mail Send permission)
5. Click **"Create & View"**
6. **COPY THE API KEY** (you won't see it again!)
   - It looks like: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### C. Verify Sender Identity

1. In SendGrid, go to **Settings** → **Sender Authentication**
2. Click **"Verify a Single Sender"**
3. Fill in the form:
   - **From Email**: The email that will send confirmations (e.g., `noreply@yourdomain.com`)
   - **From Name**: Display name (e.g., `Your App Name`)
   - **Reply To**: Your support email
   - **Address**: Your business address
   - **City, State, Zip**: Your location
   - **Country**: Your country
4. Click **"Create"**
5. **Check your email** and click the verification link

### D. Configure in Supabase

1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Settings** → **Auth** → **SMTP Settings**
4. Fill in the following:

```
Enable Custom SMTP: ✅ (Turn ON)

SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Password: [Paste your SendGrid API Key here]
Sender Email: [The email you verified in SendGrid]
Sender Name: [Your app name, e.g., "KSR Learner"]
```

5. Click **"Save"** or **"Test Connection"** to verify it works

---

## 📝 Option 2: Mailgun (Best for High Volume)

### A. Create Mailgun Account

1. Go to https://www.mailgun.com
2. Click **"Sign Up"**
3. Fill in your details
4. Verify your email

### B. Add and Verify Domain

1. In Mailgun dashboard, go to **Sending** → **Domains**
2. Click **"Add New Domain"**
3. Enter your domain (or use the sandbox domain for testing)
4. Follow DNS setup instructions (add TXT and MX records)
5. Wait for verification (can take a few minutes)

### C. Get SMTP Credentials

1. In Mailgun, go to **Sending** → **Domain Settings**
2. Click on your domain
3. Go to **"SMTP credentials"** tab
4. Click **"Create SMTP credentials"**
5. Copy:
   - **SMTP Hostname**: `smtp.mailgun.org`
   - **Port**: `587` (TLS) or `465` (SSL)
   - **Username**: (shown in credentials)
   - **Password**: (shown in credentials)

### D. Configure in Supabase

1. Go to **Supabase Dashboard** → **Settings** → **Auth** → **SMTP Settings**
2. Fill in:

```
Enable Custom SMTP: ✅

SMTP Host: smtp.mailgun.org
SMTP Port: 587
SMTP User: [Your Mailgun SMTP username]
SMTP Password: [Your Mailgun SMTP password]
Sender Email: [Your verified domain email, e.g., noreply@yourdomain.com]
Sender Name: [Your app name]
```

3. Click **"Save"**

---

## 📝 Option 3: Gmail (For Testing/Personal Projects)

### A. Enable 2-Factor Authentication

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** (required for App Passwords)

### B. Create App Password

1. Go to https://myaccount.google.com/apppasswords
2. Select **"Mail"** and **"Other (Custom name)"**
3. Name it: `Supabase`
4. Click **"Generate"**
5. **COPY THE 16-CHARACTER PASSWORD** (spaces don't matter)

### C. Configure in Supabase

1. Go to **Supabase Dashboard** → **Settings** → **Auth** → **SMTP Settings**
2. Fill in:

```
Enable Custom SMTP: ✅

SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: [Your Gmail address, e.g., yourname@gmail.com]
SMTP Password: [The 16-character App Password you generated]
Sender Email: [Your Gmail address]
Sender Name: [Your app name]
```

3. Click **"Save"**

**Note**: Gmail has daily sending limits (~500 emails/day for free accounts)

---

## 📝 Option 4: Resend (Developer-Friendly)

### A. Create Resend Account

1. Go to https://resend.com
2. Click **"Sign Up"**
3. Verify your email

### B. Get API Key

1. In Resend dashboard, go to **API Keys**
2. Click **"Create API Key"**
3. Name it: `Supabase`
4. Copy the API key (starts with `re_`)

### C. Add Domain (Optional but Recommended)

1. Go to **Domains**
2. Click **"Add Domain"**
3. Follow DNS setup instructions
4. Verify domain

### D. Configure in Supabase

1. Go to **Supabase Dashboard** → **Settings** → **Auth** → **SMTP Settings**
2. Fill in:

```
Enable Custom SMTP: ✅

SMTP Host: smtp.resend.com
SMTP Port: 587
SMTP User: resend
SMTP Password: [Your Resend API key]
Sender Email: [Your verified domain email or onboarding@resend.dev for testing]
Sender Name: [Your app name]
```

3. Click **"Save"**

---

## ✅ Testing Your SMTP Configuration

### Method 1: Test in Supabase

1. In Supabase **SMTP Settings**, click **"Test Connection"** or **"Send Test Email"**
2. Enter a test email address
3. Check if the test email arrives

### Method 2: Test with Real Signup

1. Go to your website's signup page
2. Create a new account with a real email
3. Check your inbox (and spam folder)
4. You should receive the confirmation email

### Method 3: Check Supabase Logs

1. Go to **Logs** → **Auth Logs** in Supabase
2. Look for signup attempts
3. Check for email sending errors

---

## 🔍 Troubleshooting

### Problem: "SMTP connection failed"

**Solutions:**
- ✅ Double-check SMTP host and port
- ✅ Verify username/password are correct
- ✅ Check if your SMTP provider requires IP whitelisting
- ✅ Try port `465` (SSL) instead of `587` (TLS) or vice versa

### Problem: "Authentication failed"

**Solutions:**
- ✅ Verify username/password are correct
- ✅ For Gmail: Make sure you're using App Password, not regular password
- ✅ For SendGrid: Make sure you're using API key, not account password
- ✅ Check if 2FA is enabled (required for Gmail App Passwords)

### Problem: "Emails sent but not received"

**Solutions:**
- ✅ Check spam/junk folder
- ✅ Verify sender email is correct
- ✅ Check if your SMTP provider has rate limits
- ✅ Verify sender email is verified/authenticated in your SMTP provider

### Problem: "Rate limit exceeded"

**Solutions:**
- ✅ Check your SMTP provider's free tier limits
- ✅ Wait for the limit to reset (usually daily)
- ✅ Upgrade to a paid plan if needed
- ✅ Use a different SMTP provider with higher limits

---

## 🎯 Recommended Setup for Production

For a production website, I recommend:

1. **Use a custom domain email** (e.g., `noreply@yourdomain.com`)
2. **Use SendGrid or Mailgun** (reliable, good free tiers)
3. **Verify your domain** in the SMTP provider
4. **Set up SPF and DKIM records** (improves email deliverability)
5. **Monitor email logs** in Supabase

---

## 📚 Additional Resources

- **SendGrid Documentation**: https://docs.sendgrid.com
- **Mailgun Documentation**: https://documentation.mailgun.com
- **Supabase Auth Docs**: https://supabase.com/docs/guides/auth/auth-smtp
- **Resend Documentation**: https://resend.com/docs

---

## 🆘 Need Help?

If you're still having issues:

1. Check **Supabase Auth Logs** for specific error messages
2. Check your **SMTP provider's dashboard** for sending logs
3. Verify all credentials are correct
4. Try a different SMTP provider to isolate the issue

---

**Quick Checklist:**
- [ ] SMTP provider account created
- [ ] Sender email verified/authenticated
- [ ] SMTP credentials obtained (host, port, user, password)
- [ ] Configured in Supabase SMTP Settings
- [ ] Test email sent successfully
- [ ] Real signup test completed

Good luck! 🚀

