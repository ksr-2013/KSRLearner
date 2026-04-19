'use client'

import { useState, useEffect, useRef } from 'react';

// v86 types are declared in types/v86.d.ts

import { OSOption } from '../data/os-images';

interface V86WindowsEmulatorProps {
  onLoad?: () => void;
  onClose?: () => void;
  config?: OSOption;
}

// ============================================
// CONFIGURATION: Update these paths after placing v86 repository
// ============================================
// If you placed v86 in public/v86, use: '/v86/build/libv86.js'
// If you placed v86 in vendor/v86, use: '/vendor/v86/build/libv86.js'
// Leave empty to use current setup: '/libv86.js'
// Paths to v86 files
const V86_LIB_PATH = '/v86/libv86.js';
const V86_WASM_PATH = '/v86/v86.wasm';
// The bios files are now stored directly in public/v86/bios
const V86_BIOS_PATH = '/v86/bios';
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

export default function V86WindowsEmulator({ onLoad, onClose, config }: V86WindowsEmulatorProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing...');
  const [scale, setScale] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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
            script.crossOrigin = 'anonymous';
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
          textDiv.className = 'v86-text-layer';
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
        const windowsImagePath = config?.url || WINDOWS_IMAGE_EXTERNAL || WINDOWS_IMAGE_LOCAL;
        const isExternalUrl = config?.isExternal || windowsImagePath.startsWith('http');

        // Check if Windows image exists (only for local files)
        if (!isExternalUrl) {
          try {
            const response = await fetch(windowsImagePath, { method: 'HEAD' });
            const contentType = response.headers.get('content-type');

            // Next.js dev server sometimes returns 200 OK with the HTML of the 404 page!
            // Disk images never have a text/html content-type, so this safely catches missing files.
            if (!response.ok || (contentType && contentType.includes('text/html'))) {
              throw new Error(`Windows image not found at ${windowsImagePath}`);
            }
          } catch (err) {
            setError(`Windows image not found. Please place the ${config?.name || 'Windows 95/98'} disk image at ${windowsImagePath}.`);
            setLoading(false);
            return;
          }
        }

        if (!mounted) return;

        setStatus('Creating emulator...');

        // Create v86 emulator instance
        const biosUrl = USE_LOCAL_BIOS ? `${V86_BIOS_PATH}/seabios.bin` : 'https://cdn.jsdelivr.net/gh/copy/v86@master/bios/seabios.bin';
        const vgaBiosUrl = USE_LOCAL_BIOS ? `${V86_BIOS_PATH}/vgabios.bin` : 'https://cdn.jsdelivr.net/gh/copy/v86@master/bios/vgabios.bin';

        const isIso = windowsImagePath.toLowerCase().endsWith('.iso');

        const emulatorConfig: any = {
          wasm_path: V86_WASM_PATH,
          memory_size: config?.memory_size || 128 * 1024 * 1024,
          vga_memory_size: config?.vga_memory_size || 8 * 1024 * 1024,
          screen_container: emulatorContainerRef.current,
          bios: {
            url: biosUrl,
          },
          vga_bios: {
            url: vgaBiosUrl,
          },
          disable_speaker: true,
          autostart: true,
        };

        // Determine drive type based on extension or explicit config
        // asyncLoad defaults to true unless explicitly set to false (e.g. Windows 3.0 from copy.sh)
        const useAsync = config?.asyncLoad === false ? false : true;

        if (config?.drive_type === 'fda') {
          emulatorConfig.fda = { url: windowsImagePath, async: useAsync };
          emulatorConfig.boot_order = 0x213; // prioritizes Floppy
        } else if (config?.drive_type === 'cdrom' || isIso) {
          emulatorConfig.cdrom = { url: windowsImagePath, async: useAsync };
          emulatorConfig.boot_order = 0x213;
        } else {
          // hda (hard disk)
          emulatorConfig.hda = { url: windowsImagePath, async: useAsync };
          emulatorConfig.boot_order = 0x132; // HD first, then floppy, then CD
        }

        // Hack to prevent InvalidStateError: Failed to construct 'AudioWorkletNode'
        // We temporarily hide AudioContext so v86 handles it natively as "unsupported" instead of crashing
        const OriginalAudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (typeof window !== 'undefined') {
          (window as any).AudioContext = undefined;
          (window as any).webkitAudioContext = undefined;
        }

        const emulator = new V86Constructor(emulatorConfig);

        // Restore immediately after instantiation
        if (typeof window !== 'undefined') {
          (window as any).AudioContext = OriginalAudioContext;
          (window as any).webkitAudioContext = OriginalAudioContext;
        }

        emulatorRef.current = emulator;

        // Track loading progress
        emulator.add_listener('download-progress', (progress: any) => {
          if (mounted && progress.lengthComputable) {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setProgress(percent);
            setStatus(`Loading: ${percent}%`);
          }
        });

        let hasBooted = false;

        const dismissLoading = () => {
          if (!hasBooted && mounted) {
            hasBooted = true;
            setLoading(false);
            setStatus('Windows is running');
            try { if (typeof onLoad === 'function') onLoad(); } catch (e) { }
          }
        };

        // Handle emulator ready — show canvas quickly
        emulator.add_listener('emulator-ready', () => {
          if (mounted) {
            setStatus('Booting...');
            setProgress(100);
            // Short delay to let the first frame render, then dismiss overlay
            setTimeout(dismissLoading, 500);
          }
        });

        // Fallback: dismiss as soon as v86 switches to graphical mode (canvas appears)
        emulator.add_listener('screen-set-mode', (is_graphical: boolean) => {
          if (is_graphical && mounted) {
            setTimeout(dismissLoading, 300);
          }
        });

        // Also watch for any screen update as a final fallback
        emulator.add_listener('screen-set-size-graphical', () => {
          if (mounted) {
            setTimeout(dismissLoading, 300);
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
          // v86 might fail to initialize CPU if audio fails
          if (emulatorRef.current.cpu) {
            emulatorRef.current.destroy();
          }
        } catch (err) {
          console.error('Error destroying emulator:', err);
        }
      }
    };
  }, [config?.url]);

  const handleRestart = () => {
    if (emulatorRef.current) {
      try {
        // v86 restart logic
        emulatorRef.current.stop();
        emulatorRef.current.run();
      } catch (err) {
        console.error('Error restarting emulator:', err);
        // Fallback: reload the component if possible (not easily done without external state)
      }
    }
  };

  const sendScancode = (codes: number[]) => {
    if (emulatorRef.current) {
      emulatorRef.current.keyboard_send_scancodes(codes);
    }
  };

  const sendKey = (downCode: number) => {
    if (emulatorRef.current) {
      // Send down code
      emulatorRef.current.keyboard_send_scancodes([downCode]);
      setTimeout(() => {
        // Send up code (downCode + 0x80)
        emulatorRef.current.keyboard_send_scancodes([downCode | 0x80]);
      }, 50);
    }
  };

  const sendCtrlAltDel = () => {
    if (emulatorRef.current) {
      // Ctrl (0x1D) + Alt (0x38) + Del (0xE0 0x53)
      emulatorRef.current.keyboard_send_scancodes([0x1D]); // Ctrl down
      emulatorRef.current.keyboard_send_scancodes([0x38]); // Alt down
      emulatorRef.current.keyboard_send_scancodes([0xE0, 0x53]); // Del down
      setTimeout(() => {
        emulatorRef.current.keyboard_send_scancodes([0xE0, 0xD3]); // Del up
        emulatorRef.current.keyboard_send_scancodes([0xB8]); // Alt up (0x38 | 0x80)
        emulatorRef.current.keyboard_send_scancodes([0x9D]); // Ctrl up (0x1D | 0x80)
      }, 50);
    }
  };

  // Auto-hide controls logic
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 5000); // 5 seconds
    };

    const container = emulatorContainerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    // Initial timer
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 5000);

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#000', overflow: 'hidden' }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          .v86-screen-container canvas {
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) scale(${scale}) !important;
            max-width: none !important;
            max-height: none !important;
            image-rendering: pixelated !important;
            transition: transform 0.2s ease-in-out;
          }
          .v86-text-layer {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            margin: 0 !important;
            transform: scale(${1.6 * scale}) !important;
            transform-origin: top left !important;
            text-shadow: 0 0 2px rgba(255,255,255,0.3);
            transition: transform 0.2s ease-in-out;
          }
        `
      }} />

      {/* Zoom Controls */}
      {!loading && !error && (
        <div style={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 30,
          display: 'flex',
          gap: 8,
          background: 'rgba(0,0,0,0.5)',
          padding: 8,
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(4px)',
          opacity: showControls ? 1 : 0,
          pointerEvents: showControls ? 'auto' : 'none',
          transition: 'opacity 0.5s ease-in-out',
        }}>
          <button
            onClick={() => setScale(Math.max(0.5, scale - 0.25))}
            style={{ width: 32, height: 32, borderRadius: 4, background: '#333', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            ➖
          </button>
          <div style={{ display: 'flex', alignItems: 'center', color: '#fff', fontSize: 12, fontWeight: 600, padding: '0 4px' }}>
            {Math.round(scale * 100)}%
          </div>
          <button
            onClick={() => setScale(Math.min(3, scale + 0.25))}
            style={{ width: 32, height: 32, borderRadius: 4, background: '#333', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            ➕
          </button>
          <button
            onClick={() => setScale(1)}
            style={{ padding: '0 8px', height: 32, borderRadius: 4, background: '#333', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 10 }}
            title="Reset Zoom to 100%"
          >
            Reset Zoom
          </button>

          <button
            onClick={handleRestart}
            style={{ padding: '0 8px', height: 32, borderRadius: 4, background: '#333', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 10, marginLeft: 4 }}
            title="Restart the Virtual Machine"
          >
            🔄 Restart VM
          </button>
          
          {/* Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              title="Exit Emulator"
              style={{ 
                width: 32, 
                height: 32, 
                borderRadius: 4, 
                background: '#cc3333', 
                color: '#fff', 
                border: 'none', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 'bold',
                marginLeft: 8,
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#ee4444'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#cc3333'}
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Function Keys Bar */}
      {!loading && !error && (
        <div style={{
          position: 'absolute',
          top: 64, // Below the zoom controls
          left: 16,
          zIndex: 30,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          maxWidth: 'calc(100% - 32px)',
          background: 'rgba(0,0,0,0.5)',
          padding: 6,
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(4px)',
          opacity: showControls ? 1 : 0,
          pointerEvents: showControls ? 'auto' : 'none',
          transition: 'opacity 0.5s ease-in-out',
        }}>
          {/* F1-F12 */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
            <button
              key={`f${n}`}
              onClick={() => sendKey(n <= 10 ? 0x3A + n : (n === 11 ? 0x57 : 0x58))}
              style={{ padding: '4px 8px', minWidth: 32, borderRadius: 4, background: '#333', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 'bold' }}
            >
              F{n}
            </button>
          ))}
          
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.2)', margin: '0 4px' }} />
          
          <button
            onClick={() => sendKey(0x01)}
            style={{ padding: '4px 8px', borderRadius: 4, background: '#444', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 10 }}
          >
            Esc
          </button>
          <button
            onClick={() => sendKey(0x0F)}
            style={{ padding: '4px 8px', borderRadius: 4, background: '#444', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 10 }}
          >
            Tab
          </button>
          <button
            onClick={sendCtrlAltDel}
            style={{ padding: '4px 8px', borderRadius: 4, background: '#b33', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 'bold' }}
            title="Send Ctrl+Alt+Del"
          >
            CAD
          </button>
        </div>
      )}

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
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{config?.name || 'Emulator'} Error</div>
          <div style={{ fontSize: 14, color: '#ff8888', maxWidth: 600 }}>{error}</div>
          <div style={{ fontSize: 14, color: '#aaa', marginTop: 16 }}>
            The image file must be placed at <code style={{ background: '#333', padding: '2px 6px', borderRadius: 3 }}>public{config?.url || WINDOWS_IMAGE_LOCAL}</code>
          </div>
          {config?.downloadLink && (
            <div style={{ marginTop: 24, padding: '16px', background: 'rgba(0, 120, 215, 0.15)', borderRadius: 8, border: '1px solid rgba(0, 120, 215, 0.3)' }}>
              <strong style={{ color: '#a8d8ff' }}>Missing Image File?</strong>
              <p style={{ marginTop: 8, color: '#d0d0d0', fontSize: 14 }}>
                You can download {config?.name} from here:
                <br />
                <a
                  href={config.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#0078d4', textDecoration: 'underline', marginTop: 4, display: 'inline-block' }}
                >
                  {config.downloadLink}
                </a>
              </p>
            </div>
          )}
        </div>
      )}

      <div
        ref={emulatorContainerRef}
        className="v86-screen-container"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    </div>
  );
}

