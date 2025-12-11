
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

    const formatCurrency = (val: number, curr = 'PLN') => {
        try {
            return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: curr, maximumFractionDigits: 0 }).format(val);
        } catch (e) {
            return `${val.toLocaleString('pl-PL', { maximumFractionDigits: 0 })} ${curr}`;
        }
    };

    const totalValue = properties.reduce((acc, p) => acc + p.currentValue, 0);
    const totalIncome = properties.reduce((acc, p) => acc + p.rentalIncomeMonthly, 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Home className="text-indigo-400" /> Nieruchomości
                    </h2>
                    <p className="text-slate-400 mt-1">
                        Zarządzanie najmem, rozliczenia ryczałtu i analiza rentowności.
                    </p>
                </div>
                <button 
                    onClick={() => toast.info('Demo', 'Dodawanie nieruchomości dostępne w pełnej wersji.')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-lg shadow-indigo-900/50"
                >
                    <Plus size={18} /> Dodaj Nieruchomość
                </button>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-2xl">
                    <p className="text-xs font-bold text-slate-500 uppercase">Wartość Portfela</p>
                    <h3 className="text-3xl font-bold text-white mt-2">{formatCurrency(totalValue)}</h3>
                </div>
                <div className="glass-card p-6 rounded-2xl">
                    <p className="text-xs font-bold text-slate-500 uppercase">Miesięczny Przychód</p>
                    <h3 className="text-3xl font-bold text-green-400 mt-2">{formatCurrency(totalIncome)}</h3>
                </div>
                <div className="glass-card p-6 rounded-2xl">
                    <p className="text-xs font-bold text-slate-500 uppercase">Est. Podatek (Ryczałt 8.5%)</p>
                    <h3 className="text-3xl font-bold text-indigo-400 mt-2">{formatCurrency(totalIncome * 0.085)}</h3>
                </div>
            </div>

            {/* Property List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {loading ? [1,2].map(i => <div key={i} className="h-64 bg-slate-800/50 rounded-2xl animate-pulse" />) : 
                    properties.map(prop => (
                        <div key={prop.id} className="glass-card rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all">
                            <div className="h-40 bg-slate-900 relative border-b border-white/5">
                                {/* Placeholder for Image */}
                                <div className="absolute inset-0 flex items-center justify-center text-slate-700">
                                    <Building size={48} />
                                </div>
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border backdrop-blur-md ${prop.occupancyStatus === 'RENTED' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                                        {prop.occupancyStatus === 'RENTED' ? 'Wynajęte' : 'Pustostan'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{prop.name}</h3>
                                        <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                                            <MapPin size={14} /> {prop.address}
                                        </p>
                                    </div>
                                    <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded font-bold uppercase border border-slate-700">{prop.type}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5">
                                        <p className="text-xs text-slate-500 uppercase font-bold">Czynsz</p>
                                        <p className="font-mono font-bold text-white">{formatCurrency(prop.rentalIncomeMonthly)}</p>
                                    </div>
                                    <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5">
                                        <p className="text-xs text-slate-500 uppercase font-bold">ROI</p>
                                        <p className="font-mono font-bold text-green-400">{prop.roi}%</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 border-t border-white/10 pt-4">
                                    <button className="flex-1 bg-white/5 border border-white/10 text-slate-300 py-2 rounded-lg text-xs font-bold hover:bg-white/10 flex items-center justify-center gap-2">
                                        <FileText size={14} /> Umowa
                                    </button>
                                    <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20">
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
