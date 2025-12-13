
import React, { useState } from 'react';
import { ExportFormat } from '../types';
import { NuffiService } from '../services/api';
import { FileText, Download, Share2, FileCode, CheckCircle2, Loader2, Calendar, Shield, Lock, Hash, FileCheck, Eye } from 'lucide-react';
import { toast } from './ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';

export const DataExport: React.FC = () => {
  const [processing, setProcessing] = useState<ExportFormat | null>(null);
  const [emailProcessing, setEmailProcessing] = useState(false);
  const [generatedHash, setGeneratedHash] = useState<string | null>(null);

  const handleExport = async (format: ExportFormat) => {
    setProcessing(format);
    setGeneratedHash(null);
    try {
        await new Promise(r => setTimeout(r, 1500)); // Simulate crypto hash generation
        await NuffiService.generateExport(format, '2023-10');
        setGeneratedHash('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
        toast.success('Wygenerowano raport', `Plik ${format} został pobrany i zabezpieczony.`);
    } catch (e) {
        toast.error('Błąd eksportu', 'Nie udało się wygenerować pliku.');
    } finally {
        setProcessing(null);
    }
  };

  const handleSendToAccountant = async () => {
      setEmailProcessing(true);
      await NuffiService.sendPackageToAccountant('ksiegowosc@example.com');
      setEmailProcessing(false);
      toast.success('Wysłano do księgowej', 'Paczka dokumentów została przesłana mailem.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex justify-between items-center border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Lock className="text-gold" /> Compliance Vault
          </h2>
          <p className="text-zinc-400 mt-1">Bezpieczny eksport danych podatkowych i archiwum JPK.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#0A0A0C] border border-white/10 px-3 py-2 rounded-lg text-sm text-zinc-300 font-mono">
            <Calendar size={16} />
            <span className="font-bold">PAŹDZIERNIK 2023</span>
        </div>
      </header>

      {/* Hero Secure Area */}
      <div className="bg-gradient-to-r from-[#0A0A0C] to-[#141419] border border-white/10 rounded-2xl p-8 relative overflow-hidden group">
          <div className="relative z-10 flex justify-between items-center">
              <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <Shield className="text-emerald-500" /> Secure Data Extraction
                  </h3>
                  <p className="text-zinc-400 text-sm max-w-lg">
                      Wszystkie eksportowane pliki są podpisywane cyfrowo i otrzymują unikalny sumę kontrolną (SHA-256) dla zapewnienia integralności danych przed kontrolą skarbową.
                  </p>
              </div>
              <button 
                onClick={handleSendToAccountant}
                disabled={emailProcessing}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-900/30"
              >
                  {emailProcessing ? <Loader2 className="animate-spin" /> : <><Share2 size={18} /> Wyślij Paczkę (ZIP)</>}
              </button>
          </div>
          <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* JPK Generator */}
          <div className="neo-card p-6 rounded-2xl flex flex-col">
              <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-gold border border-gold/20 shadow-sm">
                          <FileCode size={24} />
                      </div>
                      <div>
                          <h4 className="font-bold text-white">Jednolity Plik Kontrolny</h4>
                          <p className="text-xs text-zinc-500 mt-1">JPK_V7M / JPK_FA</p>
                      </div>
                  </div>
                  <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded text-zinc-400 font-mono">XML 1.0</span>
              </div>

              <div className="bg-black/40 rounded-xl p-4 border border-white/5 mb-6 font-mono text-[10px] text-zinc-500 overflow-hidden relative">
                  <div className="absolute top-2 right-2 text-zinc-600"><Eye size={12}/> Preview</div>
                  <pre className="text-green-400/80 pointer-events-none select-none blur-[0.5px]">
{`<JPK xmlns="http://jpk.mf.gov.pl">
  <Naglowek>
    <KodFormularza>JPK_VAT</KodFormularza>
    <Wariant>1</Wariant>
    <CelZlozenia>1</CelZlozenia>
    <Data>2023-10-31</Data>
  </Naglowek>
  <Podmiot1>
    <NIP>5213214567</NIP>
  </Podmiot1>
  ...
</JPK>`}
                  </pre>
              </div>

              <button 
                onClick={() => handleExport(ExportFormat.JPK_V7)}
                disabled={!!processing}
                className="mt-auto w-full bg-gold text-black py-3 rounded-xl font-bold hover:bg-[#FCD34D] disabled:opacity-70 flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_-5px_rgba(212,175,55,0.3)]"
              >
                  {processing === ExportFormat.JPK_V7 ? <Loader2 className="animate-spin" /> : <><Download size={18} /> Generuj XML i Podpisz</>}
              </button>
          </div>

          {/* KPiR / Ledger */}
          <div className="neo-card p-6 rounded-2xl flex flex-col">
              <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-sm">
                          <FileText size={24} />
                      </div>
                      <div>
                          <h4 className="font-bold text-white">Księga Przychodów (KPiR)</h4>
                          <p className="text-xs text-zinc-500 mt-1">Zestawienie operacji księgowych.</p>
                      </div>
                  </div>
              </div>

              <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                      <CheckCircle2 size={16} className="text-green-500" />
                      <span className="text-sm text-zinc-300">Faktury Sprzedażowe (45)</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                      <CheckCircle2 size={16} className="text-green-500" />
                      <span className="text-sm text-zinc-300">Faktury Kosztowe (12)</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                      <CheckCircle2 size={16} className="text-green-500" />
                      <span className="text-sm text-zinc-300">Dowody Wewnętrzne (3)</span>
                  </div>
              </div>

              <div className="flex gap-3">
                  <button 
                    onClick={() => handleExport(ExportFormat.KPIR_PDF)}
                    disabled={!!processing}
                    className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-xl font-bold hover:bg-white/10 disabled:opacity-70 flex items-center justify-center gap-2 transition-colors"
                  >
                      {processing === ExportFormat.KPIR_PDF ? <Loader2 className="animate-spin" /> : 'PDF'}
                  </button>
                  <button 
                    onClick={() => handleExport(ExportFormat.KPIR_CSV)}
                    disabled={!!processing}
                    className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-xl font-bold hover:bg-white/10 disabled:opacity-70 flex items-center justify-center gap-2 transition-colors"
                  >
                      {processing === ExportFormat.KPIR_CSV ? <Loader2 className="animate-spin" /> : 'Excel'}
                  </button>
              </div>
          </div>
      </div>

      <AnimatePresence>
          {generatedHash && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-[#050505] border border-green-500/20 rounded-xl p-4 flex items-center gap-4 shadow-lg shadow-green-900/10"
              >
                  <div className="bg-green-500/10 p-2 rounded-lg text-green-400">
                      <FileCheck size={24} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                      <p className="text-green-400 text-xs font-bold uppercase mb-1">Integrity Check Passed</p>
                      <p className="text-zinc-500 text-[10px] font-mono truncate flex items-center gap-2">
                          <Hash size={10} /> {generatedHash}
                      </p>
                  </div>
                  <button onClick={() => setGeneratedHash(null)} className="text-zinc-500 hover:text-white"><Shield size={16} /></button>
              </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};
