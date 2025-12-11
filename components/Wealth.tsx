
import React, { useEffect, useState, useMemo } from 'react';
import { NuffiService } from '../services/api';
import { StockAsset } from '../types';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Activity, Plus, PieChart as PieIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { toast } from './ui/Toast';
import { DataTable } from './ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { motion } from 'framer-motion';

export const Wealth: React.FC = () => {
    const [portfolio, setPortfolio] = useState<StockAsset[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchStockPortfolio();
            setPortfolio(data);
            setLoading(false);
        };
        load();
    }, []);

    const formatCurrency = (val: number, curr = 'PLN') => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: curr }).format(val);

    const columns = useMemo<ColumnDef<StockAsset>[]>(() => [
        {
            accessorKey: 'symbol',
            header: 'Symbol',
            cell: info => (
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white ${
                        info.row.original.type === 'STOCK' ? 'bg-indigo-600' :
                        info.row.original.type === 'ETF' ? 'bg-emerald-600' : 'bg-amber-500'
                    }`}>
                        {info.getValue() as string}
                    </div>
                    <span className="font-bold text-white">{info.getValue() as string}</span>
                </div>
            )
        },
        { accessorKey: 'name', header: 'Nazwa', cell: info => <span className="text-slate-300">{info.getValue() as string}</span> },
        { accessorKey: 'quantity', header: 'Ilość', cell: info => <span className="font-mono text-slate-400">{info.getValue() as number}</span> },
        { accessorKey: 'avgPrice', header: 'Cena Zakupu', cell: info => <span className="font-mono text-slate-500">{info.getValue() as number} {info.row.original.currency}</span> },
        { accessorKey: 'currentPrice', header: 'Kurs', cell: info => <span className="font-mono font-bold text-white">{info.getValue() as number} {info.row.original.currency}</span> },
        { accessorKey: 'valuePln', header: 'Wartość', cell: info => <span className="font-mono font-bold text-white">{formatCurrency(info.getValue() as number)}</span> },
        { 
            accessorKey: 'pnl', 
            header: 'PnL', 
            cell: info => {
                const val = info.getValue() as number;
                return (
                    <span className={`font-bold ${val >= 0 ? 'text-green-400' : 'text-rose-400'}`}>
                        {val > 0 ? '+' : ''}{formatCurrency(val)} ({info.row.original.pnlPercent}%)
                    </span>
                )
            }
        }
    ], []);

    const totalValue = portfolio.reduce((acc, asset) => acc + asset.valuePln, 0);
    const totalPnL = portfolio.reduce((acc, asset) => acc + asset.pnl, 0);
    const totalPnLPercent = (totalPnL / (totalValue - totalPnL)) * 100;

    const allocationData = [
        { name: 'Akcje', value: portfolio.filter(a => a.type === 'STOCK').reduce((acc, a) => acc + a.valuePln, 0), color: '#4F46E5' },
        { name: 'ETF', value: portfolio.filter(a => a.type === 'ETF').reduce((acc, a) => acc + a.valuePln, 0), color: '#10B981' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <TrendingUp className="text-indigo-400" /> Wealth Management
                    </h2>
                    <p className="text-slate-400 mt-1">Globalny portfel inwestycyjny (Akcje, ETF, Surowce).</p>
                </div>
                <div className="flex gap-2">
                    <span className="text-xs font-bold text-slate-400 bg-slate-900 border border-white/10 px-3 py-1.5 rounded flex items-center gap-2">
                        <Activity size={14} className="text-green-500 animate-pulse" /> Market Open
                    </span>
                    <button onClick={() => toast.info('Integracja', 'Łączenie z XTB...')} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-500 flex items-center gap-2 text-sm shadow-lg">
                        <Plus size={16} /> Połącz Brokera
                    </button>
                </div>
            </header>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card-glow text-white p-8 rounded-2xl shadow-2xl relative overflow-hidden">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div>
                        <p className="text-indigo-200 font-bold uppercase text-xs tracking-wider mb-2">Wartość Portfela</p>
                        <h3 className="text-5xl font-bold tracking-tight text-white">{formatCurrency(totalValue)}</h3>
                        <div className={`mt-4 flex items-center gap-2 text-sm font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-rose-400'}`}>
                            {totalPnL >= 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                            {formatCurrency(totalPnL)} ({totalPnLPercent.toFixed(2)}%)
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-center col-span-2">
                        <div className="h-32 w-full max-w-xs relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={allocationData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value" stroke="none">
                                        {allocationData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            </motion.div>

            <div className="glass-card rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4">Twoje Aktywa</h3>
                <DataTable columns={columns} data={portfolio} />
            </div>
        </div>
    );
};
