
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { BondPosition } from '../types';
import { ScrollText, TrendingUp, Calendar, DollarSign, Percent, AlertTriangle, ShieldCheck, Plus, BarChart3 } from 'lucide-react';
import { safeFormatCurrency } from '../utils/formatters';
import { toast } from './ui/Toast';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const Bonds: React.FC = () => {
    const [bonds, setBonds] = useState<BondPosition[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchBonds();
            setBonds(data);
            setLoading(false);
        };
        load();
    }, []);

    const totalValue = bonds.reduce((acc, b) => acc + b.currentValue, 0);
    const avgYield = bonds.reduce((acc, b) => acc + b.yieldToMaturity, 0) / (bonds.length || 1);

    const couponData = bonds.map(b => ({
        name: b.name,
        amount: b.nextCouponAmount,
        date: b.nextCouponDate
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <ScrollText className="text-indigo-600" /> Obligacje (Bonds)
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Portfel dłużny, obligacje skarbowe (EDO/COI) i korporacyjne (Catalyst).
                    </p>
                </div>
                <button 
                    onClick={() => toast.info('Import', 'Pobieranie danych z DM PKO BP...')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-sm text-sm"
                >
                    <Plus size={16} /> Dodaj Obligacje
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
                        <p className="text-slate-400 text-xs font-bold uppercase mb-2">Wartość Nominalna</p>
                        <h3 className="text-3xl font-bold font-mono">{safeFormatCurrency(totalValue)}</h3>
                        <div className="mt-4 flex items-center gap-2 text-sm">
                            <span className="bg-white/10 px-2 py-1 rounded text-green-300 font-bold">YTM: {avgYield.toFixed(2)}%</span>
                            <span className="text-slate-400">Średnia rentowność</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <ShieldCheck className="text-green-600" /> Tarcza Inflacyjna
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Inflacja (CPI)</span>
                                <span className="font-bold">8.2%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Oprocentowanie EDO</span>
                                <span className="font-bold text-indigo-600">7.25% + Marża</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                                <div className="bg-green-500 h-full" style={{width: '90%'}}></div>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">Twoje portfolio pokrywa 90% inflacji.</p>
                        </div>
                    </div>
                </div>

                {/* Coupon Ladder */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <BarChart3 className="text-slate-400" /> Drabina Odsetkowa (Cashflow)
                    </h3>
                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={couponData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" fontSize={10} />
                                <YAxis fontSize={10} />
                                <Tooltip formatter={(val: number) => safeFormatCurrency(val)} />
                                <Bar dataKey="amount" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Wypłata Kuponu" barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bonds Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 font-medium">Nazwa / ISIN</th>
                            <th className="px-6 py-3 font-medium">Typ</th>
                            <th className="px-6 py-3 font-medium text-right">Nominał</th>
                            <th className="px-6 py-3 font-medium text-right">Ilość</th>
                            <th className="px-6 py-3 font-medium text-right">Kupon</th>
                            <th className="px-6 py-3 font-medium text-right">Wykup</th>
                            <th className="px-6 py-3 font-medium text-center">Indeksacja</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {bonds.map(bond => (
                            <tr key={bond.id} className="hover:bg-slate-50 group">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-slate-900">{bond.name}</p>
                                    <p className="text-xs text-slate-500 font-mono">{bond.isin}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${bond.type === 'TREASURY' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-purple-50 text-purple-700 border-purple-100'}`}>
                                        {bond.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-slate-600">{safeFormatCurrency(bond.faceValue)}</td>
                                <td className="px-6 py-4 text-right font-mono">{bond.quantity}</td>
                                <td className="px-6 py-4 text-right font-bold text-green-600">{bond.couponRate}%</td>
                                <td className="px-6 py-4 text-right text-slate-500">{bond.maturityDate}</td>
                                <td className="px-6 py-4 text-center">
                                    {bond.inflationIndexed ? (
                                        <span className="inline-flex items-center gap-1 text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-full">
                                            <TrendingUp size={12} /> CPI
                                        </span>
                                    ) : (
                                        <span className="text-xs text-slate-400">-</span>
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
