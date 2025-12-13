
import React, { useEffect, useState, useMemo } from 'react';
import { NuffiService } from '../services/api';
import { UnifiedLedgerItem } from '../types';
import { BookOpen, Download, Wallet, Bitcoin, FileText, TrendingUp, Tag, CheckCircle2, AlertTriangle, Calendar, Filter, Search, Link as LinkIcon, Split, Eye, Code, X } from 'lucide-react';
import { toast } from './ui/Toast';
import { DataTable } from './ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { motion, AnimatePresence } from 'framer-motion';

export const GeneralLedger: React.FC = () => {
    const [transactions, setTransactions] = useState<UnifiedLedgerItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'LIST' | 'RECONCILE'>('LIST');
    const [selectedTx, setSelectedTx] = useState<UnifiedLedgerItem | null>(null);
    const [filterSource, setFilterSource] = useState('ALL');

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchUnifiedLedger();
            // Mock enrichment for demo
            const enriched = data.map(d => ({
                ...d,
                hash: '0x' + Math.random().toString(16).substr(2, 64),
                relatedDoc: d.source === 'BANK' ? 'INV-2023/10/001' : undefined
            }));
            setTransactions(enriched);
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
        { 
            accessorKey: 'date', 
            header: 'Data / Czas', 
            cell: info => <span className="font-mono text-slate-500 text-xs">{info.getValue() as string}</span> 
        },
        { 
            accessorKey: 'source', 
            header: 'Źródło', 
            cell: info => (
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/5 rounded-lg border border-white/5">{getSourceIcon(info.getValue() as string)}</div>
                    <div>
                        <p className="font-bold text-white text-xs">{info.row.original.provider}</p>
                        <p className="text-[10px] text-slate-500 font-bold">{info.getValue() as string}</p>
                    </div>
                </div>
            )
        },
        { 
            accessorKey: 'description', 
            header: 'Opis Operacji', 
            cell: info => (
                <div className="max-w-[200px] truncate">
                    <span className="font-medium text-white text-sm">{info.getValue() as string}</span>
                    {(info.row.original as any).hash && (
                        <p className="text-[9px] text-zinc-600 font-mono mt-0.5 truncate">Hash: {(info.row.original as any).hash.substring(0, 16)}...</p>
                    )}
                </div>
            ) 
        },
        { 
            accessorKey: 'tags', 
            header: 'Tagi', 
            cell: info => (
                <div className="flex gap-1 flex-wrap">
                    {(info.getValue() as string[]).map(tag => (
                        <span key={tag} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1">
                            <Tag size={8} /> {tag}
                        </span>
                    ))}
                </div>
            )
        },
        { 
            accessorKey: 'amountPln', 
            header: 'Kwota (PLN)', 
            cell: info => (
                <span className={`font-mono font-bold text-sm ${(info.getValue() as number) > 0 ? 'text-green-400' : 'text-slate-200'}`}>
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
                        <CheckCircle2 size={10} /> MATCH
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 text-amber-400 text-[10px] font-bold bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
                        <AlertTriangle size={10} /> UNMATCHED
                    </span>
                )
            )
        },
        {
            id: 'actions',
            cell: info => (
                <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedTx(info.row.original); }}
                    className="p-1.5 hover:bg-white/10 rounded text-zinc-500 hover:text-white transition-colors"
                >
                    <Eye size={14} />
                </button>
            )
        }
    ], []);

    const filteredData = transactions.filter(t => filterSource === 'ALL' || t.source === filterSource);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20 relative h-[calc(100vh-100px)] flex flex-col">
            <header className="flex justify-between items-center border-b border-white/10 pb-6 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <BookOpen className="text-gold" /> Ledger Prime
                    </h2>
                    <p className="text-zinc-400 mt-1">Główna Księga Handlowa. Immutable Audit Log.</p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-onyx p-1 rounded-xl border border-white/10 flex">
                        <button onClick={() => setViewMode('LIST')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${viewMode === 'LIST' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'}`}>
                            Lista
                        </button>
                        <button onClick={() => setViewMode('RECONCILE')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${viewMode === 'RECONCILE' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'}`}>
                            Uzgodnienia
                        </button>
                    </div>
                    <button onClick={() => toast.success('Eksport CSV', 'Pobrano pełny rejestr operacji.')} className="bg-gold text-black px-4 py-2 rounded-xl font-bold hover:bg-[#FCD34D] flex items-center gap-2 shadow-sm transition-all text-xs">
                        <Download size={14} /> Eksportuj
                    </button>
                </div>
            </header>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Main Table Area */}
                <div className={`flex-1 flex flex-col transition-all duration-300 ${selectedTx ? 'w-2/3' : 'w-full'}`}>
                    <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full">
                        {/* Filter Toolbar */}
                        <div className="p-4 border-b border-white/10 bg-slate-900/30 flex items-center gap-4 shrink-0">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                                <input type="text" placeholder="Szukaj..." className="pl-9 pr-4 py-1.5 bg-black/20 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-gold/50" />
                            </div>
                            <div className="h-6 w-px bg-white/10"></div>
                            {['ALL', 'BANK', 'CRYPTO', 'INVOICE'].map(f => (
                                <button 
                                    key={f} 
                                    onClick={() => setFilterSource(f)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors ${filterSource === f ? 'bg-indigo-600 text-white' : 'text-zinc-500 hover:text-white bg-white/5'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        {viewMode === 'LIST' && (
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                                <DataTable columns={columns} data={filteredData} onRowClick={setSelectedTx} />
                            </div>
                        )}

                        {viewMode === 'RECONCILE' && (
                            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-2 gap-8 h-full">
                                    <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                                        <h4 className="text-zinc-400 text-xs font-bold uppercase mb-4">Wyciągi Bankowe (Unmatched)</h4>
                                        <div className="space-y-3">
                                            {transactions.filter(t => t.source === 'BANK' && !t.reconciled).map(t => (
                                                <div key={t.id} className="p-3 bg-white/5 rounded-lg border border-white/5 cursor-pointer hover:border-gold/30">
                                                    <div className="flex justify-between">
                                                        <span className="text-white font-bold">{formatCurrency(t.amountPln)}</span>
                                                        <span className="text-xs text-zinc-500">{t.date}</span>
                                                    </div>
                                                    <p className="text-xs text-zinc-400 truncate mt-1">{t.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                                        <h4 className="text-zinc-400 text-xs font-bold uppercase mb-4">Dokumenty Księgowe (Unmatched)</h4>
                                        <div className="space-y-3">
                                            {transactions.filter(t => t.source === 'INVOICE' && !t.reconciled).map(t => (
                                                <div key={t.id} className="p-3 bg-white/5 rounded-lg border border-white/5 cursor-pointer hover:border-emerald-500/30">
                                                    <div className="flex justify-between">
                                                        <span className="text-white font-bold">{formatCurrency(t.amountPln)}</span>
                                                        <span className="text-xs text-zinc-500">{t.date}</span>
                                                    </div>
                                                    <p className="text-xs text-zinc-400 truncate mt-1">{t.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Transaction Anatomy Panel */}
                <AnimatePresence>
                    {selectedTx && (
                        <motion.div 
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 400, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="bg-[#0A0A0C] border-l border-white/10 h-full flex flex-col shadow-2xl relative shrink-0"
                        >
                            <button onClick={() => setSelectedTx(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X size={18} /></button>
                            
                            <div className="p-6 border-b border-white/5">
                                <h3 className="text-lg font-bold text-white mb-1">Szczegóły Operacji</h3>
                                <p className="text-xs text-zinc-500 font-mono">ID: {selectedTx.id}</p>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                <div className="text-center py-6 bg-white/5 rounded-2xl border border-white/5">
                                    <p className="text-zinc-500 text-xs uppercase mb-2">Kwota</p>
                                    <h2 className={`text-4xl font-mono font-bold ${selectedTx.amountPln > 0 ? 'text-green-400' : 'text-white'}`}>
                                        {formatCurrency(selectedTx.amountPln)}
                                    </h2>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-zinc-500 uppercase mb-3 flex items-center gap-2"><LinkIcon size={12} /> Powiązania (Lineage)</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                                            <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded"><Wallet size={14} /></div>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold text-zinc-300">Wyciąg Bankowy</p>
                                                <p className="text-[10px] text-zinc-500">Pobrane z mBank API</p>
                                            </div>
                                            <CheckCircle2 size={14} className="text-emerald-500" />
                                        </div>
                                        {(selectedTx as any).relatedDoc && (
                                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                                                <div className="p-1.5 bg-purple-500/10 text-purple-400 rounded"><FileText size={14} /></div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-zinc-300">Faktura {(selectedTx as any).relatedDoc}</p>
                                                    <p className="text-[10px] text-zinc-500">Powiązano automatycznie</p>
                                                </div>
                                                <CheckCircle2 size={14} className="text-emerald-500" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-zinc-500 uppercase mb-3 flex items-center gap-2"><Code size={12} /> Raw Data (JSON)</h4>
                                    <div className="bg-[#050505] p-3 rounded-lg border border-white/10 font-mono text-[10px] text-zinc-400 overflow-x-auto">
                                        <pre>{JSON.stringify(selectedTx, null, 2)}</pre>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-white/10 bg-white/5">
                                <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors border border-white/5">
                                    Pobierz Dowód Księgowy (PDF)
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
