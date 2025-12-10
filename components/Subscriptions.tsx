
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { Subscription } from '../types';
import { Repeat, AlertTriangle, CheckCircle2, TrendingUp, XCircle, Zap, Search, Calendar } from 'lucide-react';
import { toast } from './ui/Toast';
import { safeFormatCurrency } from '../utils/formatters';

export const Subscriptions: React.FC = () => {
    const [subs, setSubs] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchSubscriptions();
            setSubs(data);
            setLoading(false);
        };
        load();
    }, []);

    const ghostCount = subs.filter(s => s.status === 'GHOST').length;
    const totalBurn = subs.reduce((acc, s) => {
        const costPln = s.currency === 'PLN' ? s.cost : s.cost * 4.2; // approx rate
        return acc + costPln;
    }, 0);

    const handleAction = (sub: Subscription) => {
        toast.info('Zarządzanie', `Otwieranie panelu zarządzania dla ${sub.name}...`);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Repeat className="text-indigo-600" /> Menedżer Subskrypcji
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Kontrola kosztów SaaS i wykrywanie nieużywanych usług ("Ghost Subs").
                    </p>
                </div>
            </header>

            {/* Ghost Alert */}
            {ghostCount > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm relative overflow-hidden">
                    <div className="bg-rose-100 p-3 rounded-full text-rose-600 z-10">
                        <Zap size={24} />
                    </div>
                    <div className="z-10">
                        <h3 className="text-lg font-bold text-rose-800">Wykryto {ghostCount} "duchów"</h3>
                        <p className="text-rose-700 text-sm mt-1">
                            Płacisz za usługi, z których rzadko korzystasz. Możesz zaoszczędzić ok. {safeFormatCurrency(subs.filter(s => s.status === 'GHOST').reduce((acc, s) => acc + (s.currency === 'PLN' ? s.cost : s.cost * 4.2), 0))} miesięcznie.
                        </p>
                    </div>
                    {/* Ghost Icon Background */}
                    <div className="absolute right-[-20px] top-[-20px] text-rose-100 opacity-50">
                        <AlertTriangle size={150} />
                    </div>
                </div>
            )}

            {/* Burn Rate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
                    <p className="text-slate-400 text-xs font-bold uppercase mb-2">Miesięczny Burn Rate (SaaS)</p>
                    <h3 className="text-4xl font-bold font-mono">{safeFormatCurrency(totalBurn)}</h3>
                    <p className="text-xs text-slate-500 mt-2">Suma kosztów stałych</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-500 font-bold">Efektywność Wydatków</span>
                        <span className="text-xl font-bold text-slate-900">82%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{width: '82%'}}></div>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Aktywne Usługi</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input type="text" placeholder="Szukaj..." className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-indigo-500" />
                    </div>
                </div>
                <div className="divide-y divide-slate-100">
                    {subs.map(sub => (
                        <div key={sub.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-sm ${sub.name.includes('Adobe') ? 'bg-red-600' : sub.name.includes('LinkedIn') ? 'bg-blue-600' : sub.name.includes('AWS') ? 'bg-orange-500' : 'bg-slate-800'}`}>
                                    {sub.logo}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-slate-900">{sub.name}</h4>
                                        {sub.status === 'GHOST' && <span className="bg-rose-100 text-rose-600 text-[10px] px-2 py-0.5 rounded font-bold uppercase border border-rose-200">Ghost 👻</span>}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                        <Calendar size={10} /> Next: {sub.nextPayment} • {sub.billingCycle}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <p className="font-bold text-slate-900 font-mono">{safeFormatCurrency(sub.cost, sub.currency)}</p>
                                    <div className="flex items-center gap-1 justify-end mt-1">
                                        <span className="text-[10px] text-slate-400 uppercase font-bold">Usage:</span>
                                        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${sub.usageScore < 20 ? 'bg-red-500' : 'bg-green-500'}`} 
                                                style={{width: `${sub.usageScore}%`}}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleAction(sub)}
                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                >
                                    <XCircle size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
