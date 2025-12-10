
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { Loan } from '../types';
import { Landmark, Calendar, Percent, CreditCard, TrendingDown, Info, Shield } from 'lucide-react';

export const Loans: React.FC = () => {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchLoans();
            setLoans(data);
            setLoading(false);
        };
        load();
    }, []);

    const formatCurrency = (val: number, curr = 'PLN') => {
        try {
            return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: curr, maximumFractionDigits: 0 }).format(val);
        } catch (e) {
            return `${val.toLocaleString('pl-PL', { maximumFractionDigits: 0 })} ${curr}`;
        }
    };

    const totalDebt = loans.reduce((acc, l) => acc + l.remainingAmount, 0);
    const monthlyInstallments = loans.reduce((acc, l) => acc + l.nextInstallmentAmount, 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Landmark className="text-indigo-600" /> Kredyty i Leasingi
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Zarządzanie zobowiązaniami i optymalizacja tarczy odsetkowej.
                    </p>
                </div>
            </header>

            {/* Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-slate-400 text-xs font-bold uppercase">Pozostało do spłaty</p>
                        <h3 className="text-3xl font-bold mt-2">{formatCurrency(totalDebt)}</h3>
                    </div>
                    <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-slate-500 text-xs font-bold uppercase">Suma Rat (Msc)</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-2">{formatCurrency(monthlyInstallments)}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-slate-500 text-xs font-bold uppercase">Tarcza Odsetkowa (Est.)</p>
                    <h3 className="text-3xl font-bold text-green-600 mt-2">{formatCurrency(monthlyInstallments * 0.3)}</h3>
                    <p className="text-xs text-slate-400 mt-1">Część odsetkowa w KUP</p>
                </div>
            </div>

            {/* Loans List */}
            <div className="space-y-4">
                {loading ? [1,2].map(i => <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />) : 
                    loans.map(loan => {
                        const progress = ((loan.totalAmount - loan.remainingAmount) / loan.totalAmount) * 100;
                        return (
                            <div key={loan.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-bold text-lg text-slate-900">{loan.name}</h4>
                                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold uppercase border border-slate-200">
                                            {loan.type}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-1">{loan.bank}</p>
                                    <div className="flex gap-4 text-xs font-mono text-slate-600">
                                        <span className="flex items-center gap-1"><Percent size={12} /> {loan.interestRate}%</span>
                                        <span className="flex items-center gap-1"><Calendar size={12} /> Koniec: {loan.endDate}</span>
                                    </div>
                                </div>

                                <div className="w-full md:w-64">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-500">Spłacono</span>
                                        <span className="font-bold text-indigo-600">{progress.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-2">
                                        <div className="bg-indigo-600 h-full rounded-full" style={{width: `${progress}%`}}></div>
                                    </div>
                                    <div className="flex justify-between text-xs font-mono">
                                        <span>{formatCurrency(loan.totalAmount - loan.remainingAmount)}</span>
                                        <span>{formatCurrency(loan.totalAmount)}</span>
                                    </div>
                                </div>

                                <div className="text-right pl-6 border-l border-slate-100">
                                    <p className="text-xs text-slate-500 uppercase font-bold">Następna Rata</p>
                                    <p className="text-xl font-bold text-slate-900 font-mono">{formatCurrency(loan.nextInstallmentAmount)}</p>
                                    <p className="text-xs text-slate-400 mt-1">{loan.nextInstallmentDate}</p>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};
