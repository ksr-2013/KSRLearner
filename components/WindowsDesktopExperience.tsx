'use client'

import { useState, useEffect } from 'react';
import V86WindowsEmulator from './V86WindowsEmulator';

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
  const [emulatorLoaded, setEmulatorLoaded] = useState(false);

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
          <V86WindowsEmulator onLoad={() => setEmulatorLoaded(true)} />
        </div>

        {/* Shortcut Practice Panel - Collapsible */}
        <div style={{ width: 400, background: 'rgba(30, 30, 30, 0.95)', borderLeft: '1px solid rgba(255,255,255,0.1)', padding: 20, overflowY: 'auto', maxHeight: '100vh' }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#ffffff' }}>⌨️ Windows Shortcuts</div>
          <div style={{ fontSize: 12, color: '#a8d8ff', marginBottom: 16 }}>
            Practice these shortcuts while using the Windows emulator. The v86 WebAssembly emulator runs Windows 95/98 directly in your browser.
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
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: '#a8d8ff' }}>💡 Emulator Info:</div>
            <ul style={{ fontSize: 11, color: '#d0d0d0', margin: 0, paddingLeft: 20, lineHeight: 1.6 }}>
              <li><strong>Technology:</strong> v86 WebAssembly emulator</li>
              <li><strong>OS:</strong> Windows 95/98 (requires disk image)</li>
              <li><strong>Memory:</strong> 128MB RAM</li>
              <li><strong>Controls:</strong> Click in emulator to focus</li>
              <li><strong>Keyboard:</strong> All shortcuts work normally</li>
            </ul>
            <div style={{ fontSize: 10, color: '#888', marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              Place Windows disk image at: <code style={{ background: '#333', padding: '2px 4px', borderRadius: 2 }}>public/os-images/windows.img</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

