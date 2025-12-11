
import React, { useEffect, useState, useMemo } from 'react';
import { NuffiService } from '../services/api';
import { CryptoExchange, CryptoTransaction, CryptoTaxReport, NFTAsset, AssetBubble } from '../types';
import { CryptoEngine } from '../utils/cryptoEngine';
import { Bitcoin, RefreshCw, Layers, ShieldCheck, Activity, Image, Radio, FileText, Calculator, TrendingDown, Coins, CircleDollarSign, LayoutGrid } from 'lucide-react';
import { toast } from './ui/Toast';
import { DataTable } from './ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Bubble Data
const MOCK_BUBBLES: AssetBubble[] = [
    { id: '1', symbol: 'BTC', name: 'Bitcoin', price: 45000, change24h: 2.5, marketCap: 850000000000, volume24h: 35000000000, rank: 1 },
    { id: '2', symbol: 'ETH', name: 'Ethereum', price: 2400, change24h: -1.2, marketCap: 280000000000, volume24h: 15000000000, rank: 2 },
    { id: '3', symbol: 'SOL', name: 'Solana', price: 95, change24h: 8.5, marketCap: 40000000000, volume24h: 4000000000, rank: 5 },
    { id: '4', symbol: 'BNB', name: 'BNB', price: 310, change24h: 0.5, marketCap: 48000000000, volume24h: 1000000000, rank: 4 },
    { id: '5', symbol: 'XRP', name: 'XRP', price: 0.55, change24h: -0.8, marketCap: 30000000000, volume24h: 1200000000, rank: 6 },
    { id: '6', symbol: 'ADA', name: 'Cardano', price: 0.50, change24h: 1.1, marketCap: 18000000000, volume24h: 500000000, rank: 8 },
    { id: '7', symbol: 'AVAX', name: 'Avalanche', price: 35, change24h: 12.4, marketCap: 13000000000, volume24h: 800000000, rank: 9 },
    { id: '8', symbol: 'DOGE', name: 'Dogecoin', price: 0.08, change24h: -3.5, marketCap: 11000000000, volume24h: 600000000, rank: 10 },
];

