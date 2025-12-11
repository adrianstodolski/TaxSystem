
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { CashDocument } from '../types';
import { Wallet, TrendingUp, TrendingDown, RefreshCw, FileText, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { safeFormatCurrency } from '../utils/formatters';
import { toast } from './ui/Toast';

export const CashRegister: React.FC = () => {
    const [docs, setDocs] = useState<CashDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState(5450); // Mock starting balance

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchCashDocuments();
            setDocs(data);
            if(data.length > 0) setBalance(data[data.length-1].balanceAfter);
            setLoading(false);
        };
        load();
    }, []);

    const handleAddDoc = (type: 'KP' | 'KW') => {
        toast.info(`Nowy ${type}`, 'Otwieranie formularza kasowego...');
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Wallet className="text-indigo-400" /> Raport Kasowy (Cash Register)
                    </h2>
                    <p className="text-zinc-400 mt-1">
                        Ewidencja obrotu gotówkowego. Dokumenty KP (Wpłata) i KW (Wypłata).
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Balance Card */}
                <div className="lg:col-span-1 bg-[#0A0A0C] text-white p-8 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden border border-white/10">
                    <div className="relative z-10">
                        <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Saldo w Kasie</p>
                        <h3 className="text-5xl font-bold font-mono tracking-tight">{safeFormatCurrency(balance)}</h3>
                        <div className="mt-8 flex gap-3">
                            <button onClick={() => handleAddDoc('KP')} className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-green-900/20 border border-green-500/20">
                                + KP (Wpłata)
                            </button>
                            <button onClick={() => handleAddDoc('KW')} className="flex-1 bg-rose-600 hover:bg-red-500 text-white py-2 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-red-900/20 border border-red-500/20">
                                - KW (Wypłata)
                            </button>
                        </div>
                    </div>
                    <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                </div>

                {/* Operations List */}
                <div className="lg:col-span-2 neo-card rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-white/10 bg-slate-900/30 flex justify-between items-center">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <FileText size={16} className="text-zinc-400" /> Ostatnie Operacje
                        </h3>
                        <span className="text-xs text-zinc-500 font-mono">RK/10/2023</span>
                    </div>
                    <table className="w-full text-sm text-left text-zinc-300">
                        <thead className="bg-white/5 text-zinc-500 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-3 font-medium">Data / Numer</th>
                                <th className="px-6 py-3 font-medium">Kontrahent / Opis</th>
                                <th className="px-6 py-3 font-medium text-right">Przychód</th>
                                <th className="px-6 py-3 font-medium text-right">Rozchód</th>
                                <th className="px-6 py-3 font-medium text-right">Saldo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {docs.map(doc => (
                                <tr key={doc.id} className="hover:bg-white/5 font-mono text-xs">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-white">{doc.number}</div>
                                        <div className="text-zinc-500">{doc.date}</div>
                                    </td>
                                    <td className="px-6 py-4 font-sans">
                                        <div className="font-bold text-zinc-200 text-sm">{doc.contractor}</div>
                                        <div className="text-zinc-500">{doc.description}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {doc.type === 'KP' ? <span className="text-green-400 font-bold">+{safeFormatCurrency(doc.amount)}</span> : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {doc.type === 'KW' ? <span className="text-rose-400 font-bold">-{safeFormatCurrency(doc.amount)}</span> : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-zinc-300">
                                        {safeFormatCurrency(doc.balanceAfter)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
