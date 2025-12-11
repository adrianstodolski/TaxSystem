
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { Project } from '../types';
import { FolderKanban, TrendingUp, AlertTriangle, CheckCircle2, Clock, Calendar, PieChart, MoreHorizontal, Plus } from 'lucide-react';
import { toast } from './ui/Toast';

export const Projects: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchProjects();
            setProjects(data);
            setLoading(false);
        };
        load();
    }, []);

    const formatCurrency = (val: number) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(val);

    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'ACTIVE': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'COMPLETED': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'ARCHIVED': return 'bg-zinc-800 text-zinc-400 border-zinc-700';
            default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <FolderKanban className="text-gold" /> Controlling Projektów
                    </h2>
                    <p className="text-zinc-400 mt-1">Analiza rentowności i zarządzanie budżetami projektowymi.</p>
                </div>
                <button 
                    onClick={() => toast.info('Nowy Projekt', 'Kreator projektu dostępny w pełnej wersji.')}
                    className="bg-gold text-black px-4 py-2 rounded-xl font-bold hover:bg-[#FCD34D] flex items-center gap-2 shadow-[0_0_20px_-5px_rgba(212,175,55,0.4)] transition-all"
                >
                    <Plus size={18} /> Nowy Projekt
                </button>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="neo-card p-6 rounded-2xl">
                    <p className="text-xs font-bold text-zinc-500 uppercase">Aktywne Budżety</p>
                    <h3 className="text-3xl font-bold text-white mt-2 font-mono">
                        {loading ? '...' : formatCurrency(projects.filter(p => p.status === 'ACTIVE').reduce((acc, p) => acc + p.budget, 0))}
                    </h3>
                </div>
                <div className="neo-card p-6 rounded-2xl">
                    <p className="text-xs font-bold text-zinc-500 uppercase">Łączna Rentowność (Margin)</p>
                    <h3 className="text-3xl font-bold text-emerald-400 mt-2 font-mono">
                        {loading ? '...' : '42.5%'}
                    </h3>
                </div>
                <div className="neo-card p-6 rounded-2xl">
                    <p className="text-xs font-bold text-zinc-500 uppercase">Koszty Projektowe (YTD)</p>
                    <h3 className="text-3xl font-bold text-white mt-2 font-mono">
                        {loading ? '...' : formatCurrency(projects.reduce((acc, p) => acc + p.spent, 0))}
                    </h3>
                </div>
            </div>

            {/* Project List */}
            <div className="grid grid-cols-1 gap-6">
                {loading ? [1,2].map(i => <div key={i} className="h-40 bg-white/5 rounded-xl animate-pulse" />) : 
                    projects.map(project => {
                        const progress = (project.spent / project.budget) * 100;
                        const isOverBudget = progress > 100;
                        
                        return (
                            <div key={project.id} className="neo-card p-6 rounded-2xl hover:border-gold/30 transition-all group relative overflow-hidden">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-white">{project.name}</h3>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusStyle(project.status)}`}>
                                                {project.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-zinc-400 flex items-center gap-2">
                                            <span className="font-medium text-zinc-300">{project.client}</span>
                                            <span className="w-1 h-1 bg-zinc-600 rounded-full"></span>
                                            <span>Start: {project.startDate}</span>
                                        </p>
                                        <div className="flex gap-2 mt-3">
                                            {project.tags.map(tag => (
                                                <span key={tag} className="text-xs bg-black/40 text-zinc-400 px-2 py-1 rounded font-medium border border-white/5">#{tag}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex gap-8 items-center w-full md:w-auto">
                                        <div className="text-right">
                                            <p className="text-xs text-zinc-500 uppercase font-bold">Marża</p>
                                            <p className={`text-lg font-bold font-mono ${project.profitMargin > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {(project.profitMargin * 100).toFixed(1)}%
                                            </p>
                                        </div>
                                        <div className="w-px h-10 bg-white/10 hidden md:block"></div>
                                        <div className="flex-1 md:w-64">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="font-bold text-zinc-300">{formatCurrency(project.spent)}</span>
                                                <span className="text-zinc-500">{formatCurrency(project.budget)}</span>
                                            </div>
                                            <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
                                                <div 
                                                    className={`h-full rounded-full ${isOverBudget ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : 'bg-indigo-500 shadow-[0_0_10px_#6366f1]'}`} 
                                                    style={{width: `${Math.min(100, progress)}%`}}
                                                ></div>
                                            </div>
                                            <p className="text-[10px] text-right mt-1 text-zinc-500">
                                                {progress.toFixed(0)}% budżetu
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="md:ml-4">
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* AI Insight */}
                                {project.profitMargin < 0.1 && (
                                    <div className="mt-6 bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg flex gap-3 text-xs text-amber-400 items-start">
                                        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-bold">Nuffi AI Alert:</span> Projekt ma niską rentowność. 
                                            Koszty rosną szybciej niż przychody. Zalecana renegocjacja stawki lub audyt kosztów.
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};
