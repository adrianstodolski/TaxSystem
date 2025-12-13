
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { AutomationRule } from '../types';
import { Workflow, Plus, Play, Pause, Zap, ArrowRight, Settings, Trash2, CheckCircle2, Split, GitMerge, Box, Activity } from 'lucide-react';
import { toast } from './ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';

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
        toast.success('Status sentinela zmieniony', `Reguła "${rule.name}" jest teraz ${!rule.active ? 'AKTYWNA' : 'UŚPIONA'}.`);
    };

    const getTriggerIcon = (trigger: string) => {
        if(trigger.includes('Invoice')) return <Box size={16} />;
        if(trigger.includes('Balance')) return <Activity size={16} />;
        return <Zap size={16} />;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Workflow className="text-gold" /> Logic Sentinels
                    </h2>
                    <p className="text-zinc-400 mt-1">
                        Autonomiczne agenty automatyzacji. Definiuj logikę "If This Then That".
                    </p>
                </div>
                <button 
                    onClick={() => toast.info('Kreator', 'Otwieranie edytora wizualnego...')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-500 flex items-center gap-2 shadow-lg shadow-indigo-900/50 transition-all"
                >
                    <Plus size={18} /> Nowy Sentinel
                </button>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {rules.map((rule, idx) => (
                    <motion.div 
                        key={rule.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`neo-card p-0 rounded-2xl overflow-hidden transition-all group ${rule.active ? 'border-gold/30 shadow-[0_0_15px_-5px_rgba(212,175,55,0.1)]' : 'border-white/5 opacity-60 grayscale'}`}
                    >
                        {/* Header Status Bar */}
                        <div className={`h-1 w-full ${rule.active ? 'bg-gold' : 'bg-zinc-700'}`}></div>
                        
                        <div className="p-6 flex flex-col md:flex-row items-center gap-8">
                            {/* Visual Logic Flow */}
                            <div className="flex-1 flex items-center gap-4 w-full">
                                {/* Trigger Node */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 bg-[#0A0A0C] border border-white/10 rounded-xl flex items-center justify-center text-white shadow-sm relative z-10 group-hover:border-gold/50 transition-colors">
                                        {getTriggerIcon(rule.trigger)}
                                    </div>
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide bg-black/40 px-2 py-0.5 rounded border border-white/5">Trigger</span>
                                </div>

                                {/* Connector Line */}
                                <div className="flex-1 h-px bg-white/10 relative">
                                    {rule.active && (
                                        <div className="absolute top-1/2 left-0 w-2 h-2 bg-gold rounded-full -mt-1 animate-[moveRight_2s_linear_infinite]"></div>
                                    )}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0A0A0C] px-2 text-[10px] text-zinc-500 border border-white/10 rounded">
                                        {rule.condition}
                                    </div>
                                </div>

                                {/* Action Node */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 bg-[#0A0A0C] border border-white/10 rounded-xl flex items-center justify-center text-white shadow-sm relative z-10 group-hover:border-indigo-500/50 transition-colors">
                                        <Zap size={16} />
                                    </div>
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide bg-black/40 px-2 py-0.5 rounded border border-white/5">Action</span>
                                </div>
                            </div>

                            {/* Details & Controls */}
                            <div className="w-full md:w-auto flex items-center justify-between gap-8 border-l border-white/5 pl-8">
                                <div>
                                    <h4 className="font-bold text-white text-lg">{rule.name}</h4>
                                    <p className="text-xs text-zinc-400 mt-1 max-w-[200px]">{rule.action}</p>
                                    {rule.lastTriggered && (
                                        <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-400">
                                            <CheckCircle2 size={10} /> Executed: {rule.lastTriggered}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => toggleRule(rule)}
                                        className={`p-3 rounded-xl transition-all border ${rule.active ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20' : 'bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10'}`}
                                    >
                                        {rule.active ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                                    </button>
                                    <button className="p-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition-colors">
                                        <Settings size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            <style>{`
                @keyframes moveRight {
                    0% { left: 0; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { left: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    );
};
