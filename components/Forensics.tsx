
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { ForensicsSummary, ForensicIssue } from '../types';
import { ScanSearch, AlertTriangle, ShieldCheck, Search, FileSearch, ArrowRight, XCircle, CheckCircle2, Siren } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

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

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <ScanSearch className="text-indigo-600" /> Portfolio Forensics
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Detekcja anomalii, wash-sales i błędów w historii transakcji (Audit Mode).
                    </p>
                </div>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                            <ShieldCheck size={20} />
                        </div>
                        <span className="font-bold text-slate-500 uppercase text-xs">Risk Score</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <h3 className="text-4xl font-bold text-slate-900">{summary?.riskScore || 0}/100</h3>
                        <span className={`text-sm font-bold mb-1 ${summary && summary.riskScore > 50 ? 'text-amber-500' : 'text-green-500'}`}>
                            {summary && summary.riskScore > 50 ? 'Podwyższone' : 'Niskie'}
                        </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                        <div className={`h-full rounded-full ${summary && summary.riskScore > 50 ? 'bg-amber-500' : 'bg-green-500'}`} style={{width: `${summary?.riskScore}%`}}></div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                <Search size={20} />
                            </div>
                            <span className="font-bold text-slate-500 uppercase text-xs">Data Confidence</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Jakość danych</h3>
                        <p className="text-xs text-slate-400 mt-1">Algorytm ML ocenił pewność klasyfikacji.</p>
                    </div>
                    <div className="w-24 h-24">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={data} innerRadius={15} outerRadius={30} paddingAngle={5} dataKey="value">
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Issues List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <FileSearch size={18} className="text-slate-400" /> Dziennik Anomalii
                    </h3>
                </div>
                
                {loading ? <div className="p-8 text-center">Analiza danych...</div> : (
                    <div className="divide-y divide-slate-100">
                        {summary?.issues.map(issue => (
                            <div key={issue.id} className="p-6 hover:bg-slate-50 transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${getSeverityColor(issue.severity)}`}>
                                            {issue.severity}
                                        </span>
                                        <h4 className="font-bold text-slate-900">{issue.type.replace('_', ' ')}</h4>
                                    </div>
                                    <span className="text-xs text-slate-400 font-mono">{issue.date}</span>
                                </div>
                                
                                <p className="text-sm text-slate-600 mb-4">{issue.description}</p>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2">
                                        {issue.affectedAssets.map(asset => (
                                            <span key={asset} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-mono font-bold">
                                                {asset}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs text-slate-400">ML Confidence: {(issue.confidence * 100).toFixed(0)}%</span>
                                        <button className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded transition-colors flex items-center gap-1">
                                            Napraw <ArrowRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {summary?.issues.length === 0 && (
                            <div className="p-12 text-center flex flex-col items-center justify-center">
                                <div className="bg-green-100 p-4 rounded-full text-green-600 mb-4">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h4 className="font-bold text-slate-900">Czyste konto</h4>
                                <p className="text-slate-500 text-sm mt-1">Nie wykryto żadnych anomalii w Twoim portfelu.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
