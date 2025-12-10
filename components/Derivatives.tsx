
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { DerivativePosition } from '../types';
import { TrendingUp, AlertTriangle, Plus, Activity, ArrowUpRight, ArrowDownRight, Layers, BarChart2 } from 'lucide-react';
import { toast } from './ui/Toast';
import { safeFormatCurrency } from '../utils/formatters';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

export const Derivatives: React.FC = () => {
    const [positions, setPositions] = useState<DerivativePosition[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPos, setSelectedPos] = useState<DerivativePosition | null>(null);

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchDerivatives();
            setPositions(data);
            if(data.length > 0) setSelectedPos(data[0]);
            setLoading(false);
        };
        load();
    }, []);

    // Generate Payoff Data for visualization
    const getPayoffData = (pos: DerivativePosition) => {
        const data = [];
        const range = pos.underlyingPrice * 0.4;
        const start = pos.underlyingPrice - range;
        const end = pos.underlyingPrice + range;
        const steps = 20;
        
        for(let i = 0; i <= steps; i++) {
            const price = start + (i * (range*2) / steps);
            let profit = 0;
            
            // Simplified Payoff Logic (Long Call / Long Put)
            if(pos.type === 'CALL') {
                profit = (Math.max(0, price - pos.strike) - pos.avgPrice) * pos.quantity * 100;
            } else if (pos.type === 'PUT') {
                profit = (Math.max(0, pos.strike - price) - pos.avgPrice) * pos.quantity * 100;
            }
            
            data.push({ price, profit });
        }
        return data;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Layers className="text-indigo-600" /> Instrumenty Pochodne (Derivatives)
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Zarządzanie portfelem opcji i kontraktów futures. Analiza ryzyka (Greeks).
                    </p>
                </div>
                <div className="flex gap-2">
                    <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded flex items-center gap-2">
                        <Activity size={14} className="text-green-500 animate-pulse" /> Market Data (Delayed 15m)
                    </span>
                    <button 
                        onClick={() => toast.info('Broker', 'Łączenie z Interactive Brokers...')}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-sm text-sm"
                    >
                        <Plus size={16} /> Nowa Pozycja
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Payoff Chart */}
                <div className="lg:col-span-2 bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                    <div className="relative z-10 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold flex items-center gap-2">
                                <BarChart2 className="text-indigo-400" /> Profil Zysku/Straty (Payoff)
                            </h3>
                            {selectedPos && <span className="text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700 font-mono">{selectedPos.symbol} {selectedPos.type} {selectedPos.strike}</span>}
                        </div>
                        
                        <div className="flex-1 min-h-[300px]">
                            {selectedPos && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={getPayoffData(selectedPos)}>
                                        <defs>
                                            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                        <XAxis dataKey="price" stroke="#94a3b8" fontSize={10} tickFormatter={(val) => val.toFixed(0)} />
                                        <YAxis stroke="#94a3b8" fontSize={10} />
                                        <Tooltip 
                                            contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px'}}
                                            formatter={(val: number) => safeFormatCurrency(val, 'USD')}
                                            labelFormatter={(val: number) => `Cena: ${val.toFixed(2)}`}
                                        />
                                        <ReferenceLine y={0} stroke="#94a3b8" />
                                        <ReferenceLine x={selectedPos.underlyingPrice} stroke="#F59E0B" strokeDasharray="3 3" label={{ position: 'top', value: 'Current', fill: '#F59E0B', fontSize: 10 }} />
                                        <Area type="monotone" dataKey="profit" stroke="#4F46E5" strokeWidth={2} fill="url(#colorProfit)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>

                {/* Greeks Dashboard */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-4">Współczynniki Ryzyka (Greeks)</h3>
                        {selectedPos ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-xs text-slate-500 uppercase font-bold">Delta</p>
                                    <p className="text-lg font-bold font-mono text-slate-900">{selectedPos.greeks.delta}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-xs text-slate-500 uppercase font-bold">Gamma</p>
                                    <p className="text-lg font-bold font-mono text-slate-900">{selectedPos.greeks.gamma}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-xs text-slate-500 uppercase font-bold">Theta</p>
                                    <p className="text-lg font-bold font-mono text-red-600">{selectedPos.greeks.theta}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-xs text-slate-500 uppercase font-bold">Vega</p>
                                    <p className="text-lg font-bold font-mono text-slate-900">{selectedPos.greeks.vega}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400">Wybierz pozycję, aby zobaczyć greki.</p>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-2">Ekspozycja Nominalna</h3>
                        <p className="text-3xl font-bold text-slate-900 font-mono">
                            {selectedPos ? safeFormatCurrency(selectedPos.quantity * 100 * selectedPos.underlyingPrice, 'USD') : '...'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Positions Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-900">Otwarte Pozycje</h3>
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 font-medium">Instrument</th>
                            <th className="px-6 py-3 font-medium">Typ</th>
                            <th className="px-6 py-3 font-medium text-right">Ilość</th>
                            <th className="px-6 py-3 font-medium text-right">Strike</th>
                            <th className="px-6 py-3 font-medium text-right">Cena</th>
                            <th className="px-6 py-3 font-medium text-right">Wygasa</th>
                            <th className="px-6 py-3 font-medium text-right">PnL</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {positions.map(pos => (
                            <tr 
                                key={pos.id} 
                                onClick={() => setSelectedPos(pos)}
                                className={`cursor-pointer transition-colors ${selectedPos?.id === pos.id ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
                            >
                                <td className="px-6 py-4 font-bold text-slate-900">{pos.symbol}</td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${pos.type === 'CALL' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {pos.side} {pos.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-mono">{pos.quantity}</td>
                                <td className="px-6 py-4 text-right font-mono">{pos.strike}</td>
                                <td className="px-6 py-4 text-right font-mono">{pos.currentPrice}</td>
                                <td className="px-6 py-4 text-right text-slate-500">{pos.expiration}</td>
                                <td className={`px-6 py-4 text-right font-bold ${pos.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {pos.pnl > 0 ? '+' : ''}{safeFormatCurrency(pos.pnl, 'USD')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
