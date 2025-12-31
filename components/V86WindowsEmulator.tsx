'use client'

import { useState, useEffect, useRef } from 'react';

// v86 types are declared in types/v86.d.ts

interface V86WindowsEmulatorProps {
  onLoad?: () => void;
}

// ============================================
// CONFIGURATION: Update these paths after placing v86 repository
// ============================================
// If you placed v86 in public/v86, use: '/v86/build/libv86.js'
// If you placed v86 in vendor/v86, use: '/vendor/v86/build/libv86.js'
// Leave empty to use current setup: '/libv86.js'
// Using the v86 repo placed in public/v86
const V86_LIB_PATH = '/v86/build/libv86.js'; // Main v86 library
const V86_WASM_PATH = '/v86/build/v86.wasm'; // WASM from repo build folder
const V86_BIOS_PATH = '/v86/bios'; // Local BIOS files from repo
const USE_LOCAL_BIOS = true; // Always prefer local BIOS when repo is present

// Windows Image Configuration
// Option 1: Local file (for development) - must be in public/os-images/
const WINDOWS_IMAGE_LOCAL = '/os-images/windows.img';
// Option 2: External URL (for production) - set this to your hosted ISO/IMG file
// Example: 'https://your-domain.com/files/windows95.img'
// Example: 'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID'
// Option 3: Supabase Storage URL (RECOMMENDED for database storage)
// Example: 'https://[project].supabase.co/storage/v1/object/public/os-images/windows.img'
// Get this URL from Supabase Dashboard → Storage → os-images bucket → file → Public URL
const WINDOWS_IMAGE_EXTERNAL = process.env.NEXT_PUBLIC_WINDOWS_IMAGE_URL || ''; // Leave empty to use local file
// ============================================

