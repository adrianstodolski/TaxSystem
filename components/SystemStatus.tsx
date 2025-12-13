
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { SystemStatusData } from '../types';
import { Activity, CheckCircle2, AlertTriangle, XCircle, Server, Clock, Zap, Cpu, HardDrive } from 'lucide-react';
import { motion } from 'framer-motion';

export const SystemStatus: React.FC = () => {
    const [statusData, setStatusData] = useState<SystemStatusData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchSystemStatus();
            setStatusData(data);
            setLoading(false);
        };
        load();
    }, []);

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'OPERATIONAL': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
            case 'DEGRADED': return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
            case 'OUTAGE': return 'text-rose-500 bg-rose-500/20 border-rose-500/30';
            default: return 'text-zinc-400 bg-zinc-800 border-zinc-700';
        }
    };

    // Fake Latency Bars
    const LatencyGraph = () => (
        <div className="flex items-end gap-1 h-8 mt-2 opacity-50">
            {Array.from({length: 20}).map((_, i) => (
                <div 
                    key={i} 
                    className="w-1 bg-indigo-500 rounded-sm" 
                    style={{ height: `${20 + Math.random() * 80}%` }}
                ></div>
            ))}
        </div>
    );

    if (loading || !statusData) return <div className="p-12 text-center text-zinc-500">Connecting to telemetry...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Server className="text-indigo-500" /> Infrastructure Status
                    </h2>
                    <p className="text-zinc-400 mt-1">
                        Monitorowanie wydajności klastra Nuffi Cloud (Warsaw Region).
                    </p>
                </div>
                <div className={`px-4 py-2 rounded-xl border flex items-center gap-3 font-bold text-sm ${statusData.globalStatus === 'OPERATIONAL' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
                    <div className={`w-3 h-3 rounded-full ${statusData.globalStatus === 'OPERATIONAL' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`}></div>
                    {statusData.globalStatus === 'OPERATIONAL' ? 'ALL SYSTEMS OPERATIONAL' : 'ISSUES DETECTED'}
                </div>
            </header>

            {/* Server Rack Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statusData.components.map((comp, idx) => (
                    <div key={idx} className="neo-card bg-[#0F0F12] border border-white/10 rounded-xl p-1 relative overflow-hidden group">
                        {/* Rack Mount Ears */}
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-20">
                            <div className="w-1 h-1 rounded-full bg-white"></div>
                            <div className="w-1 h-1 rounded-full bg-white"></div>
                        </div>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-20">
                            <div className="w-1 h-1 rounded-full bg-white"></div>
                            <div className="w-1 h-1 rounded-full bg-white"></div>
                        </div>

                        <div className="bg-[#0A0A0C] m-1 rounded-lg p-5 border border-white/5 relative z-10 h-full flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${comp.status === 'OPERATIONAL' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                        <Cpu size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{comp.name}</h4>
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">v2.4.0</p>
                                    </div>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${comp.status === 'OPERATIONAL' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'} animate-pulse`}></div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs text-zinc-400 mb-1 font-mono">
                                    <span>Uptime: {comp.uptime}%</span>
                                    <span>Lat: {Math.floor(Math.random() * 50 + 20)}ms</span>
                                </div>
                                <LatencyGraph />
                            </div>

                            <div className={`mt-4 text-[10px] font-bold px-2 py-1 rounded text-center border ${getStatusColor(comp.status)}`}>
                                {comp.status}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Additional Mock Components for Grid */}
                <div className="neo-card bg-[#0F0F12] border border-white/10 rounded-xl p-6 flex items-center justify-center text-zinc-600 border-dashed">
                    <div className="text-center">
                        <Server size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-xs font-bold uppercase">Add Node</p>
                    </div>
                </div>
            </div>

            {/* Incidents Timeline */}
            <div className="neo-card p-6 rounded-2xl">
                <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                    <Clock size={18} className="text-zinc-400" /> Incident History
                </h3>
                
                {statusData.incidents.length === 0 ? (
                    <div className="flex items-center justify-center p-8 text-zinc-500 bg-white/5 rounded-xl border border-white/5">
                        <CheckCircle2 size={20} className="mr-2 text-green-500" />
                        <span className="text-sm">No incidents reported in the last 90 days.</span>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {statusData.incidents.map(inc => (
                            <div key={inc.id} className="relative pl-6 border-l border-white/10">
                                <div className={`absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full ${inc.status === 'RESOLVED' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                                <div className="mb-1 flex justify-between items-start">
                                    <h4 className="font-bold text-white text-sm">{inc.title}</h4>
                                    <span className="text-[10px] font-mono text-zinc-500">{new Date(inc.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="text-xs text-zinc-400 bg-white/5 p-3 rounded-lg border border-white/5">
                                    {inc.updates.map((u, i) => (
                                        <div key={i} className="mb-1 last:mb-0">
                                            <span className="text-zinc-500 mr-2">[{new Date(u.timestamp).toLocaleTimeString()}]</span>
                                            {u.message}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
