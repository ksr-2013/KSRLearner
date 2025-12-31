# Google Drive Setup for Windows OS Image

## ✅ Configuration Complete!

Your Google Drive URL has been added to `.env.local`:

```
NEXT_PUBLIC_WINDOWS_IMAGE_URL=https://drive.google.com/uc?export=download&id=1ATHOmgOr5Rgm7lIJP8ny_DHHzs8HH_Bd
```

## 🔄 Next Steps (IMPORTANT!)

### 1. Restart Your Dev Server

**Environment variables are only loaded when Next.js starts!**

1. **Stop** your current dev server (press `Ctrl+C` in the terminal)
2. **Start** it again:
   ```bash
   npm run dev
   ```
3. **Hard refresh** your browser (Ctrl+Shift+R or Cmd+Shift+R)

### 2. Verify Google Drive File Sharing

Make sure your Google Drive file is set to:
- ✅ **"Anyone with the link"** can view
- ✅ Sharing permissions: **Viewer** (not "Editor")

To check:
1. Go to Google Drive
2. Right-click your file → **Share**
3. Make sure it says "Anyone with the link"
4. If not, click "Change" → "Anyone with the link" → "Viewer" → "Done"

### 3. Test the URL

You can test if the direct download URL works by opening it in your browser:
```
https://drive.google.com/uc?export=download&id=1ATHOmgOr5Rgm7lIJP8ny_DHHzs8HH_Bd
```

If it downloads the file, it's working! ✅

## 🐛 Troubleshooting

### Issue: Still seeing "Windows image not found" error

**Solution:**
1. ✅ Make sure you **restarted** the dev server
2. ✅ Check `.env.local` has the correct URL
3. ✅ Verify the file is shared publicly on Google Drive
4. ✅ Try opening the direct download URL in a new tab to test

### Issue: Google Drive shows "Virus scan warning"

**Solution:**
- This is normal for large files
- Click "Download anyway" when testing
- The emulator should handle this automatically

### Issue: CORS errors in browser console

**Solution:**
- Google Drive may block direct downloads from browsers
- Alternative: Use a service like `gdrive-direct-link` or host on a different service
- Or use Supabase Storage instead (see `SUPABASE_STORAGE_SETUP.md`)

## 📝 How It Works

1. Component reads `NEXT_PUBLIC_WINDOWS_IMAGE_URL` from environment
2. If set, uses Google Drive URL
3. If empty, falls back to local `/os-images/windows.img`
4. v86 emulator loads the image from the URL

## ✅ Success Indicators

When working correctly, you should see:
- ✅ "Checking Windows image..." status
- ✅ "Creating emulator..." status  
- ✅ "Loading: X%" progress bar
- ✅ Emulator screen appears

If you see errors, check the browser console (F12) for detailed error messages.

