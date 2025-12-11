
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
    Activity, TrendingUp, TrendingDown, Globe, MessageSquare, 
    AlertTriangle, Zap, Maximize2, Radio, Twitter, Target,
    DollarSign, Percent, ArrowRight, Layers, BarChart2
} from 'lucide-react';
import { FinancialChart } from './ui/FinancialChart';
import { safeFormatCurrency } from '../utils/formatters';
import { CapitalFlow, MarketNews } from '../types';

// --- MOCK DATA ---
const MOCK_NEWS: MarketNews[] = [
    { id: '1', source: 'CoinDesk', title: 'SEC Approves Spot ETF for Ethereum', sentiment: 'BULLISH', time: '2m ago', impactScore: 95, tickers: ['ETH'] },
    { id: '2', source: 'Reuters', title: 'Inflation Data Comes in Lower Than Expected', sentiment: 'BULLISH', time: '5m ago', impactScore: 80, tickers: ['SPX', 'BTC'] },
    { id: '3', source: 'X (CryptoWhale)', title: 'Moving 10,000 BTC to Binance right now.', sentiment: 'BEARISH', time: '12m ago', impactScore: 88, tickers: ['BTC'] },
    { id: '4', source: 'FastBull AI', title: 'RSI Divergence detected on SOL/USDT 4h', sentiment: 'NEUTRAL', time: '15m ago', impactScore: 60, tickers: ['SOL'] },
];

const MOCK_FLOWS: CapitalFlow[] = [
    { from: 'USD', to: 'BTC', amount24h: 150000000, trend: 'UP' },
    { from: 'USDT', to: 'ETH', amount24h: 85000000, trend: 'UP' },
    { from: 'BTC', to: 'USDT', amount24h: 45000000, trend: 'DOWN' },
    { from: 'KRW', to: 'XRP', amount24h: 12000000, trend: 'UP' },
];

