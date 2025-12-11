
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { AuditRiskFactor, AuditPackage } from '../types';
import { ShieldCheck, Archive, FileLock, Download, Search, AlertOctagon, Lock, FolderClosed, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from './ui/Toast';
import { motion } from 'framer-motion';

export const TaxAuditDefender: React.FC = () => {
    const [risks, setRisks] = useState<AuditRiskFactor[]>([]);
    const [auditPkg, setAuditPkg] = useState<AuditPackage | null>(null);
    const [activeTab, setActiveTab] = useState<'VAULT' | 'RISKS'>('VAULT');
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        // Mock load
        NuffiService.runAuditRiskAnalysis().then(setRisks);
    }, []);

    const generatePackage = async () => {
        setGenerating(true);
        const pkg = await NuffiService.generateDefensePackage(2023);
        setAuditPkg(pkg);
        setGenerating(false);
        toast.success('Paczka gotowa', 'Dokumentacja została zabezpieczona kryptograficznie.');
    };

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col pb-4 animate-in fade-in duration-300">
            {/* Header Area */}
            <div className="flex justify-between items-end mb-6 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="text-indigo-500" /> Audit Defender
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Generuj paczki dowodowe i archiwizuj dokumenty w formacie JPK.</p>
                </div>
                <div className="bg-slate-900 p-1 rounded-lg border border-slate-700 flex">
                    <button onClick={() => setActiveTab('VAULT')} className={`px-4 py-2 text-xs font-bold rounded flex items-center gap-2 transition-all ${activeTab === 'VAULT' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                        <Archive size={14} /> Evidence Vault
                    </button>
                    <button onClick={() => setActiveTab('RISKS')} className={`px-4 py-2 text-xs font-bold rounded flex items-center gap-2 transition-all ${activeTab === 'RISKS' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                        <AlertOctagon size={14} /> Risk Factors
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                {activeTab === 'VAULT' && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="h-full flex flex-col">
                        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-xl bg-slate-800/50">
                            {!auditPkg ? (
                                <div className="text-center p-8">
                                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                                        <FolderClosed size={32} className="text-slate-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Brak aktywnej paczki kontrolnej</h3>
                                    <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6">
                                        Wygeneruj "Defense Package" zawierający wszystkie JPK, faktury i potwierdzenia przelewów dla organów podatkowych.
                                    </p>
                                    <button 
                                        onClick={generatePackage}
                                        disabled={generating}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto transition-all shadow-lg shadow-indigo-900/50 disabled:opacity-50"
                                    >
                                        {generating ? 'Generowanie...' : <><FileLock size={18} /> Generuj Paczkę (2023)</>}
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center p-8 w-full max-w-md">
                                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                                        <CheckCircle2 size={32} className="text-green-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-1">Paczka Dowodowa Gotowa</h3>
                                    <p className="font-mono text-xs text-slate-500 bg-black/30 px-2 py-1 rounded mb-6 break-all">
                                        HASH: {auditPkg.hash}
                                    </p>
                                    
                                    <div className="bg-slate-800 p-4 rounded-xl text-left space-y-3 mb-6 border border-slate-700">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400 flex items-center gap-2"><FileText size={14} /> JPK_V7M</span>
                                            <span className="text-green-400 font-bold">Included</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400 flex items-center gap-2"><FileText size={14} /> Wyciągi Bankowe</span>
                                            <span className="text-green-400 font-bold">Included</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400 flex items-center gap-2"><FileText size={14} /> Logi Systemowe</span>
                                            <span className="text-green-400 font-bold">Included</span>
                                        </div>
                                    </div>

                                    <button className="w-full bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border border-slate-600">
                                        <Download size={18} /> Pobierz ZIP (Szyfrowany)
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'RISKS' && (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="h-full overflow-y-auto custom-scrollbar pr-2">
                        <div className="mb-4 flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                            <AlertOctagon size={16} className="text-amber-500" />
                            <span>System automatycznie flaguje transakcje mogące budzić wątpliwości US.</span>
                        </div>
                        <div className="space-y-3">
                            {risks.map(risk => (
                                <div key={risk.id} className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex gap-4 items-start hover:border-indigo-500/50 transition-colors">
                                    <div className={`mt-1 p-2 rounded-lg ${risk.severity === 'HIGH' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                        <Search size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-white font-bold text-sm">{risk.title}</h4>
                                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${risk.severity === 'HIGH' ? 'border-red-500/30 text-red-400 bg-red-500/10' : 'border-amber-500/30 text-amber-400 bg-amber-500/10'}`}>
                                                {risk.severity} Risk
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-xs mt-1">{risk.description}</p>
                                        <div className="mt-3 flex gap-2">
                                            <button className="text-xs bg-slate-700 text-slate-300 px-3 py-1.5 rounded hover:bg-slate-600 transition-colors">
                                                Zobacz dokumenty
                                            </button>
                                            <button className="text-xs bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-3 py-1.5 rounded hover:bg-indigo-600/30 transition-colors">
                                                Dodaj wyjaśnienie
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {risks.length === 0 && (
                                <div className="text-center py-10 text-slate-500">
                                    <CheckCircle2 size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>Brak wykrytych ryzyk podatkowych.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
