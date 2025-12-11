
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { TaxReturn, TaxStatus } from '../types';
import { Download, FileText, CheckCircle2, Search } from 'lucide-react';

export const History: React.FC = () => {
  const [history, setHistory] = useState<TaxReturn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      const data = await NuffiService.fetchHistory();
      setHistory(data);
      setLoading(false);
    };
    loadHistory();
  }, []);

  const getStatusColor = (status: TaxStatus) => {
    switch (status) {
      case TaxStatus.PAID: return 'bg-green-500/20 text-green-400 border-green-500/30';
      case TaxStatus.SUBMITTED: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-700 text-slate-400 border-slate-600';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Archiwum Deklaracji</h2>
          <p className="text-slate-400">Przeglądaj historię złożonych dokumentów i płatności.</p>
        </div>
      </header>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex gap-4 bg-slate-900/30">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Szukaj po roku lub typie..." 
                    className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            <select className="px-4 py-2 border border-white/10 rounded-lg text-sm bg-slate-900 text-white focus:ring-2 focus:ring-indigo-500">
                <option>Wszystkie lata</option>
                <option>2023</option>
                <option>2022</option>
                <option>2021</option>
            </select>
        </div>

        {loading ? (
             <div className="p-8 space-y-4">
                 {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-800/50 rounded animate-pulse" />)}
             </div>
        ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
                    <th className="p-4 font-semibold">Rok / Typ</th>
                    <th className="p-4 font-semibold">ID Dokumentu</th>
                    <th className="p-4 font-semibold">Data Wysyłki</th>
                    <th className="p-4 font-semibold">Kwota Podatku</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Akcje</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                {history.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400">
                                <FileText size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-white">{item.type}</p>
                                <p className="text-xs text-slate-500">Rok {item.year}</p>
                            </div>
                        </div>
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-500">{item.id}</td>
                    <td className="p-4 text-sm text-slate-300">{item.submissionDate}</td>
                    <td className="p-4 font-bold text-white">{item.taxDue.toLocaleString()} PLN</td>
                    <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.status)}`}>
                            {item.status === 'PAID' ? 'OPŁACONY' : item.status}
                        </span>
                    </td>
                    <td className="p-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.upoId && (
                                <button className="flex items-center gap-1 text-xs bg-slate-800 border border-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-700 text-white font-medium">
                                    <Download size={14} />
                                    UPO
                                </button>
                            )}
                            <button className="flex items-center gap-1 text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-lg hover:bg-indigo-500/30 border border-indigo-500/30 font-medium">
                                Szczegóły
                            </button>
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
      </div>
    </div>
  );
};
