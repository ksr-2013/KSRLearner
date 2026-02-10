import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ExplanationCard from './ExplanationCard';

interface HardwarePart {
    id: string;
    name: string;
    description: string;
    color: string;
    gridArea: string;
}

const parts: HardwarePart[] = [
    {
        id: 'cpu',
        name: 'CPU (The Brain)',
        description: "I am the Central Processing Unit! I do all the thinking and calculations. When you open a game, I tell everyone what to do. Think of me as the boss of the computer.",
        color: 'bg-blue-400',
        gridArea: 'col-start-2 col-end-3 row-start-2 row-end-3'
    },
    {
        id: 'ram',
        name: 'RAM (Short-term Memory)',
        description: "I am Random Access Memory! I keep things ready for the CPU so it can work fast. But if you turn the computer off, I forget everything! I'm like a desk where you do your homework.",
        color: 'bg-green-400',
        gridArea: 'col-start-3 col-end-4 row-start-1 row-end-4'
    },
    {
        id: 'storage',
        name: 'Storage (SSD/HDD)',
        description: "I am the Storage! I remember everything forever, even when the power is off. Photos, games, and Windows live inside me. I'm like a big backpack or a library.",
        color: 'bg-orange-400',
        gridArea: 'col-start-1 col-end-2 row-start-3 row-end-5'
    },
    {
        id: 'gpu',
        name: 'GPU (Graphics Card)',
        description: "I am the Graphics Processing Unit! I draw all the pictures and 3D worlds in your games. The CPU tells me what to draw, and I paint it on the screen really fast!",
        color: 'bg-purple-400',
        gridArea: 'col-start-2 col-end-4 row-start-4 row-end-5'
    },
    {
        id: 'motherboard',
        name: 'Motherboard',
        description: "I am the Motherboard! I connect everyone together. The CPU, RAM, and everything else plug into me so they can talk to each other. I'm like the roads in a city.",
        color: 'bg-slate-700',
        gridArea: 'col-start-1 col-end-4 row-start-1 row-end-5 -z-10'
    }
];

const HardwareExplorer = () => {
    const [selectedPart, setSelectedPart] = useState<HardwarePart | null>(null);

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-5xl mx-auto">
            <div className="text-center mb-2">
                <h2 className="text-2xl font-bold mb-2 text-white">Inside Your Computer</h2>
                <p className="text-slate-400">Click on the colorful parts to see what they do!</p>
            </div>

            <div className="relative w-full aspect-video max-w-3xl bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-700/50 overflow-hidden">
                {/* Motherboard Layout using Grid */}
                <div className="grid grid-cols-3 grid-rows-4 gap-4 h-full w-full relative z-10">

                    {/* Individual Parts */}
                    {parts.filter(p => p.id !== 'motherboard').map((part) => (
                        <motion.div
                            key={part.id}
                            className={`${part.color} ${part.gridArea} rounded-xl shadow-lg cursor-pointer flex items-center justify-center p-2 text-center font-bold text-white border border-white/10 backdrop-blur-sm bg-opacity-90`}
                            whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedPart(part)}
                            layoutId={part.id}
                        >
                            <span className="drop-shadow-md">{part.name.split(' ')[0]}</span>
                        </motion.div>
                    ))}

                    {/* Motherboard visual background (interactive too) */}
                    <motion.div
                        className="absolute inset-0 bg-slate-800/30 -z-10 rounded-2xl border-2 border-slate-700 border-dashed m-2 hover:bg-slate-800/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedPart(parts.find(p => p.id === 'motherboard') || null)}
                    />
                </div>
            </div>

            {/* Explanation Area */}
            <div className="h-48 w-full flex items-center justify-center">
                {selectedPart ? (
                    <ExplanationCard
                        title={selectedPart.name}
                        description={selectedPart.description}
                        color={selectedPart.color.replace('bg-', 'bg-').replace('400', '900/50')} // Darker for card bg
                        onClose={() => setSelectedPart(null)}
                    />
                ) : (
                    <div className="text-slate-500 italic p-6 rounded-xl border border-dashed border-slate-700/50 bg-slate-800/30">
                        Select a part to learn more...
                    </div>
                )}
            </div>
        </div>
    );
};

export default HardwareExplorer;
