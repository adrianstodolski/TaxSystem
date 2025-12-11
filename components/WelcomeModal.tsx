
import React from 'react';
import { Modal } from './ui/Modal';
import { ScrollText, TrendingUp, Leaf, Store, Check, ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';

interface WelcomeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nuffi OS 3.0 (Alpha)">
            <div className="space-y-8">
                <div className="relative overflow-hidden rounded-2xl bg-[#0A0A0C] border border-white/10 p-8 text-center group">
                    {/* Glow Effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#D4AF37]/20 blur-[80px] rounded-full pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#D4AF37]/30 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                            <Sparkles className="text-[#D4AF37]" size={32} />
                        </div>
                        <h3 className="font-bold text-white text-2xl mb-3">Witaj w nowej erze finansów!</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto">
                            Zaktualizowaliśmy Twój terminal do wersji <strong>Neo-Finance 2027</strong>. 
                            Interfejs został zoptymalizowany pod kątem szybkości i pracy w trybie Deep Focus.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors group cursor-default">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30">
                                <ScrollText size={18} />
                            </div>
                            <h4 className="font-bold text-white text-sm">AI CLM Contracts</h4>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed">Automatyczna analiza umów i wykrywanie klauzul przez Gemini 1.5 Pro.</p>
                    </div>
                    
                    <div className="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors group cursor-default">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
                                <TrendingUp size={18} />
                            </div>
                            <h4 className="font-bold text-white text-sm">Wealth Engine</h4>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed">Globalny portfel: Akcje, ETF, Krypto i Nieruchomości w jednym widoku.</p>
                    </div>
                    
                    <div className="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors group cursor-default">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-[#D4AF37]/20 text-[#D4AF37] rounded-lg border border-[#D4AF37]/30">
                                <ShieldCheck size={18} />
                            </div>
                            <h4 className="font-bold text-white text-sm">Audit Defender</h4>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed">System generuje bezpieczne paczki dowodowe (JPK) w czasie rzeczywistym.</p>
                    </div>
                    
                    <div className="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors group cursor-default">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/30">
                                <Store size={18} />
                            </div>
                            <h4 className="font-bold text-white text-sm">Marketplace 2.0</h4>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed">Leasing 0%, Faktoring i Ubezpieczenia jednym kliknięciem.</p>
                    </div>
                </div>

                <button 
                    onClick={onClose}
                    className="w-full bg-[#D4AF37] text-black py-4 rounded-xl font-bold hover:bg-[#FCD34D] transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_-5px_rgba(212,175,55,0.4)] group text-sm uppercase tracking-wider"
                >
                    <Zap size={18} className="fill-black group-hover:scale-110 transition-transform" /> Uruchom System
                </button>
            </div>
        </Modal>
    );
};
