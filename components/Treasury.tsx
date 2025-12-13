
import React, { useEffect, useState, useMemo } from 'react';
import { NuffiService } from '../services/api';
import { ExchangeRate, FxPosition, LedgerEntry } from '../types';
import { TrendingUp, ArrowRightLeft, Activity, Shield, BarChart3, Wallet, Globe, ArrowRight } from 'lucide-react';
import { toast } from './ui/Toast';
import { FinancialChart } from './ui/FinancialChart';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend } from 'recharts';

export const Treasury: React.FC = () => {
    const [rates, setRates] = useState<ExchangeRate[]>([]);
    const [positions, setPositions] = useState<FxPosition[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'FX_DEALER'>('DASHBOARD');
    
    // FX Dealer State
    const [selectedPair, setSelectedPair] = useState('EUR/PLN');
    const [swapAmount, setSwapAmount] = useState('');
    const [isSwapping, setIsSwapping] = useState(false);

    useEffect(() => {
        const load = async () => {
            const [r, p] = await Promise.all([
                NuffiService.fetchExchangeRates(),
                NuffiService.fetchFxPositions()
            ]);
            setRates(r);
            setPositions(p);
            setLoading(false);
        };
        load();
    }, []);

    // Mock Cash Flow Stream Data
    const cashFlowData = [
        { month: 'Sty', inflows: 150000, outflows: 90000, net: 60000 },
        { month: 'Lut', inflows: 180000, outflows: 95000, net: 85000 },
        { month: 'Mar', inflows: 140000, outflows: 110000, net: 30000 },
        { month: 'Kwi', inflows: 210000, outflows: 100000, net: 110000 },
        { month: 'Maj', inflows: 190000, outflows: 92000, net: 98000 },
        { month: 'Cze', inflows: 250000, outflows: 150000, net: 100000 }, // Tax month
    ];

    const chartData = useMemo(() => {
        const base = 4.30;
        const now = Math.floor(Date.now() / 1000);
        return Array.from({length: 100}, (_, i) => ({
            time: now - (100 - i) * 3600, // Hourly
            value: base + Math.sin(i * 0.1) * 0.05 + (Math.random() * 0.02)
        }));
    }, []);

    const handleSwap = async () => {
        if(!swapAmount) return;
        setIsSwapping(true);
        await new Promise(r => setTimeout(r, 1000));
        toast.success('Zlecenie zrealizowane', `Wymieniono ${swapAmount} po kursie rynkowym.`);
        setIsSwapping(false);
        setSwapAmount('');
    };

    const formatCurrency = (val: number, curr = 'PLN') => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: curr, maximumFractionDigits: 0 }).format(val);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Activity className="text-indigo-400" /> Liquidity Command
                    </h2>
                    <p className="text-zinc-400 mt-1">Zarządzanie płynnością, ryzykiem walutowym i prognozowanie przepływów (Cash Flow).</p>
                </div>
                <div className="flex gap-2 bg-onyx p-1 rounded-xl border border-white/10">
                    <button onClick={() => setActiveTab('DASHBOARD')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'DASHBOARD' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}>Pulpit Płynności</button>
                    <button onClick={() => setActiveTab('FX_DEALER')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'FX_DEALER' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}>FX Dealer</button>
                </div>
            </header>

            {activeTab === 'DASHBOARD' && (
                <div className="space-y-8">
                    {/* Top Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="neo-card p-6 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-onyx border-indigo-500/20">
                            <p className="text-xs font-bold text-zinc-400 uppercase">Dostępna Gotówka (Total)</p>
                            <h3 className="text-3xl font-bold text-white mt-2 font-mono">{formatCurrency(450000)}</h3>
                            <div className="mt-3 flex gap-2">
                                <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-zinc-300">PLN: 65%</span>
                                <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-zinc-300">EUR: 25%</span>
                                <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-zinc-300">USD: 10%</span>
                            </div>
                        </div>
                        <div className="neo-card p-6 rounded-2xl">
                            <p className="text-xs font-bold text-zinc-400 uppercase">Runway (Miesiące)</p>
                            <h3 className="text-3xl font-bold text-white mt-2 font-mono">14.5</h3>
                            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1"><TrendingUp size={12} /> Bezpieczny poziom</p>
                        </div>
                        <div className="neo-card p-6 rounded-2xl">
                            <p className="text-xs font-bold text-zinc-400 uppercase">Ekspozycja Walutowa</p>
                            <h3 className="text-3xl font-bold text-amber-400 mt-2 font-mono">{formatCurrency(157000)}</h3>
                            <p className="text-xs text-zinc-500 mt-1">Niezabezpieczona (Unhedged)</p>
                        </div>
                    </div>

                    {/* Cash Flow Stream Chart */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 neo-card p-8 rounded-2xl">
                            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                                <BarChart3 size={18} className="text-gold" /> Cash Flow Stream (H1 2024)
                            </h3>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cashFlowData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v/1000}k`} />
                                        <Tooltip 
                                            contentStyle={{backgroundColor: '#0A0A0C', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff'}}
                                            formatter={(value: number) => formatCurrency(value)}
                                        />
                                        <Legend />
                                        <Bar dataKey="inflows" fill="#10b981" radius={[4, 4, 0, 0]} name="Wpływy" barSize={12} />
                                        <Bar dataKey="outflows" fill="#ef4444" radius={[4, 4, 0, 0]} name="Wydatki" barSize={12} />
                                        <Bar dataKey="net" fill="#D4AF37" radius={[4, 4, 0, 0]} name="Netto" barSize={12} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* FX Risk Matrix */}
                        <div className="neo-card p-6 rounded-2xl flex flex-col">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                <Globe size={18} className="text-zinc-400" /> FX Risk Matrix
                            </h3>
                            <div className="flex-1 space-y-4">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-white text-sm">EUR / PLN</span>
                                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">HIGH RISK</span>
                                    </div>
                                    <p className="text-xs text-zinc-400 mb-2">Duże faktury zakupowe w EUR. Słaby PLN zwiększa koszty.</p>
                                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-red-500 h-full" style={{width: '75%'}}></div>
                                    </div>
                                </div>

                                <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-white text-sm">USD / PLN</span>
                                        <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">MEDIUM</span>
                                    </div>
                                    <p className="text-xs text-zinc-400 mb-2">Subskrypcje w USD. Stabilny kurs.</p>
                                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-amber-500 h-full" style={{width: '45%'}}></div>
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => setActiveTab('FX_DEALER')}
                                className="mt-4 w-full bg-white/5 border border-white/10 text-white py-3 rounded-xl font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                            >
                                <Shield size={16} /> Zabezpiecz Kurs (Hedge)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'FX_DEALER' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    {/* Rates Ticker */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {rates.map(rate => (
                            <div 
                                key={rate.pair} 
                                onClick={() => setSelectedPair(rate.pair)}
                                className={`cursor-pointer p-4 rounded-xl border transition-all ${selectedPair === rate.pair ? 'bg-indigo-600/10 border-indigo-500 text-white' : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'}`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-sm">{rate.pair}</span>
                                    <span className={`text-[10px] font-bold ${rate.changePercent >= 0 ? 'text-green-400' : 'text-rose-400'}`}>
                                        {rate.changePercent > 0 ? '+' : ''}{rate.changePercent}%
                                    </span>
                                </div>
                                <span className="text-2xl font-mono font-bold tracking-tight">{rate.mid.toFixed(4)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Chart */}
                        <div className="lg:col-span-2 neo-card rounded-2xl overflow-hidden p-6 bg-[#0A0A0C]">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <Activity className="text-indigo-400" /> {selectedPair} Spot Rate
                                </h3>
                                <div className="flex gap-2 text-xs">
                                    <span className="bg-white/10 px-2 py-1 rounded text-white">1H</span>
                                    <span className="bg-transparent px-2 py-1 rounded text-zinc-500 hover:text-white cursor-pointer">1D</span>
                                    <span className="bg-transparent px-2 py-1 rounded text-zinc-500 hover:text-white cursor-pointer">1W</span>
                                </div>
                            </div>
                            <div className="h-[350px] w-full">
                                <FinancialChart 
                                    data={chartData} 
                                    type="AREA" 
                                    height={350}
                                    colors={{ lineColor: '#10b981', topColor: 'rgba(16, 185, 129, 0.2)', bottomColor: 'rgba(16, 185, 129, 0)' }} 
                                />
                            </div>
                        </div>

                        {/* Order Pad */}
                        <div className="neo-card p-6 rounded-2xl flex flex-col justify-center">
                            <h3 className="font-bold text-white mb-6">Wymiana Walut (Spot)</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs text-zinc-400 mb-1">
                                        <label className="font-bold uppercase">Sprzedaję</label>
                                        <span>Saldo: 45,000 PLN</span>
                                    </div>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            value={swapAmount}
                                            onChange={e => setSwapAmount(e.target.value)}
                                            className="neo-input w-full p-4 rounded-xl text-xl font-bold font-mono text-white pr-16"
                                            placeholder="0.00"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">PLN</span>
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <div className="bg-black/40 p-2 rounded-full border border-white/10 text-zinc-400">
                                        <ArrowRightLeft className="rotate-90" size={20} />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs text-zinc-400 mb-1">
                                        <label className="font-bold uppercase">Kupuję (Est.)</label>
                                        <span>Kurs: 4.3521</span>
                                    </div>
                                    <div className="relative">
                                        <div className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-xl font-bold text-emerald-400 font-mono flex items-center">
                                            {(parseFloat(swapAmount || '0') / 4.3521).toFixed(2)}
                                        </div>
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500/50 font-bold">EUR</span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleSwap}
                                disabled={isSwapping || !swapAmount}
                                className="w-full mt-8 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSwapping ? 'Przetwarzanie...' : 'ZATWIERDZ WYMIANĘ'} <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};
