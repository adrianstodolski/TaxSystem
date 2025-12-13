
import React, { useEffect, useState, useMemo } from 'react';
import { NuffiService } from '../services/api';
import { StockAsset } from '../types';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Activity, Plus, BarChart4, PieChart as PieIcon, RefreshCw, Scale, Target } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { toast } from './ui/Toast';
import { DataTable } from './ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { motion, AnimatePresence } from 'framer-motion';

export const Wealth: React.FC = () => {
    const [portfolio, setPortfolio] = useState<StockAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'PERFORMANCE' | 'ALLOCATION'>('PERFORMANCE');

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchStockPortfolio();
            // Mocking more data for visualization
            const enrichedData = [
                ...data,
                { symbol: 'MSFT', name: 'Microsoft Corp.', type: 'STOCK', quantity: 20, avgPrice: 310, currentPrice: 350, currency: 'USD', valuePln: 28000, pnl: 3200, pnlPercent: 12.9 },
                { symbol: 'VWCE', name: 'Vanguard All-World', type: 'ETF', quantity: 150, avgPrice: 95, currentPrice: 105, currency: 'EUR', valuePln: 68000, pnl: 6500, pnlPercent: 10.5 },
                { symbol: 'XAU', name: 'Gold Spot', type: 'COMMODITY', quantity: 5, avgPrice: 1900, currentPrice: 2050, currency: 'USD', valuePln: 41000, pnl: 3000, pnlPercent: 7.9 },
            ];
            setPortfolio(enrichedData);
            setLoading(false);
        };
        load();
    }, []);

    const formatCurrency = (val: number, curr = 'PLN') => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: curr, maximumFractionDigits: 0 }).format(val);

    // Columns configuration
    const columns = useMemo<ColumnDef<StockAsset>[]>(() => [
        {
            accessorKey: 'symbol',
            header: 'Aktywo',
            cell: info => (
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-bold text-white border shadow-sm ${
                        info.row.original.type === 'STOCK' ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' :
                        info.row.original.type === 'ETF' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                    }`}>
                        {info.getValue() as string}
                    </div>
                    <div>
                        <p className="font-bold text-white">{info.row.original.name}</p>
                        <p className="text-[10px] text-zinc-500 font-mono">{info.getValue() as string} • {info.row.original.currency}</p>
                    </div>
                </div>
            )
        },
        { 
            accessorKey: 'quantity', 
            header: 'Pozycja', 
            cell: info => (
                <div>
                    <p className="text-white font-mono">{info.getValue() as number}</p>
                    <p className="text-[10px] text-zinc-500">@{info.row.original.avgPrice}</p>
                </div>
            ) 
        },
        { 
            accessorKey: 'currentPrice', 
            header: 'Cena Rynkowa', 
            cell: info => <span className="font-mono font-bold text-white">{info.getValue() as number} {info.row.original.currency}</span> 
        },
        { 
            accessorKey: 'valuePln', 
            header: 'Wycena (PLN)', 
            cell: info => <span className="font-mono font-bold text-white">{formatCurrency(info.getValue() as number)}</span> 
        },
        { 
            accessorKey: 'pnl', 
            header: 'Zysk/Strata', 
            cell: info => {
                const val = info.getValue() as number;
                const pct = info.row.original.pnlPercent;
                return (
                    <div className={`flex flex-col items-end ${val >= 0 ? 'text-green-400' : 'text-rose-400'}`}>
                        <span className="font-bold font-mono">{val > 0 ? '+' : ''}{formatCurrency(val)}</span>
                        <span className="text-[10px] font-bold bg-white/5 px-1.5 rounded">{val > 0 ? '+' : ''}{pct}%</span>
                    </div>
                )
            }
        }
    ], []);

    // Totals & Allocation
    const totalValue = portfolio.reduce((acc, asset) => acc + asset.valuePln, 0);
    const totalPnL = portfolio.reduce((acc, asset) => acc + asset.pnl, 0);
    const totalPnLPercent = totalValue > 0 ? (totalPnL / (totalValue - totalPnL)) * 100 : 0;

    const allocationData = [
        { name: 'Akcje USA', value: portfolio.filter(a => a.type === 'STOCK').reduce((acc, a) => acc + a.valuePln, 0), color: '#6366f1' },
        { name: 'Global ETF', value: portfolio.filter(a => a.type === 'ETF').reduce((acc, a) => acc + a.valuePln, 0), color: '#10b981' },
        { name: 'Surowce', value: portfolio.filter(a => a.type === 'COMMODITY').reduce((acc, a) => acc + a.valuePln, 0), color: '#f59e0b' },
    ];

    // Mock Chart Data - Benchmark Comparison
    const performanceData = useMemo(() => {
        const data = [];
        let myVal = 100;
        let sp500Val = 100;
        for(let i = 0; i < 30; i++) {
            myVal = myVal * (1 + (Math.random() * 0.04 - 0.015));
            sp500Val = sp500Val * (1 + (Math.random() * 0.03 - 0.01));
            data.push({
                day: `Day ${i+1}`,
                me: Math.round(myVal),
                benchmark: Math.round(sp500Val)
            });
        }
        return data;
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <TrendingUp className="text-gold" /> Wealth OS
                    </h2>
                    <p className="text-zinc-400 mt-1">Globalny portfel inwestycyjny. Analiza wyników i rebalansowanie.</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setViewMode('PERFORMANCE')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'PERFORMANCE' ? 'bg-white/10 text-white border border-white/20' : 'text-zinc-500 hover:text-white'}`}
                    >
                        <BarChart4 size={16} /> Wyniki
                    </button>
                    <button 
                        onClick={() => setViewMode('ALLOCATION')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'ALLOCATION' ? 'bg-white/10 text-white border border-white/20' : 'text-zinc-500 hover:text-white'}`}
                    >
                        <PieIcon size={16} /> Alokacja
                    </button>
                    <button className="bg-gold text-black px-4 py-2 rounded-xl font-bold hover:bg-[#FCD34D] flex items-center gap-2 text-sm shadow-[0_0_15px_-5px_rgba(212,175,55,0.4)] transition-all ml-2">
                        <Plus size={16} /> Dodaj Aktywo
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Visual */}
                <motion.div 
                    layout
                    className="lg:col-span-2 neo-card text-white p-8 rounded-2xl shadow-2xl relative overflow-hidden bg-gradient-to-br from-[#0A0A0C] to-[#141419] border border-white/10"
                >
                    <div className="relative z-10 h-full flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-zinc-500 font-bold uppercase text-xs tracking-wider mb-2 flex items-center gap-2">
                                    <Scale size={14} /> Wartość Netto Portfela
                                </p>
                                <h3 className="text-5xl font-bold tracking-tight text-white font-mono">{formatCurrency(totalValue)}</h3>
                                <div className={`mt-3 flex items-center gap-2 text-sm font-bold bg-white/5 w-fit px-3 py-1 rounded-lg border border-white/5 ${totalPnL >= 0 ? 'text-green-400' : 'text-rose-400'}`}>
                                    {totalPnL >= 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                                    {formatCurrency(totalPnL)} ({totalPnLPercent.toFixed(2)}%)
                                </div>
                            </div>
                            <div className="text-right hidden sm:block">
                                <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Sharpe Ratio</p>
                                <p className="text-xl font-bold text-white mb-3">1.85</p>
                                <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Beta (SPX)</p>
                                <p className="text-xl font-bold text-white">0.92</p>
                            </div>
                        </div>
                        
                        <div className="flex-1 min-h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                {viewMode === 'PERFORMANCE' ? (
                                    <AreaChart data={performanceData}>
                                        <defs>
                                            <linearGradient id="colorMe" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <Tooltip 
                                            contentStyle={{backgroundColor: '#0A0A0C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff'}}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                        <Area type="monotone" dataKey="me" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorMe)" name="Twój Portfel" />
                                        <Area type="monotone" dataKey="benchmark" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" fill="transparent" name="S&P 500" />
                                    </AreaChart>
                                ) : (
                                    <PieChart>
                                        <Pie 
                                            data={allocationData} 
                                            innerRadius={80} 
                                            outerRadius={110} 
                                            paddingAngle={5} 
                                            dataKey="value" 
                                            stroke="none"
                                        >
                                            {allocationData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                                        </Pie>
                                        <Tooltip 
                                            formatter={(val: number) => formatCurrency(val)}
                                            contentStyle={{backgroundColor: '#0A0A0C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff'}}
                                        />
                                    </PieChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    </div>
                    {/* Deco Glow */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
                </motion.div>

                {/* Right Column: Rebalancing & Alerts */}
                <div className="space-y-6">
                    {/* Rebalancing Tool */}
                    <div className="neo-card p-6 rounded-2xl border-l-4 border-l-indigo-500">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Target size={18} className="text-indigo-400" /> Cel Alokacji
                        </h3>
                        <div className="space-y-4">
                            {allocationData.map(item => {
                                const currentPct = (item.value / totalValue) * 100;
                                const targetPct = item.name === 'Akcje USA' ? 60 : item.name === 'Global ETF' ? 30 : 10; // Mock targets
                                const diff = currentPct - targetPct;
                                
                                return (
                                    <div key={item.name}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-zinc-300">{item.name}</span>
                                            <span className={Math.abs(diff) > 2 ? 'text-amber-400 font-bold' : 'text-green-400'}>
                                                {currentPct.toFixed(1)}% / {targetPct}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full" style={{width: `${currentPct}%`, backgroundColor: item.color}}></div>
                                        </div>
                                        {diff > 2 && (
                                            <div className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">
                                                <RefreshCw size={10} /> Sprzedaj {formatCurrency((diff/100)*totalValue)}
                                            </div>
                                        )}
                                        {diff < -2 && (
                                            <div className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">
                                                <RefreshCw size={10} /> Dokup {formatCurrency((Math.abs(diff)/100)*totalValue)}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                        <button className="w-full mt-6 bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold py-3 rounded-xl border border-white/10 transition-colors">
                            Generuj Plan Rebalansowania
                        </button>
                    </div>

                    {/* Market Status */}
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl">
                        <div className="flex items-center gap-3 mb-2">
                            <Activity className="text-emerald-400 animate-pulse" size={20} />
                            <h4 className="font-bold text-white text-sm">Rynki Otwarte</h4>
                        </div>
                        <p className="text-xs text-emerald-200/70 leading-relaxed">
                            Sesja w USA trwa. Zmienność na VIX w normie (14.2). Brak istotnych danych makro w kalendarzu na dziś.
                        </p>
                    </div>
                </div>
            </div>

            {/* Assets Table */}
            <div className="neo-card rounded-2xl p-1 overflow-hidden">
                <DataTable columns={columns} data={portfolio} />
            </div>
        </div>
    );
};
