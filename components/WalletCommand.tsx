
import React, { useState, useEffect, useMemo } from 'react';
import { ViewState } from '../types';
import { 
    RefreshCw, Send, ArrowDownLeft, Shuffle, ShieldCheck, 
    Cpu, Lock, Battery, Eye, EyeOff, Copy, QrCode, Globe, Zap, Settings, 
    Activity, ArrowRight, AlertTriangle, RotateCw, TrendingUp, TrendingDown,
    Fuel, Sliders, ChevronsRight, CheckCircle2, Gem, Image, Clock, Link, Power, MoreVertical, ExternalLink, ChevronLeft, X, Fingerprint, Download, Smartphone,
    Box, Layers, Code, Hash, FileJson, Info
} from 'lucide-react';
import { toast } from './ui/Toast';
import { safeFormatCurrency } from '../utils/formatters';
import { FinancialChart } from './ui/FinancialChart';
import { DataTable } from './ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from './ui/Modal';

// --- CONSTANTS & DATA ---
const NETWORKS = [
    { id: 'ALL', name: 'All Networks', icon: <Globe size={14} /> },
    { id: 'ETH', name: 'Ethereum', icon: <div className="w-3 h-3 rounded-full bg-indigo-600"></div> },
    { id: 'ARB', name: 'Arbitrum', icon: <div className="w-3 h-3 rounded-full bg-cyan-600"></div> },
    { id: 'SOL', name: 'Solana', icon: <div className="w-3 h-3 rounded-full bg-emerald-500"></div> },
];

const MOCK_ASSETS = [
    { symbol: 'ETH', name: 'Ethereum', balance: 4.521, price: 2350.50, change: 2.4, chain: 'Ethereum', networkId: 'ETH', value: 10626.61, icon: 'bg-indigo-600' },
    { symbol: 'BTC', name: 'Bitcoin', balance: 0.15, price: 44200.00, change: -0.5, chain: 'Bitcoin', networkId: 'BTC', value: 6630.00, icon: 'bg-orange-500' },
    { symbol: 'USDC', name: 'USD Coin', balance: 12500.00, price: 1.00, change: 0.01, chain: 'Ethereum', networkId: 'ETH', value: 12500.00, icon: 'bg-blue-500' },
    { symbol: 'SOL', name: 'Solana', balance: 145.2, price: 98.50, change: 5.2, chain: 'Solana', networkId: 'SOL', value: 14302.20, icon: 'bg-emerald-500' },
    { symbol: 'ARB', name: 'Arbitrum', balance: 5000, price: 1.20, change: -1.2, chain: 'Arbitrum', networkId: 'ARB', value: 6000.00, icon: 'bg-cyan-600' },
];

const TX_HISTORY = [
    { id: '0x3a1...e21', type: 'Send', asset: 'ETH', amount: -0.5, date: '2023-10-25 14:30', status: 'Confirmed', fee: 0.002, nonce: 42, block: 18234567, to: '0x4a...e21' },
    { id: '0x8b2...f99', type: 'Receive', asset: 'USDC', amount: 1500, date: '2023-10-24 09:15', status: 'Confirmed', fee: 0.005, nonce: 41, block: 18231000, from: '0xBinanceHot' },
    { id: '0x1c3...a33', type: 'Swap', asset: 'ETH -> SOL', amount: 1.2, date: '2023-10-23 18:45', status: 'Confirmed', fee: 0.015, nonce: 40, block: 18228000, protocol: 'Uniswap V3' },
    { id: '0x9d4...c44', type: 'Approve', asset: 'USDT', amount: 0, date: '2023-10-23 18:40', status: 'Confirmed', fee: 0.001, nonce: 39, block: 18227950, spender: '0xUniswapRouter' },
];

const DAPPS_SESSIONS = [
    { id: 'uniswap', name: 'Uniswap', url: 'app.uniswap.org', chain: 'Ethereum', icon: '🦄', active: true, allowance: 'Unlimited USDC' },
    { id: 'opensea', name: 'OpenSea', url: 'opensea.io', chain: 'Ethereum', icon: '🌊', active: true, allowance: 'All NFTs' },
    { id: 'aave', name: 'Aave', url: 'app.aave.com', chain: 'Polygon', icon: '👻', active: false, allowance: 'None' },
];