export const WarRoom: React.FC = () => {
    const [btcPrice, setBtcPrice] = useState(45000);
    const [sentiment, setSentiment] = useState(65); // 0-100 (Fear/Greed)
    const [activeFlow, setActiveFlow] = useState<CapitalFlow | null>(null);

    // Simulated Live Ticker
    useEffect(() => {
        const interval = setInterval(() => {
            setBtcPrice(prev => prev + (Math.random() * 20 - 10));
            setSentiment(prev => Math.min(100, Math.max(0, prev + (Math.random() * 4 - 2))));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Generate static historical data once to avoid flickering
    // CORRECTED: Returns OHLC data for CANDLE chart
    const chartData = useMemo(() => {
        const now = Math.floor(Date.now() / 1000);
        let val = 45000;
        return Array.from({length: 100}, (_, i) => {
            const time = now - (100 - i) * 60;
            const open = val;
            const close = val + (Math.random() * 100 - 50);
            const high = Math.max(open, close) + Math.random() * 20;
            const low = Math.min(open, close) - Math.random() * 20;
            val = close;
            return { time, open, high, low, close };
        });
    }, []); 

    return (
        <div className="h-[calc(100vh-80px)] bg-[#020617] p-2 flex flex-col gap-2 overflow-hidden rounded-2xl border border-white/5">
            {/* 1. GLOBAL COMMAND BAR (Koyfin Style) */}
            <div className="flex justify-between items-center bg-slate-900/80 p-3 rounded-xl border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-6">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2 tracking-tight">
                        <Radio className="text-red-500 animate-pulse" size={18} /> WAR ROOM <span className="text-slate-600 text-xs">v2.4</span>
                    </h2>
                    <div className="h-6 w-px bg-white/10"></div>
                    <div className="flex gap-6 text-xs font-mono">
                        <div className="flex flex-col">
                            <span className="text-slate-500 text-[10px] uppercase">BTC/USD</span>
                            <span className="text-white font-bold">{safeFormatCurrency(btcPrice, 'USD')}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-slate-500 text-[10px] uppercase">ETH/USD</span>
                            <span className="text-white font-bold">{safeFormatCurrency(btcPrice * 0.05, 'USD')}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-slate-500 text-[10px] uppercase">DXY (Index)</span>
                            <span className="text-rose-400 font-bold">102.45 (-0.2%)</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-slate-500 text-[10px] uppercase">Gold</span>
                            <span className="text-green-400 font-bold">2,045 (+0.1%)</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded text-xs font-bold text-indigo-400 flex items-center gap-2">
                        <Zap size={12} /> AI Signals Active
                    </div>
                    <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Live Data</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-2 min-h-0">
                {/* LEFT COLUMN: Charting & Analysis (Koyfin) */}
                <div className="col-span-8 flex flex-col gap-2">
                    {/* Main Chart */}
                    <div className="flex-1 bg-slate-900/30 rounded-xl border border-white/10 p-4 relative flex flex-col min-h-0">
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="flex gap-2">
                                <button className="bg-indigo-600 text-white px-3 py-1 rounded text-xs font-bold">BTC</button>
                                <button className="bg-slate-800 text-slate-400 px-3 py-1 rounded text-xs font-bold hover:text-white transition-colors">ETH</button>
                                <button className="bg-slate-800 text-slate-400 px-3 py-1 rounded text-xs font-bold hover:text-white transition-colors">SOL</button>
                            </div>
                            <div className="flex gap-2">
                                {['1H', '4H', '1D', '1W'].map(tf => (
                                    <button key={tf} className="bg-slate-800 text-slate-400 hover:text-white px-2 py-1 rounded text-[10px] font-bold transition-colors">{tf}</button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="flex-1 w-full h-full relative">
                            <FinancialChart 
                                data={chartData} 
                                type="CANDLE" 
                                colors={{ lineColor: '#22c55e', topColor: 'rgba(34, 197, 94, 0.2)', bottomColor: 'rgba(34, 197, 94, 0)', upColor: '#10b981', downColor: '#ef4444' }}
                            />
                            {/* Overlay Stats */}
                            <div className="absolute top-0 right-0 p-4 text-right pointer-events-none">
                                <div className="text-[10px] text-slate-500 uppercase font-bold">Vol (24h)</div>
                                <div className="text-white font-mono text-sm">$45.2B</div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom: Global Liquidity Map (FiatLeak Sim) */}
                    <div className="h-48 bg-slate-900/50 rounded-xl border border-white/10 relative overflow-hidden flex">
                        <div className="absolute top-2 left-3 z-10 flex items-center gap-2">
                            <Globe size={14} className="text-indigo-400" />
                            <span className="text-xs font-bold text-white uppercase tracking-wider">Global Capital Flows</span>
                        </div>
                        
                        {/* Simulated Flow Visualization */}
                        <div className="flex-1 flex items-center justify-around px-8 relative">
                            {/* Background Map Effect */}
                            <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-cover bg-center opacity-5 pointer-events-none"></div>
                            
                            {MOCK_FLOWS.map((flow, i) => (
                                <motion.div 
                                    key={i}
                                    className="relative flex flex-col items-center group cursor-pointer"
                                    onMouseEnter={() => setActiveFlow(flow)}
                                    onMouseLeave={() => setActiveFlow(null)}
                                >
                                    <div className="flex items-center gap-4 text-sm font-bold text-slate-400 mb-2">
                                        <span>{flow.from}</span>
                                        <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden relative">
                                            <motion.div 
                                                className={`absolute top-0 bottom-0 w-8 ${flow.trend === 'UP' ? 'bg-green-500' : 'bg-red-500'} rounded-full blur-sm`}
                                                animate={{ x: ['-100%', '300%'] }}
                                                transition={{ duration: 2 - (i * 0.2), repeat: Infinity, ease: 'linear' }}
                                            />
                                        </div>
                                        <span className="text-white">{flow.to}</span>
                                    </div>
                                    <span className="text-xs font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {safeFormatCurrency(flow.amount24h, 'USD')} / 24h
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: AI Sentiment & Signals (FastBull/Kavout) */}
                <div className="col-span-4 flex flex-col gap-2">
                    
                    {/* Sentiment Gauge */}
                    <div className="bg-slate-900/30 rounded-xl border border-white/10 p-4 flex flex-col items-center justify-center relative overflow-hidden h-40">
                        <div className="absolute top-2 left-3 text-slate-400 text-xs font-bold uppercase flex items-center gap-2">
                            <Activity size={12} /> Market Sentiment (AI)
                        </div>
                        
                        <div className="relative w-32 h-16 overflow-hidden mt-4">
                            <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-[10px] border-slate-800 border-b-0 border-l-0 border-r-0" style={{ transform: 'rotate(-45deg)' }}></div>
                            <motion.div 
                                className="absolute top-0 left-0 w-32 h-32 rounded-full border-[10px] border-transparent border-t-indigo-500 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                style={{ transform: 'rotate(-45deg)' }}
                                animate={{ rotate: -45 + (180 * (sentiment / 100)) }}
                            ></motion.div>
                        </div>
                        <div className="text-2xl font-bold text-white mt-[-15px]">{Math.round(sentiment)}</div>
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${sentiment > 50 ? 'text-green-400' : 'text-rose-400'}`}>
                            {sentiment > 75 ? 'Extreme Greed' : sentiment > 50 ? 'Greed' : sentiment > 25 ? 'Fear' : 'Extreme Fear'}
                        </p>
                    </div>

                    {/* AI News Feed (FastBull Style) */}
                    <div className="flex-1 bg-slate-900/30 rounded-xl border border-white/10 overflow-hidden flex flex-col min-h-0">
                        <div className="p-3 border-b border-white/10 bg-white/5 flex justify-between items-center">
                            <span className="text-xs font-bold text-white flex items-center gap-2"><Zap size={12} className="text-yellow-400" /> AI Signals & News</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                            {MOCK_NEWS.map(news => (
                                <div key={news.id} className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-indigo-500/30 transition-all group cursor-pointer hover:bg-white/10">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">{news.source}</span>
                                        <span className="text-[9px] text-slate-500">{news.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-200 font-medium leading-snug group-hover:text-white transition-colors">{news.title}</p>
                                    
                                    <div className="mt-2 flex items-center justify-between">
                                        <div className="flex gap-1">
                                            {news.tickers.map(t => (
                                                <span key={t} className="text-[9px] font-bold text-slate-400 bg-slate-800 px-1.5 rounded">{t}</span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1 w-12 bg-slate-700 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full ${news.sentiment === 'BULLISH' ? 'bg-green-500' : news.sentiment === 'BEARISH' ? 'bg-rose-500' : 'bg-slate-400'}`} 
                                                    style={{width: `${news.impactScore}%`}}
                                                ></div>
                                            </div>
                                            <span className={`text-[9px] font-bold ${news.sentiment === 'BULLISH' ? 'text-green-400' : news.sentiment === 'BEARISH' ? 'text-rose-400' : 'text-slate-400'}`}>
                                                {news.sentiment}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
