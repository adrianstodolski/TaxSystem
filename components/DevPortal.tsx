
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { UserApiKey, ApiUsageStats } from '../types';
import { Terminal, Key, Copy, Plus, BarChart2, Activity, Zap, Shield, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { toast } from './ui/Toast';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Modal } from './ui/Modal';

export const DevPortal: React.FC = () => {
    const [keys, setKeys] = useState<UserApiKey[]>([]);
    const [usage, setUsage] = useState<ApiUsageStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [createModal, setCreateModal] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [newKeyType, setNewKeyType] = useState<'LIVE' | 'TEST'>('TEST');
    const [createdKey, setCreatedKey] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            const [k, u] = await Promise.all([
                NuffiService.fetchUserApiKeys(),
                NuffiService.fetchApiUsage()
            ]);
            setKeys(k);
            setUsage(u);
            setLoading(false);
        };
        load();
    }, []);

    const handleCreateKey = async () => {
        const key = await NuffiService.generateUserApiKey(newKeyName, newKeyType);
        setCreatedKey(key);
        // Optimistic update
        setKeys([...keys, { 
            id: `temp_${Date.now()}`, 
            prefix: key.substring(0, 8) + '...', 
            name: newKeyName, 
            type: newKeyType, 
            created: new Date().toISOString().split('T')[0], 
            lastUsed: 'Never', 
            permissions: ['READ', 'WRITE'] 
        }]);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Skopiowano', 'Klucz API w schowku.');
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Terminal className="text-indigo-400" /> Developer Portal
                    </h2>
                    <p className="text-slate-400 mt-1">
                        Zarządzanie dostępem API, kluczami i monitorowanie zużycia.
                    </p>
                </div>
                <button 
                    className="bg-slate-900 border border-slate-700 text-slate-300 px-4 py-2 rounded-xl font-bold hover:bg-slate-800 hover:text-white flex items-center gap-2 shadow-sm text-sm"
                    onClick={() => window.open('https://docs.nuffi.io', '_blank')}
                >
                    <Activity size={16} /> Dokumentacja API
                </button>
            </header>

            {/* Usage Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-white/10">
                    <p className="text-slate-400 text-xs font-bold uppercase mb-2">Total Requests (30d)</p>
                    <h3 className="text-3xl font-bold font-mono">{usage?.totalRequests.toLocaleString() || '...'}</h3>
                </div>
                <div className="glass-card p-6 rounded-2xl">
                    <p className="text-slate-500 text-xs font-bold uppercase mb-2">Avg. Latency</p>
                    <h3 className="text-3xl font-bold text-white font-mono">{usage?.avgLatency || '...'} ms</h3>
                </div>
                <div className="glass-card p-6 rounded-2xl">
                    <p className="text-slate-500 text-xs font-bold uppercase mb-2">Error Rate</p>
                    <h3 className="text-3xl font-bold text-green-400 font-mono">{usage?.errorRate || '0'}%</h3>
                </div>
            </div>

            {/* API Keys */}
            <div className="glass-card rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/30">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Key size={18} className="text-slate-400" /> API Keys
                    </h3>
                    <button 
                        onClick={() => setCreateModal(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-indigo-500 flex items-center gap-2"
                    >
                        <Plus size={14} /> Nowy Klucz
                    </button>
                </div>
                <div className="divide-y divide-white/5">
                    {keys.map(key => (
                        <div key={key.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h4 className="font-bold text-white text-sm">{key.name}</h4>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${key.type === 'LIVE' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                                        {key.type}
                                    </span>
                                </div>
                                <div className="font-mono text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded inline-block border border-slate-700">
                                    {key.prefix}
                                </div>
                            </div>
                            <div className="text-right text-xs text-slate-500">
                                <p>Utworzono: {key.created}</p>
                                <p>Ostatnie użycie: {key.lastUsed}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Usage Chart */}
            <div className="glass-card p-6 rounded-2xl h-80">
                <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                    <BarChart2 size={18} className="text-slate-400" /> Request Volume
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={usage?.history || []}>
                        <defs>
                            <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="date" hide />
                        <YAxis hide />
                        <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', color: '#fff'}} />
                        <Area type="monotone" dataKey="requests" stroke="#6366f1" fill="url(#colorReq)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Create Key Modal */}
            <Modal isOpen={createModal} onClose={() => { setCreateModal(false); setCreatedKey(null); }} title="Generowanie Klucza API">
                {!createdKey ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-1">Nazwa Klucza</label>
                            <input 
                                type="text" 
                                value={newKeyName} 
                                onChange={e => setNewKeyName(e.target.value)}
                                className="w-full border border-slate-700 bg-slate-800 text-white rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="np. Backend Server"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-400 mb-1">Środowisko</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-300">
                                    <input type="radio" checked={newKeyType === 'TEST'} onChange={() => setNewKeyType('TEST')} /> Test Mode
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-300">
                                    <input type="radio" checked={newKeyType === 'LIVE'} onChange={() => setNewKeyType('LIVE')} /> Live Mode
                                </label>
                            </div>
                        </div>
                        <button 
                            onClick={handleCreateKey}
                            disabled={!newKeyName}
                            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-500 disabled:opacity-50"
                        >
                            Wygeneruj
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in zoom-in">
                        <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/20 text-center">
                            <CheckCircle2 size={32} className="text-green-400 mx-auto mb-2" />
                            <h4 className="font-bold text-green-400">Klucz Wygenerowany</h4>
                            <p className="text-xs text-green-300/70 mt-1">Skopiuj go teraz. Nie będziesz mógł go zobaczyć ponownie.</p>
                        </div>
                        
                        <div className="relative">
                            <input 
                                type="text" 
                                readOnly 
                                value={createdKey} 
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 font-mono text-sm text-white pr-12"
                            />
                            <button 
                                onClick={() => copyToClipboard(createdKey)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-indigo-400 transition-colors"
                            >
                                <Copy size={16} />
                            </button>
                        </div>

                        <button 
                            onClick={() => { setCreateModal(false); setCreatedKey(null); }}
                            className="w-full bg-slate-800 text-white border border-slate-700 py-2 rounded-lg font-bold hover:bg-slate-700"
                        >
                            Gotowe
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
};
