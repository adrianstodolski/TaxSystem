
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { TaxReturn, TaxFormType, ViewState, Workspace } from '../types';
import { useStore } from '../store/useStore';
import { 
    Calculator, FileCheck, Send, CreditCard, Loader2, Download, 
    AlertTriangle, Sparkles, TrendingUp, TrendingDown, 
    Calendar, ArrowRight, ShieldCheck, PieChart, Coins, ChevronDown, CheckCircle2,
    FileText, Link, Lock, Search, Terminal, Server, Wifi
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

    // Filing State
    const [filingStatus, setFilingStatus] = useState<'IDLE' | 'PROCESSING' | 'DONE'>('IDLE');
    const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

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

    const addLog = (msg: string) => setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

    const handleFile = async () => {
        if(!taxData) return;
        setFilingStatus('PROCESSING');
        setTerminalLogs([]);
        
        addLog('Inicjalizacja procedury wysyłkowej...');
        await new Promise(r => setTimeout(r, 800));
        
        addLog(`Weryfikacja schematu XSD dla ${selectedForm}...`);
        await new Promise(r => setTimeout(r, 1200));
        addLog('Walidacja: OK.');

        addLog('Generowanie podpisu XAdES-BES (Szafir)...');
        await NuffiService.signDocument(taxData.id);
        addLog('Dokument podpisany cyfrowo.');

        addLog('Nawiązywanie połączenia z bramką MF (e-Deklaracje)...');
        await new Promise(r => setTimeout(r, 1000));
        addLog('Uwierzytelnianie: TLS 1.3 Handshake OK.');

        addLog('Wysyłanie pakietu danych...');
        const upoId = await NuffiService.submitToMF(taxData.id);
        
        addLog(`Transmisja zakończona. Status: 200 OK.`);
        addLog(`Odebrano UPO: ${upoId}`);
        
        setFilingStatus('DONE');
        toast.success('Przyjęto', 'Status 200. Pobrano UPO.');
    };

    return (
        <div className="space-y-8 pb-20 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
                        <ShieldCheck className="text-gold" /> Fiscal Operations
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
                            <div className="neo-card p-6 rounded-2xl relative overflow-hidden border-t-4 border-t-gold bg-gradient-to-b from-onyx to-[#141419]">
                                <div className="relative z-10">
                                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Zobowiązanie (YTD)</p>
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
                        <div className="neo-card p-8 rounded-2xl border border-white/10">
                            
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <Server className="text-gold" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Transmission Terminal</h3>
                                        <p className="text-zinc-400 text-xs">Bezpośrednie połączenie z MF (e-Deklaracje)</p>
                                    </div>
                                </div>
                                
                                <div className="relative group min-w-[250px]">
                                    <select 
                                        value={selectedForm} 
                                        onChange={(e) => setSelectedForm(e.target.value as TaxFormType)}
                                        className="neo-input w-full pl-4 pr-10 py-3 rounded-xl font-bold appearance-none cursor-pointer hover:border-gold/50 transition-colors"
                                        disabled={filingStatus !== 'IDLE'}
                                    >
                                        <option value={TaxFormType.PIT_36}>PIT-36 (Działalność)</option>
                                        <option value={TaxFormType.PIT_36L}>PIT-36L (Liniowy)</option>
                                        <option value={TaxFormType.PIT_28}>PIT-28 (Ryczałt)</option>
                                        <option value={TaxFormType.PIT_38}>PIT-38 (Giełda/Krypto)</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none group-hover:text-gold" size={16} />
                                </div>
                            </div>

                            {/* Terminal Window */}
                            {filingStatus !== 'IDLE' && (
                                <div className="mb-8 bg-[#050505] rounded-xl border border-white/10 overflow-hidden shadow-inner font-mono text-xs">
                                    <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                                        <span className="text-zinc-500 flex items-center gap-2"><Terminal size={12} /> nuffi-cli --submit</span>
                                        <div className="flex gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                                            <div className="w-2 h-2 rounded-full bg-amber-500/50"></div>
                                            <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                                        </div>
                                    </div>
                                    <div className="p-4 space-y-2 h-64 overflow-y-auto custom-scrollbar">
                                        {terminalLogs.map((log, i) => (
                                            <div key={i} className="text-zinc-300">
                                                <span className="text-green-500 mr-2">➜</span>
                                                {log}
                                            </div>
                                        ))}
                                        {filingStatus === 'PROCESSING' && (
                                            <div className="animate-pulse text-gold">_</div>
                                        )}
                                        {filingStatus === 'DONE' && (
                                            <div className="text-green-400 font-bold mt-4">
                                                [SUCCESS] Operacja zakończona pomyślnie.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {filingStatus === 'DONE' ? (
                                <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <CheckCircle2 size={32} className="text-green-400" />
                                        <div>
                                            <h4 className="text-green-400 font-bold">Deklaracja Złożona</h4>
                                            <p className="text-zinc-400 text-sm">Urzędowe Poświadczenie Odbioru (UPO) jest dostępne.</p>
                                        </div>
                                    </div>
                                    <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors border border-white/10">
                                        <Download size={16} /> Pobierz UPO
                                    </button>
                                </div>
                            ) : (
                                filingStatus === 'IDLE' && (
                                    <div className="flex gap-4">
                                        <button className="flex-1 bg-onyx border border-white/10 text-zinc-300 py-4 rounded-xl font-bold hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2">
                                            <FileText size={18} /> Podgląd XML
                                        </button>
                                        <button onClick={handleFile} className="flex-1 bg-gold text-black py-4 rounded-xl font-bold hover:bg-[#FCD34D] transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold/20">
                                            <Send size={18} /> Inicjuj Wysyłkę
                                        </button>
                                    </div>
                                )
                            )}
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
