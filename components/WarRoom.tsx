
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
    Activity, TrendingUp, TrendingDown, Globe, MessageSquare, 
    AlertTriangle, Zap, Maximize2, Radio, Target,
    DollarSign, Percent, ArrowRight, Layers, BarChart2, BookOpen
} from 'lucide-react';
import { FinancialChart } from './ui/FinancialChart';
import { safeFormatCurrency } from '../utils/formatters';
import { CapitalFlow, MarketNews } from '../types';
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar, Tooltip, XAxis, YAxis } from 'recharts';

// --- MOCK DATA ---
const MOCK_NEWS: MarketNews[] = [
    { id: '1', source: 'CoinDesk', title: 'SEC Approves Spot ETF for Ethereum', sentiment: 'BULLISH', time: '2m ago', impactScore: 95, tickers: ['ETH'] },
    { id: '2', source: 'Reuters', title: 'Inflation Data Comes in Lower Than Expected', sentiment: 'BULLISH', time: '5m ago', impactScore: 80, tickers: ['SPX', 'BTC'] },
    { id: '3', source: 'X (CryptoWhale)', title: 'Moving 10,000 BTC to Binance right now.', sentiment: 'BEARISH', time: '12m ago', impactScore: 88, tickers: ['BTC'] },
    { id: '4', source: 'FastBull AI', title: 'RSI Divergence detected on SOL/USDT 4h', sentiment: 'NEUTRAL', time: '15m ago', impactScore: 60, tickers: ['SOL'] },
];

const ORDER_BOOK_BIDS = Array.from({length: 15}, (_, i) => ({ price: 45000 - i * 50, size: Math.random() * 5, total: 0 }));
const ORDER_BOOK_ASKS = Array.from({length: 15}, (_, i) => ({ price: 45050 + i * 50, size: Math.random() * 5, total: 0 }));

