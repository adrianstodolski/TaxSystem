
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { RiskAssessment } from '../types';
import { ShieldAlert, AlertTriangle, CheckCircle2, TrendingUp, Activity, Search, Lock, Scan, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export const RiskCenter: React.FC = () => {
    const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
    const [scanning, setScanning] = useState(false);

    const runScan = async () => {
        setScanning(true);
        const data = await NuffiService.fetchRiskProfile();
        setAssessment(data);
        setTimeout(() => setScanning(false), 1000);
    };

    useEffect(() => { runScan(); }, []);

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-400';
        if (score >= 50) return 'text-amber-400';
        return 'text-rose-500';
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return 'bg-emerald-500';
        if (score >= 50) return 'bg-amber-500';
        return 'bg-rose-500';
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-5xl mx-auto">
            <header className="flex justify-between items-center pb-6 border-b border-slate-800">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <ShieldAlert className="text-indigo-500" /> Security & Compliance Scanner
                    </h2>
                    <p className="text-slate-400 mt-1">
                        Active monitoring of VAT status, AML lists, and financial health.
                    </p>
                </div>
                <button 
                    onClick={runScan}
                    disabled={scanning}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-900/50 disabled:opacity-50"
                >
                    <RefreshCw size={18} className={scanning ? 'animate-spin' : ''} />
                    {scanning ? 'Scanning...' : 'Run Full Scan'}
                </button>
            </header>

            {/* Main Scorecard */}
            <div className="bg-slate-900 rounded-3xl p-1 border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="bg-[#0B1120] rounded-[22px] p-8 flex flex-col md:flex-row items-center gap-12 relative z-10">
                    
                    {/* Score Circle */}
                    <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                            <motion.circle 
                                cx="50" cy="50" r="45" fill="none" 
                                stroke={assessment ? (assessment.globalScore >= 80 ? '#10b981' : assessment.globalScore >= 50 ? '#f59e0b' : '#f43f5e') : '#1e293b'} 
                                strokeWidth="8" 
                                strokeDasharray="283"
                                strokeDashoffset={assessment ? 283 - (283 * assessment.globalScore) / 100 : 283}
                                strokeLinecap="round"
                                initial={{ strokeDashoffset: 283 }}
                                animate={{ strokeDashoffset: assessment ? 283 - (283 * assessment.globalScore) / 100 : 283 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                        </svg>
                        <div className="text-center">
                            <div className={`text-5xl font-bold font-mono ${assessment ? getScoreColor(assessment.globalScore) : 'text-slate-600'}`}>
                                {assessment?.globalScore || '--'}
                            </div>
                            <div className="text-xs text-slate-500 uppercase font-bold mt-1">Safety Score</div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="flex-1 space-y-6 w-full">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                <p className="text-slate-400 text-xs font-bold uppercase mb-1">Threat Level</p>
                                <p className="text-white font-bold text-lg flex items-center gap-2">
                                    {assessment && assessment.globalScore < 80 ? <AlertTriangle size={18} className="text-amber-500" /> : <ShieldAlert size={18} className="text-green-500" />}
                                    {assessment && assessment.globalScore >= 80 ? 'LOW' : 'MODERATE'}
                                </p>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                <p className="text-slate-400 text-xs font-bold uppercase mb-1">Issues Found</p>
                                <p className="text-white font-bold text-lg flex items-center gap-2">
                                    <Activity size={18} className="text-indigo-500" />
                                    {assessment?.categories.reduce((acc, c) => acc + c.issuesFound, 0) || 0}
                                </p>
                            </div>
                        </div>
                        
                        {assessment?.criticalAlerts.length ? (
                            <div className="bg-rose-950/30 border border-rose-900/50 rounded-xl p-4">
                                <h4 className="text-rose-400 font-bold text-sm mb-2 flex items-center gap-2">
                                    <AlertTriangle size={16} /> Critical Action Required
                                </h4>
                                <ul className="space-y-1">
                                    {assessment.criticalAlerts.map((alert, i) => (
                                        <li key={i} className="text-rose-200 text-xs">• {alert}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-xl p-4 flex items-center gap-3">
                                <CheckCircle2 className="text-emerald-500" size={24} />
                                <div>
                                    <h4 className="text-emerald-400 font-bold text-sm">System Secure</h4>
                                    <p className="text-emerald-200/70 text-xs">No critical vulnerabilities detected.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* Background scanning line effect */}
                {scanning && (
                    <motion.div 
                        className="absolute top-0 left-0 w-full h-2 bg-indigo-500/50 blur-md z-0"
                        animate={{ top: ['0%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                )}
            </div>

            {/* Detailed Categories List */}
            <div className="space-y-4">
                <h3 className="font-bold text-white pl-2">System Components Check</h3>
                {assessment?.categories.map((cat, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 flex items-center justify-between hover:bg-slate-800 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cat.status === 'SAFE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                {cat.status === 'SAFE' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">{cat.name}</h4>
                                <p className="text-slate-500 text-xs">{cat.issuesFound} issues detected</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-32 bg-slate-900 h-2 rounded-full overflow-hidden">
                                <div className={`h-full ${getScoreBg(cat.score)}`} style={{ width: `${cat.score}%` }}></div>
                            </div>
                            <span className={`font-mono font-bold text-sm w-10 text-right ${getScoreColor(cat.score)}`}>{cat.score}%</span>
                            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                                <Search size={16} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
