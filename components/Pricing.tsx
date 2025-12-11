
import React, { useState } from 'react';
import { SubscriptionPlan } from '../types';
import { NuffiService } from '../services/api';
import { Check, Star, Zap, Building, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from './ui/Toast';

export const Pricing: React.FC = () => {
    const [loading, setLoading] = useState<string | null>(null);

    const handleSubscribe = async (plan: SubscriptionPlan) => {
        setLoading(plan);
        try {
            const url = await NuffiService.createStripeCheckout(plan);
            toast.success('Przekierowanie', 'Za chwilę zostaniesz przeniesiony do płatności Stripe.');
            // window.location.href = url; // Mock
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
            <header className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-4">Wybierz plan dla swojej firmy</h2>
                <p className="text-slate-400">Inwestuj w rozwój, a nie w księgowość. Zmień plan w dowolnym momencie.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                {/* Starter */}
                <div className="glass-card rounded-2xl p-8 hover:border-indigo-500/30 transition-all relative">
                    <h3 className="text-lg font-bold text-white">Starter</h3>
                    <div className="mt-4 mb-6">
                        <span className="text-4xl font-bold text-white">0</span>
                        <span className="text-slate-400"> PLN / msc</span>
                    </div>
                    <p className="text-sm text-slate-400 mb-8">Dla freelancerów i początkujących JDG.</p>
                    
                    <button 
                        onClick={() => handleSubscribe(SubscriptionPlan.FREE)}
                        disabled={loading === SubscriptionPlan.FREE}
                        className="w-full py-3 rounded-xl border border-slate-600 font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-all mb-8"
                    >
                        Aktualny plan
                    </button>

                    <ul className="space-y-4 text-sm">
                        {features.FREE.map((f, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <div className="bg-slate-800 p-1 rounded-full"><Check size={12} className="text-slate-400" /></div>
                                <span className="text-slate-300">{f}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* PRO */}
                <div className="bg-gradient-to-b from-indigo-900/40 to-slate-900/80 rounded-2xl p-8 border border-indigo-500/50 shadow-2xl relative transform md:-translate-y-4 backdrop-blur-xl">
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-indigo-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl shadow-lg">
                        POLECANY
                    </div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Zap size={20} className="text-yellow-400 fill-yellow-400" /> PRO
                    </h3>
                    <div className="mt-4 mb-6">
                        <span className="text-4xl font-bold text-white">49</span>
                        <span className="text-slate-400"> PLN / msc</span>
                    </div>
                    <p className="text-sm text-indigo-200 mb-8">Pełna automatyzacja dla MŚP i aktywnych inwestorów.</p>
                    
                    <button 
                        onClick={() => handleSubscribe(SubscriptionPlan.PRO)}
                        disabled={loading === SubscriptionPlan.PRO}
                        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all mb-8 shadow-lg shadow-indigo-900/50 flex items-center justify-center gap-2 border-t border-indigo-400/20"
                    >
                        {loading === SubscriptionPlan.PRO ? <Loader2 className="animate-spin" /> : <>Wybierz PRO <ArrowRight size={18} /></>}
                    </button>

                    <ul className="space-y-4 text-sm">
                        {features.PRO.map((f, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <div className="bg-indigo-500 p-1 rounded-full"><Check size={12} className="text-white" /></div>
                                <span className="text-white font-medium">{f}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Enterprise */}
                <div className="glass-card rounded-2xl p-8 hover:border-indigo-500/30 transition-all">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Building size={20} className="text-slate-400" /> Enterprise
                    </h3>
                    <div className="mt-4 mb-6">
                        <span className="text-4xl font-bold text-white">Custom</span>
                    </div>
                    <p className="text-sm text-slate-400 mb-8">Dla biur rachunkowych i korporacji.</p>
                    
                    <button 
                        onClick={() => handleSubscribe(SubscriptionPlan.ENTERPRISE)}
                        disabled={loading === SubscriptionPlan.ENTERPRISE}
                        className="w-full py-3 rounded-xl border border-slate-600 font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-all mb-8"
                    >
                        Skontaktuj się
                    </button>

                    <ul className="space-y-4 text-sm">
                        {features.ENTERPRISE.map((f, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <div className="bg-slate-800 p-1 rounded-full"><Check size={12} className="text-slate-400" /></div>
                                <span className="text-slate-300">{f}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
