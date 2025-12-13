
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
    Activity, TrendingUp, TrendingDown, Globe, MessageSquare, 
    AlertTriangle, Zap, Maximize2, Radio, Target,
    DollarSign, Percent, ArrowRight, Layers, BarChart2, BookOpen,
    Clock, Sliders, XCircle, CheckCircle2
} from 'lucide-react';
import { FinancialChart } from './ui/FinancialChart';
import { safeFormatCurrency } from '../utils/formatters';
import { CapitalFlow, MarketNews } from '../types';
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar, Tooltip, XAxis, YAxis } from 'recharts';
import { toast } from './ui/Toast';

// --- MOCK DATA ---
const ORDER_BOOK_BIDS = Array.from({length: 15}, (_, i) => ({ price: 45000 - i * 50, size: Math.random() * 5, total: 0 }));
const ORDER_BOOK_ASKS = Array.from({length: 15}, (_, i) => ({ price: 45050 + i * 50, size: Math.random() * 5, total: 0 }));

export const WarRoom: React.FC = () => {
    const [btcPrice, setBtcPrice] = useState(45000);
    const [tape, setTape] = useState<{price: number, size: number, side: 'BUY'|'SELL', time: string}[]>([]);
    
    // Order Form State
    const [orderSide, setOrderSide] = useState<'BUY' | 'SELL'>('BUY');
    const [orderType, setOrderType] = useState<'LIMIT' | 'MARKET'>('LIMIT');
    const [amount, setAmount] = useState<string>('0.1');
    const [price, setPrice] = useState<string>('45000');
    const [leverage, setLeverage] = useState(1);

    // Positions State
    const [positions, setPositions] = useState([
        { id: 'pos_1', symbol: 'BTC/USD', side: 'LONG', size: 0.5, entry: 44200, leverage: 5, pnl: 400 },
        { id: 'pos_2', symbol: 'ETH/USD', side: 'SHORT', size: 10, entry: 2450, leverage: 10, pnl: 150 }
    ]);

    // Simulate Live Data
    useEffect(() => {
        const interval = setInterval(() => {
            const change = Math.random() * 20 - 10;
            const newPrice = btcPrice + change;
            setBtcPrice(newPrice);
            
            // Add to tape
            const newTrade: {price: number, size: number, side: 'BUY'|'SELL', time: string} = {
                price: newPrice,
                size: parseFloat((Math.random() * 2).toFixed(4)),
                side: Math.random() > 0.5 ? 'BUY' : 'SELL',
                time: new Date().toLocaleTimeString()
            };
            setTape(prev => [newTrade, ...prev].slice(0, 20));

            // Update PnL
            setPositions(prev => prev.map(p => {
                if(p.symbol === 'BTC/USD') {
                    const diff = newPrice - p.entry;
                    const pnl = p.side === 'LONG' ? diff * p.size * p.leverage : -diff * p.size * p.leverage;
                    return { ...p, pnl };
                }
                return p;
            }));

        }, 800);
        return () => clearInterval(interval);
    }, [btcPrice]);

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

    const handlePlaceOrder = () => {
        toast.success('Order Placed', `${orderSide} ${amount} BTC @ ${orderType === 'MARKET' ? 'Market' : price}`);
        if(orderType === 'MARKET') {
            setPositions(prev => [...prev, {
                id: `pos_${Date.now()}`,
                symbol: 'BTC/USD',
                side: orderSide === 'BUY' ? 'LONG' : 'SHORT',
                size: parseFloat(amount),
                entry: btcPrice,
                leverage: leverage,
                pnl: 0
            }]);
        }
    };

    const closePosition = (id: string) => {
        setPositions(prev => prev.filter(p => p.id !== id));
        toast.info('Position Closed', 'Realized PnL added to balance.');
    };

    return (
        <div className="h-[calc(100vh-100px)] p-2 flex flex-col gap-2 overflow-hidden rounded-2xl border border-white/5 bg-[#050505]">
            {/* 1. GLOBAL COMMAND BAR */}
            <div className="flex justify-between items-center bg-[#0A0A0C] p-3 rounded-xl border border-white/5 shrink-0">
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
                {/* LEFT COLUMN: Charting & Positions */}
                <div className="col-span-9 flex flex-col gap-2">
                    {/* Main Chart */}
                    <div className="flex-[2] neo-card p-4 relative flex flex-col min-h-0 bg-[#0A0A0C]">
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

                    {/* Active Positions Table */}
                    <div className="h-48 neo-card bg-[#0A0A0C] flex flex-col overflow-hidden">
                        <div className="p-2 border-b border-white/5 flex justify-between items-center">
                            <span className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2"><Layers size={12}/> Active Positions</span>
                            <span className="text-[10px] text-zinc-500">Unrealized PnL: {safeFormatCurrency(positions.reduce((acc, p) => acc + p.pnl, 0), 'USD')}</span>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <table className="w-full text-[10px] text-left">
                                <thead className="bg-white/5 text-zinc-500 uppercase font-mono">
                                    <tr>
                                        <th className="px-3 py-2">Symbol</th>
                                        <th className="px-3 py-2">Side</th>
                                        <th className="px-3 py-2">Size</th>
                                        <th className="px-3 py-2">Entry Price</th>
                                        <th className="px-3 py-2">Mark Price</th>
                                        <th className="px-3 py-2">Liq. Price</th>
                                        <th className="px-3 py-2 text-right">PnL (ROE%)</th>
                                        <th className="px-3 py-2 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {positions.map(pos => (
                                        <tr key={pos.id} className="hover:bg-white/5">
                                            <td className="px-3 py-2 font-bold text-white">{pos.symbol} <span className="text-zinc-500 bg-white/5 px-1 rounded">x{pos.leverage}</span></td>
                                            <td className={`px-3 py-2 font-bold ${pos.side === 'LONG' ? 'text-green-400' : 'text-rose-400'}`}>{pos.side}</td>
                                            <td className="px-3 py-2 font-mono text-zinc-300">{pos.size}</td>
                                            <td className="px-3 py-2 font-mono text-zinc-400">{pos.entry.toLocaleString()}</td>
                                            <td className="px-3 py-2 font-mono text-white">{btcPrice.toLocaleString()}</td>
                                            <td className="px-3 py-2 font-mono text-orange-400">{(pos.side === 'LONG' ? pos.entry * 0.8 : pos.entry * 1.2).toFixed(2)}</td>
                                            <td className={`px-3 py-2 text-right font-mono font-bold ${pos.pnl >= 0 ? 'text-green-400' : 'text-rose-400'}`}>
                                                {pos.pnl >= 0 ? '+' : ''}{pos.pnl.toFixed(2)} USD
                                            </td>
                                            <td className="px-3 py-2 text-right">
                                                <button onClick={() => closePosition(pos.id)} className="text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded transition-colors">Close</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Order Form & Tape */}
                <div className="col-span-3 flex flex-col gap-2">
                    {/* Order Book */}
                    <div className="h-64 neo-card bg-[#0A0A0C] overflow-hidden flex flex-col">
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
                            <div className="py-2 text-center text-lg font-bold text-white border-y border-white/10 my-1 bg-white/5">
                                {btcPrice.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1})} 
                                <ArrowRight size={12} className={`inline ml-1 ${btcPrice > 45000 ? 'text-green-500 rotate-[-45deg]' : 'text-rose-500 rotate-[45deg]'}`} />
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

                    {/* Order Entry */}
                    <div className="flex-1 neo-card bg-[#0A0A0C] p-4 flex flex-col border border-gold/10">
                        <div className="flex bg-black/40 rounded-lg p-1 mb-4 border border-white/10">
                            <button 
                                onClick={() => setOrderSide('BUY')}
                                className={`flex-1 py-2 text-xs font-bold rounded transition-colors ${orderSide === 'BUY' ? 'bg-green-600 text-white' : 'text-zinc-500 hover:text-white'}`}
                            >BUY / LONG</button>
                            <button 
                                onClick={() => setOrderSide('SELL')}
                                className={`flex-1 py-2 text-xs font-bold rounded transition-colors ${orderSide === 'SELL' ? 'bg-rose-600 text-white' : 'text-zinc-500 hover:text-white'}`}
                            >SELL / SHORT</button>
                        </div>

                        <div className="flex gap-2 mb-4 text-[10px] font-bold text-zinc-400">
                            {['LIMIT', 'MARKET', 'STOP'].map(t => (
                                <button 
                                    key={t} 
                                    onClick={() => setOrderType(t as any)}
                                    className={`px-2 py-1 rounded border ${orderType === t ? 'border-gold text-gold bg-gold/10' : 'border-white/10 hover:bg-white/5'}`}
                                >{t}</button>
                            ))}
                        </div>

                        <div className="space-y-3 mb-4">
                            <div>
                                <label className="text-[10px] text-zinc-500 uppercase font-bold">Price (USD)</label>
                                <input 
                                    type="number" 
                                    value={orderType === 'MARKET' ? btcPrice : price} 
                                    onChange={e => setPrice(e.target.value)}
                                    disabled={orderType === 'MARKET'}
                                    className="neo-input w-full px-3 py-2 rounded text-right font-mono text-sm" 
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-zinc-500 uppercase font-bold">Amount (BTC)</label>
                                <input 
                                    type="number" 
                                    value={amount} 
                                    onChange={e => setAmount(e.target.value)}
                                    className="neo-input w-full px-3 py-2 rounded text-right font-mono text-sm" 
                                />
                            </div>
                            
                            <div>
                                <div className="flex justify-between text-[10px] text-zinc-500 uppercase font-bold mb-1">
                                    <span>Leverage</span>
                                    <span className="text-white">{leverage}x</span>
                                </div>
                                <input 
                                    type="range" min="1" max="100" step="1" 
                                    value={leverage} 
                                    onChange={e => setLeverage(parseInt(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold"
                                />
                            </div>
                        </div>

                        <div className="mt-auto">
                            <div className="flex justify-between text-xs text-zinc-400 mb-2">
                                <span>Cost:</span>
                                <span className="text-white">{(parseFloat(amount) * (orderType === 'MARKET' ? btcPrice : parseFloat(price)) / leverage).toFixed(2)} USD</span>
                            </div>
                            <button 
                                onClick={handlePlaceOrder}
                                className={`w-full py-3 rounded-xl font-bold text-sm shadow-lg transition-all ${
                                    orderSide === 'BUY' 
                                    ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/20' 
                                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/20'
                                }`}
                            >
                                {orderSide} BTC
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
