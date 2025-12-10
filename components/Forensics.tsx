
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { ForensicsSummary, ForensicIssue } from '../types';
import { ScanSearch, AlertTriangle, ShieldCheck, Search, FileSearch, ArrowRight, XCircle, CheckCircle2, Siren, BrainCircuit, TrendingDown, Zap } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

export const Forensics: React.FC = () => {
    const [summary, setSummary] = useState<ForensicsSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchForensics();
            setSummary(data);
            setLoading(false);
        };
        load();
    }, []);

    const getSeverityColor = (sev: string) => {
        switch(sev) {
            case 'HIGH': return 'text-red-600 bg-red-100 border-red-200';
            case 'MEDIUM': return 'text-amber-600 bg-amber-100 border-amber-200';
            case 'LOW': return 'text-blue-600 bg-blue-100 border-blue-200';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const data = summary ? [
        { name: 'High Confidence', value: summary.confidenceDistribution.high, color: '#10B981' },
        { name: 'Medium Confidence', value: summary.confidenceDistribution.medium, color: '#F59E0B' },
        { name: 'Low Confidence', value: summary.confidenceDistribution.low, color: '#EF4444' },
    ] : [];

    const dnaData = summary ? [
        { subject: 'FOMO', A: summary.dna.fomoScore, fullMark: 100 },
        { subject: 'Diamond Hands', A: summary.dna.diamondHandsScore, fullMark: 100 },
        { subject: 'Panic Sell', A: summary.dna.panicSellRate, fullMark: 100 },
        { subject: 'Risk', A: summary.dna.riskTolerance === 'DEGEN' ? 90 : 40, fullMark: 100 },
        { subject: 'Frequency', A: 70, fullMark: 100 },
    ] : [];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <ScanSearch className="text-indigo-600" /> Portfolio Forensics & DNA
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Detekcja anomalii oraz analiza behawioralna (Psychologia Inwestowania).
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Investment DNA */}
                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden flex flex-col items-center">
                    <h3 className="font-bold mb-4 flex items-center gap-2 self-start">
                        <BrainCircuit className="text-indigo-400" /> Investment DNA
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dnaData}>
                                <PolarGrid stroke="#334155" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                                <Radar name="DNA" dataKey="A" stroke="#818cf8" fill="#818cf8" fillOpacity={0.5} />
                                <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px'}} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 bg-white/10 p-3 rounded-xl w-full">
                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Główny Nawyk</p>
                        <p className="text-sm font-bold text-white">{summary?.dna.topBadHabit || 'Analiza...'}</p>
                    </div>
                </div>

                {/* Risk Score */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={`p-6 rounded-2xl shadow-sm border relative overflow-hidden ${summary && summary.totalIssues > 0 ? 'bg-white border-rose-200' : 'bg-white border-slate-200'}`}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`p-2 rounded-lg ${summary && summary.totalIssues > 0 ? 'bg-rose-100 text-rose-600' : 'bg-green-100 text-green-600'}`}>
                                    <AlertTriangle size={20} />
                                </div>
                                <span className="font-bold text-slate-500 uppercase text-xs">Wykryte Problemy</span>
                            </div>
                            <h3 className={`text-4xl font-bold ${summary && summary.totalIssues > 0 ? 'text-rose-600' : 'text-green-600'}`}>
                                {summary?.totalIssues || 0}
                            </h3>
                            <p className="text-xs text-slate-400 mt-2">Wymagają uwagi przed złożeniem PIT</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-2">
                                <Zap size={20} className="text-amber-500" />
                                <span className="font-bold text-slate-500 uppercase text-xs">Panic Sell Rate</span>
                            </div>
                            <h3 className="text-4xl font-bold text-slate-900">{summary?.dna.panicSellRate}%</h3>
                            <p className="text-xs text-slate-400 mt-2">Procent sprzedaży w dołku (-10% 24h).</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <FileSearch size={18} className="text-slate-400" /> Dziennik Anomalii
                            </h3>
                        </div>
                        
                        {loading ? <div className="p-8 text-center"><Siren className="animate-spin mx-auto mb-2 text-indigo-600" /> Analiza...</div> : (
                            <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
                                {summary?.issues.map(issue => (
                                    <div key={issue.id} className="p-4 hover:bg-slate-50 transition-colors group">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${getSeverityColor(issue.severity)}`}>
                                                    {issue.severity}
                                                </span>
                                                <h4 className="font-bold text-slate-900 text-sm">{issue.type.replace('_', ' ')}</h4>
                                            </div>
                                            <span className="text-xs text-slate-400 font-mono">{issue.date}</span>
                                        </div>
                                        <p className="text-xs text-slate-600 mb-2">{issue.description}</p>
                                        <div className="flex gap-2">
                                            {issue.affectedAssets.map(asset => (
                                                <span key={asset} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold">
                                                    {asset}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
