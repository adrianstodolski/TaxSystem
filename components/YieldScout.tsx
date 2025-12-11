
import React, { useState } from 'react';
import { Gem, TrendingUp, AlertTriangle, ShieldCheck, ArrowRight, ExternalLink, Filter, Search, Wallet, Coins } from 'lucide-react';
import { motion } from 'framer-motion';
import { YieldOpportunity } from '../types';
import { safeFormatCurrency } from '../utils/formatters';

const MOCK_OPPORTUNITIES: YieldOpportunity[] = [
    { id: '1', protocol: 'Aave V3', chain: 'Ethereum', asset: 'USDC', apy: 4.5, tvl: 1500000000, riskLevel: 'LOW', impermanentLossRisk: 0, auditStatus: 'AUDITED', projectedEarnings: 37.5 },
    { id: '2', protocol: 'Curve', chain: 'Arbitrum', asset: '3pool', apy: 8.2, tvl: 500000000, riskLevel: 'LOW', impermanentLossRisk: 1, auditStatus: 'AUDITED', projectedEarnings: 68.3 },
    { id: '3', protocol: 'GMX', chain: 'Arbitrum', asset: 'GLP', apy: 14.5, tvl: 350000000, riskLevel: 'MEDIUM', impermanentLossRisk: 15, auditStatus: 'AUDITED', projectedEarnings: 120.8 },
    { id: '4', protocol: 'Velodrome', chain: 'Optimism', asset: 'WETH-USDC', apy: 22.4, tvl: 120000000, riskLevel: 'HIGH', impermanentLossRisk: 45, auditStatus: 'AUDITED', projectedEarnings: 186.6 },
];

export const YieldScout: React.FC = () => {
    const [opps, setOpps] = useState(MOCK_OPPORTUNITIES);
    const [investmentAmount, setInvestmentAmount] = useState(10000);

    const getRiskColor = (level: string) => {
        switch(level) {
            case 'LOW': return 'text-green-400 bg-green-500/10 border-green-500/20';
            case 'MEDIUM': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'HIGH': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
            default: return 'text-slate-400';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-end border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                        <Gem className="text-pink-500" /> Yield Scout
                    </h2>
                    <p className="text-slate-400 mt-2">
                        Automatyczny skaner najlepszych okazji DeFi (Cross-chain).
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-3">
                        <span className="text-xs text-slate-400 font-bold uppercase">Simulation Base:</span>
                        <input 
                            type="number" 
                            value={investmentAmount} 
                            onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                            className="bg-transparent text-white font-mono font-bold w-24 outline-none text-right"
                        />
                        <span className="text-white font-bold">$</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-card p-6 rounded-2xl">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Filter size={16} /> Filtry</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Chain</label>
                                <div className="flex flex-wrap gap-2">
                                    {['Ethereum', 'Arbitrum', 'Optimism', 'Polygon'].map(c => (
                                        <button key={c} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 border border-white/5">{c}</button>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Risk Level</label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-slate-300 text-sm">
                                        <input type="checkbox" defaultChecked className="accent-indigo-500" /> Low Risk (Stablecoins)
                                    </label>
                                    <label className="flex items-center gap-2 text-slate-300 text-sm">
                                        <input type="checkbox" defaultChecked className="accent-indigo-500" /> Medium Risk (Bluechip LP)
                                    </label>
                                    <label className="flex items-center gap-2 text-slate-300 text-sm">
                                        <input type="checkbox" className="accent-indigo-500" /> Degen (New Farms)
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-6 rounded-2xl border border-indigo-500/30 text-center">
                        <ShieldCheck size={32} className="text-indigo-400 mx-auto mb-4" />
                        <h4 className="text-white font-bold mb-2">Safety First</h4>
                        <p className="text-xs text-indigo-200">
                            Wszystkie wyświetlane protokoły przeszły audyt bezpieczeństwa. Ryzyko Smart Contract pozostaje.
                        </p>
                    </div>
                </div>

                {/* Opportunities List */}
                <div className="lg:col-span-3 space-y-4">
                    {opps.map((opp, idx) => (
                        <motion.div 
                            key={opp.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card p-6 rounded-2xl hover:border-indigo-500/30 transition-all group relative overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-white border border-white/10 shadow-lg">
                                        <Coins size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{opp.protocol}</h3>
                                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                            <span className="bg-slate-800 px-2 py-0.5 rounded border border-white/5">{opp.chain}</span>
                                            <span className="font-bold text-slate-300">{opp.asset}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-8 w-full md:w-auto text-center md:text-left">
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">APY</p>
                                        <p className="text-2xl font-bold text-green-400">{opp.apy}%</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Proj. Earnings / Mo</p>
                                        <p className="text-xl font-bold text-white font-mono">
                                            {safeFormatCurrency((investmentAmount * (opp.apy / 100)) / 12, 'USD')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Risk</p>
                                        <span className={`text-xs font-bold px-2 py-1 rounded border uppercase ${getRiskColor(opp.riskLevel)}`}>
                                            {opp.riskLevel}
                                        </span>
                                    </div>
                                </div>

                                <div className="w-full md:w-auto flex justify-end">
                                    <button className="bg-white/5 hover:bg-white/10 text-white p-3 rounded-xl transition-colors border border-white/10">
                                        <ExternalLink size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Hover Expansion Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
