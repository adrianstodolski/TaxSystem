
import React, { useState, useEffect, useMemo } from 'react';
import { ViewState } from '../types';
import { 
    RefreshCw, Send, ArrowDownLeft, Shuffle, ShieldCheck, 
    Cpu, Lock, Battery, Eye, EyeOff, Copy, QrCode, Globe, Zap, Settings, 
    Activity, ArrowRight, AlertTriangle, RotateCw, TrendingUp,
    Fuel, Sliders, ChevronsRight, CheckCircle2
} from 'lucide-react';
import { toast } from './ui/Toast';
import { safeFormatCurrency } from '../utils/formatters';
import { FinancialChart } from './ui/FinancialChart';

// --- CONSTANTS & DATA ---
const MOCK_ASSETS = [
    { symbol: 'ETH', name: 'Ethereum', balance: 4.521, price: 2350.50, change: 2.4, chain: 'Ethereum', value: 10626.61, icon: 'bg-indigo-600' },
    { symbol: 'BTC', name: 'Bitcoin', balance: 0.15, price: 44200.00, change: -0.5, chain: 'Bitcoin', value: 6630.00, icon: 'bg-orange-500' },
    { symbol: 'USDC', name: 'USD Coin', balance: 12500.00, price: 1.00, change: 0.01, chain: 'Polygon', value: 12500.00, icon: 'bg-blue-500' },
    { symbol: 'SOL', name: 'Solana', balance: 145.2, price: 98.50, change: 5.2, chain: 'Solana', value: 14302.20, icon: 'bg-emerald-500' },
    { symbol: 'ARB', name: 'Arbitrum', balance: 5000, price: 1.20, change: -1.2, chain: 'Arbitrum', value: 6000.00, icon: 'bg-cyan-600' },
];

const RECENT_CONTACTS = [
    { name: 'Binance Hot', addr: '0x4a...e21' },
    { name: 'Metamask Laptop', addr: '0x8b...f99' },
    { name: 'Ledger Cold', addr: '0x1c...a33' },
];

// --- SUB-COMPONENTS ---

