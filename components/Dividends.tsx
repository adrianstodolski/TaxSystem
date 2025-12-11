
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { Dividend } from '../types';
import { Receipt, DollarSign, Calendar, TrendingUp, Info, CheckCircle2, AlertCircle, Plus, Filter, Wallet } from 'lucide-react';
import { toast } from './ui/Toast';

export const Dividends: React.FC = () => {
    const [dividends, setDividends] = useState<Dividend[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchDividends();
            setDividends(data);
            setLoading(false);
        };
        load();
    }, []);

    const formatCurrency = (val: number, curr: string) => {
        try {
            return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: curr, maximumFractionDigits: 2 }).format(val);
        } catch (e) {
            return `${val.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${curr}`;
        }
    };

    const totalTaxDuePl = dividends.reduce((acc, d) => acc + d.taxDuePl, 0);
    const totalReceivedNet = dividends.reduce((acc, d) => acc + (d.amountGross - d.taxPaidForeign), 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Receipt className="text-indigo-400" /> Centrum Dywidend (WHT)
                    </h2>
                    <p className="text-slate-400 mt-1">
                        Automatyczne rozliczanie dywidend zagranicznych i podatku u źródła (Withholding Tax).
                    </p>
                </div>
                <button 
                    onClick={() => toast.success('Import rozpoczęty', 'Pobieranie historii z Interactive Brokers...')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-500 flex items-center gap-2 shadow-lg shadow-indigo-900/50 transition-all"
                >
                    <Plus size={18} /> Importuj (CSV/API)
                </button>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden border border-white/10">
                    <div className="relative z-10">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Otrzymane Dywidendy (Netto)</p>
                        <h3 className="text-4xl font-bold text-white tracking-tight">{formatCurrency(totalReceivedNet, 'USD')}</h3>
                        <p className="text-xs text-slate-500 mt-2">Po potrąceniu podatku zagranicznego.</p>
                    </div>
                    <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                </div>

                <div className="glass-card p-6 rounded-2xl">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Do dopłaty w Polsce (PIT-38)</p>
                    <h3 className="text-4xl font-bold text-rose-400 tracking-tight">{formatCurrency(totalTaxDuePl, 'PLN')}</h3>
                    <p className="text-xs text-slate-400 mt-2">Różnica między 19% a pobranym WHT.</p>
                </div>

                <div className="bg-indigo-500/10 p-6 rounded-2xl border border-indigo-500/20 flex flex-col justify-center">
                    <div className="flex items-start gap-3">
                        <Info className="text-indigo-400 shrink-0 mt-1" size={20} />
                        <div>
                            <h4 className="font-bold text-indigo-300 text-sm">Zasada Unikania Podwójnego Opodatkowania</h4>
                            <p className="text-xs text-indigo-200/80 mt-1 leading-relaxed">
                                Nuffi automatycznie przelicza dywidendy na PLN wg kursu NBP z dnia roboczego poprzedzającego wypłatę. 
                                Odlicza podatek zapłacony za granicą (np. 15% USA) od polskiej stawki 19%.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dividend List */}
            <div className="glass-card rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-900/30">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Wallet size={18} className="text-slate-400" /> Rejestr Wypłat
                    </h3>
                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors">
                            <Filter size={16} />
                        </button>
                    </div>
                </div>
                
                <table className="w-full text-sm text-left text-slate-300">
                    <thead className="bg-slate-900/50 text-slate-500 border-b border-white/10">
                        <tr>
                            <th className="px-6 py-3 font-medium">Spółka</th>
                            <th className="px-6 py-3 font-medium">Data Wypłaty</th>
                            <th className="px-6 py-3 font-medium text-right">Brutto</th>
                            <th className="px-6 py-3 font-medium text-right">WHT (Zagranica)</th>
                            <th className="px-6 py-3 font-medium text-right">Dopłata (PL)</th>
                            <th className="px-6 py-3 font-medium text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {dividends.map(div => (
                            <tr key={div.id} className="hover:bg-white/5 group transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold border ${div.country === 'US' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                                            {div.country}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">{div.ticker}</p>
                                            <p className="text-xs text-slate-500">{div.companyName}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-slate-400">{div.paymentDate}</td>
                                <td className="px-6 py-4 text-right font-mono font-bold text-white">
                                    {formatCurrency(div.amountGross, div.currency)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="font-mono text-slate-400">-{formatCurrency(div.taxPaidForeign, div.currency)}</div>
                                    <div className="text-[10px] text-slate-500">Rate: {(div.whtRate * 100).toFixed(0)}%</div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20">
                                        {formatCurrency(div.taxDuePl, 'PLN')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {div.status === 'RECEIVED' ? (
                                        <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded text-[10px] font-bold border border-green-500/30">
                                            <CheckCircle2 size={10} /> Otrzymano
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-400 px-2 py-1 rounded text-[10px] font-bold border border-amber-500/30">
                                            <Calendar size={10} /> Oczekująca
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
