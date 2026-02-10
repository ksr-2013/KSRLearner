import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DataFlowVisualizer = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-5xl mx-auto">
            <div className="text-center bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                <h2 className="text-2xl font-bold mb-2 text-white">How Data Moves</h2>
                <p className="text-slate-400">See what happens when you open a game!</p>
            </div>

            {/* Container with fixed aspect ratio */}
            <div className="relative w-full max-w-4xl aspect-[16/9] bg-slate-900 rounded-3xl shadow-2xl border border-slate-700 p-4 overflow-hidden">

                {/* Components Layout - Using percentages for position to match animation */}

                {/* STORAGE: Bottom Left */}
                <div className="absolute left-[5%] bottom-[10%] w-[15%] h-[20%] bg-orange-900/40 rounded-xl flex flex-col items-center justify-center border-2 border-orange-500/50 z-10 backdrop-blur-sm">
                    <span className="text-3xl drop-shadow-md">💾</span>
                    <span className="text-xs font-bold mt-2 text-orange-200 md:block hidden">Storage</span>
                </div>

                {/* RAM: Bottom Middle-Left */}
                <div className="absolute left-[30%] bottom-[30%] w-[15%] h-[15%] bg-green-900/40 rounded-xl flex flex-col items-center justify-center border-2 border-green-500/50 z-10 backdrop-blur-sm">
                    <span className="text-xs font-bold text-green-200">RAM</span>
                </div>

                {/* CPU: Top Middle */}
                <div className="absolute left-[45%] top-[10%] w-[18%] h-[25%] bg-blue-900/40 rounded-xl flex flex-col items-center justify-center border-2 border-blue-500/50 z-10 backdrop-blur-sm">
                    <span className="text-5xl drop-shadow-md">🧠</span>
                    <span className="text-xs font-bold mt-2 text-blue-200 md:block hidden">CPU</span>
                </div>

                {/* GPU: Bottom Middle-Right */}
                <div className="absolute right-[25%] bottom-[30%] w-[15%] h-[15%] bg-purple-900/40 rounded-xl flex flex-col items-center justify-center border-2 border-purple-500/50 z-10 backdrop-blur-sm">
                    <span className="text-xs font-bold text-purple-200">GPU</span>
                </div>

                {/* SCREEN: Right Middle */}
                <div className="absolute right-[2%] top-[30%] w-[20%] h-[30%] bg-slate-950 rounded-xl border-4 border-slate-700 flex items-center justify-center shadow-2xl z-10">
                    <div className="w-full h-full bg-slate-900 overflow-hidden relative flex items-center justify-center">
                        {isPlaying && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 3.5, duration: 0.5 }}
                                className="text-5xl drop-shadow-glow"
                            >
                                🎮
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Connecting Lines (SVG overlay) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-600 stroke-2 stroke-dashed" style={{ zIndex: 0 }}>
                    {/* Storage to RAM */}
                    <line x1="12%" y1="80%" x2="37%" y2="65%" />
                    {/* RAM to CPU */}
                    <line x1="37%" y1="65%" x2="54%" y2="35%" />
                    {/* CPU to GPU */}
                    <line x1="54%" y1="35%" x2="67%" y2="65%" />
                    {/* GPU to Screen */}
                    <line x1="67%" y1="65%" x2="88%" y2="45%" />
                </svg>

                {/* Data Packet Animation */}
                <AnimatePresence mode="wait">
                    {isPlaying && (
                        <motion.div
                            key="packet"
                            className="absolute w-4 h-4 md:w-6 md:h-6 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.6)] z-20 flex items-center justify-center text-[8px] md:text-[10px] text-white font-bold border border-white/50"
                            // We describe the path using percentages which matches our layout
                            initial={{ left: "12%", top: "80%" }}
                            animate={[
                                { left: "12%", top: "80%", backgroundColor: "#ef4444" } as any, // Storage
                                { left: "37%", top: "65%", backgroundColor: "#4ade80" } as any, // RAM
                                { left: "54%", top: "35%", backgroundColor: "#60a5fa" } as any, // CPU
                                { left: "67%", top: "65%", backgroundColor: "#c084fc" } as any, // GPU
                                { left: "88%", top: "45%", opacity: 0, scale: 2 } as any        // Screen
                            ]}
                            transition={{
                                duration: 4,
                                times: [0, 0.3, 0.6, 0.8, 1],
                                ease: "linear"
                            }}
                            onAnimationComplete={() => setIsPlaying(false)}
                        >

                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Step Labels that appear during animation */}
                <div className="absolute bottom-4 left-4 text-xs md:text-sm text-slate-400 font-mono bg-slate-800/90 p-2 md:p-3 rounded-lg border border-slate-700 backdrop-blur-sm">
                    {isPlaying ? (
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Simulating Data Flow...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-slate-500" />
                            Ready to Start
                        </span>
                    )}
                </div>
            </div>

            <button
                onClick={() => setIsPlaying(true)}
                disabled={isPlaying}
                className={`px-8 py-3 rounded-full font-bold text-white transition-all transform active:scale-95 shadow-lg border border-white/10
          ${isPlaying ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/50 hover:from-blue-500 hover:to-indigo-500 hover:-translate-y-1'}
        `}
            >
                {isPlaying ? 'Running Simulation...' : 'Start Simulation'}
            </button>
        </div>
    );
};

export default DataFlowVisualizer;
