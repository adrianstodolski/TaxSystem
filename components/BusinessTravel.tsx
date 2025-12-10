
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { BusinessTrip } from '../types';
import { MapPin, Calendar, DollarSign, CheckCircle2, Clock, Plus, Car, Plane, Hotel } from 'lucide-react';
import { safeFormatCurrency } from '../utils/formatters';
import { toast } from './ui/Toast';

export const BusinessTravel: React.FC = () => {
    const [trips, setTrips] = useState<BusinessTrip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchBusinessTrips();
            setTrips(data);
            setLoading(false);
        };
        load();
    }, []);

    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'SETTLED': return 'bg-green-100 text-green-700 border-green-200';
            case 'APPROVED': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <MapPin className="text-indigo-600" /> Delegacje (Business Travel)
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Rozliczanie podróży służbowych, diet i kilometrówki.
                    </p>
                </div>
                <button 
                    onClick={() => toast.info('Kreator', 'Otwieranie formularza delegacji...')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-sm"
                >
                    <Plus size={18} /> Nowa Delegacja
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map(trip => (
                    <div key={trip.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">{trip.destination}</h3>
                                <p className="text-xs text-slate-500 font-bold uppercase">{trip.purpose}</p>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${getStatusStyle(trip.status)}`}>
                                {trip.status}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600 mb-4 bg-slate-50 p-2 rounded-lg">
                            <Calendar size={14} />
                            <span>{trip.startDate} - {trip.endDate}</span>
                        </div>

                        <div className="space-y-2 mb-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500 flex items-center gap-1"><DollarSign size={12} /> Dieta</span>
                                <span className="font-mono">{safeFormatCurrency(trip.perDiem)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500 flex items-center gap-1"><Car size={12} /> Transport</span>
                                <span className="font-mono">{safeFormatCurrency(trip.transportCost)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500 flex items-center gap-1"><Hotel size={12} /> Nocleg</span>
                                <span className="font-mono">{safeFormatCurrency(trip.accommodationCost)}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase">Razem</span>
                            <span className="text-xl font-bold text-slate-900 font-mono">{safeFormatCurrency(trip.totalCost)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
