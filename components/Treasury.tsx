
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { ExchangeRate, FxPosition, LedgerEntry } from '../types';
import { TrendingUp, TrendingDown, RefreshCw, ArrowRightLeft, DollarSign, Activity, PieChart, Shield, Lock, ArrowUpRight, ArrowDownRight, Loader2, BookOpen } from 'lucide-react';
import { toast } from './ui/Toast';
import { Modal } from './ui/Modal';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Pie, PieChart as RePie } from 'recharts';

export const Treasury: React.FC = () => {
    const [rates, setRates] = useState<ExchangeRate[]>([]);
    const [positions, setPositions] = useState<FxPosition[]>([]);
    const [ledger, setLedger] = useState<LedgerEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'FX' | 'LEDGER'>('FX');

    // Swap State
    const [swapAmount, setSwapAmount] = useState('');
    const [selectedPair, setSelectedPair] = useState('EUR/PLN');
    const [swapSide, setSwapSide] = useState<'BUY' | 'SELL'>('BUY');
    const [isSwapping, setIsSwapping] = useState(false);

    useEffect(() => {
        const load = async () => {
            const [r, p, l] = await Promise.all([
                NuffiService.fetchExchangeRates(),
                NuffiService.fetchFxPositions(),
                NuffiService.fetchLedgerEntries()
            ]);
            setRates(r);
            setPositions(p);
            setLedger(l);
            setLoading(false);
        };
        load();
        const interval = setInterval(async () => {
            const r = await NuffiService.fetchExchangeRates();
            setRates(r);
        }, 5000); // Live ticker
        return () => clearInterval(interval);
    }, []);

    const handleSwap = async () => {
        if(!swapAmount) return;
        setIsSwapping(true);
        await NuffiService.executeFxSwap(selectedPair, parseFloat(swapAmount), swapSide);
        toast.success('Zlecenie zrealizowane', `Wymieniono ${swapAmount} ${selectedPair.substring(0,3)} po kursie rynkowym.`);
        setIsSwapping(false);
        setSwapAmount('');
    };

    const formatRate = (val: number) => val.toFixed(4);
    const formatCurrency = (val: number, curr: string) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: curr }).format(val);

    const getChartData = () => {
        // Mock chart data for selected pair
        const base = 4.30;
        return Array.from({length: 20}, (_, i) => ({
            time: `${i}:00`,
            value: base + (Math.random() * 0.05 - 0.025)
        }));
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Activity className="text-indigo-600" /> Nuffi Treasury
                    </h2>
                    <p className="text-slate-500 mt-1">Trading desk, zarządzanie ryzykiem walutowym i FX Spot.</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setActiveTab('FX')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'FX' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                    >
                        FX Dealer
                    </button>
                    <button 
                        onClick={() => setActiveTab('LEDGER')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'LEDGER' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                    >
                        <BookOpen size={16} /> Ledger (Modern Treasury)
                    </button>
                </div>
            </header>

            {activeTab === 'FX' && (
                <>
                    {/* LIVE TICKER */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {rates.map(rate => (
                            <div key={rate.pair} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-slate-700">{rate.pair}</h3>
                                    <span className={`text-xs font-bold flex items-center gap-1 ${rate.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {rate.changePercent >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                        {rate.changePercent > 0 ? '+' : ''}{rate.changePercent}%
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold font-mono text-slate-900">{formatRate(rate.mid)}</span>
                                    <span className="text-xs text-slate-400">PLN</span>
                                </div>
                                <div className="mt-3 flex justify-between text-[10px] text-slate-500 font-mono">
                                    <span>Bid: {formatRate(rate.bid)}</span>
                                    <span>Ask: {formatRate(rate.ask)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* TRADING DESK */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    <ArrowRightLeft className="text-slate-400" /> FX Spot Dealer
                                </h3>
                                <div className="flex bg-slate-100 rounded-lg p-1">
                                    {rates.map(r => (
                                        <button 
                                            key={r.pair}
                                            onClick={() => setSelectedPair(r.pair)}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${selectedPair === r.pair ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            {r.pair}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Chart */}
                                <div className="h-64 bg-slate-50 rounded-xl border border-slate-200 p-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={getChartData()}>
                                            <defs>
                                                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                                                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                            <XAxis dataKey="time" hide />
                                            <YAxis domain={['auto', 'auto']} hide />
                                            <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                                            <Area type="monotone" dataKey="value" stroke="#4F46E5" fill="url(#colorVal)" strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Order Form */}
                                <div className="space-y-6">
                                    <div className="flex bg-slate-100 p-1 rounded-xl">
                                        <button 
                                            onClick={() => setSwapSide('BUY')}
                                            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${swapSide === 'BUY' ? 'bg-green-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            KUP (Buy)
                                        </button>
                                        <button 
                                            onClick={() => setSwapSide('SELL')}
                                            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${swapSide === 'SELL' ? 'bg-red-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            SPRZEDAJ (Sell)
                                        </button>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Kwota ({selectedPair.split('/')[0]})</label>
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                value={swapAmount}
                                                onChange={e => setSwapAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full pl-4 pr-16 py-4 bg-slate-50 border border-slate-200 rounded-xl text-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">{selectedPair.split('/')[0]}</span>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                                        <span className="text-sm font-medium text-slate-500">Szacowany Kurs</span>
                                        <span className="text-lg font-bold font-mono text-slate-900">
                                            {formatRate(rates.find(r => r.pair === selectedPair)?.mid || 0)}
                                        </span>
                                    </div>

                                    <button 
                                        onClick={handleSwap}
                                        disabled={isSwapping || !swapAmount}
                                        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                                            swapSide === 'BUY' 
                                                ? 'bg-green-600 hover:bg-green-500 shadow-green-200' 
                                                : 'bg-red-600 hover:bg-red-500 shadow-red-200'
                                        }`}
                                    >
                                        {isSwapping ? <Loader2 className="animate-spin" /> : 'ZŁÓŻ ZLECENIE'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* POSITIONS & EXPOSURE */}
                        <div className="space-y-6">
                            {/* Exposure Card */}
                            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="font-bold flex items-center gap-2 mb-4">
                                        <PieChart size={18} className="text-indigo-400" /> Ekspozycja Walutowa
                                    </h3>
                                    <div className="space-y-4">
                                        {positions.map(pos => (
                                            <div key={pos.id}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="font-medium text-slate-300">{pos.pair.split('/')[0]} ({pos.type})</span>
                                                    <span className="font-mono">{formatCurrency(pos.valuePln, 'PLN')}</span>
                                                </div>
                                                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full ${pos.unrealizedPnL >= 0 ? 'bg-green-500' : 'bg-red-500'}`} 
                                                        style={{width: '70%'}}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-700 flex justify-between items-center">
                                        <span className="text-xs text-slate-400">Total Unrealized PnL</span>
                                        <span className={`font-bold font-mono ${
                                            positions.reduce((acc, p) => acc + p.unrealizedPnL, 0) >= 0 ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                            {formatCurrency(positions.reduce((acc, p) => acc + p.unrealizedPnL, 0), 'PLN')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Active Hedges */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Shield size={18} className="text-slate-400" /> Otwarte Pozycje
                                </h3>
                                <div className="space-y-3">
                                    {positions.map(pos => (
                                        <div key={pos.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${pos.type === 'LONG' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {pos.type}
                                                    </span>
                                                    <span className="font-bold text-slate-700 text-sm">{pos.pair}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1 font-mono">Avg: {pos.avgRate}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-slate-900 text-sm">{formatCurrency(pos.amount, pos.pair.split('/')[0])}</p>
                                                <p className={`text-xs font-mono font-bold ${pos.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {pos.unrealizedPnL > 0 ? '+' : ''}{pos.unrealizedPnL.toFixed(2)} PLN
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'LEDGER' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    Double-Entry Ledger
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    Powered by Modern Treasury API.
                                </p>
                            </div>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                                LIVE SYNC
                            </span>
                        </div>
                    </div>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 font-medium">Data</th>
                                <th className="px-6 py-3 font-medium">Provider</th>
                                <th className="px-6 py-3 font-medium">Metadata</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium text-right">Debit</th>
                                <th className="px-6 py-3 font-medium text-right">Credit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {ledger.map(entry => (
                                <tr key={entry.id} className="hover:bg-slate-50 font-mono">
                                    <td className="px-6 py-4 text-slate-600">{entry.date}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-[10px] font-bold border border-indigo-100">
                                            {entry.provider}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500">
                                        {JSON.stringify(entry.metadata)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-green-600">{entry.status}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {entry.direction === 'DEBIT' ? formatCurrency(entry.amount, entry.currency) : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {entry.direction === 'CREDIT' ? formatCurrency(entry.amount, entry.currency) : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
