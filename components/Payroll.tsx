
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { Employee, PayrollEntry } from '../types';
import { Users, Briefcase, FileText, Download, CheckCircle2, AlertTriangle, Calculator, ChevronRight, Play, Loader2, DollarSign } from 'lucide-react';
import { toast } from './ui/Toast';
import { Modal } from './ui/Modal';

export const Payroll: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [payroll, setPayroll] = useState<PayrollEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [activeTab, setActiveTab] = useState<'EMPLOYEES' | 'PAYROLL'>('EMPLOYEES');
    
    // Details Modal
    const [selectedEntry, setSelectedEntry] = useState<PayrollEntry | null>(null);

    useEffect(() => {
        const load = async () => {
            const emp = await NuffiService.fetchEmployees();
            setEmployees(emp);
            setLoading(false);
        };
        load();
    }, []);

    const handleRunPayroll = async () => {
        setGenerating(true);
        const entries = await NuffiService.runPayroll('2023-10');
        setPayroll(entries);
        setGenerating(false);
        setActiveTab('PAYROLL');
        toast.success('Lista Płac Wygenerowana', `Przeliczono wynagrodzenia dla ${entries.length} osób.`);
    };

    const formatCurrency = (val: number) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(val);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Users className="text-indigo-400" /> Kadry i Płace (HR)
                    </h2>
                    <p className="text-slate-400 mt-1">Zarządzanie pracownikami, ewidencja czasu pracy i rozliczenia ZUS.</p>
                </div>
                <div className="flex bg-slate-900 p-1 rounded-lg border border-white/10">
                    <button 
                        onClick={() => setActiveTab('EMPLOYEES')}
                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'EMPLOYEES' ? 'bg-indigo-600 text-white shadow-glow' : 'text-slate-400 hover:text-white'}`}
                    >
                        Pracownicy
                    </button>
                    <button 
                        onClick={() => setActiveTab('PAYROLL')}
                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'PAYROLL' ? 'bg-indigo-600 text-white shadow-glow' : 'text-slate-400 hover:text-white'}`}
                    >
                        Lista Płac
                    </button>
                </div>
            </header>

            {activeTab === 'EMPLOYEES' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? [1,2,3].map(i => <div key={i} className="h-40 bg-slate-800/50 rounded-xl animate-pulse" />) : 
                        employees.map(emp => (
                            <div key={emp.id} className="glass-card p-6 rounded-2xl hover:border-indigo-500/40 transition-all group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-lg font-bold text-slate-300 border border-slate-700">
                                            {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">{emp.firstName} {emp.lastName}</h4>
                                            <p className="text-xs text-slate-400">{emp.position}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${emp.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
                                        {emp.status}
                                    </span>
                                </div>
                                
                                <div className="space-y-2 text-sm mb-4">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Umowa</span>
                                        <span className="font-bold text-indigo-400">{emp.contractType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Wynagrodzenie</span>
                                        <span className="font-mono text-slate-300">{formatCurrency(emp.salaryAmount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Zatrudniony od</span>
                                        <span className="text-slate-300">{emp.joinDate}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/10 flex gap-2">
                                    <button className="flex-1 bg-white/5 border border-white/10 text-slate-300 py-2 rounded-lg text-xs font-bold hover:bg-white/10">
                                        Szczegóły
                                    </button>
                                    <button className="flex-1 bg-white/5 border border-white/10 text-slate-300 py-2 rounded-lg text-xs font-bold hover:bg-white/10">
                                        Historia
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                    {/* Add Button */}
                    <button className="border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center text-slate-500 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all min-h-[240px]">
                        <div className="w-12 h-12 bg-slate-800 rounded-full shadow-sm flex items-center justify-center mb-3 text-slate-400">
                            <Users size={24} />
                        </div>
                        <span className="font-bold">Dodaj pracownika</span>
                    </button>
                </div>
            )}

            {activeTab === 'PAYROLL' && (
                <div className="space-y-6">
                    {payroll.length === 0 ? (
                        <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-12 text-center">
                            <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
                                <Calculator size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Lista płac nie została wygenerowana</h3>
                            <p className="text-slate-400 mb-8">Rozpocznij proces naliczania wynagrodzeń za bieżący miesiąc.</p>
                            <button 
                                onClick={handleRunPayroll}
                                disabled={generating}
                                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-900/50 transition-all flex items-center gap-2 mx-auto disabled:opacity-70"
                            >
                                {generating ? <Loader2 className="animate-spin" /> : <><Play size={18} fill="currentColor" /> Generuj Listę Płac</>}
                            </button>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4">
                            {/* Summary Bar */}
                            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-xl mb-6 flex justify-between items-center border border-slate-700">
                                <div>
                                    <p className="text-indigo-300 text-sm font-medium uppercase mb-1">Całkowity Koszt Pracodawcy</p>
                                    <h3 className="text-3xl font-bold font-mono">
                                        {formatCurrency(payroll.reduce((acc, p) => acc + p.employerCostTotal, 0))}
                                    </h3>
                                </div>
                                <div className="flex gap-4">
                                    <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 border border-white/10">
                                        <FileText size={16} /> ZUS DRA
                                    </button>
                                    <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 shadow-lg shadow-indigo-900/50">
                                        <DollarSign size={16} /> Wykonaj Przelewy
                                    </button>
                                </div>
                            </div>

                            <div className="glass-card rounded-xl overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-900/50 text-slate-400 border-b border-white/10">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Pracownik</th>
                                            <th className="px-6 py-3 font-medium">Umowa</th>
                                            <th className="px-6 py-3 font-medium text-right">Brutto</th>
                                            <th className="px-6 py-3 font-medium text-right">Koszt Pracodawcy</th>
                                            <th className="px-6 py-3 font-medium text-right">Do Wypłaty (Netto)</th>
                                            <th className="px-6 py-3 font-medium text-center">Akcja</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {payroll.map((entry, idx) => (
                                            <tr key={idx} className="hover:bg-white/5 group">
                                                <td className="px-6 py-4 font-bold text-white">{entry.employeeName}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${entry.contractType === 'UOP' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-purple-500/20 text-purple-400 border-purple-500/30'}`}>
                                                        {entry.contractType}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-slate-400">{formatCurrency(entry.salaryGross)}</td>
                                                <td className="px-6 py-4 text-right font-mono text-slate-400">{formatCurrency(entry.employerCostTotal)}</td>
                                                <td className="px-6 py-4 text-right font-bold text-emerald-400 font-mono text-lg">{formatCurrency(entry.salaryNet)}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <button onClick={() => setSelectedEntry(entry)} className="text-indigo-400 hover:bg-white/5 p-2 rounded transition-colors">
                                                        <ChevronRight size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* PAYROLL DETAILS MODAL */}
            <Modal isOpen={!!selectedEntry} onClose={() => setSelectedEntry(null)} title={`Szczegóły: ${selectedEntry?.employeeName}`}>
                {selectedEntry && (
                    <div className="space-y-6">
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold">Do Wypłaty</p>
                                <p className="text-2xl font-bold text-emerald-400 font-mono">{formatCurrency(selectedEntry.salaryNet)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400 uppercase font-bold">Umowa</p>
                                <p className="text-lg font-bold text-white">{selectedEntry.contractType}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-bold text-white text-sm border-b border-slate-700 pb-2">Klin Podatkowy (Tax Wedge)</h4>
                            
                            <div className="flex justify-between text-sm py-1">
                                <span className="text-slate-400">Koszt Pracodawcy</span>
                                <span className="font-mono font-bold text-white">{formatCurrency(selectedEntry.employerCostTotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm py-1 text-rose-400">
                                <span className="pl-4">ZUS Pracodawcy</span>
                                <span className="font-mono">-{formatCurrency(selectedEntry.zusEmployer)}</span>
                            </div>
                            <div className="flex justify-between text-sm py-1 bg-slate-800/50 font-bold px-2 rounded">
                                <span className="text-slate-200">Wynagrodzenie Brutto</span>
                                <span className="font-mono text-white">{formatCurrency(selectedEntry.salaryGross)}</span>
                            </div>
                            <div className="flex justify-between text-sm py-1 text-rose-400">
                                <span className="pl-4">ZUS Pracownika</span>
                                <span className="font-mono">-{formatCurrency(selectedEntry.zusEmployee)}</span>
                            </div>
                            <div className="flex justify-between text-sm py-1 text-rose-400">
                                <span className="pl-4">NFZ (Zdrowotna)</span>
                                <span className="font-mono">-{formatCurrency(selectedEntry.healthInsurance)}</span>
                            </div>
                            <div className="flex justify-between text-sm py-1 text-rose-400">
                                <span className="pl-4">Zaliczka PIT</span>
                                <span className="font-mono">-{formatCurrency(selectedEntry.pitAdvance)}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-700 flex justify-end">
                            <button className="bg-slate-800 border border-slate-600 text-slate-300 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-700 flex items-center gap-2 transition-colors">
                                <Download size={14} /> Pobierz Pasek (PDF)
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
