
import React from 'react';
import { Modal } from './ui/Modal';
import { ScrollText, TrendingUp, Leaf, Store, Check, ArrowRight, Sparkles, Zap } from 'lucide-react';

interface WelcomeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nuffi OS 2.0 – Co nowego?">
            <div className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-6 rounded-2xl border border-indigo-500/30 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/40">
                            <Sparkles className="text-white" size={24} />
                        </div>
                        <h3 className="font-bold text-white text-xl mb-2">Witaj w nowej erze finansów!</h3>
                        <p className="text-indigo-200 text-sm">
                            Zaktualizowaliśmy Twój terminal do wersji 2.0. Oto 4 kluczowe moduły, które pomogą Ci skalować biznes.
                        </p>
                    </div>
                    {/* Background Deco */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-colors group cursor-default">
                        <div className="bg-indigo-500/20 w-10 h-10 rounded-lg flex items-center justify-center text-indigo-400 mb-3 border border-indigo-500/30 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                            <ScrollText size={20} />
                        </div>
                        <h4 className="font-bold text-white text-sm">Umowy (AI CLM)</h4>
                        <p className="text-xs text-slate-400 mt-1">Automatyczna analiza umów, wykrywanie klauzul i pilnowanie terminów.</p>
                    </div>
                    
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition-colors group cursor-default">
                        <div className="bg-emerald-500/20 w-10 h-10 rounded-lg flex items-center justify-center text-emerald-400 mb-3 border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                            <TrendingUp size={20} />
                        </div>
                        <h4 className="font-bold text-white text-sm">Wealth Management</h4>
                        <p className="text-xs text-slate-400 mt-1">Globalny portfel inwestycyjny: Akcje, ETF, Surowce i Krypto w jednym widoku.</p>
                    </div>
                    
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-teal-500/50 transition-colors group cursor-default">
                        <div className="bg-teal-500/20 w-10 h-10 rounded-lg flex items-center justify-center text-teal-400 mb-3 border border-teal-500/30 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                            <Leaf size={20} />
                        </div>
                        <h4 className="font-bold text-white text-sm">ESG Reporting</h4>
                        <p className="text-xs text-slate-400 mt-1">Monitorowanie śladu węglowego i zgodność z dyrektywą CSRD.</p>
                    </div>
                    
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-purple-500/50 transition-colors group cursor-default">
                        <div className="bg-purple-500/20 w-10 h-10 rounded-lg flex items-center justify-center text-purple-400 mb-3 border border-purple-500/30 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                            <Store size={20} />
                        </div>
                        <h4 className="font-bold text-white text-sm">Marketplace</h4>
                        <p className="text-xs text-slate-400 mt-1">Usługi dodane: Leasing 0%, Ubezpieczenia i Faktoring jednym kliknięciem.</p>
                    </div>
                </div>

                <button 
                    onClick={onClose}
                    className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/50 group"
                >
                    <Zap size={18} className="fill-white group-hover:text-yellow-300 transition-colors" /> Zaczynamy
                </button>
            </div>
        </Modal>
    );
};
