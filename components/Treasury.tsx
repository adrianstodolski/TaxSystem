
import React, { useEffect, useState, useMemo } from 'react';
import { NuffiService } from '../services/api';
import { ExchangeRate, FxPosition, LedgerEntry } from '../types';
import { TrendingUp, TrendingDown, ArrowRightLeft, Activity, Shield, Lock, BookOpen, Loader2 } from 'lucide-react';
import { toast } from './ui/Toast';
import { FinancialChart } from './ui/FinancialChart';
import { motion } from 'framer-motion';

export const Treasury: React.FC = () => {
    const [rates, setRates] = useState<ExchangeRate[]>([]);
    const [positions, setPositions] = useState<FxPosition[]>([]);
    const [ledger, setLedger] = useState<LedgerEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'FX' | 'LEDGER'>('FX');
    const [selectedPair, setSelectedPair] = useState('EUR/PLN');
    const [swapAmount, setSwapAmount] = useState('');
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
    }, []);

    // Mock Chart Data Generator for TradingView - Memoized
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

    const formatRate = (val: number) => val.toFixed(4);
    const formatCurrency = (val: number, curr: string) => 
        new Intl.NumberFormat('pl-PL', { style: 'currency', currency: curr }).format(val);

    return (
        <div className="space-y-6 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Activity className="text-indigo-400" /> Nuffi Treasury
                    </h2>
                    <p className="text-slate-400 mt-1">Trading desk, zarządzanie ryzykiem walutowym i FX Spot.</p>
                </div>
                <div className="flex gap-2 bg-slate-900 p-1 rounded-lg border border-white/10">
                    <button onClick={() => setActiveTab('FX')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'FX' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>FX Dealer</button>
                    <button onClick={() => setActiveTab('LEDGER')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'LEDGER' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>Ledger</button>
                </div>
            </header>

            {activeTab === 'FX' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    {/* Live Ticker */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {rates.map(rate => (
                            <div key={rate.pair} className="glass-card p-4 rounded-xl hover:border-indigo-500/30 transition-all cursor-pointer" onClick={() => setSelectedPair(rate.pair)}>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-bold text-white">{rate.pair}</h3>
                                    <span className={`text-xs font-bold ${rate.changePercent >= 0 ? 'text-green-400' : 'text-rose-400'}`}>
                                        {rate.changePercent > 0 ? '+' : ''}{rate.changePercent}%
                                    </span>
                                </div>
                                <span className="text-2xl font-bold font-mono text-white">{formatRate(rate.mid)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* TradingView Chart */}
                        <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <ArrowRightLeft className="text-indigo-400" /> {selectedPair} Chart
                                </h3>
                            </div>
                            <div className="h-[350px] w-full">
                                <FinancialChart 
                                    data={chartData} 
                                    type="AREA" 
                                    height={350}
                                    colors={{ lineColor: '#10b981', topColor: 'rgba(16, 185, 129, 0.4)', bottomColor: 'rgba(16, 185, 129, 0)' }} 
                                />
                            </div>
                        </div>

                        {/* Order Form */}
                        <div className="glass-card p-6 rounded-2xl flex flex-col justify-center space-y-6">
                            <h3 className="font-bold text-white">Wymiana Walut (Spot)</h3>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase">Sprzedaję</label>
                                <input 
                                    type="number" 
                                    value={swapAmount}
                                    onChange={e => setSwapAmount(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-2xl font-bold text-white mt-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="text-center text-slate-500"><ArrowRightLeft className="mx-auto rotate-90" /></div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase">Kupuję (Est.)</label>
                                <div className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-2xl font-bold text-emerald-400 mt-2 font-mono">
                                    {(parseFloat(swapAmount || '0') / 4.35).toFixed(2)}
                                </div>
                            </div>
                            <button 
                                onClick={handleSwap}
                                disabled={isSwapping || !swapAmount}
                                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-900/50 transition-all flex items-center justify-center gap-2"
                            >
                                {isSwapping ? <Loader2 className="animate-spin" /> : 'ZATWIERDZ'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};
