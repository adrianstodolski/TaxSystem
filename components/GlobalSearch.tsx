
import React, { useState, useEffect, useRef } from 'react';
import { Search, FileText, Users, Box, Layout, ArrowRight, Loader2, Command, X } from 'lucide-react';
import { SearchResult, ViewState } from '../types';
import { NuffiService } from '../services/api';

interface GlobalSearchProps {
  onNavigate: (view: ViewState) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Close on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const doSearch = async () => {
        if(query.length >= 2) {
            setLoading(true);
            const res = await NuffiService.searchGlobal(query);
            setResults(res);
            setLoading(false);
            setIsOpen(true);
        } else {
            setResults([]);
            setIsOpen(false);
        }
    };

    const timeout = setTimeout(doSearch, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
      setQuery('');
      setIsOpen(false);
      if(result.targetView) onNavigate(result.targetView);
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

  return (
    <div className="relative w-96" ref={wrapperRef}>
      <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 border border-transparent focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
        {loading ? <Loader2 size={18} className="text-indigo-600 animate-spin mr-2" /> : <Search size={18} className="text-gray-400 mr-2" />}
        <input 
            ref={inputRef}
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if(query.length >= 2) setIsOpen(true); }}
            placeholder="Szukaj faktur, klientów, widoków..." 
            className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-400"
        />
        {query && (
            <button onClick={() => { setQuery(''); setIsOpen(false); inputRef.current?.focus(); }} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
            </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {results.length === 0 && !loading ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                      Brak wyników dla "{query}"
                  </div>
              ) : (
                  <div className="max-h-[400px] overflow-y-auto">
                      {/* Grouping logic could be added here, simplified for now */}
                      <div className="py-2">
                        <div className="px-3 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Wyniki wyszukiwania</div>
                        {results.map((result) => (
                            <button 
                                key={result.id} 
                                onClick={() => handleSelect(result)}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 transition-colors text-left group border-b border-gray-50 last:border-0"
                            >
                                <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm group-hover:border-indigo-200">
                                    {getIcon(result.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate group-hover:text-indigo-700">{result.title}</p>
                                    <p className="text-xs text-gray-500 truncate">{result.subtitle}</p>
                                </div>
                                <ArrowRight size={14} className="text-gray-300 group-hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                            </button>
                        ))}
                      </div>
                  </div>
              )}
              <div className="bg-gray-50 p-2 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 px-4">
                  <div className="flex items-center gap-1">
                      <Command size={10} /> <span>Nuffi Global Search</span>
                  </div>
                  <span>{results.length} wyników</span>
              </div>
          </div>
      )}
    </div>
  );
};
