
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { 
    TrendingUp, ShieldCheck, Activity, Zap, 
    Wallet, Briefcase, FileText, AlertTriangle,
    PieChart as PieChartIcon, ArrowUpRight, Building, Landmark,
    Gem, CheckCircle2, Cpu, Server, Lock
} from 'lucide-react';
import { ViewState, Workspace } from '../types';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
}

const COLORS = ['#D4AF37', '#64748B', '#3f3f46', '#18181b'];

const SystemBootCheck = ({ onComplete }: { onComplete: () => void }) => {
    const steps = [
        { id: 'core', label: 'Inicjalizacja Jądra Nuffi OS...' },
        { id: 'sec', label: 'Weryfikacja Modułów Bezpieczeństwa (HSM)...' },
        { id: 'ai', label: 'Ładowanie Modeli Gemini AI...' },
        { id: 'net', label: 'Nawiązywanie połączenia z KSeF Gateway...' },
    ];
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (currentStep < steps.length) {
            const timer = setTimeout(() => setCurrentStep(prev => prev + 1), 400);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(onComplete, 800);
            return () => clearTimeout(timer);
        }
    }, [currentStep]);

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="mb-6 bg-black/40 border border-white/10 rounded-xl p-4 font-mono text-xs text-zinc-400 relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-gold"></div>
            {steps.map((step, i) => (
                <div key={step.id} className={`flex items-center gap-3 mb-1 ${i > currentStep ? 'opacity-0' : 'opacity-100 transition-opacity'}`}>
                    <span className={i < currentStep ? "text-green-500" : "text-gold"}>
                        {i < currentStep ? "[OK]" : "[..]"}
                    </span>
                    <span className={i === currentStep ? "text-white animate-pulse" : "text-zinc-400"}>
                        {step.label}
                    </span>
                </div>
            ))}
            {currentStep === steps.length && (
                <div className="mt-2 text-green-400 font-bold">>> SYSTEM READY. WELCOME COMMANDER.</div>
            )}
        </motion.div>
    );
};

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [data, setData] = useState<any[]>([]);
  const [metric1, setMetric1] = useState(0); 
  const [metric2, setMetric2] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [showBoot, setShowBoot] = useState(true);
  
  const { activeWorkspace } = useStore();
  const isBusiness = activeWorkspace === Workspace.BUSINESS;

  useEffect(() => {
      setLoading(true);
      const timer = setTimeout(() => {
          if (isBusiness) {
              setData([
                  { name: 'Sty', value: 4000 },
                  { name: 'Lut', value: 3000 },
                  { name: 'Mar', value: 2000 },
                  { name: 'Kwi', value: 2780 },
                  { name: 'Maj', value: 1890 },
                  { name: 'Cze', value: 2390 },
              ]);
              setMetric1(124500); 
              setMetric2(18500); 
          } else {
              setData([
                  { name: 'Sty', value: 110000 },
                  { name: 'Lut', value: 115000 },
                  { name: 'Mar', value: 108000 },
                  { name: 'Kwi', value: 122000 },
                  { name: 'Maj', value: 128000 },
                  { name: 'Cze', value: 135000 },
              ]);
              setMetric1(1350000); 
              setMetric2(45000); 
          }
          setLoading(false);
      }, 600);
      return () => clearTimeout(timer);
  }, [activeWorkspace, isBusiness]);

  const Card = ({ children, className, colSpan = 1, rowSpan = 1, delay = 0 }: any) => (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        className={`neo-card rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 ${className}`}
        style={{ gridColumn: `span ${colSpan}`, gridRow: `span ${rowSpan}` }}
      >
          {children}
      </motion.div>
  );

  const allocationData = isBusiness 
    ? [{ name: 'Usługi IT', value: 60 }, { name: 'Konsulting', value: 30 }, { name: 'Produkty', value: 10 }]
    : [{ name: 'Akcje', value: 40 }, { name: 'Krypto', value: 30 }, { name: 'Nieruchomości', value: 20 }, { name: 'Gotówka', value: 10 }];

  return (
    <div className="space-y-6 pb-20">
        <header className="flex justify-between items-end mb-4">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight font-mono">
                    {isBusiness ? 'Company' : 'Wealth'}<span className="text-gold">OS</span>
                </h2>
                <p className="text-zinc-400 mt-1">
                    {isBusiness ? 'Centrum zarządzania operacyjnego firmą.' : 'Globalny panel inwestycyjny i podatkowy.'}
                </p>
            </div>
            <div className="flex gap-4">
                <button 
                    onClick={() => onNavigate(isBusiness ? ViewState.DOCUMENTS : ViewState.WAR_ROOM)}
                    className="bg-gold hover:bg-[#FCD34D] text-black px-4 py-2 rounded-xl font-bold text-sm shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all flex items-center gap-2"
                >
                    <Zap size={16} /> {isBusiness ? 'Nowa Faktura' : 'War Room (Live)'}
                </button>
            </div>
        </header>

        <AnimatePresence>
            {showBoot && <SystemBootCheck onComplete={() => setShowBoot(false)} />}
        </AnimatePresence>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[180px]">
            
            {/* 1. Main Metric (Large) */}
            <Card colSpan={2} rowSpan={2} className="flex flex-col justify-between" delay={0}>
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
                            {isBusiness ? 'Przepływy Pieniężne (YTD)' : 'Wartość Netto (Net Worth)'}
                        </p>
                        <h3 className="text-5xl font-bold text-white font-mono tracking-tighter drop-shadow-lg">
                            {loading ? '...' : (metric1).toLocaleString('pl-PL')} <span className="text-xl text-zinc-600">PLN</span>
                        </h3>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-gold">
                        {isBusiness ? <Building size={32} /> : <Landmark size={32} />}
                    </div>
                </div>
                
                <div className="h-48 w-full mt-4 -mb-4 -mx-4">
                    {!loading && (
                        <div style={{ width: '100%', height: '100%', minHeight: '150px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0A0A0C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorMain)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </Card>

            {/* 2. Secondary Metric (Medium) */}
            <Card colSpan={1} rowSpan={2} className="relative flex flex-col items-center justify-center bg-gradient-to-b from-[#0A0A0C] to-[#141419]" delay={0.1}>
                <div className="absolute top-6 left-6 text-zinc-500 flex items-center gap-2">
                    <ShieldCheck size={20} />
                    <span className="font-bold text-xs uppercase">{isBusiness ? 'Est. Podatek' : 'PnL Niezrealizowany'}</span>
                </div>
                
                <div className="relative w-40 h-40 flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
                    <div className="absolute inset-0 border-4 rounded-full border-t-transparent animate-spin duration-[4s] shadow-[0_0_15px_rgba(255,255,255,0.05)] border-white/30"></div>
                    <div className="text-center">
                        <span className="text-2xl font-bold font-mono text-white">
                            {loading ? '...' : (metric2/1000).toFixed(1)}k
                        </span>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">PLN</p>
                    </div>
                </div>
                
                <div className="mt-8 w-full px-6">
                    <button 
                        onClick={() => onNavigate(isBusiness ? ViewState.TAX_WIZARD : ViewState.WEALTH)}
                        className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-white transition-colors border border-white/5"
                    >
                        Szczegóły
                    </button>
                </div>
            </Card>

            {/* 3. Operational Stat (Small) */}
            <Card delay={0.2}>
                <div className="flex justify-between items-start">
                    <p className="text-zinc-500 text-xs font-bold uppercase">{isBusiness ? 'Koszty (Burn)' : 'Płynność (Cash)'}</p>
                    <Activity size={16} className="text-zinc-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mt-2 font-mono">12,450 PLN</h3>
                <div className="mt-4 flex items-center gap-2 text-xs text-zinc-400 font-medium">
                    <ArrowUpRight size={12} className="text-emerald-500" /> {isBusiness ? '+2.4% m/m' : 'Dostępne T+0'}
                </div>
            </Card>

            {/* 4. Alert Stat (Small) */}
            <Card delay={0.3}>
                <div className="flex justify-between items-start">
                    <p className="text-zinc-500 text-xs font-bold uppercase">{isBusiness ? 'Cash Runway' : 'Risk Score'}</p>
                    <Wallet size={16} className="text-zinc-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mt-2 font-mono">{isBusiness ? '14 Msc' : '65/100'}</h3>
                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-400">
                    <ShieldCheck size={12} /> {isBusiness ? 'Bezpiecznie' : 'Umiarkowane'}
                </div>
            </Card>

            {/* 5. Allocation (Wide) */}
            <Card colSpan={2} className="flex items-center gap-8" delay={0.4}>
                <div className="flex-1">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                        <PieChartIcon className="text-gold" size={16} /> {isBusiness ? 'Struktura Przychodu' : 'Alokacja Aktywów'}
                    </h4>
                    <div className="space-y-3">
                        {allocationData.map((item, i) => (
                            <div key={item.name} className="flex items-center gap-3 text-xs">
                                <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                                <span className="text-zinc-300 w-24 font-medium truncate">{item.name}</span>
                                <div className="flex-1 bg-white/5 h-1.5 rounded-full overflow-hidden">
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

            {/* 6. Action Items (Context Aware) */}
            <Card colSpan={2} className="overflow-y-auto custom-scrollbar" delay={0.5}>
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-zinc-400" /> Action Required
                </h4>
                <div className="space-y-3">
                    {isBusiness ? (
                        <>
                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:border-gold/30 transition-all cursor-pointer group">
                                <div className="bg-white/10 p-2 rounded text-white"><FileText size={16} /></div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-white group-hover:text-gold transition-colors">Deklaracja VAT-7</p>
                                    <p className="text-xs text-zinc-500">Termin: 25.10 (Za 3 dni)</p>
                                </div>
                                <ArrowUpRight size={16} className="text-zinc-600 group-hover:text-white transition-colors" />
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:border-gold/30 transition-all cursor-pointer group">
                                <div className="bg-white/10 p-2 rounded text-white"><Briefcase size={16} /></div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-white group-hover:text-gold transition-colors">Nieopłacona faktura (Google)</p>
                                    <p className="text-xs text-zinc-500">Kwota: 450 PLN</p>
                                </div>
                                <ArrowUpRight size={16} className="text-zinc-600 group-hover:text-white transition-colors" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:border-gold/30 transition-all cursor-pointer group">
                                <div className="bg-white/10 p-2 rounded text-white"><TrendingUp size={16} /></div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-white group-hover:text-gold transition-colors">Rebalansowanie Portfela</p>
                                    <p className="text-xs text-zinc-500">Odbiegasz od celu o 5%</p>
                                </div>
                                <ArrowUpRight size={16} className="text-zinc-600 group-hover:text-white transition-colors" />
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:border-gold/30 transition-all cursor-pointer group">
                                <div className="bg-white/10 p-2 rounded text-white"><Gem size={16} /></div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-white group-hover:text-gold transition-colors">Nowy Yield Farm</p>
                                    <p className="text-xs text-zinc-500">Arbitrum: 24% APY Stable</p>
                                </div>
                                <ArrowUpRight size={16} className="text-zinc-600 group-hover:text-white transition-colors" />
                            </div>
                        </>
                    )}
                </div>
            </Card>

        </div>
    );
};
