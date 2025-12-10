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
      case TaxStatus.PAID: return 'bg-green-100 text-green-700 border-green-200';
      case TaxStatus.SUBMITTED: return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Archiwum Deklaracji</h2>
          <p className="text-gray-500">Przeglądaj historię złożonych dokumentów i płatności.</p>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Szukaj po roku lub typie..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-700">
                <option>Wszystkie lata</option>
                <option>2023</option>
                <option>2022</option>
                <option>2021</option>
            </select>
        </div>

        {loading ? (
             <div className="p-8 space-y-4">
                 {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-50 rounded animate-pulse" />)}
             </div>
        ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold">Rok / Typ</th>
                    <th className="p-4 font-semibold">ID Dokumentu</th>
                    <th className="p-4 font-semibold">Data Wysyłki</th>
                    <th className="p-4 font-semibold">Kwota Podatku</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Akcje</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {history.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                                <FileText size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{item.type}</p>
                                <p className="text-xs text-gray-500">Rok {item.year}</p>
                            </div>
                        </div>
                    </td>
                    <td className="p-4 font-mono text-xs text-gray-500">{item.id}</td>
                    <td className="p-4 text-sm text-gray-700">{item.submissionDate}</td>
                    <td className="p-4 font-bold text-gray-900">{item.taxDue.toLocaleString()} PLN</td>
                    <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.status)}`}>
                            {item.status === 'PAID' ? 'OPŁACONY' : item.status}
                        </span>
                    </td>
                    <td className="p-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.upoId && (
                                <button className="flex items-center gap-1 text-xs bg-white border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
                                    <Download size={14} />
                                    UPO
                                </button>
                            )}
                            <button className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 font-medium">
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