
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
            case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-200';
            case 'COMPLETED': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'ARCHIVED': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <FolderKanban className="text-indigo-600" /> Controlling Projektów
                    </h2>
                    <p className="text-slate-500 mt-1">Analiza rentowności i zarządzanie budżetami projektowymi.</p>
                </div>
                <button 
                    onClick={() => toast.info('Nowy Projekt', 'Kreator projektu dostępny w pełnej wersji.')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-sm"
                >
                    <Plus size={18} /> Nowy Projekt
                </button>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase">Aktywne Budżety</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-2">
                        {loading ? '...' : formatCurrency(projects.filter(p => p.status === 'ACTIVE').reduce((acc, p) => acc + p.budget, 0))}
                    </h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase">Łączna Rentowność (Margin)</p>
                    <h3 className="text-3xl font-bold text-green-600 mt-2">
                        {loading ? '...' : '42.5%'}
                    </h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase">Koszty Projektowe (YTD)</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-2">
                        {loading ? '...' : formatCurrency(projects.reduce((acc, p) => acc + p.spent, 0))}
                    </h3>
                </div>
            </div>

            {/* Project List */}
            <div className="grid grid-cols-1 gap-6">
                {loading ? [1,2].map(i => <div key={i} className="h-40 bg-slate-100 rounded-xl animate-pulse" />) : 
                    projects.map(project => {
                        const progress = (project.spent / project.budget) * 100;
                        const isOverBudget = progress > 100;
                        
                        return (
                            <div key={project.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group relative overflow-hidden">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-slate-900">{project.name}</h3>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusStyle(project.status)}`}>
                                                {project.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 flex items-center gap-2">
                                            <span className="font-medium text-slate-700">{project.client}</span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span>Start: {project.startDate}</span>
                                        </p>
                                        <div className="flex gap-2 mt-3">
                                            {project.tags.map(tag => (
                                                <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium">#{tag}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex gap-8 items-center w-full md:w-auto">
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500 uppercase font-bold">Marża</p>
                                            <p className={`text-lg font-bold ${project.profitMargin > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {(project.profitMargin * 100).toFixed(1)}%
                                            </p>
                                        </div>
                                        <div className="w-px h-10 bg-slate-200 hidden md:block"></div>
                                        <div className="flex-1 md:w-64">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="font-bold text-slate-700">{formatCurrency(project.spent)}</span>
                                                <span className="text-slate-500">{formatCurrency(project.budget)}</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-indigo-600'}`} 
                                                    style={{width: `${Math.min(100, progress)}%`}}
                                                ></div>
                                            </div>
                                            <p className="text-[10px] text-right mt-1 text-slate-400">
                                                {progress.toFixed(0)}% budżetu
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="md:ml-4">
                                        <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* AI Insight */}
                                {project.profitMargin < 0.1 && (
                                    <div className="mt-6 bg-amber-50 border border-amber-100 p-3 rounded-lg flex gap-3 text-xs text-amber-800 items-start">
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