export const CryptoHub: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'BUBBLES' | 'TAX' | 'NFT_PARADISE' | 'DEFI'>('BUBBLES');
    const [transactions, setTransactions] = useState<CryptoTransaction[]>([]);
    const [report, setReport] = useState<CryptoTaxReport | null>(null);
    const [nfts, setNfts] = useState<NFTAsset[]>([]);
    const [loading, setLoading] = useState(false);
    
    const [bubbles, setBubbles] = useState(MOCK_BUBBLES);

    const loadData = async () => {
        setLoading(true);
        try {
            const [txs, nftData] = await Promise.all([
                NuffiService.fetchCryptoTransactions(),
                NuffiService.fetchNFTs()
            ]);
            setTransactions(txs);
            setNfts(nftData);
            setReport(CryptoEngine.calculateTax(txs, 'FIFO'));
        } catch (e) {
            toast.error('Błąd', 'Nie udało się pobrać danych.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const columns = useMemo<ColumnDef<CryptoTransaction>[]>(() => [
        {
            accessorKey: 'timestamp',
            header: 'Data',
            cell: info => <span className="font-mono text-xs text-zinc-400">{new Date(info.getValue() as string).toLocaleString()}</span>
        },
        {
            accessorKey: 'exchange',
            header: 'Giełda',
            cell: info => (
                <span className="text-[10px] font-bold px-2 py-1 rounded text-white bg-white/10 border border-white/5">
                    {info.getValue() as string}
                </span>
            )
        },
        {
            accessorKey: 'pair',
            header: 'Para',
            cell: info => <span className="font-bold text-white">{info.getValue() as string}</span>
        },
        {
            accessorKey: 'type',
            header: 'Typ',
            cell: info => <span className="text-[10px] font-bold uppercase">{info.getValue() as string}</span>
        },
        {
            accessorKey: 'totalFiat',
            header: 'Wartość',
            cell: info => <span className="font-bold font-mono text-white">{(info.getValue() as number).toFixed(2)} PLN</span>
        }
    ], []);

    const formatFiat = (val: number) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(val);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/5 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Bitcoin className="text-gold" /> Crypto Hub
                    </h2>
                    <p className="text-zinc-400 mt-1">Zarządzanie aktywami, analiza rynku i podatki.</p>
                </div>
                <div className="flex gap-2 items-center">
                    <button onClick={loadData} className="bg-white/10 border border-white/10 text-white px-4 py-2 rounded-xl font-bold hover:bg-white/20 flex items-center gap-2 transition-all text-sm">
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Sync Wallets
                    </button>
                </div>
            </header>

            {/* Navigation Pills - Neo Style */}
            <div className="flex gap-2 mb-6">
                {[
                    { id: 'BUBBLES', label: 'Market Overview', icon: LayoutGrid },
                    { id: 'TAX', label: 'Tax Engine', icon: FileText },
                    { id: 'NFT_PARADISE', label: 'NFT Gallery', icon: Image },
                    { id: 'DEFI', label: 'DeFi Portfolio', icon: Layers },
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-4 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
                            activeTab === tab.id ? 'bg-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]' : 'bg-onyx text-zinc-400 hover:text-white border border-white/5'
                        }`}
                    >
                        <tab.icon size={16} /> {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {/* 1. BUBBLES VIEW (CryptoBubbles.net Style) */}
                {activeTab === 'BUBBLES' && (
                    <motion.div 
                        key="BUBBLES"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="h-[600px] neo-card rounded-2xl relative overflow-hidden p-8 flex items-center justify-center bg-black/40"
                    >
                        <div className="absolute top-4 left-4 z-10 flex gap-4">
                            <span className="text-xs font-bold text-zinc-500 uppercase">Top 100 Coins</span>
                            <span className="text-xs font-bold text-zinc-500 uppercase">Performance: 24h</span>
                        </div>

                        <div className="flex flex-wrap gap-4 justify-center content-center w-full h-full">
                            {bubbles.map((bubble, i) => {
                                const size = Math.max(80, Math.log10(bubble.marketCap) * 12); 
                                const color = bubble.change24h > 0 
                                    ? `rgba(34, 197, 94, ${Math.min(0.9, 0.3 + (bubble.change24h / 20))})` 
                                    : `rgba(244, 63, 94, ${Math.min(0.9, 0.3 + (Math.abs(bubble.change24h) / 20))})`; 

                                return (
                                    <motion.div
                                        key={bubble.id}
                                        layoutId={bubble.id}
                                        className="rounded-full flex flex-col items-center justify-center text-white shadow-xl cursor-pointer hover:scale-110 transition-transform relative group border border-white/10 backdrop-blur-md"
                                        style={{ 
                                            width: size, 
                                            height: size, 
                                            backgroundColor: color 
                                        }}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: i * 0.05 }}
                                    >
                                        <span className="font-bold text-sm drop-shadow-md">{bubble.symbol}</span>
                                        <span className="text-xs font-mono font-bold drop-shadow-md">{bubble.change24h > 0 ? '+' : ''}{bubble.change24h}%</span>
                                        <span className="text-[10px] opacity-0 group-hover:opacity-100 absolute bottom-4 transition-opacity font-mono">
                                            ${bubble.price.toLocaleString()}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* 2. TAX VIEW (Koinly Style) */}
                {activeTab === 'TAX' && (
                    <motion.div 
                        key="TAX"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        {report && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="neo-card p-6 rounded-2xl border-l-4 border-indigo-500">
                                    <p className="text-zinc-400 text-xs font-bold uppercase mb-1">Dochód do opodatkowania</p>
                                    <h3 className="text-3xl font-bold text-white font-mono">{formatFiat(report.spotIncomeTaxBase + report.futuresIncomeTaxBase)}</h3>
                                </div>
                                <div className="neo-card p-6 rounded-2xl border-l-4 border-rose-500">
                                    <p className="text-zinc-400 text-xs font-bold uppercase mb-1">Koszty (Fees + Straty)</p>
                                    <h3 className="text-3xl font-bold text-white font-mono">{formatFiat(report.spotCost + report.futuresCost)}</h3>
                                </div>
                                <div className="neo-card p-6 rounded-2xl border-l-4 border-green-500">
                                    <p className="text-zinc-400 text-xs font-bold uppercase mb-1">Podatek Należny (19%)</p>
                                    <h3 className="text-3xl font-bold text-green-400 font-mono">{formatFiat(report.totalTaxDue)}</h3>
                                </div>
                            </div>
                        )}

                        <div className="neo-card rounded-2xl p-6">
                            <h3 className="font-bold text-white mb-4">Pełny Rejestr Operacji</h3>
                            <DataTable columns={columns} data={transactions} />
                        </div>
                    </motion.div>
                )}

                {/* 3. NFT PARADISE */}
                {activeTab === 'NFT_PARADISE' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {nfts.map((nft, i) => (
                            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="neo-card rounded-2xl overflow-hidden group">
                                <div className="aspect-square bg-zinc-900 relative">
                                    <img src={nft.imageUrl} alt={nft.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="p-4">
                                    <h4 className="font-bold text-white">{nft.name}</h4>
                                    <p className="text-xs text-zinc-400 font-mono mt-1">Floor: {nft.floorPrice} ETH</p>
                                </div>
                            </motion.div>
                        ))}
                        {nfts.length === 0 && <div className="col-span-3 text-center py-20 text-zinc-500">Brak NFT w połączonym portfelu.</div>}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
