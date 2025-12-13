
import React, { useEffect, useState, useMemo } from 'react';
import { NuffiService } from '../services/api';
import { CryptoExchange, CryptoTransaction, CryptoTaxReport, NFTAsset, AssetBubble } from '../types';
import { CryptoEngine } from '../utils/cryptoEngine';
import { Bitcoin, RefreshCw, Layers, ShieldCheck, Activity, Image, Radio, FileText, Calculator, TrendingUp, Coins, CircleDollarSign, LayoutGrid, Search, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import { toast } from './ui/Toast';
import { DataTable } from './ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// Mock Bubble Data
const MOCK_BUBBLES: AssetBubble[] = [
    { id: '1', symbol: 'BTC', name: 'Bitcoin', price: 45000, change24h: 2.5, marketCap: 850000000000, volume24h: 35000000000, rank: 1, rsi: 65, fdv: 850000000000, smartMoneyFlow: 'INFLOW' },
    { id: '2', symbol: 'ETH', name: 'Ethereum', price: 2400, change24h: -1.2, marketCap: 280000000000, volume24h: 15000000000, rank: 2, rsi: 45, fdv: 280000000000, smartMoneyFlow: 'OUTFLOW' },
    { id: '3', symbol: 'SOL', name: 'Solana', price: 95, change24h: 8.5, marketCap: 40000000000, volume24h: 4000000000, rank: 5, rsi: 78, fdv: 50000000000, smartMoneyFlow: 'INFLOW' },
    { id: '4', symbol: 'BNB', name: 'BNB', price: 310, change24h: 0.5, marketCap: 48000000000, volume24h: 1000000000, rank: 4, rsi: 50, fdv: 48000000000, smartMoneyFlow: 'INFLOW' },
    { id: '5', symbol: 'XRP', name: 'XRP', price: 0.55, change24h: -0.8, marketCap: 30000000000, volume24h: 1200000000, rank: 6, rsi: 42, fdv: 55000000000, smartMoneyFlow: 'OUTFLOW' },
    { id: '6', symbol: 'ADA', name: 'Cardano', price: 0.50, change24h: 1.1, marketCap: 18000000000, volume24h: 500000000, rank: 8, rsi: 55, fdv: 22000000000, smartMoneyFlow: 'INFLOW' },
    { id: '7', symbol: 'AVAX', name: 'Avalanche', price: 35, change24h: 12.4, marketCap: 13000000000, volume24h: 800000000, rank: 9, rsi: 82, fdv: 15000000000, smartMoneyFlow: 'INFLOW' },
    { id: '8', symbol: 'DOGE', name: 'Dogecoin', price: 0.08, change24h: -3.5, marketCap: 11000000000, volume24h: 600000000, rank: 10, rsi: 35, fdv: 11000000000, smartMoneyFlow: 'OUTFLOW' },
];

const ALPHA_GEMS = [
    { name: 'GMX', chain: 'Arbitrum', narrative: 'Real Yield', score: 85, potential: 'HIGH' },
    { name: 'KAS', chain: 'Kaspa', narrative: 'L1 PoW', score: 92, potential: 'VERY_HIGH' },
    { name: 'TAO', chain: 'Bittensor', narrative: 'AI', score: 78, potential: 'MEDIUM' },
];

export const CryptoHub: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'BUBBLES' | 'SCREENER' | 'TAX' | 'ALPHA'>('BUBBLES');
    const [transactions, setTransactions] = useState<CryptoTransaction[]>([]);
    const [report, setReport] = useState<CryptoTaxReport | null>(null);
    const [bubbles, setBubbles] = useState(MOCK_BUBBLES);
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const txs = await NuffiService.fetchCryptoTransactions();
            setTransactions(txs);
            setReport(CryptoEngine.calculateTax(txs, 'FIFO'));
        } catch (e) {
            toast.error('Błąd', 'Nie udało się pobrać danych.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    // Pro Screener Columns
    const screenerColumns = useMemo<ColumnDef<AssetBubble>[]>(() => [
        {
            accessorKey: 'symbol',
            header: 'Token',
            cell: info => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px] text-white">
                        {info.getValue() as string}
                    </div>
                    <div>
                        <p className="font-bold text-white text-sm">{info.row.original.name}</p>
                        <p className="text-[10px] text-zinc-500 font-mono">Rank #{info.row.original.rank}</p>
                    </div>
                </div>
            )
        },
        {
            accessorKey: 'price',
            header: 'Price',
            cell: info => <span className="font-mono text-white font-bold">${info.getValue() as number}</span>
        },
        {
            accessorKey: 'change24h',
            header: '24h %',
            cell: info => {
                const val = info.getValue() as number;
                return <span className={`font-bold ${val > 0 ? 'text-green-400' : 'text-rose-400'}`}>{val > 0 ? '+' : ''}{val}%</span>
            }
        },
        {
            accessorKey: 'marketCap',
            header: 'M. Cap',
            cell: info => <span className="font-mono text-zinc-300">${(info.getValue() as number / 1e9).toFixed(2)}B</span>
        },
        {
            accessorKey: 'rsi',
            header: 'RSI (14)',
            cell: info => {
                const val = info.getValue() as number;
                return <span className={`font-bold ${val > 70 ? 'text-rose-400' : val < 30 ? 'text-green-400' : 'text-zinc-400'}`}>{val}</span>
            }
        },
        {
            accessorKey: 'smartMoneyFlow',
            header: 'Smart Money',
            cell: info => (
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase border ${
                    info.getValue() === 'INFLOW' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                }`}>
                    {info.getValue() as string}
                </span>
            )
        }
    ], []);

    const formatFiat = (val: number) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(val);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Activity className="text-gold" /> Market Intelligence Hub
                    </h2>
                    <p className="text-zinc-400 mt-1">Zaawansowana analityka rynku, Tax Engine i Alpha Scouting.</p>
                </div>
                <button onClick={loadData} className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl font-bold hover:bg-white/10 flex items-center gap-2 transition-all text-sm">
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh Data
                </button>
            </header>

            {/* Navigation Pills */}
            <div className="flex gap-2 mb-6 bg-[#0A0A0C] p-1 rounded-xl border border-white/10 w-fit">
                {[
                    { id: 'BUBBLES', label: 'Market 360', icon: LayoutGrid },
                    { id: 'SCREENER', label: 'Pro Screener', icon: Layers },
                    { id: 'ALPHA', label: 'Alpha Gems', icon: Sparkles },
                    { id: 'TAX', label: 'Tax Engine', icon: FileText },
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${
                            activeTab === tab.id ? 'bg-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'text-zinc-400 hover:text-white'
                        }`}
                    >
                        <tab.icon size={16} /> {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {/* 1. BUBBLES VIEW */}
                {activeTab === 'BUBBLES' && (
                    <motion.div 
                        key="BUBBLES"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="h-[600px] neo-card rounded-2xl relative overflow-hidden p-8 flex items-center justify-center bg-[#0A0A0C]"
                    >
                        <div className="absolute top-4 left-4 z-10 flex gap-4">
                            <span className="text-xs font-bold text-zinc-500 uppercase">Top 100 Coins</span>
                            <span className="text-xs font-bold text-zinc-500 uppercase">Performance: 24h</span>
                        </div>

                        <div className="flex flex-wrap gap-4 justify-center content-center w-full h-full">
                            {bubbles.map((bubble, i) => {
                                const size = Math.max(80, Math.log10(bubble.marketCap) * 12); 
                                const color = bubble.change24h > 0 
                                    ? `rgba(34, 197, 94, ${Math.min(0.9, 0.3 + (bubble.change24h / 20))})` 
                                    : `rgba(244, 63, 94, ${Math.min(0.9, 0.3 + (Math.abs(bubble.change24h) / 20))})`; 

                                return (
                                    <motion.div
                                        key={bubble.id}
                                        layoutId={bubble.id}
                                        className="rounded-full flex flex-col items-center justify-center text-white shadow-xl cursor-pointer hover:scale-110 transition-transform relative group border border-white/10 backdrop-blur-md"
                                        style={{ 
                                            width: size, 
                                            height: size, 
                                            backgroundColor: color 
                                        }}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: i * 0.05 }}
                                    >
                                        <span className="font-bold text-sm drop-shadow-md">{bubble.symbol}</span>
                                        <span className="text-xs font-mono font-bold drop-shadow-md">{bubble.change24h > 0 ? '+' : ''}{bubble.change24h}%</span>
                                        <span className="text-[10px] opacity-0 group-hover:opacity-100 absolute bottom-4 transition-opacity font-mono">
                                            ${bubble.price.toLocaleString()}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* 2. PRO SCREENER */}
                {activeTab === 'SCREENER' && (
                    <motion.div key="SCREENER" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="neo-card rounded-2xl overflow-hidden p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-white text-lg">Top Assets by Smart Money Flow</h3>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 bg-white/5 border border-white/10 rounded text-xs font-bold text-zinc-400 hover:text-white">Filter</button>
                                <button className="px-3 py-1 bg-white/5 border border-white/10 rounded text-xs font-bold text-zinc-400 hover:text-white">Columns</button>
                            </div>
                        </div>
                        <DataTable columns={screenerColumns} data={bubbles} />
                    </motion.div>
                )}

                {/* 3. ALPHA SCANNER */}
                {activeTab === 'ALPHA' && (
                    <motion.div key="ALPHA" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {ALPHA_GEMS.map((gem, i) => (
                                <div key={i} className="neo-card p-6 rounded-2xl relative overflow-hidden group hover:border-gold/30 transition-all border border-white/10 bg-gradient-to-b from-[#0A0A0C] to-black">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-2xl font-bold text-white">{gem.name}</h3>
                                        <span className="bg-purple-500/20 text-purple-400 text-xs font-bold px-2 py-1 rounded border border-purple-500/30">{gem.chain}</span>
                                    </div>
                                    <p className="text-sm text-zinc-400 mb-4">Narrative: <span className="text-white font-bold">{gem.narrative}</span></p>
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs font-bold text-zinc-500 uppercase">AI Score</div>
                                        <div className="text-xl font-bold text-gold">{gem.score}/100</div>
                                    </div>
                                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                                        <div className="bg-gold h-full" style={{width: `${gem.score}%`}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* 4. TAX VIEW */}
                {activeTab === 'TAX' && (
                    <motion.div 
                        key="TAX"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        {report && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="neo-card p-6 rounded-2xl border-l-4 border-indigo-500">
                                    <p className="text-zinc-400 text-xs font-bold uppercase mb-1">Dochód do opodatkowania</p>
                                    <h3 className="text-3xl font-bold text-white font-mono">{formatFiat(report.spotIncomeTaxBase + report.futuresIncomeTaxBase)}</h3>
                                </div>
                                <div className="neo-card p-6 rounded-2xl border-l-4 border-rose-500">
                                    <p className="text-zinc-400 text-xs font-bold uppercase mb-1">Koszty (Fees + Straty)</p>
                                    <h3 className="text-3xl font-bold text-white font-mono">{formatFiat(report.spotCost + report.futuresCost)}</h3>
                                </div>
                                <div className="neo-card p-6 rounded-2xl border-l-4 border-green-500">
                                    <p className="text-zinc-400 text-xs font-bold uppercase mb-1">Podatek Należny (19%)</p>
                                    <h3 className="text-3xl font-bold text-green-400 font-mono">{formatFiat(report.totalTaxDue)}</h3>
                                </div>
                            </div>
                        )}
                        <div className="p-8 text-center text-zinc-500 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                            Pełny silnik podatkowy dostępny w module <strong className="text-white">Tax Engine</strong>.
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
