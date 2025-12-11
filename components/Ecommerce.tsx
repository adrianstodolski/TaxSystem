
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { Order } from '../types';
import { ShoppingBag, RefreshCw, TrendingUp, DollarSign, Package, CheckCircle2, AlertTriangle, Truck } from 'lucide-react';
import { toast } from './ui/Toast';

export const Ecommerce: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchEcommerceOrders();
            setOrders(data);
            setLoading(false);
        };
        load();
    }, []);

    const formatCurrency = (val: number) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(val);

    const totalSales = orders.reduce((acc, o) => acc + o.totalGross, 0);
    const totalFees = orders.reduce((acc, o) => acc + o.commissionFee, 0);
    const realMargin = totalSales - totalFees; // Simplified (without product cost)

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <ShoppingBag className="text-gold" /> E-commerce Hub
                    </h2>
                    <p className="text-zinc-400 mt-1">Integracje sprzedażowe (Allegro, Shopify) i automatyczna fiskalizacja.</p>
                </div>
                <button 
                    onClick={() => { setLoading(true); toast.info('Sync', 'Pobieranie zamówień...'); setTimeout(() => setLoading(false), 1500); }}
                    className="bg-onyx border border-white/10 text-zinc-300 px-4 py-2 rounded-xl font-bold hover:bg-white/5 hover:text-white flex items-center gap-2 shadow-sm transition-colors"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Synchronizuj
                </button>
            </header>

            {/* Platform Status */}
            <div className="flex gap-4 mb-6">
                <div className="bg-onyx px-4 py-2 rounded-lg border border-green-500/30 text-green-400 text-sm font-bold flex items-center gap-2 shadow-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]"></span> Allegro (Connected)
                </div>
                <div className="bg-onyx px-4 py-2 rounded-lg border border-green-500/30 text-green-400 text-sm font-bold flex items-center gap-2 shadow-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]"></span> Shopify (Connected)
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="neo-card p-6 rounded-2xl">
                    <p className="text-xs font-bold text-zinc-500 uppercase">Sprzedaż Brutto (GMV)</p>
                    <h3 className="text-3xl font-bold text-white mt-2 font-mono">{formatCurrency(totalSales)}</h3>
                </div>
                <div className="neo-card p-6 rounded-2xl">
                    <p className="text-xs font-bold text-zinc-500 uppercase">Prowizje Platform</p>
                    <h3 className="text-3xl font-bold text-rose-400 mt-2 font-mono">-{formatCurrency(totalFees)}</h3>
                </div>
                <div className="neo-card p-6 rounded-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-zinc-500 uppercase">Realny Przychód</p>
                        <h3 className="text-3xl font-bold text-emerald-400 mt-2 font-mono">{formatCurrency(realMargin)}</h3>
                    </div>
                    <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="neo-card rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/10 bg-white/5">
                    <h3 className="font-bold text-white">Ostatnie Zamówienia</h3>
                </div>
                <table className="w-full text-sm text-left text-zinc-300">
                    <thead className="bg-white/5 text-zinc-500 border-b border-white/10">
                        <tr>
                            <th className="px-6 py-3 font-medium">Platforma / ID</th>
                            <th className="px-6 py-3 font-medium">Klient</th>
                            <th className="px-6 py-3 font-medium text-right">Wartość</th>
                            <th className="px-6 py-3 font-medium text-right">Prowizja</th>
                            <th className="px-6 py-3 font-medium text-center">Status</th>
                            <th className="px-6 py-3 font-medium text-center">Fiskalizacja</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {orders.map(order => (
                            <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white uppercase ${order.platformId === 'allegro' ? 'bg-orange-500' : 'bg-green-600'}`}>
                                            {order.platformId.substring(0,1)}
                                        </span>
                                        <span className="font-mono text-zinc-400">{order.platformOrderId}</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 mt-1">{order.date}</p>
                                </td>
                                <td className="px-6 py-4 font-bold text-white">{order.customer}</td>
                                <td className="px-6 py-4 text-right font-mono text-zinc-200">{formatCurrency(order.totalGross)}</td>
                                <td className="px-6 py-4 text-right font-mono text-rose-400">-{formatCurrency(order.commissionFee)}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${
                                        order.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                        order.status === 'PAID' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                        'bg-zinc-800 text-zinc-400 border-zinc-600'
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {order.fiscalized ? (
                                        <span className="inline-flex items-center gap-1 text-green-400 text-xs font-bold" title="Wystawiono paragon/fakturę">
                                            <CheckCircle2 size={14} /> OK
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-amber-500 text-xs font-bold" title="Oczekuje na fiskalizację">
                                            <AlertTriangle size={14} /> Pending
                                        </span>
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
