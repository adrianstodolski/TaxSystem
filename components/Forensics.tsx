
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { ForensicsSummary, ForensicIssue } from '../types';
import { ScanSearch, AlertTriangle, ShieldCheck, Search, FileSearch, ArrowRight, XCircle, CheckCircle2, Siren, BrainCircuit, TrendingDown, Zap, Activity, Radar as RadarIcon, Eye } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ScatterChart, CartesianGrid, XAxis, YAxis, Scatter, Cell } from 'recharts';
import { motion } from 'framer-motion';

export const Forensics: React.FC = () => {
    const [summary, setSummary] = useState<ForensicsSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [scanning, setScanning] = useState(false);

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchForensics();
            setSummary(data);
            setLoading(false);
        };
        load();
    }, []);

    const handleRunScan = () => {
        setScanning(true);
        setTimeout(() => setScanning(false), 2000);
    };

    const getSeverityColor = (sev: string) => {
        switch(sev) {
            case 'HIGH': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
            case 'MEDIUM': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'LOW': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            default: return 'text-zinc-400 bg-white/5 border-white/5';
        }
    };

    const dnaData = summary ? [
        { subject: 'FOMO', A: summary.dna.fomoScore, fullMark: 100 },
        { subject: 'Diamond Hands', A: summary.dna.diamondHandsScore, fullMark: 100 },
        { subject: 'Panic Sell', A: summary.dna.panicSellRate, fullMark: 100 },
        { subject: 'Risk', A: summary.dna.riskTolerance === 'DEGEN' ? 90 : 40, fullMark: 100 },
        { subject: 'Frequency', A: 70, fullMark: 100 },
    ] : [];

    // Mock Psycho-Map Data (Risk vs Reward)
    const scatterData = [
        { x: 10, y: 30, z: 200, name: 'BTC Buy' },
        { x: 30, y: 200, z: 260, name: 'ETH Sell' },
        { x: 45, y: 100, z: 400, name: 'SOL Long' },
        { x: 50, y: 400, z: 280, name: 'PEPE Swap' },
        { x: 70, y: 150, z: 100, name: 'ARB Claim' },
        { x: 90, y: 20, z: 500, name: 'USDC Lend' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <ScanSearch className="text-gold" /> Behavioral Forensics
                    </h2>
                    <p className="text-zinc-400 mt-1">
                        Analiza behawioralna, psychologia inwestowania i detekcja anomalii.
                    </p>
                </div>
                <button 
                    onClick={handleRunScan}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-500 flex items-center gap-2 shadow-lg shadow-indigo-900/50 transition-all text-sm"
                >
                    {scanning ? <Activity className="animate-spin" size={18} /> : <Eye size={18} />} 
                    {scanning ? 'Skanowanie...' : 'Uruchom Analizę'}
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Investment DNA Radar */}
                <div className="neo-card bg-[#0A0A0C] p-6 rounded-2xl relative overflow-hidden flex flex-col items-center border border-white/10">
                    <h3 className="font-bold mb-4 flex items-center gap-2 self-start text-white">
                        <BrainCircuit className="text-gold" /> Investment DNA
                    </h3>
                    <div className="h-64 w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={dnaData}>
                                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                                <Radar name="DNA" dataKey="A" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.3} />
                                <Tooltip contentStyle={{backgroundColor: '#0A0A0C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff'}} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 bg-white/5 p-3 rounded-xl w-full border border-white/5">
                        <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Główny Nawyk</p>
                        <p className="text-sm font-bold text-white">{summary?.dna.topBadHabit || 'Analiza...'}</p>
                    </div>
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full pointer-events-none"></div>
                </div>

                {/* Psychology Map */}
                <div className="neo-card lg:col-span-2 p-6 rounded-2xl relative overflow-hidden border border-white/10 bg-gradient-to-br from-[#0A0A0C] to-[#141419]">
                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Activity className="text-indigo-400" /> Psychology Map (Risk vs Reward)
                        </h3>
                        <div className="flex gap-4 text-[10px] text-zinc-500">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500"></div> High Emotion</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Rational</span>
                        </div>
                    </div>
                    
                    <div className="h-64 w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis type="number" dataKey="x" name="Risk" unit="%" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis type="number" dataKey="y" name="Reward" unit="%" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{backgroundColor: '#0A0A0C', border: '1px solid rgba(255,255,255,0.1)', color: '#fff'}} />
                                <Scatter name="Decisions" data={scatterData} fill="#8884d8">
                                    {scatterData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.x > 50 ? '#F43F5E' : '#3B82F6'} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Anomalies List */}
            <div className="neo-card rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Siren size={18} className="text-rose-500" /> Wykryte Anomalie
                    </h3>
                    <span className="text-xs text-zinc-500 font-mono bg-black/40 px-2 py-1 rounded border border-white/5">
                        {summary?.totalIssues} zdarzeń
                    </span>
                </div>
                
                {loading || scanning ? (
                    <div className="p-12 text-center text-zinc-500">
                        <ScanSearch className="animate-pulse mx-auto mb-4 text-gold" size={32} />
                        <p>Analiza heurystyczna w toku...</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {summary?.issues.map(issue => (
                            <div key={issue.id} className="p-6 hover:bg-white/5 transition-colors group flex items-start gap-4">
                                <div className={`mt-1 p-2 rounded-lg ${issue.severity === 'HIGH' ? 'bg-rose-500/10 text-rose-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                    <AlertTriangle size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-white text-sm">{issue.type.replace('_', ' ')}</h4>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getSeverityColor(issue.severity)}`}>
                                            {issue.severity}
                                        </span>
                                    </div>
                                    <p className="text-sm text-zinc-400 mb-3">{issue.description}</p>
                                    <div className="flex items-center gap-2">
                                        {issue.affectedAssets.map(asset => (
                                            <span key={asset} className="text-[10px] bg-white/5 text-zinc-300 px-2 py-1 rounded font-mono font-bold border border-white/5">
                                                {asset}
                                            </span>
                                        ))}
                                        <span className="text-[10px] text-zinc-500 ml-auto font-mono">{issue.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
