
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { Contractor, WhiteListStatus } from '../types';
import { Users, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Search, Briefcase, ShieldAlert, Loader2, ArrowRight } from 'lucide-react';
import { toast } from './ui/Toast';

export const Contractors: React.FC = () => {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // White List Check
  const [wlNip, setWlNip] = useState('');
  const [wlIban, setWlIban] = useState('');
  const [wlStatus, setWlStatus] = useState<WhiteListStatus | null>(null);
  const [wlChecking, setWlChecking] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await NuffiService.fetchContractors();
      setContractors(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleWhiteListCheck = async () => {
      if(!wlNip || !wlIban) return;
      setWlChecking(true);
      const res = await NuffiService.verifyWhiteList(wlNip, wlIban);
      setWlStatus(res);
      setWlChecking(false);
      
      if(res.status === 'VALID') toast.success('Weryfikacja pozytywna', 'Rachunek znajduje się na Białej Liście VAT.');
      else toast.error('Ostrzeżenie', 'Rachunek NIE widnieje na Białej Liście VAT!');
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(val);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-indigo-400" /> Kontrahenci (CRM)
          </h2>
          <p className="text-slate-400">Baza partnerów biznesowych i weryfikacja compliance.</p>
        </div>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
                type="text" 
                placeholder="Szukaj po NIP lub nazwie..." 
                className="pl-10 pr-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none w-64"
            />
        </div>
      </header>

      {/* WHITE LIST CHECKER TOOL */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-800">
          <div className="relative z-10 flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                      <ShieldAlert className="text-green-400" /> Weryfikacja Białej Listy VAT
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                      Sprawdź, czy rachunek bankowy kontrahenta jest zgłoszony w Ministerstwie Finansów. Weryfikacja jest niezbędna dla płatności powyżej 15 tys. zł.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        value={wlNip}
                        onChange={e => setWlNip(e.target.value)}
                        placeholder="NIP Kontrahenta" 
                        className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-slate-500"
                      />
                      <input 
                        type="text" 
                        value={wlIban}
                        onChange={e => setWlIban(e.target.value)}
                        placeholder="Numer Rachunku (IBAN)" 
                        className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-slate-500"
                      />
                  </div>
                  <button 
                    onClick={handleWhiteListCheck}
                    disabled={wlChecking || !wlNip || !wlIban}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50 shadow-lg shadow-indigo-900/50"
                  >
                      {wlChecking ? <Loader2 className="animate-spin" size={16} /> : 'Weryfikuj w MF'} <ArrowRight size={16} />
                  </button>
              </div>

              {/* Result Panel */}
              {wlStatus && (
                  <div className={`w-full md:w-64 rounded-xl p-4 border flex flex-col items-center justify-center text-center animate-in zoom-in ${wlStatus.status === 'VALID' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                      {wlStatus.status === 'VALID' ? (
                          <>
                            <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-3">
                                <CheckCircle2 size={24} />
                            </div>
                            <h4 className="font-bold text-green-400">Rachunek Poprawny</h4>
                            <p className="text-xs text-slate-400 mt-2">ID: {wlStatus.requestId}</p>
                          </>
                      ) : (
                          <>
                            <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-3">
                                <AlertTriangle size={24} />
                            </div>
                            <h4 className="font-bold text-red-400">Ostrzeżenie</h4>
                            <p className="text-xs text-red-200 mt-2">Rachunek nieaktywny lub niezgłoszony!</p>
                          </>
                      )}
                  </div>
              )}
          </div>
          {/* Deco */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-500/20 p-2 rounded-lg text-green-400"><TrendingUp size={20} /></div>
                  <span className="text-slate-400 font-medium text-sm">Top Klient (Przychód)</span>
              </div>
              <h3 className="text-xl font-bold text-white truncate">Design Studio Creative</h3>
              <p className="text-sm text-green-400 font-bold mt-1">+5,535.00 PLN</p>
          </div>
          <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                  <div className="bg-red-500/20 p-2 rounded-lg text-red-400"><TrendingDown size={20} /></div>
                  <span className="text-slate-400 font-medium text-sm">Top Dostawca (Koszt)</span>
              </div>
              <h3 className="text-xl font-bold text-white truncate">Hosting Solutions Sp. z o.o.</h3>
              <p className="text-sm text-red-400 font-bold mt-1">-123.00 PLN</p>
          </div>
          <div className="glass-card p-6 rounded-2xl">
               <div className="flex items-center gap-3 mb-2">
                  <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400"><Briefcase size={20} /></div>
                  <span className="text-slate-400 font-medium text-sm">Aktywni Partnerzy</span>
              </div>
              <h3 className="text-3xl font-bold text-white">{contractors.length}</h3>
          </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? [1,2,3].map(i => <div key={i} className="h-48 bg-slate-800/50 rounded-xl animate-pulse" />) : 
            contractors.map(c => (
              <div key={c.id} className="glass-card p-6 rounded-2xl hover:shadow-glow transition-all relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-4">
                      <div>
                          <h4 className="font-bold text-white line-clamp-1" title={c.name}>{c.name}</h4>
                          <p className="text-xs text-slate-500 font-mono">NIP: {c.nip}</p>
                      </div>
                      {c.risk.whiteListStatus === 'VERIFIED' ? (
                          <div className="text-green-500" title="Biała Lista VAT: OK"><CheckCircle2 size={18} /></div>
                      ) : (
                          <div className="text-amber-500" title="Biała Lista VAT: Nieznany"><AlertTriangle size={18} /></div>
                      )}
                  </div>

                  <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Obrót całkowity</span>
                          <span className="font-bold text-white">{formatCurrency(c.totalSales + c.totalPurchases)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Faktury</span>
                          <span className="font-bold text-white">{c.invoiceCount}</span>
                      </div>
                       <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Ost. kontakt</span>
                          <span className="text-slate-300">{c.lastInteraction}</span>
                      </div>
                  </div>

                  {c.totalSales > c.totalPurchases ? (
                      <div className="mt-4 pt-4 border-t border-white/10">
                          <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold border border-green-500/30">
                              <TrendingUp size={12} /> Klient
                          </span>
                      </div>
                  ) : (
                       <div className="mt-4 pt-4 border-t border-white/10">
                          <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-bold border border-red-500/30">
                              <TrendingDown size={12} /> Dostawca
                          </span>
                      </div>
                  )}
                  
                  {c.isNuffiUser && (
                       <div className="mt-2 text-xs text-indigo-400 font-bold flex items-center gap-1">
                           <CheckCircle2 size={12} /> Używa Nuffi Network
                       </div>
                  )}

                  {/* Risk Badge */}
                  {c.risk.dependency === 'HIGH' && (
                       <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold">
                           RYZYKO ZALEŻNOŚCI
                       </div>
                  )}
              </div>
            ))
          }
      </div>
    </div>
  );
};
