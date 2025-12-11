
import React, { useState } from 'react';
import { NuffiService } from '../services/api';
import { TxAnalysisResult } from '../types';
import { Layers, Search, Loader2, Info, ArrowRight, Share2, ZoomIn, ZoomOut, Maximize, AlertCircle, CheckCircle2, Cpu } from 'lucide-react';
import { toast } from './ui/Toast';

export const DeFiArcheology: React.FC = () => {
    const [txHash, setTxHash] = useState('');
    const [analysis, setAnalysis] = useState<TxAnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [scale, setScale] = useState(1);

    const handleAnalyze = async () => {
        if (!txHash) return;
        setLoading(true);
        try {
            const result = await NuffiService.analyzeTxGraph(txHash);
            setAnalysis(result);
            toast.success('Analiza zakończona', 'Zrekonstruowano przepływ transakcji.');
        } catch (e) {
            toast.error('Błąd', 'Nie znaleziono transakcji lub błąd sieci.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Layers className="text-indigo-400" /> DeFi Archeology
                    </h2>
                    <p className="text-slate-400 mt-1">
                        Wizualna rekonstrukcja złożonych transakcji on-chain (Swap, LP, Bridge).
                    </p>
                </div>
            </header>

            {/* Search Bar */}
            <div className="glass-card p-6 rounded-2xl">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            value={txHash}
                            onChange={(e) => setTxHash(e.target.value)}
                            placeholder="Wklej Tx Hash (0x...) lub adres kontraktu"
                            className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm transition-all text-white placeholder-slate-500"
                        />
                    </div>
                    <button 
                        onClick={handleAnalyze}
                        disabled={loading || !txHash}
                        className="bg-indigo-600 text-white px-8 rounded-xl font-bold hover:bg-indigo-500 disabled:opacity-70 transition-all flex items-center gap-2 shadow-lg shadow-indigo-900/50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <><Cpu size={18} /> Dekoduj</>}
                    </button>
                </div>
            </div>

            {/* Visualizer Area */}
            {analysis ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4">
                    {/* Graph Canvas */}
                    <div className="lg:col-span-3 bg-[#0F172A] rounded-2xl border border-slate-800 relative overflow-hidden h-[600px] shadow-2xl">
                        {/* Toolbar */}
                        <div className="absolute top-4 right-4 flex gap-2 z-20">
                            <button onClick={() => setScale(s => s + 0.1)} className="bg-slate-800 text-white p-2 rounded-lg hover:bg-slate-700 border border-slate-700"><ZoomIn size={18} /></button>
                            <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="bg-slate-800 text-white p-2 rounded-lg hover:bg-slate-700 border border-slate-700"><ZoomOut size={18} /></button>
                            <button className="bg-slate-800 text-white p-2 rounded-lg hover:bg-slate-700 border border-slate-700"><Maximize size={18} /></button>
                        </div>

                        {/* Graph Layer */}
                        <div className="w-full h-full relative" style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}>
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                <defs>
                                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                                        <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                                    </marker>
                                </defs>
                                {analysis.links.map((link, i) => {
                                    const sourceNode = analysis.nodes.find(n => n.id === link.source);
                                    const targetNode = analysis.nodes.find(n => n.id === link.target);
                                    if (!sourceNode || !targetNode) return null;

                                    return (
                                        <g key={i}>
                                            <line 
                                                x1={sourceNode.x + 60} y1={sourceNode.y + 25} 
                                                x2={targetNode.x + 60} y2={targetNode.y + 25} 
                                                stroke={link.color || "#64748b"} 
                                                strokeWidth="2" 
                                                strokeDasharray={link.dashed ? "5,5" : "0"}
                                                markerEnd="url(#arrowhead)"
                                            />
                                            <rect 
                                                x={(sourceNode.x + targetNode.x)/2 + 40} 
                                                y={(sourceNode.y + targetNode.y)/2 + 15} 
                                                width="100" height="20" 
                                                fill="#1e293b" rx="4"
                                                stroke="#334155"
                                            />
                                            <text 
                                                x={(sourceNode.x + targetNode.x)/2 + 90} 
                                                y={(sourceNode.y + targetNode.y)/2 + 29} 
                                                textAnchor="middle" 
                                                fill={link.color || "#94a3b8"} 
                                                fontSize="10" 
                                                fontWeight="bold"
                                            >
                                                {link.label}
                                            </text>
                                        </g>
                                    );
                                })}
                            </svg>

                            {/* Nodes */}
                            {analysis.nodes.map(node => (
                                <div 
                                    key={node.id}
                                    className="absolute w-32 p-3 rounded-lg shadow-lg border-2 flex flex-col items-center justify-center text-center z-10 bg-slate-900"
                                    style={{ 
                                        left: node.x, 
                                        top: node.y, 
                                        borderColor: node.color
                                    }}
                                >
                                    <div className="font-bold text-xs text-white">{node.label}</div>
                                    <div className="text-[10px] text-slate-400 uppercase mt-1 px-1.5 py-0.5 rounded bg-slate-800 font-bold border border-slate-700">{node.type}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Inspector Panel */}
                    <div className="glass-card p-6 rounded-2xl flex flex-col h-[600px]">
                        <h3 className="font-bold text-white border-b border-white/10 pb-4 mb-4">Raport Analityczny</h3>
                        
                        <div className="space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-white/10">
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Werdykt Podatkowy</p>
                                <div className="flex items-start gap-2">
                                    <Info className="text-indigo-400 mt-0.5" size={16} />
                                    <p className="text-sm font-bold text-white">{analysis.taxVerdict.replace(/_/g, ' ')}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Metadane</p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Czas:</span>
                                        <span className="font-mono text-slate-200">{new Date(analysis.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Gas Used:</span>
                                        <span className="font-mono text-slate-200">{analysis.gasUsedEth} ETH</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Complexity:</span>
                                        <div className="flex items-center gap-1">
                                            <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                                                <div className="bg-amber-500 h-full" style={{width: `${analysis.complexityScore}%`}}></div>
                                            </div>
                                            <span className="text-xs font-bold text-white">{analysis.complexityScore}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-4">
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Zidentyfikowane Aktywa</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded border border-green-500/30">USDT</span>
                                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded border border-blue-500/30">WETH</span>
                                </div>
                            </div>
                        </div>

                        <button className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/50">
                            <CheckCircle2 size={18} /> Zaksięguj jako Swap
                        </button>
                    </div>
                </div>
            ) : (
                !loading && (
                    <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-dashed border-slate-700">
                        <Layers size={48} className="text-slate-500 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-white">Wprowadź hash transakcji, aby rozpocząć śledztwo</h3>
                        <p className="text-sm text-slate-400 max-w-md mx-auto mt-2">
                            Nuffi przeanalizuje call trace, logi zdarzeń i transfery wewnętrzne, aby zbudować pełny obraz operacji DeFi.
                        </p>
                    </div>
                )
            )}
        </div>
    );
};
