
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { TaxReturn, TaxFormType, ViewState, Workspace } from '../types';
import { useStore } from '../store/useStore';
import { 
    Calculator, FileCheck, Send, CreditCard, Loader2, Download, 
    AlertTriangle, Sparkles, TrendingUp, TrendingDown, 
    Calendar, ArrowRight, ShieldCheck, PieChart, Coins, ChevronDown, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from './ui/Toast';

export const TaxCommandCenter: React.FC = () => {
    const { activeWorkspace } = useStore();
    const [loading, setLoading] = useState(true);
    const [taxData, setTaxData] = useState<TaxReturn | null>(null);
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'FILING' | 'OPTIMIZATION'>('OVERVIEW');
    
    const defaultForm = activeWorkspace === Workspace.BUSINESS ? TaxFormType.PIT_36 : TaxFormType.PIT_38;
    const [selectedForm, setSelectedForm] = useState<TaxFormType>(defaultForm);

    useEffect(() => {
        loadData();
    }, [activeWorkspace, selectedForm]);

    const loadData = async () => {
        setLoading(true);
        const data = await NuffiService.calculateTax(selectedForm);
        setTaxData(data);
        setLoading(false);
    };

    const formatCurrency = (val: number) => 
        new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(val);

    const handlePayTax = async () => {
        if(!taxData) return;
        toast.info('Płatność', 'Inicjowanie bramki Nuffi Pay (BLIK)...');
        await NuffiService.processPayment(taxData.taxDue, 'BLIK');
        toast.success('Zapłacono', 'Podatek został opłacony. Potwierdzenie wysłano na maila.');
    };

    const handleFile = async () => {
        if(!taxData) return;
        toast.info('e-Deklaracje', 'Wysyłanie do bramki Ministerstwa Finansów...');
        await NuffiService.submitToMF(taxData.id);
        toast.success('Przyjęto', 'Status 200. Pobrano UPO.');
    };

    const isBusiness = activeWorkspace === Workspace.BUSINESS;

    return (
        <div className="space-y-8 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
                        <ShieldCheck className="text-gold" /> Tax Command Center
                    </h2>
                    <p className="text-zinc-400 mt-1">
                        Zintegrowany panel podatkowy: <span className="font-mono text-gold/80 bg-gold/10 px-1.5 py-0.5 rounded border border-gold/20 text-xs">{activeWorkspace === Workspace.BUSINESS ? 'CIT / VAT / PIT-36' : 'Belka / PIT-38 / Krypto'}</span>
                    </p>
                </div>
                <div className="flex bg-onyx p-1 rounded-xl border border-white/10">
                    {['OVERVIEW', 'FILING', 'OPTIMIZATION'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab as any)} 
                            className={`px-6 py-2 text-sm font-bold rounded-lg transition-all relative ${activeTab === tab ? 'text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <span className="relative z-10">
                                {tab === 'OVERVIEW' ? 'Przegląd' : tab === 'FILING' ? 'Deklaracje' : 'Optymalizacja'}
                            </span>
                            {activeTab === tab && (
                                <motion.div 
                                    layoutId="activeTabBg"
                                    className="absolute inset-0 rounded-lg bg-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </header>

            <AnimatePresence mode="wait">
                {activeTab === 'OVERVIEW' && (
                    <motion.div key="OVERVIEW" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                        {/* Status Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="neo-card p-6 rounded-2xl relative overflow-hidden border-t-4 border-t-gold">
                                <div className="relative z-10">
                                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Estymowany Podatek (YTD)</p>
                                    <h3 className="text-4xl font-bold text-white font-mono tracking-tight">
                                        {loading ? <Loader2 className="animate-spin text-gold" /> : formatCurrency(taxData?.taxDue || 0)}
                                    </h3>
                                    <div className="mt-4 flex items-center gap-2 text-xs font-medium bg-white/5 w-fit px-2 py-1 rounded border border-white/5 text-zinc-300">
                                        <Calendar size={12} className="text-gold" /> 
                                        <span>Termin: 20.11.2023</span>
                                    </div>
                                </div>
                                <div className="absolute -right-6 -top-6 opacity-5 text-gold">
                                    <Calculator size={140} />
                                </div>
                            </div>

                            <div className="neo-card p-6 rounded-2xl border-t-4 border-t-emerald-500">
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Efektywna Stopa</p>
                                <h3 className="text-4xl font-bold text-emerald-400 font-mono tracking-tight">
                                    {loading ? '...' : '14.2%'}
                                </h3>
                                <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
                                    <TrendingDown size={14} className="text-emerald-500" /> -4.8% vs skala podatkowa
                                </p>
                            </div>

                            <div className="neo-card p-6 rounded-2xl border-t-4 border-t-blue-500">
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Ryzyko Kontroli</p>
                                <h3 className="text-4xl font-bold text-blue-400 font-mono tracking-tight">NISKIE</h3>
                                <div className="mt-2 text-xs text-zinc-500 flex items-center gap-1">
                                    <ShieldCheck size={14} className="text-blue-500" /> Audit Defender Active
                                </div>
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="neo-card p-8 rounded-2xl">
                                <h4 className="font-bold text-white mb-6 flex items-center gap-2">
                                    <PieChart size={18} className="text-gold" /> Struktura Zobowiązań
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-4 bg-onyx/50 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white/5 p-2.5 rounded-lg text-zinc-300 font-bold text-xs border border-white/10">PIT</div>
                                            <span className="text-zinc-300 text-sm font-medium">Podatek Dochodowy</span>
                                        </div>
                                        <span className="font-mono font-bold text-white">{formatCurrency((taxData?.taxDue || 0) * 0.7)}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-onyx/50 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white/5 p-2.5 rounded-lg text-zinc-300 font-bold text-xs border border-white/10">ZUS</div>
                                            <span className="text-zinc-300 text-sm font-medium">Ubezpieczenia Społeczne</span>
                                        </div>
                                        <span className="font-mono font-bold text-white">{formatCurrency((taxData?.breakdown?.zus?.totalDue || 0))}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-onyx/50 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white/5 p-2.5 rounded-lg text-zinc-300 font-bold text-xs border border-white/10">VAT</div>
                                            <span className="text-zinc-300 text-sm font-medium">Podatek VAT (Należny)</span>
                                        </div>
                                        <span className="font-mono font-bold text-white">{formatCurrency(4500)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="neo-card p-8 rounded-2xl flex flex-col justify-center text-center relative overflow-hidden group border border-gold/20">
                                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10">
                                    <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(212,175,55,0.2)] bg-gradient-to-br from-gold/20 to-transparent border border-gold/30">
                                        <CreditCard size={40} className="text-gold" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Zapłać Jednym Kliknięciem</h3>
                                    <p className="text-zinc-400 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                                        Agregacja wszystkich zobowiązań (PIT, CIT, VAT, ZUS) do jednego przelewu na mikrorachunek podatkowy.
                                    </p>
                                    <button onClick={handlePayTax} className="w-full bg-gold text-black py-4 rounded-xl font-bold hover:bg-[#FCD34D] transition-all flex items-center justify-center gap-3 text-lg shadow-[0_0_20px_-5px_rgba(212,175,55,0.4)]">
                                        Zapłać Teraz <span className="font-mono">{formatCurrency((taxData?.taxDue || 0) + 4500 + (taxData?.breakdown?.zus?.totalDue || 0))}</span>
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'FILING' && (
                    <motion.div key="FILING" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                        <div className="neo-card p-8 rounded-2xl">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FileCheck className="text-gold" /> Generator Deklaracji
                                </h3>
                                
                                <div className="relative group min-w-[250px]">
                                    <select 
                                        value={selectedForm} 
                                        onChange={(e) => setSelectedForm(e.target.value as TaxFormType)}
                                        className="neo-input w-full pl-4 pr-10 py-3 rounded-xl font-bold appearance-none cursor-pointer hover:border-gold/50"
                                    >
                                        <option value={TaxFormType.PIT_36}>PIT-36 (Działalność)</option>
                                        <option value={TaxFormType.PIT_36L}>PIT-36L (Liniowy)</option>
                                        <option value={TaxFormType.PIT_28}>PIT-28 (Ryczałt)</option>
                                        <option value={TaxFormType.PIT_38}>PIT-38 (Giełda/Krypto)</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none group-hover:text-gold" size={16} />
                                </div>
                            </div>

                            <div className="bg-onyx rounded-xl p-8 border border-white/5 mb-8">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-zinc-500 text-sm font-bold uppercase tracking-wider">Podgląd Wyniku</span>
                                    <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/20 animate-pulse">WERYFIKACJA</span>
                                </div>
                                <div className="space-y-4 font-mono text-sm">
                                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                        <span className="text-zinc-400">Przychód</span>
                                        <span className="text-white text-lg">{formatCurrency(taxData?.breakdown?.revenue || 0)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                        <span className="text-zinc-400">Koszty Uzyskania</span>
                                        <span className="text-rose-400 text-lg">-{formatCurrency(taxData?.breakdown?.costs || 0)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-white font-bold">Podatek Należny</span>
                                        <span className="text-2xl font-bold text-gold">{formatCurrency(taxData?.taxDue || 0)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button className="flex-1 bg-onyx border border-white/10 text-zinc-300 py-4 rounded-xl font-bold hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2">
                                    <Download size={18} /> Podgląd PDF
                                </button>
                                <button onClick={handleFile} className="flex-1 bg-gold text-black py-4 rounded-xl font-bold hover:bg-[#FCD34D] transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold/20">
                                    <Send size={18} /> Wyślij do MF (e-Deklaracje)
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'OPTIMIZATION' && (
                    <motion.div key="OPT" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                        <div className="neo-card p-8 rounded-2xl relative overflow-hidden bg-[#0F0F12] border-gold/20">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                            
                            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                                <div className="p-4 bg-gold/10 rounded-2xl text-gold border border-gold/20 shrink-0">
                                    <Sparkles size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Nuffi AI Advisor</h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl mb-6">
                                        Analiza Twoich wydatków i przychodów sugeruje zmianę formy opodatkowania na <strong>Ryczałt Ewidencjonowany (12%)</strong> w przyszłym roku. 
                                        Oszczędność szacowana: <strong className="text-white bg-white/10 px-1 rounded">14 500 PLN</strong> rocznie.
                                    </p>
                                    <div className="flex gap-3">
                                        <button className="px-5 py-2.5 bg-gold text-black rounded-lg text-sm font-bold shadow-lg hover:bg-[#FCD34D] transition-all">Symuluj Ryczałt</button>
                                        <button className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg text-sm font-bold hover:bg-white/10 transition-all">Szczegóły Analizy</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="neo-card p-6 rounded-2xl hover:border-gold/30 transition-all cursor-pointer group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-white/5 rounded-lg text-white group-hover:scale-110 transition-transform border border-white/10">
                                        <Coins size={24} />
                                    </div>
                                    <span className="text-[10px] font-bold bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20">DOSTĘPNE</span>
                                </div>
                                <h4 className="font-bold text-white mb-1">Tax Loss Harvesting (Krypto)</h4>
                                <p className="text-xs text-zinc-400 mb-4">Masz niezrealizowane straty na BTC (-4500 PLN). Sprzedaj i odkup, aby obniżyć podatek.</p>
                                <div className="text-right">
                                    <span className="text-green-400 font-bold text-sm group-hover:translate-x-1 transition-transform inline-block">Oszczędź 855 PLN &rarr;</span>
                                </div>
                            </div>

                            <div className="neo-card p-6 rounded-2xl hover:border-gold/30 transition-all cursor-pointer group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-white/5 rounded-lg text-white group-hover:scale-110 transition-transform border border-white/10">
                                        <TrendingUp size={24} />
                                    </div>
                                    <span className="text-[10px] font-bold bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20">DOSTĘPNE</span>
                                </div>
                                <h4 className="font-bold text-white mb-1">Indywidualne Konto Zabezpieczenia Emerytalnego</h4>
                                <p className="text-xs text-zinc-400 mb-4">Wpłać limit roczny (9388 PLN), aby odliczyć go od podstawy opodatkowania.</p>
                                <div className="text-right">
                                    <span className="text-green-400 font-bold text-sm group-hover:translate-x-1 transition-transform inline-block">Oszczędź 1783 PLN &rarr;</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
