
import React, { useEffect, useState, useRef } from 'react';
import { NuffiService } from '../services/api';
import { HelpCategory, HelpArticle, AgentMessage } from '../types';
import { Search, Book, ArrowRight, Zap, MessageSquare, X, Send, Bot, FileText, ChevronRight, GraduationCap, Loader2, Sparkles, Terminal } from 'lucide-react';
import { Modal } from './ui/Modal';

export const HelpCenter: React.FC = () => {
    const [categories, setCategories] = useState<HelpCategory[]>([]);
    const [articles, setArticles] = useState<HelpArticle[]>([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [activeArticle, setActiveArticle] = useState<HelpArticle | null>(null);
    const [loading, setLoading] = useState(true);

    // Agent State
    const [agentOpen, setAgentOpen] = useState(false);
    const [messages, setMessages] = useState<AgentMessage[]>([
        { id: '1', sender: 'AGENT', text: 'Cześć! Jestem Twoim opiekunem AI (n8n Workflow). W czym mogę pomóc?', timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isAgentThinking, setIsAgentThinking] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const load = async () => {
            const [cats, arts] = await Promise.all([
                NuffiService.fetchHelpCategories(),
                NuffiService.fetchHelpArticles()
            ]);
            setCategories(cats);
            setArticles(arts);
            setLoading(false);
        };
        load();
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isAgentThinking]);

    const handleSendMessage = async () => {
        if(!input.trim()) return;
        const userMsg: AgentMessage = { id: Date.now().toString(), sender: 'USER', text: input, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsAgentThinking(true);

        // Simulate n8n webhook call
        const responseText = await NuffiService.sendN8nMessage(userMsg.text);
        
        setIsAgentThinking(false);
        setMessages(prev => [...prev, { id: (Date.now()+1).toString(), sender: 'AGENT', text: responseText, timestamp: new Date() }]);
    };

    const filteredArticles = articles.filter(a => 
        (selectedCategory ? a.categoryId === selectedCategory : true) &&
        (a.title.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="relative bg-slate-900 text-white p-12 rounded-3xl overflow-hidden shadow-2xl">
                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-3 mb-4 text-indigo-400 font-bold uppercase tracking-wider text-xs">
                        <GraduationCap size={18} /> Nuffi Academy
                    </div>
                    <h2 className="text-4xl font-bold mb-4">Centrum Wiedzy & Wsparcie</h2>
                    <p className="text-slate-300 text-lg mb-8">
                        Przeszukaj instrukcje krok po kroku lub poproś naszego Agenta AI o wykonanie zadania.
                    </p>
                    
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Czego szukasz? (np. JPK, Krypto, ZUS)"
                            className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                </div>
                
                {/* Agent CTA */}
                <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:block">
                    <button 
                        onClick={() => setAgentOpen(true)}
                        className="group bg-indigo-600 hover:bg-indigo-500 text-white p-1 rounded-2xl transition-all shadow-xl hover:shadow-indigo-900/50 hover:-translate-y-1"
                    >
                        <div className="bg-[#0B1120] rounded-xl p-6 flex flex-col items-center gap-4 border border-indigo-500/30 w-64">
                            <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center relative">
                                <Bot size={32} className="text-indigo-400" />
                                <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0B1120] animate-pulse"></div>
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold">Opiekun AI (n8n)</h3>
                                <p className="text-xs text-slate-400 mt-1">Dostępny 24/7. Zapytaj o podatki.</p>
                            </div>
                            <div className="w-full bg-indigo-600 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-indigo-500 transition-colors">
                                Rozpocznij Czat <MessageSquare size={16} />
                            </div>
                        </div>
                    </button>
                </div>

                {/* Decorative BG */}
                <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
            </header>

            {/* Categories */}
            {!selectedCategory && !search && (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {categories.map(cat => (
                        <button 
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all text-left group"
                        >
                            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors mb-4">
                                <Book size={20} />
                            </div>
                            <h4 className="font-bold text-slate-900 mb-1">{cat.name}</h4>
                            <p className="text-xs text-slate-500 line-clamp-2">{cat.description}</p>
                        </button>
                    ))}
                </div>
            )}

            {/* Articles List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                    {selectedCategory && (
                        <button onClick={() => setSelectedCategory(null)} className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
                            Kategorie <ChevronRight size={12} />
                        </button>
                    )}
                    <h3 className="font-bold text-slate-900">
                        {search ? `Wyniki wyszukiwania: "${search}"` : selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'Najnowsze Artykuły'}
                    </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-100">
                    {filteredArticles.map(article => (
                        <div 
                            key={article.id}
                            onClick={() => setActiveArticle(article)}
                            className="bg-white p-6 cursor-pointer hover:bg-slate-50 transition-colors group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="bg-indigo-50 text-indigo-700 p-2 rounded-lg">
                                    <FileText size={20} />
                                </div>
                                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">{article.readTime}</span>
                            </div>
                            <h4 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-indigo-700 transition-colors">{article.title}</h4>
                            <p className="text-sm text-slate-500">{article.description}</p>
                            <div className="mt-4 flex items-center text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                Czytaj dalej <ArrowRight size={12} className="ml-1" />
                            </div>
                        </div>
                    ))}
                </div>
                {filteredArticles.length === 0 && (
                    <div className="p-12 text-center text-slate-400">
                        Brak artykułów spełniających kryteria.
                    </div>
                )}
            </div>

            {/* Article Modal */}
            <Modal isOpen={!!activeArticle} onClose={() => setActiveArticle(null)} title={activeArticle?.title || ''}>
                {activeArticle && (
                    <div className="space-y-6">
                        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-sm text-indigo-800 flex gap-3">
                            <Zap className="shrink-0" size={20} />
                            <p className="font-medium">{activeArticle.description}</p>
                        </div>
                        <div className="prose prose-sm prose-slate max-w-none">
                            {activeArticle.content.split('\n').map((line, i) => (
                                <p key={i} className="mb-2">{line}</p>
                            ))}
                        </div>
                        <div className="pt-6 border-t border-slate-100 flex justify-end">
                            <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800">
                                OK, Rozumiem
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* N8N AGENT CHAT (Floating or Modal) */}
            {agentOpen && (
                <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 h-[600px]">
                    {/* Chat Header */}
                    <div className="bg-[#0B1120] p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                                    <Bot size={20} />
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0B1120]"></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Nuffi Agent</h3>
                                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                    <Terminal size={10} /> Connected via n8n.io
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setAgentOpen(false)} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Chat Body */}
                    <div className="flex-1 bg-slate-50 p-4 overflow-y-auto space-y-4">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                                    msg.sender === 'USER' 
                                        ? 'bg-indigo-600 text-white rounded-br-none' 
                                        : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                                }`}>
                                    {msg.text}
                                    <div className={`text-[9px] mt-1 text-right ${msg.sender === 'USER' ? 'text-indigo-200' : 'text-slate-400'}`}>
                                        {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isAgentThinking && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2 text-xs text-slate-500">
                                    <Loader2 size={14} className="animate-spin text-indigo-600" />
                                    <span>Uruchamianie workflow...</span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="p-3 bg-white border-t border-slate-200">
                        <div className="relative">
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Napisz wiadomość..."
                                className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                            />
                            <button 
                                onClick={handleSendMessage}
                                disabled={!input.trim() || isAgentThinking}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                        <div className="mt-2 text-center">
                            <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                                <Sparkles size={10} /> AI może popełniać błędy. Sprawdź ważne informacje.
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
