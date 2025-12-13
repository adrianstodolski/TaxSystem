
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { ClientProfile } from '../types';
import { Users, AlertTriangle, CheckCircle2, Clock, Send, FileText, Briefcase, Search, Filter, Activity, Zap, ArrowRight, LayoutGrid, List } from 'lucide-react';
import { toast } from './ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';

type EnrichedClientProfile = ClientProfile & { riskScore?: number; lastAction?: string };

const ClientCard: React.FC<{ client: EnrichedClientProfile; onRemind: (client: EnrichedClientProfile) => void }> = ({ client, onRemind }) => (
    <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="neo-card p-5 rounded-2xl group hover:border-gold/30 transition-all relative overflow-hidden"
    >
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center font-bold border border-indigo-500/20 group-hover:bg-gold/10 group-hover:text-gold group-hover:border-gold/20 transition-colors">
                    {client.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                    <h4 className="font-bold text-white text-sm truncate max-w-[120px]" title={client.name}>{client.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-mono">{client.nip}</p>
                </div>
            </div>
            {client.riskScore && client.riskScore > 80 && (
                <span className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] px-2 py-0.5 rounded-bl-lg font-bold">HIGH RISK</span>
            )}
        </div>

        <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">VAT Status</span>
                <span className={`font-bold px-1.5 py-0.5 rounded ${client.vatStatus === 'OK' ? 'text-green-400 bg-green-500/10' : 'text-rose-400 bg-rose-500/10'}`}>{client.vatStatus}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Inbox</span>
                <span className={`font-bold flex items-center gap-1 ${client.documentsToProcess > 0 ? 'text-amber-400' : 'text-zinc-300'}`}>
                    <FileText size={10} /> {client.documentsToProcess}
                </span>
            </div>
        </div>

        <div className="space-y-1 mb-4">
            <div className="flex justify-between text-[10px] text-zinc-500 uppercase font-bold">
                <span>Miesiąc</span>
                <span>{client.monthProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${client.monthProgress === 100 ? 'bg-green-500' : 'bg-indigo-500'}`} style={{width: `${client.monthProgress}%`}}></div>
            </div>
        </div>

        <div className="flex gap-2">
            <button 
                onClick={() => onRemind(client)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-zinc-300 py-2 rounded-lg text-xs font-bold border border-white/5 transition-colors flex items-center justify-center gap-1"
            >
                <Send size={12} /> Monit
            </button>
            <button className="flex-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 py-2 rounded-lg text-xs font-bold transition-colors">
                Księguj
            </button>
        </div>
    </motion.div>
);

export const AccountantDashboard: React.FC = () => {
    const [clients, setClients] = useState<EnrichedClientProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchClients();
            // Mock enrichment
            const enriched = data.map(c => ({
                ...c,
                riskScore: Math.floor(Math.random() * 100),
                lastAction: ['Wysłano JPK', 'Odebrano FV', 'Monit', 'Zaksięgowano'][Math.floor(Math.random()*4)]
            }));
            setClients(enriched);
            setLoading(false);
        };
        load();
    }, []);

    const handleRemind = async (client: EnrichedClientProfile) => {
        toast.info('Wysyłanie...', `Wysyłanie przypomnienia do ${client.name}.`);
        await NuffiService.sendClientReminder(client.id, 'DOCS');
        toast.success('Wysłano', 'Klient otrzymał powiadomienie push i email.');
    };

    const filteredClients = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.nip.includes(search));

    // Stats
    const totalDocs = clients.reduce((acc, c) => acc + c.documentsToProcess, 0);
    const critical = clients.filter(c => c.vatStatus === 'OVERDUE' || c.pitStatus === 'OVERDUE').length;
    const completed = clients.filter(c => c.monthProgress === 100).length;
    const progress = (completed / (clients.length || 1)) * 100;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Briefcase className="text-gold" /> Firm Command
                    </h2>
                    <p className="text-zinc-400 mt-1">
                        Centrum operacyjne biura rachunkowego (Multi-tenant).
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-onyx p-1 rounded-lg border border-white/10 flex">
                        <button onClick={() => setViewMode('GRID')} className={`p-2 rounded ${viewMode === 'GRID' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'}`}><LayoutGrid size={16} /></button>
                        <button onClick={() => setViewMode('LIST')} className={`p-2 rounded ${viewMode === 'LIST' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'}`}><List size={16} /></button>
                    </div>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-500 flex items-center gap-2 shadow-lg shadow-indigo-900/50 text-sm">
                        <Zap size={16} /> Dodaj Klienta
                    </button>
                </div>
            </header>

            {/* Tax Season Pulse */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 bg-gradient-to-r from-[#0A0A0C] to-[#141419] border border-white/10 p-6 rounded-2xl relative overflow-hidden flex items-center justify-between">
                    <div className="relative z-10">
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            <Activity className="text-emerald-400" size={20} /> Tax Season Pulse
                        </h3>
                        <p className="text-zinc-400 text-sm mb-4">Postęp rozliczeń VAT-7 za bieżący okres.</p>
                        <div className="flex items-center gap-6">
                            <div>
                                <span className="text-2xl font-bold text-white font-mono">{completed}</span>
                                <span className="text-zinc-500 text-xs uppercase font-bold ml-2">Rozliczonych</span>
                            </div>
                            <div className="w-px h-8 bg-white/10"></div>
                            <div>
                                <span className="text-2xl font-bold text-amber-400 font-mono">{clients.length - completed}</span>
                                <span className="text-zinc-500 text-xs uppercase font-bold ml-2">W toku</span>
                            </div>
                            <div className="w-px h-8 bg-white/10"></div>
                            <div>
                                <span className="text-2xl font-bold text-rose-400 font-mono">{critical}</span>
                                <span className="text-zinc-500 text-xs uppercase font-bold ml-2">Krytyczne</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Visual Pulse Circle */}
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="8" />
                            <circle 
                                cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="8"
                                strokeDasharray="251"
                                strokeDashoffset={251 - (251 * progress) / 100}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="text-center">
                            <span className="text-xl font-bold text-white">{progress.toFixed(0)}%</span>
                        </div>
                    </div>
                </div>

                <div className="neo-card p-6 rounded-2xl bg-indigo-900/10 border-indigo-500/20 flex flex-col justify-center">
                    <p className="text-xs font-bold text-indigo-300 uppercase mb-2">Dokumenty do pobrania</p>
                    <h3 className="text-4xl font-bold text-white font-mono mb-1">{totalDocs}</h3>
                    <p className="text-xs text-indigo-400/70">Wymagają OCR lub kategoryzacji.</p>
                    <button className="mt-4 w-full bg-indigo-600/20 text-indigo-300 py-2 rounded-lg text-xs font-bold hover:bg-indigo-600/30 border border-indigo-500/30">
                        Otwórz Inbox
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input 
                        type="text" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Filtruj klientów..." 
                        className="w-full pl-10 pr-4 py-3 bg-[#0A0A0C] border border-white/10 rounded-xl text-sm text-white focus:border-gold/50 outline-none" 
                    />
                </div>
                <button className="px-4 py-3 bg-[#0A0A0C] border border-white/10 rounded-xl text-zinc-400 hover:text-white flex items-center gap-2 text-sm font-bold">
                    <Filter size={16} /> Filtry
                </button>
            </div>

            {/* Content View */}
            {viewMode === 'GRID' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {filteredClients.map(client => (
                            <ClientCard key={client.id} client={client} onRemind={handleRemind} />
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="neo-card rounded-2xl overflow-hidden">
                    <table className="w-full text-sm text-left text-zinc-300">
                        <thead className="bg-white/5 text-zinc-500 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 font-medium">Klient</th>
                                <th className="px-6 py-4 font-medium">Statusy</th>
                                <th className="px-6 py-4 font-medium">Progres</th>
                                <th className="px-6 py-4 font-medium text-right">Akcje</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredClients.map(client => (
                                <tr key={client.id} className="hover:bg-white/5">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-white">{client.name}</div>
                                        <div className="text-xs text-zinc-500 font-mono">{client.nip}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${client.vatStatus === 'OK' ? 'border-green-500/30 text-green-400' : 'border-rose-500/30 text-rose-400'}`}>VAT: {client.vatStatus}</span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${client.pitStatus === 'OK' ? 'border-green-500/30 text-green-400' : 'border-amber-500/30 text-amber-400'}`}>PIT: {client.pitStatus}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 w-48">
                                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-indigo-500 h-full" style={{width: `${client.monthProgress}%`}}></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gold hover:underline text-xs font-bold flex items-center gap-1 justify-end">
                                            Panel <ArrowRight size={12} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
