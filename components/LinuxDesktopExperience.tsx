'use client'

import { useState, useEffect } from 'react';

const SHORTCUTS = [
  { id: 'super', keys: ['Meta'], description: 'Show Activities Overview (Super)' },
  { id: 'ctrl-alt-t', keys: ['Control','Alt','t'], description: 'Open Terminal (Ctrl+Alt+T)' },
  { id: 'super-l', keys: ['Meta','l'], description: 'Lock Screen (Super+L)' },
  { id: 'super-a', keys: ['Meta','a'], description: 'Show App Launcher (Super+A)' },
  { id: 'alt-tab', keys: ['Alt','Tab'], description: 'Switch Windows (Alt+Tab)' },
  { id: 'ctrl-alt-left', keys: ['Control','Alt','ArrowLeft'], description: 'Switch workspace left (Ctrl+Alt+←)' },
  { id: 'ctrl-alt-right', keys: ['Control','Alt','ArrowRight'], description: 'Switch workspace right (Ctrl+Alt+→)' },
];

export default function LinuxDesktopExperience() {
  const [score, setScore] = useState(0);
  const [shortcutProgress, setShortcutProgress] = useState<Record<string, number>>({});

useEffect(() => {
  function onKeyDown(e: KeyboardEvent) {
      SHORTCUTS.forEach(s => {
        let match = s.keys.every(k => {
          if (k === 'Meta') return e.metaKey;
          if (k === 'Alt') return e.altKey;
          if (k === 'Control') return e.ctrlKey;
          if (k === 'Shift') return e.shiftKey;
          if (k.startsWith('Arrow')) return e.key === k;
          if (k.length === 1) return e.key?.toLowerCase() === k;
          return e.key === k;
        });
        if (match) {
          setScore(prev => prev+10);
          setShortcutProgress(prog => ({...prog, [s.id]: (prog[s.id]||0)+1}));
        }
      });
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div style={{minHeight:'100vh',background:'#222c36',color:'#ededed',fontFamily:'sans-serif',display:'flex',flexDirection:'column'}}>
      {/* GNOME top panel */}
      <div style={{height:40,background:'#232937',boxShadow:'0 2px 16px #0006',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 32px'}}>
        <div style={{fontWeight:700,letterSpacing:1}}>🟣 Ubuntu GNOME</div>
        <div style={{fontSize:14,opacity:0.8}}>Experiencing Linux Desktop</div>
        <div style={{fontSize:15,display:'flex',alignItems:'center',gap:18}}>
          <span>🔊</span><span>💻</span><span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
      {/* Desktop body */}
      <div style={{flex:1,display:'flex',height:'calc(100vh - 40px)'}}> 
        {/* Dock */}
        <div style={{width:64,background:'#262f3d',borderRight:'1px solid #223',display:'flex',flexDirection:'column',alignItems:'center',padding:'14px 0',gap:15}}>
          <div style={{width:42,height:42,borderRadius:8,background:'#fff1',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',marginBottom:26}}><span role="img" aria-label="Apps" style={{fontSize:22}}>✳️</span></div>
          <div style={{width:40,height:40,borderRadius:8,background:'#a97aff',display:'flex',alignItems:'center',justifyContent:'center'}} title="Terminal"><span role="img" aria-label="Terminal" style={{fontSize:21}}>🖥️</span></div>
          <div style={{width:40,height:40,borderRadius:8,background:'#3dbfff',display:'flex',alignItems:'center',justifyContent:'center'}} title="Files"><span role="img" aria-label="Files" style={{fontSize:21}}>📁</span></div>
          <div style={{width:40,height:40,borderRadius:8,background:'#3744dd',display:'flex',alignItems:'center',justifyContent:'center'}} title="Browser"><span role="img" aria-label="Browser" style={{fontSize:21}}>🌐</span></div>
        </div>
        {/* Desktop icons */}
        <div style={{flex:1,position:'relative',background:'linear-gradient(135deg,#23283b 60%,#1e2633 100%)',display:'flex',flexDirection:'column'}}>
          <div style={{position:'absolute',top:64,left:80,display:'flex',flexDirection:'column',gap:24}}>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',cursor:'pointer'}}>
              <span style={{fontSize:30}}>🏡</span>
              <div style={{marginTop:4,fontSize:13,opacity:0.88}}>Home</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',cursor:'pointer'}}>
              <span style={{fontSize:30}}>🖥️</span>
              <div style={{marginTop:4,fontSize:13,opacity:0.88}}>Terminal</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',cursor:'pointer'}}>
              <span style={{fontSize:30}}>📄</span>
              <div style={{marginTop:4,fontSize:13,opacity:0.88}}>Files</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',cursor:'pointer'}}>
              <span style={{fontSize:30}}>🌐</span>
              <div style={{marginTop:4,fontSize:13,opacity:0.88}}>Browser</div>
            </div>
          </div>
          {/* Info & Practice */}
          <div style={{position:'absolute',top:60,right:56,padding:18,background:'#23293bDE',backdropFilter:'blur(2px)',borderRadius:12,boxShadow:'0 4px 24px #111a',fontSize:15}}>
            <b>Linux Shortcut Practice</b>
            <div style={{margin:'7px 0',fontSize:13.5,color:'#aaf'}}>Try these shortcuts:</div>
            <div>
              {SHORTCUTS.map(s=>(
                <div key={s.id} style={{marginBottom:4}}>
                  <kbd style={{background:'#314ff7',color:'#fff',borderRadius:3,padding:'2px 8px',marginRight:8}}>{s.keys.join(' + ')}</kbd>
                  {s.description} {shortcutProgress[s.id]?<span style={{color:'#7df98d'}}>✔×{shortcutProgress[s.id]}</span>:''}
                </div>
              ))}
            </div>
            <div style={{margin:'8px 0 2px',fontWeight:600,fontSize:15}}>Score: <span style={{color:'#ffd966'}}>{score}</span></div>
            <button onClick={()=>{setScore(0);setShortcutProgress({});}} style={{marginTop:10,fontSize:13,borderRadius:4,color:'#314ff7',border:'1px solid #314ff7',background:'#232b37',padding:'3px 13px',cursor:'pointer'}}>Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
}
