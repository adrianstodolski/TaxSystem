
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { Budget } from '../types';
import { PieChart, Wallet, AlertTriangle, CheckCircle2, MoreHorizontal, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Modal } from './ui/Modal';
import { toast } from './ui/Toast';

export const Budgeting: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [editLimitModal, setEditLimitModal] = useState(false);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    const data = await NuffiService.fetchBudgets();
    setBudgets(data);
    setLoading(false);
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(val);

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'SAFE': return 'bg-green-500';
          case 'WARNING': return 'bg-amber-500';
          case 'EXCEEDED': return 'bg-red-500';
          default: return 'bg-gray-300';
      }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Wallet className="text-indigo-600" /> Smart Budgeting
          </h2>
          <p className="text-gray-500">Kontrola kosztów i prognozowanie wydatków firmowych.</p>
        </div>
        <button 
            onClick={() => toast.info('Funkcja demo', 'W pełnej wersji możesz definiować własne reguły budżetowe.')}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-50"
        >
            Konfiguruj limity
        </button>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                  <p className="text-indigo-200 text-sm font-medium uppercase">Całkowity Budżet</p>
                  <h3 className="text-3xl font-bold mt-1">4,500 PLN</h3>
                  <div className="mt-4 flex items-center gap-2 text-indigo-100 text-sm">
                      <CheckCircle2 size={16} /> Stan stabilny
                  </div>
              </div>
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <p className="text-gray-500 text-sm font-medium uppercase">Wydano w tym miesiącu</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">
                  {loading ? '...' : formatCurrency(budgets.reduce((acc, b) => acc + b.spent, 0))}
              </h3>
              <div className="mt-4 flex items-center gap-2 text-gray-400 text-sm">
                  <TrendingUp size={16} /> +12% vs poprzedni msc.
              </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <p className="text-gray-500 text-sm font-medium uppercase">Prognoza (Koniec msc.)</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">
                   {loading ? '...' : formatCurrency(budgets.reduce((acc, b) => acc + b.forecast, 0))}
              </h3>
              <div className="mt-4 flex items-center gap-2 text-amber-600 text-sm">
                  <AlertTriangle size={16} /> Może przekroczyć o 200 PLN
              </div>
          </div>
      </div>

      {/* Budget List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Kategorie Wydatków</h3>
          </div>
          
          <div className="p-6 space-y-8">
              {loading ? [1,2,3].map(i => <div key={i} className="h-20 bg-gray-50 rounded animate-pulse" />) : 
                budgets.map(budget => (
                  <div key={budget.id}>
                      <div className="flex justify-between items-end mb-2">
                          <div>
                              <div className="flex items-center gap-3">
                                  <h4 className="font-bold text-gray-900">{budget.category}</h4>
                                  {budget.status === 'EXCEEDED' && (
                                      <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Przekroczono</span>
                                  )}
                                  {budget.status === 'WARNING' && (
                                      <span className="bg-amber-100 text-amber-600 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Ryzyko</span>
                                  )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">Limit: {formatCurrency(budget.limit)} | Prognoza: {formatCurrency(budget.forecast)}</p>
                          </div>
                          <div className="text-right">
                              <span className="text-lg font-bold text-gray-900">{formatCurrency(budget.spent)}</span>
                              <span className="text-sm text-gray-400"> / {formatCurrency(budget.limit)}</span>
                          </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden relative">
                          {/* Forecast Marker (Ghost bar) */}
                          <div 
                            className="absolute h-full bg-gray-200/50 striped-bg" 
                            style={{width: `${Math.min(100, (budget.forecast / budget.limit) * 100)}%`}} 
                            title="Prognoza"
                          ></div>
                          
                          {/* Actual Spent */}
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${getStatusColor(budget.status)}`} 
                            style={{width: `${Math.min(100, budget.percentUsed)}%`}}
                          ></div>
                      </div>
                      
                      <div className="flex justify-between mt-2 text-xs text-gray-400">
                          <span>0 PLN</span>
                          <span>{budget.percentUsed.toFixed(0)}% wykorzystania</span>
                          <span>{formatCurrency(budget.limit)}</span>
                      </div>
                  </div>
              ))}
          </div>
      </div>
      
      <Modal isOpen={false} onClose={() => {}} title="">{null}</Modal>
    </div>
  );
};
