'use client'

import { useState, useEffect } from 'react';

const SHORTCUTS = [
  { id: 'win', keys: ['Meta'], description: 'Open Start Menu (Windows key)' },
  { id: 'win-d', keys: ['Meta', 'd'], description: 'Show Desktop (Windows+D)' },
  { id: 'win-l', keys: ['Meta', 'l'], description: 'Lock Screen (Windows+L)' },
  { id: 'win-e', keys: ['Meta', 'e'], description: 'Open File Explorer (Windows+E)' },
  { id: 'alt-tab', keys: ['Alt', 'Tab'], description: 'Switch Windows (Alt+Tab)' },
  { id: 'win-tab', keys: ['Meta', 'Tab'], description: 'Task View (Windows+Tab)' },
  { id: 'ctrl-shift-esc', keys: ['Control', 'Shift', 'Escape'], description: 'Open Task Manager (Ctrl+Shift+Esc)' },
  { id: 'win-r', keys: ['Meta', 'r'], description: 'Open Run Dialog (Windows+R)' },
  { id: 'win-s', keys: ['Meta', 's'], description: 'Search (Windows+S)' },
  { id: 'win-i', keys: ['Meta', 'i'], description: 'Open Settings (Windows+I)' },
];

export default function WindowsDesktopExperience() {
  const [score, setScore] = useState(0);
  const [shortcutProgress, setShortcutProgress] = useState<Record<string, number>>({});
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      SHORTCUTS.forEach(s => {
        let match = s.keys.every(k => {
          if (k === 'Meta') return e.metaKey;
          if (k === 'Alt') return e.altKey;
          if (k === 'Control') return e.ctrlKey;
          if (k === 'Shift') return e.shiftKey;
          if (k.startsWith('Arrow')) return e.key === k;
          if (k.length === 1) return e.key?.toLowerCase() === k.toLowerCase();
          return e.key === k;
        });
        if (match) {
          setScore(prev => prev + 10);
          setShortcutProgress(prog => ({ ...prog, [s.id]: (prog[s.id] || 0) + 1 }));
        }
      });
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', color: '#ffffff', fontFamily: 'Segoe UI, system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* Emulator Container - Full Width to Show All Controls */}
        <div style={{ flex: 1, position: 'relative', background: '#2a2a2a', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {!iframeLoaded && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a1a', zIndex: 10 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Loading Windows 1.01 Emulator...</div>
                <div style={{ fontSize: 14, color: '#a0a0a0' }}>Please wait while the emulator initializes</div>
              </div>
            </div>
          )}
          <div style={{ 
            width: '100%', 
            height: '100%', 
            overflow: 'auto',
            position: 'relative',
            clipPath: 'inset(350px 0 150px 300px)',
            marginTop: '-350px',
            marginLeft: '-300px',
            marginBottom: '-150px'
          }}>
            <iframe
              src="https://www.pcjs.org/software/pcx86/sys/windows/1.01/ega/"
              style={{
                width: '100%',
                minHeight: 'calc(100vh - 100px)',
                height: '100%',
                border: 'none',
                display: iframeLoaded ? 'block' : 'none',
                background: '#2a2a2a'
              }}
              title="Windows 1.01 Emulator - PCjs with Full Controls"
              allowFullScreen
              scrolling="yes"
              onLoad={() => setIframeLoaded(true)}
            />
          </div>
        </div>

        {/* Shortcut Practice Panel - Collapsible */}
        <div style={{ width: 400, background: 'rgba(30, 30, 30, 0.95)', borderLeft: '1px solid rgba(255,255,255,0.1)', padding: 20, overflowY: 'auto', maxHeight: '100vh' }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#ffffff' }}>⌨️ Windows Shortcuts</div>
          <div style={{ fontSize: 12, color: '#a8d8ff', marginBottom: 16 }}>
            Practice these shortcuts while using the emulator. The full PCjs interface with all controls (disk management, save/load, system commands) is shown below.
          </div>
          <div style={{ marginBottom: 20 }}>
            {SHORTCUTS.map(s => (
              <div key={s.id} style={{ marginBottom: 10, padding: '8px 10px', background: shortcutProgress[s.id] ? 'rgba(0, 120, 215, 0.2)' : 'rgba(255,255,255,0.05)', borderRadius: 6, transition: 'background 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <kbd style={{ background: 'linear-gradient(135deg, #0078d4, #005a9e)', color: '#fff', borderRadius: 4, padding: '4px 10px', fontSize: 11, fontWeight: 600, boxShadow: '0 2px 4px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    {s.keys.map((k, i) => (
                      <span key={i}>{k === 'Meta' ? 'Win' : k}{i < s.keys.length - 1 ? ' + ' : ''}</span>
                    ))}
                  </kbd>
                  <span style={{ fontSize: 12, color: '#e0e0e0', flex: 1 }}>{s.description}</span>
                  {shortcutProgress[s.id] && (
                    <span style={{ color: '#7cff7c', fontSize: 11, fontWeight: 600 }}>✓ {shortcutProgress[s.id]}x</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '16px', background: 'rgba(0, 120, 215, 0.1)', borderRadius: 8, border: '1px solid rgba(0, 120, 215, 0.3)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: '#a8d8ff' }}>💡 Emulator Controls:</div>
            <ul style={{ fontSize: 11, color: '#d0d0d0', margin: 0, paddingLeft: 20, lineHeight: 1.6 }}>
              <li><strong>Disk Management:</strong> Mount disk images (A:, B:)</li>
              <li><strong>Save/Load:</strong> Save and restore emulator state</li>
              <li><strong>System Commands:</strong> Reset, Halt, Ctrl-Alt-Del</li>
              <li><strong>CPU Speed:</strong> 4.77MHz (original IBM PC XT speed)</li>
              <li><strong>Full Screen:</strong> Click "Full Screen" button in emulator</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

