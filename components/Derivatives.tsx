
import React, { useEffect, useState, useMemo } from 'react';
import { NuffiService } from '../services/api';
import { DerivativePosition } from '../types';
import { Layers, Activity, Plus, TrendingUp, TrendingDown, RefreshCw, Maximize2 } from 'lucide-react';
import { toast } from './ui/Toast';
import { safeFormatCurrency } from '../utils/formatters';
import { DataTable } from './ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

export const Derivatives: React.FC = () => {
    const [positions, setPositions] = useState<DerivativePosition[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const data = await NuffiService.fetchDerivatives();
        setPositions(data);
        setLoading(false);
    };

    // Mini Sparkline Component for Table
    const Sparkline = ({ color }: { color: string }) => {
        const data = Array.from({length: 10}, () => ({ v: Math.random() }));
        return (
            <div className="h-8 w-24">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <Area type="monotone" dataKey="v" stroke={color} fill={color} fillOpacity={0.2} strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        );
    };

    const columns = useMemo<ColumnDef<DerivativePosition>[]>(() => [
        {
            accessorKey: 'symbol',
            header: 'Instrument',
            cell: info => <span className="font-bold text-white text-sm">{info.getValue() as string}</span>
        },
        { 
            accessorKey: 'type', 
            header: 'Side / Type', 
            cell: info => (
                <div className="flex gap-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${info.row.original.side === 'LONG' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                        {info.row.original.side}
                    </span>
                    <span className="text-[10px] bg-slate-800 text-zinc-300 px-1.5 py-0.5 rounded border border-white/10 font-bold uppercase">
                        {info.getValue() as string}
                    </span>
                </div>
            )
        },
        { 
            accessorKey: 'strike', 
            header: 'Strike', 
            cell: info => <span className="font-mono text-zinc-300">{info.getValue() as number}</span> 
        },
        { 
            id: 'chart',
            header: 'Trend (24h)',
            cell: info => <Sparkline color={info.row.original.pnl >= 0 ? '#10b981' : '#f43f5e'} />
        },
        { 
            accessorKey: 'quantity', 
            header: 'Contracts', 
            cell: info => <span className="font-mono text-white">{info.getValue() as number}</span> 
        },
        { 
            accessorKey: 'greeks.delta', 
            header: 'Delta', 
            cell: info => <span className="font-mono text-zinc-400 text-xs">{(info.getValue() as number).toFixed(2)}</span> 
        },
        { 
            accessorKey: 'greeks.theta', 
            header: 'Theta', 
            cell: info => <span className="font-mono text-rose-400 text-xs">{(info.getValue() as number).toFixed(2)}</span> 
        },
        { 
            accessorKey: 'pnl', 
            header: 'Unrealized PnL', 
            cell: info => {
                const val = info.getValue() as number;
                return (
                    <span className={`font-mono font-bold ${val >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {val > 0 ? '+' : ''}{safeFormatCurrency(val, 'USD')}
                    </span>
                )
            }
        }
    ], []);

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col pb-4 animate-in fade-in duration-300">
            {/* Trading Header */}
            <div className="neo-card border-none rounded-none border-b border-white/10 p-4 flex justify-between items-center shrink-0 bg-[#0A0A0C]">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Layers className="text-indigo-500" /> Derivatives Desk
                    </h2>
                    <div className="flex gap-4 mt-1 text-xs font-mono text-zinc-500">
                        <span className="flex items-center gap-1"><Activity size={12} className="text-green-500" /> Market Open</span>
                        <span>IV Rank: 45.2%</span>
                        <span>VIX: 14.50</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => loadData()} className="p-2 bg-white/5 text-zinc-400 hover:text-white rounded border border-white/10 transition-colors">
                        <RefreshCw size={18} />
                    </button>
                    <button onClick={() => toast.info('Broker', 'Connecting to IBKR...')} className="bg-indigo-600 text-white px-4 py-2 rounded font-bold text-sm hover:bg-indigo-500 flex items-center gap-2 shadow-lg shadow-indigo-900/20">
                        <Plus size={16} /> New Order
                    </button>
                </div>
            </div>

            {/* Main Trading Area */}
            <div className="flex-1 grid grid-cols-12 gap-px bg-white/5 overflow-hidden">
                {/* Positions Table (Dominant) */}
                <div className="col-span-9 bg-[#050505] p-4 overflow-y-auto custom-scrollbar">
                    <DataTable columns={columns} data={positions} />
                </div>

                {/* Info Panel / Greeks */}
                <div className="col-span-3 bg-[#0A0A0C] border-l border-white/10 p-4 flex flex-col gap-4">
                    <div className="bg-black/40 p-4 rounded-lg border border-white/10">
                        <h4 className="text-xs font-bold text-zinc-500 uppercase mb-2">Total Exposure</h4>
                        <div className="text-2xl font-bold text-white font-mono">$45,200.00</div>
                        <div className="text-xs text-green-400 flex items-center gap-1 mt-1">
                            <TrendingUp size={12} /> +2.4% Today
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <h4 className="text-xs font-bold text-zinc-500 uppercase mb-3 border-b border-white/10 pb-2">Portfolio Greeks</h4>
                        <div className="space-y-3 font-mono text-sm">
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Net Delta</span>
                                <span className="text-white font-bold">+145.20</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Net Gamma</span>
                                <span className="text-white font-bold">+2.40</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Net Theta</span>
                                <span className="text-rose-400 font-bold">-45.00</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Net Vega</span>
                                <span className="text-white font-bold">+85.10</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
