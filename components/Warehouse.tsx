
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { Product, WarehouseDocument } from '../types';
import { Package, TrendingUp, AlertTriangle, FileText, Clipboard, Plus, Search, ArrowRight, BarChart3, Truck } from 'lucide-react';
import { toast } from './ui/Toast';

export const Warehouse: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [docs, setDocs] = useState<WarehouseDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'STOCK' | 'DOCS'>('STOCK');

    useEffect(() => {
        const load = async () => {
            const [p, d] = await Promise.all([
                NuffiService.fetchInventory(),
                NuffiService.fetchWarehouseDocuments()
            ]);
            setProducts(p);
            setDocs(d);
            setLoading(false);
        };
        load();
    }, []);

    const formatCurrency = (val: number) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(val);

    const totalValue = products.reduce((acc, p) => acc + (p.quantity * p.priceNet), 0);
    const lowStockCount = products.filter(p => p.quantity <= p.minLevel).length;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Package className="text-indigo-600" /> Magazyn (WMS)
                    </h2>
                    <p className="text-slate-500 mt-1">Stany magazynowe, dokumenty PZ/WZ i inwentaryzacja.</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setActiveTab('STOCK')}
                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'STOCK' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Produkty
                    </button>
                    <button 
                        onClick={() => setActiveTab('DOCS')}
                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'DOCS' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Dokumenty
                    </button>
                </div>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-2 text-slate-500">
                        <TrendingUp size={18} />
                        <span className="text-xs font-bold uppercase">Wartość Magazynu</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900">{formatCurrency(totalValue)}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-2 text-slate-500">
                        <Clipboard size={18} />
                        <span className="text-xs font-bold uppercase">Indeksy (SKU)</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900">{products.length}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2 text-slate-500">
                            <AlertTriangle size={18} className={lowStockCount > 0 ? "text-amber-500" : ""} />
                            <span className="text-xs font-bold uppercase">Niskie Stany</span>
                        </div>
                        <h3 className={`text-3xl font-bold ${lowStockCount > 0 ? 'text-amber-600' : 'text-green-600'}`}>{lowStockCount}</h3>
                    </div>
                    {lowStockCount > 0 && <div className="absolute right-0 top-0 w-24 h-24 bg-amber-100 rounded-full blur-2xl -mr-8 -mt-8"></div>}
                </div>
            </div>

            {activeTab === 'STOCK' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input type="text" placeholder="Szukaj SKU, nazwy..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <button 
                            onClick={() => toast.success('Dodano produkt', 'Kreator produktu dostępny w pełnej wersji.')}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 flex items-center gap-2"
                        >
                            <Plus size={14} /> Nowy Produkt
                        </button>
                    </div>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 font-medium">SKU / Nazwa</th>
                                <th className="px-6 py-3 font-medium">Stan</th>
                                <th className="px-6 py-3 font-medium text-right">Cena Zakupu</th>
                                <th className="px-6 py-3 font-medium text-right">Wartość</th>
                                <th className="px-6 py-3 font-medium text-center">AI Prognoza</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products.map(p => {
                                const stockPercent = Math.min(100, (p.quantity / (p.minLevel * 3)) * 100);
                                const isLow = p.quantity <= p.minLevel;
                                return (
                                    <tr key={p.id} className="hover:bg-slate-50 group">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900">{p.name}</p>
                                            <p className="text-xs text-slate-500 font-mono">{p.sku}</p>
                                        </td>
                                        <td className="px-6 py-4 w-64">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className={`font-bold ${isLow ? 'text-amber-600' : 'text-slate-700'}`}>{p.quantity} {p.unit}</span>
                                                <span className="text-slate-400">Min: {p.minLevel}</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${isLow ? 'bg-amber-500' : 'bg-green-500'}`} style={{width: `${stockPercent}%`}}></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-slate-600">{formatCurrency(p.priceNet)}</td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-900">{formatCurrency(p.quantity * p.priceNet)}</td>
                                        <td className="px-6 py-4 text-center">
                                            {isLow && (
                                                <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 px-2 py-1 rounded text-[10px] font-bold border border-rose-100">
                                                    <BarChart3 size={10} /> Koniec za 14 dni
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'DOCS' && (
                <div className="space-y-6 animate-in fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <button className="bg-white border border-slate-200 p-4 rounded-xl hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 font-bold text-sm text-slate-600 shadow-sm">
                            <Plus size={16} /> PZ (Przyjęcie)
                        </button>
                        <button className="bg-white border border-slate-200 p-4 rounded-xl hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 font-bold text-sm text-slate-600 shadow-sm">
                            <Truck size={16} /> WZ (Wydanie)
                        </button>
                        <button className="bg-white border border-slate-200 p-4 rounded-xl hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 font-bold text-sm text-slate-600 shadow-sm">
                            <ArrowRight size={16} /> MM (Przesunięcie)
                        </button>
                        <button className="bg-white border border-slate-200 p-4 rounded-xl hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 font-bold text-sm text-slate-600 shadow-sm">
                            <FileText size={16} /> Inwentaryzacja
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Numer</th>
                                    <th className="px-6 py-3 font-medium">Data</th>
                                    <th className="px-6 py-3 font-medium">Typ</th>
                                    <th className="px-6 py-3 font-medium">Kontrahent</th>
                                    <th className="px-6 py-3 font-medium text-right">Wartość</th>
                                    <th className="px-6 py-3 font-medium text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {docs.map(doc => (
                                    <tr key={doc.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 font-bold text-slate-900 font-mono">{doc.number}</td>
                                        <td className="px-6 py-4 text-slate-500">{doc.date}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                                                doc.type === 'PZ' ? 'bg-green-50 text-green-700 border-green-200' :
                                                doc.type === 'WZ' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                'bg-gray-50 text-gray-700 border-gray-200'
                                            }`}>
                                                {doc.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{doc.contractorName}</td>
                                        <td className="px-6 py-4 text-right font-mono">{formatCurrency(doc.totalValueNet)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-xs font-bold text-green-600">ZATWIERDZONY</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
