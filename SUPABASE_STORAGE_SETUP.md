# Supabase Storage Setup for Windows OS Images

## Overview
Store your 500MB Windows ISO/IMG file in Supabase Storage instead of GitHub or external hosting.

## Benefits
- ✅ No GitHub file size limits
- ✅ Integrated with your existing Supabase setup
- ✅ Secure and scalable
- ✅ Free tier: 1GB storage, 2GB bandwidth/month
- ✅ CDN-backed for fast downloads

## Setup Steps

### Step 1: Create Storage Bucket in Supabase

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to **Storage** in the left sidebar
4. Click **New bucket**
5. Configure:
   - **Name**: `os-images`
   - **Public bucket**: ✅ **Enable** (so files can be accessed via URL)
   - **File size limit**: `500 MB` (or higher if needed)
   - **Allowed MIME types**: Leave empty or add: `application/octet-stream`, `application/x-iso9660-image`
6. Click **Create bucket**

### Step 2: Upload Your Windows Image

#### Option A: Via Supabase Dashboard (Easiest)

1. In Supabase Dashboard → **Storage** → `os-images` bucket
2. Click **Upload file**
3. Select your `windows.img` or `windows.iso` file
4. Wait for upload to complete
5. Click on the uploaded file
6. Copy the **Public URL** (looks like: `https://[project].supabase.co/storage/v1/object/public/os-images/windows.img`)

#### Option B: Via Code (Programmatic Upload)

Create an upload page or use the utility function:

```typescript
import { uploadOSImage } from '@/lib/supabaseStorage'

// In a file input handler
const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0]
  if (!file) return

  try {
    const publicUrl = await uploadOSImage(file, 'os-images')
    console.log('File uploaded! URL:', publicUrl)
    // Save this URL to use in your component
  } catch (error) {
    console.error('Upload failed:', error)
  }
}
```

### Step 3: Configure Component

Update `components/V86WindowsEmulator.tsx`:

```typescript
// Option 3: Supabase Storage URL
const WINDOWS_IMAGE_SUPABASE = 'https://[your-project].supabase.co/storage/v1/object/public/os-images/windows.img';
```

Or set it dynamically:

```typescript
const WINDOWS_IMAGE_SUPABASE = process.env.NEXT_PUBLIC_WINDOWS_IMAGE_URL || '';
```

Then add to your `.env.local`:
```
NEXT_PUBLIC_WINDOWS_IMAGE_URL=https://[your-project].supabase.co/storage/v1/object/public/os-images/windows.img
```

### Step 4: Update Component Configuration

The component already supports external URLs. Just set:

```typescript
const WINDOWS_IMAGE_EXTERNAL = 'YOUR_SUPABASE_STORAGE_URL';
```

## Storage Limits

### Free Tier
- **Storage**: 1 GB
- **Bandwidth**: 2 GB/month
- **File size limit**: 50 MB per file (can be increased)

### Paid Plans
- **Pro**: $25/month - 100 GB storage, 200 GB bandwidth
- **Team**: $599/month - 500 GB storage, 1 TB bandwidth

**Note**: Your 500MB file exceeds the free tier's 50MB per-file limit. You'll need to:
1. Contact Supabase support to increase file size limit, OR
2. Upgrade to a paid plan

## Alternative: Split File Approach

If you need to stay on free tier, you could:
1. Split the 500MB file into chunks (< 50MB each)
2. Upload chunks separately
3. Reassemble on client side (more complex)

## Security Considerations

### Public Bucket (Recommended for this use case)
- ✅ Files accessible via public URL
- ✅ No authentication required
- ✅ Fast and simple
- ⚠️ Anyone with URL can download

### Private Bucket (More secure)
- ✅ Requires authentication
- ✅ Better for sensitive files
- ❌ More complex (need signed URLs)
- ❌ Slower (requires auth check)

For Windows OS images, **public bucket is fine** since they're meant to be downloaded.

## Troubleshooting

### "File size exceeds limit"
- Free tier has 50MB per-file limit
- Upgrade plan or contact support

### "Bucket not found"
- Make sure bucket name is exactly `os-images`
- Check bucket exists in Supabase Dashboard

### "Permission denied"
- Ensure bucket is set to **Public**
- Check RLS (Row Level Security) policies if using private bucket

### "Upload failed"
- Check file size
- Verify network connection
- Check Supabase project status

## Next Steps

1. ✅ Create `os-images` bucket in Supabase
2. ✅ Upload your Windows image file
3. ✅ Copy the public URL
4. ✅ Update component with Supabase URL
5. ✅ Test the emulator

## Example: Complete Setup

```typescript
// In V86WindowsEmulator.tsx
const WINDOWS_IMAGE_EXTERNAL = 'https://abcdefghijklmnop.supabase.co/storage/v1/object/public/os-images/windows.img';
```

The component will automatically use this URL instead of local file.

