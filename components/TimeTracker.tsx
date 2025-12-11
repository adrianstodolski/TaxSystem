
import React, { useEffect, useState, useRef } from 'react';
import { NuffiService } from '../services/api';
import { TimeEntry } from '../types';
import { Clock, Play, Pause, Square, Plus, MoreHorizontal, DollarSign, Calendar, RefreshCw } from 'lucide-react';
import { toast } from './ui/Toast';
import { safeFormatCurrency } from '../utils/formatters';

export const TimeTracker: React.FC = () => {
    const [entries, setEntries] = useState<TimeEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
    const [timer, setTimer] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchTimeEntries();
            setEntries(data);
            const running = data.find(e => e.status === 'RUNNING');
            if(running) {
                setActiveEntry(running);
                // Calculate elapsed time based on startTime
                const start = new Date(running.startTime).getTime();
                const now = new Date().getTime();
                setTimer(Math.floor((now - start) / 1000));
            }
            setLoading(false);
        };
        load();
    }, []);

    useEffect(() => {
        if(activeEntry) {
            timerRef.current = setInterval(() => {
                setTimer(t => t + 1);
            }, 1000);
        } else {
            if(timerRef.current) clearInterval(timerRef.current);
        }
        return () => { if(timerRef.current) clearInterval(timerRef.current); };
    }, [activeEntry]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    };

    const handleStop = async () => {
        if(!activeEntry) return;
        toast.success('Zatrzymano czas', `Zarejestrowano ${formatTime(timer)} dla zadania "${activeEntry.description}".`);
        setActiveEntry(null);
        setTimer(0);
        // Refresh mock
        const data = await NuffiService.fetchTimeEntries();
        setEntries(data.map(e => e.id === activeEntry.id ? {...e, status: 'COMPLETED' as const, endTime: new Date().toISOString(), durationSeconds: timer} : e));
    };

    const handleStart = () => {
        const newEntry: TimeEntry = {
            id: `temp_${Date.now()}`,
            projectId: 'new',
            projectName: 'Nowy Projekt',
            description: 'Praca nad...',
            startTime: new Date().toISOString(),
            durationSeconds: 0,
            billable: true,
            hourlyRate: 150,
            status: 'RUNNING'
        };
        setActiveEntry(newEntry);
        setTimer(0);
        setEntries([newEntry, ...entries]);
    };

    const totalBillable = entries.filter(e => e.billable && e.status === 'COMPLETED').reduce((acc, e) => acc + (e.durationSeconds / 3600) * e.hourlyRate, 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Clock className="text-gold" /> Time Tracker (RCP)
                    </h2>
                    <p className="text-zinc-400 mt-1">
                        Rejestracja czasu pracy i rozliczenia godzinowe (Billing).
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-lg font-bold border border-emerald-500/20 flex items-center gap-2">
                        <DollarSign size={16} /> 
                        Do zafakturowania: {safeFormatCurrency(totalBillable, 'PLN')}
                    </div>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-500 flex items-center gap-2 shadow-lg">
                        <Plus size={18} /> Nowy Wpis
                    </button>
                </div>
            </header>

            {/* Timer Bar */}
            <div className="neo-card p-4 rounded-xl flex items-center gap-4 sticky top-4 z-20 border border-gold/30 shadow-[0_0_20px_-5px_rgba(212,175,55,0.2)]">
                <input 
                    type="text" 
                    placeholder="Nad czym pracujesz?" 
                    className="flex-1 bg-transparent border-none outline-none font-medium text-white placeholder-zinc-500"
                    disabled={!!activeEntry}
                    value={activeEntry ? activeEntry.description : ''}
                />
                <div className="h-8 w-px bg-white/10 mx-2"></div>
                <button className="text-gold font-bold text-sm hover:underline flex items-center gap-1">
                    <Plus size={14} /> Projekt
                </button>
                <div className="h-8 w-px bg-white/10 mx-2"></div>
                <div className="font-mono text-2xl font-bold text-white w-32 text-center">
                    {formatTime(timer)}
                </div>
                {activeEntry ? (
                    <button onClick={handleStop} className="w-12 h-12 bg-rose-600 hover:bg-rose-500 text-white rounded-full flex items-center justify-center transition-all shadow-lg shadow-rose-900/50">
                        <Square size={20} fill="currentColor" />
                    </button>
                ) : (
                    <button onClick={handleStart} className="w-12 h-12 bg-gold text-black rounded-full flex items-center justify-center transition-all hover:bg-[#FCD34D] shadow-lg shadow-gold/20">
                        <Play size={20} fill="currentColor" className="ml-1" />
                    </button>
                )}
            </div>

            {/* Weekly Grid & List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 neo-card rounded-2xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-white/10 bg-slate-900/30 flex justify-between items-center">
                        <h3 className="font-bold text-white">Ostatnie Aktywności</h3>
                        <span className="text-xs text-zinc-500">Dzisiaj</span>
                    </div>
                    <div className="divide-y divide-white/5">
                        {loading ? <div className="p-8 text-center"><RefreshCw className="animate-spin text-gold mx-auto" /></div> : 
                            entries.map(entry => (
                                <div key={entry.id} className={`p-4 flex items-center justify-between hover:bg-white/5 transition-colors group ${entry.status === 'RUNNING' ? 'bg-gold/5 border-l-2 border-gold' : ''}`}>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white">{entry.description}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{entry.projectName}</span>
                                            {entry.billable && <span className="text-[10px] text-zinc-400 border border-white/10 px-1.5 rounded">$</span>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="font-mono font-bold text-zinc-200">{formatTime(entry.durationSeconds)}</p>
                                            <p className="text-xs text-zinc-500">
                                                {new Date(entry.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                                                {entry.endTime ? new Date(entry.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...'}
                                            </p>
                                        </div>
                                        <button className="text-zinc-500 hover:text-gold transition-colors">
                                            <Play size={16} />
                                        </button>
                                        <button className="text-zinc-500 hover:text-white">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-[#0A0A0C] text-white p-6 rounded-2xl shadow-xl border border-white/10">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Calendar size={18} /> Podsumowanie Tygodnia
                        </h3>
                        <div className="flex items-end gap-2 mb-1">
                            <span className="text-4xl font-bold font-mono">32:15</span>
                            <span className="text-zinc-500 mb-1">h</span>
                        </div>
                        <p className="text-xs text-zinc-500">Cel: 40:00 h</p>
                        <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden border border-white/5">
                            <div className="bg-emerald-500 h-full" style={{width: '80%'}}></div>
                        </div>
                    </div>

                    <div className="neo-card p-6 rounded-2xl">
                        <h3 className="font-bold text-white mb-4">Top Projekty</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-zinc-400">Website Redesign</span>
                                <span className="font-mono font-bold text-white">14:20</span>
                            </div>
                            <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/5">
                                <div className="bg-indigo-500 h-full" style={{width: '65%'}}></div>
                            </div>
                            
                            <div className="flex justify-between items-center text-sm pt-2">
                                <span className="text-zinc-400">Internal / Admin</span>
                                <span className="font-mono font-bold text-white">05:45</span>
                            </div>
                            <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/5">
                                <div className="bg-slate-600 h-full" style={{width: '25%'}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
