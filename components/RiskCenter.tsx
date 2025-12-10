
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { RiskAssessment } from '../types';
import { ShieldAlert, AlertTriangle, CheckCircle2, TrendingUp, Activity, Search, Lock } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

export const RiskCenter: React.FC = () => {
    const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchRiskProfile();
            setAssessment(data);
            setLoading(false);
        };
        load();
    }, []);

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 50) return 'text-amber-500';
        return 'text-red-500';
    };

    if (loading || !assessment) return <div className="p-8 text-center text-slate-500">Analiza ryzyka w toku...</div>;

    const chartData = assessment.categories.map(c => ({
        subject: c.name,
        A: c.score,
        fullMark: 100
    }));

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <ShieldAlert className="text-indigo-600" /> Risk Control Center (Compliance Hub)
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Holistyczna ocena bezpieczeństwa biznesu: Podatki, Płynność, AML.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Radar Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-1 flex flex-col items-center justify-center relative overflow-hidden">
                    <h3 className="font-bold text-slate-900 mb-4 absolute top-6 left-6">Mapa Ryzyka</h3>
                    <div className="h-64 w-full mt-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                                <Radar name="Score" dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.6} />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="absolute bottom-4 right-4 text-xs font-bold text-slate-400">Scale: 0-100 (Safe)</div>
                </div>

                {/* Scorecard */}
                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl lg:col-span-2 relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Global Risk Score</p>
                            <h3 className={`text-6xl font-bold ${getScoreColor(assessment.globalScore)}`}>{assessment.globalScore}/100</h3>
                            <p className="text-sm text-slate-300 mt-2">Twoja firma jest w kondycji: <strong>{assessment.globalScore > 75 ? 'DOBREJ' : 'WYMAGA UWAGI'}</strong></p>
                        </div>
                        
                        <div className="bg-white/10 p-6 rounded-xl border border-white/10 flex-1 w-full">
                            <h4 className="font-bold text-sm mb-4 flex items-center gap-2"><AlertTriangle size={16} className="text-amber-400" /> Krytyczne Alerty</h4>
                            <ul className="space-y-3">
                                {assessment.criticalAlerts.map((alert, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-slate-200">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0"></span>
                                        {alert}
                                    </li>
                                ))}
                                {assessment.criticalAlerts.length === 0 && (
                                    <li className="text-green-400 text-sm flex items-center gap-2"><CheckCircle2 size={16} /> Brak krytycznych zagrożeń.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                    {/* Deco */}
                    <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assessment.categories.map((cat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="font-bold text-slate-900">{cat.name}</h4>
                            <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                                cat.status === 'SAFE' ? 'bg-green-100 text-green-700' :
                                cat.status === 'WARNING' ? 'bg-amber-100 text-amber-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                                {cat.status}
                            </span>
                        </div>
                        
                        <div className="flex items-end justify-between mb-2">
                            <span className="text-sm text-slate-500">Wynik</span>
                            <span className={`text-2xl font-bold font-mono ${getScoreColor(cat.score)}`}>{cat.score}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                            <div className={`h-full rounded-full ${cat.score >= 80 ? 'bg-green-500' : cat.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{width: `${cat.score}%`}}></div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Activity size={14} /> Wykryto problemów: <strong className={cat.issuesFound > 0 ? 'text-rose-600' : 'text-slate-700'}>{cat.issuesFound}</strong>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
