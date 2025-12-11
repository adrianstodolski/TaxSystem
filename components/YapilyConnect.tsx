
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { BankAccount, Transaction, TransferRequest, DirectDebitMandate, BulkPaymentBatch, VrpConfig, FinancialHealthScore, AccountVerification } from '../types';
import { RefreshCw, Search, CheckCircle2, ArrowRight, Wallet, LineChart, PieChart, Plus, Send, Copy, CreditCard, Building, Lock, ShieldCheck, Loader2, MoreHorizontal, User, Globe, Repeat, XCircle, Users, Layers, Zap, Activity, AlertCircle } from 'lucide-react';
import { toast } from './ui/Toast';
import { Modal } from './ui/Modal';

const BANKS = [
  { id: 'mbank', name: 'mBank', color: 'bg-gradient-to-br from-red-600 to-red-700', logo: 'M' },
  { id: 'pko', name: 'PKO BP', color: 'bg-gradient-to-br from-blue-800 to-blue-900', logo: 'P' },
  { id: 'pekao', name: 'Bank Pekao', color: 'bg-gradient-to-br from-red-800 to-red-900', logo: 'Ż' },
  { id: 'ing', name: 'ING Bank', color: 'bg-gradient-to-br from-orange-500 to-orange-600', logo: 'L' },
  { id: 'santander', name: 'Santander', color: 'bg-gradient-to-br from-red-600 to-red-800', logo: 'S' },
  { id: 'millennium', name: 'Millennium', color: 'bg-gradient-to-br from-pink-700 to-purple-800', logo: 'M' },
  { id: 'revolut', name: 'Revolut', color: 'bg-gradient-to-br from-blue-500 to-blue-600', logo: 'R' },
  { id: 'railsr', name: 'Railsr (Embedded)', color: 'bg-gradient-to-br from-indigo-900 to-slate-900', logo: 'Railsr' },
];

