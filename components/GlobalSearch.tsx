
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, FileText, Users, Box, Layout, ArrowRight, Loader2, Command, Zap, CreditCard, Calculator, Play, X } from 'lucide-react';
import { SearchResult, ViewState } from '../types';
import { NuffiService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewState) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // --- Reset & Focus on Open ---
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';

      // Force focus
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // --- Search Logic ---
  useEffect(() => {
    const search = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      try {
        const data = await NuffiService.searchGlobal(query);
        setResults(data);
        setSelectedIndex(0);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  // --- Navigation & Selection ---
  const quickActions = [
      { id: 'act_inv', type: 'ACTION', title: 'Wystaw Fakturę', subtitle: 'Nowy dokument sprzedaży', icon: <FileText size={18} />, action: () => onNavigate(ViewState.DOCUMENTS) },
      { id: 'act_pay', type: 'ACTION', title: 'Szybki Przelew', subtitle: 'Wykonaj płatność', icon: <CreditCard size={18} />, action: () => onNavigate(ViewState.YAPILY_CONNECT) },
      { id: 'act_tax', type: 'ACTION', title: 'Symulator Podatkowy', subtitle: 'Kalkulator B2B', icon: <Calculator size={18} />, action: () => onNavigate(ViewState.PRICE_CALCULATOR) },
      { id: 'act_eng', type: 'ACTION', title: 'Uruchom Tax Engine', subtitle: 'Przelicz podatek krypto', icon: <Play size={18} />, action: () => onNavigate(ViewState.TAX_ENGINE) },
  ];

  const currentItems = query ? results : quickActions;

  const handleKeyDownInput = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % currentItems.length);
      scrollSelectedIntoView((selectedIndex + 1) % currentItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + currentItems.length) % currentItems.length);
      scrollSelectedIntoView((selectedIndex - 1 + currentItems.length) % currentItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (currentItems[selectedIndex]) {
        handleSelect(currentItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const scrollSelectedIntoView = (index: number) => {
    if (listRef.current) {
        const item = listRef.current.children[index] as HTMLElement;
        if (item) {
            item.scrollIntoView({ block: 'nearest' });
        }
    }
  };

  const handleSelect = (item: any) => {
    onClose();
    if (item.action) {
      item.action();
    } else if (item.targetView) {
      onNavigate(item.targetView);
    }
  };

  const getIcon = (type: string) => {
      switch(type) {
          case 'INVOICE': return <FileText size={18} className="text-blue-500" />;
          case 'CONTRACTOR': return <Users size={18} className="text-green-500" />;
          case 'ASSET': return <Box size={18} className="text-amber-500" />;
          case 'VIEW': return <Layout size={18} className="text-indigo-500" />;
          default: return <Search size={18} />;
      }
  };

  // Render via Portal to attach to document.body (bypassing parent overflows)
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-[10vh] px-4 font-sans">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal - UPDATED BACKGROUND */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-[#0A0A0C] border border-white/10 rounded-2xl shadow-[0_0_50px_-10px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center px-4 py-4 border-b border-white/5 bg-white/5">
              <Search className="text-[#D4AF37] mr-3 shrink-0" size={20} />
              <input 
                ref={inputRef}
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDownInput}
                placeholder="Szukaj dokumentów, klientów lub wpisz komendę..." 
                className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder-zinc-500 font-medium h-full w-full"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />
              <div className="flex items-center gap-3 shrink-0">
                {loading && <Loader2 className="animate-spin text-[#D4AF37]" size={18} />}
                <button 
                    onClick={onClose} 
                    className="text-zinc-400 hover:text-white transition-colors bg-white/5 px-2 py-1 rounded text-xs font-bold border border-white/5"
                >
                    ESC
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2" ref={listRef}>
                {!query && (
                    <div className="px-3 py-2 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 mt-2">
                        Sugerowane
                    </div>
                )}
                
                {currentItems.length > 0 ? (
                    currentItems.map((item, idx) => (
                        <div
                            key={item.id || idx}
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${
                                idx === selectedIndex 
                                    ? 'bg-white/10 text-white shadow-lg border border-white/5' 
                                    : 'text-zinc-400 hover:bg-white/5'
                            }`}
                        >
                            <div className={`p-2 rounded-lg shrink-0 ${idx === selectedIndex ? 'bg-[#D4AF37] text-black' : 'bg-black/40 text-zinc-500 border border-white/5'}`}>
                                {item.icon || getIcon(item.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-bold ${idx === selectedIndex ? 'text-white' : 'text-zinc-200'}`}>{item.title}</p>
                                <p className={`text-xs truncate ${idx === selectedIndex ? 'text-zinc-300' : 'text-zinc-500'}`}>{item.subtitle}</p>
                            </div>
                            {idx === selectedIndex && (
                                <ArrowRight size={16} className="text-[#D4AF37] opacity-80 shrink-0" />
                            )}
                        </div>
                    ))
                ) : (
                    !loading && (
                        <div className="py-12 text-center text-zinc-500">
                            <Search size={40} className="mx-auto mb-3 opacity-20" />
                            <p className="text-sm">Brak wyników dla "{query}"</p>
                        </div>
                    )
                )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-[#050505] border-t border-white/5 flex justify-between items-center text-[10px] text-zinc-500 font-medium">
                <div className="flex gap-4">
                    <span className="flex items-center gap-1"><Command size={10} /> <strong>K</strong> otwórz</span>
                    <span className="flex items-center gap-1"><strong>&uarr;&darr;</strong> nawigacja</span>
                    <span className="flex items-center gap-1"><strong>Enter</strong> wybierz</span>
                </div>
                <div className="flex items-center gap-1 text-[#D4AF37]/50">
                    <Zap size={10} /> Nuffi Intelligence
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
