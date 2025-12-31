# Large File Setup Guide (500MB ISO)

## Problem
GitHub has a **100MB hard limit** per file. Your 500MB ISO file cannot be pushed directly to GitHub.

## Solutions

### Option 1: Host Externally (RECOMMENDED) ⭐

**Best for:** Production use, multiple users, avoiding GitHub limits

1. **Upload ISO to Cloud Storage:**
   - **Google Drive** (free, 15GB)
   - **Dropbox** (free, 2GB)
   - **AWS S3** (pay-as-you-go)
   - **Cloudflare R2** (free tier available)
   - **GitHub Releases** (up to 2GB per file, but counts toward repo size)

2. **Get a Direct Download Link:**
   - For Google Drive: Use a service like `gdrive-direct-link` or make it publicly accessible
   - For Dropbox: Use direct download links
   - For AWS S3: Make bucket public and use direct URL

3. **Update Component:**
   - Set `WINDOWS_IMAGE_URL` to your external URL
   - Component will load from external source

**Pros:**
- ✅ No GitHub limits
- ✅ Faster downloads (CDN)
- ✅ Doesn't bloat repository
- ✅ Can update without Git commits

**Cons:**
- ❌ Requires external hosting
- ❌ Link might break if file is moved

---

### Option 2: Git LFS (Limited Free Tier)

**Best for:** Small projects, personal use

**Git LFS Free Limits:**
- 1 GB storage per month
- 1 GB bandwidth per month
- Your 500MB file = 50% of free storage

**Setup Steps:**

1. **Install Git LFS:**
   ```bash
   # Windows (with Git for Windows)
   git lfs install
   
   # Or download from: https://git-lfs.github.com/
   ```

2. **Track ISO files:**
   ```bash
   git lfs track "*.iso"
   git lfs track "*.img"
   ```

3. **Add and commit:**
   ```bash
   git add .gitattributes
   git add public/os-images/windows.img
   git commit -m "Add Windows image via Git LFS"
   git push origin main
   ```

**Pros:**
- ✅ Files in Git repository
- ✅ Version controlled

**Cons:**
- ❌ Uses 50% of free storage quota
- ❌ Bandwidth limits (1GB/month)
- ❌ Costs money if exceeded
- ❌ Slower for large files

---

### Option 3: Don't Commit (Development Only)

**Best for:** Local development only

1. **Add to .gitignore:**
   ```
   public/os-images/*.img
   public/os-images/*.iso
   ```

2. **Keep file locally:**
   - File stays on your machine
   - Not in Git repository
   - Users must provide their own image

**Pros:**
- ✅ No GitHub issues
- ✅ No hosting costs

**Cons:**
- ❌ Not available to other developers
- ❌ Must be set up manually on each machine

---

## Recommended Approach

For your KSR Learner website, I recommend **Option 1 (External Hosting)**:

1. Upload ISO to Google Drive or similar
2. Get a direct download link
3. Update component to use external URL
4. Keep repository clean and fast

Would you like me to:
- Update the component to support external URLs?
- Set up Git LFS (if you prefer that route)?
- Create a script to download from external source?