export const YapilyConnect: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'ACCOUNTS' | 'DEBITS' | 'BULK' | 'VRP' | 'HEALTH' | 'VERIFY'>('ACCOUNTS');
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [mandates, setMandates] = useState<DirectDebitMandate[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);

    // Advanced Yapily States
    const [financialHealth, setFinancialHealth] = useState<FinancialHealthScore | null>(null);
    const [verifyIban, setVerifyIban] = useState('');
    const [verifyName, setVerifyName] = useState('');
    const [verifyResult, setVerifyResult] = useState<AccountVerification | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);

    // Modal State
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [connectStep, setConnectStep] = useState<'PROVIDER' | 'SELECT' | 'CONSENT' | 'CONNECTING' | 'SUCCESS'>('PROVIDER');
    const [selectedProvider, setSelectedProvider] = useState<string>('SALT_EDGE');
    const [selectedBankId, setSelectedBankId] = useState<string | null>(null);

    // Transfer State
    const [transferAmount, setTransferAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [transferType, setTransferType] = useState<'DOMESTIC' | 'SEPA' | 'SWIFT'>('DOMESTIC');
    const [isTransferring, setIsTransferring] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [accs, txs, mds, health] = await Promise.all([
            NuffiService.fetchAccounts(),
            NuffiService.fetchRecentTransactions(),
            NuffiService.fetchDirectDebits(),
            NuffiService.fetchFinancialHealth()
        ]);
        setAccounts(accs);
        if(accs.length > 0 && !selectedAccount) setSelectedAccount(accs[0]);
        setTransactions(txs);
        setMandates(mds);
        setFinancialHealth(health);
        setLoading(false);
    };

    const handleTransfer = async () => {
        if(!selectedAccount || !transferAmount || !recipient) return;
        setIsTransferring(true);
        const req: TransferRequest = { fromAccountId: selectedAccount.id, amount: parseFloat(transferAmount), recipientName: recipient, recipientIban: 'PL00...', title: `Przelew ${transferType} Nuffi`, type: transferType, currency: selectedAccount.currency };
        await NuffiService.executeTransfer(req);
        toast.success('Płatność wysłana', `Przekazano ${transferAmount} ${selectedAccount.currency} (${transferType}) do ${recipient}.`);
        setIsTransferring(false);
        setTransferAmount(''); setRecipient('');
    };

    const handleVerifyBeneficiary = async () => {
        if (!verifyIban || !verifyName) return;
        setIsVerifying(true);
        const res = await NuffiService.verifyAccountOwnership(verifyIban, verifyName);
        setVerifyResult(res);
        setIsVerifying(false);
    };

    const formatCurrency = (val: number, curr: string) => {
        try { return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: curr }).format(val); } catch (e) { return `${val.toLocaleString('pl-PL')} ${curr}`; }
    };

    const closeConnectModal = () => { setIsConnectModalOpen(false); setConnectStep('PROVIDER'); setSelectedBankId(null); };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-end border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                         <Building className="text-gold" /> Bankowość & Płatności (Yapily Core)
                    </h2>
                    <p className="text-zinc-400 mt-1">Open Banking Aggregation, PIS Bulk Payments & VRP.</p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-[#0A0A0C] p-1 rounded-lg flex overflow-x-auto border border-white/10">
                        <button onClick={() => setActiveTab('ACCOUNTS')} className={`px-4 py-2 text-sm font-bold rounded-md transition-all whitespace-nowrap ${activeTab === 'ACCOUNTS' ? 'bg-gold text-black shadow-glow' : 'text-zinc-400 hover:text-white'}`}>Konta</button>
                        <button onClick={() => setActiveTab('BULK')} className={`px-4 py-2 text-sm font-bold rounded-md transition-all whitespace-nowrap ${activeTab === 'BULK' ? 'bg-gold text-black shadow-glow' : 'text-zinc-400 hover:text-white'}`}>Masowe (Bulk)</button>
                        <button onClick={() => setActiveTab('VRP')} className={`px-4 py-2 text-sm font-bold rounded-md transition-all whitespace-nowrap ${activeTab === 'VRP' ? 'bg-gold text-black shadow-glow' : 'text-zinc-400 hover:text-white'}`}>Smart VRP</button>
                        <button onClick={() => setActiveTab('HEALTH')} className={`px-4 py-2 text-sm font-bold rounded-md transition-all whitespace-nowrap ${activeTab === 'HEALTH' ? 'bg-gold text-black shadow-glow' : 'text-zinc-400 hover:text-white'}`}>Kondycja</button>
                        <button onClick={() => setActiveTab('VERIFY')} className={`px-4 py-2 text-sm font-bold rounded-md transition-all whitespace-nowrap ${activeTab === 'VERIFY' ? 'bg-gold text-black shadow-glow' : 'text-zinc-400 hover:text-white'}`}>Weryfikacja IBAN</button>
                    </div>
                    <button 
                        onClick={() => setIsConnectModalOpen(true)}
                        className="bg-gold text-black px-4 py-2.5 rounded-lg font-medium hover:bg-[#FCD34D] flex items-center gap-2 shadow-lg shadow-gold/20 text-sm shrink-0"
                    >
                        <Plus size={16} /> Dodaj konto
                    </button>
                </div>
            </header>

            {activeTab === 'ACCOUNTS' && (
                <>
                    {/* LIQUID ASSETS & CARDS */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Total Balance Widget */}
                        <div className="glass-card p-8 rounded-xl shadow-sm border border-white/10 flex flex-col justify-center relative overflow-hidden group">
                            <div className="relative z-10">
                                <p className="text-zinc-400 font-bold uppercase tracking-wider text-xs mb-2">Płynność Finansowa</p>
                                <h3 className="text-5xl font-bold text-white tracking-tight font-mono">
                                    {formatCurrency(accounts.reduce((acc, curr) => acc + (curr.currency === 'PLN' ? curr.balance : curr.balance * 4.3), 0), 'PLN')}
                                </h3>
                                <div className="flex gap-2 mt-6">
                                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <ArrowRight size={12} className="-rotate-45" /> +12.5%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Cards Carousel */}
                        <div className="lg:col-span-2 overflow-x-auto pb-4 custom-scrollbar">
                            <div className="flex gap-4">
                                {loading ? [1,2].map(i => <div key={i} className="min-w-[300px] h-[180px] bg-white/5 rounded-xl animate-pulse" />) : 
                                    accounts.map(acc => (
                                        <div 
                                            key={acc.id}
                                            onClick={() => setSelectedAccount(acc)}
                                            className={`min-w-[300px] h-[180px] rounded-xl p-6 relative overflow-hidden text-white shadow-lg cursor-pointer transition-all hover:-translate-y-1 ring-2 ${selectedAccount?.id === acc.id ? 'ring-offset-2 ring-gold ring-offset-[#0A0A0C]' : 'ring-transparent'} ${acc.colorTheme}`}
                                        >
                                            <div className="relative z-10 flex flex-col justify-between h-full">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-bold text-white/90 text-sm">{acc.providerName}</p>
                                                        <p className="text-xs text-white/70 font-mono mt-0.5">
                                                            •••• {acc.accountNumber.slice(-4)}
                                                        </p>
                                                    </div>
                                                    {acc.aggregator && (
                                                        <span className="text-[9px] bg-black/20 px-2 py-0.5 rounded font-bold uppercase">{acc.aggregator}</span>
                                                    )}
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <p className="text-[10px] text-white/70 uppercase font-bold">Saldo</p>
                                                        <p className="text-xl font-bold tracking-tight font-mono">{formatCurrency(acc.balance, acc.currency)}</p>
                                                    </div>
                                                    {acc.isVirtual && (
                                                        <span className="bg-white/20 text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase backdrop-blur-sm border border-white/20">Railsr Virtual</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* TRANSFER HUB */}
                        <div className="glass-card p-6 rounded-xl shadow-sm border border-white/10 lg:col-span-1">
                            <h3 className="font-bold text-white mb-6 flex items-center gap-2 text-sm uppercase tracking-wide">
                                <Send className="text-gold" size={16} /> Przelew Natychmiastowy
                            </h3>
                            
                            {selectedAccount ? (
                                <div className="space-y-4">
                                    {/* Transfer Type Selector */}
                                    <div className="flex bg-[#0A0A0C] p-1 rounded-lg border border-white/10">
                                        <button onClick={() => setTransferType('DOMESTIC')} className={`flex-1 text-xs font-bold py-2 rounded ${transferType === 'DOMESTIC' ? 'bg-gold text-black' : 'text-zinc-400 hover:text-white'}`}>ELIXIR</button>
                                        <button onClick={() => setTransferType('SEPA')} className={`flex-1 text-xs font-bold py-2 rounded ${transferType === 'SEPA' ? 'bg-gold text-black' : 'text-zinc-400 hover:text-white'}`}>SEPA</button>
                                        <button onClick={() => setTransferType('SWIFT')} className={`flex-1 text-xs font-bold py-2 rounded ${transferType === 'SWIFT' ? 'bg-gold text-black' : 'text-zinc-400 hover:text-white'}`}>SWIFT</button>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Odbiorca</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                            <input 
                                                type="text" 
                                                value={recipient}
                                                onChange={e => setRecipient(e.target.value)}
                                                placeholder="Nazwa, NIP..."
                                                className="neo-input w-full pl-10 pr-4 py-2.5 rounded-lg text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Kwota</label>
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                value={transferAmount}
                                                onChange={e => setTransferAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="neo-input w-full pl-4 pr-12 py-2.5 rounded-lg text-lg font-bold font-mono"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-xs">{selectedAccount.currency}</span>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={handleTransfer}
                                        disabled={isTransferring || !transferAmount || !recipient}
                                        className="w-full bg-gold text-black py-2.5 rounded-lg font-bold hover:bg-[#FCD34D] transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold/20 disabled:opacity-50 text-sm"
                                    >
                                        {isTransferring ? <Loader2 className="animate-spin" /> : <>Wyślij {transferType} <ArrowRight size={16} /></>}
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-zinc-500 text-sm">
                                    Wybierz konto z karuzeli powyżej.
                                </div>
                            )}
                        </div>

                        {/* UNIFIED FEED */}
                        <div className="glass-card rounded-xl shadow-sm border border-white/10 lg:col-span-2 overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                                <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wide">
                                    <RefreshCw size={16} className="text-zinc-400" /> Ostatnie Operacje
                                </h3>
                            </div>
                            <div className="flex-1 overflow-y-auto max-h-[400px]">
                                {loading ? [1,2,3].map(i => <div key={i} className="h-14 bg-white/5 m-4 rounded animate-pulse" />) :
                                    <div className="divide-y divide-white/5">
                                        {transactions.map(tx => (
                                            <div key={tx.id} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between group">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold ${tx.amount > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#0A0A0C] text-zinc-400'}`}>
                                                        {tx.amount > 0 ? <ArrowRight className="-rotate-45" size={16} /> : <CreditCard size={16} />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-sm">{tx.description}</p>
                                                        <p className="text-xs text-zinc-500 flex items-center gap-1">
                                                            {tx.date}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`font-bold font-mono text-sm ${tx.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                                                        {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount, 'PLN')}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Other tabs... (Applying glass-card) */}
            {activeTab === 'HEALTH' && financialHealth && (
                <div className="space-y-6 animate-in fade-in">
                    <div className="glass-card text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10">
                        <div className="flex items-center gap-6">
                            <div className="relative w-32 h-32 rounded-full border-8 border-[#0A0A0C] flex items-center justify-center">
                                <span className="text-4xl font-bold font-mono">{financialHealth.score}</span>
                                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="46" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray={`${(financialHealth.score / 1000) * 289} 289`} />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-1">Kondycja Finansowa</h3>
                                <p className="text-zinc-400 text-sm mb-4">Na podstawie analizy transakcji Open Banking.</p>
                                <div className="flex gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${financialHealth.riskLevel === 'LOW' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400'}`}>
                                        Ryzyko: {financialHealth.riskLevel}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                        Affordability: {financialHealth.affordabilityRating}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/5 p-6 rounded-xl border border-white/10 w-full max-w-sm">
                            <div className="flex justify-between mb-2 text-sm">
                                <span className="text-zinc-300">Wolne środki (msc)</span>
                                <span className="font-bold">{formatCurrency(financialHealth.monthlyDisposableIncome, 'PLN')}</span>
                            </div>
                            <div className="w-full bg-[#0A0A0C] h-2 rounded-full mb-4 overflow-hidden">
                                <div className="bg-green-500 h-full" style={{width: '75%'}}></div>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-300">Wskaźnik zadłużenia</span>
                                <span className="font-bold">{(financialHealth.debtToIncomeRatio * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-[#0A0A0C] h-2 rounded-full mt-2 overflow-hidden">
                                <div className="bg-amber-500 h-full" style={{width: `${financialHealth.debtToIncomeRatio * 100}%`}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'VERIFY' && (
                <div className="space-y-6 animate-in fade-in">
                    <div className="glass-card p-8 rounded-2xl shadow-sm border border-white/10 max-w-2xl mx-auto">
                        <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 text-center">Weryfikacja Beneficjenta (CoP)</h3>
                        <p className="text-zinc-400 mb-8 text-center">
                            Sprawdź, czy podany numer IBAN faktycznie należy do osoby/firmy, której chcesz zapłacić. Chroni przed oszustwami.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-zinc-400 mb-1">Numer IBAN</label>
                                <input 
                                    type="text" 
                                    value={verifyIban}
                                    onChange={e => setVerifyIban(e.target.value)}
                                    className="neo-input w-full px-4 py-3 rounded-lg font-mono text-white"
                                    placeholder="PL..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-zinc-400 mb-1">Nazwa Właściciela</label>
                                <input 
                                    type="text" 
                                    value={verifyName}
                                    onChange={e => setVerifyName(e.target.value)}
                                    className="neo-input w-full px-4 py-3 rounded-lg text-white"
                                    placeholder="Imię i Nazwisko / Nazwa Firmy"
                                />
                            </div>
                            <button 
                                onClick={handleVerifyBeneficiary}
                                disabled={isVerifying || !verifyIban || !verifyName}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                            >
                                {isVerifying ? <Loader2 className="animate-spin" /> : 'Sprawdź Właściciela'}
                            </button>
                        </div>

                        {verifyResult && (
                            <div className={`mt-6 p-4 rounded-xl border flex items-center justify-between animate-in zoom-in ${verifyResult.matchStatus === 'MATCH' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                                <div className="flex items-center gap-3">
                                    {verifyResult.matchStatus === 'MATCH' ? <CheckCircle2 className="text-green-400" size={24} /> : <AlertCircle className="text-red-400" size={24} />}
                                    <div>
                                        <h4 className={`font-bold ${verifyResult.matchStatus === 'MATCH' ? 'text-green-400' : 'text-red-400'}`}>
                                            {verifyResult.matchStatus === 'MATCH' ? 'Pełna Zgodność' : verifyResult.matchStatus === 'CLOSE_MATCH' ? 'Częściowa Zgodność' : 'Brak Zgodności'}
                                        </h4>
                                        <p className="text-xs text-zinc-300 opacity-70">Confidence Score: {verifyResult.confidenceScore}%</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal for connection */}
            <Modal isOpen={isConnectModalOpen} onClose={closeConnectModal} title="Łączenie...">
                <div className="py-8 flex flex-col items-center">
                    <Loader2 className="animate-spin text-gold mb-4" size={32} />
                    <h3 className="font-bold text-white text-sm">Symulacja połączenia...</h3>
                    <button onClick={closeConnectModal} className="mt-6 w-full bg-[#0A0A0C] text-white py-2.5 rounded-lg font-bold text-sm">Zamknij</button>
                </div>
            </Modal>
        </div>
    );
};
