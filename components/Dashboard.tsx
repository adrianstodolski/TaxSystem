
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { 
    TrendingUp, ShieldCheck, Scale, Globe, BarChart2, 
    ArrowUpRight, ArrowDownRight, Activity, Zap, 
    Wallet, Briefcase, FileText, AlertTriangle 
} from 'lucide-react';
import { NuffiService } from '../services/api';
import { ViewState } from '../types';
import { motion } from 'framer-motion';

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [data, setData] = useState<any[]>([]);
  const [netWorth, setNetWorth] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      // Simulation of loading data
      setTimeout(() => {
          setData([
              { name: 'Jan', revenue: 4000, cost: 2400 },
              { name: 'Feb', revenue: 3000, cost: 1398 },
              { name: 'Mar', revenue: 2000, cost: 9800 },
              { name: 'Apr', revenue: 2780, cost: 3908 },
              { name: 'May', revenue: 1890, cost: 4800 },
              { name: 'Jun', revenue: 2390, cost: 3800 },
              { name: 'Jul', revenue: 3490, cost: 4300 },
          ]);
          setNetWorth(1245000);
          setLoading(false);
      }, 1000);
  }, []);

  const Card = ({ children, className, colSpan = 1, rowSpan = 1 }: any) => (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300 ${className}`}
        style={{ gridColumn: `span ${colSpan}`, gridRow: `span ${rowSpan}` }}
      >
          {children}
      </motion.div>
  );

  return (
    <div className="p-2 space-y-6">
        <header className="flex justify-between items-end mb-8">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight font-mono">Intelligence<span className="text-indigo-500">HQ</span></h2>
                <p className="text-slate-400 mt-1">Real-time financial command center.</p>
            </div>
            <div className="flex gap-4">
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg shadow-indigo-900/20 transition-all flex items-center gap-2">
                    <Zap size={16} /> Quick Action
                </button>
            </div>
        </header>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[180px]">
            
            {/* 1. Net Worth (Large) */}
            <Card colSpan={2} rowSpan={2} className="flex flex-col justify-between bg-gradient-to-br from-slate-900 to-slate-900 border-indigo-500/20">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Net Worth</p>
                        <h3 className="text-5xl font-bold text-white font-mono tracking-tighter">
                            {loading ? '...' : (netWorth).toLocaleString('pl-PL')} <span className="text-xl text-slate-500">PLN</span>
                        </h3>
                    </div>
                    <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                        <TrendingUp className="text-emerald-400" size={24} />
                    </div>
                </div>
                
                <div className="h-48 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* 2. Tax Shield (Medium) */}
            <Card colSpan={1} rowSpan={2} className="relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ShieldCheck size={120} />
                </div>
                <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-4 text-indigo-400">
                        <ShieldCheck size={20} />
                        <span className="font-bold text-sm">AI Tax Shield</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center items-center text-center">
                        <div className="w-32 h-32 rounded-full border-4 border-indigo-500/30 flex items-center justify-center relative">
                            <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin duration-[3s]"></div>
                            <div>
                                <span className="text-2xl font-bold text-white">4.2k</span>
                                <p className="text-[10px] text-slate-400 uppercase">Saved</p>
                            </div>
                        </div>
                        <p className="mt-6 text-sm text-slate-400">
                            Auto-deductions active. <br/> <span className="text-indigo-400 cursor-pointer hover:underline">View Details</span>
                        </p>
                    </div>
                </div>
            </Card>

            {/* 3. Quick Stats (Small) */}
            <Card className="bg-slate-800/50">
                <div className="flex justify-between items-start">
                    <p className="text-slate-400 text-xs font-bold uppercase">Monthly Burn</p>
                    <Activity size={16} className="text-rose-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mt-2 font-mono">12,450 PLN</h3>
                <div className="mt-4 flex items-center gap-2 text-xs text-rose-400">
                    <ArrowUpRight size={12} /> +2.4% vs last month
                </div>
            </Card>

            {/* 4. Quick Stats (Small) */}
            <Card className="bg-slate-800/50">
                <div className="flex justify-between items-start">
                    <p className="text-slate-400 text-xs font-bold uppercase">Cash Runway</p>
                    <Wallet size={16} className="text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mt-2 font-mono">14 Months</h3>
                <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
                    <ShieldCheck size={12} /> Safe Zone
                </div>
            </Card>

            {/* 5. Allocation (Wide) */}
            <Card colSpan={2} className="flex items-center gap-8">
                <div className="flex-1">
                    <h4 className="text-white font-bold mb-2">Portfolio Allocation</h4>
                    <div className="space-y-2">
                        {['Stocks', 'Crypto', 'Real Estate'].map((item, i) => (
                            <div key={item} className="flex items-center gap-3 text-xs">
                                <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                                <span className="text-slate-300 w-20">{item}</span>
                                <div className="flex-1 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full" style={{width: `${70 - (i*20)}%`, backgroundColor: COLORS[i]}}></div>
                                </div>
                                <span className="text-white font-mono">{70 - (i*20)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-32 h-32 relative">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={[{value: 50}, {value: 30}, {value: 20}]}
                                innerRadius={25}
                                outerRadius={40}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* 6. Tasks / Notifications */}
            <Card colSpan={2} className="overflow-y-auto custom-scrollbar">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-400" /> Action Required
                </h4>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="bg-rose-500/20 p-2 rounded text-rose-400"><FileText size={16} /></div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-slate-200">VAT Declaration (JPK_V7)</p>
                            <p className="text-xs text-slate-500">Due in 2 days</p>
                        </div>
                        <ArrowUpRight size={16} className="text-slate-500" />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="bg-amber-500/20 p-2 rounded text-amber-400"><Briefcase size={16} /></div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-slate-200">Unpaid Invoice #4922</p>
                            <p className="text-xs text-slate-500">Client: Google Inc</p>
                        </div>
                        <ArrowUpRight size={16} className="text-slate-500" />
                    </div>
                </div>
            </Card>

        </div>
    </div>
  );
};
