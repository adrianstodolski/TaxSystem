
import React from 'react';
import { Modal } from './ui/Modal';
import { ScrollText, TrendingUp, Leaf, Store, Check, ArrowRight } from 'lucide-react';

interface WelcomeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Co nowego w Nuffi 2.0?">
            <div className="space-y-6">
                <div className="bg-indigo-50 p-4 rounded-xl text-center">
                    <h3 className="font-bold text-indigo-900 text-lg">Witaj w nowej wersji platformy!</h3>
                    <p className="text-sm text-indigo-700 mt-1">Dodaliśmy 4 kluczowe moduły, aby jeszcze lepiej wspierać Twój biznes.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="border border-slate-200 p-4 rounded-xl hover:border-indigo-300 transition-colors">
                        <div className="bg-indigo-100 w-10 h-10 rounded-lg flex items-center justify-center text-indigo-600 mb-3">
                            <ScrollText size={20} />
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">Umowy (AI CLM)</h4>
                        <p className="text-xs text-slate-500 mt-1">Automatyczna analiza dokumentów prawnych i pilnowanie terminów.</p>
                    </div>
                    <div className="border border-slate-200 p-4 rounded-xl hover:border-emerald-300 transition-colors">
                        <div className="bg-emerald-100 w-10 h-10 rounded-lg flex items-center justify-center text-emerald-600 mb-3">
                            <TrendingUp size={20} />
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">Wealth Management</h4>
                        <p className="text-xs text-slate-500 mt-1">Globalny portfel inwestycyjny: Akcje, ETF i Surowce.</p>
                    </div>
                    <div className="border border-slate-200 p-4 rounded-xl hover:border-teal-300 transition-colors">
                        <div className="bg-teal-100 w-10 h-10 rounded-lg flex items-center justify-center text-teal-600 mb-3">
                            <Leaf size={20} />
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">ESG Reporting</h4>
                        <p className="text-xs text-slate-500 mt-1">Monitorowanie śladu węglowego i certyfikacja Eco.</p>
                    </div>
                    <div className="border border-slate-200 p-4 rounded-xl hover:border-purple-300 transition-colors">
                        <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center text-purple-600 mb-3">
                            <Store size={20} />
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">Marketplace</h4>
                        <p className="text-xs text-slate-500 mt-1">Usługi dodane: Leasing, Ubezpieczenia i Faktoring.</p>
                    </div>
                </div>

                <button 
                    onClick={onClose}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                >
                    Zaczynamy <ArrowRight size={18} />
                </button>
            </div>
        </Modal>
    );
};
