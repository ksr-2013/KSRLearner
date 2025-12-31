# v86 Repository Setup Guide

## Step 1: Download/Clone the v86 Repository

Download or clone the v86 repository from GitHub:
```bash
git clone https://github.com/copy/v86.git
```

## Step 2: Place the Repository

Place the entire `v86` folder in one of these locations:

### Option A: Inside `public` folder (Recommended for web assets)
```
public/v86/
```

### Option B: In a vendor/libs folder (if you want it outside public)
```
vendor/v86/
```
or
```
libs/v86/
```

## Step 3: Required Files Structure

After placing the repository, you should have these files:

```
public/v86/  (or vendor/v86/)
├── build/
│   ├── libv86.js          ← Main library file
│   ├── libv86-debug.js     ← Debug version (optional)
│   ├── v86.wasm            ← WebAssembly binary
│   ├── v86-debug.wasm      ← Debug WASM (optional)
│   └── v86-fallback.wasm   ← Fallback WASM
├── bios/
│   ├── seabios.bin         ← BIOS file
│   └── vgabios.bin         ← VGA BIOS file
└── ... (other files)
```

## Step 4: Update Component Paths

After you place the repository, tell me which location you chose, and I'll update the component to use the correct paths.

## Step 5: Build the Repository (Optional)

If you want to build from source:

1. Install dependencies:
   ```bash
   cd public/v86  # or vendor/v86
   ```

2. Build (requires Rust, make, etc.):
   ```bash
   make all
   ```

   Or use the pre-built files from the repository.

## What Files We'll Use

From the v86 repository, we need:
- `build/libv86.js` - Main JavaScript library
- `build/v86.wasm` - WebAssembly binary
- `build/v86-fallback.wasm` - Fallback WASM
- `bios/seabios.bin` - BIOS file
- `bios/vgabios.bin` - VGA BIOS file

## Next Steps

1. Download/clone the repository
2. Place it in your chosen location
3. Tell me the location (e.g., "I placed it in public/v86")
4. I'll update the component paths automatically

