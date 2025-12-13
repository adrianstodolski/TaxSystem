
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { NuffiService } from '../services/api';
import { Invoice, RecurringInvoice, RecurringSuggestion } from '../types';
import { TrendingUp, UploadCloud, Loader2, Plus, Download, Eye, Sparkles, X, FileText, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Modal } from './ui/Modal';
import { toast } from './ui/Toast';
import { DataTable } from './ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import jsPDF from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import { InvoiceCreator } from './InvoiceCreator';

export const Documents: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activeTab, setActiveTab] = useState<'INVOICES' | 'RECURRING'>('INVOICES');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'SALES' | 'PURCHASE'>('ALL');
  
  // Creation Mode State
  const [isCreating, setIsCreating] = useState(false);
  
  const [suggestions, setSuggestions] = useState<RecurringSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    const [inv, , sugg] = await Promise.all([
        NuffiService.fetchInvoices(),
        NuffiService.fetchRecurringInvoices(),
        NuffiService.getSmartRecurringSuggestions()
    ]);
    setInvoices(inv);
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
          cell: info => (
            <div className="flex flex-col">
                <span className="font-mono text-xs text-white font-medium tracking-wide">{info.getValue() as string}</span>
                <span className="text-[10px] text-zinc-500">{info.row.original.date}</span>
            </div>
          )
      },
      {
          accessorKey: 'contractor',
          header: 'Kontrahent',
          cell: info => (
              <div className="flex flex-col max-w-[200px]">
                  <span className="text-sm text-zinc-200 font-bold truncate" title={info.getValue() as string}>{info.getValue() as string}</span>
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
          cell: info => <span className={`font-mono font-bold ${info.row.original.type === 'SALES' ? 'text-emerald-400' : 'text-white'}`}>{info.row.original.amountGross.toFixed(2)} {info.row.original.currency}</span>
      },
      {
          accessorKey: 'status',
          header: 'Status',
          cell: info => (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                info.getValue() === 'PROCESSED' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
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
                  <button onClick={(e) => { e.stopPropagation(); handleGeneratePdf(info.row.original); }} className="text-zinc-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"><Download size={16} /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleInspect(info.row.original); }} className="text-gold hover:bg-gold/10 p-2 rounded-lg transition-colors"><Eye size={16} /></button>
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

  const handleInvoiceCreated = async () => {
      setIsCreating(false);
      setLoading(true);
      await loadInvoices();
  };

  const SmartSuggestionBanner = () => {
      if(!showSuggestions || suggestions.length === 0) return null;
      const sugg = suggestions[0];

      return (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-gradient-to-r from-[#0A0A0C] to-[#141419] p-1 rounded-xl border border-gold/20"
          >
              <div className="bg-[#050505]/80 p-4 rounded-[10px] flex items-start justify-between relative overflow-hidden backdrop-blur-sm">
                  <div className="flex gap-4 relative z-10">
                      <div className="bg-gold/10 p-2.5 rounded-xl shadow-sm text-gold border border-gold/20 h-fit">
                          <Sparkles size={20} className="fill-gold" />
                      </div>
                      <div>
                          <h4 className="font-bold text-white text-sm mb-1">Nuffi AI: Wykryto wzorzec cykliczny</h4>
                          <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
                              Wystawiasz faktury dla <strong className="text-white">{sugg.contractorName}</strong> regularnie. 
                              Utwórz automat i oszczędź {sugg.potentialSavingsTime}.
                          </p>
                          <button className="mt-3 text-xs font-bold text-black bg-gold hover:bg-[#FCD34D] px-4 py-1.5 rounded-lg transition-colors">
                              Utwórz Automat
                          </button>
                      </div>
                  </div>
                  <button onClick={() => setShowSuggestions(false)} className="text-zinc-500 hover:text-white relative z-10 p-2"><X size={16} /></button>
                  
                  {/* Deco */}
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-gold/5 rounded-full blur-2xl"></div>
              </div>
          </motion.div>
      );
  };

  if (isCreating) {
      return <InvoiceCreator onBack={() => setIsCreating(false)} onSave={handleInvoiceCreated} />;
  }

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
            <div className="bg-onyx p-1 rounded-xl border border-white/10 flex">
                <button onClick={() => setActiveTab('INVOICES')} className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'INVOICES' ? 'bg-gold text-black shadow-lg shadow-gold/10' : 'text-zinc-400 hover:text-white'}`}>Faktury</button>
                <button onClick={() => setActiveTab('RECURRING')} className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'RECURRING' ? 'bg-gold text-black shadow-lg shadow-gold/10' : 'text-zinc-400 hover:text-white'}`}>Cykliczne</button>
            </div>
             <button onClick={() => setIsCreating(true)} className="flex items-center gap-2 bg-onyx hover:bg-white/10 text-white px-4 py-2 rounded-xl transition-colors border border-white/10 font-bold text-sm shadow-lg hover:border-white/20">
                <Plus size={16} /><span>Nowa Faktura</span>
             </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="neo-card p-6 rounded-2xl">
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Sprzedaż (Miesiąc)</p>
                <TrendingUp className="text-emerald-400" size={18} />
              </div>
              <div className="mt-2 text-3xl font-bold text-white font-mono tracking-tight">7,535.00 <span className="text-sm text-zinc-500">PLN</span></div>
          </motion.div>
          {/* ... other stats ... */}
      </div>

      <SmartSuggestionBanner />

      {activeTab === 'INVOICES' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {/* OCR Upload Zone */}
            <div 
                className="neo-card border-dashed border-zinc-800 rounded-2xl p-8 flex items-center justify-center gap-6 cursor-pointer hover:border-gold/30 hover:bg-white/[0.02] transition-all group mb-8"
                onClick={() => fileInputRef.current?.click()}
            >
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.jpg,.png" />
                <div className="w-16 h-16 bg-onyx rounded-full flex items-center justify-center border border-white/10 text-zinc-400 group-hover:text-gold group-hover:border-gold/30 transition-all shadow-xl">
                    {isUploading ? <Loader2 className="animate-spin" /> : <UploadCloud size={28} />}
                </div>
                <div className="text-left">
                    <h3 className="font-bold text-white text-lg group-hover:text-gold transition-colors">Import Spoza KSeF</h3>
                    <p className="text-zinc-500 text-sm mt-1">Upuść faktury zagraniczne lub skany (OCR AI).</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex gap-2 mb-4">
                <button onClick={() => setFilter('ALL')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${filter === 'ALL' ? 'bg-gold text-black border-gold' : 'bg-onyx text-zinc-400 border-white/10 hover:text-white'}`}>Wszystkie</button>
                <button onClick={() => setFilter('SALES')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${filter === 'SALES' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-onyx text-zinc-400 border-white/10 hover:text-white'}`}>Sprzedaż</button>
                <button onClick={() => setFilter('PURCHASE')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${filter === 'PURCHASE' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-onyx text-zinc-400 border-white/10 hover:text-white'}`}>Zakup</button>
            </div>

            {/* TanStack Table Implementation */}
            {loading ? (
                <div className="p-12 text-center"><Loader2 className="animate-spin text-gold mx-auto" size={32} /></div>
            ) : (
                <div className="neo-card rounded-2xl p-1 overflow-hidden">
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
              <div className="space-y-6">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex justify-between items-center">
                      <div>
                          <p className="text-xs text-zinc-500 uppercase font-bold">Numer KSeF</p>
                          <p className="text-white font-mono text-sm mt-1">{selectedInvoice.ksefNumber}</p>
                      </div>
                      <span className="text-emerald-400"><CheckCircle2 /></span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                      <div className="bg-onyx p-3 rounded-lg border border-white/5">
                          <p className="text-xs text-zinc-500 uppercase">Netto</p>
                          <p className="font-bold text-white">{selectedInvoice.amountNet.toFixed(2)}</p>
                      </div>
                      <div className="bg-onyx p-3 rounded-lg border border-white/5">
                          <p className="text-xs text-zinc-500 uppercase">VAT</p>
                          <p className="font-bold text-white">{selectedInvoice.amountVat.toFixed(2)}</p>
                      </div>
                  </div>

                  <button onClick={() => handleGeneratePdf(selectedInvoice)} className="w-full bg-gold text-black py-3 rounded-xl font-bold mt-4 flex items-center justify-center gap-2 hover:bg-[#FCD34D] transition-all shadow-lg">
                      <Download size={18} /> Pobierz PDF
                  </button>
              </div>
          )}
      </Modal>
    </div>
  );
};
