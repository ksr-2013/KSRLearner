# 📧 Supabase Email Configuration Guide

## Problem: Confirmation Emails Not Being Sent

If users are seeing "Please check your email to confirm your account" but no emails are arriving, this is because **Supabase email service needs to be configured**.

## 🔧 Solution: Configure Supabase Email Settings

You have **two options**:

### Option 1: Disable Email Confirmation (Quick Fix)

If you don't need email confirmation, you can disable it:

1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** → **Settings** (or **Settings** → **Auth**)
4. Find **"Enable email confirmations"** or **"Confirm email"**
5. **Turn it OFF** (disable it)
6. Save changes

**Result**: Users will be automatically logged in after signup, no email confirmation needed.

---

### Option 2: Configure Email Service (Recommended for Production)

To actually send confirmation emails, you need to configure SMTP:

1. Go to your **Supabase Dashboard**
2. Select your project
3. Navigate to **Settings** → **Auth** → **Email Templates** (or **Settings** → **SMTP Settings**)
4. Configure one of these options:

#### Option A: Use Supabase's Built-in Email (Limited)

- Supabase provides a basic email service with **limited daily emails** (usually 3-4 per day on free tier)
- This is fine for development/testing
- No configuration needed, but emails may be delayed or limited

#### Option B: Configure Custom SMTP (Production)

For production, configure your own SMTP server:

1. In Supabase Dashboard, go to **Settings** → **Auth** → **SMTP Settings**
2. Enter your SMTP provider details:
   - **SMTP Host**: (e.g., `smtp.gmail.com`, `smtp.sendgrid.net`)
   - **SMTP Port**: (usually `587` for TLS or `465` for SSL)
   - **SMTP User**: Your email address
   - **SMTP Password**: Your email app password or SMTP key
   - **Sender Email**: The email address that will send confirmations
   - **Sender Name**: Display name for emails

**Popular SMTP Providers:**
- **SendGrid**: Free tier (100 emails/day)
- **Mailgun**: Free tier (5,000 emails/month)
- **Gmail**: Use App Password (requires 2FA)
- **AWS SES**: Very cheap, pay-as-you-go

3. Test the configuration
4. Save settings

---

## 🧪 Testing Email Configuration

After configuring, test by:

1. Signing up with a new email address
2. Check your inbox (and spam folder)
3. If email arrives, click the confirmation link
4. You should be redirected back to your site and logged in

---

## 🔍 Troubleshooting

### Emails Still Not Arriving?

1. **Check Spam Folder**: Emails might be filtered as spam
2. **Check Supabase Logs**: 
   - Go to **Logs** → **Auth Logs** in Supabase Dashboard
   - Look for email sending errors
3. **Verify SMTP Settings**: Double-check all SMTP credentials
4. **Check Rate Limits**: Free tier SMTP services have daily limits
5. **Test with Different Email**: Try a different email provider (Gmail, Outlook, etc.)

### Alternative: Use Magic Link Instead

If email confirmation is problematic, consider using **Magic Link** authentication:
- Users enter email
- Receive a magic link (no password needed)
- Click link to sign in
- More reliable than password + email confirmation

---

## 📝 Current Status

**Your current setup:**
- Email confirmation is **ENABLED** in Supabase
- SMTP is likely **NOT CONFIGURED**
- Result: Emails are not being sent

**Quick fix**: Disable email confirmation in Supabase settings (Option 1 above)

**Production fix**: Configure SMTP with a service like SendGrid or Mailgun (Option 2 above)

