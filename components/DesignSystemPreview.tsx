
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Activity, Zap, Shield, Search, Layers, Command, 
    Hexagon, MoveUpRight, Fingerprint, Wallet, ChevronRight, ArrowRight
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar, Tooltip } from 'recharts';

const mockData = Array.from({length: 20}, (_, i) => ({ 
    value: 50 + Math.random() * 50 + (i * 2),
    value2: 30 + Math.random() * 30
}));

export const DesignSystemPreview: React.FC = () => {
    const [activeTab, setActiveTab] = useState('UI');

    return (
        <div className="min-h-screen -m-8 p-8 bg-[#050505] text-[#E1E1E3] font-sans selection:bg-[#D4AF37] selection:text-black relative overflow-hidden">
            {/* --- GLOBAL STYLES FOR 2027 THEME --- */}
            <style>{`
                .neo-gradient-text {
                    background: linear-gradient(to right, #FFFFFF, #9CA3AF);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .neo-gold-text {
                    background: linear-gradient(to right, #FCD34D, #D97706);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .neo-card {
                    background: rgba(20, 20, 25, 0.4);
                    backdrop-filter: blur(24px);
                    border: 1px solid rgba(255, 255, 255, 0.03);
                    box-shadow: 0 0 0 1px rgba(0,0,0,1), 0 20px 40px -10px rgba(0,0,0,0.5);
                }
                .neo-card:hover {
                    border-color: rgba(255, 255, 255, 0.08);
                    box-shadow: 0 0 30px -5px rgba(255, 255, 255, 0.05);
                }
                .neo-border-gradient {
                    position: relative;
                    background: #0A0A0C;
                    border-radius: 16px;
                }
                .neo-border-gradient::before {
                    content: "";
                    position: absolute;
                    inset: -1px;
                    border-radius: 17px;
                    padding: 1px;
                    background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0));
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    pointer-events: none;
                }
                .neo-input {
                    background: #0F0F12;
                    border: 1px solid #1E1E24;
                    color: #fff;
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
                }
                .neo-input:focus {
                    border-color: #D4AF37;
                    box-shadow: 0 0 0 1px #D4AF37, inset 0 2px 4px rgba(0,0,0,0.5);
                }
                .grid-bg {
                    background-size: 40px 40px;
                    background-image: linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                                      linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
                }
            `}</style>

            {/* Background Atmosphere */}
            <div className="absolute inset-0 grid-bg pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            {/* HEADER */}
            <div className="relative z-10 mb-16 flex justify-between items-end border-b border-white/5 pb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="px-2 py-0.5 bg-[#D4AF37] text-black text-[10px] font-bold tracking-widest uppercase rounded-sm">
                            Concept 2027
                        </div>
                        <span className="text-neutral-500 text-xs font-mono uppercase tracking-wider">Neo-Finance Architecture</span>
                    </div>
                    <h1 className="text-6xl font-medium tracking-tight text-white mb-2">
                        Design <span className="text-neutral-600 font-light">Laboratory</span>
                    </h1>
                    <p className="text-neutral-400 max-w-xl text-sm leading-relaxed">
                        Eksperymentalny system wizualny. <br/>
                        Czysta czerń (#050505), mikrokontrast, złote akcenty i "invisible UI".
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 rounded-full bg-[#1A1A1E] border border-white/5 text-neutral-300 hover:text-white text-xs font-bold tracking-wider hover:bg-white/5 transition-all">
                        POBIERZ ASSETY
                    </button>
                    <button className="px-6 py-3 rounded-full bg-[#D4AF37] text-black text-xs font-bold tracking-wider hover:bg-[#FCD34D] shadow-[0_0_20px_-5px_rgba(212,175,55,0.4)] transition-all flex items-center gap-2">
                        WDRAŻAJ SYSTEM <ArrowRight size={14} />
                    </button>
                </div>
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-12 gap-8 relative z-10">
                
                {/* COL 1: Cards & Materials */}
                <div className="col-span-4 space-y-8">
                    <h3 className="text-neutral-500 text-xs font-mono uppercase tracking-widest mb-6">01. Powierzchnie (Onyx Glass)</h3>
                    
                    {/* Card 1: Standard Info */}
                    <motion.div whileHover={{ y: -5 }} className="neo-card p-8 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
                            <MoveUpRight className="text-neutral-500" />
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/0 border border-white/10 flex items-center justify-center mb-6">
                            <Activity className="text-white" size={24} />
                        </div>
                        <h4 className="text-2xl text-white font-medium mb-2">Płynność Finansowa</h4>
                        <p className="text-neutral-500 text-sm leading-relaxed mb-6">
                            Analiza przepływów pieniężnych w czasie rzeczywistym z wykorzystaniem modeli predykcyjnych AI.
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="h-1 flex-1 bg-[#1A1A1E] rounded-full overflow-hidden">
                                <div className="h-full bg-white w-2/3"></div>
                            </div>
                            <span className="font-mono text-xs text-white">67%</span>
                        </div>
                    </motion.div>

                    {/* Card 2: Gold Accent */}
                    <motion.div whileHover={{ y: -5 }} className="neo-card p-8 rounded-2xl border-l-2 border-l-[#D4AF37] relative">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-1">Premium Tier</p>
                                <h4 className="text-xl text-white">Wealth Management</h4>
                            </div>
                            <Hexagon className="text-[#D4AF37]" size={24} />
                        </div>
                        <div className="text-4xl font-mono text-white tracking-tighter mb-2">
                            $2,450,000
                        </div>
                        <p className="text-neutral-500 text-xs">+12.5% vs last month</p>
                    </motion.div>
                </div>

                {/* COL 2: Data Visualization */}
                <div className="col-span-5 space-y-8">
                    <h3 className="text-neutral-500 text-xs font-mono uppercase tracking-widest mb-6">02. Dane (Low Light)</h3>
                    
                    <div className="neo-card p-1 rounded-3xl">
                        <div className="bg-[#0A0A0C] rounded-[20px] p-6 border border-white/5">
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex gap-4">
                                    <button className="text-white text-sm font-bold border-b-2 border-white pb-1">Overview</button>
                                    <button className="text-neutral-600 text-sm font-medium hover:text-neutral-400 transition-colors">Analytics</button>
                                </div>
                                <div className="flex gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    <span className="text-[10px] text-neutral-500 font-mono uppercase">Live Stream</span>
                                </div>
                            </div>

                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={mockData}>
                                        <defs>
                                            <linearGradient id="gradientGold" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.2}/>
                                                <stop offset="100%" stopColor="#D4AF37" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#050505', border: '1px solid #333', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                            cursor={{ stroke: '#333', strokeWidth: 1, strokeDasharray: '4 4' }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="value" 
                                            stroke="#D4AF37" 
                                            strokeWidth={2}
                                            fill="url(#gradientGold)" 
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="value2" 
                                            stroke="#333" 
                                            strokeWidth={2} 
                                            strokeDasharray="4 4"
                                            fill="transparent" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Compact List */}
                    <div className="neo-card p-6 rounded-2xl">
                        <div className="space-y-4">
                            {[1,2,3].map((_, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#1A1A1E] flex items-center justify-center border border-white/5 group-hover:border-[#D4AF37]/50 transition-colors">
                                            <Wallet size={16} className="text-neutral-400 group-hover:text-[#D4AF37]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-white font-medium group-hover:text-[#D4AF37] transition-colors">Bitcoin Reserve</p>
                                            <p className="text-xs text-neutral-600 font-mono">BTC / USD</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-white font-mono">0.4521 BTC</p>
                                        <p className="text-[10px] text-green-500">+2.4%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* COL 3: Inputs & Interactions */}
                <div className="col-span-3 space-y-8">
                    <h3 className="text-neutral-500 text-xs font-mono uppercase tracking-widest mb-6">03. Interakcja</h3>

                    <div className="space-y-4">
                        {/* Input Field */}
                        <div className="group">
                            <label className="block text-[10px] uppercase tracking-widest text-neutral-500 mb-2 group-focus-within:text-[#D4AF37] transition-colors">
                                Szukaj w Rejestrze
                            </label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-white transition-colors" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Wpisz frazę..." 
                                    className="neo-input w-full pl-11 pr-12 py-4 rounded-xl text-sm transition-all placeholder-neutral-700"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-[#1A1A1E] rounded text-[10px] text-neutral-500 font-mono border border-white/5">
                                    ⌘K
                                </div>
                            </div>
                        </div>

                        {/* Toggle */}
                        <div className="flex items-center justify-between p-4 neo-card rounded-xl">
                            <span className="text-sm text-neutral-300">Tryb Ekspercki</span>
                            <div className="w-12 h-6 bg-[#D4AF37] rounded-full relative cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                                <div className="absolute right-1 top-1 bottom-1 w-4 bg-black rounded-full shadow-sm"></div>
                            </div>
                        </div>

                        {/* Security Badge */}
                        <div className="p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-[#0F0F12] to-black flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-[#0A0A0C] border border-[#1E1E24] flex items-center justify-center mb-4 text-[#D4AF37] relative">
                                <Fingerprint size={32} />
                                <div className="absolute inset-0 border border-[#D4AF37] rounded-full opacity-20 animate-ping"></div>
                            </div>
                            <h4 className="text-white text-sm font-bold">Biometric Secured</h4>
                            <p className="text-neutral-500 text-xs mt-1">Civic Identity Pass</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER PREVIEW */}
            <div className="mt-16 pt-8 border-t border-white/5 flex justify-between items-center text-neutral-600 text-xs font-mono">
                <div>SYSTEM STATUS: <span className="text-green-500">OPERATIONAL</span></div>
                <div>RENDER: 0.4ms</div>
                <div>NUFFI.OS v3.0 (ALPHA)</div>
            </div>
        </div>
    );
};
