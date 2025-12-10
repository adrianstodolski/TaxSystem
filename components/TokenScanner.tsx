
import React, { useState } from 'react';
import { NuffiService } from '../services/api';
import { TokenSecurity } from '../types';
import { ShieldCheck, Search, Loader2, AlertTriangle, CheckCircle2, Lock, XCircle, Siren } from 'lucide-react';
import { toast } from './ui/Toast';

export const TokenScanner: React.FC = () => {
    const [address, setAddress] = useState('');
    const [result, setResult] = useState<TokenSecurity | null>(null);
    const [scanning, setScanning] = useState(false);

    const handleScan = async () => {
        if(!address) return;
        setScanning(true);
        setResult(null);
        try {
            const data = await NuffiService.scanTokenContract(address);
            setResult(data);
            if(data.riskScore < 50) toast.warning('Wykryto ryzyko!', 'Ten token posiada niebezpieczne funkcje.');
            else toast.success('Skan zakończony', 'Token wydaje się bezpieczny.');
        } catch(e) {
            toast.error('Błąd', 'Nie udało się przeskanować kontraktu.');
        } finally {
            setScanning(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Siren className="text-rose-600" /> Token Scanner (Anti-Rugpull)
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Analiza bezpieczeństwa Smart Kontraktów. Wykrywanie Honeypotów i blokady płynności.
                    </p>
                </div>
            </header>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-3xl mx-auto">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Wklej adres kontraktu (np. 0x...)"
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm transition-all"
                        />
                    </div>
                    <button 
                        onClick={handleScan}
                        disabled={scanning || !address}
                        className="bg-slate-900 text-white px-8 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-70 transition-all flex items-center gap-2 shadow-lg"
                    >
                        {scanning ? <Loader2 className="animate-spin" /> : <><ShieldCheck size={18} /> Skanuj</>}
                    </button>
                </div>
            </div>

            {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto animate-in slide-in-from-bottom-4">
                    {/* Score Card */}
                    <div className={`p-8 rounded-2xl text-white shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden ${result.riskScore > 80 ? 'bg-emerald-600' : result.riskScore > 50 ? 'bg-amber-500' : 'bg-rose-600'}`}>
                        <div className="relative z-10">
                            <p className="text-white/80 font-bold uppercase tracking-widest text-xs mb-2">Safety Score</p>
                            <h3 className="text-7xl font-bold mb-2">{result.riskScore}/100</h3>
                            <p className="text-lg font-medium">{result.name} ({result.symbol})</p>
                            <p className="text-sm text-white/90 mt-4 px-4 py-2 bg-white/20 rounded-lg inline-block backdrop-blur-sm">
                                {result.riskScore > 80 ? 'Token wygląda bezpiecznie.' : 'Wykryto poważne zagrożenia.'}
                            </p>
                        </div>
                        {/* Deco */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    </div>

                    {/* Details List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-bold text-slate-900">Raport Audytu</h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            <div className="p-4 flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-600">Honeypot Check</span>
                                {result.isHoneypot ? (
                                    <span className="flex items-center gap-1 text-rose-600 font-bold text-sm"><XCircle size={16} /> WYKRYTO</span>
                                ) : (
                                    <span className="flex items-center gap-1 text-emerald-600 font-bold text-sm"><CheckCircle2 size={16} /> CZYSTO</span>
                                )}
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-600">Ownership Renounced</span>
                                {result.ownershipRenounced ? (
                                    <span className="flex items-center gap-1 text-emerald-600 font-bold text-sm"><CheckCircle2 size={16} /> TAK</span>
                                ) : (
                                    <span className="flex items-center gap-1 text-amber-500 font-bold text-sm"><AlertTriangle size={16} /> NIE</span>
                                )}
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-600">Liquidity Locked</span>
                                {result.liquidityLocked ? (
                                    <span className="flex items-center gap-1 text-emerald-600 font-bold text-sm"><Lock size={16} /> TAK</span>
                                ) : (
                                    <span className="flex items-center gap-1 text-rose-600 font-bold text-sm"><AlertTriangle size={16} /> NIE (Ryzyko Rugpull)</span>
                                )}
                            </div>
                        </div>
                        
                        {result.issues.length > 0 && (
                            <div className="p-4 bg-rose-50 border-t border-rose-100">
                                <p className="text-xs font-bold text-rose-800 uppercase mb-2">Znalezione Problemy</p>
                                <ul className="space-y-2">
                                    {result.issues.map((issue, idx) => (
                                        <li key={idx} className="text-sm text-rose-700 flex items-start gap-2">
                                            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                                            {issue.description}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
