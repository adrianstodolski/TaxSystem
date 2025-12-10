
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { UnifiedLedgerItem } from '../types';
import { BookOpen, Search, Filter, Download, ArrowUpRight, ArrowDownRight, Tag, AlertTriangle, CheckCircle2, MoreHorizontal, Bitcoin, FileText, Wallet, TrendingUp } from 'lucide-react';
import { toast } from './ui/Toast';

export const GeneralLedger: React.FC = () => {
    const [transactions, setTransactions] = useState<UnifiedLedgerItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'REVENUE' | 'COST'>('ALL');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchUnifiedLedger();
            setTransactions(data);
            setLoading(false);
        };
        load();
    }, []);

    const formatCurrency = (val: number) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(val);

    const getSourceIcon = (source: string) => {
        switch(source) {
            case 'BANK': return <Wallet size={16} className="text-blue-500" />;
            case 'CRYPTO': return <Bitcoin size={16} className="text-orange-500" />;
            case 'INVOICE': return <FileText size={16} className="text-purple-500" />;
            case 'STOCK': return <TrendingUp size={16} className="text-emerald-500" />;
            default: return <BookOpen size={16} />;
        }
    };

    const getCategoryStyle = (cat: string) => {
        switch(cat) {
            case 'REVENUE': return 'bg-green-100 text-green-700 border-green-200';
            case 'COST': return 'bg-red-100 text-red-700 border-red-200';
            case 'TAX': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const filtered = transactions.filter(t => {
        if (filter !== 'ALL' && t.taxCategory !== filter) return false;
        if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <BookOpen className="text-indigo-600" /> Księga Główna (General Ledger)
                    </h2>
                    <p className="text-slate-500 mt-1">
                        One Source of Truth. Wszystkie zdarzenia gospodarcze w jednym miejscu.
                    </p>
                </div>
                <button 
                    onClick={() => toast.success('Eksport CSV', 'Pobrano pełny rejestr operacji.')}
                    className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 flex items-center gap-2 shadow-sm"
                >
                    <Download size={18} /> Eksportuj
                </button>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[600px]">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="text" 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Szukaj transakcji..." 
                                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64"
                            />
                        </div>
                        <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                            <button onClick={() => setFilter('ALL')} className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${filter === 'ALL' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}>Wszystkie</button>
                            <button onClick={() => setFilter('REVENUE')} className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${filter === 'REVENUE' ? 'bg-green-100 text-green-700' : 'text-slate-500 hover:text-slate-700'}`}>Przychody</button>
                            <button onClick={() => setFilter('COST')} className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${filter === 'COST' ? 'bg-red-100 text-red-700' : 'text-slate-500 hover:text-slate-700'}`}>Koszty</button>
                        </div>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 p-2">
                        <Filter size={18} />
                    </button>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase sticky top-0 z-10 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 font-medium">Data</th>
                                <th className="px-6 py-3 font-medium">Źródło</th>
                                <th className="px-6 py-3 font-medium">Opis</th>
                                <th className="px-6 py-3 font-medium">Tagi</th>
                                <th className="px-6 py-3 font-medium text-right">Kwota (PLN)</th>
                                <th className="px-6 py-3 font-medium text-center">Status</th>
                                <th className="px-6 py-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={7} className="p-8 text-center text-slate-400">Ładowanie księgi...</td></tr>
                            ) : filtered.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50 group">
                                    <td className="px-6 py-4 font-mono text-slate-500 text-xs">{item.date}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-slate-100 rounded-lg">{getSourceIcon(item.source)}</div>
                                            <div>
                                                <p className="font-bold text-slate-700 text-xs">{item.provider}</p>
                                                <p className="text-[10px] text-slate-400 font-bold">{item.source}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{item.description}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1 flex-wrap">
                                            {item.tags.map(tag => (
                                                <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                                                    <Tag size={10} /> {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-mono font-bold ${item.amountPln > 0 ? 'text-green-600' : 'text-slate-900'}`}>
                                        {formatCurrency(item.amountPln)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {item.reconciled ? (
                                            <span className="inline-flex items-center gap-1 text-green-600 text-[10px] font-bold bg-green-50 px-2 py-1 rounded-full">
                                                <CheckCircle2 size={12} /> UZGODNIONE
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-amber-600 text-[10px] font-bold bg-amber-50 px-2 py-1 rounded-full">
                                                <AlertTriangle size={12} /> BRAK POKRYCIA
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-slate-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Footer Summary */}
                <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-between items-center text-xs text-slate-500">
                    <div>
                        Wyświetlono {filtered.length} transakcji
                    </div>
                    <div className="flex gap-6">
                        <span>Suma Przych.: <strong className="text-green-600">{formatCurrency(filtered.filter(t => t.taxCategory === 'REVENUE').reduce((acc, t) => acc + t.amountPln, 0))}</strong></span>
                        <span>Suma Kosztów: <strong className="text-red-600">{formatCurrency(filtered.filter(t => t.taxCategory === 'COST').reduce((acc, t) => acc + t.amountPln, 0))}</strong></span>
                    </div>
                </div>
            </div>
        </div>
    );
};