interface DashboardViewProps {
    totalBalance: number;
    showBalance: boolean;
    setShowBalance: (show: boolean) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ totalBalance, showBalance, setShowBalance }) => {
    // Generate static chart data once
    const chartData = useMemo(() => {
        const now = Math.floor(Date.now() / 1000);
        let val = totalBalance;
        return Array.from({length: 50}, (_, i) => {
            val = val + (Math.random() * 500 - 200);
            return { time: now - (50 - i) * 3600, value: val };
        });
    }, [totalBalance]);

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
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Całkowity Balans</p>
                            <div className="flex items-center gap-4">
                                <h2 className="text-5xl font-bold text-white font-mono tracking-tighter">
                                    {showBalance ? safeFormatCurrency(totalBalance, 'USD') : '••••••••'}
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
                        {MOCK_ASSETS.map((asset, i) => (
                            <div key={i} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm ${asset.icon}`}>
                                        {asset.symbol[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{asset.name}</h4>
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
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SendView: React.FC = () => {
    const [amount, setAmount] = useState('');
    const [asset, setAsset] = useState('ETH');
    const [address, setAddress] = useState('');
    const [gas, setGas] = useState('MARKET');

    return (
        <div className="max-w-2xl mx-auto neo-card p-8 rounded-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-gold/10 rounded-lg text-gold"><Send size={24} /></div>
                Wyślij Kryptowaluty
            </h3>

            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Aktywo</label>
                    <div className="grid grid-cols-4 gap-3">
                        {MOCK_ASSETS.slice(0, 4).map(a => (
                            <button 
                                key={a.symbol}
                                onClick={() => setAsset(a.symbol)}
                                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${asset === a.symbol ? 'bg-gold/10 border-gold' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                            >
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white ${a.icon}`}>{a.symbol[0]}</div>
                                <span className="text-xs font-bold text-white">{a.symbol}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Adres Odbiorcy</label>
                    <div className="relative group">
                        <input 
                            type="text" 
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            placeholder="0x..." 
                            className="neo-input w-full pl-4 pr-12 py-3 rounded-xl text-sm font-mono text-white placeholder-zinc-600 focus:border-gold/50 outline-none transition-all"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">
                            <QrCode size={18} />
                        </button>
                    </div>
                    {/* Recent Contacts */}
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                        {RECENT_CONTACTS.map((c, i) => (
                            <button key={i} onClick={() => setAddress(c.addr)} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 transition-colors whitespace-nowrap">
                                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500"></div>
                                <div className="text-left">
                                    <p className="text-[10px] font-bold text-white leading-none">{c.name}</p>
                                    <p className="text-[8px] text-zinc-500 font-mono leading-none">{c.addr}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Kwota</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            placeholder="0.00" 
                            className="neo-input w-full pl-4 pr-16 py-3 rounded-xl text-2xl font-bold text-white placeholder-zinc-600 focus:border-gold/50 outline-none"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <button onClick={() => setAmount('1.5')} className="text-[10px] bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition-colors uppercase font-bold text-gold">Max</button>
                            <span className="font-bold text-zinc-400 text-sm">{asset}</span>
                        </div>
                    </div>
                    <p className="text-xs text-zinc-500 mt-2 text-right">Dostępne: {MOCK_ASSETS.find(a => a.symbol === asset)?.balance} {asset}</p>
                </div>

                <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-zinc-400 text-sm flex items-center gap-2"><Fuel size={16} /> Opłata Sieciowa (Gas)</span>
                        <span className="text-white font-bold text-sm">~ $1.45</span>
                    </div>
                    <div className="flex bg-white/5 p-1 rounded-lg">
                        {['SLOW', 'MARKET', 'FAST'].map(speed => (
                            <button
                                key={speed}
                                onClick={() => setGas(speed)}
                                className={`flex-1 py-1.5 rounded-md text-[10px] font-bold transition-all ${gas === speed ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                {speed}
                            </button>
                        ))}
                    </div>
                </div>

                <button className="w-full bg-gold text-black py-4 rounded-xl font-bold text-lg hover:bg-[#FCD34D] transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_-5px_rgba(212,175,55,0.4)] group">
                    <ShieldCheck size={20} className="group-hover:scale-110 transition-transform" /> Podpisz na urządzeniu
                </button>
            </div>
        </div>
    );
};

const SwapView: React.FC = () => {
    const [fromAmount, setFromAmount] = useState('');
    
    return (
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
            <div className="neo-card p-8 rounded-2xl relative overflow-hidden bg-[#0A0A0C]">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Shuffle className="text-gold" /> Nuffi DEX Aggregator
                </h3>

                <div className="space-y-2 relative">
                    {/* FROM */}
                    <div className="bg-black/40 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex justify-between mb-2">
                            <span className="text-xs text-zinc-500 font-bold uppercase">Sprzedaję</span>
                            <span className="text-xs text-zinc-500">Saldo: 4.52 ETH</span>
                        </div>
                        <div className="flex gap-4">
                            <input 
                                type="number" 
                                value={fromAmount} 
                                onChange={e => setFromAmount(e.target.value)}
                                placeholder="0.0" 
                                className="bg-transparent text-3xl font-bold text-white outline-none w-full placeholder-zinc-700" 
                            />
                            <button className="bg-white/10 px-3 py-1 rounded-xl flex items-center gap-2 hover:bg-white/20 transition-colors border border-white/5">
                                <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-[10px]">E</div>
                                <span className="font-bold text-white">ETH</span>
                            </button>
                        </div>
                        <p className="text-xs text-zinc-500 mt-2">≈ $ {safeFormatCurrency(Number(fromAmount) * 2350, '')}</p>
                    </div>

                    {/* Switcher */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <button className="bg-[#0A0A0C] border border-white/10 p-2 rounded-lg text-gold hover:text-white hover:bg-white/10 transition-all shadow-xl">
                            <ArrowDownLeft size={20} />
                        </button>
                    </div>

                    {/* TO */}
                    <div className="bg-black/40 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex justify-between mb-2">
                            <span className="text-xs text-zinc-500 font-bold uppercase">Kupuję</span>
                        </div>
                        <div className="flex gap-4">
                            <input 
                                type="number" 
                                value={fromAmount ? (Number(fromAmount) * 2350).toFixed(2) : ''} 
                                readOnly
                                placeholder="0.0" 
                                className="bg-transparent text-3xl font-bold text-emerald-400 outline-none w-full placeholder-zinc-700" 
                            />
                            <button className="bg-white/10 px-3 py-1 rounded-xl flex items-center gap-2 hover:bg-white/20 transition-colors border border-white/5">
                                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center font-bold text-[10px]">$</div>
                                <span className="font-bold text-white">USDC</span>
                            </button>
                        </div>
                        <p className="text-xs text-zinc-500 mt-2">Rate: 1 ETH = 2,350 USDC</p>
                    </div>
                </div>

                <div className="mt-6 space-y-3 p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-400 flex items-center gap-1"><Sliders size={14}/> Slippage</span>
                        <span className="text-white font-bold">0.5%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Route</span>
                        <span className="text-white font-mono text-xs flex items-center gap-1">Uniswap V3 <ArrowRight size={10}/> Curve</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Gas Cost</span>
                        <span className="text-white font-mono text-xs">$4.50</span>
                    </div>
                </div>

                <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-900/50 transition-all mt-6">
                    Swapuj
                </button>
            </div>

            <div className="flex flex-col gap-6">
                <div className="neo-card p-6 rounded-2xl flex-1 bg-[#0A0A0C]">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-lg">ETH / USDC</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-2 py-1 rounded bg-white/10 text-xs text-white">1H</button>
                            <button className="px-2 py-1 rounded bg-transparent text-xs text-zinc-500 hover:text-white">1D</button>
                        </div>
                    </div>
                    {/* Placeholder for TradingView Chart */}
                    <div className="h-64 w-full bg-black/40 rounded-xl border border-white/5 flex items-center justify-center text-zinc-600 text-xs flex-col gap-2">
                        <Activity size={32} className="text-zinc-700" />
                        <span>TradingView Chart Module Loading...</span>
                    </div>
                </div>
                
                <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5 flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-green-400 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-green-400 text-sm">Best Rate Found</h4>
                        <p className="text-xs text-green-300/70 mt-1">
                            Nuffi routed via 3 DEXs to save you $12.40 on this trade compared to Uniswap direct.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BridgeView: React.FC = () => (
    <div className="max-w-3xl mx-auto neo-card p-8 rounded-2xl animate-in fade-in duration-300">
        <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
                <Globe size={32} className="text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white">Nuffi Interchain Bridge</h3>
            <p className="text-zinc-400 mt-2">Bezpieczny transfer aktywów między łańcuchami (LayerZero Powered).</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Source */}
            <div className="bg-[#0A0A0C] border border-white/10 p-6 rounded-xl relative group hover:border-white/20 transition-all">
                <p className="text-xs font-bold text-zinc-500 uppercase mb-4">Z sieci (Source)</p>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">E</div>
                    <span className="text-xl font-bold text-white">Ethereum</span>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Max:</span>
                        <span className="text-white">4.52 ETH</span>
                    </div>
                    <input 
                        type="number" 
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-gold/50"
                        placeholder="0.00"
                    />
                </div>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center justify-center">
                <div className="p-3 rounded-full bg-white/5 border border-white/10 text-gold animate-pulse">
                    <ChevronsRight size={24} />
                </div>
                <span className="text-[10px] text-zinc-500 mt-2 uppercase font-bold tracking-wider">~15 min</span>
            </div>

            {/* Target */}
            <div className="bg-[#0A0A0C] border border-white/10 p-6 rounded-xl relative group hover:border-white/20 transition-all">
                <p className="text-xs font-bold text-zinc-500 uppercase mb-4">Do sieci (Target)</p>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">A</div>
                    <span className="text-xl font-bold text-white">Arbitrum</span>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Otrzymasz:</span>
                    </div>
                    <div className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-emerald-400 font-bold">
                        0.00 ETH
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-8 p-4 bg-indigo-900/20 border border-indigo-500/30 rounded-xl flex justify-between items-center">
            <div className="flex gap-4">
                <div className="text-center">
                    <p className="text-[10px] text-zinc-400 uppercase font-bold">Est. Fee</p>
                    <p className="text-white font-bold text-sm">$4.20</p>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div className="text-center">
                    <p className="text-[10px] text-zinc-400 uppercase font-bold">Protocol</p>
                    <p className="text-white font-bold text-sm">Stargate V2</p>
                </div>
            </div>
            <button className="bg-gold text-black px-8 py-3 rounded-xl font-bold hover:bg-[#FCD34D] shadow-lg shadow-gold/20 transition-all">
                Bridge Funds
            </button>
        </div>
    </div>
);

const DeviceView: React.FC = () => (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
        <h3 className="text-2xl font-bold text-white mb-4">Ustawienia Urządzenia (Nuffi Key)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="neo-card p-6 rounded-2xl">
                <h4 className="font-bold text-white mb-4 flex items-center gap-2"><Cpu size={18} /> System Info</h4>
                <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-zinc-400">Model</span>
                        <span className="text-white">Nuffi Key Pro (Titanium)</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-zinc-400">Serial Number</span>
                        <span className="text-white font-mono">NK-8821-XAE</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-zinc-400">Firmware</span>
                        <div className="flex items-center gap-2">
                            <span className="text-white">v2.4.1</span>
                            <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30">LATEST</span>
                        </div>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-zinc-400">Secure Element</span>
                        <span className="text-white flex items-center gap-1"><Lock size={12} className="text-gold" /> Locked & Encrypted</span>
                    </div>
                </div>
            </div>

            <div className="neo-card p-6 rounded-2xl border-l-4 border-l-rose-500">
                <h4 className="font-bold text-white mb-4 flex items-center gap-2"><AlertTriangle size={18} className="text-rose-500" /> Panic Zone</h4>
                <p className="text-sm text-zinc-400 mb-6">
                    Użyj tych opcji tylko w przypadku zagrożenia bezpieczeństwa lub utraty urządzenia.
                </p>
                
                <div className="space-y-3">
                    <button className="w-full py-3 bg-rose-600/10 border border-rose-600/30 text-rose-500 font-bold rounded-xl hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2">
                        <Zap size={18} /> Emergency Lockdown (Freeze All)
                    </button>
                    <button className="w-full py-3 bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold rounded-xl hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2">
                        <RefreshCw size={18} /> Factory Reset (Wipe Data)
                    </button>
                </div>
            </div>
        </div>
    </div>
);

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
                return <DashboardView totalBalance={totalBalance} showBalance={showBalance} setShowBalance={setShowBalance} />;
            case ViewState.WALLET_SEND:
                return <SendView />;
            case ViewState.WALLET_RECEIVE:
                return (
                    <div className="h-full flex items-center justify-center animate-in zoom-in-95 duration-300">
                        <div className="neo-card p-12 rounded-3xl text-center max-w-lg bg-[#0A0A0C]">
                            <QrCode size={180} className="text-white mx-auto mb-8 bg-black p-4 rounded-xl border border-white/10" />
                            <h3 className="text-2xl font-bold text-white mb-2">Odbierz Aktywa</h3>
                            <p className="text-zinc-400 mb-6 text-sm">Zeskanuj kod lub skopiuj adres. Obsługuje tylko sieci EVM.</p>
                            <div className="bg-black/40 p-4 rounded-xl border border-white/10 flex items-center justify-between gap-4 font-mono text-sm text-zinc-300">
                                <span className="truncate">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</span>
                                <button className="hover:text-white" onClick={() => { navigator.clipboard.writeText("0x71C7656EC7ab88b098defB751B7401B5f6d8976F"); toast.success("Skopiowano", "Adres w schowku"); }}><Copy size={16} /></button>
                            </div>
                        </div>
                    </div>
                );
            case ViewState.WALLET_SWAP:
                return <SwapView />;
            case ViewState.WALLET_BRIDGE:
                return <BridgeView />;
            case ViewState.WALLET_DEVICE:
                return <DeviceView />;
            default:
                console.warn("WalletCommand received unknown view:", view);
                return <DashboardView totalBalance={totalBalance} showBalance={showBalance} setShowBalance={setShowBalance} />;
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
