
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { MerchantStats, MerchantTx } from '../types';
import { CreditCard, Smartphone, Bitcoin, Link, Plus, QrCode, RefreshCw, CheckCircle2, Copy, Wallet, Loader2, ArrowRight, Share2, Globe, Monitor, Lock } from 'lucide-react';
import { toast } from './ui/Toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

const linkSchema = z.object({
    amount: z.number().min(1, "Kwota musi być większa niż 1"),
    currency: z.enum(['PLN', 'EUR', 'USD']),
    description: z.string().min(3, "Opis jest wymagany (min. 3 znaki)")
});

type LinkForm = z.infer<typeof linkSchema>;

export const NuffiPay: React.FC = () => {
    const [transactions, setTransactions] = useState<MerchantTx[]>([]);
    const [createdLink, setCreatedLink] = useState('');
    const [activeTab, setActiveTab] = useState<'LINK' | 'TERMINAL' | 'HISTORY'>('LINK');
    
    // Live Preview State
    const [previewAmount, setPreviewAmount] = useState<number | null>(null);
    const [previewDesc, setPreviewDesc] = useState('');
    
    const { register, handleSubmit, watch, formState: { errors, isSubmitting }, reset } = useForm<LinkForm>({
        resolver: zodResolver(linkSchema),
        defaultValues: { currency: 'PLN' }
    });

    // Watch inputs for live preview
    useEffect(() => {
        const subscription = watch((value) => {
            setPreviewAmount(value.amount ? Number(value.amount) : null);
            setPreviewDesc(value.description || '');
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    useEffect(() => {
        const load = async () => {
            const t = await NuffiService.fetchMerchantTransactions();
            setTransactions(t);
        };
        load();
    }, []);

    const onSubmit = async (data: LinkForm) => {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network
        const url = await NuffiService.createPaymentLink(data.amount, data.currency, data.description);
        setCreatedLink(url);
        toast.success('Sukces', 'Link do płatności został wygenerowany.');
    };

    const copyLink = () => {
        navigator.clipboard.writeText(createdLink);
        toast.info('Skopiowano', 'Link w schowku.');
    };

    const newPayment = () => {
        setCreatedLink('');
        reset();
        setPreviewAmount(null);
        setPreviewDesc('');
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <CreditCard className="text-indigo-500" /> Nuffi Pay Gateway
                    </h2>
                    <p className="text-slate-400 mt-1">Przyjmuj płatności online (BLIK, Karty, Krypto).</p>
                </div>
                <div className="flex bg-slate-900 p-1 rounded-lg border border-white/10">
                    <button onClick={() => setActiveTab('LINK')} className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'LINK' ? 'bg-indigo-600 text-white shadow-glow' : 'text-slate-400 hover:text-white'}`}>Generator Linków</button>
                    <button onClick={() => setActiveTab('HISTORY')} className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'HISTORY' ? 'bg-indigo-600 text-white shadow-glow' : 'text-slate-400 hover:text-white'}`}>Transakcje</button>
                </div>
            </header>

            {activeTab === 'LINK' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Input Form */}
                    <div className="flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                            {!createdLink ? (
                                <motion.div 
                                    key="form"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="glass-card p-8 rounded-2xl border border-white/10"
                                >
                                    <h3 className="text-xl font-bold text-white mb-6">Nowa Płatność</h3>
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Kwota i Waluta</label>
                                            <div className="flex gap-4">
                                                <div className="relative flex-1">
                                                    <input 
                                                        {...register('amount', { valueAsNumber: true })}
                                                        type="number" step="0.01" 
                                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-2xl font-bold text-white focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-600" 
                                                        placeholder="0.00" 
                                                        autoFocus
                                                    />
                                                </div>
                                                <select {...register('currency')} className="w-24 bg-slate-800 border border-slate-700 rounded-xl px-2 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500">
                                                    <option value="PLN">PLN</option>
                                                    <option value="EUR">EUR</option>
                                                    <option value="USD">USD</option>
                                                </select>
                                            </div>
                                            {errors.amount && <span className="text-rose-500 text-xs mt-1 block">{errors.amount.message}</span>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Tytuł / Opis</label>
                                            <input 
                                                {...register('description')} 
                                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-600" 
                                                placeholder="np. Konsultacja online #123" 
                                            />
                                            {errors.description && <span className="text-rose-500 text-xs mt-1 block">{errors.description.message}</span>}
                                        </div>

                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-900/50 transition-all flex items-center justify-center gap-2 mt-4"
                                        >
                                            {isSubmitting ? <Loader2 className="animate-spin" /> : <>Generuj Link <ArrowRight size={20} /></>}
                                        </button>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="glass-card p-8 rounded-2xl border border-green-500/30 bg-green-500/5 text-center"
                                >
                                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
                                        <CheckCircle2 size={32} className="text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Gotowe!</h3>
                                    <p className="text-slate-400 mb-6">Twój link jest aktywny i gotowy do wysyłki.</p>
                                    
                                    <div className="bg-slate-900/50 p-4 rounded-xl border border-white/10 mb-6 flex items-center justify-between gap-4">
                                        <code className="text-indigo-400 text-sm truncate flex-1">{createdLink}</code>
                                        <button onClick={copyLink} className="text-white hover:text-indigo-400 transition-colors p-2">
                                            <Copy size={18} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button className="bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-700 flex items-center justify-center gap-2 transition-colors">
                                            <Share2 size={18} /> Udostępnij
                                        </button>
                                        <button onClick={newPayment} className="bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-500 flex items-center justify-center gap-2 transition-colors shadow-lg">
                                            <Plus size={18} /> Nowa
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right: Live Preview (Mobile Mockup) */}
                    <div className="flex justify-center items-center relative">
                        <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none"></div>
                        
                        {/* Phone Frame */}
                        <div className="relative w-[320px] h-[640px] bg-slate-950 rounded-[3rem] border-8 border-slate-900 shadow-2xl overflow-hidden z-10">
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-20"></div>
                            
                            {/* Screen Content */}
                            <div className="w-full h-full bg-slate-50 text-slate-900 flex flex-col">
                                <div className="h-16 bg-white flex items-center justify-center border-b border-slate-100">
                                    <span className="font-bold text-indigo-600 tracking-tight">Nuffi Pay</span>
                                </div>
                                
                                <div className="flex-1 p-6 flex flex-col items-center pt-12">
                                    <div className="w-16 h-16 bg-slate-200 rounded-full mb-6 flex items-center justify-center text-2xl font-bold text-slate-500">
                                        JD
                                    </div>
                                    <p className="text-sm text-slate-500 mb-1">Płacisz firmie</p>
                                    <h4 className="font-bold text-lg mb-8">Jan Doe Software</h4>
                                    
                                    <div className="text-center mb-8">
                                        <p className="text-4xl font-bold text-slate-900">
                                            {previewAmount ? new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(previewAmount) : '0,00 PLN'}
                                        </p>
                                        <p className="text-sm text-slate-500 mt-2 max-w-[200px] mx-auto break-words">
                                            {previewDesc || 'Opis płatności...'}
                                        </p>
                                    </div>

                                    <div className="w-full space-y-3 mt-auto mb-8">
                                        <button className="w-full bg-black text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                                            <span className="text-lg"></span> Pay
                                        </button>
                                        <button className="w-full bg-white border border-slate-200 text-slate-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                                            <CreditCard size={18} /> Karta / BLIK
                                        </button>
                                    </div>
                                    
                                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                        <Lock size={10} /> Secured by Nuffi
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'HISTORY' && (
                <div className="glass-card rounded-2xl overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-white/10 bg-slate-900/30 flex justify-between items-center">
                        <h3 className="font-bold text-white">Historia Transakcji</h3>
                        <div className="flex gap-2">
                            <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded border border-green-800 flex items-center gap-1">
                                <Globe size={12} /> Live
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2 max-h-[600px]">
                        {transactions.map(tx => (
                            <div key={tx.id} className="p-4 bg-slate-800/30 rounded-xl flex items-center justify-between border border-white/5 hover:bg-slate-800/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-inner ${
                                        tx.method === 'BLIK' ? 'bg-red-600' : 
                                        tx.method === 'CRYPTO' ? 'bg-orange-500' : 
                                        'bg-indigo-600'
                                    }`}>
                                        {tx.method === 'BLIK' ? <Smartphone /> : tx.method === 'CRYPTO' ? <Bitcoin /> : <CreditCard />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{tx.description}</p>
                                        <p className="text-xs text-slate-500">{tx.date} • {tx.customerEmail}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-white font-mono text-lg">+{tx.amount} {tx.currency}</p>
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                        tx.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                                    }`}>
                                        {tx.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
