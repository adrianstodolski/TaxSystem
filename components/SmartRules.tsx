
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
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Workflow className="text-gold" /> Smart Rules (Automatyzacja)
                    </h2>
                    <p className="text-zinc-400 mt-1">
                        Zdefiniuj reguły "If This Then That" dla swoich finansów.
                    </p>
                </div>
                <button 
                    onClick={() => toast.info('Kreator', 'Otwieranie wizualnego edytora reguł...')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-500 flex items-center gap-2 shadow-lg shadow-indigo-900/50"
                >
                    <Plus size={18} /> Nowa Reguła
                </button>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {rules.map(rule => (
                    <div key={rule.id} className={`neo-card p-6 rounded-2xl transition-all ${rule.active ? 'border-gold/30 shadow-[0_0_15px_-5px_rgba(212,175,55,0.2)]' : 'border-white/5 opacity-75 grayscale'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${rule.active ? 'bg-gold/10 text-gold border-gold/20' : 'bg-white/5 text-zinc-500 border-white/5'}`}>
                                    <Zap size={24} className={rule.active ? 'fill-gold' : ''} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-white">{rule.name}</h4>
                                    <div className="flex items-center gap-2 text-sm text-zinc-400 mt-1">
                                        <span className="font-mono bg-black/40 px-2 py-0.5 rounded text-xs border border-white/5">IF {rule.trigger}</span>
                                        <ArrowRight size={12} />
                                        <span className="font-mono bg-black/40 px-2 py-0.5 rounded text-xs border border-white/5">THEN {rule.action}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {rule.lastTriggered && (
                                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                                        <CheckCircle2 size={12} /> Ost. uruchomienie: {rule.lastTriggered}
                                    </span>
                                )}
                                <div className="h-8 w-px bg-white/5"></div>
                                <button 
                                    onClick={() => toggleRule(rule)}
                                    className={`p-2 rounded-lg transition-colors border ${rule.active ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20' : 'bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10'}`}
                                >
                                    {rule.active ? <Pause size={20} /> : <Play size={20} />}
                                </button>
                                <button className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg">
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
