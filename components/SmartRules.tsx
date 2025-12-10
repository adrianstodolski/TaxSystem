
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { AutomationRule } from '../types';
import { Workflow, Plus, Play, Pause, Zap, ArrowRight, Settings, Trash2, CheckCircle2 } from 'lucide-react';
import { toast } from './ui/Toast';

export const SmartRules: React.FC = () => {
    const [rules, setRules] = useState<AutomationRule[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchAutomationRules();
            setRules(data);
            setLoading(false);
        };
        load();
    }, []);

    const toggleRule = async (rule: AutomationRule) => {
        await NuffiService.toggleAutomationRule(rule.id, !rule.active);
        setRules(prev => prev.map(r => r.id === rule.id ? {...r, active: !r.active} : r));
        toast.success('Status zmieniony', `Reguła "${rule.name}" jest teraz ${!rule.active ? 'AKTYWNA' : 'NIEAKTYWNA'}.`);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Workflow className="text-indigo-600" /> Smart Rules (Automatyzacja)
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Zdefiniuj reguły "If This Then That" dla swoich finansów.
                    </p>
                </div>
                <button 
                    onClick={() => toast.info('Kreator', 'Otwieranie wizualnego edytora reguł...')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-lg shadow-indigo-200"
                >
                    <Plus size={18} /> Nowa Reguła
                </button>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {rules.map(rule => (
                    <div key={rule.id} className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${rule.active ? 'border-indigo-200 ring-1 ring-indigo-50' : 'border-slate-200 opacity-75'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${rule.active ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                    <Zap size={24} className={rule.active ? 'fill-indigo-600' : ''} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-slate-900">{rule.name}</h4>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">IF {rule.trigger}</span>
                                        <ArrowRight size={12} />
                                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">THEN {rule.action}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {rule.lastTriggered && (
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <CheckCircle2 size={12} /> Ost. uruchomienie: {rule.lastTriggered}
                                    </span>
                                )}
                                <div className="h-8 w-px bg-slate-200"></div>
                                <button 
                                    onClick={() => toggleRule(rule)}
                                    className={`p-2 rounded-lg transition-colors ${rule.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                >
                                    {rule.active ? <Pause size={20} /> : <Play size={20} />}
                                </button>
                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg">
                                    <Settings size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
