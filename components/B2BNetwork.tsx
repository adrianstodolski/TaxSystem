
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { Invoice, CeidgCompany } from '../types';
import { Network, Zap, ShieldCheck, CheckCircle2, ArrowRight, Wallet, Users, Search, Globe, MessageSquare, Bell, Loader2, Building, AlertTriangle } from 'lucide-react';
import { toast } from './ui/Toast';

export const B2BNetwork: React.FC = () => {
    // Search State
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState<CeidgCompany[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        if(query.length < 3) return;
        setIsSearching(true);
        setHasSearched(true);
        const results = await NuffiService.searchCeidgAndWhiteList(query);
        setSearchResults(results);
        setIsSearching(false);
    };

    const handleInstantPay = async (company: CeidgCompany) => {
        if (!company.verifiedIban) {
            toast.error('Brak numeru konta', 'Ta firma nie ma zweryfikowanego rachunku na Białej Liście VAT.');
            return;
        }
        toast.info('Inicjowanie płatności PIS', `Łączenie z bankiem kontrahenta (${company.name})...`);
        await new Promise(r => setTimeout(r, 2000));
        await NuffiService.processPayment(1230.00, 'PIS'); // Mock amount
        toast.success('Płatność wykonana', `Przelew natychmiastowy (PIS) zrealizowany na rachunek ${company.verifiedIban}.`);
    };

    const handlePing = async (company: CeidgCompany) => {
        toast.success('Wysłano powiadomienie', `Użytkownik ${company.name} otrzymał przypomnienie w aplikacji Nuffi.`);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
             <header className="flex justify-between items-end border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Globe className="text-indigo-600" /> Open Company Intelligence (OCI)
                    </h2>
                    <p className="text-slate-500 mt-1">Globalna baza firm (CEIDG) zintegrowana z płatnościami natychmiastowymi.</p>
                </div>
            </header>

            {/* Hero Search Section */}
            <div className="relative bg-[#0F172A] rounded-2xl p-12 text-white overflow-hidden shadow-2xl border border-slate-800">
                <div className="relative z-10 text-center max-w-2xl mx-auto">
                    <h3 className="text-3xl font-bold mb-4 tracking-tight">Znajdź firmę. Zapłać w sekundę.</h3>
                    <p className="text-slate-400 mb-8 text-lg">
                        Przeszukuj bazę 4 milionów polskich firm. Weryfikujemy Białą Listę VAT w czasie rzeczywistym.
                    </p>
                    
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                        </div>
                        <input 
                            type="text" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Wpisz NIP, nazwę firmy lub adres..." 
                            className="w-full py-4 pl-12 pr-32 bg-slate-800/50 border border-slate-700 rounded-xl text-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-800 transition-all shadow-inner"
                        />
                        <button 
                            onClick={handleSearch}
                            disabled={isSearching}
                            className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 rounded-lg font-bold transition-all disabled:opacity-50"
                        >
                            {isSearching ? <Loader2 className="animate-spin" /> : 'Szukaj'}
                        </button>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
            </div>

            {/* Results Section */}
            {hasSearched && (
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
                        <Building size={14} /> Wyniki Wyszukiwania ({searchResults.length})
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {searchResults.map((company, idx) => (
                            <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:border-indigo-300 transition-all group relative overflow-hidden">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                                    <div className="flex items-center gap-6 w-full md:w-auto">
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold shadow-sm ${company.isNuffiUser ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
                                            {company.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-lg font-bold text-slate-900">{company.name}</h4>
                                                {company.isNuffiUser && (
                                                    <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 border border-indigo-100 uppercase tracking-wide">
                                                        <Network size={10} /> Member
                                                    </span>
                                                )}
                                                {company.status === 'ACTIVE' ? (
                                                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wide">AKTYWNA</span>
                                                ) : (
                                                    <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-100 uppercase tracking-wide">{company.status}</span>
                                                )}
                                            </div>
                                            <div className="flex flex-col md:flex-row gap-2 md:gap-6 mt-1 text-sm text-slate-500 font-mono">
                                                <span>NIP: {company.nip}</span>
                                                <span>REGON: {company.regon}</span>
                                                <span className="text-slate-400 font-sans">{company.address}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                                        {company.verifiedIban ? (
                                            <div className="hidden md:block text-right mr-4">
                                                <div className="flex items-center justify-end gap-1 text-emerald-600 font-bold text-xs uppercase tracking-wide">
                                                    <ShieldCheck size={14} /> Biała Lista
                                                </div>
                                                <div className="text-xs text-slate-400 font-mono">
                                                    {company.verifiedIban}
                                                </div>
                                            </div>
                                        ) : (
                                             <div className="hidden md:block text-right mr-4">
                                                <div className="flex items-center justify-end gap-1 text-amber-500 font-bold text-xs uppercase tracking-wide">
                                                    <AlertTriangle size={14} /> Brak rachunku
                                                </div>
                                            </div>
                                        )}

                                        {company.isNuffiUser ? (
                                            <>
                                                <button onClick={() => handlePing(company)} className="bg-white border border-slate-200 text-slate-700 p-2.5 rounded-lg hover:bg-slate-50 transition-colors" title="Wyślij wiadomość">
                                                    <MessageSquare size={18} />
                                                </button>
                                                <button onClick={() => handlePing(company)} className="bg-white border border-slate-200 text-slate-700 p-2.5 rounded-lg hover:bg-slate-50 transition-colors" title="Ping Płatniczy">
                                                    <Bell size={18} />
                                                </button>
                                            </>
                                        ) : null}

                                        <button 
                                            onClick={() => handleInstantPay(company)}
                                            disabled={!company.verifiedIban}
                                            className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-slate-800 shadow-md flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        >
                                            <Zap size={16} className="fill-yellow-400 text-yellow-400" /> 
                                            Zapłać
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
