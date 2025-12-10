
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { IndustryStat, MacroIndicator, MarketComparison } from '../types';
import { BarChart2, TrendingUp, TrendingDown, Info, Globe, Building, ArrowUpRight, ArrowDownRight, RefreshCw, Loader2, Database, FileText, PieChart, Activity, ShieldCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const MarketIntel: React.FC = () => {
    const [stats, setStats] = useState<IndustryStat[]>([]);
    const [macro, setMacro] = useState<MacroIndicator[]>([]);
    const [comp, setComp] = useState<MarketComparison[]>([]);
    const [govData, setGovData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const [s, m, g, c] = await Promise.all([
                NuffiService.fetchIndustryStats(),
                NuffiService.fetchMacroIndicators(),
                NuffiService.fetchGovTechData(),
                NuffiService.fetchMarketComparison()
            ]);
            setStats(s);
            setMacro(m);
            setGovData(g);
            setComp(c);
            setLoading(false);
        };
        load();
    }, []);

    const formatCurrency = (val: number) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Globe className="text-indigo-600" /> Market Intelligence (GovTech)
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Dane makroekonomiczne z GUS (API Strateg) i analiza konkurencji sektorowej.
                    </p>
                </div>
                <div className="flex gap-2">
                    <span className="text-xs font-bold text-slate-500 border border-slate-200 px-3 py-1.5 rounded flex items-center gap-2 bg-white">
                        <Building size={14} /> Źródło danych: GUS / BDL / SMUP
                    </span>
                </div>
            </header>

            {/* GovTech Data Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800 relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 text-indigo-300">
                            <Activity size={18} />
                            <span className="text-xs font-bold uppercase">Confidence Score</span>
                        </div>
                        <h3 className="text-4xl font-bold">98/100</h3>
                        <p className="text-xs text-slate-400 mt-1">Wiarygodność danych rządowych</p>
                    </div>
                    <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl -mr-8 -mt-8"></div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-colors">
                    <div className="flex items-center gap-3 mb-2 text-slate-500">
                        <FileText size={18} />
                        <span className="text-xs font-bold uppercase">SMUP Requests</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900">{govData?.smupRequests || '...'}</h3>
                    <p className="text-xs text-slate-400 mt-1">Dostęp do usług publicznych</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-colors">
                    <div className="flex items-center gap-3 mb-2 text-slate-500">
                        <Database size={18} />
                        <span className="text-xs font-bold uppercase">DBW Knowledge</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900">{govData?.dbwKbArticles || '...'}</h3>
                    <p className="text-xs text-slate-400 mt-1">Artykuły w Bazie Wiedzy</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-colors">
                    <div className="flex items-center gap-3 mb-2 text-slate-500">
                        <PieChart size={18} />
                        <span className="text-xs font-bold uppercase">SDP Status</span>
                    </div>
                    <h3 className="text-3xl font-bold text-green-600">{govData?.sdpTaxStatus || '...'}</h3>
                    <p className="text-xs text-slate-400 mt-1">System Danych Podatkowych</p>
                </div>
            </div>

            {/* BENCHMARKING SECTION */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8 relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
                        <BarChart2 /> Benchmarking (Ty vs Rynek)
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {comp.map((c, i) => (
                            <div key={i} className="bg-white/60 p-4 rounded-xl backdrop-blur-sm border border-white/50">
                                <p className="text-xs font-bold text-indigo-500 uppercase mb-2">{c.metric}</p>
                                <div className="flex justify-between items-end mb-2">
                                    <div>
                                        <p className="text-sm text-slate-500">Twoja Firma</p>
                                        <p className="text-2xl font-bold text-slate-900">{c.myValue}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-slate-500">Średnia</p>
                                        <p className="text-xl font-medium text-slate-600">{c.marketValue}</p>
                                    </div>
                                </div>
                                <div className={`text-sm font-bold flex items-center gap-1 ${c.status === 'BETTER' ? 'text-green-600' : 'text-red-600'}`}>
                                    {c.status === 'BETTER' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                    {c.difference > 0 ? '+' : ''}{c.difference}% vs średnia
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Background Map */}
                <div className="absolute right-0 bottom-0 opacity-5">
                    <Globe size={300} />
                </div>
            </div>

            {/* Industry Comparison Chart */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <BarChart2 className="text-slate-400" /> Analiza Sektorowa (Przychód vs Koszt)
                    </h3>
                </div>

                <div className="h-80">
                    {loading ? <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div> : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="sector" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                                <Tooltip 
                                    cursor={{fill: '#F8FAFC'}}
                                    contentStyle={{borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                                />
                                <Legend />
                                <Bar dataKey="avgRevenue" name="Śr. Przychód" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={40} />
                                <Bar dataKey="avgCost" name="Śr. Koszty" fill="#94A3B8" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Macro Indicators List */}
            <h3 className="font-bold text-slate-900 mt-8 mb-4">Wskaźniki Makroekonomiczne (Polska)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? [1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-xl animate-pulse" />) : 
                    macro.map(ind => (
                        <div key={ind.name} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-2">{ind.name}</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-3xl font-bold text-slate-900">
                                    {ind.value} <span className="text-lg text-slate-400 font-medium">{ind.unit}</span>
                                </h3>
                                <div className={`flex items-center gap-1 text-sm font-bold ${ind.trend === 'UP' ? 'text-green-600' : ind.trend === 'DOWN' ? 'text-blue-600' : 'text-slate-500'}`}>
                                    {ind.trend === 'UP' ? <ArrowUpRight size={18} /> : ind.trend === 'DOWN' ? <ArrowDownRight size={18} /> : '-'}
                                    {ind.trend}
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 text-right">{ind.date}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};
