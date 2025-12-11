
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { TaxReturn, TaxFormType, ViewState, Workspace } from '../types';
import { useStore } from '../store/useStore';
import { 
    Calculator, FileCheck, Send, CreditCard, Loader2, Download, 
    AlertTriangle, Sparkles, TrendingUp, TrendingDown, 
    Calendar, ArrowRight, ShieldCheck, PieChart, Coins, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from './ui/Toast';

export const TaxCommandCenter: React.FC = () => {
    const { activeWorkspace } = useStore();
    const [loading, setLoading] = useState(true);
    const [taxData, setTaxData] = useState<TaxReturn | null>(null);
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'FILING' | 'OPTIMIZATION'>('OVERVIEW');
    
    // Auto-select form based on workspace
    const defaultForm = activeWorkspace === Workspace.BUSINESS ? TaxFormType.PIT_36 : TaxFormType.PIT_38;
    const [selectedForm, setSelectedForm] = useState<TaxFormType>(defaultForm);

    useEffect(() => {
        loadData();
    }, [activeWorkspace, selectedForm]);

    const loadData = async () => {
        setLoading(true);
        // Simulate pulling real-time data from TaxEngine
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
    const primaryColor = isBusiness ? 'text-indigo-400' : 'text-emerald-400';
    const borderColor = isBusiness ? 'border-indigo-500/30' : 'border-emerald-500/30';
    const gradient = isBusiness ? 'from-indigo-600 to-blue-600' : 'from-emerald-600 to-teal-600';

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header with segmented control tabs */}
            <header className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <ShieldCheck className={primaryColor} /> Tax Command Center
                    </h2>
                    <p className="text-slate-400 mt-1">
                        Zintegrowany panel podatkowy: <span className="font-mono text-white/80 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">{activeWorkspace === Workspace.BUSINESS ? 'CIT / VAT / PIT-36' : 'Belka / PIT-38 / Krypto'}</span>
                    </p>
                </div>
                <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10 backdrop-blur-md">
                    {['OVERVIEW', 'FILING', 'OPTIMIZATION'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab as any)} 
                            className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all relative ${activeTab === tab ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <span className="relative z-10">
                                {tab === 'OVERVIEW' ? 'Przegląd' : tab === 'FILING' ? 'Deklaracje' : 'Optymalizacja'}
                            </span>
                            {activeTab === tab && (
                                <motion.div 
                                    layoutId="activeTabBg"
                                    className={`absolute inset-0 rounded-lg ${isBusiness ? 'bg-indigo-600' : 'bg-emerald-600'} shadow-lg`}
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
                        {/* Status Cards - Modern HUD Style */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className={`glass-card p-6 rounded-2xl relative overflow-hidden group border-t-4 ${isBusiness ? 'border-indigo-500' : 'border-emerald-500'}`}>
                                <div className="relative z-10">
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Estymowany Podatek (YTD)</p>
                                    <h3 className="text-4xl font-bold text-white font-mono tracking-tight">
                                        {loading ? <Loader2 className="animate-spin" /> : formatCurrency(taxData?.taxDue || 0)}
                                    </h3>
                                    <div className="mt-4 flex items-center gap-2 text-xs font-medium bg-white/5 w-fit px-2 py-1 rounded border border-white/5">
                                        <Calendar size={12} className="text-slate-400" /> 
                                        <span className="text-slate-300">Termin: 20.11.2023</span>
                                    </div>
                                </div>
                                <div className={`absolute -right-4 -top-4 opacity-10 rotate-12 ${isBusiness ? 'text-indigo-500' : 'text-emerald-500'}`}>
                                    <Calculator size={120} />
                                </div>
                            </div>

                            <div className="glass-card p-6 rounded-2xl border-t-4 border-emerald-500/70">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Efektywna Stopa</p>
                                <h3 className="text-4xl font-bold text-emerald-400 font-mono tracking-tight">
                                    {loading ? '...' : '14.2%'}
                                </h3>
                                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                    <TrendingDown size={14} className="text-emerald-500" /> -4.8% vs skala podatkowa
                                </p>
                            </div>

                            <div className="glass-card p-6 rounded-2xl border-t-4 border-amber-500/70">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Ryzyko Kontroli</p>
                                <h3 className="text-4xl font-bold text-amber-400 font-mono tracking-tight">NISKIE</h3>
                                <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                                    <ShieldCheck size={14} className="text-green-500" /> Audit Defender Active
                                </div>
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="glass-card p-8 rounded-2xl">
                                <h4 className="font-bold text-white mb-6 flex items-center gap-2">
                                    <PieChart size={18} className={primaryColor} /> Struktura Zobowiązań
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-indigo-500/20 p-2.5 rounded-lg text-indigo-400 font-bold text-xs border border-indigo-500/30">PIT</div>
                                            <span className="text-slate-200 text-sm font-medium">Podatek Dochodowy</span>
                                        </div>
                                        <span className="font-mono font-bold text-white">{formatCurrency((taxData?.taxDue || 0) * 0.7)}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-emerald-500/20 p-2.5 rounded-lg text-emerald-400 font-bold text-xs border border-emerald-500/30">ZUS</div>
                                            <span className="text-slate-200 text-sm font-medium">Ubezpieczenia Społeczne</span>
                                        </div>
                                        <span className="font-mono font-bold text-white">{formatCurrency((taxData?.breakdown?.zus?.totalDue || 0))}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-rose-500/20 p-2.5 rounded-lg text-rose-400 font-bold text-xs border border-rose-500/30">VAT</div>
                                            <span className="text-slate-200 text-sm font-medium">Podatek VAT (Należny)</span>
                                        </div>
                                        <span className="font-mono font-bold text-white">{formatCurrency(4500)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card p-8 rounded-2xl flex flex-col justify-center text-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10">
                                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-900/30 animate-pulse-slow bg-gradient-to-br ${gradient}`}>
                                        <CreditCard size={40} className="text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Zapłać Jednym Kliknięciem</h3>
                                    <p className="text-slate-400 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                                        Agregacja wszystkich zobowiązań (PIT, CIT, VAT, ZUS) do jednego przelewu na mikrorachunek podatkowy.
                                    </p>
                                    <button onClick={handlePayTax} className="w-full bg-white text-indigo-950 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 text-lg shadow-xl shadow-white/5 hover:scale-[1.02]">
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
                        <div className="glass-card p-8 rounded-2xl border border-white/10">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FileCheck className={primaryColor} /> Generator Deklaracji
                                </h3>
                                
                                {/* Custom Styled Select */}
                                <div className="relative group min-w-[250px]">
                                    <select 
                                        value={selectedForm} 
                                        onChange={(e) => setSelectedForm(e.target.value as TaxFormType)}
                                        className="w-full bg-slate-900/80 border border-slate-700 text-white pl-4 pr-10 py-3 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer hover:bg-slate-800 transition-colors"
                                    >
                                        <option value={TaxFormType.PIT_36}>PIT-36 (Działalność)</option>
                                        <option value={TaxFormType.PIT_36L}>PIT-36L (Liniowy)</option>
                                        <option value={TaxFormType.PIT_28}>PIT-28 (Ryczałt)</option>
                                        <option value={TaxFormType.PIT_38}>PIT-38 (Giełda/Krypto)</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-white" size={16} />
                                </div>
                            </div>

                            <div className="bg-slate-900/50 rounded-xl p-8 border border-white/5 mb-8">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Podgląd Wyniku</span>
                                    <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/20 animate-pulse">WERYFIKACJA</span>
                                </div>
                                <div className="space-y-4 font-mono text-sm">
                                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                        <span className="text-slate-400">Przychód</span>
                                        <span className="text-white text-lg">{formatCurrency(taxData?.breakdown?.revenue || 0)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                        <span className="text-slate-400">Koszty Uzyskania</span>
                                        <span className="text-rose-400 text-lg">-{formatCurrency(taxData?.breakdown?.costs || 0)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-white font-bold">Podatek Należny</span>
                                        <span className={`text-2xl font-bold ${primaryColor}`}>{formatCurrency(taxData?.taxDue || 0)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button className="flex-1 bg-slate-800 border border-slate-700 text-slate-300 py-4 rounded-xl font-bold hover:bg-slate-700 hover:text-white transition-all flex items-center justify-center gap-2">
                                    <Download size={18} /> Podgląd PDF
                                </button>
                                <button onClick={handleFile} className={`flex-1 bg-gradient-to-r ${gradient} text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/30`}>
                                    <Send size={18} /> Wyślij do MF (e-Deklaracje)
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'OPTIMIZATION' && (
                    <motion.div key="OPT" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                        <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-8 rounded-2xl border border-indigo-500/30 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                            
                            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                                <div className="p-4 bg-indigo-500/20 rounded-2xl text-indigo-400 border border-indigo-500/20 shrink-0">
                                    <Sparkles size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Nuffi AI Advisor</h3>
                                    <p className="text-indigo-200 text-sm leading-relaxed max-w-2xl mb-6">
                                        Analiza Twoich wydatków i przychodów sugeruje zmianę formy opodatkowania na <strong>Ryczałt Ewidencjonowany (12%)</strong> w przyszłym roku. 
                                        Oszczędność szacowana: <strong className="text-white bg-white/10 px-1 rounded">14 500 PLN</strong> rocznie.
                                    </p>
                                    <div className="flex gap-3">
                                        <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg hover:bg-indigo-500 transition-all">Symuluj Ryczałt</button>
                                        <button className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg text-sm font-bold hover:bg-white/10 transition-all">Szczegóły Analizy</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass-card p-6 rounded-2xl hover:border-emerald-500/50 transition-all cursor-pointer group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400 group-hover:scale-110 transition-transform border border-emerald-500/20">
                                        <Coins size={24} />
                                    </div>
                                    <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">DOSTĘPNE</span>
                                </div>
                                <h4 className="font-bold text-white mb-1">Tax Loss Harvesting (Krypto)</h4>
                                <p className="text-xs text-slate-400 mb-4">Masz niezrealizowane straty na BTC (-4500 PLN). Sprzedaj i odkup, aby obniżyć podatek.</p>
                                <div className="text-right">
                                    <span className="text-emerald-400 font-bold text-sm group-hover:translate-x-1 transition-transform inline-block">Oszczędź 855 PLN &rarr;</span>
                                </div>
                            </div>

                            <div className="glass-card p-6 rounded-2xl hover:border-blue-500/50 transition-all cursor-pointer group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 group-hover:scale-110 transition-transform border border-blue-500/20">
                                        <TrendingUp size={24} />
                                    </div>
                                    <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20">DOSTĘPNE</span>
                                </div>
                                <h4 className="font-bold text-white mb-1">Indywidualne Konto Zabezpieczenia Emerytalnego</h4>
                                <p className="text-xs text-slate-400 mb-4">Wpłać limit roczny (9388 PLN), aby odliczyć go od podstawy opodatkowania.</p>
                                <div className="text-right">
                                    <span className="text-blue-400 font-bold text-sm group-hover:translate-x-1 transition-transform inline-block">Oszczędź 1783 PLN &rarr;</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
