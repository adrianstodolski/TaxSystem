
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

const PROVIDERS = [
    { id: 'SALT_EDGE', name: 'Salt Edge', icon: ShieldCheck, desc: 'Najlepszy zasięg w PL' },
    { id: 'TINK', name: 'Tink', icon: Lock, desc: 'Szybkie płatności PIS' },
    { id: 'TRUELAYER', name: 'TrueLayer', icon: Globe, desc: 'Globalne integracje' },
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

    // Bulk Pay State
    const [bulkProcessing, setBulkProcessing] = useState(false);
    const [bulkBatch, setBulkBatch] = useState<BulkPaymentBatch | null>(null);

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

    const handleSelectProvider = (provider: string) => {
        setSelectedProvider(provider);
        setConnectStep('SELECT');
    };

    const handleConnectBank = (bankId: string) => {
        setSelectedBankId(bankId);
        setConnectStep('CONSENT');
    };

    const confirmConsent = () => {
        setConnectStep('CONNECTING');
        setTimeout(() => {
            setConnectStep('SUCCESS');
            toast.success('Konto podłączone', `Pomyślnie zautoryzowano dostęp przez ${selectedProvider}.`);
            loadData();
        }, 3000);
    };

    const closeConnectModal = () => {
        setIsConnectModalOpen(false);
        setConnectStep('PROVIDER');
        setSelectedBankId(null);
    };

    const handleTransfer = async () => {
        if(!selectedAccount || !transferAmount || !recipient) return;
        setIsTransferring(true);
        
        const req: TransferRequest = {
            fromAccountId: selectedAccount.id,
            amount: parseFloat(transferAmount),
            recipientName: recipient,
            recipientIban: 'PL00...', // Mock
            title: `Przelew ${transferType} Nuffi`,
            type: transferType,
            currency: selectedAccount.currency
        };

        await NuffiService.executeTransfer(req);
        toast.success('Płatność wysłana', `Przekazano ${transferAmount} ${selectedAccount.currency} (${transferType}) do ${recipient}.`);
        setIsTransferring(false);
        setTransferAmount('');
        setRecipient('');
    };

    const handleBulkPay = async () => {
        setBulkProcessing(true);
        const recipients = ['Pracownik 1', 'Pracownik 2', 'Pracownik 3', 'Dostawca X', 'ZUS', 'Urząd Skarbowy'];
        const amount = 45200.00;
        const batch = await NuffiService.executeBulkPayment(recipients, amount);
        setBulkBatch(batch);
        setBulkProcessing(false);
        toast.success('Paczka przelewów zlecona', `Autoryzowano ${recipients.length} przelewów na łączną kwotę ${formatCurrency(amount, 'PLN')}.`);
    };

    const handleSetupVrp = async () => {
        await NuffiService.setupVrp({
            id: 'vrp_1',
            beneficiary: 'Urząd Skarbowy (Mikrorachunek)',
            maxAmountPerPeriod: 10000,
            period: 'MONTHLY',
            active: true
        });
        toast.success('Smart Tax VRP Aktywne', 'Podatki będą opłacane automatycznie po wygenerowaniu deklaracji.');
    };

    const handleVerifyBeneficiary = async () => {
        if (!verifyIban || !verifyName) return;
        setIsVerifying(true);
        const res = await NuffiService.verifyAccountOwnership(verifyIban, verifyName);
        setVerifyResult(res);
        setIsVerifying(false);
        if (res.matchStatus === 'MATCH') {
            toast.success('Weryfikacja Pozytywna', 'Nazwa odbiorcy zgadza się z właścicielem rachunku.');
        } else {
            toast.warning('Ostrzeżenie', 'Dane odbiorcy nie pasują do właściciela rachunku.');
        }
    };

    const formatCurrency = (val: number, curr: string) => 
        new Intl.NumberFormat('pl-PL', { style: 'currency', currency: curr }).format(val);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-end border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                         <Building className="text-indigo-600" /> Bankowość & Płatności (Yapily Core)
                    </h2>
                    <p className="text-slate-500 mt-1">Open Banking Aggregation, PIS Bulk Payments & VRP.</p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-slate-100 p-1 rounded-lg flex overflow-x-auto">
                        <button onClick={() => setActiveTab('ACCOUNTS')} className={`px-4 py-2 text-sm font-bold rounded-md transition-all whitespace-nowrap ${activeTab === 'ACCOUNTS' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Konta</button>
                        <button onClick={() => setActiveTab('BULK')} className={`px-4 py-2 text-sm font-bold rounded-md transition-all whitespace-nowrap ${activeTab === 'BULK' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>Masowe (Bulk)</button>
                        <button onClick={() => setActiveTab('VRP')} className={`px-4 py-2 text-sm font-bold rounded-md transition-all whitespace-nowrap ${activeTab === 'VRP' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>Smart VRP</button>
                        <button onClick={() => setActiveTab('DEBITS')} className={`px-4 py-2 text-sm font-bold rounded-md transition-all whitespace-nowrap ${activeTab === 'DEBITS' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>Direct Debit</button>
                        <button onClick={() => setActiveTab('HEALTH')} className={`px-4 py-2 text-sm font-bold rounded-md transition-all whitespace-nowrap ${activeTab === 'HEALTH' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}>Kondycja</button>
                        <button onClick={() => setActiveTab('VERIFY')} className={`px-4 py-2 text-sm font-bold rounded-md transition-all whitespace-nowrap ${activeTab === 'VERIFY' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>Weryfikacja IBAN</button>
                    </div>
                    <button 
                        onClick={() => setIsConnectModalOpen(true)}
                        className="bg-slate-900 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-slate-800 flex items-center gap-2 shadow-sm text-sm shrink-0"
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
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center relative overflow-hidden group">
                            <div className="relative z-10">
                                <p className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-2">Płynność Finansowa</p>
                                <h3 className="text-5xl font-bold text-slate-900 tracking-tight font-mono">
                                    {formatCurrency(accounts.reduce((acc, curr) => acc + (curr.currency === 'PLN' ? curr.balance : curr.balance * 4.3), 0), 'PLN')}
                                </h3>
                                <div className="flex gap-2 mt-6">
                                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <ArrowRight size={12} className="-rotate-45" /> +12.5%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Cards Carousel */}
                        <div className="lg:col-span-2 overflow-x-auto pb-4 custom-scrollbar">
                            <div className="flex gap-4">
                                {loading ? [1,2].map(i => <div key={i} className="min-w-[300px] h-[180px] bg-slate-100 rounded-xl animate-pulse" />) : 
                                    accounts.map(acc => (
                                        <div 
                                            key={acc.id}
                                            onClick={() => setSelectedAccount(acc)}
                                            className={`min-w-[300px] h-[180px] rounded-xl p-6 relative overflow-hidden text-white shadow-lg cursor-pointer transition-all hover:-translate-y-1 ring-2 ${selectedAccount?.id === acc.id ? 'ring-offset-2 ring-indigo-600' : 'ring-transparent'} ${acc.colorTheme}`}
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
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-1">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-sm uppercase tracking-wide">
                                <Send className="text-indigo-600" size={16} /> Przelew Natychmiastowy
                            </h3>
                            
                            {selectedAccount ? (
                                <div className="space-y-4">
                                    {/* Transfer Type Selector */}
                                    <div className="flex bg-slate-100 p-1 rounded-lg">
                                        <button onClick={() => setTransferType('DOMESTIC')} className={`flex-1 text-xs font-bold py-2 rounded ${transferType === 'DOMESTIC' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>ELIXIR</button>
                                        <button onClick={() => setTransferType('SEPA')} className={`flex-1 text-xs font-bold py-2 rounded ${transferType === 'SEPA' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>SEPA</button>
                                        <button onClick={() => setTransferType('SWIFT')} className={`flex-1 text-xs font-bold py-2 rounded ${transferType === 'SWIFT' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>SWIFT</button>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Odbiorca</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input 
                                                type="text" 
                                                value={recipient}
                                                onChange={e => setRecipient(e.target.value)}
                                                placeholder="Nazwa, NIP..."
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kwota</label>
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                value={transferAmount}
                                                onChange={e => setTransferAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full pl-4 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-lg font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">{selectedAccount.currency}</span>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={handleTransfer}
                                        disabled={isTransferring || !transferAmount || !recipient}
                                        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-50 text-sm"
                                    >
                                        {isTransferring ? <Loader2 className="animate-spin" /> : <>Wyślij {transferType} <ArrowRight size={16} /></>}
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-400 text-sm">
                                    Wybierz konto z karuzeli powyżej.
                                </div>
                            )}
                        </div>

                        {/* UNIFIED FEED */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 lg:col-span-2 overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wide">
                                    <RefreshCw size={16} className="text-slate-400" /> Ostatnie Operacje
                                </h3>
                            </div>
                            <div className="flex-1 overflow-y-auto max-h-[400px]">
                                {loading ? [1,2,3].map(i => <div key={i} className="h-14 bg-slate-50 m-4 rounded animate-pulse" />) :
                                    <div className="divide-y divide-slate-50">
                                        {transactions.map(tx => (
                                            <div key={tx.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold ${tx.amount > 0 ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                                                        {tx.amount > 0 ? <ArrowRight className="-rotate-45" size={16} /> : <CreditCard size={16} />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-sm">{tx.description}</p>
                                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                                            {tx.date}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`font-bold font-mono text-sm ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
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

            {/* Other tabs... */}
            {activeTab === 'HEALTH' && financialHealth && (
                <div className="space-y-6 animate-in fade-in">
                    <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800">
                        <div className="flex items-center gap-6">
                            <div className="relative w-32 h-32 rounded-full border-8 border-slate-700 flex items-center justify-center">
                                <span className="text-4xl font-bold font-mono">{financialHealth.score}</span>
                                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="46" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray={`${(financialHealth.score / 1000) * 289} 289`} />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-1">Kondycja Finansowa</h3>
                                <p className="text-slate-400 text-sm mb-4">Na podstawie analizy transakcji Open Banking.</p>
                                <div className="flex gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${financialHealth.riskLevel === 'LOW' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        Ryzyko: {financialHealth.riskLevel}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-500/20 text-blue-400">
                                        Affordability: {financialHealth.affordabilityRating}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 p-6 rounded-xl border border-white/10 w-full max-w-sm">
                            <div className="flex justify-between mb-2 text-sm">
                                <span className="text-slate-300">Wolne środki (msc)</span>
                                <span className="font-bold">{formatCurrency(financialHealth.monthlyDisposableIncome, 'PLN')}</span>
                            </div>
                            <div className="w-full bg-slate-700 h-2 rounded-full mb-4 overflow-hidden">
                                <div className="bg-green-500 h-full" style={{width: '75%'}}></div>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-300">Wskaźnik zadłużenia</span>
                                <span className="font-bold">{(financialHealth.debtToIncomeRatio * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
                                <div className="bg-amber-500 h-full" style={{width: `${financialHealth.debtToIncomeRatio * 100}%`}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'VERIFY' && (
                <div className="space-y-6 animate-in fade-in">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-2xl mx-auto">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2 text-center">Weryfikacja Beneficjenta (CoP)</h3>
                        <p className="text-slate-500 mb-8 text-center">
                            Sprawdź, czy podany numer IBAN faktycznie należy do osoby/firmy, której chcesz zapłacić. Chroni przed oszustwami.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Numer IBAN</label>
                                <input 
                                    type="text" 
                                    value={verifyIban}
                                    onChange={e => setVerifyIban(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                    placeholder="PL..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Nazwa Właściciela</label>
                                <input 
                                    type="text" 
                                    value={verifyName}
                                    onChange={e => setVerifyName(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Imię i Nazwisko / Nazwa Firmy"
                                />
                            </div>
                            <button 
                                onClick={handleVerifyBeneficiary}
                                disabled={isVerifying || !verifyIban || !verifyName}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                            >
                                {isVerifying ? <Loader2 className="animate-spin" /> : 'Sprawdź Właściciela'}
                            </button>
                        </div>

                        {verifyResult && (
                            <div className={`mt-6 p-4 rounded-xl border flex items-center justify-between animate-in zoom-in ${verifyResult.matchStatus === 'MATCH' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                <div className="flex items-center gap-3">
                                    {verifyResult.matchStatus === 'MATCH' ? <CheckCircle2 className="text-green-600" size={24} /> : <AlertCircle className="text-red-600" size={24} />}
                                    <div>
                                        <h4 className={`font-bold ${verifyResult.matchStatus === 'MATCH' ? 'text-green-800' : 'text-red-800'}`}>
                                            {verifyResult.matchStatus === 'MATCH' ? 'Pełna Zgodność' : verifyResult.matchStatus === 'CLOSE_MATCH' ? 'Częściowa Zgodność' : 'Brak Zgodności'}
                                        </h4>
                                        <p className="text-xs opacity-70">Confidence Score: {verifyResult.confidenceScore}%</p>
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
                    <Loader2 className="animate-spin text-indigo-600 mb-4" size={32} />
                    <h3 className="font-bold text-slate-900 text-sm">Symulacja połączenia...</h3>
                    <button onClick={closeConnectModal} className="mt-6 w-full bg-slate-900 text-white py-2.5 rounded-lg font-bold text-sm">Zamknij</button>
                </div>
            </Modal>
        </div>
    );
};
