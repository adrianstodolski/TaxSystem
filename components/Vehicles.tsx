
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { Vehicle } from '../types';
import { Car, Truck, Fuel, Calendar, MapPin, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from './ui/Toast';
import { Modal } from './ui/Modal';

export const Vehicles: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchVehicles();
            setVehicles(data);
            setLoading(false);
        };
        load();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Car className="text-indigo-600" /> Flota Samochodowa
                    </h2>
                    <p className="text-slate-500 mt-1">Ewidencja pojazdów, odliczenia VAT (50%/100%) i kilometrówka.</p>
                </div>
                <button 
                    onClick={() => toast.success('Dodano pojazd', 'Kreator pojazdu dostępny w pełnej wersji.')}
                    className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-800 flex items-center gap-2 shadow-sm"
                >
                    <Plus size={18} /> Dodaj Pojazd
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? [1,2].map(i => <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />) : 
                    vehicles.map(v => (
                        <div key={v.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                                        {v.type === 'TRUCK' ? <Truck size={24} /> : <Car size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">{v.name}</h3>
                                        <p className="text-sm font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded inline-block mt-1">{v.licensePlate}</p>
                                    </div>
                                </div>
                                <div className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${v.vatDeduction === 'FULL_100' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                    VAT {v.vatDeduction === 'FULL_100' ? '100%' : '50%'}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 flex items-center gap-2"><Fuel size={16} /> Przebieg</span>
                                    <span className="font-bold font-mono">{v.mileageCurrent.toLocaleString()} km</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 flex items-center gap-2"><CheckCircle2 size={16} /> Przegląd</span>
                                    <span className="font-mono">{v.inspectionExpiry}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 flex items-center gap-2"><AlertCircle size={16} /> OC/AC</span>
                                    <span className="font-mono">{v.insuranceExpiry}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-100 flex gap-2">
                                <button className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 flex items-center justify-center gap-2">
                                    <MapPin size={14} /> Ewidencja Przebiegu
                                </button>
                                <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 flex items-center justify-center gap-2">
                                    <Plus size={14} /> Dodaj Trasę (GPS)
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};
