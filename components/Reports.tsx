
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { FinancialReport, CalendarEvent } from '../types';
import { FileBarChart, Download, Loader2, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Wallet } from 'lucide-react';
import jsPDF from 'jspdf';
import { toast } from './ui/Toast';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine, CartesianGrid } from 'recharts';

export const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PNL' | 'CALENDAR' | 'WATERFALL'>('WATERFALL');
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const load = async () => {
      const [rep, evs] = await Promise.all([
        NuffiService.fetchFinancialReport('Bieżący Miesiąc'),
        NuffiService.fetchFiscalCalendar()
      ]);
      setReport(rep);
      setEvents(evs);
      setLoading(false);
    };
    load();
  }, []);

  const formatCurrency = (val: number) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(val);

  const handleExportPDF = () => {
      if (!report) return;
      const doc = new jsPDF();
      doc.text('Rachunek Zysków i Strat', 20, 20);
      doc.save(`PnL_${report.period}.pdf`);
      toast.success('Eksport zakończony', 'Raport P&L został pobrany.');
  };

  // Waterfall Data Generation
  const waterfallData = report ? [
      { name: 'Przychód', value: report.lines.find(l => l.type === 'REVENUE')?.value || 0, fill: '#10b981' }, // Green
      { name: 'Koszty', value: report.lines.find(l => l.type === 'COST')?.value || 0, fill: '#ef4444' }, // Red
      { name: 'Podatek', value: -12000, fill: '#f59e0b' }, // Amber (Mock tax)
      { name: 'Zysk Netto', value: 73000, fill: '#3b82f6', isTotal: true } // Blue
  ] : [];

  // --- CALENDAR LOGIC ---
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
      const day = new Date(year, month, 1).getDay();
      return day === 0 ? 6 : day - 1; // Adjust for Monday start
  };

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const renderCalendar = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = getDaysInMonth(year, month);
      const firstDay = getFirstDayOfMonth(year, month);
      const days = [];

      for (let i = 0; i < firstDay; i++) {
          days.push(<div key={`empty-${i}`} className="h-28 bg-[#0A0A0C]/50 border border-white/5 opacity-50"></div>);
      }

      for (let d = 1; d <= daysInMonth; d++) {
          const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();
          days.push(
              <div key={d} className={`h-28 border border-white/5 p-2 relative group hover:bg-white/5 transition-colors ${isToday ? 'bg-white/5' : 'bg-[#0A0A0C]'}`}>
                  <span className={`text-xs font-bold ${isToday ? 'text-gold' : 'text-zinc-500'} block mb-1`}>
                      {d}
                  </span>
                  <div className="space-y-1">
                      {/* Mock dots for visual density */}
                      {d % 5 === 0 && <div className="h-1.5 w-full bg-blue-500/30 rounded-full"></div>}
                      {d === 20 && <div className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded truncate border border-amber-500/30">PIT-5</div>}
                      {d === 25 && <div className="text-[9px] bg-green-500/20 text-green-300 px-1 rounded truncate border border-green-500/30">VAT-7</div>}
                  </div>
              </div>
          );
      }
      return days;
  };

  if (loading) return (
      <div className="flex flex-col items-center justify-center h-96">
          <Loader2 className="animate-spin text-gold mb-4" size={48} />
          <p className="text-zinc-500 font-medium">Generowanie raportów BI...</p>
      </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileBarChart className="text-gold" /> Raporty & BI
          </h2>
          <p className="text-zinc-400 mt-1">Zaawansowana analityka finansowa i kalendarz fiskalny.</p>
        </div>
        <div className="flex bg-onyx p-1 rounded-xl border border-white/10">
            <button onClick={() => setActiveTab('WATERFALL')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'WATERFALL' ? 'bg-gold text-black' : 'text-zinc-500 hover:text-white'}`}>Cash Flow</button>
            <button onClick={() => setActiveTab('PNL')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'PNL' ? 'bg-gold text-black' : 'text-zinc-500 hover:text-white'}`}>P&L</button>
            <button onClick={() => setActiveTab('CALENDAR')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'CALENDAR' ? 'bg-gold text-black' : 'text-zinc-500 hover:text-white'}`}>Kalendarz</button>
        </div>
      </header>

      {activeTab === 'WATERFALL' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4">
              <div className="lg:col-span-2 neo-card p-8 rounded-2xl relative overflow-hidden">
                  <div className="flex justify-between items-center mb-6 relative z-10">
                      <h3 className="font-bold text-white flex items-center gap-2"><Wallet size={18} className="text-zinc-400"/> Przepływ Kapitału (Netto)</h3>
                      <span className="text-xs bg-white/5 px-2 py-1 rounded text-zinc-400 border border-white/5">YTD 2023</span>
                  </div>
                  <div className="h-80 w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={waterfallData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v/1000}k`} />
                                <Tooltip 
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                    contentStyle={{backgroundColor: '#0A0A0C', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff'}}
                                    formatter={(value: number) => formatCurrency(value)}
                                />
                                <ReferenceLine y={0} stroke="#333" />
                                <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                                    {waterfallData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                  </div>
                  {/* Grid BG */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
              </div>

              <div className="neo-card p-6 rounded-2xl flex flex-col justify-center border-l-4 border-emerald-500">
                  <p className="text-zinc-500 text-xs font-bold uppercase mb-2">Zysk Netto (Retained)</p>
                  <h3 className="text-4xl font-bold text-white font-mono tracking-tight mb-4">{formatCurrency(73000)}</h3>
                  
                  <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                          <span className="text-zinc-400">Marża Operacyjna</span>
                          <span className="text-white font-bold">62%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full" style={{width: '62%'}}></div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl text-xs text-zinc-400 leading-relaxed border border-white/5">
                          Twój wynik netto jest o <strong>12% wyższy</strong> niż średnia w branży IT/Software.
                      </div>
                  </div>
              </div>
          </div>
      )}

      {activeTab === 'PNL' && report && (
          <div className="space-y-6 animate-in fade-in">
              <div className="neo-card p-6 rounded-2xl">
                  <div className="flex justify-between items-start mb-8">
                      <div>
                          <h3 className="text-xl font-bold text-white">Rachunek Zysków i Strat (P&L)</h3>
                          <p className="text-sm text-zinc-400">Okres: {report.period}</p>
                      </div>
                      <div className="flex gap-2">
                          <button onClick={handleExportPDF} className="flex items-center gap-2 text-sm text-white bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors border border-white/10">
                              <Download size={16} /> PDF
                          </button>
                      </div>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-white/5">
                      <table className="w-full text-sm">
                          <thead className="bg-white/5 text-zinc-400">
                              <tr>
                                  <th className="px-6 py-3 text-left font-medium">Wyszczególnienie</th>
                                  <th className="px-6 py-3 text-right font-medium">Wartość PLN</th>
                                  <th className="px-6 py-3 text-right font-medium">Struktura %</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                              {report.lines.map((line, idx) => {
                                  const revenueLine = report.lines.find(l => l.type === 'REVENUE');
                                  const percentage = revenueLine && revenueLine.value !== 0 ? (Math.abs(line.value) / revenueLine.value) * 100 : 0;
                                  
                                  return (
                                    <tr key={idx} className={`${line.highlight ? 'bg-gold/10' : 'hover:bg-white/5'} transition-colors`}>
                                        <td className={`px-6 py-3 text-zinc-300 ${line.isBold ? 'font-bold text-white' : ''}`} style={{paddingLeft: `${(line.indent * 20) + 24}px`}}>
                                            {line.label}
                                        </td>
                                        <td className={`px-6 py-3 text-right font-mono ${line.value < 0 ? 'text-rose-400' : 'text-white'} ${line.isBold ? 'font-bold' : ''}`}>
                                            {formatCurrency(line.value)}
                                        </td>
                                        <td className="px-6 py-3 text-right text-zinc-500 text-xs">
                                            {line.type !== 'REVENUE' ? `${percentage.toFixed(1)}%` : '100%'}
                                        </td>
                                    </tr>
                                  );
                              })}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      )}
      
      {activeTab === 'CALENDAR' && (
          <div className="neo-card p-6 rounded-2xl min-h-[600px] animate-in fade-in">
              <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <CalendarIcon className="text-gold" /> Terminarz Fiskalny
                      </h3>
                      <div className="text-sm font-mono text-zinc-400 bg-white/5 px-3 py-1 rounded border border-white/5">
                          {currentDate.toLocaleString('pl-PL', { month: 'long', year: 'numeric' }).toUpperCase()}
                      </div>
                  </div>
                  <div className="flex gap-2">
                      <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors border border-white/10">
                          <ChevronLeft size={20} />
                      </button>
                      <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors border border-white/10">
                          <ChevronRight size={20} />
                      </button>
                  </div>
              </div>

              <div className="grid grid-cols-7 gap-px bg-white/10 border border-white/10 rounded-xl overflow-hidden">
                  {['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'].map(d => (
                      <div key={d} className="bg-[#141419] p-3 text-center text-xs font-bold text-zinc-500 uppercase tracking-wider">
                          {d}
                      </div>
                  ))}
                  {renderCalendar()}
              </div>
          </div>
      )}
    </div>
  );
};
