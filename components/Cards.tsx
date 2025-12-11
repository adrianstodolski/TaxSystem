
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { VirtualCard } from '../types';
import { CreditCard, Lock, Unlock, Plus, Trash2, Smartphone, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { toast } from './ui/Toast';
import { Modal } from './ui/Modal';

export const Cards: React.FC = () => {
    const [cards, setCards] = useState<VirtualCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [revealCardId, setRevealCardId] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchVirtualCards();
            setCards(data);
            setLoading(false);
        };
        load();
    }, []);

    const toggleFreeze = async (card: VirtualCard) => {
        const newState = card.status === 'ACTIVE'; // true = freeze
        await NuffiService.toggleCardFreeze(card.id, newState);
        setCards(prev => prev.map(c => c.id === card.id ? {...c, status: newState ? 'FROZEN' : 'ACTIVE'} : c));
        toast.info(newState ? 'Karta zamrożona' : 'Karta odblokowana', `Status karty *${card.last4} zmieniony.`);
    };

    const formatCurrency = (val: number) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <CreditCard className="text-indigo-400" /> Karty Firmowe
                    </h2>
                    <p className="text-slate-400 mt-1">Wydawaj wirtualne karty dla pracowników i subskrypcji.</p>
                </div>
                <button 
                    onClick={() => toast.success('Nowa karta', 'Karta wirtualna została utworzona i jest gotowa do użycia.')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-500 flex items-center gap-2 shadow-lg shadow-indigo-900/50 transition-all"
                >
                    <Plus size={18} /> Wydaj Kartę
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? [1,2,3].map(i => <div key={i} className="h-64 bg-slate-800/50 rounded-2xl animate-pulse" />) : 
                    cards.map(card => (
                        <div key={card.id} className="group relative">
                            {/* Card Visual */}
                            <div className={`aspect-[1.586/1] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden transition-transform duration-300 group-hover:-translate-y-2 border border-white/10 ${card.color} ${card.status === 'FROZEN' ? 'grayscale opacity-75' : ''}`}>
                                <div className="relative z-10 flex flex-col justify-between h-full">
                                    <div className="flex justify-between items-start">
                                        <div className="bg-black/20 backdrop-blur-md px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase border border-white/10">
                                            {card.type}
                                        </div>
                                        <span className="font-bold italic text-lg opacity-80">{card.brand}</span>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        {card.status === 'FROZEN' && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20 rounded-2xl border border-white/10">
                                                <Lock size={32} className="text-white" />
                                            </div>
                                        )}
                                        <div className="flex gap-4 font-mono text-xl tracking-widest text-shadow-sm">
                                            <span>••••</span>
                                            <span>••••</span>
                                            <span>••••</span>
                                            <span>{card.last4}</span>
                                        </div>
                                        <div className="flex justify-between items-end mt-4">
                                            <div>
                                                <p className="text-[10px] opacity-70 uppercase font-bold">Posiadacz</p>
                                                <p className="font-medium text-sm tracking-wide">{card.holderName.toUpperCase()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] opacity-70 uppercase font-bold">Ważność</p>
                                                <p className="font-mono text-sm">{card.expiry}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Shine effect */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                            </div>

                            {/* Controls */}
                            <div className="mt-4 glass-card rounded-xl p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="text-xs text-slate-400">
                                        Limit: <span className="font-bold text-white">{formatCurrency(card.limitMonthly)}</span>
                                    </div>
                                    <div className="text-xs text-slate-400">
                                        Wydano: <span className="font-bold text-indigo-400">{formatCurrency(card.spentMonthly)}</span>
                                    </div>
                                </div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4 border border-slate-700">
                                    <div className="bg-indigo-500 h-full rounded-full shadow-[0_0_8px_#6366f1]" style={{width: `${(card.spentMonthly / card.limitMonthly) * 100}%`}}></div>
                                </div>

                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => toggleFreeze(card)}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors flex items-center justify-center gap-1 ${
                                            card.status === 'FROZEN' 
                                                ? 'bg-slate-700 text-white border-slate-600 hover:bg-slate-600' 
                                                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                                        }`}
                                    >
                                        {card.status === 'FROZEN' ? <><Unlock size={12} /> Odblokuj</> : <><Lock size={12} /> Zamroź</>}
                                    </button>
                                    <button className="flex-1 py-2 rounded-lg text-xs font-bold border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 flex items-center justify-center gap-1">
                                        Zmień limit
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
