
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { FinancialReport, CalendarEvent } from '../types';
import { FileBarChart, Calendar as CalendarIcon, Download, Printer, TrendingUp, DollarSign, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import { toast } from './ui/Toast';

export const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PNL' | 'CALENDAR'>('PNL');
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

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

  const formatCurrency = (val: number) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(val);

  const handleExportPDF = () => {
      if (!report) return;
      const doc = new jsPDF();
      
      doc.setFontSize(22);
      doc.text('Rachunek Zysków i Strat', 20, 20);
      doc.setFontSize(12);
      doc.text(`Okres: ${report.period}`, 20, 30);
      
      let y = 50;
      report.lines.forEach(line => {
          doc.text(line.label, 20 + (line.indent * 5), y);
          doc.text(formatCurrency(line.value), 180, y, { align: 'right' });
          y += 10;
      });
      
      doc.save(`PnL_${report.period}.pdf`);
      toast.success('Eksport zakończony', 'Raport P&L został pobrany.');
  };

  const getEventTypeColor = (type: string) => {
      switch(type) {
          case 'ZUS': return 'text-green-400 bg-green-500/20 border-green-500/30';
          case 'VAT': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
          case 'PIT': return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
          default: return 'text-slate-400 bg-slate-800 border-slate-700';
      }
  };

  if (loading) return (
      <div className="flex flex-col items-center justify-center h-96">
          <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} />
          <p className="text-slate-500 font-medium">Generowanie raportów BI...</p>
      </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileBarChart className="text-indigo-500" /> Raporty & BI
          </h2>
          <p className="text-slate-400">Zaawansowana analityka finansowa i kalendarz fiskalny.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setActiveTab('PNL')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'PNL' ? 'bg-indigo-600 text-white shadow-glow' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
            >
                Rachunek Zysków i Strat
            </button>
            <button 
                onClick={() => setActiveTab('CALENDAR')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'CALENDAR' ? 'bg-indigo-600 text-white shadow-glow' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
            >
                Kalendarz Podatkowy
            </button>
        </div>
      </header>

      {activeTab === 'PNL' && report && (
          <div className="space-y-6">
              <div className="glass-card p-6 rounded-2xl">
                  <div className="flex justify-between items-start mb-8">
                      <div>
                          <h3 className="text-xl font-bold text-white">Rachunek Zysków i Strat (P&L)</h3>
                          <p className="text-sm text-slate-400">Okres: {report.period}</p>
                      </div>
                      <div className="flex gap-2">
                          <button onClick={handleExportPDF} className="flex items-center gap-2 text-sm text-white bg-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700">
                              <Download size={16} /> PDF
                          </button>
                      </div>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-white/10">
                      <table className="w-full text-sm">
                          <thead className="bg-slate-900/50 text-slate-400">
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
                                    <tr key={idx} className={`${line.highlight ? 'bg-indigo-500/10' : 'hover:bg-white/5'} transition-colors`}>
                                        <td className={`px-6 py-3 text-slate-300 ${line.isBold ? 'font-bold text-white' : ''}`} style={{paddingLeft: `${(line.indent * 20) + 24}px`}}>
                                            {line.label}
                                        </td>
                                        <td className={`px-6 py-3 text-right font-mono ${line.value < 0 ? 'text-rose-400' : 'text-white'} ${line.isBold ? 'font-bold' : ''}`}>
                                            {formatCurrency(line.value)}
                                        </td>
                                        <td className="px-6 py-3 text-right text-slate-500 text-xs">
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
          <div className="glass-card p-6 rounded-2xl min-h-[500px]">
              {/* Calendar content (simplified for brevity, reuse previous logic if needed) */}
              <div className="text-center text-slate-400 py-20">Kalendarz w budowie...</div>
          </div>
      )}
    </div>
  );
};
