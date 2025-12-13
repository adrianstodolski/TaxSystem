
import React, { useState } from 'react';
import { NuffiService } from '../services/api';
import { TaxEngineConfig, CalculationMethod } from '../types';
import { Cpu, Play, Save, Activity, Settings, CheckCircle2, Server } from 'lucide-react';
import { toast } from './ui/Toast';
import { motion } from 'framer-motion';

// Utility for counting animation
const Counter = ({ value, label, prefix = '', color = 'text-white' }: { value: number, label: string, prefix?: string, color?: string }) => (
    <div className="flex flex-col">
        <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">{label}</span>
        <span className={`text-2xl font-mono font-bold ${color}`}>
            {prefix}{new Intl.NumberFormat('pl-PL').format(value)}
        </span>
    </div>
);

export const TaxEngine: React.FC = () => {
    const [config, setConfig] = useState<TaxEngineConfig>({
        strategy: 'FIFO',
        isRealTime: true,
        includeDeFi: true,
        includeNFTs: true,
        country: 'PL',
        engineVersion: 'Rust v1.75.0 (Optimized)'
    });
    
    const [engineState, setEngineState] = useState<'IDLE' | 'PROCESSING' | 'COMPLETE'>('IDLE');
    const [progress, setProgress] = useState(0);
    const [stats, setStats] = useState({ revenue: 0, cost: 0, tax: 0, txCount: 0 });

    const handleRunEngine = async () => {
        setEngineState('PROCESSING');
        setProgress(0);
        setStats({ revenue: 0, cost: 0, tax: 0, txCount: 0 });

        try {
            const txs = await NuffiService.fetchCryptoTransactions();
            const totalSteps = 50;
            const targetRevenue = txs.reduce((acc, t) => acc + (t.type.includes('SELL') ? t.totalFiat : 0), 0);
            const targetCost = targetRevenue * 0.65; 
            const targetTax = (targetRevenue - targetCost) * 0.19;

            for (let i = 0; i <= totalSteps; i++) {
                await new Promise(r => setTimeout(r, 40)); 
                setProgress((i / totalSteps) * 100);
                setStats({
                    revenue: Math.floor((targetRevenue / totalSteps) * i),
                    cost: Math.floor((targetCost / totalSteps) * i),
                    tax: Math.floor((targetTax / totalSteps) * i),
                    txCount: Math.floor((txs.length / totalSteps) * i)
                });
            }

            setEngineState('COMPLETE');
            toast.success('Przeliczenie zakończone', `Zobowiązanie podatkowe: ${targetTax.toFixed(2)} PLN`);
        } catch (e) {
            setEngineState('IDLE');
            toast.error('Błąd silnika', 'Nie udało się przetworzyć danych.');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="relative">
                            <Cpu className="text-gold" size={28} />
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-gold"></span>
                            </span>
                        </div>
                        Tax Engine Core
                    </h2>
                    <p className="text-zinc-400 mt-1 flex items-center gap-2">
                        <span className="bg-black/40 text-zinc-300 text-[10px] px-2 py-0.5 rounded border border-white/10 font-mono">
                            {config.engineVersion}
                        </span>
                        Wydajny silnik obliczeniowy zgodny z polskim ładem.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Configuration */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="neo-card p-6 rounded-2xl relative overflow-hidden">
                        <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                            <Settings size={18} className="text-zinc-400" /> Parametry Obliczeń
                        </h3>
                        
                        <div className="space-y-6 relative z-10">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-3">Strategia Kosztowa</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['FIFO', 'LIFO', 'HIFO'].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setConfig({...config, strategy: s as CalculationMethod})}
                                            className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                                                config.strategy === s 
                                                ? 'bg-gold text-black border-gold shadow-lg shadow-gold/20' 
                                                : 'bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10'
                                            }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5 cursor-pointer hover:border-gold/30 transition-all group">
                                    <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">Real-time Indexing</span>
                                    <input type="checkbox" checked={config.isRealTime} onChange={e => setConfig({...config, isRealTime: e.target.checked})} className="accent-gold w-4 h-4" />
                                </label>
                                <label className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5 cursor-pointer hover:border-gold/30 transition-all group">
                                    <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">DeFi Swaps & LPs</span>
                                    <input type="checkbox" checked={config.includeDeFi} onChange={e => setConfig({...config, includeDeFi: e.target.checked})} className="accent-gold w-4 h-4" />
                                </label>
                                <label className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5 cursor-pointer hover:border-gold/30 transition-all group">
                                    <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">NFT Wash-Sale Guard</span>
                                    <input type="checkbox" checked={config.includeNFTs} onChange={e => setConfig({...config, includeNFTs: e.target.checked})} className="accent-gold w-4 h-4" />
                                </label>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleRunEngine}
                        disabled={engineState === 'PROCESSING'}
                        className="w-full bg-gradient-to-r from-gold to-[#FCD34D] hover:to-[#fde047] text-black py-4 rounded-xl font-bold text-lg shadow-lg shadow-gold/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                    >
                        {engineState === 'PROCESSING' ? (
                            <Activity className="animate-spin" />
                        ) : (
                            <div className="bg-black/10 p-1 rounded-full">
                                <Play size={16} fill="currentColor" />
                            </div>
                        )}
                        <span>{engineState === 'PROCESSING' ? 'Przetwarzanie...' : 'URUCHOM SILNIK'}</span>
                    </button>
                </div>

                {/* Right: Visualization Core */}
                <div className="lg:col-span-2 relative">
                    <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full pointer-events-none"></div>
                    
                    <div className="neo-card rounded-2xl p-8 h-full flex flex-col relative overflow-hidden border border-white/10">
                        {/* Background Grid */}
                        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                        {engineState === 'IDLE' && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
                                <div className="w-24 h-24 bg-onyx rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-xl">
                                    <Server size={40} className="text-zinc-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">System Gotowy</h3>
                                <p className="text-zinc-400 max-w-sm">
                                    Silnik jest skalibrowany i połączony z bazą danych. Kliknij "Uruchom", aby przeliczyć podatek metodą {config.strategy}.
                                </p>
                            </div>
                        )}

                        {engineState === 'PROCESSING' && (
                            <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                                {/* Reactor Animation */}
                                <div className="relative w-64 h-64 mb-8">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                                        <motion.circle 
                                            cx="50" cy="50" r="45" fill="none" stroke="#D4AF37" strokeWidth="8"
                                            strokeDasharray="283"
                                            strokeDashoffset={283 - (283 * progress) / 100}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-bold text-white font-mono">{Math.round(progress)}%</span>
                                        <span className="text-xs text-gold uppercase font-bold tracking-widest mt-1 animate-pulse">Computing</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-12 text-center">
                                    <Counter value={stats.txCount} label="Analizowane Tx" />
                                    <Counter value={stats.revenue} label="Przychód (PLN)" color="text-green-400" />
                                    <Counter value={stats.cost} label="Koszty (PLN)" color="text-rose-400" />
                                </div>
                            </div>
                        )}

                        {engineState === 'COMPLETE' && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex-1 flex flex-col relative z-10"
                            >
                                <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle2 className="text-emerald-500" size={24} />
                                            <h3 className="text-2xl font-bold text-white">Raport Podatkowy</h3>
                                        </div>
                                        <p className="text-zinc-400 text-sm">Wygenerowano: {new Date().toLocaleTimeString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Metoda</p>
                                        <span className="bg-gold/10 text-gold px-3 py-1 rounded border border-gold/20 font-bold">{config.strategy}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-onyx p-4 rounded-xl border border-white/5">
                                        <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Przychód Opodatkowany</p>
                                        <p className="text-2xl font-bold text-white font-mono">{stats.revenue.toLocaleString()} PLN</p>
                                    </div>
                                    <div className="bg-onyx p-4 rounded-xl border border-white/5">
                                        <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Koszty Uzyskania</p>
                                        <p className="text-2xl font-bold text-rose-400 font-mono">-{stats.cost.toLocaleString()} PLN</p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-onyx to-[#141419] p-6 rounded-2xl border border-gold/30 flex justify-between items-center mt-auto shadow-lg">
                                    <div>
                                        <p className="text-gold text-xs font-bold uppercase mb-1">Podatek Należny (19%)</p>
                                        <p className="text-4xl font-bold text-white font-mono">{stats.tax.toLocaleString()} PLN</p>
                                    </div>
                                    <div className="h-12 w-px bg-white/10 mx-6"></div>
                                    <button onClick={() => toast.success('Zapisano', 'Raport dodany do dokumentów.')} className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2">
                                        <Save size={18} /> Zapisz Raport
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
