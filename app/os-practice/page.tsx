'use client'

import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import WindowsDesktopExperience from '../../components/WindowsDesktopExperience';
import { OS_OPTIONS, OSOption } from '../../data/os-images';

export default function OSPracticePage() {
  const [selectedOS, setSelectedOS] = useState<OSOption | null>(null);

  if (selectedOS) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
        <div className="flex-grow">
          <WindowsDesktopExperience config={selectedOS} onClose={() => setSelectedOS(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Header />
      <main className="flex-grow py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Virtual Machine <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Gallery</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Experience the history of computing directly in your browser. Choose an operating system below to boot up a virtual machine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {OS_OPTIONS.map((os) => (
            <div 
              key={os.id} 
              onClick={() => setSelectedOS(os)}
              className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 cursor-pointer group hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/20 flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{os.icon}</div>
                <div className="text-xs font-semibold px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full border border-blue-700/50">
                  {os.year}
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {os.name}
              </h2>
              <p className="text-slate-300 flex-grow text-sm leading-relaxed mb-6">
                {os.description}
              </p>
              
              <div className="w-full bg-blue-600 text-white text-center py-2.5 rounded-lg font-medium group-hover:bg-blue-500 transition-colors">
                Boot Virtual Machine
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}