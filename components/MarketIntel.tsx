
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { IndustryStat, MacroIndicator, MarketComparison } from '../types';
import { BarChart2, TrendingUp, TrendingDown, Globe, Building, ArrowUpRight, ArrowDownRight, Loader2, Activity, PieChart, Layers } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

export const MarketIntel: React.FC = () => {
    const [stats, setStats] = useState<IndustryStat[]>([]);
    const [macro, setMacro] = useState<MacroIndicator[]>([]);
    const [comp, setComp] = useState<MarketComparison[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const [s, m, c] = await Promise.all([
                NuffiService.fetchIndustryStats(),
                NuffiService.fetchMacroIndicators(),
                NuffiService.fetchMarketComparison()
            ]);
            setStats(s);
            setMacro(m);
            setComp(c);
            setLoading(false);
        };
        load();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-8 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6 animate-in fade-in">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Globe className="text-indigo-400" /> Market Intelligence
                    </h2>
                    <p className="text-slate-400 mt-1">
                        Global Macro Data & Sector Benchmarking (Koyfin-style).
                    </p>
                </div>
            </header>

            {/* Macro Cards Grid */}
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {loading ? [1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-800/50 rounded-2xl animate-pulse" />) : 
                    macro.map(ind => (
                        <motion.div variants={itemVariants} key={ind.name} className="glass-card p-6 rounded-2xl hover:border-indigo-500/30 transition-all group">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-xs font-bold text-slate-500 uppercase">{ind.name}</p>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${ind.trend === 'UP' ? 'bg-green-500/20 text-green-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                    {ind.trend}
                                </span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <h3 className="text-3xl font-bold text-white">{ind.value}</h3>
                                <span className="text-sm text-slate-400 font-medium">{ind.unit}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-2 text-right font-mono">{ind.date}</p>
                            
                            {/* Mini Sparkline Decoration */}
                            <div className="mt-3 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className={`h-full ${ind.trend === 'UP' ? 'bg-green-500' : 'bg-rose-500'}`} style={{width: '60%'}}></div>
                            </div>
                        </motion.div>
                    ))
                }
            </motion.div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sector Analysis Chart */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="lg:col-span-2 glass-card p-8 rounded-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <BarChart2 className="text-slate-400" size={18} /> Sector Benchmarks
                        </h3>
                        <div className="flex gap-2">
                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><div className="w-2 h-2 bg-indigo-500 rounded-full"></div> Revenue</span>
                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><div className="w-2 h-2 bg-slate-700 rounded-full"></div> Cost</span>
                        </div>
                    </div>

                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="sector" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(v) => `${v/1000}k`} />
                                <Tooltip 
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                    contentStyle={{backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff'}} 
                                />
                                <Bar dataKey="avgRevenue" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="avgCost" fill="#334155" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Competitive Landscape */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 rounded-2xl bg-indigo-900/10 border border-indigo-500/20">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Layers className="text-indigo-400" size={18} /> Competitive Matrix
                    </h3>
                    
                    <div className="space-y-4">
                        {comp.map((c, i) => (
                            <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">{c.metric}</p>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-2xl font-bold text-white">{c.myValue}</p>
                                        <p className="text-[10px] text-slate-400">You</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-medium text-slate-400">{c.marketValue}</p>
                                        <p className="text-[10px] text-slate-500">Market Avg</p>
                                    </div>
                                </div>
                                <div className={`mt-2 text-xs font-bold flex items-center gap-1 ${c.status === 'BETTER' ? 'text-green-400' : 'text-rose-400'}`}>
                                    {c.status === 'BETTER' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    {c.difference > 0 ? '+' : ''}{c.difference}% vs avg
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
