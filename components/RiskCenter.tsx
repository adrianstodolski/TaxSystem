
import React, { useEffect, useState, useRef } from 'react';
import { NuffiService } from '../services/api';
import { RiskAssessment } from '../types';
import { ShieldAlert, AlertTriangle, CheckCircle2, Activity, Search, Lock, Scan, RefreshCw, Globe, Terminal, MapPin, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

// Mock Logs
const MOCK_LOGS = [
    { id: 1, time: '10:42:01', level: 'INFO', msg: 'System check initiated by user admin', ip: '192.168.1.1' },
    { id: 2, time: '10:42:05', level: 'INFO', msg: 'KSeF Gateway connection established', ip: '10.0.0.5' },
    { id: 3, time: '10:42:12', level: 'WARN', msg: 'High latency detected on Bank Connector', ip: '10.0.0.12' },
    { id: 4, time: '10:42:45', level: 'INFO', msg: 'Database backup completed successfully', ip: '192.168.1.200' },
];

export const RiskCenter: React.FC = () => {
    const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
    const [scanning, setScanning] = useState(false);
    const [logs, setLogs] = useState(MOCK_LOGS);
    const logsEndRef = useRef<HTMLDivElement>(null);

    const runScan = async () => {
        setScanning(true);
        const data = await NuffiService.fetchRiskProfile();
        setAssessment(data);
        // Simulate scan duration
        setTimeout(() => setScanning(false), 2000);
    };

    useEffect(() => { runScan(); }, []);

    // Simulate Live Logs
    useEffect(() => {
        const interval = setInterval(() => {
            const newLog = {
                id: Date.now(),
                time: new Date().toLocaleTimeString(),
                level: Math.random() > 0.9 ? 'WARN' : 'INFO',
                msg: Math.random() > 0.9 ? 'Unauthorized access attempt blocked' : 'Routine health check pass',
                ip: `192.168.1.${Math.floor(Math.random() * 255)}`
            };
            setLogs(prev => [...prev.slice(-19), newLog]); // Keep last 20
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Scroll to bottom of logs
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    const riskRadarData = [
        { subject: 'VAT Compliance', A: 90, fullMark: 100 },
        { subject: 'Liquidity', A: 65, fullMark: 100 },
        { subject: 'Cybersec', A: 95, fullMark: 100 },
        { subject: 'AML/KYC', A: 80, fullMark: 100 },
        { subject: 'Data Privacy', A: 85, fullMark: 100 },
        { subject: 'Legal', A: 70, fullMark: 100 },
    ];

    const locations = [
        { id: 1, x: 150, y: 80, name: 'Warsaw', status: 'ACTIVE' },
        { id: 2, x: 140, y: 90, name: 'Berlin', status: 'ACTIVE' },
        { id: 3, x: 60, y: 100, name: 'New York', status: 'WARN' },
        { id: 4, x: 280, y: 110, name: 'Tokyo', status: 'ACTIVE' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20 max-w-[1600px] mx-auto">
            <header className="flex justify-between items-center pb-6 border-b border-white/10">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <ShieldAlert className="text-indigo-500" /> Security Operations Center (SOC)
                    </h2>
                    <p className="text-zinc-400 mt-1">
                        Monitoring zagrożeń podatkowych, cyberbezpieczeństwa i zgodności (Compliance).
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-xs font-bold text-green-400">
                        <Activity size={14} className="animate-pulse" /> SYSTEM SECURE
                    </div>
                    <button 
                        onClick={runScan}
                        disabled={scanning}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-900/50 disabled:opacity-50 text-sm"
                    >
                        <RefreshCw size={16} className={scanning ? 'animate-spin' : ''} />
                        {scanning ? 'Skanowanie...' : 'Pełny Audyt'}
                    </button>
                </div>
            </header>

            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="neo-card p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Global Risk Score</p>
                        <h3 className="text-4xl font-mono font-bold text-white mt-2">{assessment?.globalScore || '--'}<span className="text-lg text-zinc-500">/100</span></h3>
                    </div>
                    <div className="absolute right-0 top-0 opacity-10 p-4">
                        <Shield size={64} className="text-white" />
                    </div>
                    <div className="w-full bg-slate-800 h-1 mt-4 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: `${assessment?.globalScore || 0}%` }}></div>
                    </div>
                </div>

                <div className="neo-card p-6 rounded-2xl border-l-2 border-l-indigo-500">
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Active Sessions</p>
                    <h3 className="text-3xl font-mono font-bold text-white">4</h3>
                    <p className="text-xs text-indigo-400 mt-1 font-mono">2 Admin, 2 Viewer</p>
                </div>

                <div className="neo-card p-6 rounded-2xl border-l-2 border-l-amber-500">
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Compliance Alert</p>
                    <h3 className="text-3xl font-mono font-bold text-amber-400">1</h3>
                    <p className="text-xs text-zinc-400 mt-1">Missing VAT invoice (Oct)</p>
                </div>

                <div className="neo-card p-6 rounded-2xl border-l-2 border-l-rose-500">
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Threats Blocked</p>
                    <h3 className="text-3xl font-mono font-bold text-rose-400">142</h3>
                    <p className="text-xs text-zinc-400 mt-1">Last 30 days</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
                {/* 1. Radar Chart (Risk Vectors) */}
                <div className="neo-card p-6 rounded-2xl flex flex-col">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Scan size={18} className="text-zinc-400" /> Wektory Ryzyka
                    </h3>
                    <div className="flex-1 w-full -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={riskRadarData}>
                                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                                <Radar name="Score" dataKey="A" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.3} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Geo Map (Activity) */}
                <div className="neo-card p-6 rounded-2xl relative overflow-hidden bg-[#08080A]">
                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Globe size={18} className="text-zinc-400" /> Aktywność Geolokalizacyjna
                        </h3>
                        <div className="flex gap-2 text-[10px] font-mono text-zinc-500">
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> OK</span>
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> SUSPICIOUS</span>
                        </div>
                    </div>
                    
                    <div className="relative w-full h-full opacity-40">
                        {/* Mock Map Background - Simplified Dot Matrix Representation */}
                        <div className="absolute inset-0" style={{ 
                            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)', 
                            backgroundSize: '20px 20px' 
                        }}></div>
                        
                        {/* Locations */}
                        {locations.map(loc => (
                            <motion.div 
                                key={loc.id}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute flex flex-col items-center group cursor-pointer"
                                style={{ left: loc.x, top: loc.y }}
                            >
                                <div className="relative">
                                    <div className={`w-3 h-3 rounded-full ${loc.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <div className={`absolute inset-0 w-3 h-3 rounded-full animate-ping ${loc.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                </div>
                                <div className="mt-2 px-2 py-1 bg-black/80 border border-white/10 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                    {loc.name}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* 3. Live Terminal Log */}
                <div className="neo-card p-0 rounded-2xl flex flex-col overflow-hidden border border-white/10 bg-[#050505]">
                    <div className="p-3 bg-[#141419] border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Terminal size={14} className="text-zinc-400" />
                            <span className="text-xs font-bold text-zinc-300">Live Security Feed</span>
                        </div>
                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                            <div className="w-2 h-2 rounded-full bg-amber-500/50"></div>
                            <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                        </div>
                    </div>
                    <div className="flex-1 p-4 font-mono text-[10px] overflow-y-auto custom-scrollbar space-y-2 text-zinc-400">
                        {logs.map((log) => (
                            <div key={log.id} className="flex gap-3 hover:bg-white/5 p-1 rounded">
                                <span className="text-zinc-600 shrink-0">{log.time}</span>
                                <span className={`font-bold shrink-0 w-10 ${log.level === 'WARN' ? 'text-amber-500' : 'text-green-500'}`}>{log.level}</span>
                                <span className="text-zinc-300 break-all">{log.msg}</span>
                                <span className="text-zinc-600 ml-auto shrink-0">{log.ip}</span>
                            </div>
                        ))}
                        <div ref={logsEndRef} />
                    </div>
                </div>
            </div>

            {/* Scanning Overlay */}
            {scanning && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#0A0A0C] border border-white/10 p-8 rounded-2xl shadow-2xl flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                        <h3 className="text-white font-bold text-lg">System Audit in Progress...</h3>
                        <p className="text-zinc-400 text-sm mt-2">Checking KSeF, Banking APIs, and AML Lists</p>
                    </div>
                </div>
            )}
        </div>
    );
};
