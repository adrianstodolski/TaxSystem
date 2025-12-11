
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { 
    TrendingUp, ShieldCheck, Activity, Zap, 
    Wallet, Briefcase, FileText, AlertTriangle,
    PieChart as PieChartIcon, ArrowUpRight, Building, Landmark
} from 'lucide-react';
import { NuffiService } from '../services/api';
import { ViewState, Workspace } from '../types';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [data, setData] = useState<any[]>([]);
  const [metric1, setMetric1] = useState(0); // Revenue or Net Worth
  const [metric2, setMetric2] = useState(0); // Tax Due or PnL
  const [loading, setLoading] = useState(true);
  const { activeWorkspace } = useStore();

  useEffect(() => {
      setLoading(true);
      // Simulation of loading data tailored to workspace
      const timer = setTimeout(() => {
          if (activeWorkspace === Workspace.BUSINESS) {
              setData([
                  { name: 'Sty', value: 4000, cost: 2400 },
                  { name: 'Lut', value: 3000, cost: 1398 },
                  { name: 'Mar', value: 2000, cost: 9800 },
                  { name: 'Kwi', value: 2780, cost: 3908 },
                  { name: 'Maj', value: 1890, cost: 4800 },
                  { name: 'Cze', value: 2390, cost: 3800 },
              ]);
              setMetric1(124500); // Cash Flow
              setMetric2(18500); // Tax Due
          } else {
              // Investor Data
              setData([
                  { name: 'Sty', value: 110000 },
                  { name: 'Lut', value: 115000 },
                  { name: 'Mar', value: 108000 },
                  { name: 'Kwi', value: 122000 },
                  { name: 'Maj', value: 128000 },
                  { name: 'Cze', value: 135000 },
              ]);
              setMetric1(1350000); // Total Net Worth
              setMetric2(45000); // Unrealized PnL
          }
          setLoading(false);
      }, 800);
      return () => clearTimeout(timer);
  }, [activeWorkspace]);

  const Card = ({ children, className, colSpan = 1, rowSpan = 1, delay = 0, glow = false }: any) => (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        className={`${glow ? 'glass-card-glow' : 'glass-card'} rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 ${className}`}
        style={{ gridColumn: `span ${colSpan}`, gridRow: `span ${rowSpan}` }}
      >
          {children}
      </motion.div>
  );

  const allocationData = activeWorkspace === Workspace.BUSINESS 
    ? [{ name: 'Usługi IT', value: 60 }, { name: 'Konsulting', value: 30 }, { name: 'Produkty', value: 10 }]
    : [{ name: 'Akcje', value: 40 }, { name: 'Krypto', value: 30 }, { name: 'Nieruchomości', value: 20 }, { name: 'Gotówka', value: 10 }];

  const isBusiness = activeWorkspace === Workspace.BUSINESS;

  return (
    <div className="p-2 space-y-6 pb-20">
        <header className="flex justify-between items-end mb-8">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight font-mono">
                    {isBusiness ? 'Company' : 'Wealth'}<span className={isBusiness ? 'text-indigo-500' : 'text-emerald-500'}>OS</span>
                </h2>
                <p className="text-slate-400 mt-1">
                    {isBusiness ? 'Centrum zarządzania operacyjnego firmą.' : 'Globalny panel inwestycyjny.'}
                </p>
            </div>
            <div className="flex gap-4">
                <button 
                    onClick={() => onNavigate(isBusiness ? ViewState.DOCUMENTS : ViewState.WAR_ROOM)}
                    className={`text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg transition-all flex items-center gap-2 ${isBusiness ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/20' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20'}`}
                >
                    <Zap size={16} /> {isBusiness ? 'Nowa Faktura' : 'War Room'}
                </button>
            </div>
        </header>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[180px]">
            
            {/* 1. Main Metric (Large) */}
            <Card colSpan={2} rowSpan={2} className={`flex flex-col justify-between bg-gradient-to-br from-slate-900 to-slate-950 ${isBusiness ? 'border-indigo-500/20' : 'border-emerald-500/20'}`} delay={0} glow={true}>
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className={`${isBusiness ? 'text-indigo-300' : 'text-emerald-300'} text-xs font-bold uppercase tracking-wider mb-2`}>
                            {isBusiness ? 'Przepływy Pieniężne (YTD)' : 'Wartość Netto (Net Worth)'}
                        </p>
                        <h3 className="text-5xl font-bold text-white font-mono tracking-tighter drop-shadow-lg">
                            {loading ? '...' : (metric1).toLocaleString('pl-PL')} <span className="text-xl text-slate-500">PLN</span>
                        </h3>
                    </div>
                    <div className={`${isBusiness ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'} p-2 rounded-lg border`}>
                        {isBusiness ? <Building size={24} /> : <Landmark size={24} />}
                    </div>
                </div>
                
                <div className="h-48 w-full mt-4 -mb-4 -mx-4">
                    {!loading && data.length > 0 && (
                        <div style={{ width: '100%', height: '100%', minHeight: '150px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={isBusiness ? '#6366f1' : '#10b981'} stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor={isBusiness ? '#6366f1' : '#10b981'} stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke={isBusiness ? '#6366f1' : '#10b981'} strokeWidth={3} fillOpacity={1} fill="url(#colorMain)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
                
                {/* Background Glow */}
                <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none ${isBusiness ? 'bg-indigo-500/10' : 'bg-emerald-500/10'}`}></div>
            </Card>

            {/* 2. Secondary Metric (Medium) */}
            <Card colSpan={1} rowSpan={2} className="relative flex flex-col items-center justify-center bg-slate-900/80" delay={0.1}>
                <div className="absolute top-4 left-4 text-slate-400 flex items-center gap-2">
                    <ShieldCheck size={20} />
                    <span className="font-bold text-sm text-xs uppercase">{isBusiness ? 'Est. Podatek (CIT/PIT)' : 'Zysk Niezrealizowany'}</span>
                </div>
                
                <div className="relative w-40 h-40 flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                    <div className={`absolute inset-0 border-4 rounded-full border-t-transparent animate-spin duration-[4s] shadow-[0_0_15px_rgba(255,255,255,0.1)] ${isBusiness ? 'border-rose-500' : 'border-emerald-500'}`}></div>
                    <div className="text-center">
                        <span className={`text-2xl font-bold font-mono ${isBusiness ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {loading ? '...' : (metric2/1000).toFixed(1)}k
                        </span>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">PLN</p>
                    </div>
                </div>
                
                <p className="mt-6 text-sm text-slate-400 text-center max-w-[200px]">
                    {isBusiness ? 'Termin płatności: 20-go.' : 'Wzrost portfela o 12%.'} <br/> 
                    <span className="text-indigo-400 cursor-pointer hover:underline text-xs" onClick={() => onNavigate(isBusiness ? ViewState.TAX_WIZARD : ViewState.WEALTH)}>Szczegóły &rarr;</span>
                </p>
            </Card>

            {/* 3. Operational Stat (Small) */}
            <Card className="bg-slate-800/30" delay={0.2}>
                <div className="flex justify-between items-start">
                    <p className="text-slate-400 text-xs font-bold uppercase">{isBusiness ? 'Koszty (Burn)' : 'Płynność (Cash)'}</p>
                    <Activity size={16} className={isBusiness ? "text-rose-400" : "text-blue-400"} />
                </div>
                <h3 className="text-2xl font-bold text-white mt-2 font-mono">12,450 PLN</h3>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <ArrowUpRight size={12} /> {isBusiness ? '+2.4% m/m' : 'Dostępne T+0'}
                </div>
            </Card>

            {/* 4. Alert Stat (Small) */}
            <Card className="bg-slate-800/30" delay={0.3}>
                <div className="flex justify-between items-start">
                    <p className="text-slate-400 text-xs font-bold uppercase">{isBusiness ? 'Cash Runway' : 'Risk Score'}</p>
                    <Wallet size={16} className={isBusiness ? "text-emerald-400" : "text-amber-400"} />
                </div>
                <h3 className="text-2xl font-bold text-white mt-2 font-mono">{isBusiness ? '14 Msc' : '65/100'}</h3>
                <div className={`mt-4 flex items-center gap-2 text-xs font-medium ${isBusiness ? 'text-emerald-400' : 'text-amber-400'}`}>
                    <ShieldCheck size={12} /> {isBusiness ? 'Bezpiecznie' : 'Umiarkowane'}
                </div>
            </Card>

            {/* 5. Allocation (Wide) */}
            <Card colSpan={2} className="flex items-center gap-8 bg-slate-900/60" delay={0.4}>
                <div className="flex-1">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                        <PieChartIcon className="text-indigo-400" size={16} /> {isBusiness ? 'Struktura Przychodu' : 'Alokacja Aktywów'}
                    </h4>
                    <div className="space-y-3">
                        {allocationData.map((item, i) => (
                            <div key={item.name} className="flex items-center gap-3 text-xs">
                                <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                                <span className="text-slate-300 w-24 font-medium truncate">{item.name}</span>
                                <div className="flex-1 bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full" style={{width: `${item.value}%`, backgroundColor: COLORS[i % COLORS.length]}}></div>
                                </div>
                                <span className="text-white font-mono">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-32 h-32 relative">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={allocationData}
                                innerRadius={25}
                                outerRadius={40}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {allocationData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* 6. Tasks / Notifications */}
            <Card colSpan={2} className="overflow-y-auto custom-scrollbar bg-slate-900/60" delay={0.5}>
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-400" /> Action Required
                </h4>
                <div className="space-y-3">
                    {isBusiness ? (
                        <>
                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                                <div className="bg-rose-500/20 p-2 rounded text-rose-400"><FileText size={16} /></div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-200">Deklaracja VAT-7</p>
                                    <p className="text-xs text-slate-500">Termin: 25.10 (Za 3 dni)</p>
                                </div>
                                <ArrowUpRight size={16} className="text-slate-500 group-hover:text-white transition-colors" />
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                                <div className="bg-amber-500/20 p-2 rounded text-amber-400"><Briefcase size={16} /></div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-200">Nieopłacona faktura (Google)</p>
                                    <p className="text-xs text-slate-500">Kwota: 450 PLN</p>
                                </div>
                                <ArrowUpRight size={16} className="text-slate-500 group-hover:text-white transition-colors" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                                <div className="bg-blue-500/20 p-2 rounded text-blue-400"><TrendingUp size={16} /></div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-200">Rebalansowanie Portfela</p>
                                    <p className="text-xs text-slate-500">Odbiegasz od celu o 5%</p>
                                </div>
                                <ArrowUpRight size={16} className="text-slate-500 group-hover:text-white transition-colors" />
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                                <div className="bg-emerald-500/20 p-2 rounded text-emerald-400"><Wallet size={16} /></div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-200">Dywidenda (Apple)</p>
                                    <p className="text-xs text-slate-500">Wpłynęło: $12.50 (Wymaga rozliczenia)</p>
                                </div>
                                <ArrowUpRight size={16} className="text-slate-500 group-hover:text-white transition-colors" />
                            </div>
                        </>
                    )}
                </div>
            </Card>

        </div>
    );
};
    