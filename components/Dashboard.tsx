
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, FileText, PieChart as PieChartIcon, Zap, Wallet, ArrowRight, ShieldCheck, Scale, Globe, BarChart2, MessageSquare, ScrollText, Store, Leaf, Sparkles, Telescope, Home, Landmark, Magnet } from 'lucide-react';
import { NuffiService } from '../services/api';
import { Transaction, ExpenseBreakdown, VatSummary, CashFlowPoint, Budget, AuditRiskFactor, MarketComparison, ViewState } from '../types';

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
}

const data = [
  { name: 'Sty', income: 45000, tax: 2400 },
  { name: 'Lut', income: 32000, tax: 1398 },
  { name: 'Mar', income: 28000, tax: 9800 },
  { name: 'Kwi', income: 55000, tax: 3908 },
  { name: 'Maj', income: 48000, tax: 4800 },
  { name: 'Cze', income: 62000, tax: 3800 },
  { name: 'Lip', income: 59000, tax: 4300 },
];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [vatSummary, setVatSummary] = useState<VatSummary | null>(null);
  const [cashFlow, setCashFlow] = useState<CashFlowPoint[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [auditRisks, setAuditRisks] = useState<AuditRiskFactor[]>([]);
  const [marketComp, setMarketComp] = useState<MarketComparison[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [txs, _, vat, flow, bud, risks, market] = await Promise.all([
        NuffiService.fetchRecentTransactions(),
        NuffiService.fetchExpensesBreakdown(),
        NuffiService.fetchVatSummary(),
        NuffiService.fetchCashFlowProjection(),
        NuffiService.fetchBudgets(),
        NuffiService.runAuditRiskAnalysis(),
        NuffiService.fetchMarketComparison()
      ]);
      setTransactions(txs);
      setVatSummary(vat);
      setCashFlow(flow);
      setBudgets(bud);
      setAuditRisks(risks);
      setMarketComp(market);
      setLoading(false);
    };
    loadData();
  }, []);

  const triggerAIAnalysis = () => {
      const event = new CustomEvent('nuffi:chat-prompt', {
          detail: { prompt: "Na podstawie widocznych danych na pulpicie, jak mogę zoptymalizować podatki w tym miesiącu? Przeanalizuj stosunek przychodów do kosztów i zasugeruj działania." }
      });
      window.dispatchEvent(event);
  };

  const highRisks = auditRisks.filter(r => r.severity === 'HIGH').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Pulpit Finansowy</h2>
            <p className="text-slate-500 mt-1">Przegląd kluczowych wskaźników efektywności (KPI).</p>
        </div>
        <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Dostępne Środki</p>
            <h3 className="text-3xl font-bold text-slate-900 font-mono">165,420.00 <span className="text-lg text-slate-400">PLN</span></h3>
        </div>
      </header>

      {/* NEW MODULES SHORTCUTS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button 
            onClick={() => onNavigate(ViewState.PREDICTIVE_TAX)}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all text-left group relative overflow-hidden"
          >
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Telescope size={64} className="text-indigo-600" />
              </div>
              <div className="bg-indigo-50 w-10 h-10 rounded-lg flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-110 transition-transform">
                  <Telescope size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Predictive Tax AI</h3>
              <p className="text-xs text-slate-500 mt-1">Prognozy i zmiany w prawie.</p>
              <span className="absolute top-2 right-2 bg-indigo-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">AI</span>
          </button>

          <button 
            onClick={() => onNavigate(ViewState.TAX_OPTIMIZER)}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-300 transition-all text-left group relative overflow-hidden"
          >
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Magnet size={64} className="text-orange-600" />
              </div>
              <div className="bg-orange-50 w-10 h-10 rounded-lg flex items-center justify-center text-orange-600 mb-3 group-hover:scale-110 transition-transform">
                  <Magnet size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Tax Optimizer (Hedge)</h3>
              <p className="text-xs text-slate-500 mt-1">Realizacja strat i optymalizacja.</p>
          </button>

          <button 
            onClick={() => onNavigate(ViewState.WEALTH)}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all text-left group relative overflow-hidden"
          >
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <TrendingUp size={64} className="text-emerald-600" />
              </div>
              <div className="bg-emerald-50 w-10 h-10 rounded-lg flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-110 transition-transform">
                  <TrendingUp size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Wealth (Inwestycje)</h3>
              <p className="text-xs text-slate-500 mt-1">Portfel Akcji, ETF i Surowców.</p>
          </button>

          <button 
            onClick={() => onNavigate(ViewState.LOANS)}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all text-left group relative overflow-hidden"
          >
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Landmark size={64} className="text-purple-600" />
              </div>
              <div className="bg-purple-50 w-10 h-10 rounded-lg flex items-center justify-center text-purple-600 mb-3 group-hover:scale-110 transition-transform">
                  <Landmark size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Kredyty i Leasing</h3>
              <p className="text-xs text-slate-500 mt-1">Tarcza odsetkowa i harmonogramy.</p>
          </button>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-slate-50 p-2 rounded-lg text-slate-600 border border-slate-100">
                <TrendingUp size={20} />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-100 px-2 py-1 rounded-full">+12%</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Przychód (YTD)</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1 font-mono">329,000.00</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
           <div className="flex justify-between items-start mb-4">
                <div className="bg-slate-50 p-2 rounded-lg text-slate-600 border border-slate-100">
                    <FileText size={20} />
                </div>
            </div>
          <div>
            <p className="text-sm font-medium text-slate-500">VAT Należny</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                {vatSummary ? (vatSummary.vatDue).toLocaleString('pl-PL', {minimumFractionDigits: 2}) : '...'}
            </h3>
          </div>
        </div>

        {/* AI TAX SHIELD (Smart Optimization) */}
        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow relative overflow-hidden group">
           <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-200/50 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-indigo-300/50 transition-colors"></div>
           <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 border border-indigo-200">
                    <ShieldCheck size={20} />
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-white/50 px-2 py-1 rounded border border-indigo-100">
                    AI OPTIMIZER
                </span>
            </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-indigo-800">Tarcza Podatkowa</p>
            <div className="flex items-baseline gap-2">
                 <h3 className="text-2xl font-bold text-indigo-900 mt-1 font-mono">
                    4,850.00
                </h3>
                <span className="text-xs font-bold text-indigo-500">+850 PLN w tym tyg.</span>
            </div>
            
            <div className="w-full bg-indigo-200 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full w-[65%]" title="65% optymalizacji wykorzystane"></div>
            </div>
            <button 
                onClick={triggerAIAnalysis}
                className="mt-3 flex items-center gap-1 text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded font-bold transition-colors shadow-sm"
            >
                <MessageSquare size={10} /> Analizuj z AI
            </button>
          </div>
        </div>

        {/* COMPLIANCE PULSE (AUDIT RISK) */}
        <div className={`p-6 rounded-xl border shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow relative overflow-hidden group ${highRisks > 0 ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-2 rounded-lg border ${highRisks > 0 ? 'bg-rose-100 text-rose-600 border-rose-200' : 'bg-emerald-100 text-emerald-600 border-emerald-200'}`}>
                    <Scale size={20} />
                </div>
            </div>
            <div className="relative z-10">
                <p className={`text-sm font-medium ${highRisks > 0 ? 'text-rose-800' : 'text-emerald-800'}`}>Compliance Pulse</p>
                <div className="flex items-center gap-2 mt-1">
                    <h3 className={`text-xl font-bold font-mono ${highRisks > 0 ? 'text-rose-900' : 'text-emerald-900'}`}>
                        {highRisks > 0 ? 'RYZYKO' : 'OK'}
                    </h3>
                    {highRisks > 0 && <span className="bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{highRisks} Issues</span>}
                </div>
                <p className={`text-[10px] mt-2 font-medium ${highRisks > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {highRisks > 0 ? 'Wykryto krytyczne anomalie (Tarcza).' : 'Brak zastrzeżeń AI.'}
                </p>
            </div>
        </div>
      </div>

      {/* MID SECTION: CASH FLOW & MARKET INTEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Runway */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        Płynność Finansowa (Cash Flow)
                    </h3>
                    <p className="text-slate-500 text-sm">Projekcja salda na 6 miesięcy.</p>
                </div>
                <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold uppercase tracking-wide border border-emerald-100">Pozytywny</span>
            </div>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashFlow}>
                    <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                    </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                    <Tooltip 
                        contentStyle={{borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    />
                    <Area type="monotone" dataKey="balance" stroke="#4F46E5" strokeWidth={2} fillOpacity={1} fill="url(#colorBalance)" />
                </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* GOVTECH MARKET BENCHMARK */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                <BarChart2 className="text-indigo-600" size={20} />
                <div>
                    <h3 className="text-lg font-bold text-slate-900">GovTech Benchmark</h3>
                    <p className="text-xs text-slate-500">Twoja firma na tle rynku (GUS)</p>
                </div>
            </div>
            
            <div className="space-y-6 flex-1">
                {marketComp.map((comp, i) => (
                    <div key={i}>
                        <div className="flex justify-between items-end mb-1 text-sm">
                            <span className="font-medium text-slate-600">{comp.metric}</span>
                            <span className={`font-bold ${comp.status === 'BETTER' ? 'text-green-600' : comp.status === 'WORSE' ? 'text-red-600' : 'text-slate-500'}`}>
                                {comp.status === 'BETTER' ? '+' : ''}{comp.difference}%
                            </span>
                        </div>
                        <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                            {/* Market Marker (Grey) */}
                            <div className="absolute top-0 bottom-0 w-1 bg-slate-400 z-10" style={{left: '50%'}}></div>
                            {/* Your Value Bar */}
                            <div 
                                className={`h-full rounded-full ${comp.status === 'BETTER' ? 'bg-green-500' : 'bg-red-500'}`} 
                                style={{
                                    width: `${Math.min(100, 50 + (comp.difference * 2))}%`, // Normalize around 50%
                                }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                            <span>Ty: {comp.myValue}</span>
                            <span>Rynek: {comp.marketValue}</span>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Powered by API Strateg (GUS)
                </span>
            </div>
        </div>
    </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Analiza Dochodowa</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#F8FAFC'}}
                  contentStyle={{borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Bar dataKey="income" name="Przychód" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="tax" name="Podatek" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* OSS & CROSS BORDER STATUS */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-6">
                <Globe className="text-indigo-600" size={20} />
                <h3 className="text-lg font-bold text-slate-900">OSS (Sprzedaż UE)</h3>
            </div>
            
            <div className="flex-1 flex flex-col justify-center items-center relative">
                <div className="w-40 h-40 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={[{name: 'Limit', value: 35}, {name: 'Reszta', value: 65}]}
                                innerRadius={60}
                                outerRadius={80}
                                startAngle={90}
                                endAngle={-270}
                                dataKey="value"
                            >
                                <Cell fill="#4F46E5" />
                                <Cell fill="#E2E8F0" />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-slate-900">35%</span>
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Limitu</span>
                    </div>
                </div>
                <p className="text-sm text-center text-slate-600 mt-4 px-4">
                    Sprzedaż do UE: <strong>14,500 PLN</strong> / 42,000 PLN limitu.
                </p>
                <div className="mt-4 flex gap-2">
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded">DE: 19%</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded">FR: 20%</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded">CZ: 21%</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
