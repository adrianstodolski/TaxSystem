
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Minimize2, Sparkles, Command, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { NuffiService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', text: 'Cześć! Jestem Twoim asystentem podatkowym Nuffi. Jak mogę Ci dzisiaj pomóc z podatkami lub księgowością?', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      const handleOpenChat = () => setIsOpen(true);
      const handleChatPrompt = (e: any) => {
          setIsOpen(true);
          const prompt = e.detail?.prompt;
          if (prompt) {
              handleSend(prompt);
          }
      };

      window.addEventListener('nuffi:open-chat', handleOpenChat);
      window.addEventListener('nuffi:chat-prompt', handleChatPrompt);

      return () => {
          window.removeEventListener('nuffi:open-chat', handleOpenChat);
          window.removeEventListener('nuffi:chat-prompt', handleChatPrompt);
      };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || inputText;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const historyContext = messages.map(m => ({ ...m }));
      const responseText = await NuffiService.sendAIChatMessage(userMsg.text, historyContext);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <AnimatePresence>
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-[#0A0A0C] hover:bg-[#141419] border border-gold/30 text-gold p-4 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all hover:scale-105 z-40 group"
        >
          <Sparkles size={24} />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
            Nuffi AI
          </span>
        </motion.button>
      )}
      </AnimatePresence>

      <AnimatePresence>
      {isOpen && (
        <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[400px] bg-[#0A0A0C]/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 flex flex-col z-50 h-[600px] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#141419] p-4 flex justify-between items-center border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="bg-gold/10 p-2 rounded-xl border border-gold/20">
                <Bot size={20} className="text-gold" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Nuffi AI Assistant</h3>
                <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Gemini 2.5 Flash
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors text-zinc-400 hover:text-white">
                <Minimize2 size={16} />
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors text-zinc-400 hover:text-white">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-gradient-to-b from-[#0A0A0C] to-black/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border ${
                  msg.role === 'user' ? 'bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-gold/10 text-gold border-gold/20'
                }`}>
                  {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                </div>
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed border ${
                    msg.role === 'user'
                      ? 'bg-zinc-900/50 text-white rounded-tr-none border-zinc-800'
                      : 'bg-white/5 text-zinc-200 rounded-tl-none border-white/5'
                  }`}
                >
                  <div className="whitespace-pre-wrap">
                      {msg.text}
                  </div>
                  <div className={`text-[9px] mt-1 text-right font-mono opacity-50`}>
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0 border border-gold/20">
                    <Loader2 size={14} className="text-gold animate-spin" />
                 </div>
                 <div className="text-xs text-zinc-500">Nuffi pisze...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10 bg-[#0F0F12]">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Zapytaj o podatek..."
                className="w-full pl-4 pr-12 py-3 bg-[#050505] border border-white/10 focus:border-gold/50 rounded-xl text-sm text-white outline-none transition-all placeholder-zinc-600 shadow-inner"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputText.trim()}
                className="absolute right-2 p-2 bg-gold hover:bg-[#FCD34D] text-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="mt-2 flex justify-center gap-4 text-[10px] text-zinc-600 font-mono">
                <span className="flex items-center gap-1"><Command size={10} /> + Enter to send</span>
                <span>Gemini Pro Vision</span>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
};