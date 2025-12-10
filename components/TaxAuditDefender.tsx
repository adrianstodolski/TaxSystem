
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { AuditRiskFactor, AuditPackage } from '../types';
import { ShieldCheck, AlertTriangle, FileText, Lock, Activity, CheckCircle2, Search, Download, Loader2, Scale } from 'lucide-react';
import { toast } from './ui/Toast';

export const TaxAuditDefender: React.FC = () => {
    const [risks, setRisks] = useState<AuditRiskFactor[]>([]);
    const [auditPkg, setAuditPkg] = useState<AuditPackage | null>(null);
    const [scanning, setScanning] = useState(false);
    const [generating, setGenerating] = useState(false);

    const runScan = async () => {
        setScanning(true);
        const data = await NuffiService.runAuditRiskAnalysis();
        setRisks(data);
        setScanning(false);
    };

    const generatePackage = async () => {
        setGenerating(true);
        try {
            const pkg = await NuffiService.generateDefensePackage(2023);
            setAuditPkg(pkg);
            toast.success('Paczka dowodowa gotowa', 'Wszystkie dokumenty zostały zabezpieczone i podpisane.');
        } finally {
            setGenerating(false);
        }
    };

    const highRisks = risks.filter(r => r.severity === 'HIGH').length;
    const mediumRisks = risks.filter(r => r.severity === 'MEDIUM').length;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="text-indigo-600" /> Tarcza Antykontrolna
                    </h2>
                    <p className="text-slate-500 mt-1">Analiza ryzyka podatkowego i generowanie paczek dowodowych dla Urzędu Skarbowego.</p>
                </div>
                <button 
                    onClick={runScan}
                    disabled={scanning}
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 flex items-center gap-2 shadow-lg disabled:opacity-70 transition-all"
                >
                    {scanning ? <Loader2 className="animate-spin" /> : <><Activity size={18} /> Uruchom Audyt AI</>}
                </button>
            </header>

            {/* Status Hero */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={`p-8 rounded-2xl text-white shadow-xl relative overflow-hidden transition-all ${highRisks > 0 ? 'bg-rose-600' : 'bg-emerald-600'}`}>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                                <Scale size={24} />
                            </div>
                            <h3 className="text-xl font-bold">Status Podatnika</h3>
                        </div>
                        
                        {risks.length === 0 && !scanning ? (
                            <p className="text-white/80">Uruchom skanowanie, aby sprawdzić ryzyko.</p>
                        ) : highRisks > 0 ? (
                            <div>
                                <h4 className="text-3xl font-bold mb-2">WYKRYTO RYZYKO</h4>
                                <p className="text-rose-100">Znaleziono {highRisks} krytycznych anomalii, które mogą sprowokować kontrolę.</p>
                            </div>
                        ) : (
                            <div>
                                <h4 className="text-3xl font-bold mb-2">BEZPIECZNY</h4>
                                <p className="text-emerald-100">Twoje księgi nie wykazują odchyleń od normy.</p>
                            </div>
                        )}
                    </div>
                    {/* Bg Deco */}
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
                        <ShieldCheck size={200} />
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Lock className="text-indigo-600" /> Defense File Generator
                    </h3>
                    <p className="text-slate-500 text-sm mb-6">
                        System automatycznie agreguje JPK, faktury, potwierdzenia przelewów i KPiR w jeden zaszyfrowany plik ZIP, gotowy do przekazania kontrolerowi.
                    </p>
                    
                    {auditPkg ? (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="text-green-600" />
                                <div>
                                    <p className="font-bold text-green-800 text-sm">Paczka gotowa</p>
                                    <p className="text-xs text-green-600 font-mono">{auditPkg.hash.substring(0, 20)}...</p>
                                </div>
                            </div>
                            <button className="bg-white border border-green-200 text-green-700 p-2 rounded-lg hover:bg-green-100">
                                <Download size={18} />
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={generatePackage}
                            disabled={generating}
                            className="w-full bg-white border-2 border-indigo-100 text-indigo-700 py-3 rounded-xl font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                        >
                            {generating ? <Loader2 className="animate-spin" /> : 'Generuj Paczkę Dowodową (2023)'}
                        </button>
                    )}
                </div>
            </div>

            {/* Risk Factors List */}
            {risks.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="font-bold text-slate-900">Raport Szczegółowy</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {risks.map(risk => (
                            <div key={risk.id} className="p-6 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                                <div className={`mt-1 p-2 rounded-lg shrink-0 ${
                                    risk.severity === 'HIGH' ? 'bg-rose-100 text-rose-600' :
                                    risk.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-600' :
                                    'bg-green-100 text-green-600'
                                }`}>
                                    {risk.severity === 'HIGH' ? <AlertTriangle size={20} /> :
                                     risk.severity === 'MEDIUM' ? <Search size={20} /> :
                                     <CheckCircle2 size={20} />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <h4 className="font-bold text-slate-900">{risk.title}</h4>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                            risk.severity === 'HIGH' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                                            risk.severity === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                            'bg-green-50 text-green-700 border border-green-100'
                                        }`}>{risk.severity} Risk</span>
                                    </div>
                                    <p className="text-sm text-slate-600">{risk.description}</p>
                                    <div className="mt-2 text-xs font-mono text-slate-400 uppercase tracking-wide">
                                        Kategoria: {risk.category}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
