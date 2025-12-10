
import React, { useEffect, useState, useRef } from 'react';
import { NuffiService } from '../services/api';
import { Invoice, CostCategory, InvoiceItem, RecurringInvoice, RecurringSuggestion, NbpTable } from '../types';
import { RefreshCw, Filter, TrendingUp, TrendingDown, FileSpreadsheet, Eye, Tag, UploadCloud, Loader2, CheckSquare, Square, Layers, Plus, Send, Download, MoreHorizontal, Repeat, Globe, ShieldAlert, CheckCircle2, AlertTriangle, Play, Sparkles, Info, X, FileSignature } from 'lucide-react';
import { Modal } from './ui/Modal';
import { toast } from './ui/Toast';

export const Documents: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [recurringInvoices, setRecurringInvoices] = useState<RecurringInvoice[]>([]);
  const [activeTab, setActiveTab] = useState<'INVOICES' | 'RECURRING'>('INVOICES');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'SALES' | 'PURCHASE'>('ALL');
  
  // Smart Suggestions
  const [suggestions, setSuggestions] = useState<RecurringSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // OCR State
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Deep Dive State
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);

  // Bulk Action State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // KSeF Generator State
  const [ksefModalOpen, setKsefModalOpen] = useState(false);
  const [newInvoiceNip, setNewInvoiceNip] = useState('');
  const [newInvoiceCurrency, setNewInvoiceCurrency] = useState('PLN');
  const [nbpData, setNbpData] = useState<NbpTable | null>(null);
  const [newInvoiceItems, setNewInvoiceItems] = useState<InvoiceItem[]>([{name: 'Usługa programistyczna', quantity: 1, unitPriceNet: 100, totalNet: 100, vatRate: 0.23}]);
  const [isGeneratingKsef, setIsGeneratingKsef] = useState(false);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    const [inv, rec, sugg] = await Promise.all([
        NuffiService.fetchInvoices(),
        NuffiService.fetchRecurringInvoices(),
        NuffiService.getSmartRecurringSuggestions()
    ]);
    setInvoices(inv);
    setRecurringInvoices(rec);
    setSuggestions(sugg);
    setLoading(false);
  };

  const handleInspect = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setInspectModalOpen(true);
  };

  const handleCategoryChange = async (category: CostCategory) => {
    if (!selectedInvoice) return;
    const updatedInvoice = { ...selectedInvoice, costCategory: category };
    setSelectedInvoice(updatedInvoice);
    setInvoices(prev => prev.map(i => i.id === selectedInvoice.id ? updatedInvoice : i));
    await NuffiService.updateInvoiceCategory(selectedInvoice.id, category);
    toast.success('Kategoria zaktualizowana', `Zmieniono odliczenie kosztów na ${category}`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if(!file) return;

      setIsUploading(true);
      try {
          const newInv = await NuffiService.uploadDocument(file);
          setInvoices([newInv, ...invoices]);
          toast.success('Faktura przetworzona', 'OCR poprawnie odczytał dane z pliku.');
      } catch (err) {
          toast.error('Błąd OCR', 'Nie udało się przetworzyć pliku.');
      } finally {
          setIsUploading(false);
          if(fileInputRef.current) fileInputRef.current.value = '';
      }
  };

  const toggleSelection = (id: string) => {
      const newSet = new Set(selectedIds);
      if(newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      setSelectedIds(newSet);
  };

  const toggleAll = () => {
      if(selectedIds.size === filteredInvoices.length) {
          setSelectedIds(new Set());
      } else {
          setSelectedIds(new Set(filteredInvoices.map(i => i.id)));
      }
  };

  const handleBulkCategorize = async (category: CostCategory) => {
      if(selectedIds.size === 0) return;
      setIsBulkProcessing(true);
      const ids = Array.from(selectedIds) as string[];
      await NuffiService.bulkUpdateCategory(ids, category);
      setInvoices(prev => prev.map(inv => ids.includes(inv.id) ? {...inv, costCategory: category} : inv));
      toast.success('Masowa aktualizacja', `Zaktualizowano ${ids.length} dokumentów.`);
      setIsBulkProcessing(false);
      setSelectedIds(new Set());
  };

  const handleCurrencyChange = async (curr: string) => {
      setNewInvoiceCurrency(curr);
      if(curr !== 'PLN') {
          const table = await NuffiService.fetchNbpTable(curr, new Date().toISOString().split('T')[0]);
          setNbpData(table);
      } else {
          setNbpData(null);
      }
  };

  const handleGenerateKsef = async () => {
      setIsGeneratingKsef(true);
      try {
          const xmlId = await NuffiService.generateKsefInvoice(newInvoiceNip, newInvoiceItems);
          toast.success('Wysłano do KSeF', `Dokument przyjęty. ID: ${xmlId}`);
          setKsefModalOpen(false);
          loadInvoices(); // Refresh
      } catch (e) {
          toast.error('Błąd KSeF', 'Walidacja schemy XML nie powiodła się.');
      } finally {
          setIsGeneratingKsef(false);
      }
  };

  const handleTriggerRecurring = async (rec: RecurringInvoice) => {
      toast.success('Faktura wygenerowana', `Utworzono fakturę z szablonu "${rec.templateName}"`);
      // Mock update
      loadInvoices();
  };

  const handleSendToDocuSign = async (inv: Invoice) => {
      toast.info('DocuSign', 'Wysyłanie umowy do podpisu elektronicznego...');
      // Simulate API call
      await new Promise(r => setTimeout(r, 1500));
      toast.success('Wysłano do podpisu', 'Dokument został wysłany przez DocuSign API.');
  };

  const filteredInvoices = invoices.filter(inv => filter === 'ALL' || inv.type === filter);

  // Smart Suggestion Component
  const SmartSuggestionBanner = () => {
      if(!showSuggestions || suggestions.length === 0) return null;
      const sugg = suggestions[0]; // Show first for now

      return (
          <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100 flex items-start justify-between relative overflow-hidden">
              <div className="flex gap-3 relative z-10">
                  <div className="bg-white p-2 rounded-lg shadow-sm text-indigo-600">
                      <Sparkles size={20} className="fill-indigo-100" />
                  </div>
                  <div>
                      <h4 className="font-bold text-indigo-900 text-sm">Nuffi AI: Wykryto wzorzec cykliczny</h4>
                      <p className="text-sm text-indigo-700 mt-1">
                          Wystawiasz faktury dla <strong>{sugg.contractorName}</strong> regularnie. 
                          Utwórz automat i oszczędź {sugg.potentialSavingsTime}.
                      </p>
                      <button 
                        onClick={() => {
                            toast.success('Utworzono automat', `Szablon dla ${sugg.contractorName} dodany.`);
                            setShowSuggestions(false);
                        }}
                        className="mt-3 bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                          Konfiguruj automat
                      </button>
                  </div>
              </div>
              <button onClick={() => setShowSuggestions(false)} className="text-indigo-300 hover:text-indigo-500 relative z-10">
                  <X size={16} />
              </button>
              {/* Decorative sparkle */}
              <div className="absolute -right-4 -top-4 text-purple-200 opacity-20">
                  <Sparkles size={100} />
              </div>
          </div>
      );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative pb-20">
      <header className="flex justify-between items-center border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            Dokumenty
            <span className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px] px-2 py-0.5 rounded font-mono uppercase tracking-wide">KSeF Live</span>
          </h2>
          <p className="text-slate-500 mt-1">Rejestr faktur (FA-2) zsynchronizowany z Ministerstwem Finansów.</p>
        </div>
        <div className="flex gap-3">
            <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex">
                <button 
                    onClick={() => setActiveTab('INVOICES')}
                    className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${activeTab === 'INVOICES' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Faktury
                </button>
                <button 
                    onClick={() => setActiveTab('RECURRING')}
                    className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${activeTab === 'RECURRING' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Cykliczne
                </button>
            </div>
             <button 
                onClick={() => setKsefModalOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-bold text-sm"
            >
                <Plus size={16} />
                <span>Nowa Faktura</span>
            </button>
            <button 
                onClick={() => { setLoading(true); loadInvoices(); toast.info('Synchronizacja KSeF', 'Pobieranie nowych dokumentów z MF...'); }}
                className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium text-sm"
            >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Sprzedaż (Miesiąc)</p>
                <TrendingUp className="text-emerald-500" size={18} />
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">7,535.00 <span className="text-sm text-slate-400">PLN</span></div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Koszty (Miesiąc)</p>
                <TrendingDown className="text-rose-500" size={18} />
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">150.00 <span className="text-sm text-slate-400">PLN</span></div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Odliczenie VAT</p>
                <FileSpreadsheet className="text-blue-500" size={18} />
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">34.50 <span className="text-sm text-slate-400">PLN</span></div>
          </div>
      </div>

      <SmartSuggestionBanner />

      {activeTab === 'RECURRING' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-right-4">
              <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <Repeat className="text-indigo-600" size={18} /> Automatyczne Fakturowanie (Smart Recurring)
                  </h3>
                  <button className="text-xs font-bold text-indigo-600 border border-indigo-200 bg-indigo-50 px-3 py-1.5 rounded hover:bg-indigo-100">+ Dodaj Schemat</button>
              </div>
              <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                      <tr>
                          <th className="px-6 py-3">Szablon</th>
                          <th className="px-6 py-3">Kontrahent</th>
                          <th className="px-6 py-3">Częstotliwość</th>
                          <th className="px-6 py-3">Następna emisja</th>
                          <th className="px-6 py-3 text-right">Kwota Netto</th>
                          <th className="px-6 py-3 text-right">Akcja</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {recurringInvoices.map(rec => (
                          <tr key={rec.id} className="hover:bg-slate-50">
                              <td className="px-6 py-4 font-bold text-slate-900">{rec.templateName}</td>
                              <td className="px-6 py-4">{rec.contractor.name}</td>
                              <td className="px-6 py-4">
                                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">{rec.frequency}</span>
                              </td>
                              <td className="px-6 py-4 font-mono">{rec.nextIssueDate}</td>
                              <td className="px-6 py-4 text-right font-mono font-bold">{rec.amountNet.toFixed(2)} PLN</td>
                              <td className="px-6 py-4 text-right">
                                  <button onClick={() => handleTriggerRecurring(rec)} className="bg-slate-900 text-white px-3 py-1.5 rounded font-bold text-xs hover:bg-slate-700 flex items-center gap-1 ml-auto">
                                      <Play size={12} /> Wystaw Teraz
                                  </button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      )}

      {activeTab === 'INVOICES' && (
        <>
            {/* OCR Upload Zone */}
            <div 
                className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 flex items-center justify-center gap-4 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group"
                onClick={() => fileInputRef.current?.click()}
            >
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.jpg,.png" />
                
                <div className="bg-white p-3 rounded-full border border-slate-200 text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-colors">
                    {isUploading ? <Loader2 className="animate-spin" /> : <UploadCloud />}
                </div>
                <div className="text-left">
                    <h3 className="font-bold text-slate-700 text-sm group-hover:text-indigo-700">Import Spoza KSeF</h3>
                    <p className="text-slate-500 text-xs">Wgraj fakturę zagraniczną lub skan (OCR).</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-12 overflow-hidden">
                {/* Toolbar */}
                <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                    <div className="flex gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button onClick={() => setFilter('ALL')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${filter === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Wszystkie</button>
                        <button onClick={() => setFilter('SALES')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${filter === 'SALES' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Sprzedaż</button>
                        <button onClick={() => setFilter('PURCHASE')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${filter === 'PURCHASE' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Zakup</button>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"><Filter size={16} /></button>
                        <button className="p-2 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"><Download size={16} /></button>
                    </div>
                </div>

                {/* Data Grid */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-8 space-y-4">{[1,2,3,4].map(i => <div key={i} className="h-12 bg-slate-50 rounded animate-pulse" />)}</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                                    <th className="px-6 py-3 w-10">
                                        <button onClick={toggleAll} className="text-slate-400 hover:text-indigo-600">
                                            {selectedIds.size === filteredInvoices.length && filteredInvoices.length > 0 ? <CheckSquare size={16} /> : <Square size={16} />}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3">Nr Dokumentu</th>
                                    <th className="px-6 py-3">Kontrahent</th>
                                    <th className="px-6 py-3 text-right">Netto</th>
                                    <th className="px-6 py-3 text-right">Brutto</th>
                                    <th className="px-6 py-3 text-center">Status</th>
                                    <th className="px-6 py-3 text-center">AI Audit</th>
                                    <th className="px-6 py-3 text-right">Kategoria</th>
                                    <th className="px-6 py-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredInvoices.map((inv) => (
                                    <tr key={inv.id} className={`group transition-colors ${selectedIds.has(inv.id) ? 'bg-indigo-50/30' : 'hover:bg-slate-50'}`}>
                                        <td className="px-6 py-4">
                                            <button onClick={() => toggleSelection(inv.id)} className={`${selectedIds.has(inv.id) ? 'text-indigo-600' : 'text-slate-300 hover:text-slate-500'}`}>
                                                {selectedIds.has(inv.id) ? <CheckSquare size={16} /> : <Square size={16} />}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-mono text-xs text-slate-900 font-medium">{inv.ksefNumber}</span>
                                                <span className="text-[10px] text-slate-400">{inv.date}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col max-w-[200px]">
                                                <span className="text-sm text-slate-900 font-medium truncate" title={inv.contractor}>{inv.contractor}</span>
                                                <span className="text-[10px] text-slate-500 font-mono">NIP: {inv.nip}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-mono text-slate-600">
                                            {inv.amountNet.toFixed(2)}
                                            {inv.currency !== 'PLN' && <span className="text-[10px] ml-1 text-slate-400">{inv.currency}</span>}
                                        </td>
                                        <td className={`px-6 py-4 text-right text-sm font-mono font-bold ${inv.type === 'SALES' ? 'text-emerald-600' : 'text-slate-900'}`}>
                                            {inv.amountGross.toFixed(2)}
                                            {inv.currency !== 'PLN' && <span className="text-[10px] ml-1 text-slate-400">{inv.currency}</span>}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                                                inv.status === 'PROCESSED' 
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                                    : 'bg-amber-50 text-amber-700 border-amber-100'
                                            }`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {inv.aiAuditScore && (
                                                <div className="flex items-center justify-center gap-1 group/audit relative">
                                                    {inv.aiAuditScore > 90 
                                                        ? <CheckCircle2 size={16} className="text-green-500" />
                                                        : <ShieldAlert size={16} className="text-amber-500" />
                                                    }
                                                    <span className={`text-xs font-bold ${inv.aiAuditScore > 90 ? 'text-green-700' : 'text-amber-700'}`}>{inv.aiAuditScore}%</span>
                                                    
                                                    {/* Tooltip for audit */}
                                                    <div className="absolute bottom-full mb-2 bg-slate-900 text-white text-[10px] p-2 rounded w-48 opacity-0 group-hover/audit:opacity-100 transition-opacity pointer-events-none z-10 text-left">
                                                        {inv.aiAuditNotes || 'Brak uwag.'}
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {inv.type === 'PURCHASE' && (
                                                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                                                    {inv.costCategory ? (inv.costCategory === 'OPERATIONAL_100' ? '100% OP' : '75% AUTO') : '-'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleInspect(inv)} className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded transition-colors"><Eye size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
      )}

      {/* BATCH ACTION BAR (Floating) */}
      {selectedIds.size > 0 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-4 z-50 animate-in slide-in-from-bottom-6 border border-slate-700">
              <div className="flex items-center gap-3 border-r border-slate-700 pr-4">
                  <div className="bg-indigo-500 w-6 h-6 rounded flex items-center justify-center font-bold text-xs">
                      {selectedIds.size}
                  </div>
                  <span className="font-bold text-sm">Wybrano</span>
              </div>
              
              <div className="flex items-center gap-2">
                  <button onClick={() => handleBulkCategorize(CostCategory.OPERATIONAL_100)} disabled={isBulkProcessing} className="bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded text-xs font-bold transition-colors border border-slate-700">
                     100% OP
                  </button>
                  <button onClick={() => handleBulkCategorize(CostCategory.FUEL_75)} disabled={isBulkProcessing} className="bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded text-xs font-bold transition-colors border border-slate-700">
                     75% AUTO
                  </button>
                  <button onClick={() => handleBulkCategorize(CostCategory.REPRESENTATION_0)} disabled={isBulkProcessing} className="bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded text-xs font-bold transition-colors border border-slate-700">
                     NKUP
                  </button>
              </div>

              <div className="border-l border-slate-700 pl-4">
                  <button onClick={() => setSelectedIds(new Set())} className="text-slate-400 hover:text-white text-xs font-bold">Anuluj</button>
              </div>
          </div>
      )}

      {/* KSeF Generator Modal */}
      <Modal isOpen={ksefModalOpen} onClose={() => setKsefModalOpen(false)} title="Nowa Faktura (Standard KSeF)">
          <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3 text-blue-800 text-sm">
                  <Layers className="shrink-0" />
                  <p>Faktura zostanie zweryfikowana ze schemą logiczną FA(2) i po podpisaniu certyfikatem przesłana na bramkę Ministerstwa Finansów.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">NIP Kontrahenta</label>
                    <input 
                        type="text" 
                        value={newInvoiceNip}
                        onChange={(e) => setNewInvoiceNip(e.target.value)}
                        placeholder="np. 5252341234"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Waluta</label>
                    <select 
                        value={newInvoiceCurrency}
                        onChange={(e) => handleCurrencyChange(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    >
                        <option value="PLN">PLN (Polski Złoty)</option>
                        <option value="EUR">EUR (Euro)</option>
                        <option value="USD">USD (Dolar USA)</option>
                        <option value="GBP">GBP (Funt)</option>
                    </select>
                  </div>
              </div>

              {nbpData && (
                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 flex items-center justify-between text-xs text-amber-800 animate-in fade-in">
                      <div className="flex items-center gap-2">
                          <Globe size={14} /> 
                          <span>
                             Kurs NBP ({nbpData.tableNo}) z dnia <strong>{nbpData.effectiveDate}</strong>
                          </span>
                      </div>
                      <span className="font-mono font-bold">1 {newInvoiceCurrency} = {nbpData.rate} PLN</span>
                  </div>
              )}

              <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Pozycje faktury</label>
                  {newInvoiceItems.map((item, idx) => (
                      <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm grid grid-cols-12 gap-2 items-center mb-2">
                           <div className="col-span-5">
                               <input type="text" value={item.name} className="w-full bg-transparent border-b border-slate-300 py-1" />
                           </div>
                           <div className="col-span-2 text-center">
                               <span className="text-[10px] text-slate-400 block uppercase">Ilość</span>
                               <input type="number" value={item.quantity} className="w-full bg-transparent text-center font-bold font-mono" />
                           </div>
                           <div className="col-span-3 text-right">
                               <span className="text-[10px] text-slate-400 block uppercase">Netto</span>
                               <input type="number" value={item.unitPriceNet} className="w-full bg-transparent text-right font-bold font-mono" />
                           </div>
                           <div className="col-span-2 text-right">
                               <span className="text-[10px] text-slate-400 block uppercase">VAT</span>
                               <span className="font-mono text-xs">{item.vatRate * 100}%</span>
                           </div>
                      </div>
                  ))}
                  <button className="text-xs text-indigo-600 font-bold hover:underline">+ Dodaj pozycję</button>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <div className="text-right flex-1 pr-4">
                      <p className="text-xs text-slate-500 uppercase font-bold">Suma Brutto</p>
                      <p className="text-2xl font-bold text-slate-900 font-mono">
                          {(newInvoiceItems.reduce((acc, curr) => acc + (curr.totalNet * (1 + curr.vatRate)), 0)).toFixed(2)} <span className="text-sm text-slate-400">{newInvoiceCurrency}</span>
                      </p>
                      {nbpData && (
                          <p className="text-xs text-slate-400 mt-1 font-mono">
                             ≈ {((newInvoiceItems.reduce((acc, curr) => acc + (curr.totalNet * (1 + curr.vatRate)), 0)) * nbpData.rate).toFixed(2)} PLN
                          </p>
                      )}
                  </div>
                  <button 
                    onClick={handleGenerateKsef}
                    disabled={isGeneratingKsef}
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-lg shadow-indigo-200"
                  >
                      {isGeneratingKsef ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Wyślij do MF</>}
                  </button>
              </div>
          </div>
      </Modal>

      {/* DEEP DIVE MODAL */}
      <Modal isOpen={inspectModalOpen} onClose={() => setInspectModalOpen(false)} title="Inspekcja Faktury (KSeF)">
        {selectedInvoice && (
            <div className="space-y-6">
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                    <div>
                        <h4 className="text-lg font-bold text-slate-900">{selectedInvoice.contractor}</h4>
                        <p className="text-sm text-slate-500 font-mono mt-1">NIP: {selectedInvoice.nip}</p>
                        <p className="text-xs text-slate-400 mt-0.5 font-mono">ID: {selectedInvoice.ksefNumber}</p>
                    </div>
                    <div className="text-right">
                         <p className="text-xs text-slate-500 uppercase font-bold">Brutto</p>
                         <p className="text-2xl font-bold text-slate-900 font-mono">{selectedInvoice.amountGross.toFixed(2)} {selectedInvoice.currency}</p>
                    </div>
                </div>

                {selectedInvoice.aiAuditNotes && (
                    <div className={`p-4 rounded-lg border flex gap-3 items-start ${selectedInvoice.aiAuditScore && selectedInvoice.aiAuditScore > 90 ? 'bg-green-50 border-green-200 text-green-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                        <ShieldAlert size={20} className="shrink-0 mt-0.5" />
                        <div>
                            <h5 className="font-bold text-sm mb-1 flex items-center gap-2">
                                AI Tax Auditor 
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${selectedInvoice.aiAuditScore && selectedInvoice.aiAuditScore > 90 ? 'bg-green-100 border-green-300' : 'bg-amber-100 border-amber-300'}`}>
                                    SCORE: {selectedInvoice.aiAuditScore}/100
                                </span>
                            </h5>
                            <p className="text-sm">{selectedInvoice.aiAuditNotes}</p>
                        </div>
                    </div>
                )}

                {/* DocuSign Integration */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FileSignature size={20} className="text-blue-600" />
                        <div>
                            <h5 className="font-bold text-sm text-blue-900">Podpis elektroniczny (DocuSign)</h5>
                            {selectedInvoice.docuSignStatus === 'SIGNED' ? (
                                <p className="text-xs text-blue-700">Dokument podpisany przez obie strony.</p>
                            ) : selectedInvoice.docuSignStatus === 'SENT' ? (
                                <p className="text-xs text-blue-700">Wysłano do kontrahenta. Oczekiwanie...</p>
                            ) : (
                                <p className="text-xs text-blue-700">Dokument nie został jeszcze wysłany do podpisu.</p>
                            )}
                        </div>
                    </div>
                    {selectedInvoice.docuSignStatus !== 'SIGNED' && (
                        <button 
                            onClick={() => handleSendToDocuSign(selectedInvoice)}
                            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                        >
                            Wyślij przez DocuSign
                        </button>
                    )}
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 font-mono text-xs">
                    {/* Items rendering... */}
                    {selectedInvoice.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between py-1 border-b border-slate-100 last:border-0">
                            <span className="font-bold text-slate-700">{item.name}</span>
                            <div className="flex gap-8 text-right text-slate-600">
                                <span className="w-8">{item.quantity}</span>
                                <span className="w-20">{item.unitPriceNet.toFixed(2)}</span>
                                <span className="w-20 font-bold">{item.totalNet.toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedInvoice.type === 'PURCHASE' && (
                    <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
                        <div className="flex items-center gap-2 mb-4">
                            <Tag size={16} className="text-indigo-600" />
                            <h5 className="font-bold text-indigo-900 text-sm">Kategoryzacja Kosztu (CIT/PIT)</h5>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <button onClick={() => handleCategoryChange(CostCategory.OPERATIONAL_100)} className={`p-3 rounded-lg border text-xs font-bold transition-all ${selectedInvoice.costCategory === CostCategory.OPERATIONAL_100 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}>100% Eksploatacja</button>
                            <button onClick={() => handleCategoryChange(CostCategory.FUEL_75)} className={`p-3 rounded-lg border text-xs font-bold transition-all ${selectedInvoice.costCategory === CostCategory.FUEL_75 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}>75% Paliwo / Auto</button>
                            <button onClick={() => handleCategoryChange(CostCategory.REPRESENTATION_0)} className={`p-3 rounded-lg border text-xs font-bold transition-all ${selectedInvoice.costCategory === CostCategory.REPRESENTATION_0 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}>0% NKUP</button>
                        </div>
                    </div>
                )}
            </div>
        )}
      </Modal>
    </div>
  );
};
