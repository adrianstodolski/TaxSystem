
import React, { useState } from 'react';
import { TaxFormType, TaxReturn, TaxStatus } from '../types';
import { NuffiService } from '../services/api';
import { Check, ChevronRight, FileCheck, PenTool, Send, CreditCard, Loader2, Download, AlertTriangle, Info, CheckCircle2, ArrowRight, Sparkles, MessageSquare } from 'lucide-react';
import { Modal } from './ui/Modal';

export const TaxWizard: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [selectedForm, setSelectedForm] = useState<TaxFormType>(TaxFormType.PIT_38);
  const [taxData, setTaxData] = useState<TaxReturn | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [upo, setUpo] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [explaining, setExplaining] = useState(false);

  const handleCalculate = async () => {
    setIsProcessing(true);
    const result = await NuffiService.calculateTax(selectedForm);
    setTaxData(result);
    setAiExplanation(null);
    setIsProcessing(false);
    setStep(2);
  };

  const handleExplainAI = async () => {
      if(!taxData || !taxData.breakdown) return;
      setExplaining(true);
      const text = await NuffiService.explainTaxWithAI(taxData.breakdown);
      setAiExplanation(text);
      setExplaining(false);
  };

  const handleSign = async () => {
    if (!taxData) return;
    setIsProcessing(true);
    await NuffiService.signDocument(taxData.id);
    setTaxData({ ...taxData, status: TaxStatus.SIGNED });
    setIsProcessing(false);
    setStep(3);
  };

  const handleSubmit = async () => {
    if (!taxData) return;
    setIsProcessing(true);
    const upoId = await NuffiService.submitToMF(taxData.id);
    setUpo(upoId);
    setTaxData({ ...taxData, status: TaxStatus.SUBMITTED, upoId });
    setIsProcessing(false);
    setStep(4);
  };

  const handlePayment = async () => {
      if(!taxData) return;
      setIsProcessing(true);
      await NuffiService.processPayment(taxData.taxDue, 'BLIK');
      setTaxData({...taxData, status: TaxStatus.PAID});
      setIsProcessing(false);
  }

  const steps = [
    { num: 1, label: 'Wybór & Dane', icon: FileCheck },
    { num: 2, label: 'Kalkulacja', icon: ChevronRight },
    { num: 3, label: 'Podpis (mSzafir)', icon: PenTool },
    { num: 4, label: 'Wysyłka (MF)', icon: Send },
    { num: 5, label: 'Płatność', icon: CreditCard },
  ];

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(val);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Kreator PIT 2024</h2>
        <p className="text-gray-500 mt-2">Przejdź przez proces automatycznego rozliczenia w 5 prostych krokach.</p>
      </header>

      {/* Stepper */}
      <div className="flex justify-between items-center relative mb-12">
        <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
        <div className="absolute left-0 top-1/2 h-1 bg-indigo-600 -z-10 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 4) * 100}%` }}></div>
        
        {steps.map((s) => (
          <div key={s.num} className="flex flex-col items-center gap-2 bg-white px-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              step >= s.num 
                ? 'bg-indigo-600 border-indigo-600 text-white' 
                : 'bg-white border-gray-300 text-gray-400'
            }`}>
              {step > s.num ? <Check size={20} /> : <s.icon size={18} />}
            </div>
            <span className={`text-xs font-medium ${step >= s.num ? 'text-indigo-600' : 'text-gray-400'}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden min-h-[400px]">
        {/* Step 1: Selection */}
        {step === 1 && (
          <div className="p-8">
            <h3 className="text-xl font-bold mb-6">Wybierz formularz</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[TaxFormType.PIT_37, TaxFormType.PIT_36, TaxFormType.PIT_38].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedForm(type)}
                  className={`p-6 rounded-xl border-2 text-left transition-all ${
                    selectedForm === type
                      ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="font-bold text-lg text-gray-900">{type}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {type === TaxFormType.PIT_38 ? 'Zyski kapitałowe (Giełda/Krypto)' : type === TaxFormType.PIT_37 ? 'Umowa o pracę' : 'Działalność gospodarcza'}
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-blue-800 text-sm mb-8">
                <Info className="shrink-0" />
                <p>Nuffi automatycznie pobierze dane z podłączonych kont bankowych (Open Banking) oraz giełd kryptowalut (Nansen/Moralis) w celu wyliczenia podatku metodą FIFO.</p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleCalculate}
                disabled={isProcessing}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-70"
              >
                {isProcessing ? <Loader2 className="animate-spin" /> : 'Oblicz podatek'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Calculation Result (Detailed) */}
        {step === 2 && taxData && taxData.breakdown && (
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Raport Podatkowy (PIT + ZUS)</h3>
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded font-bold">WERYFIKACJA</span>
            </div>

            {/* AI Explanation Box */}
            {aiExplanation ? (
                <div className="mb-6 bg-indigo-50 p-6 rounded-xl border border-indigo-100 animate-in fade-in">
                    <div className="flex items-center gap-2 mb-2 font-bold text-indigo-800">
                        <Sparkles size={18} /> Nuffi AI Wyjaśnia
                    </div>
                    <div className="prose prose-sm text-slate-700">
                        <pre className="whitespace-pre-wrap font-sans text-sm">{aiExplanation}</pre>
                    </div>
                </div>
            ) : (
                <div className="mb-6 flex justify-end">
                    <button 
                        onClick={handleExplainAI}
                        disabled={explaining}
                        className="text-xs bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg font-bold hover:bg-indigo-100 flex items-center gap-2 transition-colors"
                    >
                        {explaining ? <Loader2 className="animate-spin" size={14} /> : <><MessageSquare size={14} /> Wyjaśnij wyliczenie z AI</>}
                    </button>
                </div>
            )}

            {/* Financial Breakdown Table */}
            <div className="border border-gray-200 rounded-xl overflow-hidden mb-8">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">Pozycja</th>
                            <th className="px-6 py-3 text-right font-medium">Kwota</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        <tr>
                            <td className="px-6 py-3 text-gray-600">Przychód (Revenue)</td>
                            <td className="px-6 py-3 text-right font-mono">{formatCurrency(taxData.breakdown.revenue)}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-3 text-gray-600">Koszty uzyskania (Costs)</td>
                            <td className="px-6 py-3 text-right font-mono text-red-600">-{formatCurrency(taxData.breakdown.costs)}</td>
                        </tr>
                        {taxData.breakdown.zus && (
                            <tr>
                                <td className="px-6 py-3 text-gray-600">Składki ZUS (Społeczne)</td>
                                <td className="px-6 py-3 text-right font-mono text-red-600">-{formatCurrency(taxData.breakdown.zus.deductibleFromTaxBase)}</td>
                            </tr>
                        )}
                        <tr className="bg-gray-50/50">
                            <td className="px-6 py-3 font-bold text-gray-900">Dochód (Income)</td>
                            <td className="px-6 py-3 text-right font-bold font-mono">{formatCurrency(taxData.breakdown.income)}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-3 text-gray-600">Ulga podatkowa (Tax Free)</td>
                            <td className="px-6 py-3 text-right font-mono text-green-600">-{formatCurrency(taxData.breakdown.taxFreeAmount)}</td>
                        </tr>
                        {taxData.breakdown.details.thresholdExceeded && (
                            <tr>
                                <td className="px-6 py-3 text-amber-600 flex items-center gap-2">
                                    <AlertTriangle size={14} /> Przekroczono II próg (120k)
                                </td>
                                <td className="px-6 py-3 text-right font-mono text-amber-600">32%</td>
                            </tr>
                        )}
                        <tr className="bg-indigo-50 border-t border-indigo-100">
                            <td className="px-6 py-4 font-bold text-indigo-900 text-lg">PODATEK NALEŻNY</td>
                            <td className="px-6 py-4 text-right font-bold text-indigo-600 text-xl font-mono">
                                {formatCurrency(taxData.taxDue)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {taxData.breakdown.zus && (
                <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200 text-sm">
                    <h4 className="font-bold text-gray-700 mb-2">Łączne obciążenie (Transfer do US/ZUS)</h4>
                    <div className="grid grid-cols-2 gap-4">
                         <div className="flex justify-between">
                            <span>ZUS Społeczne</span>
                            <span className="font-mono">{formatCurrency(taxData.breakdown.zus.socialTotal)}</span>
                         </div>
                         <div className="flex justify-between">
                            <span>ZUS Zdrowotna</span>
                            <span className="font-mono">{formatCurrency(taxData.breakdown.zus.healthInsurance)}</span>
                         </div>
                         <div className="col-span-2 border-t pt-2 flex justify-between font-bold text-gray-900">
                             <span>RAZEM DO ZAPŁATY (PIT + ZUS)</span>
                             <span>{formatCurrency(taxData.taxDue + taxData.breakdown.zus.totalDue)}</span>
                         </div>
                    </div>
                </div>
            )}
            
            <div className="flex justify-between items-center">
                <button onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-900 px-4 py-2 text-sm font-medium">
                    &larr; Skoryguj dane
                </button>
                <button onClick={handleSign} disabled={isProcessing} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200">
                    {isProcessing ? <Loader2 className="animate-spin" /> : <><PenTool size={18} /> Podpisz (mSzafir)</>}
                </button>
            </div>
          </div>
        )}

        {/* Step 3: Submission */}
        {step === 3 && (
             <div className="p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-in zoom-in">
                    <Check size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Dokument podpisany cyfrowo</h3>
                <p className="text-gray-500 mb-8 max-w-sm">Deklaracja {taxData?.type} została opatrzona kwalifikowanym podpisem elektronicznym (XAdES-BES).</p>
                
                <button onClick={handleSubmit} disabled={isProcessing} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200">
                    {isProcessing ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Wyślij do Ministerstwa Finansów</>}
                </button>
             </div>
        )}

        {/* Step 4: UPO & Payment */}
        {step === 4 && upo && (
             <div className="p-8">
                <div className="bg-green-50 border border-green-200 p-6 rounded-xl mb-8 flex items-start gap-4">
                    <CheckCircle2 className="text-green-600 shrink-0 mt-1" size={24} />
                    <div className="flex-1">
                        <h4 className="font-bold text-green-800 text-lg">Deklaracja przyjęta (Status 200)</h4>
                        <p className="text-green-700 text-sm mt-1">Ministerstwo Finansów potwierdziło odbiór dokumentu.</p>
                        <div className="mt-4 p-3 bg-white/60 border border-green-200 rounded font-mono text-xs text-green-900 break-all select-all">
                            {upo}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-4">
                    <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 flex items-center gap-2 transition-colors">
                        <Download size={18} /> Pobierz UPO (XML)
                    </button>
                    {taxData && taxData.taxDue > 0 && (
                        <button onClick={handlePayment} disabled={isProcessing} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all">
                            {isProcessing ? <Loader2 className="animate-spin" /> : <><CreditCard size={18} /> Zapłać {formatCurrency(taxData.taxDue)} (BLIK)</>}
                        </button>
                    )}
                </div>
             </div>
        )}
        
         {/* Step 5: Finished */}
         {step === 5 && (
             <div className="p-8 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
                 <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                     <Check size={48} />
                 </div>
                 <h2 className="text-3xl font-bold text-gray-900 mb-2">Gratulacje!</h2>
                 <p className="text-gray-500 max-w-md mx-auto mb-8">Twoje podatki za rok {taxData?.year} zostały pomyślnie rozliczone. Potwierdzenie wysłaliśmy na maila.</p>
                 <button onClick={() => setStep(1)} className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors flex items-center gap-2">
                    Wróć do pulpitu <ArrowRight size={16} />
                 </button>
             </div>
         )}
      </div>

      {/* Import fix */}
      <Modal isOpen={false} onClose={() => {}} title="">{null}</Modal> 
    </div>
  );
};
