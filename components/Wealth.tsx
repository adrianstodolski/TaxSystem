
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { StockAsset } from '../types';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieIcon, Activity, Globe, RefreshCw, BarChart2, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from './ui/Toast';

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

    const formatCurrency = (val: number, curr = 'PLN') => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: curr, maximumFractionDigits: 0 }).format(val);

    const totalValue = portfolio.reduce((acc, asset) => acc + asset.valuePln, 0);
    const totalPnL = portfolio.reduce((acc, asset) => acc + asset.pnl, 0);
    const totalPnLPercent = (totalPnL / (totalValue - totalPnL)) * 100;

    const allocationData = [
        { name: 'Akcje (Stocks)', value: portfolio.filter(a => a.type === 'STOCK').reduce((acc, a) => acc + a.valuePln, 0), color: '#4F46E5' },
        { name: 'ETF', value: portfolio.filter(a => a.type === 'ETF').reduce((acc, a) => acc + a.valuePln, 0), color: '#10B981' },
        { name: 'Surowce', value: portfolio.filter(a => a.type === 'COMMODITY').reduce((acc, a) => acc + a.valuePln, 0), color: '#F59E0B' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <TrendingUp className="text-indigo-600" /> Wealth Management
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Globalny portfel inwestycyjny (Akcje, ETF, Surowce).
                    </p>
                </div>
                <div className="flex gap-2">
                    <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded flex items-center gap-2">
                        <Activity size={14} className="text-green-500 animate-pulse" /> Market Open (US/PL)
                    </span>
                    <button 
                        onClick={() => toast.info('Integracja', 'Łączenie z API XTB...')}
                        className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-800 flex items-center gap-2 text-sm"
                    >
                        <Plus size={16} /> Połącz Brokera
                    </button>
                </div>
            </header>

            {/* Portfolio Summary - Dark/Gold Theme */}
            <div className="bg-[#0B1120] text-white p-8 rounded-2xl shadow-2xl relative overflow-hidden">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div>
                        <p className="text-slate-400 font-bold uppercase text-xs tracking-wider mb-2">Wartość Portfela</p>
                        <h3 className="text-5xl font-bold tracking-tight text-white">{formatCurrency(totalValue)}</h3>
                        <div className={`mt-4 flex items-center gap-2 text-sm font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {totalPnL >= 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                            {formatCurrency(totalPnL)} ({totalPnLPercent.toFixed(2)}%)
                        </div>
                    </div>
                    
                    <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                            <div className="flex-1">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-300">Akcje</span>
                                    <span className="font-bold">{((allocationData[0].value / totalValue) * 100).toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-indigo-500 h-full" style={{width: `${(allocationData[0].value / totalValue) * 100}%`}}></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            <div className="flex-1">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-300">ETF</span>
                                    <span className="font-bold">{((allocationData[1].value / totalValue) * 100).toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full" style={{width: `${(allocationData[1].value / totalValue) * 100}%`}}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <div className="h-32 w-32 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={allocationData}
                                        innerRadius={40}
                                        outerRadius={60}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {allocationData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <PieIcon size={24} className="text-slate-500" />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Gold Glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            </div>

            {/* Assets List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-900">Twoje Aktywa</h3>
                    <div className="flex gap-2 text-xs">
                        <button className="px-3 py-1 bg-white border border-slate-200 rounded text-slate-600 font-bold hover:bg-slate-50">USD</button>
                        <button className="px-3 py-1 bg-slate-200 border border-slate-300 rounded text-slate-900 font-bold">PLN</button>
                    </div>
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 font-medium">Symbol</th>
                            <th className="px-6 py-3 font-medium">Nazwa</th>
                            <th className="px-6 py-3 font-medium text-right">Ilość</th>
                            <th className="px-6 py-3 font-medium text-right">Cena (Avg)</th>
                            <th className="px-6 py-3 font-medium text-right">Cena (Aktualna)</th>
                            <th className="px-6 py-3 font-medium text-right">Wartość</th>
                            <th className="px-6 py-3 font-medium text-right">PnL</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {portfolio.map((asset) => (
                            <tr key={asset.symbol} className="hover:bg-slate-50 group">
                                <td className="px-6 py-4 font-bold text-slate-900">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white ${
                                            asset.type === 'STOCK' ? 'bg-indigo-600' :
                                            asset.type === 'ETF' ? 'bg-emerald-600' :
                                            'bg-amber-500'
                                        }`}>
                                            {asset.symbol.substring(0,1)}
                                        </div>
                                        {asset.symbol}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-700">{asset.name}</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase">{asset.type}</div>
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-slate-600">{asset.quantity}</td>
                                <td className="px-6 py-4 text-right font-mono text-slate-500">{asset.avgPrice} {asset.currency}</td>
                                <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">{asset.currentPrice} {asset.currency}</td>
                                <td className="px-6 py-4 text-right font-mono font-bold">{formatCurrency(asset.valuePln)}</td>
                                <td className={`px-6 py-4 text-right font-bold ${asset.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {asset.pnl > 0 ? '+' : ''}{formatCurrency(asset.pnl)}
                                    <br/>
                                    <span className="text-xs font-normal bg-slate-100 px-1 rounded">
                                        {asset.pnlPercent > 0 ? '+' : ''}{asset.pnlPercent}%
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
