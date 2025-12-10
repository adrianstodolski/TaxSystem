
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { MerchantStats, MerchantTx } from '../types';
import { CreditCard, Smartphone, Bitcoin, Link, Plus, QrCode, RefreshCw, CheckCircle2, Copy, Wallet, ArrowUpRight, Loader2 } from 'lucide-react';
import { toast } from './ui/Toast';
import { Modal } from './ui/Modal';

export const NuffiPay: React.FC = () => {
    const [stats, setStats] = useState<MerchantStats | null>(null);
    const [transactions, setTransactions] = useState<MerchantTx[]>([]);
    const [loading, setLoading] = useState(true);
    const [linkModalOpen, setLinkModalOpen] = useState(false);
    
    // Create Link Form
    const [amount, setAmount] = useState('');
    const [desc, setDesc] = useState('');
    const [currency, setCurrency] = useState('PLN');
    const [createdLink, setCreatedLink] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        const load = async () => {
            const [s, t] = await Promise.all([
                NuffiService.fetchMerchantStats(),
                NuffiService.fetchMerchantTransactions()
            ]);
            setStats(s);
            setTransactions(t);
            setLoading(false);
        };
        load();
    }, []);

    const handleCreateLink = async () => {
        if(!amount || !desc) return;
        setCreating(true);
        const url = await NuffiService.createPaymentLink(parseFloat(amount), currency, desc);
        setCreatedLink(url);
        setCreating(false);
        toast.success('Link utworzony', 'Możesz go teraz wysłać do klienta.');
    };

    const copyLink = () => {
        navigator.clipboard.writeText(createdLink);
        toast.info('Skopiowano', 'Link w schowku.');
        setLinkModalOpen(false);
        setCreatedLink('');
        setAmount('');
        setDesc('');
    };

    const formatCurrency = (val: number, curr = 'PLN') => {
        try {
            return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: curr }).format(val);
        } catch (e) {
            return `${val.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${curr}`;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <CreditCard className="text-indigo-600" /> Nuffi Pay (Merchant)
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Przyjmuj płatności online i stacjonarnie (BLIK, Karty, Krypto).
                    </p>
                </div>
                <button 
                    onClick={() => setLinkModalOpen(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-lg shadow-indigo-200"
                >
                    <Link size={18} /> Utwórz Link Płatniczy
                </button>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
                    <p className="text-slate-400 text-xs font-bold uppercase">Procesowany Wolumen</p>
                    <h3 className="text-3xl font-bold mt-2">{stats ? formatCurrency(stats.totalVolume) : '...'}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-slate-500 text-xs font-bold uppercase">Transakcje (Msc)</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-2">{stats?.txCount}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-slate-500 text-xs font-bold uppercase">Crypto Payments</p>
                    <h3 className="text-3xl font-bold text-orange-500 mt-2">{stats ? formatCurrency(stats.cryptoVolume) : '...'}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-slate-500 text-xs font-bold uppercase">Aktywne Linki</p>
                    <h3 className="text-3xl font-bold text-indigo-600 mt-2">{stats?.activeLinks}</h3>
                </div>
            </div>

            {/* Terminal Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-bold text-slate-900">Ostatnie Wpłaty</h3>
                        <button className="text-slate-400 hover:text-indigo-600"><RefreshCw size={16} /></button>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {transactions.map(tx => (
                            <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                                        tx.method === 'BLIK' ? 'bg-red-600' : 
                                        tx.method === 'CRYPTO' ? 'bg-orange-500' : 
                                        'bg-indigo-600'
                                    }`}>
                                        {tx.method === 'BLIK' ? <Smartphone size={20} /> : 
                                         tx.method === 'CRYPTO' ? <Bitcoin size={20} /> : 
                                         <CreditCard size={20} />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">{tx.description}</p>
                                        <p className="text-xs text-slate-500">{tx.customerEmail} • {tx.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900 font-mono">+{formatCurrency(tx.amount, tx.currency)}</p>
                                    <span className={`text-[10px] font-bold uppercase ${
                                        tx.status === 'COMPLETED' ? 'text-green-600' : 'text-amber-600'
                                    }`}>
                                        {tx.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* POS Terminal Simulator */}
                <div className="bg-slate-900 p-6 rounded-3xl shadow-2xl border-4 border-slate-800 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl"></div>
                    <div className="mt-6 text-center">
                        <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-4">Nuffi Virtual POS</p>
                        <div className="bg-white p-4 rounded-xl inline-block mb-4">
                            <QrCode size={120} className="text-slate-900" />
                        </div>
                        <p className="text-white font-mono text-xl font-bold mb-1">250.00 PLN</p>
                        <p className="text-slate-500 text-xs">Oczekiwanie na płatność...</p>
                        
                        <div className="grid grid-cols-3 gap-2 mt-6">
                            <button className="bg-slate-800 text-white py-2 rounded font-bold text-xs hover:bg-slate-700">BLIK</button>
                            <button className="bg-slate-800 text-white py-2 rounded font-bold text-xs hover:bg-slate-700">KARTA</button>
                            <button className="bg-slate-800 text-white py-2 rounded font-bold text-xs hover:bg-slate-700">ETH</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CREATE LINK MODAL */}
            <Modal isOpen={linkModalOpen} onClose={() => setLinkModalOpen(false)} title="Nowy Link Płatniczy">
                <div className="space-y-4">
                    {!createdLink ? (
                        <>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Kwota</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="number" 
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold"
                                        placeholder="0.00"
                                    />
                                    <select 
                                        value={currency} 
                                        onChange={e => setCurrency(e.target.value)}
                                        className="w-24 px-2 border border-slate-300 rounded-lg bg-white outline-none font-bold"
                                    >
                                        <option value="PLN">PLN</option>
                                        <option value="EUR">EUR</option>
                                        <option value="USD">USD</option>
                                        <option value="USDT">USDT</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Opis (dla klienta)</label>
                                <input 
                                    type="text" 
                                    value={desc}
                                    onChange={e => setDesc(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="np. Zaliczka za projekt"
                                />
                            </div>
                            <button 
                                onClick={handleCreateLink}
                                disabled={creating || !amount || !desc}
                                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                            >
                                {creating ? <Loader2 className="animate-spin" /> : 'Generuj Link'}
                            </button>
                        </>
                    ) : (
                        <div className="text-center animate-in zoom-in">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 size={32} />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-4">Link gotowy!</h3>
                            <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 flex items-center justify-between mb-4">
                                <span className="text-xs font-mono text-slate-600 truncate max-w-[200px]">{createdLink}</span>
                                <button onClick={copyLink} className="text-indigo-600 font-bold text-xs hover:underline">Kopiuj</button>
                            </div>
                            <button onClick={copyLink} className="w-full bg-slate-900 text-white py-2 rounded-lg font-bold">Zamknij</button>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};
