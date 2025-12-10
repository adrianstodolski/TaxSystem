
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Minimize2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { NuffiService } from '../services/api';

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', text: 'Cześć! Jestem Twoim asystentem podatkowym Nuffi. Jak mogę Ci dzisiaj pomóc?', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const responseText = await NuffiService.sendAIChatMessage(userMsg.text);
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

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg shadow-indigo-900/30 transition-all hover:scale-105 z-40 group"
      >
        <MessageSquare size={24} />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Asystent AI
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 animate-in slide-in-from-bottom-10 duration-300 max-h-[600px]">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 rounded-t-2xl flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-1.5 rounded-lg">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-bold text-sm">Nuffi AI Assistant</h3>
            <p className="text-[10px] text-indigo-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded transition-colors">
            <Minimize2 size={16} />
          </button>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 h-[400px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
              msg.role === 'user' ? 'bg-gray-200 text-gray-700' : 'bg-indigo-100 text-indigo-700'
            }`}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'
              }`}
            >
              {msg.text}
              <div className={`text-[10px] mt-1 text-right ${msg.role === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <Bot size={14} className="text-indigo-700" />
             </div>
             <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 bg-white rounded-b-2xl">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Zapytaj o podatek, termin..."
            className="w-full pl-4 pr-12 py-3 bg-gray-100 border border-transparent focus:bg-white focus:border-indigo-300 rounded-xl text-sm outline-none transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
