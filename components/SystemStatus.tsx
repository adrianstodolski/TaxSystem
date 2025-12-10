
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { SystemStatusData } from '../types';
import { Activity, CheckCircle2, AlertTriangle, XCircle, Server, Clock, Zap } from 'lucide-react';

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
            case 'OPERATIONAL': return 'bg-green-500';
            case 'DEGRADED': return 'bg-amber-500';
            case 'OUTAGE': return 'bg-red-500';
            default: return 'bg-gray-400';
        }
    };

    const getStatusText = (status: string) => {
        switch(status) {
            case 'OPERATIONAL': return 'Operational';
            case 'DEGRADED': return 'Degraded Performance';
            case 'OUTAGE': return 'Major Outage';
            default: return 'Maintenance';
        }
    };

    if (loading || !statusData) return <div className="p-8 text-center text-slate-500">Ładowanie statusu systemu...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Activity className="text-indigo-600" /> System Status
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Monitoring dostępności usług Nuffi Cloud.
                    </p>
                </div>
            </header>

            {/* Global Status Banner */}
            <div className={`p-6 rounded-2xl text-white flex items-center gap-4 shadow-lg ${statusData.globalStatus === 'OPERATIONAL' ? 'bg-green-600' : 'bg-amber-500'}`}>
                {statusData.globalStatus === 'OPERATIONAL' ? <CheckCircle2 size={32} /> : <AlertTriangle size={32} />}
                <div>
                    <h3 className="text-2xl font-bold">
                        {statusData.globalStatus === 'OPERATIONAL' ? 'All Systems Operational' : 'Active Incidents Reported'}
                    </h3>
                    <p className="text-white/80 text-sm">Last updated: {new Date().toLocaleTimeString()}</p>
                </div>
            </div>

            {/* Components Grid */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <Server size={18} className="text-slate-400" /> Komponenty Systemu
                    </h3>
                </div>
                <div className="divide-y divide-slate-100">
                    {statusData.components.map((comp, idx) => (
                        <div key={idx} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div>
                                <h4 className="font-bold text-slate-900">{comp.name}</h4>
                                <p className="text-xs text-slate-500 mt-1">{comp.description}</p>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center justify-end gap-2 mb-1">
                                    <span className={`font-bold text-sm ${
                                        comp.status === 'OPERATIONAL' ? 'text-green-600' : 
                                        comp.status === 'DEGRADED' ? 'text-amber-600' : 'text-red-600'
                                    }`}>
                                        {getStatusText(comp.status)}
                                    </span>
                                    <div className={`w-3 h-3 rounded-full ${getStatusColor(comp.status)}`}></div>
                                </div>
                                <span className="text-xs text-slate-400 font-mono">Uptime: {comp.uptime}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Incident History */}
            <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <Clock size={20} className="text-slate-400" /> Past Incidents
                </h3>
                
                {statusData.incidents.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 text-sm">
                        No incidents reported in the last 90 days.
                    </div>
                ) : (
                    statusData.incidents.map(inc => (
                        <div key={inc.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-slate-900">{inc.title}</h4>
                                    <p className="text-xs text-slate-500 mt-1">{new Date(inc.createdAt).toLocaleString()}</p>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                                    inc.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {inc.status}
                                </span>
                            </div>
                            <div className="p-4 space-y-4">
                                {inc.updates.map((update, idx) => (
                                    <div key={idx} className="flex gap-3 text-sm">
                                        <div className="w-24 shrink-0 text-slate-400 text-xs pt-0.5">
                                            {new Date(update.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                        <div className="text-slate-700">
                                            {update.message}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
