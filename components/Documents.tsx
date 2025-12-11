
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { NuffiService } from '../services/api';
import { Invoice, CostCategory, InvoiceItem, RecurringInvoice, RecurringSuggestion, NbpTable } from '../types';
import { RefreshCw, Filter, TrendingUp, TrendingDown, FileSpreadsheet, Eye, Tag, UploadCloud, Loader2, CheckSquare, Square, Layers, Plus, Send, Download, MoreHorizontal, Repeat, Globe, ShieldAlert, CheckCircle2, AlertTriangle, Play, Sparkles, Info, X, FileSignature } from 'lucide-react';
import { Modal } from './ui/Modal';
import { toast } from './ui/Toast';
import { DataTable } from './ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import jsPDF from 'jspdf';
import { motion } from 'framer-motion';

export const Documents: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [recurringInvoices, setRecurringInvoices] = useState<RecurringInvoice[]>([]);
  const [activeTab, setActiveTab] = useState<'INVOICES' | 'RECURRING'>('INVOICES');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'SALES' | 'PURCHASE'>('ALL');
  
  const [suggestions, setSuggestions] = useState<RecurringSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [ksefModalOpen, setKsefModalOpen] = useState(false);

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

  const handleGeneratePdf = (invoice: Invoice) => {
      const doc = new jsPDF();
      doc.text(`Faktura: ${invoice.ksefNumber}`, 10, 20);
      doc.save(`faktura_${invoice.id}.pdf`);
      toast.success('PDF Wygenerowany', 'Plik został pobrany na dysk.');
  };

  const columns = useMemo<ColumnDef<Invoice>[]>(() => [
      {
          accessorKey: 'ksefNumber',
          header: 'Nr Dokumentu',
          cell: info => <div className="flex flex-col"><span className="font-mono text-xs text-white font-medium">{info.getValue() as string}</span><span className="text-[10px] text-zinc-500">{info.row.original.date}</span></div>
      },
      {
          accessorKey: 'contractor',
          header: 'Kontrahent',
          cell: info => (
              <div className="flex flex-col max-w-[200px]">
                  <span className="text-sm text-zinc-200 font-medium truncate" title={info.getValue() as string}>{info.getValue() as string}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">NIP: {info.row.original.nip}</span>
              </div>
          )
      },
      {
          accessorKey: 'amountNet',
          header: 'Netto',
          cell: info => <span className="font-mono text-zinc-400">{info.row.original.amountNet.toFixed(2)}</span>
      },
      {
          accessorKey: 'amountGross',
          header: 'Brutto',
          cell: info => <span className={`font-mono font-bold ${info.row.original.type === 'SALES' ? 'text-green-400' : 'text-white'}`}>{info.row.original.amountGross.toFixed(2)} {info.row.original.currency}</span>
      },
      {
          accessorKey: 'status',
          header: 'Status',
          cell: info => (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                info.getValue() === 'PROCESSED' 
                    ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
                {info.getValue() as string}
            </span>
          )
      },
      {
          id: 'actions',
          header: '',
          cell: info => (
              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); handleGeneratePdf(info.row.original); }} className="text-zinc-400 hover:text-white p-1.5"><Download size={16} /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleInspect(info.row.original); }} className="text-gold hover:bg-white/5 p-1.5 rounded transition-colors"><Eye size={16} /></button>
              </div>
          )
      }
  ], []);

  const handleInspect = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setInspectModalOpen(true);
  };

  const filteredInvoices = useMemo(() => 
    invoices.filter(inv => filter === 'ALL' || inv.type === filter),
  [invoices, filter]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsUploading(true);
      setTimeout(() => { setIsUploading(false); toast.success('OCR', 'Plik przetworzony'); }, 1500);
  };

  const SmartSuggestionBanner = () => {
      if(!showSuggestions || suggestions.length === 0) return null;
      const sugg = suggestions[0];

      return (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-[#0A0A0C] p-4 rounded-xl border border-white/10 flex items-start justify-between relative overflow-hidden"
          >
              <div className="flex gap-3 relative z-10">
                  <div className="bg-gold/10 p-2 rounded-lg shadow-sm text-gold border border-gold/20">
                      <Sparkles size={20} className="fill-gold" />
                  </div>
                  <div>
                      <h4 className="font-bold text-white text-sm">Nuffi AI: Wykryto wzorzec cykliczny</h4>
                      <p className="text-sm text-zinc-400 mt-1">
                          Wystawiasz faktury dla <strong>{sugg.contractorName}</strong> regularnie. 
                          Utwórz automat i oszczędź {sugg.potentialSavingsTime}.
                      </p>
                  </div>
              </div>
              <button onClick={() => setShowSuggestions(false)} className="text-zinc-500 hover:text-white relative z-10"><X size={16} /></button>
          </motion.div>
      );
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="flex justify-between items-center border-b border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            Dokumenty
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] px-2 py-0.5 rounded font-mono uppercase tracking-wide">KSeF Live</span>
          </h2>
          <p className="text-zinc-400 mt-1">Rejestr faktur (FA-2) zsynchronizowany z Ministerstwem Finansów.</p>
        </div>
        <div className="flex gap-3">
            <div className="bg-onyx p-1 rounded-lg border border-white/10 flex">
                <button onClick={() => setActiveTab('INVOICES')} className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${activeTab === 'INVOICES' ? 'bg-gold text-black' : 'text-zinc-400 hover:text-white'}`}>Faktury</button>
                <button onClick={() => setActiveTab('RECURRING')} className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${activeTab === 'RECURRING' ? 'bg-gold text-black' : 'text-zinc-400 hover:text-white'}`}>Cykliczne</button>
            </div>
             <button onClick={() => setKsefModalOpen(true)} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg transition-colors border border-white/10 font-bold text-sm"><Plus size={16} /><span>Nowa Faktura</span></button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="neo-card p-5 rounded-xl">
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Sprzedaż (Miesiąc)</p>
                <TrendingUp className="text-green-400" size={18} />
              </div>
              <div className="mt-2 text-2xl font-bold text-white font-mono">7,535.00 <span className="text-sm text-zinc-500">PLN</span></div>
          </motion.div>
          {/* ... other stats ... */}
      </div>

      <SmartSuggestionBanner />

      {activeTab === 'INVOICES' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {/* OCR Upload Zone */}
            <div 
                className="neo-card border-dashed border-zinc-700 rounded-xl p-6 flex items-center justify-center gap-4 cursor-pointer hover:border-gold/50 transition-all group backdrop-blur-sm mb-8"
                onClick={() => fileInputRef.current?.click()}
            >
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.jpg,.png" />
                <div className="bg-onyx p-3 rounded-full border border-white/10 text-zinc-400 group-hover:text-gold transition-colors">
                    {isUploading ? <Loader2 className="animate-spin" /> : <UploadCloud />}
                </div>
                <div className="text-left">
                    <h3 className="font-bold text-zinc-200 text-sm group-hover:text-gold">Import Spoza KSeF</h3>
                    <p className="text-zinc-500 text-xs">Wgraj fakturę zagraniczną lub skan (OCR).</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex gap-2 mb-4">
                <button onClick={() => setFilter('ALL')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${filter === 'ALL' ? 'bg-gold text-black' : 'neo-card text-zinc-400 hover:text-white'}`}>Wszystkie</button>
                <button onClick={() => setFilter('SALES')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${filter === 'SALES' ? 'bg-green-600/20 text-green-400 border border-green-500/30' : 'neo-card text-zinc-400 hover:text-white'}`}>Sprzedaż</button>
                <button onClick={() => setFilter('PURCHASE')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${filter === 'PURCHASE' ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30' : 'neo-card text-zinc-400 hover:text-white'}`}>Zakup</button>
            </div>

            {/* TanStack Table Implementation */}
            {loading ? (
                <div className="p-8 text-center"><Loader2 className="animate-spin text-gold mx-auto" /></div>
            ) : (
                <div className="neo-card rounded-xl p-1">
                    <DataTable 
                        columns={columns} 
                        data={filteredInvoices} 
                        onRowClick={handleInspect}
                    />
                </div>
            )}
        </motion.div>
      )}

      {/* Modals */}
      <Modal isOpen={inspectModalOpen} onClose={() => setInspectModalOpen(false)} title="Szczegóły Faktury">
          {selectedInvoice && (
              <div className="space-y-4">
                  <div className="flex justify-between">
                      <span className="text-zinc-400">Numer:</span>
                      <span className="text-white font-mono">{selectedInvoice.ksefNumber}</span>
                  </div>
                  <button onClick={() => handleGeneratePdf(selectedInvoice)} className="w-full bg-gold text-black py-2 rounded font-bold mt-4 flex items-center justify-center gap-2 hover:bg-[#FCD34D]">
                      <Download size={16} /> Pobierz PDF
                  </button>
              </div>
          )}
      </Modal>
      
      <Modal isOpen={ksefModalOpen} onClose={() => setKsefModalOpen(false)} title="Generator KSeF">
          <div className="p-4 text-center text-zinc-400">Formularz KSeF (Placeholder)</div>
      </Modal>
    </div>
  );
};
