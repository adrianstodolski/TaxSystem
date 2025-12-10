
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { FinancialReport, CalendarEvent } from '../types';
import { FileBarChart, Calendar as CalendarIcon, Download, Printer, TrendingUp, DollarSign, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Loader2 } from 'lucide-react';

export const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PNL' | 'CALENDAR'>('PNL');
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [rep, evs] = await Promise.all([
      NuffiService.fetchFinancialReport('Bieżący Miesiąc'),
      NuffiService.fetchFiscalCalendar()
    ]);
    setReport(rep);
    setEvents(evs);
    setLoading(false);
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(val);

  const getEventTypeColor = (type: string) => {
      switch(type) {
          case 'ZUS': return 'text-green-600 bg-green-100';
          case 'VAT': return 'text-blue-600 bg-blue-100';
          case 'PIT': return 'text-amber-600 bg-amber-100';
          default: return 'text-gray-600 bg-gray-100';
      }
  };

  if (loading) return (
      <div className="flex flex-col items-center justify-center h-96">
          <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
          <p className="text-gray-500 font-medium">Generowanie raportów BI...</p>
      </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileBarChart className="text-indigo-600" /> Raporty & BI
          </h2>
          <p className="text-gray-500">Zaawansowana analityka finansowa i kalendarz fiskalny.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setActiveTab('PNL')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'PNL' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
                Rachunek Zysków i Strat
            </button>
            <button 
                onClick={() => setActiveTab('CALENDAR')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'CALENDAR' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
                Kalendarz Podatkowy
            </button>
        </div>
      </header>

      {activeTab === 'PNL' && report && (
          <div className="space-y-6">
              {/* Report Header */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-8">
                      <div>
                          <h3 className="text-xl font-bold text-gray-900">Rachunek Zysków i Strat (P&L)</h3>
                          <p className="text-sm text-gray-500">Okres: {report.period}</p>
                      </div>
                      <div className="flex gap-2">
                          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                              <Printer size={16} /> Drukuj
                          </button>
                          <button className="flex items-center gap-2 text-sm text-white bg-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors">
                              <Download size={16} /> Export CSV
                          </button>
                      </div>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-gray-200">
                      <table className="w-full text-sm">
                          <thead className="bg-gray-50 text-gray-500">
                              <tr>
                                  <th className="px-6 py-3 text-left font-medium">Wyszczególnienie</th>
                                  <th className="px-6 py-3 text-right font-medium">Wartość PLN</th>
                                  <th className="px-6 py-3 text-right font-medium">Struktura %</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                              {report.lines.map((line, idx) => {
                                  const revenueLine = report.lines.find(l => l.type === 'REVENUE');
                                  const percentage = revenueLine && revenueLine.value !== 0 ? (Math.abs(line.value) / revenueLine.value) * 100 : 0;
                                  
                                  return (
                                    <tr key={idx} className={`${line.highlight ? 'bg-indigo-50/50' : 'bg-white'} hover:bg-gray-50 transition-colors`}>
                                        <td className={`px-6 py-3 text-gray-800 ${line.isBold ? 'font-bold' : ''}`} style={{paddingLeft: `${(line.indent * 20) + 24}px`}}>
                                            {line.label}
                                        </td>
                                        <td className={`px-6 py-3 text-right font-mono ${line.value < 0 ? 'text-red-600' : 'text-gray-900'} ${line.isBold ? 'font-bold' : ''}`}>
                                            {formatCurrency(line.value)}
                                        </td>
                                        <td className="px-6 py-3 text-right text-gray-400 text-xs">
                                            {line.type !== 'REVENUE' ? `${percentage.toFixed(1)}%` : '100%'}
                                        </td>
                                    </tr>
                                  );
                              })}
                          </tbody>
                      </table>
                  </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                      <p className="text-xs font-medium text-gray-500 uppercase">Marża Operacyjna</p>
                      <h4 className="text-3xl font-bold text-gray-900 mt-2">
                        {(() => {
                            const rev = report.lines.find(l => l.type === 'REVENUE')?.value || 1;
                            const ebit = report.lines.find(l => l.label.includes('EBIT'))?.value || 0;
                            return ((ebit / rev) * 100).toFixed(1) + '%';
                        })()}
                      </h4>
                      <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                          <TrendingUp size={14} /> Powyżej średniej
                      </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                      <p className="text-xs font-medium text-gray-500 uppercase">EBITDA</p>
                      <h4 className="text-3xl font-bold text-gray-900 mt-2">
                          {formatCurrency(report.lines.find(l => l.label === 'EBITDA')?.value || 0)}
                      </h4>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                      <p className="text-xs font-medium text-gray-500 uppercase">Zysk Netto</p>
                      <h4 className="text-3xl font-bold text-indigo-600 mt-2">
                          {formatCurrency(report.lines.find(l => l.label === 'Zysk Netto')?.value || 0)}
                      </h4>
                  </div>
              </div>
          </div>
      )}

      {activeTab === 'CALENDAR' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 min-h-[500px]">
              <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-6">
                  <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
                      <CalendarIcon size={24} />
                  </div>
                  <div>
                      <h3 className="text-xl font-bold text-gray-900">Kalendarz Fiskalny</h3>
                      <p className="text-sm text-gray-500">Nadchodzące terminy płatności podatków i składek.</p>
                  </div>
              </div>

              <div className="relative">
                  {/* Vertical Line */}
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                  <div className="space-y-8">
                      {events.map((ev, idx) => {
                          const isPast = new Date(ev.date) < new Date();
                          return (
                              <div key={ev.id} className="relative flex items-center gap-6 group">
                                  {/* Dot */}
                                  <div className={`absolute left-8 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 ${
                                      ev.status === 'PAID' ? 'bg-green-500' : isPast ? 'bg-red-500' : 'bg-indigo-500'
                                  }`}></div>

                                  {/* Content */}
                                  <div className="ml-16 flex-1 bg-white border border-gray-200 p-4 rounded-xl shadow-sm group-hover:shadow-md transition-shadow flex items-center justify-between">
                                      <div className="flex items-center gap-4">
                                          <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center text-xs font-bold ${getEventTypeColor(ev.type)}`}>
                                              <span>{new Date(ev.date).getDate()}</span>
                                              <span className="opacity-75">{new Date(ev.date).toLocaleString('pl-PL', {month: 'short'}).toUpperCase()}</span>
                                          </div>
                                          <div>
                                              <h4 className="font-bold text-gray-900">{ev.title}</h4>
                                              <p className="text-sm text-gray-500">
                                                  {ev.amount > 0 ? `Do zapłaty: ${formatCurrency(ev.amount)}` : 'Termin złożenia deklaracji'}
                                              </p>
                                          </div>
                                      </div>

                                      <div className="flex items-center gap-4">
                                          {ev.status === 'PAID' ? (
                                              <span className="flex items-center gap-1 text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-full">
                                                  <CheckCircle2 size={16} /> Opłacono
                                              </span>
                                          ) : (
                                              <button className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-bold bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-full transition-colors">
                                                  <DollarSign size={16} /> Zapłać teraz
                                              </button>
                                          )}
                                          
                                          {isPast && ev.status !== 'PAID' && (
                                              <span className="flex items-center gap-1 text-red-600 font-bold text-xs" title="Termin minął">
                                                  <AlertCircle size={16} />
                                              </span>
                                          )}
                                      </div>
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
