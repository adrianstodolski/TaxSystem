
import React, { useEffect, useState, useRef } from 'react';
import { NuffiService } from '../services/api';
import { Contract } from '../types';
import { ScrollText, UploadCloud, Plus, Search, Calendar, AlertTriangle, CheckCircle2, FileText, Loader2, Sparkles } from 'lucide-react';
import { toast } from './ui/Toast';
import { Modal } from './ui/Modal';

export const Contracts: React.FC = () => {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchContracts();
            setContracts(data);
            setLoading(false);
        };
        load();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(!file) return;

        setUploading(true);
        // Simulate AI Analysis
        setTimeout(() => {
            const newContract: Contract = {
                id: `c_new_${Date.now()}`,
                name: file.name.replace('.pdf', ''),
                party: 'Wykryto: Google Ireland Ltd',
                type: 'B2B',
                startDate: new Date().toISOString().split('T')[0],
                currency: 'EUR',
                value: 2000,
                status: 'ACTIVE',
                noticePeriod: '1 miesiąc',
                autoRenewal: true,
                tags: ['Imported', 'AI-Scanned']
            };
            setContracts([newContract, ...contracts]);
            setUploading(false);
            toast.success('Analiza zakończona', 'AI wykryło kluczowe daty i strony umowy.');
        }, 2500);
    };

    const formatCurrency = (val: number, curr: string) => {
        try {
            return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: curr }).format(val);
        } catch (e) {
            return `${val.toLocaleString('pl-PL')} ${curr}`;
        }
    };

    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-200';
            case 'EXPIRING': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'TERMINATED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <ScrollText className="text-indigo-600" /> Rejestr Umów (AI CLM)
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Zarządzanie dokumentacją prawną z automatyczną analizą terminów.
                    </p>
                </div>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-sm transition-all"
                >
                    <Plus size={18} /> Dodaj Umowę
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.docx" onChange={handleFileUpload} />
            </header>

            {/* AI Upload Dropzone */}
            {uploading && (
                <div className="bg-indigo-50 border-2 border-dashed border-indigo-300 rounded-2xl p-8 flex flex-col items-center justify-center animate-in fade-in">
                    <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
                    <h3 className="font-bold text-indigo-900 text-lg">Analiza Gemini AI w toku...</h3>
                    <p className="text-indigo-600 mt-2">Przetwarzanie treści dokumentu, wykrywanie stron i terminów wypowiedzenia.</p>
                </div>
            )}

            {/* Contracts List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? [1,2,3].map(i => <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />) : 
                    contracts.map(contract => (
                        <div 
                            key={contract.id} 
                            onClick={() => setSelectedContract(contract)}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group relative overflow-hidden cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-slate-100 p-3 rounded-xl text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <FileText size={24} />
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${getStatusStyle(contract.status)}`}>
                                    {contract.status}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">{contract.name}</h3>
                            <p className="text-sm text-slate-500 mb-4">{contract.party}</p>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between border-b border-slate-50 pb-2">
                                    <span className="text-slate-400">Typ</span>
                                    <span className="font-medium text-slate-700">{contract.type}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-50 pb-2">
                                    <span className="text-slate-400">Wartość</span>
                                    <span className="font-bold text-slate-900">{contract.value ? formatCurrency(contract.value, contract.currency) : '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Koniec</span>
                                    <span className={`font-mono font-medium ${contract.status === 'EXPIRING' ? 'text-amber-600' : 'text-slate-700'}`}>
                                        {contract.endDate || 'Czas nieokreślony'}
                                    </span>
                                </div>
                            </div>

                            {contract.autoRenewal && (
                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-indigo-600 font-bold">
                                    <Sparkles size={12} /> Auto-odnowienie aktywne
                                </div>
                            )}
                        </div>
                    ))
                }
            </div>

            {/* Detail Modal */}
            <Modal isOpen={!!selectedContract} onClose={() => setSelectedContract(null)} title="Szczegóły Umowy">
                {selectedContract && (
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg">{selectedContract.name}</h3>
                                <span className="bg-white border border-slate-300 px-2 py-1 rounded text-xs font-mono">{selectedContract.id}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold">Strona Umowy</p>
                                    <p className="font-medium">{selectedContract.party}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold">Data Zawarcia</p>
                                    <p className="font-medium">{selectedContract.startDate}</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                            <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                                <Sparkles size={16} className="text-indigo-600" /> Analiza AI
                            </h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                                    <span>Okres wypowiedzenia zidentyfikowany jako <strong>{selectedContract.noticePeriod}</strong>.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                    <span>Klauzula auto-odnowienia jest obecna. Wymagane działanie przed końcem okresu.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">Edytuj</button>
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700">Pobierz PDF</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
