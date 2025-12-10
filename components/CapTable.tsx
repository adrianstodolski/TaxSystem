
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { Shareholder } from '../types';
import { PieChart as PieIcon, Users, Plus, TrendingUp, DollarSign, Target, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { safeFormatCurrency } from '../utils/formatters';
import { toast } from './ui/Toast';

export const CapTable: React.FC = () => {
    const [shareholders, setShareholders] = useState<Shareholder[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Simulator
    const [newInvestment, setNewInvestment] = useState(1000000);
    const [preMoneyVal, setPreMoneyVal] = useState(9000000);
    const [simulatedShares, setSimulatedShares] = useState<Shareholder[]>([]);

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchCapTable();
            setShareholders(data);
            setLoading(false);
        };
        load();
    }, []);

    useEffect(() => {
        // Simple Dilution Logic
        if(shareholders.length === 0) return;
        
        const totalSharesOld = shareholders.reduce((acc, s) => acc + s.shares, 0);
        // Price per share based on pre-money
        const pricePerShare = preMoneyVal / totalSharesOld;
        const newSharesCount = newInvestment / pricePerShare;
        const totalSharesNew = totalSharesOld + newSharesCount;

        const updated = shareholders.map(s => ({
            ...s,
            percentage: (s.shares / totalSharesNew) * 100
        }));

        // Add new investor
        updated.push({
            id: 'new_inv',
            name: 'New Investor (Series A)',
            role: 'INVESTOR',
            shares: newSharesCount,
            percentage: (newSharesCount / totalSharesNew) * 100,
            joinedDate: 'Future',
            investedAmount: newInvestment
        });

        setSimulatedShares(updated);

    }, [shareholders, newInvestment, preMoneyVal]);

    const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    const data = simulatedShares.map((s, i) => ({
        name: s.name,
        value: s.percentage,
        color: colors[i % colors.length]
    }));

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <PieIcon className="text-indigo-600" /> Cap Table (Udziałowcy)
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Rejestr udziałowców i symulacja rund inwestycyjnych (Dilution).
                    </p>
                </div>
                <button 
                    onClick={() => toast.success('Dodano', 'Nowy wpis w księdze udziałów.')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-sm"
                >
                    <Plus size={18} /> Dodaj Udziałowca
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List & Simulator */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Simulator Controls */}
                    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Target size={20} className="text-green-400" /> Symulator Inwestycji
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Kwota Inwestycji</label>
                                    <input 
                                        type="range" min="100000" max="5000000" step="100000"
                                        value={newInvestment}
                                        onChange={e => setNewInvestment(parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500 mb-2"
                                    />
                                    <div className="flex justify-between items-center bg-white/10 px-3 py-2 rounded-lg">
                                        <DollarSign size={16} className="text-green-400" />
                                        <span className="font-mono font-bold">{safeFormatCurrency(newInvestment)}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Wycena Pre-Money</label>
                                    <input 
                                        type="range" min="1000000" max="20000000" step="500000"
                                        value={preMoneyVal}
                                        onChange={e => setPreMoneyVal(parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 mb-2"
                                    />
                                    <div className="flex justify-between items-center bg-white/10 px-3 py-2 rounded-lg">
                                        <TrendingUp size={16} className="text-indigo-400" />
                                        <span className="font-mono font-bold">{safeFormatCurrency(preMoneyVal)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-bold text-slate-900">Symulacja Struktury (Post-Money)</h3>
                        </div>
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Udziałowiec</th>
                                    <th className="px-6 py-3 font-medium">Rola</th>
                                    <th className="px-6 py-3 font-medium text-right">Udziały</th>
                                    <th className="px-6 py-3 font-medium text-right">% Własności</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {simulatedShares.map((s, i) => (
                                    <tr key={s.id} className={`${s.id === 'new_inv' ? 'bg-green-50/50' : 'hover:bg-slate-50'}`}>
                                        <td className="px-6 py-4 font-bold text-slate-900">
                                            {s.name}
                                            {s.id === 'new_inv' && <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">NEW</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold uppercase">{s.role}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-slate-600">{Math.round(s.shares).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <span className="font-bold">{s.percentage.toFixed(2)}%</span>
                                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full" style={{width: `${s.percentage}%`, backgroundColor: colors[i % colors.length]}}></div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Chart */}
                <div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-6 text-center">Struktura Własności</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(val: number) => `${val.toFixed(2)}%`} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-6 text-center text-xs text-slate-500">
                            Post-Money Valuation: <strong>{safeFormatCurrency(preMoneyVal + newInvestment)}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
