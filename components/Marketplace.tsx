
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
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Store className="text-[#D4AF37]" /> Marketplace Usług
                    </h2>
                    <p className="text-zinc-400 mt-1">
                        Rozszerz możliwości swojej firmy dzięki sprawdzonym partnerom Nuffi.
                    </p>
                </div>
            </header>

            {/* Featured Banner */}
            <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-indigo-500/20 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl neo-card">
                <div className="relative z-10 max-w-xl">
                    <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4 inline-block border border-white/10">Partner Tygodnia</span>
                    <h3 className="text-3xl font-bold mb-4">Leasing 0% dla IT</h3>
                    <p className="text-indigo-200 mb-6">Specjalna oferta dla programistów i firm technologicznych. Sprzęt Apple i Dell bez kosztów początkowych.</p>
                    <button className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2">
                        Sprawdź ofertę <ArrowRight size={18} />
                    </button>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10 text-indigo-400">
                    <Briefcase size={250} />
                </div>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => (
                    <div key={item.id} className="neo-card p-6 rounded-2xl hover:border-[#D4AF37]/30 transition-all relative group">
                        {item.recommended && (
                            <div className="absolute top-0 right-0 bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-bold px-3 py-1 rounded-bl-xl backdrop-blur-sm">
                                POLECANE
                            </div>
                        )}
                        
                        <div className="mb-4">
                            <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                                {getIcon(item.icon)}
                            </div>
                            <h4 className="text-xl font-bold text-white">{item.title}</h4>
                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-wide mt-1">{item.provider}</p>
                        </div>
                        
                        <p className="text-sm text-zinc-400 mb-6 min-h-[40px]">{item.description}</p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <span className="font-bold text-white">{item.price}</span>
                            <button 
                                onClick={() => handleActivate(item)}
                                className="bg-white/5 text-zinc-300 px-4 py-2 rounded-lg text-sm font-bold hover:bg-white/10 hover:text-white transition-colors border border-white/5"
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
