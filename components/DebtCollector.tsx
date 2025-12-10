
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { DebtCase } from '../types';
import { Gavel, AlertTriangle, Send, Phone, Scale, RefreshCw, CheckCircle2, Clock, Calculator } from 'lucide-react';
import { toast } from './ui/Toast';
import { safeFormatCurrency } from '../utils/formatters';

export const DebtCollector: React.FC = () => {
    const [cases, setCases] = useState<DebtCase[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchDebtCases();
            setCases(data);
            setLoading(false);
        };
        load();
    }, []);

    const handleAction = async (id: string, type: 'EMAIL' | 'SMS' | 'CALL_TO_PAY') => {
        setSending(id);
        await NuffiService.sendDebtReminder(id, type);
        setSending(null);
        toast.success('Akcja wykonana', `Wysłano ${type === 'EMAIL' ? 'przypomnienie email' : type === 'SMS' ? 'SMS' : 'przedsądowe wezwanie'} do dłużnika.`);
        // Refresh local state mock
        setCases(prev => prev.map(c => c.id === id ? {...c, status: type === 'CALL_TO_PAY' ? 'PRE_COURT' : 'REMINDER_SENT', lastActionDate: new Date().toISOString().split('T')[0]} : c));
    };

    const totalDebt = cases.reduce((acc, c) => acc + c.amount, 0);
    const totalInterest = cases.reduce((acc, c) => acc + c.statutoryInterest, 0);

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'NEW': return 'bg-blue-100 text-blue-700';
            case 'REMINDER_SENT': return 'bg-amber-100 text-amber-700';
            case 'PRE_COURT': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Gavel className="text-rose-600" /> Nuffi Debt Collector
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Automatyczna windykacja, wezwania do zapłaty i naliczanie odsetek.
                    </p>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
                    <p className="text-slate-400 text-xs font-bold uppercase mb-2">Zaległe Należności</p>
                    <h3 className="text-4xl font-bold font-mono">{safeFormatCurrency(totalDebt)}</h3>
                    <p className="text-xs text-slate-500 mt-2">{cases.length} aktywnych spraw</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-slate-500 text-xs font-bold uppercase mb-2">Naliczone Odsetki</p>
                    <h3 className="text-3xl font-bold text-amber-600 font-mono">+{safeFormatCurrency(totalInterest)}</h3>
                    <p className="text-xs text-slate-400 mt-2">Ustawowe za opóźnienie</p>
                </div>
                <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl flex flex-col justify-center">
                    <h4 className="font-bold text-rose-800 flex items-center gap-2 mb-2">
                        <AlertTriangle size={18} /> Ryzyko Utraty
                    </h4>
                    <p className="text-sm text-rose-700 leading-relaxed">
                        2 faktury przekroczyły termin 60 dni. Zalecane natychmiastowe wezwanie przedsądowe.
                    </p>
                </div>
            </div>

            {/* Case List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-900">Rejestr Spraw</h3>
                    <button className="text-slate-400 hover:text-slate-600"><RefreshCw size={16} /></button>
                </div>
                <div className="divide-y divide-slate-100">
                    {cases.map(c => (
                        <div key={c.id} className="p-6 hover:bg-slate-50 transition-colors">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-bold text-slate-900 text-lg">{c.debtorName}</h4>
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${getStatusBadge(c.status)}`}>
                                            {c.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="flex gap-4 text-sm text-slate-500">
                                        <span>FV: {c.invoiceNumber}</span>
                                        <span>Termin: {c.dueDate}</span>
                                        <span className="font-bold text-rose-600 flex items-center gap-1">
                                            <Clock size={14} /> {c.daysOverdue} dni po terminie
                                        </span>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-xs text-slate-500 uppercase font-bold">Do zapłaty</p>
                                    <p className="text-2xl font-bold text-slate-900 font-mono">{safeFormatCurrency(c.amount + c.statutoryInterest)}</p>
                                    <p className="text-xs text-amber-600 font-bold mt-1">w tym odsetki: {safeFormatCurrency(c.statutoryInterest)}</p>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-3">
                                {sending === c.id ? (
                                    <span className="text-sm text-slate-500 flex items-center gap-2"><RefreshCw className="animate-spin" size={16} /> Wysyłanie...</span>
                                ) : (
                                    <>
                                        <button onClick={() => handleAction(c.id, 'EMAIL')} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 flex items-center gap-2">
                                            <Send size={14} /> Przypomnienie
                                        </button>
                                        <button onClick={() => handleAction(c.id, 'SMS')} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 flex items-center gap-2">
                                            <Phone size={14} /> SMS
                                        </button>
                                        <button onClick={() => handleAction(c.id, 'CALL_TO_PAY')} className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 flex items-center gap-2 shadow-sm">
                                            <Scale size={14} /> Wezwanie do zapłaty
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
