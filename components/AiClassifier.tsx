
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { UnclassifiedTransaction } from '../types';
import { BrainCircuit, Check, X, Tag, AlertCircle, ArrowRight, Wallet, Sparkles, Loader2 } from 'lucide-react';
import { toast } from './ui/Toast';

export const AiClassifier: React.FC = () => {
    const [transactions, setTransactions] = useState<UnclassifiedTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTx, setSelectedTx] = useState<UnclassifiedTransaction | null>(null);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchUnclassifiedTransactions();
            setTransactions(data);
            if (data.length > 0) setSelectedTx(data[0]);
            setLoading(false);
        };
        load();
    }, []);

    const handleClassify = async (tx: UnclassifiedTransaction, category: string) => {
        setProcessingId(tx.id);
        await NuffiService.classifyTransaction(tx.id, category);
        toast.success('Zaksięgowano', `Transakcja przypisana do kategorii: ${category}`);
        
        // Remove from list
        const remaining = transactions.filter(t => t.id !== tx.id);
        setTransactions(remaining);
        if (remaining.length > 0) setSelectedTx(remaining[0]);
        else setSelectedTx(null);
        
        setProcessingId(null);
    };

    const formatCurrency = (val: number, curr: string) => {
        try {
            return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: curr }).format(val);
        } catch (e) {
            return `${val.toLocaleString('pl-PL')} ${curr}`;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <BrainCircuit className="text-indigo-600" /> Nuffi AI Lab
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Klasyfikacja transakcji "Human-in-the-loop". Ucz model na trudnych przypadkach.
                    </p>
                </div>
                <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-indigo-100 flex items-center gap-2">
                    <Sparkles size={14} /> AI Confidence Threshold: &lt;70%
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
                {/* List */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="font-bold text-slate-900 text-sm">Do wyjaśnienia ({transactions.length})</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {loading ? <div className="p-8 text-center"><Loader2 className="animate-spin" /></div> : 
                            transactions.length === 0 ? (
                                <div className="p-8 text-center text-slate-400 text-sm">Wszystkie transakcje sklasyfikowane!</div>
                            ) : (
                                transactions.map(tx => (
                                    <div 
                                        key={tx.id} 
                                        onClick={() => setSelectedTx(tx)}
                                        className={`p-4 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 ${selectedTx?.id === tx.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-slate-900 text-sm">{formatCurrency(tx.amount, tx.currency)}</span>
                                            <span className="text-[10px] text-slate-400">{tx.date}</span>
                                        </div>
                                        <p className="text-xs text-slate-600 line-clamp-1">{tx.description}</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${tx.confidence > 0.5 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                                {(tx.confidence * 100).toFixed(0)}% Pewności
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )
                        }
                    </div>
                </div>

                {/* Detail & Action */}
                <div className="lg:col-span-2 bg-slate-900 text-white rounded-2xl shadow-xl p-8 relative overflow-hidden flex flex-col justify-center">
                    {selectedTx ? (
                        <div className="relative z-10 animate-in fade-in slide-in-from-right-4">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-white/10 p-3 rounded-xl">
                                    <Wallet size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">{selectedTx.description}</h3>
                                    <p className="text-slate-400 text-sm flex items-center gap-2">
                                        {selectedTx.source} <span className="w-1 h-1 bg-slate-500 rounded-full"></span> {selectedTx.date}
                                    </p>
                                </div>
                            </div>

                            <div className="text-4xl font-mono font-bold mb-8 text-indigo-400">
                                {formatCurrency(selectedTx.amount, selectedTx.currency)}
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
                                <h4 className="flex items-center gap-2 font-bold text-indigo-300 mb-3">
                                    <Sparkles size={18} /> Sugestia AI
                                </h4>
                                <div className="flex items-start gap-4">
                                    <div className="flex-1">
                                        <p className="text-lg font-bold text-white mb-1">{selectedTx.aiSuggestion.category}</p>
                                        <p className="text-sm text-slate-300 leading-relaxed">"{selectedTx.aiSuggestion.reasoning}"</p>
                                    </div>
                                    <div className="shrink-0">
                                        <div className="text-center bg-black/20 p-2 rounded-lg">
                                            <span className="block text-2xl font-bold text-amber-400">{(selectedTx.confidence * 100).toFixed(0)}%</span>
                                            <span className="text-[10px] uppercase text-slate-500 font-bold">Confidence</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => handleClassify(selectedTx, selectedTx.aiSuggestion.category)}
                                    disabled={!!processingId}
                                    className="bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
                                >
                                    {processingId === selectedTx.id ? <Loader2 className="animate-spin" /> : <><Check size={20} /> Zatwierdź AI</>}
                                </button>
                                <button 
                                    disabled={!!processingId}
                                    className="bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-white/10"
                                >
                                    <Tag size={20} /> Zmień Kategorię
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-slate-500 relative z-10">
                            <Check size={64} className="mx-auto mb-4 opacity-20" />
                            <p>Brak transakcji do przeglądu.</p>
                        </div>
                    )}
                    {/* Deco */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                </div>
            </div>
        </div>
    );
};
