
import React, { useState, useRef } from 'react';
import { NuffiService } from '../services/api';
import { ImportJob, CsvMapping } from '../types';
import { UploadCloud, FileSpreadsheet, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Wand2, Loader2, Table } from 'lucide-react';
import { toast } from './ui/Toast';

export const ImportWizard: React.FC = () => {
    const [step, setStep] = useState<number>(1);
    const [job, setJob] = useState<ImportJob | null>(null);
    const [mappings, setMappings] = useState<CsvMapping[]>([]);
    const [processing, setProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setProcessing(true);
        try {
            const result = await NuffiService.analyzeImportFile(file);
            const suggestions = await NuffiService.getAiMappingSuggestions(result.headers);
            setJob(result);
            setMappings(suggestions);
            setStep(2);
        } catch (err) {
            toast.error('Błąd importu', 'Nie udało się przetworzyć pliku.');
        } finally {
            setProcessing(false);
        }
    };

    const updateMapping = (header: string, field: any) => {
        setMappings(prev => prev.map(m => m.fileHeader === header ? { ...m, systemField: field } : m));
    };

    const handleImport = async () => {
        if (!job) return;
        setProcessing(true);
        await NuffiService.submitImport(job.id, mappings);
        setProcessing(false);
        setStep(3);
        toast.success('Sukces', `Zaimportowano ${job.totalRows} rekordów.`);
    };

    const reset = () => {
        setStep(1);
        setJob(null);
        setMappings([]);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <UploadCloud className="text-indigo-600" /> Import Wizard (Smart Mapper)
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Importuj dane z CSV/Excel. AI automatycznie dopasuje kolumny.
                    </p>
                </div>
            </header>

            {/* Stepper */}
            <div className="flex items-center justify-center mb-8">
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-indigo-600' : 'text-slate-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= 1 ? 'border-indigo-600 bg-indigo-50' : 'border-slate-300'}`}>1</div>
                    <span className="text-sm font-bold">Upload</span>
                </div>
                <div className="w-12 h-0.5 bg-slate-200 mx-2"></div>
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-indigo-600' : 'text-slate-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= 2 ? 'border-indigo-600 bg-indigo-50' : 'border-slate-300'}`}>2</div>
                    <span className="text-sm font-bold">Mapowanie (AI)</span>
                </div>
                <div className="w-12 h-0.5 bg-slate-200 mx-2"></div>
                <div className={`flex items-center gap-2 ${step >= 3 ? 'text-indigo-600' : 'text-slate-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= 3 ? 'border-indigo-600 bg-indigo-50' : 'border-slate-300'}`}>3</div>
                    <span className="text-sm font-bold">Gotowe</span>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
                {step === 1 && (
                    <div className="flex flex-col items-center justify-center h-full p-12">
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-indigo-200 rounded-2xl p-12 w-full max-w-xl text-center cursor-pointer hover:bg-indigo-50/50 hover:border-indigo-400 transition-all group"
                        >
                            <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                {processing ? <Loader2 className="animate-spin" size={32} /> : <FileSpreadsheet size={32} />}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Upuść plik CSV lub Excel tutaj</h3>
                            <p className="text-slate-500 text-sm">Obsługujemy wyciągi bankowe, raporty sprzedażowe (Stripe, Allegro) i inne.</p>
                            <input type="file" ref={fileInputRef} className="hidden" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} />
                        </div>
                    </div>
                )}

                {step === 2 && job && (
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">Mapowanie Kolumn</h3>
                                <p className="text-sm text-slate-500">Plik: {job.fileName} ({job.totalRows} wierszy)</p>
                            </div>
                            <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded text-xs font-bold flex items-center gap-1 border border-indigo-100">
                                <Wand2 size={12} /> AI Auto-Mapped
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 mb-8">
                            {mappings.map((mapping, idx) => (
                                <div key={idx} className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <div className="w-1/3">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Kolumna w pliku</p>
                                        <p className="font-mono font-bold text-slate-900">{mapping.fileHeader}</p>
                                    </div>
                                    <div className="text-slate-400">
                                        <ArrowRight size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Pole w Nuffi</p>
                                        <select 
                                            value={mapping.systemField}
                                            onChange={(e) => updateMapping(mapping.fileHeader, e.target.value)}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                                        >
                                            <option value="IGNORE">-- Ignoruj --</option>
                                            <option value="DATE">Data Operacji</option>
                                            <option value="AMOUNT">Kwota</option>
                                            <option value="CURRENCY">Waluta</option>
                                            <option value="DESCRIPTION">Opis / Tytuł</option>
                                            <option value="CONTRACTOR">Kontrahent</option>
                                        </select>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${mapping.confidence > 0.8 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {(mapping.confidence * 100).toFixed(0)}% pewności
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-slate-200 pt-6">
                            <h4 className="font-bold text-sm mb-4 flex items-center gap-2 text-slate-600"><Table size={16} /> Podgląd Danych (3 pierwsze wiersze)</h4>
                            <div className="overflow-x-auto rounded-lg border border-slate-200">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                        <tr>
                                            {job.headers.map((h, i) => <th key={i} className="px-4 py-2">{h}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                        {job.preview.map((row, i) => (
                                            <tr key={i}>
                                                {row.map((cell: any, j: number) => <td key={j} className="px-4 py-2 font-mono text-slate-700">{cell}</td>)}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <button onClick={reset} className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg">Anuluj</button>
                            <button 
                                onClick={handleImport}
                                disabled={processing}
                                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-lg disabled:opacity-70"
                            >
                                {processing ? <Loader2 className="animate-spin" /> : 'Importuj Dane'}
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="flex flex-col items-center justify-center h-full p-12 text-center">
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                            <CheckCircle2 size={48} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Import Zakończony!</h3>
                        <p className="text-slate-500 mb-8">Dane zostały poprawnie dodane do systemu i są teraz przetwarzane przez silnik podatkowy.</p>
                        <button onClick={reset} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2">
                            <RefreshCw size={16} /> Wróć do Startu
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
