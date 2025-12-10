
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
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <ShoppingBag className="text-indigo-600" /> E-commerce Hub
                    </h2>
                    <p className="text-slate-500 mt-1">Integracje sprzedażowe (Allegro, Shopify) i automatyczna fiskalizacja.</p>
                </div>
                <button 
                    onClick={() => { setLoading(true); toast.info('Sync', 'Pobieranie zamówień...'); setTimeout(() => setLoading(false), 1500); }}
                    className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 flex items-center gap-2 shadow-sm"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Synchronizuj
                </button>
            </header>

            {/* Platform Status */}
            <div className="flex gap-4 mb-6">
                <div className="bg-white px-4 py-2 rounded-lg border border-green-200 text-green-700 text-sm font-bold flex items-center gap-2 shadow-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Allegro (Connected)
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-green-200 text-green-700 text-sm font-bold flex items-center gap-2 shadow-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Shopify (Connected)
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase">Sprzedaż Brutto (GMV)</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-2">{formatCurrency(totalSales)}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase">Prowizje Platform</p>
                    <h3 className="text-3xl font-bold text-rose-600 mt-2">-{formatCurrency(totalFees)}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-slate-500 uppercase">Realny Przychód</p>
                        <h3 className="text-3xl font-bold text-emerald-600 mt-2">{formatCurrency(realMargin)}</h3>
                    </div>
                    <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-100 rounded-full blur-2xl -mr-8 -mt-8"></div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-900">Ostatnie Zamówienia</h3>
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 font-medium">Platforma / ID</th>
                            <th className="px-6 py-3 font-medium">Klient</th>
                            <th className="px-6 py-3 font-medium text-right">Wartość</th>
                            <th className="px-6 py-3 font-medium text-right">Prowizja</th>
                            <th className="px-6 py-3 font-medium text-center">Status</th>
                            <th className="px-6 py-3 font-medium text-center">Fiskalizacja</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {orders.map(order => (
                            <tr key={order.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white uppercase ${order.platformId === 'allegro' ? 'bg-orange-500' : 'bg-green-600'}`}>
                                            {order.platformId.substring(0,1)}
                                        </span>
                                        <span className="font-mono text-slate-600">{order.platformOrderId}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1">{order.date}</p>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-900">{order.customer}</td>
                                <td className="px-6 py-4 text-right font-mono">{formatCurrency(order.totalGross)}</td>
                                <td className="px-6 py-4 text-right font-mono text-rose-600">-{formatCurrency(order.commissionFee)}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${
                                        order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                        order.status === 'PAID' ? 'bg-green-50 text-green-700 border-green-200' : 
                                        'bg-gray-50 text-gray-700 border-gray-200'
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {order.fiscalized ? (
                                        <span className="inline-flex items-center gap-1 text-green-600 text-xs font-bold" title="Wystawiono paragon/fakturę">
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
