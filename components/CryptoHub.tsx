
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { CryptoExchange, CryptoTransaction, CryptoTaxReport, DeFiReward, TaxHarvestingOpp, NFTAsset, CryptoAnalytics, WalletRiskProfile, ImpermanentLossResult, GoldRushTx, WalletDna, StreamEvent, TokenGodMode, TokenAllowance, NftCollectionStat, DeFiProtocol } from '../types';
import { CryptoEngine } from '../utils/cryptoEngine';
import { Bitcoin, RefreshCw, Key, Shield, AlertTriangle, FileText, TrendingUp, TrendingDown, DollarSign, Download, Plus, Layers, Zap, ArrowRight, Wallet, Image, BarChart2, Calculator, ShieldCheck, Activity, X, Server, Database, Code, Box, Eye, Fingerprint, Lock, Search, CheckCircle2, Network, Radio } from 'lucide-react';
import { Modal } from './ui/Modal';
import { toast } from './ui/Toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const CryptoHub: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'TAX' | 'DEFI' | 'NFT' | 'ANALYTICS' | 'RISK' | 'HARVESTING' | 'GOLDRUSH' | 'NANSEN' | 'STREAMS' | 'GODMODE' | 'ALLOWANCES' | 'NFT_PARADISE' | 'LIVE_ANALYZER'>('TAX');
    
    // Data States
    const [transactions, setTransactions] = useState<CryptoTransaction[]>([]);
    const [report, setReport] = useState<CryptoTaxReport | null>(null);
    const [defiProtocols, setDeFiProtocols] = useState<DeFiProtocol[]>([]); // New state
    const [goldRushData, setGoldRushData] = useState<GoldRushTx[]>([]);
    
    // ... existing states ...
    const [loading, setLoading] = useState(false);
    const [exchangeStatus, setExchangeStatus] = useState<Record<string, boolean>>({});
    
    // IL Calculator
    const [ilOpen, setIlOpen] = useState(false);
    const [ilResult, setIlResult] = useState<ImpermanentLossResult | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const exStatus = await NuffiService.getExchangeConnectionStatus();
            setExchangeStatus(exStatus);

            const [txs, defiData, grData] = await Promise.all([
                NuffiService.fetchCryptoTransactions(),
                NuffiService.fetchDeFiProtocols(),
                NuffiService.fetchGoldRushData('0xMyWallet'),
            ]);
            setTransactions(txs);
            setDeFiProtocols(defiData);
            setGoldRushData(grData);
            
            // Calculate Tax Logic
            const taxReport = CryptoEngine.calculateTax(txs, 'FIFO');
            setReport(taxReport);
            
        } catch (e) {
            toast.error('Błąd synchronizacji', 'Nie udało się pobrać danych.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const formatFiat = (val: number) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(val);
    const formatUsd = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Bitcoin className="text-orange-500" /> Crypto Hub
                    </h2>
                    <p className="text-slate-500 mt-1">Kompleksowe zarządzanie aktywami cyfrowymi.</p>
                </div>
                <div className="flex gap-2 items-center">
                    {/* Active Connection Indicators */}
                    <div className="flex gap-1 mr-2">
                        {exchangeStatus[CryptoExchange.MEXC] && <span className="text-[10px] font-bold bg-[#2B77F9] text-white px-2 py-1 rounded flex items-center gap-1 shadow-sm"><CheckCircle2 size={10} /> MEXC</span>}
                        {exchangeStatus[CryptoExchange.BYBIT] && <span className="text-[10px] font-bold bg-[#F7A600] text-black px-2 py-1 rounded flex items-center gap-1 shadow-sm"><CheckCircle2 size={10} /> BYBIT</span>}
                    </div>

                    <button 
                        onClick={loadData}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-sm transition-all"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> {loading ? 'Pobieranie...' : 'Sync Live'}
                    </button>
                </div>
            </header>

            {/* Navigation Tabs - Enhanced */}
            <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex overflow-x-auto max-w-full">
                {[
                    { id: 'TAX', label: 'Podatki', icon: FileText },
                    { id: 'LIVE_ANALYZER', label: 'Live Blockchain', icon: Radio }, // New!
                    { id: 'DEFI', label: 'DeFi Archeology', icon: Layers }, // Renamed
                    { id: 'NFT_PARADISE', label: 'NFT Paradise', icon: Image },
                    { id: 'RISK', label: 'Risk', icon: ShieldCheck },
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-4 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
                            activeTab === tab.id 
                                ? 'bg-slate-900 text-white shadow-md' 
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                    >
                        <tab.icon size={16} /> {tab.label}
                    </button>
                ))}
            </div>

            {/* LIVE BLOCKCHAIN ANALYZER */}
            {activeTab === 'LIVE_ANALYZER' && (
                <div className="space-y-6 animate-in fade-in">
                    <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <Activity className="text-green-400" /> Live Blockchain Tax Analyzer
                                    </h3>
                                    <p className="text-slate-400 text-sm mt-1">Analiza mempoolu i bloków w czasie rzeczywistym. Natychmiastowa klasyfikacja podatkowa.</p>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-mono text-green-400 bg-green-900/20 px-3 py-1 rounded border border-green-900/50">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Connected: ETH Mainnet
                                </div>
                            </div>

                            <div className="h-64 flex flex-col justify-end space-y-2 font-mono text-xs overflow-hidden relative">
                                {/* Simulated Stream */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent z-10 pointer-events-none"></div>
                                <div className="space-y-2 opacity-80">
                                    <div className="flex gap-4 text-slate-500">
                                        <span>[BLOCK 18452001]</span>
                                        <span className="text-blue-400">Uniswap V3 Swap</span>
                                        <span className="text-slate-300">0x7a... -> 0xd8...</span>
                                        <span className="text-green-500">Tax Event: DISPOSAL</span>
                                    </div>
                                    <div className="flex gap-4 text-slate-500">
                                        <span>[BLOCK 18452001]</span>
                                        <span className="text-purple-400">Aave V3 Supply</span>
                                        <span className="text-slate-300">0xMy... -> 0x87...</span>
                                        <span className="text-slate-400">Tax Event: NON-TAXABLE</span>
                                    </div>
                                    <div className="flex gap-4 text-slate-500">
                                        <span>[MEMPOOL]</span>
                                        <span className="text-amber-400">Pending Approval</span>
                                        <span className="text-slate-300">USDT -> Spender...</span>
                                        <span className="text-slate-400">Gas: 45 Gwei</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* DEFI ARCHEOLOGY */}
            {activeTab === 'DEFI' && (
                <div className="space-y-6 animate-in fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {defiProtocols.map((proto, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">{proto.name}</h4>
                                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold uppercase">{proto.chain}</span>
                                    </div>
                                    <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600 group-hover:scale-110 transition-transform">
                                        <Layers size={24} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Balance</span>
                                        <span className="font-bold font-mono">{formatUsd(proto.userBalanceUsd)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Rewards</span>
                                        <span className="font-bold font-mono text-green-600">+{formatUsd(proto.unclaimedRewardsUsd)}</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                                    <button className="text-xs font-bold text-indigo-600 hover:underline">Pobierz historię transakcji</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAX TAB (Existing) */}
            {activeTab === 'TAX' && (
                <div className="space-y-6 animate-in fade-in">
                    {/* Tax Summary */}
                    {report && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
                                <p className="text-slate-400 font-medium text-sm">Podatek Należny (19%)</p>
                                <h3 className="text-4xl font-bold mt-2">{formatFiat(report.totalTaxDue)}</h3>
                                <p className="text-xs text-slate-500 mt-2">Rok podatkowy: {report.year}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <p className="text-xs font-bold text-slate-500 uppercase">Dochód (Spot + Futures)</p>
                                <h3 className="text-3xl font-bold text-green-600 mt-2">{formatFiat(report.spotIncomeTaxBase + report.futuresIncomeTaxBase)}</h3>
                                <div className="mt-4 flex gap-2">
                                    <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">Spot: {formatFiat(report.spotIncomeTaxBase)}</span>
                                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">Futures: {formatFiat(report.futuresIncomeTaxBase)}</span>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <p className="text-xs font-bold text-slate-500 uppercase">Koszty (Fees + Loss)</p>
                                <h3 className="text-3xl font-bold text-red-600 mt-2">{formatFiat(report.spotCost + report.futuresCost)}</h3>
                            </div>
                        </div>
                    )}

                    {/* Transaction List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-slate-900">Historia Transakcji (Live Feed)</h3>
                            <span className="text-xs text-slate-500">{transactions.length} operacji</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-3">Data</th>
                                        <th className="px-6 py-3">Giełda</th>
                                        <th className="px-6 py-3">Para</th>
                                        <th className="px-6 py-3">Typ</th>
                                        <th className="px-6 py-3 text-right">Ilość</th>
                                        <th className="px-6 py-3 text-right">Cena</th>
                                        <th className="px-6 py-3 text-right">Wartość (Fiat)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {transactions.map(tx => (
                                        <tr key={tx.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 font-mono text-xs text-slate-500">
                                                {new Date(tx.timestamp).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded text-white ${
                                                    tx.exchange === CryptoExchange.MEXC ? 'bg-[#2B77F9]' : 
                                                    tx.exchange === CryptoExchange.BYBIT ? 'bg-[#F7A600]' : 
                                                    'bg-slate-500'
                                                }`}>
                                                    {tx.exchange}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-900">{tx.pair}</td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[10px] font-bold uppercase ${
                                                    tx.type.includes('BUY') ? 'text-green-600' :
                                                    tx.type.includes('SELL') ? 'text-red-600' :
                                                    'text-indigo-600'
                                                }`}>
                                                    {tx.type.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono">{tx.amount}</td>
                                            <td className="px-6 py-4 text-right font-mono text-slate-500">{tx.price}</td>
                                            <td className="px-6 py-4 text-right font-bold font-mono">{formatFiat(tx.totalFiat)}</td>
                                        </tr>
                                    ))}
                                    {transactions.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="text-center py-8 text-slate-400">
                                                Brak transakcji. Podłącz klucze API w ustawieniach (MEXC / Bybit).
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            <Modal isOpen={ilOpen} onClose={() => setIlOpen(false)} title="Kalkulator IL">
                 <div className="space-y-4 p-4">
                     <p>Oblicz stratę nietrwałą.</p>
                     <button onClick={() => {}} className="w-full bg-indigo-600 text-white py-2 rounded">Oblicz</button>
                 </div>
            </Modal>
        </div>
    );
};
