
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { RealEstateProperty } from '../types';
import { Home, TrendingUp, DollarSign, MapPin, CheckCircle2, AlertCircle, Plus, FileText, Building } from 'lucide-react';
import { toast } from './ui/Toast';

export const RealEstate: React.FC = () => {
    const [properties, setProperties] = useState<RealEstateProperty[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchRealEstate();
            setProperties(data);
            setLoading(false);
        };
        load();
    }, []);

    const formatCurrency = (val: number) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(val);

    const totalValue = properties.reduce((acc, p) => acc + p.currentValue, 0);
    const totalIncome = properties.reduce((acc, p) => acc + p.rentalIncomeMonthly, 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Home className="text-indigo-600" /> Nieruchomości
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Zarządzanie najmem, rozliczenia ryczałtu i analiza rentowności.
                    </p>
                </div>
                <button 
                    onClick={() => toast.info('Demo', 'Dodawanie nieruchomości dostępne w pełnej wersji.')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-sm"
                >
                    <Plus size={18} /> Dodaj Nieruchomość
                </button>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase">Wartość Portfela</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-2">{formatCurrency(totalValue)}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase">Miesięczny Przychód</p>
                    <h3 className="text-3xl font-bold text-green-600 mt-2">{formatCurrency(totalIncome)}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase">Est. Podatek (Ryczałt 8.5%)</p>
                    <h3 className="text-3xl font-bold text-indigo-600 mt-2">{formatCurrency(totalIncome * 0.085)}</h3>
                </div>
            </div>

            {/* Property List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {loading ? [1,2].map(i => <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />) : 
                    properties.map(prop => (
                        <div key={prop.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="h-40 bg-slate-200 relative">
                                {/* Placeholder for Image */}
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                    <Building size={48} />
                                </div>
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border bg-white ${prop.occupancyStatus === 'RENTED' ? 'text-green-600 border-green-200' : 'text-red-600 border-red-200'}`}>
                                        {prop.occupancyStatus === 'RENTED' ? 'Wynajęte' : 'Pustostan'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">{prop.name}</h3>
                                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                            <MapPin size={14} /> {prop.address}
                                        </p>
                                    </div>
                                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold uppercase">{prop.type}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-500 uppercase font-bold">Czynsz</p>
                                        <p className="font-mono font-bold text-slate-900">{formatCurrency(prop.rentalIncomeMonthly)}</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-500 uppercase font-bold">ROI</p>
                                        <p className="font-mono font-bold text-green-600">{prop.roi}%</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 border-t border-slate-100 pt-4">
                                    <button className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 flex items-center justify-center gap-2">
                                        <FileText size={14} /> Umowa
                                    </button>
                                    <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 flex items-center justify-center gap-2">
                                        Szczegóły
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};
