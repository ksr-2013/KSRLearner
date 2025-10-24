# Microsoft Power BI Setup Guide

This guide will walk you through obtaining all the necessary credentials for Power BI integration with your KSRLearner website.

## 🔑 Required Credentials

You'll need these 6 environment variables:
- `POWERBI_WORKSPACE_ID`
- `POWERBI_REPORT_ID` 
- `POWERBI_GROUP_ID`
- `POWERBI_CLIENT_ID`
- `POWERBI_CLIENT_SECRET`
- `POWERBI_TENANT_ID`

---

## 📋 Step-by-Step Setup

### Step 1: Create Azure App Registration

1. **Go to Azure Portal**
   - Visit: https://portal.azure.com
   - Sign in with your Microsoft account

2. **Navigate to App Registrations**
   - Search for "App registrations" in the search bar
   - Click "New registration"

3. **Register Your Application**
   - **Name**: `KSRLearner Power BI Integration`
   - **Supported account types**: `Accounts in this organizational directory only`
   - **Redirect URI**: Leave blank for now
   - Click "Register"

4. **Get Your Credentials**
   - **Application (client) ID** → This is your `POWERBI_CLIENT_ID`
   - **Directory (tenant) ID** → This is your `POWERBI_TENANT_ID`

### Step 2: Create Client Secret

1. **In your App Registration page**
   - Go to "Certificates & secrets"
   - Click "New client secret"
   - **Description**: `KSRLearner Power BI Secret`
   - **Expires**: Choose 24 months (recommended)
   - Click "Add"

2. **Copy the Secret Value**
   - ⚠️ **IMPORTANT**: Copy the secret value immediately (you won't see it again)
   - This is your `POWERBI_CLIENT_SECRET`

### Step 3: Configure API Permissions

1. **Go to "API permissions"**
   - Click "Add a permission"
   - Select "Power BI Service"
   - Choose "Application permissions"
   - Select these permissions:
     - `Report.Read.All`
     - `Dataset.Read.All`
     - `Workspace.Read.All`
   - Click "Add permissions"

2. **Grant Admin Consent**
   - Click "Grant admin consent for [Your Organization]"
   - Confirm the action

### Step 4: Create Power BI Workspace

1. **Go to Power BI Portal**
   - Visit: https://app.powerbi.com
   - Sign in with your Microsoft account

2. **Create a New Workspace**
   - Click "Workspaces" → "Create workspace"
   - **Workspace name**: `KSRLearner Analytics`
   - **Description**: `Analytics workspace for KSRLearner platform`
   - Click "Save"

3. **Get Workspace ID**
   - In your workspace, look at the URL: `https://app.powerbi.com/groups/{WORKSPACE_ID}/...`
   - The `{WORKSPACE_ID}` is your `POWERBI_GROUP_ID` and `POWERBI_WORKSPACE_ID`

### Step 5: Create a Sample Report

1. **In your Power BI workspace**
   - Click "Create" → "Report"
   - Choose "Start from scratch"

2. **Add Sample Data**
   - Click "Get data" → "Excel workbook"
   - Upload a sample Excel file with learning data, or use Power BI's sample datasets

3. **Publish the Report**
   - Click "File" → "Save as"
   - Name it "KSRLearner Analytics"
   - Click "Save"

4. **Get Report ID**
   - In the report, look at the URL: `https://app.powerbi.com/groups/{GROUP_ID}/reports/{REPORT_ID}/...`
   - The `{REPORT_ID}` is your `POWERBI_REPORT_ID`

### Step 6: Configure App Permissions in Power BI

1. **In Power BI Admin Portal**
   - Go to "Settings" → "Admin portal"
   - Navigate to "Developer settings"
   - Add your App Registration:
     - **App ID**: Your `POWERBI_CLIENT_ID`
     - **App name**: `KSRLearner Power BI Integration`
     - **Access level**: `Read`

---

## 🔧 Environment Variables Setup

Add these to your `.env.local` file:

```env
# Power BI Configuration
POWERBI_WORKSPACE_ID=your-workspace-id-here
POWERBI_REPORT_ID=your-report-id-here
POWERBI_GROUP_ID=your-group-id-here
POWERBI_CLIENT_ID=your-client-id-here
POWERBI_CLIENT_SECRET=your-client-secret-here
POWERBI_TENANT_ID=your-tenant-id-here
```

---

## 🧪 Testing Your Setup

1. **Visit the Setup Page**
   - Go to `/powerbi-setup` on your website
   - Click "Test Power BI Connection"

2. **Check Configuration**
   - Verify all credentials are loaded
   - Test the connection

3. **View Dashboard**
   - Go to `/dashboard`
   - Check if Power BI section shows your data

---

## 🔍 Finding Your IDs

### Workspace ID / Group ID
- URL: `https://app.powerbi.com/groups/{WORKSPACE_ID}/...`
- Or: Go to workspace → Settings → Workspace ID

### Report ID
- URL: `https://app.powerbi.com/groups/{GROUP_ID}/reports/{REPORT_ID}/...`
- Or: In report → File → Embed report → Report ID

### Client ID / Tenant ID
- Azure Portal → App registrations → Your app
- **Application (client) ID** = Client ID
- **Directory (tenant) ID** = Tenant ID

### Client Secret
- Azure Portal → App registrations → Certificates & secrets
- Create new client secret and copy the value

---

## 🚨 Troubleshooting

### Common Issues:

1. **"Invalid client" error**
   - Check your Client ID and Tenant ID
   - Ensure app registration is correct

2. **"Insufficient privileges" error**
   - Grant admin consent for API permissions
   - Check Power BI admin portal settings

3. **"Report not found" error**
   - Verify Report ID and Group ID
   - Ensure report is published and accessible

4. **"Access denied" error**
   - Check workspace permissions
   - Verify app has access to the workspace

### Getting Help:
- Power BI Documentation: https://docs.microsoft.com/power-bi/
- Azure AD Documentation: https://docs.microsoft.com/azure/active-directory/
- Power BI Community: https://community.powerbi.com/

---

## 📞 Support

If you need help with any step:
1. Check the troubleshooting section above
2. Visit the Power BI setup page at `/powerbi-setup`
3. Use the "Test Connection" feature to diagnose issues

---

## ✅ Checklist

- [ ] Azure App Registration created
- [ ] Client ID and Tenant ID obtained
- [ ] Client Secret created and copied
- [ ] API permissions configured
- [ ] Admin consent granted
- [ ] Power BI workspace created
- [ ] Workspace ID obtained
- [ ] Sample report created
- [ ] Report ID obtained
- [ ] Environment variables added to `.env.local`
- [ ] Connection tested successfully
- [ ] Dashboard shows Power BI data

Once all items are checked, your Power BI integration should be fully functional! 🎉
