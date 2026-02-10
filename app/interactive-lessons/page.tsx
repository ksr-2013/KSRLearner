"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import HardwareExplorer from '../components/interactive/HardwareExplorer';
import DataFlowVisualizer from '../components/interactive/DataFlowVisualizer';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function InteractiveLessonsPage() {
    const [activeTab, setActiveTab] = useState<'hardware' | 'dataflow'>('hardware');

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            <Header />

            <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                <header className="text-center mb-12">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-blue-900/30 border border-blue-700/50 text-blue-300 text-sm font-medium mb-4">
                        Interactive Learning
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Computer <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Playground</span>
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Explore the inside of a computer without a screwdriver! Click parts to learn what they do, or watch how they talk to each other.
                    </p>
                </header>

                {/* Navigation Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="bg-slate-800 p-1.5 rounded-full shadow-lg inline-flex gap-2 border border-slate-700">
                        <button
                            onClick={() => setActiveTab('hardware')}
                            className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ${activeTab === 'hardware'
                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                }`}
                        >
                            🔍 Explore Parts
                        </button>
                        <button
                            onClick={() => setActiveTab('dataflow')}
                            className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ${activeTab === 'dataflow'
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                }`}
                        >
                            ⚡ See It Work
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-slate-800/50 rounded-3xl shadow-xl border border-slate-700 p-6 md:p-8 backdrop-blur-sm"
                >
                    {activeTab === 'hardware' && <HardwareExplorer />}
                    {activeTab === 'dataflow' && <DataFlowVisualizer />}
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
