
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { TaxOptimizationOpportunity } from '../types';
import { Magnet, TrendingDown, ArrowRight, AlertTriangle, CheckCircle2, RefreshCw, Loader2, Coins, LineChart } from 'lucide-react';
import { toast } from './ui/Toast';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

export const TaxOptimizer: React.FC = () => {
    const [opportunities, setOpportunities] = useState<TaxOptimizationOpportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [simulating, setSimulating] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchTaxOptimizationOpportunities();
            setOpportunities(data);
            setLoading(false);
        };
        load();
    }, []);

    const handleSimulate = async (opp: TaxOptimizationOpportunity) => {
        setSimulating(opp.id);
        await new Promise(r => setTimeout(r, 1500));
        setSimulating(null);
        toast.success('Symulacja sprzedaży', `Sprzedaż ${opp.quantity} ${opp.asset} wygeneruje stratę ${opp.unrealizedLoss} PLN i obniży podatek o ${opp.potentialTaxSavings} PLN.`);
    };

    const formatCurrency = (val: number, curr = 'PLN') => {
        try {
            return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: curr, maximumFractionDigits: 0 }).format(val);
        } catch (e) {
            return `${val.toLocaleString('pl-PL', { maximumFractionDigits: 0 })} ${curr}`;
        }
    };

    const totalPotentialSavings = opportunities.reduce((acc, o) => acc + o.potentialTaxSavings, 0);
    const totalUnrealizedLoss = opportunities.reduce((acc, o) => acc + o.unrealizedLoss, 0);

    const chartData = [
        { name: 'Podatek Brutto (Est.)', value: 15000, color: '#EF4444' }, // Mock current tax
        { name: 'Harvesting (Strata)', value: -totalUnrealizedLoss, color: '#10B981' },
        { name: 'Podatek Netto (Est.)', value: 15000 - (totalUnrealizedLoss * 0.19), color: '#3B82F6' } // Approx
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Magnet className="text-indigo-600" /> Tax Optimizer (Auto-Hedging)
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Strategie Tax Loss Harvesting. Zredukuj podatek od zysków kapitałowych realizując straty.
                    </p>
                </div>
            </header>

            {/* Hero Stats */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-2">Potencjalna Oszczędność Podatkowa</p>
                        <h3 className="text-5xl font-bold tracking-tight text-green-400">{formatCurrency(totalPotentialSavings)}</h3>
                        <p className="text-sm text-indigo-300 mt-2">Dostępna do końca roku podatkowego.</p>
                    </div>
                    <div className="flex flex-col justify-center border-l border-white/10 pl-8">
                        <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Do "wyciągnięcia" (Unrealized Loss)</p>
                        <h3 className="text-2xl font-bold text-white">{formatCurrency(totalUnrealizedLoss)}</h3>
                    </div>
                    <div className="flex flex-col justify-center border-l border-white/10 pl-8">
                        <button className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-lg">
                            <RefreshCw size={18} /> Odśwież pozycje
                        </button>
                    </div>
                </div>
                {/* Background Pattern */}
                <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Opportunities List */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <TrendingDown className="text-slate-400" /> Pozycje Stratne (Harvesting Opportunities)
                        </h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {loading ? <div className="p-8 text-center"><Loader2 className="animate-spin text-indigo-600" /></div> : 
                            opportunities.map(opp => (
                                <div key={opp.id} className="p-6 hover:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${opp.type === 'CRYPTO' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {opp.type === 'CRYPTO' ? <Coins size={20} /> : <LineChart size={20} />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{opp.asset}</h4>
                                                <p className="text-xs text-slate-500 font-mono">
                                                    Kupno: {opp.purchasePrice} | Teraz: {opp.currentPrice}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200 uppercase">
                                            {opp.strategy.replace('_', ' ')}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1">Strata do realizacji</p>
                                            <p className="font-bold text-red-600 text-lg">{formatCurrency(-opp.unrealizedLoss)}</p>
                                        </div>
                                        
                                        <button 
                                            onClick={() => handleSimulate(opp)}
                                            disabled={simulating === opp.id}
                                            className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 flex items-center gap-2 transition-all disabled:opacity-70"
                                        >
                                            {simulating === opp.id ? <Loader2 size={14} className="animate-spin" /> : <><ArrowRight size={14} /> Symuluj Sprzedaż</>}
                                        </button>
                                    </div>

                                    {opp.strategy === 'WASH_SALE_AVOIDANCE' && (
                                        <div className="mt-4 bg-amber-50 border border-amber-100 p-2 rounded text-xs text-amber-800 flex items-center gap-2">
                                            <AlertTriangle size={14} /> 
                                            Uwaga: Wash Sale Rule (USA). Nie odkupuj przez 30 dni.
                                        </div>
                                    )}
                                </div>
                            ))
                        }
                    </div>
                </div>

                {/* Simulation Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                    <h3 className="font-bold text-slate-900 mb-6">Wpływ na Podatek (Symulacja Waterfall)</h3>
                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" fontSize={10} interval={0} />
                                <YAxis />
                                <Tooltip formatter={(val: number) => formatCurrency(val)} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800 flex gap-3">
                        <CheckCircle2 className="shrink-0" />
                        <p>Zrealizowanie wszystkich strat pozwoliłoby obniżyć estymowany podatek o <strong>{((totalPotentialSavings / 15000) * 100).toFixed(1)}%</strong>.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
