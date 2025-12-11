
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { OssTransaction, OssCountryReport, IntrastatThreshold } from '../types';
import { Globe, FileText, TrendingUp, AlertCircle, ShoppingCart, Map, Download, Truck, CheckCircle2 } from 'lucide-react';
import { toast } from './ui/Toast';

export const InternationalTax: React.FC = () => {
    const [transactions, setTransactions] = useState<OssTransaction[]>([]);
    const [reports, setReports] = useState<OssCountryReport[]>([]);
    const [intrastat, setIntrastat] = useState<IntrastatThreshold[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const [txs, reps, intra] = await Promise.all([
                NuffiService.fetchOssData(),
                NuffiService.calculateOssTax(),
                NuffiService.fetchIntrastatStatus()
            ]);
            setTransactions(txs);
            setReports(reps);
            setIntrastat(intra);
            setLoading(false);
        };
        load();
    }, []);

    const formatEur = (val: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(val);
    const formatPln = (val: number) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(val);

    const totalVatOss = reports.reduce((acc, r) => acc + r.totalVatEur, 0);
    const limitUsed = (reports.reduce((acc, r) => acc + r.totalNetEur, 0) / 10000) * 100;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Globe className="text-gold" /> Podatki Międzynarodowe (OSS & Intrastat)
                    </h2>
                    <p className="text-zinc-400 mt-1">Rozliczanie sprzedaży wysyłkowej do UE (Procedura One-Stop-Shop) i statystyka celna.</p>
                </div>
                <button 
                    onClick={() => toast.success('Deklaracja wygenerowana', 'Plik XML dla VIU-DO został przygotowany.')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-500 flex items-center gap-2 shadow-lg shadow-indigo-900/30"
                >
                    <FileText size={18} /> Generuj Deklarację VIU-DO
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Threshold Monitor (OSS) */}
                <div className="lg:col-span-2 bg-[#0A0A0C] border border-white/10 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                            <TrendingUp size={20} className="text-emerald-400" /> Limit Sprzedaży Wewnątrzwspólnotowej
                        </h3>
                        <p className="text-zinc-400 text-sm mb-6 max-w-xl">
                            Po przekroczeniu limitu 10 000 EUR (42 000 PLN) sprzedaży do konsumentów w UE, musisz rejestrować się do VAT OSS i stosować stawki kraju nabywcy.
                        </p>
                        
                        <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-widest text-zinc-500">
                            <span>Wykorzystanie Limitu</span>
                            <span>{limitUsed.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-4 rounded-full overflow-hidden border border-white/10">
                            <div 
                                className={`h-full rounded-full transition-all duration-1000 ${limitUsed > 80 ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b]' : 'bg-emerald-500 shadow-[0_0_10px_#10b981]'}`} 
                                style={{width: `${Math.min(100, limitUsed)}%`}}
                            ></div>
                        </div>
                        <div className="mt-2 flex justify-between text-sm font-mono text-zinc-400">
                            <span>0 EUR</span>
                            <span className="text-white font-bold">10 000 EUR</span>
                        </div>
                    </div>
                    {/* Map Deco */}
                    <div className="absolute right-0 top-0 opacity-5 text-indigo-500">
                        <Map size={300} />
                    </div>
                </div>

                {/* Intrastat Status */}
                <div className="neo-card p-6 rounded-2xl flex flex-col justify-center">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Truck className="text-gold" /> Monitor Intrastat
                    </h3>
                    <div className="space-y-4">
                        {intrastat.map(i => (
                            <div key={i.type} className="bg-white/5 p-3 rounded-xl border border-white/10">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-zinc-500 uppercase">{i.type === 'IMPORT' ? 'Przywóz' : 'Wywóz'}</span>
                                    {i.status === 'SAFE' ? (
                                        <span className="text-emerald-400 text-xs font-bold flex items-center gap-1"><CheckCircle2 size={12} /> OK</span>
                                    ) : (
                                        <span className="text-amber-500 text-xs font-bold flex items-center gap-1"><AlertCircle size={12} /> Limit!</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="font-mono font-bold text-white text-sm">{formatPln(i.currentValue)}</span>
                                    <span className="text-xs text-zinc-500">/ {formatPln(i.limit)}</span>
                                </div>
                                <div className="w-full bg-black/40 h-1.5 rounded-full mt-2 overflow-hidden border border-white/5">
                                    <div className="bg-indigo-500 h-full" style={{width: `${(i.currentValue/i.limit)*100}%`}}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Country Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="neo-card rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/10 bg-white/5">
                        <h3 className="font-bold text-white">Należny VAT wg Kraju</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        {reports.map(rep => (
                            <div key={rep.countryCode} className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-black/40 rounded-xl flex items-center justify-center font-bold text-zinc-400 text-lg shadow-sm border border-white/10">
                                    {rep.countryCode}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <h4 className="font-bold text-white">{rep.countryName}</h4>
                                        <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-bold border border-indigo-500/20">VAT {(rep.standardRate * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Netto: {formatEur(rep.totalNetEur)}</span>
                                        <span className="font-bold font-mono text-gold">{formatEur(rep.totalVatEur)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-white/5 border-t border-white/10 flex justify-between items-center">
                        <span className="text-sm font-bold text-zinc-300">Razem do zapłaty (OSS):</span>
                        <span className="text-xl font-bold text-indigo-400 font-mono">{formatEur(totalVatOss)}</span>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Recent Transactions */}
                    <div className="neo-card rounded-2xl overflow-hidden flex flex-col h-full">
                        <div className="p-6 border-b border-white/10 bg-white/5">
                            <h3 className="font-bold text-white">Ostatnie Transakcje Zagraniczne</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto max-h-[300px] custom-scrollbar">
                            {loading ? <div className="p-6 text-center text-zinc-500">Ładowanie...</div> : (
                                <table className="w-full text-sm text-left">
                                    <tbody className="divide-y divide-white/5">
                                        {transactions.map(tx => (
                                            <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <ShoppingCart size={14} className="text-zinc-500" />
                                                        <span className="font-bold text-zinc-300">{tx.source}</span>
                                                    </div>
                                                    <p className="text-xs text-zinc-500 ml-6">{tx.date}</p>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="font-bold bg-black/40 px-2 py-1 rounded text-xs text-zinc-400 border border-white/5">{tx.countryCode}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-white">
                                                    {formatEur(tx.amountEur)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
