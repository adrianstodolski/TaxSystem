
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraphNode, GraphLink } from '../types';
import { Network, ZoomIn, ZoomOut, Maximize, Wallet, Building, FileText, ArrowRight, Zap, RefreshCw, Lock, History, AlertOctagon } from 'lucide-react';
import { toast } from './ui/Toast';

const INITIAL_NODES: GraphNode[] = [
    { id: 'bank_main', label: 'mBank (PLN)', type: 'BANK', balance: 45000, currency: 'PLN', x: 200, y: 300, riskScore: 0 },
    { id: 'bank_vat', label: 'VAT Account', type: 'BANK', balance: 12000, currency: 'PLN', x: 350, y: 150, riskScore: 0 },
    { id: 'wallet_eth', label: 'MetaMask (Main)', type: 'WALLET', balance: 5.2, currency: 'ETH', x: 600, y: 300, riskScore: 10 },
    { id: 'exchange_binance', label: 'Binance Spot', type: 'EXCHANGE', balance: 2500, currency: 'USDT', x: 400, y: 500, riskScore: 5 },
    { id: 'contract_uniswap', label: 'Uniswap V3 LP', type: 'CONTRACT', balance: 10000, currency: 'USD', x: 800, y: 250, riskScore: 40 },
    { id: 'tax_office', label: 'Urząd Skarbowy', type: 'TAX_OFFICE', balance: 0, currency: 'PLN', x: 500, y: 50, riskScore: 0 },
    { id: 'client_google', label: 'Google Ireland', type: 'CONTRACT', balance: 0, currency: 'EUR', x: 50, y: 300, riskScore: 0 },
];

const INITIAL_LINKS: GraphLink[] = [
    { source: 'bank_main', target: 'bank_vat', value: 2300, type: 'TRANSFER', active: false },
    { source: 'bank_main', target: 'exchange_binance', value: 5000, type: 'TRANSFER', active: true },
    { source: 'exchange_binance', target: 'wallet_eth', value: 1.2, type: 'SWAP', active: true },
    { source: 'wallet_eth', target: 'contract_uniswap', value: 0.5, type: 'SWAP', active: true },
    { source: 'bank_main', target: 'tax_office', value: 4500, type: 'PAYMENT', active: false },
    { source: 'client_google', target: 'bank_main', value: 12000, type: 'PAYMENT', active: true },
];