export default function V86WindowsEmulator({ onLoad }: V86WindowsEmulatorProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing...');
  const emulatorContainerRef = useRef<HTMLDivElement>(null);
  const emulatorRef = useRef<any>(null);
  const libv86LoadedRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    async function loadV86() {
      try {
        // Load libv86.js if not already loaded
        if (!libv86LoadedRef.current && typeof window !== 'undefined' && !window.V86Starter && !window.V86) {
          setStatus('Loading v86 library...');
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = V86_LIB_PATH;
            script.onload = () => {
              // Wait a bit for V86Starter or V86 to be available
              let attempts = 0;
              const checkV86 = setInterval(() => {
                attempts++;
                if (window.V86Starter || window.V86 || attempts > 50) {
                  clearInterval(checkV86);
                  if (window.V86Starter || window.V86) {
                    libv86LoadedRef.current = true;
                    resolve();
                  } else {
                    reject(new Error('V86Starter/V86 not found after loading libv86.js'));
                  }
                }
              }, 100);
            };
            script.onerror = () => reject(new Error('Failed to load libv86.js'));
            document.head.appendChild(script);
          });
        }

        if (!mounted) return;

        const V86Constructor = window.V86Starter || window.V86;
        if (!V86Constructor) {
          throw new Error('V86Starter/V86 not available. Make sure libv86.js is loaded correctly.');
        }

        if (!emulatorContainerRef.current) {
          throw new Error('Emulator container not found');
        }

        // v86 requires specific DOM structure: a div for text mode and a canvas for graphical mode
        // Check if structure exists, if not create it
        const container = emulatorContainerRef.current;
        let textDiv = container.querySelector('div');
        let canvas = container.querySelector('canvas');

        if (!textDiv) {
          textDiv = document.createElement('div');
          textDiv.style.whiteSpace = 'pre';
          textDiv.style.font = '14px monospace';
          textDiv.style.lineHeight = '14px';
          container.appendChild(textDiv);
        }

        if (!canvas) {
          canvas = document.createElement('canvas');
          canvas.style.display = 'none';
          container.appendChild(canvas);
        }

        setStatus('Checking Windows image...');
        
        // Determine which image source to use
        const windowsImagePath = WINDOWS_IMAGE_EXTERNAL || WINDOWS_IMAGE_LOCAL;
        const isExternalUrl = !!WINDOWS_IMAGE_EXTERNAL;
        
        // Check if Windows image exists (only for local files)
        if (!isExternalUrl) {
          try {
            const response = await fetch(windowsImagePath, { method: 'HEAD' });
            if (!response.ok) {
              throw new Error(`Windows image not found at ${windowsImagePath}`);
            }
          } catch (err) {
            setError(`Windows image not found. Please place a Windows 95/98 disk image at ${windowsImagePath} or configure WINDOWS_IMAGE_EXTERNAL with an external URL.`);
            setLoading(false);
            return;
          }
        }

        if (!mounted) return;

        setStatus('Creating emulator...');
        
        // Create v86 emulator instance
        const biosUrl = USE_LOCAL_BIOS ? `${V86_BIOS_PATH}/seabios.bin` : 'https://cdn.jsdelivr.net/gh/copy/v86@master/bios/seabios.bin';
        const vgaBiosUrl = USE_LOCAL_BIOS ? `${V86_BIOS_PATH}/vgabios.bin` : 'https://cdn.jsdelivr.net/gh/copy/v86@master/bios/vgabios.bin';
        
        const emulator = new V86Constructor({
          wasm_path: V86_WASM_PATH,
          memory_size: 128 * 1024 * 1024, // 128MB
          vga_memory_size: 8 * 1024 * 1024, // 8MB for VGA
          screen_container: emulatorContainerRef.current,
          bios: {
            url: biosUrl,
          },
          vga_bios: {
            url: vgaBiosUrl,
          },
          hda: {
            url: windowsImagePath,
            async: true,
          },
          boot_order: 0x3, // Boot from hard disk (0x1=floppy, 0x2=hard disk, 0x3=both)
          autostart: true,
        });

        emulatorRef.current = emulator;

        // Track loading progress
        emulator.add_listener('download-progress', (progress: any) => {
          if (mounted && progress.lengthComputable) {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setProgress(percent);
            setStatus(`Loading: ${percent}%`);
          }
        });

        // Handle emulator ready
        emulator.add_listener('emulator-ready', () => {
          if (mounted) {
            setStatus('Emulator ready, booting Windows...');
            setProgress(100);
          }
        });

        // Handle boot complete
        emulator.add_listener('screen-put-char', () => {
          if (mounted && loading) {
            setTimeout(() => {
              if (mounted) {
                setLoading(false);
                setStatus('Windows is running');
                onLoad?.();
              }
            }, 3000);
          }
        });

        // Handle errors
        emulator.add_listener('emulator-error', (err: any) => {
          if (mounted) {
            setError(`Emulator error: ${err}`);
            setLoading(false);
          }
        });

      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Failed to initialize v86 emulator');
          setLoading(false);
        }
      }
    }

    loadV86();

    return () => {
      mounted = false;
      if (emulatorRef.current) {
        try {
          emulatorRef.current.destroy();
        } catch (err) {
          console.error('Error destroying emulator:', err);
        }
      }
    };
  }, [onLoad]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#000' }}>
      {loading && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.9)',
          zIndex: 10,
          color: '#fff',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{status}</div>
          {progress > 0 && (
            <div style={{ width: 300, height: 8, background: '#333', borderRadius: 4, overflow: 'hidden', marginTop: 16 }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #0078d4, #005a9e)',
                transition: 'width 0.3s',
              }} />
            </div>
          )}
          <div style={{ fontSize: 12, color: '#a0a0a0', marginTop: 8 }}>{progress > 0 ? `${progress}%` : 'Please wait...'}</div>
        </div>
      )}
      
      {error && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.9)',
          zIndex: 10,
          color: '#ff4444',
          padding: 20,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Error</div>
          <div style={{ fontSize: 14, color: '#ff8888', maxWidth: 600 }}>{error}</div>
          <div style={{ fontSize: 12, color: '#aaa', marginTop: 16 }}>
            You can download Windows 95/98 disk images from various sources online.
            Place the image file at <code style={{ background: '#333', padding: '2px 6px', borderRadius: 3 }}>public/os-images/windows.img</code>
          </div>
        </div>
      )}

      <div
        ref={emulatorContainerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          background: '#000',
        }}
      />
    </div>
  );
}

