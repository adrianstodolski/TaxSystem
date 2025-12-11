
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { WhaleWallet, WhaleTx } from '../types';
import { Siren, ArrowRight, Wallet, Activity, Search, AlertTriangle, ArrowDownRight, Eye, Radar } from 'lucide-react';
import { toast } from './ui/Toast';
import { safeFormatCurrency } from '../utils/formatters';

export const WhaleWatcher: React.FC = () => {
    const [wallets, setWallets] = useState<WhaleWallet[]>([]);
    const [txs, setTxs] = useState<WhaleTx[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const [w, t] = await Promise.all([
                NuffiService.fetchWhaleWallets(),
                NuffiService.fetchWhaleTransactions()
            ]);
            setWallets(w);
            setTxs(t);
            setLoading(false);
        };
        load();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Radar className="text-indigo-400" /> Whale Watcher (Smart Money)
                    </h2>
                    <p className="text-slate-400 mt-1">
                        Śledzenie ruchów portfeli instytucjonalnych i VC. Wykrywanie presji sprzedażowej.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-mono border border-white/10">
                    <Activity size={12} className="text-green-400 animate-pulse" /> Live Feed
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Watchlist */}
                <div className="lg:col-span-1 glass-card rounded-2xl overflow-hidden flex flex-col h-[600px]">
                    <div className="p-4 border-b border-white/10 bg-slate-900/30">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Eye size={16} /> Obserwowane Portfele
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-white/5 custom-scrollbar">
                        {wallets.map((w, i) => (
                            <div key={i} className="p-4 hover:bg-white/5 transition-colors group cursor-pointer">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-slate-200 text-sm">{w.label}</h4>
                                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-bold uppercase border border-indigo-500/30">{w.chain}</span>
                                </div>
                                <p className="text-xs font-mono text-slate-500 truncate mb-2">{w.address}</p>
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-1">
                                        {w.tags.map(t => (
                                            <span key={t} className="text-[9px] border border-slate-700 text-slate-400 px-1.5 rounded bg-slate-800">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="font-bold text-xs text-white">{safeFormatCurrency(w.balanceUsd, 'USD')}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Live Feed */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Alert Banner */}
                    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2 text-rose-400 font-bold uppercase text-xs tracking-wider">
                                <Siren size={14} className="animate-pulse" /> High Alert
                            </div>
                            <h3 className="text-2xl font-bold">Wykryto duży napływ na giełdy (Inflow)</h3>
                            <p className="text-slate-400 text-sm mt-1">
                                Portfel powiązany z <strong>Alameda Research</strong> przesłał 5,000 ETH na Binance. Ryzyko dumpu.
                            </p>
                        </div>
                        <div className="absolute right-0 top-0 w-32 h-32 bg-rose-600/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    </div>

                    {/* Transaction List */}
                    <div className="glass-card rounded-2xl overflow-hidden">
                        <div className="p-4 border-b border-white/10 bg-slate-900/30">
                            <h3 className="font-bold text-white">Ostatnie Ruchy</h3>
                        </div>
                        <div className="divide-y divide-white/5">
                            {txs.map(tx => (
                                <div key={tx.id} className="p-4 hover:bg-white/5 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                                                tx.type === 'INFLOW' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                                                tx.type === 'OUTFLOW' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                                'bg-slate-800 text-slate-400 border-slate-700'
                                            }`}>
                                                {tx.type}
                                            </span>
                                            <span className="text-xs text-slate-500 font-mono">
                                                {new Date(tx.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <span className="font-mono font-bold text-sm text-white">
                                            {safeFormatCurrency(tx.valueUsd, 'USD')}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="flex items-center gap-2 bg-slate-800 px-2 py-1 rounded border border-slate-700 max-w-[140px]">
                                            <Wallet size={12} className="text-slate-500" />
                                            <span className="truncate font-medium text-slate-300">{tx.fromLabel || tx.fromAddress.substring(0,8)}</span>
                                        </div>
                                        <ArrowRight size={14} className="text-slate-600" />
                                        <div className="flex items-center gap-2 bg-slate-800 px-2 py-1 rounded border border-slate-700 max-w-[140px]">
                                            <Wallet size={12} className="text-slate-500" />
                                            <span className="truncate font-medium text-slate-300">{tx.toLabel || tx.toAddress.substring(0,8)}</span>
                                        </div>
                                        <div className="ml-auto font-mono text-xs font-bold text-indigo-400">
                                            {tx.amount} {tx.token}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
