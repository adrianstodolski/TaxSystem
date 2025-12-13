
import React, { useEffect, useState, useMemo } from 'react';
import { NuffiService } from '../services/api';
import { BondPosition } from '../types';
import { ScrollText, TrendingUp, ShieldCheck, Plus, BarChart3, Lock, RefreshCw, Calendar, ArrowUpRight } from 'lucide-react';
import { safeFormatCurrency } from '../utils/formatters';
import { toast } from './ui/Toast';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, Cell } from 'recharts';
import { DataTable } from './ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';

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
    const inflationIndexedValue = bonds.filter(b => b.inflationIndexed).reduce((acc, b) => acc + b.currentValue, 0);
    const inflationShieldPercent = (inflationIndexedValue / totalValue) * 100;

    // Generate Cashflow Ladder Data (Mocked forecast based on bonds)
    const couponLadder = useMemo(() => {
        const months = ['Lis', 'Gru', 'Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź'];
        return months.map((m, i) => ({
            month: m,
            amount: Math.random() > 0.3 ? Math.floor(Math.random() * 1500) : 0, // Random coupon drops
            type: Math.random() > 0.5 ? 'COI' : 'EDO'
        }));
    }, [bonds]);

    const columns = useMemo<ColumnDef<BondPosition>[]>(() => [
        {
            accessorKey: 'name',
            header: 'Emisja / Seria',
            cell: info => (
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${info.row.original.type === 'TREASURY' ? 'bg-red-900/20 text-red-400 border-red-500/30' : 'bg-blue-900/20 text-blue-400 border-blue-500/30'}`}>
                        {info.row.original.type === 'TREASURY' ? <ShieldCheck size={16} /> : <ScrollText size={16} />}
                    </div>
                    <div>
                        <p className="font-bold text-white text-sm">{info.getValue() as string}</p>
                        <p className="text-[10px] text-zinc-500 font-mono tracking-wide">{info.row.original.isin}</p>
                    </div>
                </div>
            )
        },
        { 
            accessorKey: 'yieldToMaturity', 
            header: 'YTM (Rentowność)', 
            cell: info => (
                <span className="font-mono text-emerald-400 font-bold">
                    {(info.getValue() as number).toFixed(2)}%
                </span>
            )
        },
        { 
            accessorKey: 'faceValue', 
            header: 'Nominał', 
            cell: info => <span className="font-mono text-zinc-400">{safeFormatCurrency(info.getValue() as number)}</span> 
        },
        { 
            accessorKey: 'quantity', 
            header: 'Sztuk', 
            cell: info => <span className="font-mono text-white bg-white/5 px-2 py-1 rounded border border-white/5">{info.getValue() as number}</span> 
        },
        { 
            accessorKey: 'nextCouponDate', 
            header: 'Następny Kupon', 
            cell: info => (
                <div className="text-xs">
                    <div className="text-white font-bold">{info.getValue() as string}</div>
                    <div className="text-indigo-400 font-mono">+{safeFormatCurrency(info.row.original.nextCouponAmount)}</div>
                </div>
            )
        },
        { 
            accessorKey: 'inflationIndexed', 
            header: 'Indeksacja', 
            cell: info => info.getValue() ? <span className="inline-flex items-center gap-1 text-gold font-bold text-[10px] bg-gold/10 px-2 py-1 rounded border border-gold/20"><TrendingUp size={10} /> CPI</span> : <span className="text-zinc-600">-</span> 
        }
    ], []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2"><ScrollText className="text-indigo-400" /> Obligacje (Bonds)</h2>
                    <p className="text-zinc-400 mt-1">Portfel dłużny, obligacje skarbowe (EDO/COI) i korporacyjne (Catalyst).</p>
                </div>
                <button onClick={() => toast.info('Import', 'Pobieranie danych z DM PKO BP...')} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-lg shadow-indigo-900/50 text-sm"><Plus size={16} /> Dodaj Obligacje</button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats & Shield */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#0A0A0C] text-white p-6 rounded-2xl shadow-xl border border-white/10 relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-zinc-400 text-xs font-bold uppercase mb-2">Wartość Nominalna</p>
                            <h3 className="text-4xl font-bold font-mono tracking-tight">{safeFormatCurrency(totalValue)}</h3>
                            <div className="mt-4 flex items-center gap-2 text-sm">
                                <span className="bg-emerald-500/10 px-2 py-1 rounded text-emerald-400 font-bold border border-emerald-500/20 flex items-center gap-1">
                                    <ArrowUpRight size={14} /> YTM: {avgYield.toFixed(2)}%
                                </span>
                                <span className="text-zinc-500 text-xs">Średnia rentowność</span>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-indigo-500/20 transition-all"></div>
                    </div>

                    {/* Inflation Shield Gauge */}
                    <div className="neo-card p-6 rounded-2xl">
                        <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                            <ShieldCheck className="text-gold" size={18} /> Tarcza Inflacyjna
                        </h4>
                        
                        <div className="relative pt-2">
                            <div className="flex justify-between text-xs text-zinc-400 mb-2 font-bold uppercase">
                                <span>Ochrona Kapitału</span>
                                <span className="text-white">{inflationShieldPercent.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-white/5">
                                <div className="bg-gradient-to-r from-gold to-amber-500 h-full rounded-full shadow-[0_0_15px_rgba(212,175,55,0.5)]" style={{width: `${inflationShieldPercent}%`}}></div>
                            </div>
                            <p className="text-xs text-zinc-500 mt-3 leading-relaxed">
                                {inflationShieldPercent > 80 
                                    ? "Twój portfel jest silnie zabezpieczony przed inflacją (EDO/COI)." 
                                    : "Rozważ zwiększenie ekspozycji na obligacje indeksowane CPI."}
                            </p>
                        </div>
                    </div>

                    <div className="neo-card p-4 rounded-xl border-dashed border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-500 transition-colors cursor-pointer gap-2 text-sm font-bold">
                        <RefreshCw size={16} /> Rebalansuj Portfel
                    </div>
                </div>

                {/* Yield Ladder Chart */}
                <div className="lg:col-span-2 neo-card p-8 rounded-2xl flex flex-col relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <BarChart3 className="text-zinc-400" /> Drabina Odsetkowa (12 msc)
                        </h3>
                        <div className="flex gap-2 text-xs font-bold">
                            <span className="flex items-center gap-1 text-zinc-400"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Kupony</span>
                        </div>
                    </div>

                    <div className="flex-1 min-h-[300px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={couponLadder} barSize={32}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="month" fontSize={12} stroke="#64748b" axisLine={false} tickLine={false} />
                                <YAxis fontSize={12} stroke="#64748b" axisLine={false} tickLine={false} tickFormatter={(val) => `${val} PLN`} />
                                <Tooltip 
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                    contentStyle={{backgroundColor: '#0A0A0C', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px'}} 
                                    formatter={(val: number) => safeFormatCurrency(val)} 
                                />
                                <ReferenceLine y={0} stroke="#333" />
                                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                                    {couponLadder.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.amount > 1000 ? '#D4AF37' : '#6366f1'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
                </div>
            </div>

            {/* Bonds Table */}
            <div className="neo-card rounded-2xl p-1 overflow-hidden">
                <DataTable columns={columns} data={bonds} />
            </div>
        </div>
    );
};
