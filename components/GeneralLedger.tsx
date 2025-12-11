
import React, { useEffect, useState, useMemo } from 'react';
import { NuffiService } from '../services/api';
import { UnifiedLedgerItem } from '../types';
import { BookOpen, Download, Wallet, Bitcoin, FileText, TrendingUp, Tag, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from './ui/Toast';
import { DataTable } from './ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';

export const GeneralLedger: React.FC = () => {
    const [transactions, setTransactions] = useState<UnifiedLedgerItem[]>([]);
    const [loading, setLoading] = useState(true);

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
            case 'BANK': return <Wallet size={16} className="text-blue-400" />;
            case 'CRYPTO': return <Bitcoin size={16} className="text-orange-400" />;
            case 'INVOICE': return <FileText size={16} className="text-purple-400" />;
            case 'STOCK': return <TrendingUp size={16} className="text-emerald-400" />;
            default: return <BookOpen size={16} />;
        }
    };

    const columns = useMemo<ColumnDef<UnifiedLedgerItem>[]>(() => [
        { accessorKey: 'date', header: 'Data', cell: info => <span className="font-mono text-slate-500 text-xs">{info.getValue() as string}</span> },
        { 
            accessorKey: 'source', 
            header: 'Źródło', 
            cell: info => (
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-slate-800 rounded-lg border border-slate-700">{getSourceIcon(info.getValue() as string)}</div>
                    <div>
                        <p className="font-bold text-white text-xs">{info.row.original.provider}</p>
                        <p className="text-[10px] text-slate-500 font-bold">{info.getValue() as string}</p>
                    </div>
                </div>
            )
        },
        { accessorKey: 'description', header: 'Opis', cell: info => <span className="font-medium text-white">{info.getValue() as string}</span> },
        { 
            accessorKey: 'tags', 
            header: 'Tagi', 
            cell: info => (
                <div className="flex gap-1 flex-wrap">
                    {(info.getValue() as string[]).map(tag => (
                        <span key={tag} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1">
                            <Tag size={10} /> {tag}
                        </span>
                    ))}
                </div>
            )
        },
        { 
            accessorKey: 'amountPln', 
            header: 'Kwota (PLN)', 
            cell: info => (
                <span className={`font-mono font-bold ${(info.getValue() as number) > 0 ? 'text-green-400' : 'text-slate-200'}`}>
                    {formatCurrency(info.getValue() as number)}
                </span>
            )
        },
        {
            accessorKey: 'reconciled',
            header: 'Status',
            cell: info => (
                info.getValue() ? (
                    <span className="inline-flex items-center gap-1 text-green-400 text-[10px] font-bold bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                        <CheckCircle2 size={12} /> UZGODNIONE
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 text-amber-400 text-[10px] font-bold bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
                        <AlertTriangle size={12} /> BRAK POKRYCIA
                    </span>
                )
            )
        }
    ], []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <BookOpen className="text-indigo-400" /> Księga Główna (General Ledger)
                    </h2>
                    <p className="text-slate-400 mt-1">One Source of Truth. Wszystkie zdarzenia gospodarcze w jednym miejscu.</p>
                </div>
                <button onClick={() => toast.success('Eksport CSV', 'Pobrano pełny rejestr operacji.')} className="bg-slate-900 border border-slate-700 text-slate-300 px-4 py-2 rounded-xl font-bold hover:text-white hover:bg-slate-800 flex items-center gap-2 shadow-sm transition-colors">
                    <Download size={18} /> Eksportuj
                </button>
            </header>

            <div className="glass-card rounded-2xl p-6">
                <DataTable columns={columns} data={transactions} />
            </div>
        </div>
    );
};
