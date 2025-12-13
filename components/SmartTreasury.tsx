
import React, { useState } from 'react';
import { PiggyBank, TrendingUp, ShieldCheck, Landmark, RefreshCw, Play, Settings } from 'lucide-react';
import { safeFormatCurrency } from '../utils/formatters';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

export const SmartTreasury: React.FC = () => {
    const [idleCash, setIdleCash] = useState(250000); // 250k PLN idle
    const [projectedYield, setProjectedYield] = useState(1250); // Monthly
    const [activeStrategy, setActiveStrategy] = useState('CONSERVATIVE');

    // Yield Curve Data
    const data = [
        { month: 'Jan', value: 250000 },
        { month: 'Feb', value: 251250 },
        { month: 'Mar', value: 252510 },
        { month: 'Apr', value: 253800 },
        { month: 'May', value: 255100 },
        { month: 'Jun', value: 256450 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <PiggyBank className="text-gold" /> Smart Treasury (Autopilot)
                    </h2>
                    <p className="text-zinc-400 mt-1">
                        AI-driven cash management. Don't let inflation eat your runway.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Hero Stats */}
                <div className="lg:col-span-2 neo-card p-8 relative overflow-hidden bg-gradient-to-r from-onyx to-[#141419]">
                    <div className="relative z-10 flex justify-between items-end">
                        <div>
                            <p className="text-gold text-xs font-bold uppercase tracking-wider mb-2">Detected Idle Cash</p>
                            <h3 className="text-5xl font-bold text-white tracking-tight">{safeFormatCurrency(idleCash)}</h3>
                            <p className="text-sm text-zinc-400 mt-2 flex items-center gap-2">
                                <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-xs font-bold border border-green-500/30">+5.2% APY Available</span>
                                <span>vs 0.1% in Bank</span>
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-zinc-400 text-xs font-bold uppercase mb-1">Proj. Monthly Yield</p>
                            <p className="text-2xl font-bold text-emerald-400">+{safeFormatCurrency(projectedYield)}</p>
                        </div>
                    </div>
                    {/* Graph */}
                    <div className="h-32 mt-8 -mx-4 -mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Tooltip contentStyle={{backgroundColor: '#0A0A0C', border: 'none', color: '#fff'}} />
                                <Area type="monotone" dataKey="value" stroke="#D4AF37" fill="url(#colorYield)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Strategy Selector */}
                <div className="neo-card p-6 rounded-2xl flex flex-col">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Settings size={18} className="text-zinc-400" /> Auto-Allocation Strategy
                    </h3>
                    
                    <div className="space-y-3 flex-1">
                        <button 
                            onClick={() => setActiveStrategy('CONSERVATIVE')}
                            className={`w-full p-3 rounded-xl border text-left transition-all ${activeStrategy === 'CONSERVATIVE' ? 'bg-gold/10 border-gold' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-white text-sm">Conservative (Gov Bonds)</span>
                                <span className="text-green-400 text-xs font-bold">~4.5%</span>
                            </div>
                            <p className="text-xs text-zinc-400">T-Bills & Treasury Bonds. Zero risk.</p>
                        </button>

                        <button 
                            onClick={() => setActiveStrategy('BALANCED')}
                            className={`w-full p-3 rounded-xl border text-left transition-all ${activeStrategy === 'BALANCED' ? 'bg-gold/10 border-gold' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-white text-sm">Balanced (Money Market)</span>
                                <span className="text-green-400 text-xs font-bold">~5.2%</span>
                            </div>
                            <p className="text-xs text-zinc-400">Overnight Swaps & MM Funds. T+1 Liquidity.</p>
                        </button>

                        <button 
                            onClick={() => setActiveStrategy('DEFI')}
                            className={`w-full p-3 rounded-xl border text-left transition-all ${activeStrategy === 'DEFI' ? 'bg-gold/10 border-gold' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-white text-sm">DeFi Yield (Stablecoins)</span>
                                <span className="text-green-400 text-xs font-bold">~8.5%</span>
                            </div>
                            <p className="text-xs text-zinc-400">Aave/Compound USDC Lending. Smart Contract Risk.</p>
                        </button>
                    </div>

                    <button className="mt-4 w-full bg-gold text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#FCD34D] transition-all shadow-lg shadow-gold/20">
                        <Play size={18} fill="currentColor" /> Activate Autopilot
                    </button>
                </div>
            </div>

            {/* Allocation Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="neo-card p-6 rounded-2xl">
                    <h3 className="font-bold text-white mb-4">Liquidity Map</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 border border-blue-500/30"><Landmark size={20} /></div>
                                <div>
                                    <p className="text-sm font-bold text-white">Operations (Bank)</p>
                                    <p className="text-xs text-zinc-500">Immediate access</p>
                                </div>
                            </div>
                            <span className="font-mono text-white">20%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/20 rounded-lg text-green-400 border border-green-500/30"><TrendingUp size={20} /></div>
                                <div>
                                    <p className="text-sm font-bold text-white">Yield Bearing (T-Bills)</p>
                                    <p className="text-xs text-zinc-500">T+1 access</p>
                                </div>
                            </div>
                            <span className="font-mono text-white">60%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 border border-purple-500/30"><RefreshCw size={20} /></div>
                                <div>
                                    <p className="text-sm font-bold text-white">DeFi (Stablecoins)</p>
                                    <p className="text-xs text-zinc-500">Instant access</p>
                                </div>
                            </div>
                            <span className="font-mono text-white">20%</span>
                        </div>
                    </div>
                </div>

                <div className="bg-indigo-900/10 border border-indigo-500/30 p-6 rounded-2xl flex items-start gap-4">
                    <ShieldCheck className="text-indigo-400 shrink-0" size={32} />
                    <div>
                        <h4 className="font-bold text-white text-lg">Capital Protection Guarantee</h4>
                        <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                            Strategies "Conservative" and "Balanced" are backed by sovereign debt or regulated money market funds. 
                            Nuffi integrates with <strong>BlackRock ICS</strong> and <strong>Circle Yield</strong> to provide institutional-grade security.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
