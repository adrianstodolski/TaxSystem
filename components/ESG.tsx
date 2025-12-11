
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { EsgScore } from '../types';
import { Leaf, Wind, Zap, Server, TreePine, Award, TrendingDown, ArrowRight, Download, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { toast } from './ui/Toast';

export const ESG: React.FC = () => {
    const [score, setScore] = useState<EsgScore | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchEsgData();
            setScore(data);
            setLoading(false);
        };
        load();
    }, []);

    const handleOffset = () => {
        toast.success('Offset Węglowy', 'Zlecono zakup certyfikatów CO2 (Gold Standard).');
    };

    if (loading || !score) return <div className="p-8 text-center text-slate-500">Analiza faktur pod kątem emisji...</div>;

    const chartData = [
        { subject: 'Transport', A: score.breakdown.transport, fullMark: 10 },
        { subject: 'Energia', A: score.breakdown.energy, fullMark: 10 },
        { subject: 'IT/Serwery', A: score.breakdown.servers, fullMark: 10 },
        { subject: 'Inne', A: score.breakdown.other, fullMark: 10 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Leaf className="text-emerald-500" /> Zrównoważony Rozwój (ESG)
                    </h2>
                    <p className="text-slate-400 mt-1">
                        Monitoring śladu węglowego na podstawie faktur kosztowych (Scope 1 & 2).
                    </p>
                </div>
                <button 
                    className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-xl font-bold hover:bg-emerald-600/30 flex items-center gap-2 transition-all"
                    onClick={() => toast.success('Pobrano raport', 'Raport CSRD (ESG) został wygenerowany.')}
                >
                    <Download size={18} /> Raport CSRD (UE)
                </button>
            </header>

            {/* Hero Card */}
            <div className="bg-gradient-to-br from-emerald-900/50 to-teal-900/50 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden border border-emerald-500/20">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    <div className="md:col-span-2">
                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-emerald-100">
                            <Wind size={24} /> Całkowita Emisja CO₂ (YTD)
                        </h3>
                        <div className="flex items-baseline gap-2 mt-4">
                            <h2 className="text-6xl font-bold tracking-tight">{score.totalCo2Tons}</h2>
                            <span className="text-xl text-emerald-200">ton</span>
                        </div>
                        <div className="mt-6 flex items-center gap-3 bg-white/5 w-fit px-4 py-2 rounded-lg border border-white/10">
                            <TreePine className="text-emerald-300" />
                            <span className="text-sm text-slate-200">
                                Ekwiwalent <strong>{score.treesNeeded} drzew</strong> potrzebnych do neutralizacji.
                            </span>
                        </div>
                    </div>
                    
                    <div className="bg-black/20 p-6 rounded-xl border border-white/10 text-center backdrop-blur-sm">
                        <p className="text-emerald-200 text-xs font-bold uppercase tracking-wider mb-2">Trend Emisji</p>
                        <div className="flex items-center justify-center gap-2 text-3xl font-bold text-white">
                            <TrendingDown size={32} /> -12%
                        </div>
                        <p className="text-xs text-emerald-100/70 mt-2">vs poprzedni rok</p>
                    </div>
                </div>
                {/* Background Pattern */}
                <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Breakdown Chart */}
                <div className="glass-card p-6 rounded-2xl">
                    <h3 className="font-bold text-white mb-6">Struktura Emisji</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} />
                                <Radar name="Emisja 2023" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                                <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Action Plan */}
                <div className="glass-card p-6 rounded-2xl flex flex-col">
                    <h3 className="font-bold text-white mb-4">Plan Redukcji</h3>
                    
                    <div className="space-y-4 flex-1">
                        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 flex gap-4">
                            <div className="bg-orange-500/20 p-2 rounded-lg text-orange-400 h-fit border border-orange-500/30">
                                <Zap size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-white">Wysokie zużycie energii</h4>
                                <p className="text-xs text-slate-400 mt-1">Zmień dostawcę na OZE (Gwarancja Pochodzenia). Oszczędność: 2.1 ton CO₂/rok.</p>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 flex gap-4">
                            <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400 h-fit border border-blue-500/30">
                                <Server size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-white">Optymalizacja Chmury</h4>
                                <p className="text-xs text-slate-400 mt-1">Przenieś zasoby do regionu AWS Frankfurt (Green). Oszczędność: 0.5 ton CO₂/rok.</p>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleOffset}
                        className="mt-6 w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/50"
                    >
                        Kompensuj Emisję (Offset) <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            {/* Certification */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Award size={40} className="text-emerald-400" />
                    <div>
                        <h4 className="font-bold text-white">Certyfikat Nuffi Green</h4>
                        <p className="text-sm text-emerald-200/70">Twoja firma spełnia podstawowe normy raportowania ESG.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 size={18} /> Verified 2023
                </div>
            </div>
        </div>
    );
};
