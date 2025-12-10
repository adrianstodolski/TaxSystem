
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { TaxPrediction, LegislativeAlert, ScenarioConfig } from '../types';
import { Telescope, TrendingUp, AlertTriangle, Calendar, BrainCircuit, Sliders, ArrowRight, ShieldAlert, Sparkles, Loader2, Info } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { toast } from './ui/Toast';

export const PredictiveTax: React.FC = () => {
    const [predictions, setPredictions] = useState<TaxPrediction[]>([]);
    const [alerts, setAlerts] = useState<LegislativeAlert[]>([]);
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState<ScenarioConfig>({
        revenueGrowth: 10,
        costIncrease: 5,
        inflation: 4.5
    });
    const [simulating, setSimulating] = useState(false);

    useEffect(() => {
        const load = async () => {
            const [preds, legs] = await Promise.all([
                NuffiService.fetchTaxPredictions(),
                NuffiService.fetchLegislativeAlerts()
            ]);
            setPredictions(preds);
            setAlerts(legs);
            setLoading(false);
        };
        load();
    }, []);

    const handleSimulate = async () => {
        setSimulating(true);
        await new Promise(r => setTimeout(r, 1500)); // Mock wait
        
        // Adjust predictions based on config locally for demo
        const adjusted = predictions.map(p => {
            if(p.type === 'PREDICTED') {
                return {
                    ...p,
                    estimatedRevenue: p.estimatedRevenue * (1 + (config.revenueGrowth / 100)),
                    estimatedCost: p.estimatedCost * (1 + (config.costIncrease / 100)),
                    estimatedTax: (p.estimatedRevenue * (1 + (config.revenueGrowth/100)) - p.estimatedCost * (1 + (config.costIncrease/100))) * 0.19
                };
            }
            return p;
        });
        setPredictions(adjusted);
        
        setSimulating(false);
        toast.success('Symulacja zakończona', 'Wykres został zaktualizowany o nowe parametry.');
    };

    const formatCurrency = (val: number) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Telescope className="text-indigo-600" /> Predictive Tax AI
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Prognozowanie obciążeń podatkowych i symulacje scenariuszy biznesowych (What-If).
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 font-medium text-sm">
                    <BrainCircuit size={16} /> Powered by Gemini AI
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Forecast Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <TrendingUp size={20} className="text-slate-400" /> Prognoza Podatkowa (6 msc)
                        </h3>
                        <div className="flex items-center gap-4 text-xs font-bold">
                            <span className="flex items-center gap-1 text-slate-500"><div className="w-2 h-2 rounded-full bg-slate-300"></div> Historia</span>
                            <span className="flex items-center gap-1 text-indigo-600"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> AI Prediction</span>
                        </div>
                    </div>

                    <div className="h-80 w-full">
                        {loading ? <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div> : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={predictions} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorTax" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v/1000}k`} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <Tooltip 
                                        contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                        formatter={(value: number) => formatCurrency(value)}
                                    />
                                    <ReferenceLine x="Nov" stroke="#64748B" strokeDasharray="3 3" label={{ position: 'top',  value: 'Dzisiaj', fill: '#64748B', fontSize: 10 }} />
                                    <Area type="monotone" dataKey="estimatedRevenue" stroke="#10B981" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} name="Przychód" />
                                    <Area type="monotone" dataKey="estimatedTax" stroke="#4F46E5" fillOpacity={1} fill="url(#colorTax)" strokeWidth={2} name="Est. Podatek" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Scenario Simulator */}
                <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <Sliders size={20} className="text-indigo-400" /> Symulator Scenariuszy
                        </h3>
                        
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-xs font-bold uppercase text-slate-400 mb-2">
                                    <span>Wzrost Przychodu</span>
                                    <span className="text-green-400">+{config.revenueGrowth}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" max="100" 
                                    value={config.revenueGrowth} 
                                    onChange={(e) => setConfig({...config, revenueGrowth: parseInt(e.target.value)})}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-bold uppercase text-slate-400 mb-2">
                                    <span>Wzrost Kosztów</span>
                                    <span className="text-red-400">+{config.costIncrease}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" max="50" 
                                    value={config.costIncrease} 
                                    onChange={(e) => setConfig({...config, costIncrease: parseInt(e.target.value)})}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-bold uppercase text-slate-400 mb-2">
                                    <span>Inflacja (CPI)</span>
                                    <span className="text-amber-400">{config.inflation}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" max="20" 
                                    step="0.5"
                                    value={config.inflation} 
                                    onChange={(e) => setConfig({...config, inflation: parseFloat(e.target.value)})}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                />
                            </div>

                            <button 
                                onClick={handleSimulate}
                                disabled={simulating}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold mt-4 flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900/50"
                            >
                                {simulating ? <Loader2 className="animate-spin" /> : <><Sparkles size={18} /> Przelicz Scenariusz</>}
                            </button>
                        </div>
                    </div>
                    {/* Deco */}
                    <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                </div>
            </div>

            {/* Legislative Radar */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <ShieldAlert size={18} className="text-amber-500" /> Radar Legislacyjny (GovTech Scanner)
                    </h3>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Info size={12} /> Skanuje: sejm.gov.pl, mf.gov.pl
                    </span>
                </div>
                <div className="divide-y divide-slate-100">
                    {loading ? <div className="p-8 text-center text-slate-400">Skanowanie ustaw...</div> : alerts.map(alert => (
                        <div key={alert.id} className="p-6 hover:bg-slate-50 transition-colors group">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold shrink-0 ${
                                        alert.impact === 'HIGH' ? 'bg-red-100 text-red-600' :
                                        alert.impact === 'MEDIUM' ? 'bg-amber-100 text-amber-600' :
                                        'bg-blue-100 text-blue-600'
                                    }`}>
                                        !
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg group-hover:text-indigo-700 transition-colors">{alert.title}</h4>
                                        <p className="text-slate-600 text-sm mt-1 max-w-2xl">{alert.description}</p>
                                        <div className="flex gap-3 mt-3">
                                            <span className="text-xs font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded">
                                                Effective: {alert.effectiveDate}
                                            </span>
                                            <span className="text-xs font-bold text-slate-400 px-2 py-1 uppercase border border-slate-200 rounded">
                                                Source: {alert.source}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                                        alert.impact === 'HIGH' ? 'bg-red-50 text-red-700 border border-red-100' :
                                        alert.impact === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                        'bg-blue-50 text-blue-700 border border-blue-100'
                                    }`}>
                                        {alert.impact} Impact
                                    </span>
                                    <button className="block mt-4 text-sm font-bold text-indigo-600 hover:underline">
                                        Analizuj wpływ &rarr;
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
