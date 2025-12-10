
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { TaxEngineConfig, TaxEngineStatus, CalculationMethod } from '../types';
import { Cpu, Server, Activity, Database, CheckCircle2, RotateCcw, AlertCircle, Settings, Play, Layers, Shield, Zap, Clock, History, Fingerprint, Lock } from 'lucide-react';
import { toast } from './ui/Toast';
import { CoreEngine } from '../utils/coreEngine';

export const TaxEngine: React.FC = () => {
    const [config, setConfig] = useState<TaxEngineConfig>({
        strategy: 'FIFO',
        isRealTime: true,
        includeDeFi: true,
        includeNFTs: true,
        country: 'PL',
        engineVersion: 'Rust v1.4.2'
    });
    const [status, setStatus] = useState<TaxEngineStatus | null>(null);
    const [recalibrating, setRecalibrating] = useState(false);
    const [timeMachineDate, setTimeMachineDate] = useState(new Date().toISOString().split('T')[0]);
    const [engineInstance] = useState(new CoreEngine('FIFO')); // Local instance

    useEffect(() => {
        const load = async () => {
            const s = await NuffiService.getTaxEngineStatus();
            setStatus(s);
        };
        load();
        const interval = setInterval(async () => {
            const s = await NuffiService.getTaxEngineStatus();
            setStatus(s);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleRecalibrate = async () => {
        setRecalibrating(true);
        // Simulate local calculation
        const txs = await NuffiService.fetchCryptoTransactions();
        const report = engineInstance.process(txs);
        
        await NuffiService.updateTaxEngineConfig(config);
        
        setTimeout(() => {
            setRecalibrating(false);
            toast.success('Silnik zrestartowany', `Przeliczono ${report.transactionsProcessed} transakcji metodą ${config.strategy}. Podatek: ${report.totalTaxDue} PLN.`);
        }, 1500);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Cpu className="text-indigo-600" /> Tax Engine Core
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Centrum dowodzenia silnikiem obliczeniowym (Deterministic Ledger).
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-mono">
                        <Zap size={12} className="text-yellow-400" />
                        Powered by Rust
                    </div>
                    {status && (
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border ${status.status === 'ONLINE' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                            <Activity size={12} className={status.status === 'ONLINE' ? 'animate-pulse' : ''} />
                            {status.status}
                        </div>
                    )}
                </div>
            </header>

            {/* Financial Time Machine */}
            <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                        <History className="text-indigo-400" /> Financial Time Machine
                    </h3>
                    <div className="flex items-center gap-6">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Cofnij stan portfela do:</label>
                            <input 
                                type="date" 
                                value={timeMachineDate}
                                onChange={(e) => setTimeMachineDate(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div className="flex-1 border-l border-slate-700 pl-6">
                            <p className="text-xs text-slate-400 mb-1">Tax Liability (w tamtym dniu)</p>
                            <h4 className="text-3xl font-bold font-mono text-white">
                                {timeMachineDate < '2023-06-01' ? '12,450.00 PLN' : '45,200.00 PLN'}
                            </h4>
                        </div>
                        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2">
                            <RotateCcw size={18} /> Symuluj Przeszłość
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-4 flex items-center gap-2">
                        <Lock size={12} /> Stan księgi jest kryptograficznie zabezpieczony (Hash-Chain).
                    </p>
                </div>
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
            </div>

            {/* Main Configuration */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <Settings size={18} className="text-slate-400" /> Strategia Kosztowa
                        </h3>
                        <span className="text-xs font-mono text-slate-400">{config.engineVersion}</span>
                    </div>
                    
                    <div className="p-8 space-y-8">
                        {/* Strategy Selection */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-4">Wybierz algorytm kolejkowania partii (Lot Queue)</label>
                            <div className="grid grid-cols-3 gap-4">
                                {['FIFO', 'LIFO', 'HIFO'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setConfig({...config, strategy: s as CalculationMethod})}
                                        className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden group ${
                                            config.strategy === s 
                                                ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' 
                                                : 'border-slate-200 hover:border-indigo-200'
                                        }`}
                                    >
                                        <div className="relative z-10">
                                            <span className={`text-lg font-bold ${config.strategy === s ? 'text-indigo-900' : 'text-slate-600'}`}>{s}</span>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {s === 'FIFO' ? 'Standard PL (First-In First-Out)' : 
                                                 s === 'LIFO' ? 'Optymalizacja (Last-In First-Out)' : 
                                                 'Agresywna (Highest-In First-Out)'}
                                            </p>
                                        </div>
                                        {config.strategy === s && <div className="absolute right-0 top-0 p-2 text-indigo-600"><CheckCircle2 size={18} /></div>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="pt-6 border-t border-slate-100 flex justify-end">
                            <button 
                                onClick={handleRecalibrate}
                                disabled={recalibrating}
                                className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg disabled:opacity-70"
                            >
                                {recalibrating ? <RotateCcw className="animate-spin" size={18} /> : <Play size={18} fill="currentColor" />}
                                {recalibrating ? 'Przeliczanie Ledger...' : 'Zastosuj i Przelicz'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold mb-2 flex items-center gap-2"><Database size={18} /> Shadow Ledger</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-indigo-200">Active Lots</span>
                                    <span className="font-mono font-bold">1,245</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-indigo-200">Inventory Value</span>
                                    <span className="font-mono font-bold">4.2M PLN</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-indigo-200">Unrealized PnL</span>
                                    <span className="font-mono font-bold text-green-300">+125k PLN</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Fingerprint size={18} className="text-slate-400" /> Audit Trail
                        </h3>
                        <div className="font-mono text-[10px] space-y-2 text-slate-500 h-48 overflow-y-auto custom-scrollbar">
                            <p>[INFO] Engine initialized (Rust 1.75)</p>
                            <p>[INFO] Loaded 12450 txs into memory</p>
                            <p className="text-green-600">[SUCCESS] FIFO calc batch #4922 complete (12ms)</p>
                            <p>[INFO] Replaying history from 2022-01-01...</p>
                            <p>[WARN] Missing cost basis for TX_8821 (assumed 0)</p>
                            <p className="text-indigo-600">[SNAPSHOT] Created state hash: 0x9a...21</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
