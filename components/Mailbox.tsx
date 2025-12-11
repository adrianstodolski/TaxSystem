
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { EmailMessage } from '../types';
import { Mail, Search, Paperclip, Star, AlertCircle, FileText, CheckCircle2, Tag, RefreshCw } from 'lucide-react';
import { toast } from './ui/Toast';

export const Mailbox: React.FC = () => {
    const [emails, setEmails] = useState<EmailMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchInbox();
            setEmails(data);
            if(data.length > 0) setSelectedEmail(data[0]);
            setLoading(false);
        };
        load();
    }, []);

    const getTagStyle = (tag: string) => {
        switch(tag) {
            case 'INVOICE': return 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30';
            case 'OFFER': return 'bg-green-500/20 text-green-400 border border-green-500/30';
            case 'URGENT': return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
            case 'SPAM': return 'bg-zinc-800 text-zinc-500 border border-zinc-700';
            default: return 'bg-zinc-800 text-zinc-400 border border-zinc-700';
        }
    };

    const handleProcessInvoice = () => {
        toast.success('Przetwarzanie', 'Faktura z załącznika została wysłana do OCR.');
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Mail className="text-indigo-400" /> Inteligentna Skrzynka
                    </h2>
                    <p className="text-zinc-400 mt-1">
                        Poczta zintegrowana z obiegiem dokumentów. AI wykrywa faktury.
                    </p>
                </div>
                <div className="flex gap-2 text-sm font-mono text-zinc-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                    faktury@twoja-firma.nuffi.io
                </div>
            </header>

            <div className="neo-card rounded-2xl overflow-hidden flex h-[600px]">
                {/* Email List */}
                <div className="w-1/3 border-r border-white/10 flex flex-col bg-onyx/50">
                    <div className="p-4 border-b border-white/10">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <input 
                                type="text" 
                                placeholder="Szukaj w poczcie..." 
                                className="w-full pl-9 pr-4 py-2 border border-white/10 bg-black/20 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 outline-none text-white placeholder-zinc-600"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {emails.map(email => (
                            <div 
                                key={email.id} 
                                onClick={() => setSelectedEmail(email)}
                                className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${selectedEmail?.id === email.id ? 'bg-indigo-500/10 border-l-4 border-l-indigo-500' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`text-sm truncate pr-2 ${!email.isRead ? 'font-bold text-white' : 'text-zinc-400'}`}>{email.sender}</h4>
                                    <span className="text-[10px] text-zinc-600 whitespace-nowrap">{email.date.split(' ')[1]}</span>
                                </div>
                                <p className={`text-xs truncate mb-2 ${!email.isRead ? 'font-medium text-zinc-300' : 'text-zinc-500'}`}>{email.subject}</p>
                                <div className="flex gap-1 flex-wrap">
                                    {email.aiTags.map(tag => (
                                        <span key={tag} className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${getTagStyle(tag)}`}>
                                            {tag}
                                        </span>
                                    ))}
                                    {email.hasAttachment && <Paperclip size={12} className="text-zinc-500" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Email Content */}
                <div className="flex-1 flex flex-col bg-[#050505]">
                    {selectedEmail ? (
                        <>
                            <div className="p-6 border-b border-white/10 bg-onyx/30">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-white">{selectedEmail.subject}</h3>
                                    <div className="flex gap-2">
                                        {selectedEmail.aiTags.includes('INVOICE') && (
                                            <button 
                                                onClick={handleProcessInvoice}
                                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-500 flex items-center gap-2 shadow-sm transition-colors"
                                            >
                                                <RefreshCw size={14} /> Przetwórz fakturę
                                            </button>
                                        )}
                                        <button className="p-2 hover:bg-white/10 rounded text-zinc-400">
                                            <Star size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center font-bold text-zinc-400 border border-white/5">
                                        {selectedEmail.sender.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-white">{selectedEmail.sender}</p>
                                        <p className="text-xs text-zinc-500">do mnie &lt;faktury@twoja-firma.nuffi.io&gt;</p>
                                    </div>
                                    <span className="ml-auto text-xs text-zinc-500">{selectedEmail.date}</span>
                                </div>
                            </div>
                            
                            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                    {selectedEmail.preview}
                                    <br/><br/>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    <br/><br/>
                                    Pozdrawiamy,<br/>
                                    Zespół {selectedEmail.sender}
                                </p>

                                {selectedEmail.hasAttachment && (
                                    <div className="mt-8 border-t border-white/10 pt-4">
                                        <p className="text-xs font-bold text-zinc-500 uppercase mb-2">Załączniki (1)</p>
                                        <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl w-64 hover:border-indigo-500/50 cursor-pointer transition-colors group">
                                            <div className="bg-red-500/10 p-2 rounded-lg text-red-400 border border-red-500/20">
                                                <FileText size={24} />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-sm font-bold text-zinc-300 truncate group-hover:text-indigo-400">faktura_vat.pdf</p>
                                                <p className="text-xs text-zinc-500">1.2 MB</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-zinc-500">
                            Wybierz wiadomość z listy
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
