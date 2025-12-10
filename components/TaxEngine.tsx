
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { TaxEngineConfig, TaxEngineStatus } from '../types';
import { Cpu, Server, Activity, Database, CheckCircle2, RotateCcw, AlertCircle, Settings, Play, Layers, Shield, Zap } from 'lucide-react';
import { toast } from './ui/Toast';

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
        await NuffiService.updateTaxEngineConfig(config);
        setTimeout(() => {
            setRecalibrating(false);
            toast.success('Silnik zrestartowany', 'Obliczenia zostały zaktualizowane zgodnie z nową konfiguracją.');
        }, 2000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Cpu className="text-indigo-600" /> Tax Engine Core
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Centrum dowodzenia silnikiem obliczeniowym (Rust Backend).
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

            {/* Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Przetworzone Tx</p>
                    <h3 className="text-3xl font-bold text-slate-900 font-mono">{status?.transactionsProcessed.toLocaleString() || '...'}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Prędkość (Tx/Sec)</p>
                    <h3 className="text-3xl font-bold text-indigo-600 font-mono">{status?.processingSpeed.toLocaleString() || '...'}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Uptime (SLA)</p>
                    <h3 className="text-3xl font-bold text-emerald-600 font-mono">{status?.uptime || '...'}%</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Ostatnia Synch.</p>
                    <h3 className="text-lg font-bold text-slate-700 font-mono mt-2 truncate">
                        {status ? new Date(status.lastSync).toLocaleTimeString() : '...'}
                    </h3>
                </div>
            </div>

            {/* Main Configuration */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <Settings size={18} className="text-slate-400" /> Konfiguracja Silnika
                        </h3>
                        <span className="text-xs font-mono text-slate-400">{config.engineVersion}</span>
                    </div>
                    
                    <div className="p-8 space-y-8">
                        {/* Strategy Selection */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-4">Metoda rozliczania kosztów (Cost Basis Strategy)</label>
                            <div className="grid grid-cols-3 gap-4">
                                {['FIFO', 'LIFO', 'HIFO'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setConfig({...config, strategy: s as any})}
                                        className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden group ${
                                            config.strategy === s 
                                                ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' 
                                                : 'border-slate-200 hover:border-indigo-200'
                                        }`}
                                    >
                                        <div className="relative z-10">
                                            <span className={`text-lg font-bold ${config.strategy === s ? 'text-indigo-900' : 'text-slate-600'}`}>{s}</span>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {s === 'FIFO' ? 'First-In, First-Out (Domyślna w PL)' : 
                                                 s === 'LIFO' ? 'Last-In, First-Out (Optymalizacja)' : 
                                                 'Highest-In, First-Out (Max strata)'}
                                            </p>
                                        </div>
                                        {config.strategy === s && <div className="absolute right-0 top-0 p-2 text-indigo-600"><CheckCircle2 size={18} /></div>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Toggles */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><Layers size={20} /></div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">DeFi Deep Scan</h4>
                                        <p className="text-xs text-slate-500">Analiza smart kontraktów i liquidity pools (Uniswap, Aave).</p>
                                    </div>
                                </div>
                                <div 
                                    onClick={() => setConfig({...config, includeDeFi: !config.includeDeFi})}
                                    className={`w-12 h-6 rounded-full cursor-pointer transition-colors p-1 ${config.includeDeFi ? 'bg-green-500' : 'bg-slate-300'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${config.includeDeFi ? 'translate-x-6' : ''}`}></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Shield size={20} /></div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">Real-time Blockchain Sync</h4>
                                        <p className="text-xs text-slate-500">Nasłuchiwanie transakcji w mempoolu (0-conf).</p>
                                    </div>
                                </div>
                                <div 
                                    onClick={() => setConfig({...config, isRealTime: !config.isRealTime})}
                                    className={`w-12 h-6 rounded-full cursor-pointer transition-colors p-1 ${config.isRealTime ? 'bg-green-500' : 'bg-slate-300'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${config.isRealTime ? 'translate-x-6' : ''}`}></div>
                                </div>
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
                                {recalibrating ? 'Przeliczanie...' : 'Zastosuj i Przelicz'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold mb-2 flex items-center gap-2"><Database size={18} /> Cache Status</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-indigo-200">Redis Keys</span>
                                    <span className="font-mono font-bold">142,500</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-indigo-200">Memory Usage</span>
                                    <span className="font-mono font-bold">1.2 GB</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-indigo-200">Hit Rate</span>
                                    <span className="font-mono font-bold text-green-300">98.5%</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <AlertCircle size={18} className="text-amber-500" /> Engine Logs
                        </h3>
                        <div className="font-mono text-[10px] space-y-2 text-slate-500 h-48 overflow-y-auto custom-scrollbar">
                            <p>[INFO] Engine initialized (Rust 1.75)</p>
                            <p>[INFO] Connected to PostgreSQL (TimescaleDB)</p>
                            <p>[INFO] Loaded 12450 txs into memory</p>
                            <p className="text-green-600">[SUCCESS] FIFO calc batch #4922 complete (12ms)</p>
                            <p>[INFO] Listening for Kafka events...</p>
                            <p>[WARN] High latency on RPC node (eth-mainnet)</p>
                            <p className="text-green-600">[SUCCESS] DeFi parser decoded 5 swaps</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
