
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
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Car className="text-gold" /> Flota Samochodowa
                    </h2>
                    <p className="text-zinc-400 mt-1">Ewidencja pojazdów, odliczenia VAT (50%/100%) i kilometrówka.</p>
                </div>
                <button 
                    onClick={() => toast.success('Dodano pojazd', 'Kreator pojazdu dostępny w pełnej wersji.')}
                    className="bg-gold text-black px-4 py-2 rounded-xl font-bold hover:bg-[#FCD34D] flex items-center gap-2 shadow-[0_0_20px_-5px_rgba(212,175,55,0.4)] transition-all"
                >
                    <Plus size={18} /> Dodaj Pojazd
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? [1,2].map(i => <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" />) : 
                    vehicles.map(v => (
                        <div key={v.id} className="neo-card p-6 rounded-2xl relative overflow-hidden group hover:border-gold/30 transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-indigo-500/10 p-3 rounded-xl text-indigo-400 border border-indigo-500/20">
                                        {v.type === 'TRUCK' ? <Truck size={24} /> : <Car size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{v.name}</h3>
                                        <p className="text-sm font-mono text-zinc-400 bg-black/40 px-2 py-0.5 rounded inline-block mt-1 border border-white/5">{v.licensePlate}</p>
                                    </div>
                                </div>
                                <div className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${v.vatDeduction === 'FULL_100' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                    VAT {v.vatDeduction === 'FULL_100' ? '100%' : '50%'}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-zinc-500 flex items-center gap-2"><Fuel size={16} /> Przebieg</span>
                                    <span className="font-bold font-mono text-white">{v.mileageCurrent.toLocaleString()} km</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-zinc-500 flex items-center gap-2"><CheckCircle2 size={16} /> Przegląd</span>
                                    <span className="font-mono text-zinc-300">{v.inspectionExpiry}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-zinc-500 flex items-center gap-2"><AlertCircle size={16} /> OC/AC</span>
                                    <span className="font-mono text-zinc-300">{v.insuranceExpiry}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/10 flex gap-2">
                                <button className="flex-1 bg-white/5 border border-white/10 text-zinc-300 py-2 rounded-lg text-xs font-bold hover:bg-white/10 flex items-center justify-center gap-2 transition-colors">
                                    <MapPin size={14} /> Ewidencja Przebiegu
                                </button>
                                <button className="flex-1 bg-white/5 border border-white/10 text-zinc-300 hover:text-white py-2 rounded-lg text-xs font-bold hover:bg-white/10 flex items-center justify-center gap-2 transition-colors">
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
