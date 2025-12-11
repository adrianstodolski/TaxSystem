
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
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Clock className="text-indigo-600" /> Time Tracker (RCP)
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Rejestracja czasu pracy i rozliczenia godzinowe (Billing).
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg font-bold border border-green-200 flex items-center gap-2">
                        <DollarSign size={16} /> 
                        Do zafakturowania: {safeFormatCurrency(totalBillable, 'PLN')}
                    </div>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-lg">
                        <Plus size={18} /> Nowy Wpis
                    </button>
                </div>
            </header>

            {/* Timer Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 sticky top-4 z-20">
                <input 
                    type="text" 
                    placeholder="Nad czym pracujesz?" 
                    className="flex-1 bg-transparent border-none outline-none font-medium text-slate-700 placeholder-slate-400"
                    disabled={!!activeEntry}
                    value={activeEntry ? activeEntry.description : ''}
                />
                <div className="h-8 w-px bg-slate-200 mx-2"></div>
                <button className="text-indigo-600 font-bold text-sm hover:underline flex items-center gap-1">
                    <Plus size={14} /> Projekt
                </button>
                <div className="h-8 w-px bg-slate-200 mx-2"></div>
                <div className="font-mono text-2xl font-bold text-slate-900 w-32 text-center">
                    {formatTime(timer)}
                </div>
                {activeEntry ? (
                    <button onClick={handleStop} className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all shadow-lg shadow-red-200">
                        <Square size={20} fill="currentColor" />
                    </button>
                ) : (
                    <button onClick={handleStart} className="w-12 h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center transition-all shadow-lg shadow-indigo-200">
                        <Play size={20} fill="currentColor" className="ml-1" />
                    </button>
                )}
            </div>

            {/* Weekly Grid & List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-bold text-slate-900">Ostatnie Aktywności</h3>
                        <span className="text-xs text-slate-500">Dzisiaj</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {loading ? <div className="p-8 text-center"><RefreshCw className="animate-spin text-indigo-600 mx-auto" /></div> : 
                            entries.map(entry => (
                                <div key={entry.id} className={`p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group ${entry.status === 'RUNNING' ? 'bg-indigo-50/30' : ''}`}>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900">{entry.description}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{entry.projectName}</span>
                                            {entry.billable && <span className="text-[10px] text-slate-400 border border-slate-200 px-1.5 rounded">$</span>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="font-mono font-bold text-slate-900">{formatTime(entry.durationSeconds)}</p>
                                            <p className="text-xs text-slate-400">
                                                {new Date(entry.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                                                {entry.endTime ? new Date(entry.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...'}
                                            </p>
                                        </div>
                                        <button className="text-slate-300 hover:text-indigo-600 transition-colors">
                                            <Play size={16} />
                                        </button>
                                        <button className="text-slate-300 hover:text-slate-600">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Calendar size={18} /> Podsumowanie Tygodnia
                        </h3>
                        <div className="flex items-end gap-2 mb-1">
                            <span className="text-4xl font-bold">32:15</span>
                            <span className="text-slate-400 mb-1">h</span>
                        </div>
                        <p className="text-xs text-slate-500">Cel: 40:00 h</p>
                        <div className="w-full bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
                            <div className="bg-green-500 h-full" style={{width: '80%'}}></div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-4">Top Projekty</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600">Website Redesign</span>
                                <span className="font-mono font-bold">14:20</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-indigo-600 h-full" style={{width: '65%'}}></div>
                            </div>
                            
                            <div className="flex justify-between items-center text-sm pt-2">
                                <span className="text-slate-600">Internal / Admin</span>
                                <span className="font-mono font-bold">05:45</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-slate-400 h-full" style={{width: '25%'}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
