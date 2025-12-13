
import React from 'react';
import { motion } from 'framer-motion';
import { 
    Activity, ShieldCheck, Zap, Server, Lock, 
    Database, Wifi, Cpu, ArrowRight, Play 
} from 'lucide-react';

export const DesignLabTest: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* 1. Header Section */}
            <header className="border-b border-white/5 pb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse shadow-[0_0_10px_#D4AF37]"></div>
                    <span className="text-[#D4AF37] font-mono text-xs uppercase tracking-[0.2em]">Design Laboratory</span>
                </div>
                <h1 className="text-4xl font-light text-white tracking-tight">
                    Test Modułu <span className="font-bold text-[#D4AF37]">Void Black</span>
                </h1>
                <p className="text-zinc-500 mt-2 max-w-xl leading-relaxed">
                    Ten moduł używa teraz <strong>dokładnie tej samej klasy .grid-bg</strong> co Design System Preview. Tło jest jednolite w całej aplikacji.
                </p>
            </header>

            {/* 2. KPI Grid - Testing Neo Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'System Load', value: '12%', icon: Cpu, active: true },
                    { label: 'Security', value: 'Secure', icon: ShieldCheck, active: true },
                    { label: 'Database', value: 'Connected', icon: Database, active: true },
                    { label: 'Network', value: '1.2 GB/s', icon: Wifi, active: false },
                ].map((item, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`neo-card p-6 rounded-2xl group hover:border-[#D4AF37]/30 transition-all cursor-default ${!item.active ? 'opacity-50' : ''}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <item.icon className="text-zinc-500 group-hover:text-[#D4AF37] transition-colors" size={24} />
                            {item.active && <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full shadow-[0_0_8px_#D4AF37]"></div>}
                        </div>
                        <p className="text-zinc-500 text-xs uppercase font-bold tracking-wider">{item.label}</p>
                        <p className="text-2xl text-white font-mono mt-1 group-hover:text-[#E1E1E3]">{item.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* 3. Main Dashboard Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Large Chart Area (Mock) */}
                <div className="lg:col-span-2 neo-card p-8 rounded-2xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <h3 className="text-xl text-white font-light flex items-center gap-2">
                            <Activity className="text-[#D4AF37]" size={20} /> Real-time Telemetry
                        </h3>
                        <div className="flex gap-2">
                            <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-2 py-1 rounded border border-white/5">LIVE</span>
                        </div>
                    </div>
                    
                    {/* Fake Chart Lines */}
                    <div className="h-64 flex items-end gap-2 opacity-50 relative z-10">
                        {Array.from({length: 40}).map((_, i) => (
                            <div 
                                key={i} 
                                className="flex-1 bg-[#D4AF37]" 
                                style={{ 
                                    height: `${20 + Math.random() * 60}%`, 
                                    opacity: 0.1 + (i/40) * 0.5 
                                }}
                            ></div>
                        ))}
                    </div>

                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                </div>

                {/* Control Panel */}
                <div className="neo-card p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-[#0A0A0C] to-black">
                    <div>
                        <h3 className="text-lg text-white font-bold mb-6 flex items-center gap-2">
                            <Lock size={18} className="text-zinc-400" /> Active Vaults
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                <span className="text-sm text-zinc-300">Master Key</span>
                                <span className="text-xs font-mono text-[#D4AF37]">ACTIVE</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                <span className="text-sm text-zinc-300">Backup Node</span>
                                <span className="text-xs font-mono text-zinc-500">STANDBY</span>
                            </div>
                        </div>
                    </div>

                    <button className="mt-8 w-full bg-[#D4AF37] text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#FCD34D] transition-all shadow-[0_0_20px_-5px_rgba(212,175,55,0.4)]">
                        <Play size={18} fill="currentColor" /> INICJUJ PROTOKÓŁ
                    </button>
                </div>
            </div>

            {/* 4. Log Console */}
            <div className="font-mono text-xs p-6 rounded-2xl bg-black border border-white/10 text-zinc-500 h-48 overflow-hidden relative">
                <div className="absolute top-2 right-4 text-[10px] text-zinc-600 uppercase font-bold flex items-center gap-2">
                    <Server size={12} /> System Logs
                </div>
                <div className="space-y-1 opacity-70">
                    <p><span className="text-[#D4AF37]">[14:20:01]</span> System initialized in Void Mode.</p>
                    <p><span className="text-blue-500">[14:20:02]</span> Loading neo-card styles...</p>
                    <p><span className="text-green-500">[14:20:03]</span> Background set to #050505. Grid loaded successfully.</p>
                    <p><span className="text-zinc-500">[14:20:04]</span> Connecting to Nuffi Core...</p>
                    <p><span className="text-[#D4AF37]">[14:20:05]</span> Waiting for user input_</p>
                </div>
            </div>
        </div>
    );
};
