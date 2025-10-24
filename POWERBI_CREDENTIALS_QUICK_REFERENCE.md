# Power BI Credentials Quick Reference

## 🔑 Where to Find Each Credential

### 1. POWERBI_CLIENT_ID
**Location**: Azure Portal → App Registrations → Your App
**Field**: Application (client) ID
**Example**: `12345678-1234-1234-1234-123456789abc`

### 2. POWERBI_TENANT_ID  
**Location**: Azure Portal → App Registrations → Your App
**Field**: Directory (tenant) ID
**Example**: `87654321-4321-4321-4321-cba987654321`

### 3. POWERBI_CLIENT_SECRET
**Location**: Azure Portal → App Registrations → Certificates & secrets
**Action**: Create new client secret
**Example**: `ABC123~def456ghi789jkl012mno345pqr678`

### 4. POWERBI_WORKSPACE_ID / POWERBI_GROUP_ID
**Location**: Power BI Portal → Workspace URL
**URL Pattern**: `https://app.powerbi.com/groups/{WORKSPACE_ID}/...`
**Example**: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

### 5. POWERBI_REPORT_ID
**Location**: Power BI Portal → Report URL  
**URL Pattern**: `https://app.powerbi.com/groups/{GROUP_ID}/reports/{REPORT_ID}/...`
**Example**: `x9y8z7w6-v5u4-t3s2-r1q0-p9o8n7m6l5k4`

---

## 📋 Quick Setup Checklist

### Azure Portal (portal.azure.com)
- [ ] Create App Registration
- [ ] Get Client ID
- [ ] Get Tenant ID  
- [ ] Create Client Secret
- [ ] Configure API Permissions
- [ ] Grant Admin Consent

### Power BI Portal (app.powerbi.com)
- [ ] Create Workspace
- [ ] Get Workspace ID from URL
- [ ] Create Sample Report
- [ ] Get Report ID from URL
- [ ] Publish Report

### Environment Variables
```env
POWERBI_WORKSPACE_ID=a1b2c3d4-e5f6-7890-abcd-ef1234567890
POWERBI_REPORT_ID=x9y8z7w6-v5u4-t3s2-r1q0-p9o8n7m6l5k4
POWERBI_GROUP_ID=a1b2c3d4-e5f6-7890-abcd-ef1234567890
POWERBI_CLIENT_ID=12345678-1234-1234-1234-123456789abc
POWERBI_CLIENT_SECRET=ABC123~def456ghi789jkl012mno345pqr678
POWERBI_TENANT_ID=87654321-4321-4321-4321-cba987654321
```

---

## 🚀 Quick Start URLs

- **Azure Portal**: https://portal.azure.com
- **Power BI Portal**: https://app.powerbi.com
- **Your Setup Page**: `/powerbi-setup`
- **Your Dashboard**: `/dashboard`

---

## ⚡ Fast Track (5 Minutes)

1. **Azure Portal** → App Registrations → New Registration
2. **Copy Client ID & Tenant ID** from overview page
3. **Create Client Secret** in Certificates & secrets
4. **Power BI Portal** → Create Workspace
5. **Copy Workspace ID** from URL
6. **Create Report** → Copy Report ID from URL
7. **Add to .env.local** → Test connection

---

## 🔍 ID Locations Summary

| Credential | Where to Find | What to Look For |
|------------|---------------|------------------|
| Client ID | Azure Portal → App Registration | Application (client) ID |
| Tenant ID | Azure Portal → App Registration | Directory (tenant) ID |
| Client Secret | Azure Portal → Certificates & secrets | New client secret value |
| Workspace ID | Power BI → Workspace URL | `/groups/{WORKSPACE_ID}/` |
| Group ID | Same as Workspace ID | Same as Workspace ID |
| Report ID | Power BI → Report URL | `/reports/{REPORT_ID}/` |

---

## 🧪 Test Your Setup

1. Go to `/powerbi-setup`
2. Click "Test Power BI Connection"
3. Check if all credentials are loaded
4. Verify connection success
5. Visit `/dashboard` to see Power BI analytics

---

## 🆘 Need Help?

- **Setup Guide**: See `POWERBI_SETUP_GUIDE.md` for detailed steps
- **Test Connection**: Use the setup page to diagnose issues
- **Power BI Docs**: https://docs.microsoft.com/power-bi/
- **Azure AD Docs**: https://docs.microsoft.com/azure/active-directory/