export const WarRoom: React.FC = () => {
    const [btcPrice, setBtcPrice] = useState(45000);
    const [sentiment, setSentiment] = useState(65); 
    const [tape, setTape] = useState<{price: number, size: number, side: 'BUY'|'SELL', time: string}[]>([]);

    // Simulate Live Data
    useEffect(() => {
        const interval = setInterval(() => {
            const change = Math.random() * 20 - 10;
            setBtcPrice(prev => prev + change);
            
            // Add to tape
            const newTrade: {price: number, size: number, side: 'BUY'|'SELL', time: string} = {
                price: 45000 + change,
                size: parseFloat((Math.random() * 2).toFixed(4)),
                side: Math.random() > 0.5 ? 'BUY' : 'SELL',
                time: new Date().toLocaleTimeString()
            };
            setTape(prev => [newTrade, ...prev].slice(0, 20));

        }, 800);
        return () => clearInterval(interval);
    }, []);

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
        <div className="h-[calc(100vh-100px)] p-2 flex flex-col gap-2 overflow-hidden rounded-2xl border border-white/5 bg-[#050505]">
            {/* 1. GLOBAL COMMAND BAR */}
            <div className="flex justify-between items-center bg-[#0A0A0C] p-3 rounded-xl border border-white/5">
                <div className="flex items-center gap-6">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2 tracking-tight">
                        <Radio className="text-rose-500 animate-pulse" size={18} /> WAR ROOM <span className="text-zinc-600 text-xs">v3.0</span>
                    </h2>
                    <div className="h-6 w-px bg-white/5"></div>
                    <div className="flex gap-6 text-xs font-mono">
                        <div className="flex flex-col">
                            <span className="text-zinc-500 text-[10px] uppercase">BTC/USD</span>
                            <span className="text-white font-bold text-sm">{safeFormatCurrency(btcPrice, 'USD')}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-zinc-500 text-[10px] uppercase">ETH/USD</span>
                            <span className="text-white font-bold">{safeFormatCurrency(btcPrice * 0.05, 'USD')}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-zinc-500 text-[10px] uppercase">Funding (8h)</span>
                            <span className="text-emerald-400 font-bold">0.0100%</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded text-xs font-bold text-indigo-400 flex items-center gap-2">
                        <Zap size={12} /> AI Signals Active
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-2 min-h-0">
                {/* LEFT COLUMN: Charting */}
                <div className="col-span-9 flex flex-col gap-2">
                    {/* Main Chart */}
                    <div className="flex-1 neo-card p-4 relative flex flex-col min-h-0 bg-[#0A0A0C]">
                        <div className="flex justify-between items-start mb-2 relative z-10">
                            <div className="flex gap-2">
                                <button className="bg-[#D4AF37] text-black px-3 py-1 rounded text-xs font-bold">BTC</button>
                                <button className="bg-[#141419] text-zinc-400 px-3 py-1 rounded text-xs font-bold hover:text-white transition-colors border border-white/5">ETH</button>
                                <button className="bg-[#141419] text-zinc-400 px-3 py-1 rounded text-xs font-bold hover:text-white transition-colors border border-white/5">SOL</button>
                            </div>
                            <div className="flex gap-2">
                                {['1m', '5m', '15m', '1H', '4H', '1D'].map(tf => (
                                    <button key={tf} className="bg-[#141419] text-zinc-400 hover:text-white px-2 py-1 rounded text-[10px] font-bold transition-colors border border-white/5">{tf}</button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="flex-1 w-full h-full relative">
                            <FinancialChart 
                                data={chartData} 
                                type="CANDLE" 
                                colors={{ lineColor: '#10b981', topColor: 'rgba(16, 185, 129, 0.2)', bottomColor: 'rgba(16, 185, 129, 0)', upColor: '#10b981', downColor: '#f43f5e' }}
                            />
                        </div>
                    </div>

                    {/* Bottom: Depth Chart (Recharts) */}
                    <div className="h-48 neo-card relative overflow-hidden flex bg-[#0A0A0C]">
                        <div className="w-1/2 border-r border-white/5 p-2">
                            <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1 flex items-center gap-1"><BookOpen size={10} /> Depth (Bids)</div>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={ORDER_BOOK_BIDS}>
                                    <Area type="step" dataKey="size" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-1/2 p-2">
                            <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1 text-right flex items-center justify-end gap-1">Depth (Asks) <BookOpen size={10} /></div>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={ORDER_BOOK_ASKS}>
                                    <Area type="step" dataKey="size" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.2} strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Order Book & Tape */}
                <div className="col-span-3 flex flex-col gap-2">
                    {/* Order Book */}
                    <div className="flex-1 neo-card bg-[#0A0A0C] overflow-hidden flex flex-col">
                        <div className="p-2 border-b border-white/5 text-xs font-bold text-zinc-400 uppercase">Order Book</div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-[10px] p-1">
                            <div className="space-y-0.5">
                                {ORDER_BOOK_ASKS.slice().reverse().map((ask, i) => (
                                    <div key={i} className="flex justify-between px-2 py-0.5 hover:bg-white/5 cursor-pointer relative">
                                        <span className="text-rose-500 font-bold z-10">{ask.price.toLocaleString()}</span>
                                        <span className="text-zinc-300 z-10">{ask.size.toFixed(4)}</span>
                                        <div className="absolute right-0 top-0 bottom-0 bg-rose-500/10" style={{width: `${ask.size * 20}%`}}></div>
                                    </div>
                                ))}
                            </div>
                            <div className="py-2 text-center text-lg font-bold text-white border-y border-white/10 my-1">
                                {btcPrice.toLocaleString()} <span className="text-xs text-zinc-500">USD</span>
                            </div>
                            <div className="space-y-0.5">
                                {ORDER_BOOK_BIDS.map((bid, i) => (
                                    <div key={i} className="flex justify-between px-2 py-0.5 hover:bg-white/5 cursor-pointer relative">
                                        <span className="text-emerald-500 font-bold z-10">{bid.price.toLocaleString()}</span>
                                        <span className="text-zinc-300 z-10">{bid.size.toFixed(4)}</span>
                                        <div className="absolute right-0 top-0 bottom-0 bg-emerald-500/10" style={{width: `${bid.size * 20}%`}}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tape (Recent Trades) */}
                    <div className="h-64 neo-card bg-[#0A0A0C] overflow-hidden flex flex-col">
                        <div className="p-2 border-b border-white/5 text-xs font-bold text-zinc-400 uppercase">Recent Trades</div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-[10px] p-1">
                            {tape.map((t, i) => (
                                <div key={i} className="flex justify-between px-2 py-0.5 hover:bg-white/5">
                                    <span className={t.side === 'BUY' ? 'text-emerald-500' : 'text-rose-500'}>{t.price.toFixed(1)}</span>
                                    <span className="text-white">{t.size.toFixed(4)}</span>
                                    <span className="text-zinc-500">{t.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
