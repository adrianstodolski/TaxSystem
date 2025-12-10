
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { MarketplaceItem } from '../types';
import { Store, Shield, Briefcase, Zap, Check, ArrowRight, Banknote, UserCheck } from 'lucide-react';
import { toast } from './ui/Toast';

export const Marketplace: React.FC = () => {
    const [items, setItems] = useState<MarketplaceItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchMarketplaceItems();
            setItems(data);
            setLoading(false);
        };
        load();
    }, []);

    const handleActivate = (item: MarketplaceItem) => {
        toast.success('Usługa aktywowana', `Zgłoszenie do ${item.provider} zostało wysłane.`);
    };

    const getIcon = (name: string) => {
        switch(name) {
            case 'Banknote': return <Banknote size={24} />;
            case 'Shield': return <Shield size={24} />;
            case 'UserCheck': return <UserCheck size={24} />;
            default: return <Zap size={24} />;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Store className="text-indigo-600" /> Marketplace Usług
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Rozszerz możliwości swojej firmy dzięki sprawdzonym partnerom Nuffi.
                    </p>
                </div>
            </header>

            {/* Featured Banner */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
                <div className="relative z-10 max-w-xl">
                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4 inline-block">Partner Tygodnia</span>
                    <h3 className="text-3xl font-bold mb-4">Leasing 0% dla IT</h3>
                    <p className="text-indigo-100 mb-6">Specjalna oferta dla programistów i firm technologicznych. Sprzęt Apple i Dell bez kosztów początkowych.</p>
                    <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2">
                        Sprawdź ofertę <ArrowRight size={18} />
                    </button>
                </div>
                <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-10 translate-y-10">
                    <Briefcase size={250} />
                </div>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => (
                    <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative group">
                        {item.recommended && (
                            <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                                POLECANE
                            </div>
                        )}
                        
                        <div className="mb-4">
                            <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                                {getIcon(item.icon)}
                            </div>
                            <h4 className="text-xl font-bold text-slate-900">{item.title}</h4>
                            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mt-1">{item.provider}</p>
                        </div>
                        
                        <p className="text-sm text-slate-500 mb-6 min-h-[40px]">{item.description}</p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <span className="font-bold text-slate-900">{item.price}</span>
                            <button 
                                onClick={() => handleActivate(item)}
                                className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
                            >
                                Aktywuj
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
