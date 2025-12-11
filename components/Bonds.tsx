
import React, { useEffect, useState, useMemo } from 'react';
import { NuffiService } from '../services/api';
import { BondPosition } from '../types';
import { ScrollText, TrendingUp, ShieldCheck, Plus, BarChart3 } from 'lucide-react';
import { safeFormatCurrency } from '../utils/formatters';
import { toast } from './ui/Toast';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
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

    const couponData = bonds.map(b => ({ name: b.name, amount: b.nextCouponAmount, date: b.nextCouponDate })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const columns = useMemo<ColumnDef<BondPosition>[]>(() => [
        {
            accessorKey: 'name',
            header: 'Nazwa / ISIN',
            cell: info => (
                <div>
                    <p className="font-bold text-white">{info.getValue() as string}</p>
                    <p className="text-xs text-zinc-500 font-mono">{info.row.original.isin}</p>
                </div>
            )
        },
        {
            accessorKey: 'type',
            header: 'Typ',
            cell: info => <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${info.getValue() === 'TREASURY' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'}`}>{info.getValue() as string}</span>
        },
        { accessorKey: 'faceValue', header: 'Nominał', cell: info => <span className="font-mono text-zinc-400">{safeFormatCurrency(info.getValue() as number)}</span> },
        { accessorKey: 'quantity', header: 'Ilość', cell: info => <span className="font-mono text-white">{info.getValue() as number}</span> },
        { accessorKey: 'couponRate', header: 'Kupon', cell: info => <span className="font-bold text-green-400">{info.getValue() as number}%</span> },
        { accessorKey: 'maturityDate', header: 'Wykup', cell: info => <span className="text-zinc-500">{info.getValue() as string}</span> },
        { 
            accessorKey: 'inflationIndexed', 
            header: 'Indeksacja', 
            cell: info => info.getValue() ? <span className="inline-flex items-center gap-1 text-green-400 font-bold text-xs bg-green-500/20 px-2 py-1 rounded-full border border-green-500/30"><TrendingUp size={12} /> CPI</span> : <span className="text-xs text-zinc-500">-</span> 
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
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#0A0A0C] text-white p-6 rounded-2xl shadow-xl border border-white/10">
                        <p className="text-zinc-400 text-xs font-bold uppercase mb-2">Wartość Nominalna</p>
                        <h3 className="text-3xl font-bold font-mono">{safeFormatCurrency(totalValue)}</h3>
                        <div className="mt-4 flex items-center gap-2 text-sm"><span className="bg-green-500/20 px-2 py-1 rounded text-green-400 font-bold border border-green-500/30">YTM: {avgYield.toFixed(2)}%</span><span className="text-zinc-400">Średnia rentowność</span></div>
                    </div>
                    <div className="neo-card p-6 rounded-2xl">
                        <h4 className="font-bold text-white mb-4 flex items-center gap-2"><ShieldCheck className="text-green-400" /> Tarcza Inflacyjna</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm"><span className="text-zinc-400">Inflacja (CPI)</span><span className="font-bold text-white">8.2%</span></div>
                            <div className="flex justify-between text-sm"><span className="text-zinc-400">Oprocentowanie EDO</span><span className="font-bold text-indigo-400">7.25% + Marża</span></div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2 border border-slate-700"><div className="bg-green-500 h-full" style={{width: '90%'}}></div></div>
                            <p className="text-xs text-zinc-500 mt-1">Twoje portfolio pokrywa 90% inflacji.</p>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-2 neo-card p-6 rounded-2xl flex flex-col">
                    <h3 className="font-bold text-white mb-6 flex items-center gap-2"><BarChart3 className="text-zinc-400" /> Drabina Odsetkowa (Cashflow)</h3>
                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={couponData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="date" fontSize={10} stroke="#64748b" />
                                <YAxis fontSize={10} stroke="#64748b" />
                                <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', color: '#fff'}} formatter={(val: number) => safeFormatCurrency(val)} />
                                <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} name="Wypłata Kuponu" barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="neo-card rounded-2xl p-6">
                <DataTable columns={columns} data={bonds} />
            </div>
        </div>
    );
};
