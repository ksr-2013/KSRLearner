'use client'

import { useState, useEffect } from 'react';
import V86WindowsEmulator from './V86WindowsEmulator';
import { OSOption } from '../data/os-images';

const DOS_COMMANDS = [
  { cmd: 'DIR', desc: 'List files (use DIR /P for long lists, DIR /W for wide mode)' },
  { cmd: 'CD <dir>', desc: 'Change directory (CD .. goes up one level)' },
  { cmd: 'CLS', desc: 'Clear the screen' },
  { cmd: 'TYPE <file>', desc: 'Display contents of a file (e.g., TYPE README.TXT)' },
  { cmd: 'EDIT <file>', desc: 'Open the MS-DOS text editor' },
  { cmd: 'HELP', desc: 'Show available commands or command help' },
  { cmd: 'VER', desc: 'Display operating system version' },
  { cmd: 'FORMAT A:', desc: 'Format a disk (CAREFUL!)' },
];

const WINDOWS_GUI_TIPS = [
  { cmd: 'Double-click', desc: 'Open a program or file' },
  { cmd: 'Alt + F4', desc: 'Close the active window' },
  { cmd: 'Alt + Tab', desc: 'Switch between open windows' },
  { cmd: 'Ctrl + Esc', desc: 'Open Task Manager / Task List' },
  { cmd: 'Alt + Space', desc: 'Open window control menu (Move, Resize, Close)' },
  { cmd: 'File → Exit', desc: 'Quit the current program from the menu bar' },
  { cmd: 'Program Manager', desc: 'Main shell — open groups to launch apps' },
  { cmd: 'Mouse click', desc: 'Click in the emulator screen first to focus it' },
];

const LINUX_COMMANDS = [
  { cmd: 'ls -la', desc: 'List all files and folders (including hidden)' },
  { cmd: 'cd <dir>', desc: 'Change to directory (cd .. goes up)' },
  { cmd: 'clear', desc: 'Clear the terminal screen' },
  { cmd: 'cat <file>', desc: 'Display contents of a text file' },
  { cmd: 'nano <file>', desc: 'Open simple text editor' },
  { cmd: 'uname -a', desc: 'Display system information' },
  { cmd: 'ping 1.1.1.1', desc: 'Check network connectivity' },
];

export default function WindowsDesktopExperience({ config }: { config: OSOption }) {
  const [emulatorLoaded, setEmulatorLoaded] = useState(false);
  
  // Determine which command/tip set to show
  const isLinux = config.name.toLowerCase().includes('linux');
  const isWin3x = ['win30', 'win31', 'win101', 'win203'].includes(config.id);
  const commands = isLinux ? LINUX_COMMANDS : isWin3x ? WINDOWS_GUI_TIPS : DOS_COMMANDS;
  const panelTitle = isLinux ? '⌨️ Useful Commands' : isWin3x ? '🖱️ GUI Tips' : '⌨️ Useful Commands';

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', color: '#ffffff', fontFamily: 'Segoe UI, system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* Emulator Container - Full Width to Show All Controls */}
        <div style={{ flex: 1, position: 'relative', background: '#2a2a2a', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <V86WindowsEmulator config={config} onLoad={() => setEmulatorLoaded(true)} />
        </div>

        {/* Shortcut Practice Panel - Collapsible */}
        <div style={{ width: 400, background: 'rgba(30, 30, 30, 0.95)', borderLeft: '1px solid rgba(255,255,255,0.1)', padding: 20, overflowY: 'auto', maxHeight: '100vh' }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#ffffff' }}>{panelTitle}</div>
          <div style={{ fontSize: 12, color: '#a8d8ff', marginBottom: 16 }}>
            {config.description} Practice these commands while using the terminal.
          </div>
          <div style={{ marginBottom: 20 }}>
            {commands.map((cmdInfo, idx) => (
              <div key={idx} style={{ marginBottom: 10, padding: '10px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 6 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <code style={{ 
                    fontFamily: 'monospace', 
                    color: '#00ff00', 
                    background: '#000', 
                    padding: '4px 8px', 
                    borderRadius: 4, 
                    fontSize: 13,
                    border: '1px solid rgba(0,255,0,0.2)' 
                  }}>
                    {cmdInfo.cmd}
                  </code>
                  <span style={{ fontSize: 12, color: '#e0e0e0' }}>{cmdInfo.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '16px', background: 'rgba(0, 120, 215, 0.1)', borderRadius: 8, border: '1px solid rgba(0, 120, 215, 0.3)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: '#a8d8ff' }}>💡 Emulator Info:</div>
            <ul style={{ fontSize: 11, color: '#d0d0d0', margin: 0, paddingLeft: 20, lineHeight: 1.6 }}>
              <li><strong>Technology:</strong> v86 WebAssembly emulator</li>
              <li><strong>OS:</strong> {config.name}</li>
              <li><strong>Memory:</strong> {config.memory_size / (1024 * 1024)}MB RAM</li>
              <li><strong>Controls:</strong> Click in emulator to focus</li>
              <li><strong>Keyboard:</strong> All shortcuts work normally</li>
            </ul>
            <div style={{ fontSize: 10, color: '#888', marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              Place {config.name} disk image at: <code style={{ background: '#333', padding: '2px 4px', borderRadius: 2 }}>public{config.url}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

