
import React, { useState } from 'react';
import { SubscriptionPlan } from '../types';
import { NuffiService } from '../services/api';
import { Check, Star, Zap, Building, ArrowRight, Loader2, Crown } from 'lucide-react';
import { toast } from './ui/Toast';

export const Pricing: React.FC = () => {
    const [loading, setLoading] = useState<string | null>(null);

    const handleSubscribe = async (plan: SubscriptionPlan) => {
        setLoading(plan);
        try {
            const url = await NuffiService.createStripeCheckout(plan);
            toast.success('Przekierowanie', 'Za chwilę zostaniesz przeniesiony do płatności Stripe.');
        } finally {
            setTimeout(() => setLoading(null), 2000);
        }
    };

    const features = {
        FREE: ['Fakturowanie (do 10/msc)', 'Prosty KSeF', '1 Bank (Open Banking)'],
        PRO: ['Nielimitowane faktury', 'Pełna automatyzacja KSeF', 'Wszystkie banki & Krypto', 'Biała Lista VAT (Check)', 'Raporty BI & Budżetowanie', 'Nuffi B2B Network (PIS)'],
        ENTERPRISE: ['API Access', 'Dedykowany opiekun', 'Audyt logów', 'Własna domena', 'SLA 99.9%']
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <header className="text-center max-w-2xl mx-auto mb-12">
                <div className="inline-block px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-4">
                    Inwestycja w automatyzację
                </div>
                <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Wybierz plan dla swojej firmy</h2>
                <p className="text-zinc-400">Płać tylko za to, czego potrzebujesz. Anuluj w dowolnym momencie.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                {/* Starter */}
                <div className="neo-card rounded-3xl p-8 hover:border-white/20 transition-all relative flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-2">Starter</h3>
                    <p className="text-xs text-zinc-500 mb-6">Dla freelancerów i początkujących JDG.</p>
                    <div className="mb-8">
                        <span className="text-4xl font-bold text-white font-mono">0</span>
                        <span className="text-zinc-500 font-mono text-sm"> PLN / msc</span>
                    </div>
                    
                    <button 
                        onClick={() => handleSubscribe(SubscriptionPlan.FREE)}
                        disabled={loading === SubscriptionPlan.FREE}
                        className="w-full py-4 rounded-xl border border-white/10 font-bold text-zinc-300 hover:bg-white/5 hover:text-white transition-all mb-8 text-sm uppercase tracking-wide"
                    >
                        Aktualny plan
                    </button>

                    <div className="space-y-4 flex-1">
                        {features.FREE.map((f, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="bg-white/5 p-1 rounded-full border border-white/10"><Check size={10} className="text-zinc-400" /></div>
                                <span className="text-zinc-400 text-sm">{f}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PRO - Premium Card */}
                <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0A0A0C] rounded-3xl p-8 border border-[#D4AF37]/50 shadow-[0_0_40px_-10px_rgba(212,175,55,0.15)] relative transform md:-translate-y-4 backdrop-blur-xl flex flex-col">
                    <div className="absolute top-0 right-0 bg-[#D4AF37] text-black text-[10px] font-bold px-3 py-1.5 rounded-bl-xl uppercase tracking-wider">
                        Polecany
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-white">PRO</h3>
                        <Crown size={16} className="text-[#D4AF37] fill-[#D4AF37]" />
                    </div>
                    <p className="text-xs text-[#D4AF37]/80 mb-6">Pełna automatyzacja dla MŚP i inwestorów.</p>
                    
                    <div className="mb-8">
                        <span className="text-5xl font-bold text-white font-mono tracking-tight">49</span>
                        <span className="text-zinc-500 font-mono text-sm"> PLN / msc</span>
                    </div>
                    
                    <button 
                        onClick={() => handleSubscribe(SubscriptionPlan.PRO)}
                        disabled={loading === SubscriptionPlan.PRO}
                        className="w-full py-4 rounded-xl bg-[#D4AF37] hover:bg-[#FCD34D] text-black font-bold transition-all mb-8 shadow-[0_0_20px_-5px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
                    >
                        {loading === SubscriptionPlan.PRO ? <Loader2 className="animate-spin" /> : <>Wybierz PRO <ArrowRight size={16} /></>}
                    </button>

                    <div className="space-y-4 flex-1">
                        {features.PRO.map((f, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="bg-[#D4AF37] p-1 rounded-full text-black"><Check size={10} strokeWidth={4} /></div>
                                <span className="text-white font-medium text-sm">{f}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Enterprise */}
                <div className="neo-card rounded-3xl p-8 hover:border-white/20 transition-all flex flex-col">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                        <Building size={18} className="text-zinc-400" /> Enterprise
                    </h3>
                    <p className="text-xs text-zinc-500 mb-6">Dla biur rachunkowych i korporacji.</p>
                    <div className="mb-8">
                        <span className="text-4xl font-bold text-white font-mono">Custom</span>
                    </div>
                    
                    <button 
                        onClick={() => handleSubscribe(SubscriptionPlan.ENTERPRISE)}
                        disabled={loading === SubscriptionPlan.ENTERPRISE}
                        className="w-full py-4 rounded-xl border border-white/10 font-bold text-zinc-300 hover:bg-white/5 hover:text-white transition-all mb-8 text-sm uppercase tracking-wide"
                    >
                        Skontaktuj się
                    </button>

                    <div className="space-y-4 flex-1">
                        {features.ENTERPRISE.map((f, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="bg-white/5 p-1 rounded-full border border-white/10"><Check size={10} className="text-zinc-400" /></div>
                                <span className="text-zinc-400 text-sm">{f}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
