
import React, { useState } from 'react';
import { ExportFormat } from '../types';
import { NuffiService } from '../services/api';
import { FileText, Download, Share2, FileCode, CheckCircle2, Loader2, Calendar } from 'lucide-react';
import { toast } from './ui/Toast';

export const DataExport: React.FC = () => {
  const [processing, setProcessing] = useState<ExportFormat | null>(null);
  const [emailProcessing, setEmailProcessing] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    setProcessing(format);
    try {
        await NuffiService.generateExport(format, '2023-10');
        toast.success('Wygenerowano raport', `Plik ${format} został pobrany.`);
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
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Download className="text-[#D4AF37]" /> Eksport Danych
          </h2>
          <p className="text-zinc-400 mt-1">Generowanie oficjalnych plików kontrolnych (JPK) i raportów księgowych.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#0A0A0C] border border-white/10 px-3 py-2 rounded-lg text-sm text-zinc-300 font-mono">
            <Calendar size={16} />
            <span className="font-bold">PAŹDZIERNIK 2023</span>
        </div>
      </header>

      {/* Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* JPK_V7 */}
          <div className="neo-card p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <FileCode size={80} className="text-white" />
              </div>
              <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-4 text-[#D4AF37]">
                      <FileCode size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white">JPK_V7M (XML)</h3>
                  <p className="text-sm text-zinc-400 mb-6 mt-1">
                      Jednolity Plik Kontrolny dla VAT. Wymagany do comiesięcznej wysyłki do MF. Zawiera rejestr sprzedaży i zakupów.
                  </p>
                  <button 
                    onClick={() => handleExport(ExportFormat.JPK_V7)}
                    disabled={!!processing}
                    className="w-full bg-[#D4AF37] text-black py-3 rounded-xl font-bold hover:bg-[#FCD34D] disabled:opacity-70 flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_-5px_rgba(212,175,55,0.3)]"
                  >
                      {processing === ExportFormat.JPK_V7 ? <Loader2 className="animate-spin" /> : <><Download size={18} /> Generuj XML</>}
                  </button>
              </div>
          </div>

          {/* KPiR */}
          <div className="neo-card p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <FileText size={80} className="text-white" />
              </div>
              <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-4 text-emerald-400">
                      <FileText size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Podatkowa Księga (KPiR)</h3>
                  <p className="text-sm text-zinc-400 mb-6 mt-1">
                      Zestawienie przychodów i rozchodów w formacie PDF lub Excel. Podstawa do wyliczenia zaliczki PIT.
                  </p>
                  <div className="flex gap-2">
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
      </div>

      {/* Accountant Package */}
      <div className="bg-[#0A0A0C] border border-white/10 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                      <Share2 size={20} className="text-indigo-400" /> Wyślij paczkę do księgowości
                  </h3>
                  <p className="text-zinc-400 max-w-lg text-sm">
                      Nuffi automatycznie spakuje wszystkie faktury (PDF/XML), wyciągi bankowe oraz plik JPK w jedno archiwum ZIP i wyśle bezpiecznym linkiem.
                  </p>
              </div>
              <button 
                onClick={handleSendToAccountant}
                disabled={emailProcessing}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all shadow-lg shadow-indigo-900/30 whitespace-nowrap"
              >
                  {emailProcessing ? <Loader2 className="animate-spin" /> : <><Share2 size={18} /> Wyślij (ZIP)</>}
              </button>
          </div>
          
          {/* Decorative BG */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -mr-16 -mt-16 pointer-events-none"></div>
      </div>

      {/* Preview Section (Simulated XML) */}
      <div className="bg-[#050505] rounded-xl p-6 font-mono text-xs text-zinc-400 overflow-x-auto border border-white/10 shadow-inner">
          <p className="text-zinc-500 mb-4 uppercase font-bold tracking-wider text-[10px] flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Podgląd struktury JPK (Live)
          </p>
          <pre className="text-green-400/80">
{`<JPK xmlns="http://jpk.mf.gov.pl/wzor/2020/05/08/05081/">
  <Naglowek>
    <KodFormularza kodSystemowy="JPK_V7M (1)" wersjaSchemy="1-2E">JPK_VAT</KodFormularza>
    <WariantFormularza>1</WariantFormularza>
    <DataWytworzenia>${new Date().toISOString()}</DataWytworzenia>
    <CelZlozenia poz="P_7">1</CelZlozenia>
    <KodUrzedu>1401</KodUrzedu>
    <Rok>2023</Rok>
    <Miesiac>10</Miesiac>
  </Naglowek>
  <Podmiot1>
    <NIP>5213214567</NIP>
    <PelnaNazwa>Marcin Nowak IT Services</PelnaNazwa>
  </Podmiot1>
  <Deklaracja>
    ...
  </Deklaracja>
  <SprzedazWiersz>
    <LpSprzedazy>1</LpSprzedazy>
    <NrKontrahenta>8881112233</NrKontrahenta>
    <NazwaKontrahenta>Design Studio Creative</NazwaKontrahenta>
    <DowodSprzedazy>991231-2023-10-05</DowodSprzedazy>
    <DataWystawienia>2023-10-05</DataWystawienia>
    <K_19>4500.00</K_19>
    <K_20>1035.00</K_20>
  </SprzedazWiersz>
</JPK>`}
          </pre>
      </div>
    </div>
  );
};
