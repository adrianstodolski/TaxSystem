
import React, { useEffect, useState, useMemo } from 'react';
import { NuffiService } from '../services/api';
import { TaxOptimizationOpportunity } from '../types';
import { Magnet, TrendingDown, ArrowRight, AlertTriangle, CheckCircle2, RefreshCw, Loader2, Coins, LineChart, Calculator, X, Save } from 'lucide-react';
import { toast } from './ui/Toast';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ReferenceLine } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

export const TaxOptimizer: React.FC = () => {
    const [opportunities, setOpportunities] = useState<TaxOptimizationOpportunity[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Simulation State
    const [harvestBasket, setHarvestBasket] = useState<string[]>([]); // IDs of selected assets
    const [currentTaxLiability, setCurrentTaxLiability] = useState(15000); // Mock starting tax

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchTaxOptimizationOpportunities();
            setOpportunities(data);
            setLoading(false);
        };
        load();
    }, []);

    const toggleAssetInBasket = (id: string) => {
        setHarvestBasket(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleExecuteHarvest = async () => {
        if (harvestBasket.length === 0) return;
        toast.info('Przetwarzanie', 'Generowanie zleceń sprzedaży dla wybranych aktywów...');
        await new Promise(r => setTimeout(r, 2000));
        toast.success('Zrealizowano', `Zaksięgowano stratę podatkową. Twój podatek spadł o ${formatCurrency(basketSavings)}.`);
        setHarvestBasket([]);
    };

    const formatCurrency = (val: number, curr = 'PLN') => {
        return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: curr, maximumFractionDigits: 0 }).format(val);
    };

    // Calculations
    const basketLoss = opportunities
        .filter(o => harvestBasket.includes(o.id))
        .reduce((acc, o) => acc + o.unrealizedLoss, 0);
    
    const basketSavings = opportunities
        .filter(o => harvestBasket.includes(o.id))
        .reduce((acc, o) => acc + o.potentialTaxSavings, 0);

    const projectedTax = Math.max(0, currentTaxLiability - basketSavings);

    // Chart Data for Waterfall
    const chartData = [
        { name: 'Obecny Podatek', value: currentTaxLiability, fill: '#EF4444' }, // Red
        { name: 'Odzysk (Harvest)', value: -basketSavings, fill: '#10B981' }, // Green
        { name: 'Podatek po Opt.', value: projectedTax, fill: '#3B82F6' } // Blue
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Magnet className="text-gold" /> Tax Alpha Terminal
                    </h2>
                    <p className="text-zinc-400 mt-1">
                        Aktywne zarządzanie stratą (Tax Loss Harvesting). Wybierz pozycje do zamknięcia, aby obniżyć podatek.
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-mono text-zinc-300">
                        ROK PODATKOWY: 2024
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT: Assets List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <TrendingDown className="text-rose-400" /> Dostępne do realizacji (Unrealized Losses)
                        </h3>
                        <span className="text-xs text-zinc-500 bg-white/5 px-2 py-1 rounded border border-white/5">
                            {opportunities.length} pozycji
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {loading ? <div className="p-12 text-center"><Loader2 className="animate-spin text-gold mx-auto" /></div> : 
                            opportunities.map(opp => {
                                const isSelected = harvestBasket.includes(opp.id);
                                return (
                                    <motion.div 
                                        key={opp.id}
                                        layout
                                        onClick={() => toggleAssetInBasket(opp.id)}
                                        className={`p-6 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${
                                            isSelected 
                                            ? 'bg-indigo-600/10 border-indigo-500 shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)]' 
                                            : 'bg-[#0A0A0C] border-white/5 hover:border-white/20'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start relative z-10">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-xl border ${opp.type === 'CRYPTO' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                                                    {opp.type === 'CRYPTO' ? <Coins size={20} /> : <LineChart size={20} />}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white text-lg">{opp.asset}</h4>
                                                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                                                        <span className="font-mono">Kupno: {opp.purchasePrice}</span>
                                                        <ArrowRight size={10} />
                                                        <span className="font-mono text-white">Teraz: {opp.currentPrice}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Potencjalna Strata</p>
                                                <p className="font-bold text-rose-400 text-xl font-mono">{formatCurrency(-opp.unrealizedLoss)}</p>
                                                <div className="flex items-center justify-end gap-1 mt-1 text-emerald-400 text-xs font-bold">
                                                    <Magnet size={10} /> Oszczędzasz: {formatCurrency(opp.potentialTaxSavings)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Selection Indicator */}
                                        <div className={`absolute top-4 right-4 transition-all duration-300 ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                                            <div className="bg-indigo-500 text-white p-1 rounded-full shadow-lg">
                                                <CheckCircle2 size={16} />
                                            </div>
                                        </div>

                                        {/* Strategy Badge */}
                                        <div className="mt-4 flex items-center gap-2">
                                            <span className="text-[10px] font-bold bg-white/5 text-zinc-400 px-2 py-1 rounded border border-white/5 uppercase tracking-wide">
                                                {opp.strategy.replace('_', ' ')}
                                            </span>
                                            {opp.strategy === 'WASH_SALE_AVOIDANCE' && (
                                                <span className="text-[10px] text-amber-500 flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 font-bold">
                                                    <AlertTriangle size={10} /> 30-Day Lockout
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })
                        }
                    </div>
                </div>

                {/* RIGHT: Simulation Engine */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 space-y-6">
                        
                        {/* Waterfall Chart Card */}
                        <div className="neo-card p-6 rounded-2xl bg-gradient-to-b from-[#0A0A0C] to-[#141419] border-t-4 border-t-indigo-500 shadow-xl">
                            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                                <Calculator size={18} className="text-zinc-400" /> Symulacja Podatkowa
                            </h3>
                            
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="name" fontSize={10} tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} interval={0} />
                                        <Tooltip 
                                            cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                            contentStyle={{backgroundColor: '#0A0A0C', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff'}}
                                            formatter={(value: number) => formatCurrency(value)}
                                        />
                                        <ReferenceLine y={0} stroke="#333" />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mt-6 space-y-3 border-t border-white/5 pt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-400">Wybrane pozycje:</span>
                                    <span className="text-white font-bold">{harvestBasket.length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-400">Realizowana strata:</span>
                                    <span className="text-rose-400 font-mono font-bold">{formatCurrency(basketLoss)}</span>
                                </div>
                                <div className="flex justify-between text-lg bg-indigo-500/10 p-3 rounded-lg border border-indigo-500/20">
                                    <span className="text-indigo-300 font-bold">Oszczędzasz:</span>
                                    <span className="text-emerald-400 font-mono font-bold">{formatCurrency(basketSavings)}</span>
                                </div>
                            </div>

                            <button 
                                onClick={handleExecuteHarvest}
                                disabled={harvestBasket.length === 0}
                                className="w-full bg-gold text-black py-4 rounded-xl font-bold mt-6 hover:bg-[#FCD34D] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <RefreshCw size={18} /> Wykonaj Transakcje
                            </button>
                            <p className="text-[10px] text-center text-zinc-500 mt-2">
                                Automatycznie wystawi zlecenia sprzedaży na giełdach.
                            </p>
                        </div>

                        {/* Education / Tip */}
                        <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 flex gap-3">
                            <div className="shrink-0 mt-1 text-blue-400"><CheckCircle2 size={18} /></div>
                            <div>
                                <h4 className="text-blue-300 text-sm font-bold">Zasada FIFO</h4>
                                <p className="text-xs text-blue-200/70 mt-1">
                                    Nuffi automatycznie dobiera najdroższe partie (HIFO) w ramach symulacji, aby zmaksymalizować stratę podatkową.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