// --- SUB-COMPONENTS ---

const TxDetailModal: React.FC<{ tx: any; onClose: () => void }> = ({ tx, onClose }) => {
    if (!tx) return null;
    return (
        <Modal isOpen={!!tx} onClose={onClose} title="Szczegóły Transakcji">
            <div className="space-y-6">
                <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${tx.amount > 0 ? 'bg-green-500/10 text-green-400' : 'bg-white/10 text-white'}`}>
                            {tx.amount > 0 ? <ArrowDownLeft size={24} /> : <Send size={24} />}
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-white">{tx.type}</h4>
                            <p className="text-xs text-zinc-400">{tx.date}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className={`text-xl font-bold font-mono ${tx.amount > 0 ? 'text-green-400' : 'text-white'}`}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount} {tx.asset.split(' ')[0]}
                        </p>
                        <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30 uppercase font-bold">
                            {tx.status}
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="group">
                        <label className="text-[10px] text-zinc-500 uppercase font-bold mb-1 flex items-center gap-1"><Hash size={10} /> Transaction Hash</label>
                        <div className="flex items-center gap-2 bg-black/40 p-3 rounded-lg border border-white/5 group-hover:border-gold/30 transition-colors">
                            <code className="text-xs text-zinc-300 truncate flex-1">{tx.id}</code>
                            <button className="text-zinc-500 hover:text-white"><Copy size={14} /></button>
                            <button className="text-zinc-500 hover:text-white"><ExternalLink size={14} /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Block</label>
                            <p className="text-sm font-mono text-white bg-white/5 px-3 py-2 rounded-lg border border-white/5">{tx.block}</p>
                        </div>
                        <div>
                            <label className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Nonce</label>
                            <p className="text-sm font-mono text-white bg-white/5 px-3 py-2 rounded-lg border border-white/5">{tx.nonce}</p>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] text-zinc-500 uppercase font-bold mb-1 flex items-center gap-1"><Fuel size={10} /> Network Fee</label>
                        <div className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                            <span className="text-sm text-zinc-300">{tx.fee} ETH</span>
                            <span className="text-xs text-zinc-500">~${(tx.fee * 2350).toFixed(2)}</span>
                        </div>
                    </div>

                    {tx.protocol && (
                        <div>
                            <label className="text-[10px] text-zinc-500 uppercase font-bold mb-1 flex items-center gap-1"><Layers size={10} /> Interacted With</label>
                            <p className="text-sm text-indigo-400 font-bold bg-indigo-500/10 px-3 py-2 rounded-lg border border-indigo-500/20 flex items-center gap-2">
                                <Box size={14} /> {tx.protocol}
                            </p>
                        </div>
                    )}
                </div>

                <div className="pt-4 border-t border-white/10">
                    <h5 className="text-xs font-bold text-white mb-2 flex items-center gap-1"><Code size={12} /> Input Data</h5>
                    <div className="bg-[#050505] p-3 rounded-lg border border-white/10 font-mono text-[10px] text-zinc-500 break-all">
                        0xa9059cbb000000000000000000000000...
                    </div>
                </div>
            </div>
        </Modal>
    );
};

const HistoryView: React.FC = () => {
    const [selectedTx, setSelectedTx] = useState<any>(null);

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <header className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Clock className="text-zinc-400" /> Historia Transakcji
                </h3>
                <button className="text-xs bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                    <FileJson size={14} /> Eksportuj CSV
                </button>
            </header>

            <div className="neo-card rounded-2xl overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-white/5 text-zinc-500 text-xs uppercase font-bold border-b border-white/10">
                        <tr>
                            <th className="px-6 py-4">Typ / Hash</th>
                            <th className="px-6 py-4">Aktywo</th>
                            <th className="px-6 py-4 text-right">Kwota</th>
                            <th className="px-6 py-4 text-right">Fee</th>
                            <th className="px-6 py-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {TX_HISTORY.map((tx, i) => (
                            <tr 
                                key={i} 
                                onClick={() => setSelectedTx(tx)}
                                className="hover:bg-white/5 transition-colors group cursor-pointer"
                            >
                                <td className="px-6 py-4">
                                    <div className="font-bold text-white">{tx.type}</div>
                                    <div className="text-xs font-mono text-zinc-500 flex items-center gap-1 group-hover:text-gold transition-colors">
                                        {tx.id}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-zinc-300">{tx.asset}</td>
                                <td className={`px-6 py-4 text-right font-mono font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-white'}`}>
                                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-zinc-500 text-xs">
                                    {tx.fee}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="text-[10px] font-bold bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20 uppercase">
                                        {tx.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <TxDetailModal tx={selectedTx} onClose={() => setSelectedTx(null)} />
        </div>
    );
};

const DAppsView: React.FC = () => {
    const [dapps, setDapps] = useState(DAPPS_SESSIONS);
    const [browserUrl, setBrowserUrl] = useState<string | null>(null);

    const handleRevoke = (id: string) => {
        toast.info('Revoking...', 'Wysyłanie transakcji odwołania uprawnień.');
        setTimeout(() => {
            setDapps(prev => prev.map(d => d.id === id ? {...d, allowance: 'Revoked', active: false} : d));
            toast.success('Sukces', 'Uprawnienia zostały odwołane.');
        }, 1500);
    };

    if (browserUrl) {
        return (
            <div className="h-full flex flex-col animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => setBrowserUrl(null)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex-1 bg-[#0A0A0C] border border-white/10 rounded-full px-4 py-2 text-sm text-zinc-400 flex items-center gap-2">
                        <Lock size={12} className="text-green-500" />
                        <span className="text-white">https://{browserUrl}</span>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" title="Wallet Connected"></div>
                        <span className="text-xs font-bold text-white">Connected</span>
                    </div>
                </div>
                <div className="flex-1 bg-white rounded-2xl overflow-hidden relative">
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-black">
                        <Globe size={64} className="text-zinc-300 mb-4" />
                        <h3 className="text-xl font-bold">DApp Browser Simulation</h3>
                        <p className="text-zinc-500">Loading {browserUrl} interface...</p>
                        <button onClick={() => setBrowserUrl(null)} className="mt-6 px-6 py-2 bg-black text-white rounded-lg font-bold hover:bg-zinc-800">
                            Close Session
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <header className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Link className="text-blue-400" /> Połączone Aplikacje
                </h3>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dapps.map((dapp) => (
                    <div key={dapp.id} className="neo-card p-6 rounded-2xl flex flex-col justify-between group hover:border-white/20 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-2xl border border-white/5">
                                    {dapp.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">{dapp.name}</h4>
                                    <span className="text-[10px] text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 mt-1 inline-block">{dapp.chain}</span>
                                </div>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${dapp.active ? 'bg-green-500 animate-pulse' : 'bg-zinc-700'}`}></div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-xs">
                                <span className="text-zinc-500">URL</span>
                                <span className="text-zinc-300">{dapp.url}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-zinc-500">Allowance</span>
                                <span className={`font-bold ${dapp.allowance === 'Revoked' ? 'text-zinc-500' : 'text-amber-400'}`}>{dapp.allowance}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button 
                                onClick={() => setBrowserUrl(dapp.url)}
                                className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-white border border-white/10 transition-colors"
                            >
                                Otwórz
                            </button>
                            <button 
                                onClick={() => handleRevoke(dapp.id)}
                                disabled={!dapp.active}
                                className="flex-1 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs font-bold border border-rose-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {dapp.active ? 'Odłącz' : 'Odłączono'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AssetDetailView: React.FC<{ asset: any; onBack: () => void; totalPortfolioValue: number }> = ({ asset, onBack, totalPortfolioValue }) => {
    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white">
                    <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm ${asset.icon}`}>
                        {asset.symbol[0]}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">{asset.name}</h3>
                        <p className="text-xs text-zinc-500 font-mono">{asset.symbol} • {asset.chain}</p>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="neo-card p-6 rounded-2xl">
                    <p className="text-zinc-500 text-xs font-bold uppercase">Balance</p>
                    <h3 className="text-3xl font-bold text-white mt-2 font-mono">{asset.balance} {asset.symbol}</h3>
                    <p className="text-sm text-zinc-400 mt-1">≈ {safeFormatCurrency(asset.value, 'USD')}</p>
                </div>
                <div className="neo-card p-6 rounded-2xl">
                    <p className="text-zinc-500 text-xs font-bold uppercase">Price</p>
                    <h3 className="text-3xl font-bold text-white mt-2 font-mono">{safeFormatCurrency(asset.price, 'USD')}</h3>
                    <div className={`flex items-center gap-1 text-sm mt-1 font-bold ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {asset.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        {asset.change}% (24h)
                    </div>
                </div>
            </div>

            <div className="neo-card p-6 rounded-2xl">
                <h4 className="text-white font-bold mb-4">Allocation</h4>
                <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden mb-2">
                    <div className="bg-gold h-full" style={{ width: `${(asset.value / totalPortfolioValue) * 100}%` }}></div>
                </div>
                <p className="text-xs text-zinc-500 text-right">{((asset.value / totalPortfolioValue) * 100).toFixed(2)}% of Portfolio</p>
            </div>
        </div>
    );
};

const SendView: React.FC = () => {
    return (
        <div className="max-w-xl mx-auto space-y-6 animate-in zoom-in-95 duration-300">
            <div className="neo-card p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Send className="text-gold" /> Send Crypto
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Recipient Address</label>
                        <div className="relative">
                            <input type="text" placeholder="0x..." className="neo-input w-full pl-4 pr-10 py-3 rounded-xl text-white font-mono text-sm" />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"><QrCode size={18} /></button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Asset</label>
                            <select className="neo-input w-full px-4 py-3 rounded-xl text-white font-bold">
                                <option>ETH</option>
                                <option>BTC</option>
                                <option>USDC</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Amount</label>
                            <input type="number" placeholder="0.00" className="neo-input w-full px-4 py-3 rounded-xl text-white font-bold text-right" />
                        </div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center text-sm">
                        <span className="text-zinc-400">Network Fee (Est.)</span>
                        <span className="text-white font-mono">0.0021 ETH</span>
                    </div>
                    <button onClick={() => toast.info('Action', 'Sign on device...')} className="w-full bg-gold text-black py-4 rounded-xl font-bold text-lg hover:bg-[#FCD34D] transition-colors mt-4 flex items-center justify-center gap-2">
                        <Fingerprint size={20} /> Sign & Send
                    </button>
                </div>
            </div>
        </div>
    );
};

const ReceiveView: React.FC = () => {
    return (
        <div className="max-w-md mx-auto text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="neo-card p-8 rounded-2xl flex flex-col items-center">
                <h3 className="text-2xl font-bold text-white mb-2">Receive Assets</h3>
                <p className="text-zinc-500 text-sm mb-8">Scan QR code or copy address</p>
                
                <div className="bg-white p-4 rounded-2xl mb-8">
                    <QrCode size={200} className="text-black" />
                </div>
                
                <div className="w-full bg-black/40 p-4 rounded-xl border border-white/10 flex items-center gap-3 mb-6">
                    <code className="text-gold font-mono text-xs truncate flex-1">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</code>
                    <button onClick={() => toast.success('Copied', 'Address copied to clipboard')} className="text-zinc-400 hover:text-white"><Copy size={16} /></button>
                </div>

                <div className="text-xs text-zinc-500 bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg flex items-center gap-2">
                    <AlertTriangle size={14} className="text-amber-500" />
                    Send only ETH/ERC-20 to this address.
                </div>
            </div>
        </div>
    );
};

const SwapView: React.FC = () => {
    return (
        <div className="max-w-md mx-auto space-y-6 animate-in zoom-in-95 duration-300">
            <div className="neo-card p-6 rounded-2xl border border-gold/20">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Swap</h3>
                    <Settings size={18} className="text-zinc-500 hover:text-white cursor-pointer" />
                </div>

                <div className="space-y-2">
                    <div className="bg-[#0A0A0C] p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex justify-between text-xs text-zinc-500 mb-2">
                            <span>You Pay</span>
                            <span>Balance: 4.52 ETH</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <input type="number" placeholder="0" className="bg-transparent text-3xl font-bold text-white outline-none w-1/2" />
                            <button className="bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2 text-white font-bold hover:bg-white/20">
                                <div className="w-5 h-5 bg-indigo-600 rounded-full"></div> ETH <ChevronLeft size={16} className="-rotate-90" />
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center -my-3 relative z-10">
                        <button className="bg-[#1A1A1E] border border-white/10 p-2 rounded-lg text-zinc-400 hover:text-white hover:border-gold/50 transition-all">
                            <ArrowDownLeft size={18} />
                        </button>
                    </div>

                    <div className="bg-[#0A0A0C] p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex justify-between text-xs text-zinc-500 mb-2">
                            <span>You Receive</span>
                            <span>Balance: 0 USDC</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <input type="number" placeholder="0" className="bg-transparent text-3xl font-bold text-white outline-none w-1/2" readOnly />
                            <button className="bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2 text-white font-bold hover:bg-white/20">
                                <div className="w-5 h-5 bg-blue-500 rounded-full"></div> USDC <ChevronLeft size={16} className="-rotate-90" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-6 space-y-3">
                    <div className="flex justify-between text-xs text-zinc-500">
                        <span>Rate</span>
                        <span>1 ETH = 2,350.50 USDC</span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-500">
                        <span>Network Fee</span>
                        <span className="text-white">$4.20</span>
                    </div>
                </div>

                <button className="w-full bg-gold text-black py-4 rounded-xl font-bold text-lg hover:bg-[#FCD34D] transition-colors mt-6 shadow-lg shadow-gold/20">
                    Review Swap
                </button>
            </div>
        </div>
    );
};

const BridgeView: React.FC = () => {
    return (
        <div className="max-w-xl mx-auto space-y-6 animate-in zoom-in-95 duration-300">
            <div className="neo-card p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Globe className="text-cyan-400" /> Cross-Chain Bridge
                </h3>
                
                <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center mb-8">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                        <p className="text-xs text-zinc-500 uppercase mb-2">From</p>
                        <div className="flex items-center justify-center gap-2 text-white font-bold">
                            <div className="w-6 h-6 bg-indigo-600 rounded-full"></div> Ethereum
                        </div>
                    </div>
                    <div className="text-zinc-500"><ChevronsRight size={24} /></div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                        <p className="text-xs text-zinc-500 uppercase mb-2">To</p>
                        <div className="flex items-center justify-center gap-2 text-white font-bold">
                            <div className="w-6 h-6 bg-cyan-600 rounded-full"></div> Arbitrum
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Asset & Amount</label>
                    <div className="relative">
                        <input type="number" placeholder="0.00" className="neo-input w-full pl-4 pr-24 py-4 rounded-xl text-xl font-bold text-white" />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 px-3 py-1.5 rounded-lg text-white font-bold text-sm flex items-center gap-2">
                            ETH <span className="text-xs text-zinc-400">Max</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-sm text-blue-300 flex items-start gap-3">
                    <Info size={18} className="shrink-0 mt-0.5" />
                    <p>Bridging usually takes 10-15 minutes. You will receive funds on the destination chain shortly after transaction confirmation.</p>
                </div>

                <button className="w-full bg-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-cyan-500 transition-colors mt-6 shadow-lg shadow-cyan-900/20">
                    Bridge Assets
                </button>
            </div>
        </div>
    );
};

const StakingView: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <header className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Gem className="text-purple-400" /> Staking & Earn
                </h3>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { asset: 'ETH', name: 'Ethereum', apy: '3.8%', tvl: '$24B', liquid: true },
                    { asset: 'SOL', name: 'Solana', apy: '7.2%', tvl: '$2.1B', liquid: false },
                    { asset: 'DOT', name: 'Polkadot', apy: '11.5%', tvl: '$800M', liquid: false },
                ].map((item, i) => (
                    <div key={i} className="neo-card p-6 rounded-2xl hover:border-purple-500/30 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white border border-white/10">
                                    {item.asset[0]}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">{item.name}</h4>
                                    <p className="text-xs text-zinc-500">{item.asset}</p>
                                </div>
                            </div>
                            <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded text-xs font-bold border border-purple-500/20">{item.apy} APY</span>
                        </div>
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">TVL</span>
                                <span className="text-zinc-300">{item.tvl}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">Type</span>
                                <span className="text-zinc-300">{item.liquid ? 'Liquid Staking' : 'Native Staking'}</span>
                            </div>
                        </div>
                        <button className="w-full bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg font-bold text-sm border border-white/10 transition-colors">
                            Stake {item.asset}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const NftGalleryView: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <header className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Image className="text-pink-400" /> NFT Gallery
                </h3>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="neo-card rounded-2xl overflow-hidden group hover:border-pink-500/30 transition-all">
                        <div className="aspect-square bg-white/5 relative">
                            {/* Placeholder for NFT Image */}
                            <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                                <Image size={48} />
                            </div>
                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] text-white font-bold border border-white/10">ETH</div>
                        </div>
                        <div className="p-4">
                            <h4 className="font-bold text-white text-sm mb-1">Bored Ape #{1000 + i}</h4>
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-zinc-500">BAYC</p>
                                <p className="text-xs font-bold text-white">24.5 ETH</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DeviceView: React.FC = () => {
    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
            <header className="mb-8 text-center">
                <h3 className="text-3xl font-bold text-white mb-2">Nuffi Key Settings</h3>
                <p className="text-zinc-400">Manage your hardware wallet security and preferences.</p>
            </header>

            <div className="neo-card p-6 rounded-2xl">
                <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-green-500" /> Security
                </h4>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                        <div>
                            <p className="text-white font-bold text-sm">PIN Protection</p>
                            <p className="text-xs text-zinc-500">Require PIN for every transaction</p>
                        </div>
                        <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 bottom-1 w-4 bg-white rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                        <div>
                            <p className="text-white font-bold text-sm">Auto-Lock Timer</p>
                            <p className="text-xs text-zinc-500">Lock device after inactivity</p>
                        </div>
                        <select className="bg-black/40 text-white text-sm border border-white/10 rounded-lg px-3 py-1 outline-none">
                            <option>5 minutes</option>
                            <option>15 minutes</option>
                            <option>Never</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="neo-card p-6 rounded-2xl">
                <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                    <Smartphone size={18} className="text-blue-400" /> Firmware
                </h4>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white font-bold text-sm">Current Version</p>
                        <p className="text-xs text-zinc-500 font-mono">v2.4.1 (Stable)</p>
                    </div>
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-lg transition-colors">
                        Check for Updates
                    </button>
                </div>
            </div>

            <div className="neo-card p-6 rounded-2xl border-rose-500/20">
                <h4 className="text-rose-400 font-bold mb-6 flex items-center gap-2">
                    <AlertTriangle size={18} /> Danger Zone
                </h4>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white font-bold text-sm">Factory Reset</p>
                        <p className="text-xs text-zinc-500">Wipe all data from device. Irreversible.</p>
                    </div>
                    <button className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold rounded-lg transition-colors">
                        Reset Device
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN DASHBOARD VIEW (With Network Filter) ---

interface DashboardViewProps {
    totalBalance: number;
    showBalance: boolean;
    setShowBalance: (show: boolean) => void;
    networkFilter: string;
    setNetworkFilter: (filter: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ totalBalance, showBalance, setShowBalance, networkFilter, setNetworkFilter }) => {
    const [selectedAsset, setSelectedAsset] = useState<any | null>(null);

    // Filter Assets
    const filteredAssets = networkFilter === 'ALL' 
        ? MOCK_ASSETS 
        : MOCK_ASSETS.filter(a => a.networkId === networkFilter);

    // Recalculate Balance for filtered
    const filteredBalance = filteredAssets.reduce((acc, a) => acc + a.value, 0);

    // Generate static chart data
    const chartData = useMemo(() => {
        const now = Math.floor(Date.now() / 1000);
        let val = totalBalance;
        return Array.from({length: 50}, (_, i) => {
            val = val + (Math.random() * 500 - 200);
            return { time: now - (50 - i) * 3600, value: val };
        });
    }, [totalBalance]);

    if (selectedAsset) {
        return <AssetDetailView asset={selectedAsset} onBack={() => setSelectedAsset(null)} totalPortfolioValue={totalBalance} />;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {/* Device Status */}
            <div className="space-y-6">
                <div className="neo-card p-6 rounded-2xl bg-gradient-to-b from-[#0A0A0C] to-black border-gold/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                        <Cpu size={120} className="text-gold" />
                    </div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-20 h-32 bg-[#111] rounded-xl border-2 border-[#333] shadow-2xl flex flex-col items-center justify-center mb-4 relative">
                            <ShieldCheck size={24} className="text-gold mb-1" />
                            <div className="text-[6px] text-zinc-500 font-mono">SECURE ENCLAVE</div>
                            <div className="absolute bottom-2 w-3 h-3 rounded-full bg-[#222] border border-[#333]"></div>
                        </div>
                        <h3 className="text-white font-bold">Nuffi Key Pro</h3>
                        <p className="text-xs text-green-500 mb-4 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Connected via USB-C</p>
                        
                        <div className="grid grid-cols-2 gap-2 w-full">
                            <div className="bg-white/5 p-2 rounded border border-white/5">
                                <div className="text-[10px] text-zinc-500 uppercase font-bold">Bateria</div>
                                <div className="text-green-400 font-mono font-bold flex items-center justify-center gap-1"><Battery size={10} /> 92%</div>
                            </div>
                            <div className="bg-white/5 p-2 rounded border border-white/5">
                                <div className="text-[10px] text-zinc-500 uppercase font-bold">Firmware</div>
                                <div className="text-white font-mono font-bold">v2.4.1</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="neo-card p-6 rounded-2xl">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase mb-4">Szybkie Akcje</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 flex flex-col items-center gap-2 transition-colors group">
                            <Lock size={20} className="text-gold group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold text-white">Blokada</span>
                        </button>
                        <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 flex flex-col items-center gap-2 transition-colors group">
                            <RotateCw size={20} className="text-blue-400 group-hover:rotate-180 transition-transform duration-500" />
                            <span className="text-xs font-bold text-white">Sync</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Assets & Chart */}
            <div className="lg:col-span-2 space-y-6">
                <div className="neo-card p-8 rounded-2xl relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">
                                {networkFilter === 'ALL' ? 'Całkowity Balans' : `Balans (${networkFilter})`}
                            </p>
                            <div className="flex items-center gap-4">
                                <h2 className="text-5xl font-bold text-white font-mono tracking-tighter">
                                    {showBalance ? safeFormatCurrency(filteredBalance, 'USD') : '••••••••'}
                                </h2>
                                <button onClick={() => setShowBalance(!showBalance)} className="text-zinc-500 hover:text-white transition-colors">
                                    {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>
                            </div>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-lg text-green-400 font-bold text-sm flex items-center gap-2">
                            <TrendingUp size={16} /> +4.2% (24h)
                        </div>
                    </div>
                    <div className="h-64 w-full">
                        <FinancialChart 
                            data={chartData} 
                            height={250} 
                            colors={{ lineColor: '#D4AF37', topColor: 'rgba(212, 175, 55, 0.2)', bottomColor: 'rgba(212, 175, 55, 0)' }} 
                        />
                    </div>
                </div>

                <div className="neo-card rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                        <h3 className="font-bold text-white text-sm">Twoje Aktywa</h3>
                        <div className="flex gap-2">
                            <button className="p-1.5 hover:bg-white/10 rounded text-zinc-400 hover:text-white"><RefreshCw size={14} /></button>
                            <button className="p-1.5 hover:bg-white/10 rounded text-zinc-400 hover:text-white"><Settings size={14} /></button>
                        </div>
                    </div>
                    <div className="divide-y divide-white/5">
                        {filteredAssets.length === 0 ? (
                            <div className="p-8 text-center text-zinc-500">Brak aktywów w tej sieci.</div>
                        ) : (
                            filteredAssets.map((asset, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => setSelectedAsset(asset)}
                                    className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm ${asset.icon}`}>
                                            {asset.symbol[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm group-hover:text-gold transition-colors">{asset.name}</h4>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-zinc-500 bg-black/40 px-1.5 py-0.5 rounded border border-white/5 uppercase">{asset.chain}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-white font-mono text-sm">
                                            {showBalance ? asset.balance.toLocaleString() : '••••'} {asset.symbol}
                                        </p>
                                        <p className="text-xs text-zinc-500">
                                            {showBalance ? safeFormatCurrency(asset.value, 'USD') : '••••'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN WALLET COMMAND COMPONENT ---

export interface WalletCommandProps {
    view: ViewState;
}

export const WalletCommand: React.FC<WalletCommandProps> = ({ view }) => {
    // Hardware State
    const [connected, setConnected] = useState(false);
    const [syncing, setSyncing] = useState(false);
    
    // Global UI State
    const [showBalance, setShowBalance] = useState(true);
    const [networkFilter, setNetworkFilter] = useState('ALL');
    const totalBalance = MOCK_ASSETS.reduce((acc, a) => acc + a.value, 0);

    const handleManualConnect = () => {
        setSyncing(true);
        setTimeout(() => {
            setConnected(true);
            setSyncing(false);
            toast.success('Połączono', 'Urządzenie sparowane.');
        }, 1000);
    };

    // Auto-Connect Effect
    useEffect(() => {
        if (!connected) {
            setSyncing(true);
            const timer = setTimeout(() => {
                setConnected(true);
                setSyncing(false);
                toast.success('Nuffi Key Active', 'Hardware wallet connected securely via USB-C.');
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [connected]);

    // --- MAIN RENDER SWITCH ---
    const renderView = () => {
        switch (view) {
            case ViewState.WALLET_DASHBOARD:
                return <DashboardView totalBalance={totalBalance} showBalance={showBalance} setShowBalance={setShowBalance} networkFilter={networkFilter} setNetworkFilter={setNetworkFilter} />;
            case ViewState.WALLET_SEND:
                return <SendView />;
            case ViewState.WALLET_RECEIVE:
                return <ReceiveView />;
            case ViewState.WALLET_SWAP:
                return <SwapView />;
            case ViewState.WALLET_BRIDGE:
                return <BridgeView />;
            case ViewState.WALLET_STAKING:
                return <StakingView />;
            case ViewState.WALLET_NFTS:
                return <NftGalleryView />;
            case ViewState.WALLET_HISTORY:
                return <HistoryView />;
            case ViewState.WALLET_DAPPS:
                return <DAppsView />;
            case ViewState.WALLET_DEVICE:
                return <DeviceView />;
            default:
                // Fallback for any unmatched Wallet view to dashboard
                console.warn("WalletCommand received unknown view, defaulting to dashboard:", view);
                return <DashboardView totalBalance={totalBalance} showBalance={showBalance} setShowBalance={setShowBalance} networkFilter={networkFilter} setNetworkFilter={setNetworkFilter} />;
        }
    };

    return (
        <div className="h-full flex flex-col gap-6">
            {/* Header / Status Bar */}
            <div className="flex justify-between items-center bg-[#0A0A0C] border border-white/5 p-4 rounded-xl shrink-0">
                <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'} animate-pulse`}></div>
                    <div>
                        <h2 className="text-white font-bold text-sm">Nuffi Key Pro</h2>
                        <p className="text-xs text-zinc-500 font-mono">{connected ? 'Connected via USB-C' : 'Device Disconnected'}</p>
                    </div>
                </div>

                {/* Network Selector - Only show on Dashboard */}
                {view === ViewState.WALLET_DASHBOARD && (
                    <div className="flex bg-black/40 p-1 rounded-lg border border-white/10 gap-1">
                        {NETWORKS.map(net => (
                            <button
                                key={net.id}
                                onClick={() => setNetworkFilter(net.id)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${networkFilter === net.id ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                {net.icon}
                                <span className="hidden md:inline">{net.name}</span>
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex gap-3">
                    {!connected && (
                        <button 
                            onClick={handleManualConnect}
                            disabled={syncing}
                            className="bg-white/5 text-white px-4 py-2 rounded-lg font-bold hover:bg-white/10 flex items-center gap-2 transition-all border border-white/10 text-xs"
                        >
                            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
                            {syncing ? 'Syncing...' : 'Connect'}
                        </button>
                    )}
                    <button className="p-2 bg-white/5 text-zinc-400 hover:text-white rounded-lg border border-white/10">
                        <Settings size={16} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                {renderView()}
            </div>
        </div>
    );
};