export const Ledgerverse: React.FC = () => {
    const [nodes, setNodes] = useState(INITIAL_NODES);
    const [links, setLinks] = useState(INITIAL_LINKS);
    const [scale, setScale] = useState(1);
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
    
    const getNodeColor = (type: string) => {
        switch(type) {
            case 'BANK': return '#D4AF37'; // Gold
            case 'WALLET': return '#F97316'; // Orange
            case 'EXCHANGE': return '#F59E0B'; // Amber
            case 'CONTRACT': return '#8B5CF6'; // Purple
            case 'TAX_OFFICE': return '#EF4444'; // Red
            default: return '#64748B';
        }
    };

    const getNodeIcon = (type: string) => {
        switch(type) {
            case 'BANK': return <Building size={20} />;
            case 'WALLET': return <Wallet size={20} />;
            case 'EXCHANGE': return <RefreshCw size={20} />;
            case 'CONTRACT': return <FileText size={20} />;
            case 'TAX_OFFICE': return <Building size={20} />;
            default: return <Network size={20} />;
        }
    };

    const handleFreezeAsset = (nodeId: string) => {
        toast.warning('Zlecono zamrożenie', `Wysłano sygnał do Smart Kontraktu/Banku dla węzła ${nodeId}.`);
    };

    return (
        <div className="h-[calc(100vh-80px)] bg-transparent relative overflow-hidden rounded-2xl border border-white/5 flex flex-col shadow-2xl neo-card">
            {/* Header / HUD */}
            <div className="absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-start pointer-events-none">
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Network className="text-gold" /> The Ledgerverse
                    </h2>
                    <p className="text-zinc-500 font-mono text-sm mt-1">
                        Live Capital Flow Visualization • <span className="text-emerald-400">System Online</span>
                    </p>
                </div>
                <div className="flex flex-col gap-2 pointer-events-auto">
                    <button onClick={() => setScale(s => Math.min(2, s + 0.1))} className="p-3 bg-onyx/80 hover:bg-white/10 text-white rounded-xl backdrop-blur-md border border-white/10 transition-colors"><ZoomIn size={20} /></button>
                    <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-3 bg-onyx/80 hover:bg-white/10 text-white rounded-xl backdrop-blur-md border border-white/10 transition-colors"><ZoomOut size={20} /></button>
                    <button className="p-3 bg-onyx/80 hover:bg-white/10 text-white rounded-xl backdrop-blur-md border border-white/10 transition-colors"><Maximize size={20} /></button>
                </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing">
                <div 
                    className="absolute inset-0 transition-transform duration-200 ease-out origin-center"
                    style={{ transform: `scale(${scale})` }}
                >
                    {/* SVG Layer for Links */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <defs>
                            <marker id="arrow" markerWidth="10" markerHeight="10" refX="20" refY="3" orient="auto" markerUnits="strokeWidth">
                                <path d="M0,0 L0,6 L9,3 z" fill="#475569" />
                            </marker>
                        </defs>
                        {links.map((link, i) => {
                            const source = nodes.find(n => n.id === link.source);
                            const target = nodes.find(n => n.id === link.target);
                            if (!source || !target) return null;

                            return (
                                <g key={i}>
                                    <line 
                                        x1={source.x} y1={source.y} 
                                        x2={target.x} y2={target.y} 
                                        stroke="#27272a" 
                                        strokeWidth="2"
                                        markerEnd="url(#arrow)"
                                    />
                                    {link.active && (
                                        <circle r="3" fill="#D4AF37">
                                            <animateMotion 
                                                dur={`${Math.max(1, 5000 / link.value)}s`} 
                                                repeatCount="indefinite"
                                                path={`M${source.x},${source.y} L${target.x},${target.y}`}
                                            />
                                        </circle>
                                    )}
                                </g>
                            );
                        })}
                    </svg>

                    {/* Nodes Layer */}
                    {nodes.map(node => (
                        <motion.div
                            key={node.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                            style={{ left: node.x, top: node.y }}
                            onMouseEnter={() => setHoveredNode(node.id)}
                            onMouseLeave={() => setHoveredNode(null)}
                            onClick={() => setSelectedNode(node)}
                        >
                            {/* Halo Effect */}
                            <div className={`absolute inset-0 opacity-20 rounded-full blur-xl group-hover:opacity-40 transition-opacity w-24 h-24 -m-6 pointer-events-none`} style={{ backgroundColor: getNodeColor(node.type) }}></div>
                            
                            {/* Node Body */}
                            <div 
                                className="relative w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg border border-white/10 bg-onyx z-10 transition-transform group-hover:scale-110"
                                style={{ borderColor: hoveredNode === node.id ? getNodeColor(node.type) : 'rgba(255,255,255,0.1)' }}
                            >
                                {getNodeIcon(node.type)}
                                {node.riskScore && node.riskScore > 20 && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                                )}
                            </div>

                            {/* Label */}
                            <div className="absolute top-14 left-1/2 -translate-x-1/2 text-center whitespace-nowrap z-20 pointer-events-none">
                                <p className="text-xs font-bold text-white bg-black/60 px-2 py-1 rounded backdrop-blur-md border border-white/10">{node.label}</p>
                                <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{node.balance.toLocaleString()} {node.currency}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Inspector Panel (Right Side) */}
            <AnimatePresence>
                {selectedNode && (
                    <motion.div 
                        initial={{ x: 400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 400, opacity: 0 }}
                        className="absolute right-0 top-0 bottom-0 w-96 bg-onyx/90 backdrop-blur-xl border-l border-white/10 p-6 z-30 shadow-2xl flex flex-col"
                    >
                        <button onClick={() => setSelectedNode(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">✕</button>
                        
                        <div className="mt-8 shrink-0">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl mb-4 shadow-lg border border-white/10" style={{ backgroundColor: getNodeColor(selectedNode.type) + '20', color: getNodeColor(selectedNode.type) }}>
                                {getNodeIcon(selectedNode.type)}
                            </div>
                            <h3 className="text-2xl font-bold text-white">{selectedNode.label}</h3>
                            <span className="text-xs font-mono text-zinc-500 bg-white/5 px-2 py-1 rounded mt-2 inline-block border border-white/5">ID: {selectedNode.id}</span>
                        </div>

                        <div className="mt-8 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Balance</p>
                                <p className="text-3xl font-mono text-white font-bold">{selectedNode.balance.toLocaleString()} <span className="text-sm text-zinc-500">{selectedNode.currency}</span></p>
                            </div>

                            {selectedNode.riskScore && selectedNode.riskScore > 0 ? (
                                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                                    <h4 className="text-rose-400 font-bold text-sm mb-1 flex items-center gap-2"><Zap size={14} /> Risk Detected</h4>
                                    <p className="text-xs text-rose-200/70">
                                        Score: {selectedNode.riskScore}/100. High volume of interactions.
                                    </p>
                                </div>
                            ) : (
                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                    <h4 className="text-emerald-400 font-bold text-sm mb-1 flex items-center gap-2"><AlertOctagon size={14} /> Low Risk</h4>
                                    <p className="text-xs text-emerald-200/70">Entity is verified and compliant.</p>
                                </div>
                            )}

                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-white flex items-center gap-2"><ArrowRight size={14} /> Connections</h4>
                                {links.filter(l => l.source === selectedNode.id || l.target === selectedNode.id).map((l, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 cursor-pointer">
                                        <span className="text-zinc-300">
                                            {l.source === selectedNode.id ? 'To: ' + nodes.find(n => n.id === l.target)?.label : 'From: ' + nodes.find(n => n.id === l.source)?.label}
                                        </span>
                                        <span className="font-mono font-bold text-gold">{l.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/10 shrink-0 space-y-3">
                            <button className="w-full bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-bold border border-white/10 flex items-center justify-center gap-2 transition-colors">
                                <History size={16} /> Audit Logs
                            </button>
                            {selectedNode.type === 'WALLET' || selectedNode.type === 'CONTRACT' ? (
                                <button 
                                    onClick={() => handleFreezeAsset(selectedNode.id)}
                                    className="w-full bg-rose-900/30 hover:bg-rose-900/50 text-rose-400 border border-rose-500/30 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    <Lock size={16} /> Freeze Assets
                                </button>
                            ) : null}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
