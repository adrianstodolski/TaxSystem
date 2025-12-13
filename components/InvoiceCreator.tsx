
import React, { useState, useEffect } from 'react';
import { InvoiceItem } from '../types';
import { Plus, Trash2, Save, Send, Eye, Calendar, User, FileText, ChevronLeft, CreditCard, Sparkles, Download, RefreshCw } from 'lucide-react';
import { toast } from './ui/Toast';
import { motion } from 'framer-motion';

interface InvoiceCreatorProps {
    onBack: () => void;
    onSave: () => void;
}

export const InvoiceCreator: React.FC<InvoiceCreatorProps> = ({ onBack, onSave }) => {
    // State initialization
    const [invoiceNumber, setInvoiceNumber] = useState(`FV/${new Date().getFullYear()}/${new Date().getMonth() + 1}/001`);
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    const [contractorName, setContractorName] = useState('');
    const [contractorNip, setContractorNip] = useState('');
    const [contractorAddress, setContractorAddress] = useState('');
    
    const [items, setItems] = useState<InvoiceItem[]>([
        { name: 'Konsultacje programistyczne', quantity: 1, unitPriceNet: 2500, vatRate: 0.23, totalNet: 2500 }
    ]);
    const [currency, setCurrency] = useState('PLN');
    const [paymentMethod, setPaymentMethod] = useState('TRANSFER');

    // Calculations
    const subtotal = items.reduce((acc, item) => acc + item.totalNet, 0);
    const totalVat = items.reduce((acc, item) => acc + (item.totalNet * item.vatRate), 0);
    const totalGross = subtotal + totalVat;

    // Handlers
    const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
        const newItems = [...items];
        const item = { ...newItems[index], [field]: value };
        
        // Recalculate line total if needed
        if (field === 'quantity' || field === 'unitPriceNet') {
            item.totalNet = item.quantity * item.unitPriceNet;
        }
        
        newItems[index] = item;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { name: '', quantity: 1, unitPriceNet: 0, vatRate: 0.23, totalNet: 0 }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        if (!contractorNip || subtotal === 0) {
            toast.error('Błąd walidacji', 'Uzupełnij NIP kontrahenta i dodaj pozycje.');
            return;
        }
        toast.success('Faktura wystawiona', `Dokument ${invoiceNumber} został zapisany i wysłany do KSeF.`);
        onSave();
    };

    const formatCurrency = (val: number) => 
        new Intl.NumberFormat('pl-PL', { style: 'currency', currency: currency }).format(val);

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Toolbar */}
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onBack}
                        className="p-2 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-white/10"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            Nowa Faktura <span className="text-gold font-mono text-lg px-2 py-0.5 bg-gold/10 border border-gold/20 rounded-md">{invoiceNumber}</span>
                        </h2>
                        <p className="text-zinc-400 text-sm mt-1 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> KSeF Live Draft
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 text-sm font-bold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 flex items-center gap-2 transition-all">
                        <Save size={16} /> Zapisz szkic
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-6 py-2 text-sm font-bold text-black bg-gold hover:bg-[#FCD34D] rounded-xl flex items-center gap-2 shadow-[0_0_20px_-5px_rgba(212,175,55,0.4)] transition-all"
                    >
                        <Send size={16} /> Wystaw i Wyślij
                    </button>
                </div>
            </div>

            <div className="flex flex-1 gap-8 min-h-0 overflow-hidden">
                {/* LEFT: Editor Form (Scrollable) */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-20">
                    <div className="space-y-6">
                        
                        {/* Section 1: Dates & Meta */}
                        <div className="neo-card p-6 rounded-2xl">
                            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Calendar size={14} /> Dane Podstawowe
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs text-zinc-400 mb-1 ml-1">Numer Faktury</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={invoiceNumber} 
                                            onChange={e => setInvoiceNumber(e.target.value)}
                                            className="neo-input w-full px-4 py-3 rounded-xl text-sm font-mono text-white focus:ring-2 focus:ring-gold/50 outline-none"
                                        />
                                        <button className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white p-1">
                                            <RefreshCw size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs text-zinc-400 mb-1 ml-1">Miejsce wystawienia</label>
                                    <input 
                                        type="text" 
                                        defaultValue="Warszawa"
                                        className="neo-input w-full px-4 py-3 rounded-xl text-sm text-white focus:ring-2 focus:ring-gold/50 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-zinc-400 mb-1 ml-1">Data Wystawienia</label>
                                    <input 
                                        type="date" 
                                        value={issueDate} 
                                        onChange={e => setIssueDate(e.target.value)}
                                        className="neo-input w-full px-4 py-3 rounded-xl text-sm text-white focus:ring-2 focus:ring-gold/50 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-zinc-400 mb-1 ml-1">Termin Płatności</label>
                                    <input 
                                        type="date" 
                                        value={dueDate} 
                                        onChange={e => setDueDate(e.target.value)}
                                        className="neo-input w-full px-4 py-3 rounded-xl text-sm text-white focus:ring-2 focus:ring-gold/50 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Parties */}
                        <div className="neo-card p-6 rounded-2xl">
                            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <User size={14} /> Strony Transakcji
                            </h3>
                            <div className="grid grid-cols-2 gap-8">
                                {/* Seller (Read Only) */}
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 bg-white/5 px-2 py-1 rounded-bl-lg text-[10px] text-zinc-500 font-mono">
                                        AUTO-FILLED
                                    </div>
                                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded uppercase font-bold border border-indigo-500/30">Sprzedawca</span>
                                    <p className="font-bold text-white mt-3">Twoja Firma Sp. z o.o.</p>
                                    <p className="text-xs text-zinc-400 mt-1">NIP: 5213123123</p>
                                    <p className="text-xs text-zinc-400">ul. Prosta 20, 00-850 Warszawa</p>
                                </div>

                                {/* Buyer */}
                                <div className="space-y-3">
                                    <span className="text-[10px] bg-gold/20 text-gold px-2 py-0.5 rounded uppercase font-bold border border-gold/30">Nabywca</span>
                                    <input 
                                        type="text" 
                                        placeholder="NIP (GUS Auto-fill)"
                                        value={contractorNip}
                                        onChange={e => setContractorNip(e.target.value)}
                                        className="neo-input w-full px-3 py-2 rounded-xl text-sm font-mono text-white placeholder-zinc-600 focus:border-gold/50 outline-none"
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Nazwa Firmy"
                                        value={contractorName}
                                        onChange={e => setContractorName(e.target.value)}
                                        className="neo-input w-full px-3 py-2 rounded-xl text-sm text-white placeholder-zinc-600 focus:border-gold/50 outline-none"
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Adres"
                                        value={contractorAddress}
                                        onChange={e => setContractorAddress(e.target.value)}
                                        className="neo-input w-full px-3 py-2 rounded-xl text-sm text-white placeholder-zinc-600 focus:border-gold/50 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Items */}
                        <div className="neo-card p-6 rounded-2xl">
                            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <FileText size={14} /> Pozycje Faktury
                            </h3>
                            
                            <div className="space-y-3">
                                {items.map((item, idx) => (
                                    <motion.div 
                                        key={idx} 
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="grid grid-cols-12 gap-3 items-end p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-white/10 transition-colors"
                                    >
                                        <div className="col-span-5">
                                            <label className="text-[10px] text-zinc-500 ml-1 mb-1 block">Nazwa towaru / usługi</label>
                                            <input 
                                                type="text" 
                                                value={item.name}
                                                onChange={e => updateItem(idx, 'name', e.target.value)}
                                                className="neo-input w-full px-3 py-2 rounded-lg text-sm bg-black/40"
                                                placeholder="Wpisz nazwę..."
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="text-[10px] text-zinc-500 ml-1 mb-1 block">Ilość</label>
                                            <input 
                                                type="number" 
                                                value={item.quantity}
                                                onChange={e => updateItem(idx, 'quantity', parseFloat(e.target.value))}
                                                className="neo-input w-full px-3 py-2 rounded-lg text-sm bg-black/40 text-center"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-[10px] text-zinc-500 ml-1 mb-1 block">Cena Netto</label>
                                            <input 
                                                type="number" 
                                                value={item.unitPriceNet}
                                                onChange={e => updateItem(idx, 'unitPriceNet', parseFloat(e.target.value))}
                                                className="neo-input w-full px-3 py-2 rounded-lg text-sm bg-black/40 text-right"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-[10px] text-zinc-500 ml-1 mb-1 block">VAT</label>
                                            <select 
                                                value={item.vatRate}
                                                onChange={e => updateItem(idx, 'vatRate', parseFloat(e.target.value))}
                                                className="neo-input w-full px-3 py-2 rounded-lg text-sm bg-black/40"
                                            >
                                                <option value={0.23}>23%</option>
                                                <option value={0.08}>8%</option>
                                                <option value={0}>zw.</option>
                                            </select>
                                        </div>
                                        <div className="col-span-2 flex items-center gap-2">
                                            <div className="flex-1 text-right">
                                                <label className="text-[10px] text-zinc-500 mb-1 block">Wartość Netto</label>
                                                <div className="px-3 py-2 text-sm font-bold text-white bg-white/5 rounded-lg border border-white/5">
                                                    {(item.totalNet).toFixed(2)}
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => removeItem(idx)}
                                                className="p-2 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors mb-[2px]"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <button 
                                onClick={addItem}
                                className="mt-4 w-full py-3 border border-dashed border-white/20 rounded-xl text-zinc-400 hover:text-white hover:border-gold/50 hover:bg-gold/5 transition-all flex items-center justify-center gap-2 text-sm font-bold group"
                            >
                                <Plus size={16} className="group-hover:scale-125 transition-transform" /> Dodaj kolejną pozycję
                            </button>
                        </div>

                        {/* Section 4: Payment */}
                        <div className="neo-card p-6 rounded-2xl">
                            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <CreditCard size={14} /> Płatność
                            </h3>
                            <div className="flex gap-4">
                                {['TRANSFER', 'CASH', 'CARD', 'SPLIT_PAYMENT'].map(method => (
                                    <button
                                        key={method}
                                        onClick={() => setPaymentMethod(method)}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${paymentMethod === method ? 'bg-white text-black border-white' : 'bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10'}`}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-4 p-4 bg-black/40 rounded-xl border border-white/5 flex justify-between items-center">
                                <span className="text-zinc-400 text-sm">Rachunek bankowy</span>
                                <span className="text-white font-mono text-sm">PL 12 3456 7890 0000 0000 1234 5678 (mBank)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Live Preview (A4 Paper Style) */}
                <div className="w-[500px] shrink-0 hidden xl:flex flex-col">
                    <div className="bg-onyx/50 backdrop-blur-xl border border-white/10 rounded-t-2xl p-3 flex justify-between items-center">
                        <span className="text-xs font-bold text-zinc-400 uppercase px-2 flex items-center gap-2">
                            <Eye size={14} /> Podgląd wydruku (PDF)
                        </span>
                        <div className="flex gap-2">
                            <button className="p-1.5 hover:bg-white/10 rounded text-zinc-400 hover:text-white transition-colors"><Download size={14} /></button>
                        </div>
                    </div>

                    <div className="flex-1 bg-[#222] p-8 rounded-b-2xl overflow-y-auto custom-scrollbar border-x border-b border-white/10 relative shadow-inner">
                        {/* A4 Page */}
                        <div className="bg-white text-black p-[40px] shadow-2xl min-h-[700px] text-[10px] relative mx-auto max-w-full">
                            
                            {/* Document Header */}
                            <div className="flex justify-between items-start mb-8 border-b-2 border-zinc-100 pb-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">FAKTURA VAT</h1>
                                    <p className="text-zinc-500 mt-1 font-mono">{invoiceNumber}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-indigo-600">Nuffi Software</div>
                                    <p className="text-zinc-500">Oryginał / Kopia</p>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="flex justify-end gap-8 mb-8 text-right">
                                <div>
                                    <p className="text-zinc-400 uppercase font-bold text-[8px]">Data Wystawienia</p>
                                    <p>{issueDate}</p>
                                </div>
                                <div>
                                    <p className="text-zinc-400 uppercase font-bold text-[8px]">Data Sprzedaży</p>
                                    <p>{issueDate}</p>
                                </div>
                                <div>
                                    <p className="text-zinc-400 uppercase font-bold text-[8px]">Termin Płatności</p>
                                    <p className="font-bold">{dueDate}</p>
                                </div>
                            </div>

                            {/* Parties */}
                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div className="p-3 bg-zinc-50 rounded">
                                    <p className="font-bold uppercase text-zinc-400 text-[9px] mb-2 border-b border-zinc-200 pb-1">Sprzedawca</p>
                                    <p className="font-bold text-xs">Twoja Firma Sp. z o.o.</p>
                                    <p>ul. Prosta 20</p>
                                    <p>00-850 Warszawa</p>
                                    <p className="mt-1">NIP: <span className="font-mono">5213123123</span></p>
                                </div>
                                <div className="p-3 bg-zinc-50 rounded">
                                    <p className="font-bold uppercase text-zinc-400 text-[9px] mb-2 border-b border-zinc-200 pb-1">Nabywca</p>
                                    <p className="font-bold text-xs">{contractorName || '...'}</p>
                                    <p>{contractorAddress || '...'}</p>
                                    <p className="mt-1">NIP: <span className="font-mono">{contractorNip || '...'}</span></p>
                                </div>
                            </div>

                            {/* Items Table */}
                            <div className="mb-8">
                                <table className="w-full text-left">
                                    <thead className="border-b-2 border-zinc-800 text-zinc-600 uppercase">
                                        <tr>
                                            <th className="py-2 w-10">Lp.</th>
                                            <th className="py-2">Nazwa</th>
                                            <th className="py-2 text-right">Ilość</th>
                                            <th className="py-2 text-right">Cena Netto</th>
                                            <th className="py-2 text-right">VAT</th>
                                            <th className="py-2 text-right">Wartość Netto</th>
                                            <th className="py-2 text-right">Wartość Brutto</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100">
                                        {items.map((item, i) => (
                                            <tr key={i}>
                                                <td className="py-2 text-zinc-400">{i+1}</td>
                                                <td className="py-2 font-medium">{item.name || '...'}</td>
                                                <td className="py-2 text-right">{item.quantity}</td>
                                                <td className="py-2 text-right">{item.unitPriceNet.toFixed(2)}</td>
                                                <td className="py-2 text-right">{(item.vatRate * 100).toFixed(0)}%</td>
                                                <td className="py-2 text-right font-mono">{item.totalNet.toFixed(2)}</td>
                                                <td className="py-2 text-right font-bold font-mono">{(item.totalNet * (1 + item.vatRate)).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Totals */}
                            <div className="flex justify-end mb-8">
                                <div className="w-1/2 bg-zinc-50 p-4 rounded">
                                    <div className="flex justify-between text-zinc-500 mb-1">
                                        <span>Razem Netto:</span>
                                        <span>{formatCurrency(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-zinc-500 mb-1">
                                        <span>Kwota VAT:</span>
                                        <span>{formatCurrency(totalVat)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold border-t border-zinc-200 pt-2 mt-2">
                                        <span>DO ZAPŁATY:</span>
                                        <span className="text-indigo-600">{formatCurrency(totalGross)}</span>
                                    </div>
                                    <div className="text-[9px] text-zinc-400 mt-1 text-right">
                                        Słownie: (kwota słownie automatycznie generowana)
                                    </div>
                                </div>
                            </div>

                            {/* Footer Info */}
                            <div className="border-t border-zinc-100 pt-4 text-zinc-500 text-[9px]">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="font-bold">Metoda płatności: <span className="font-normal">{paymentMethod}</span></p>
                                        <p className="mt-1">Bank: mBank S.A.</p>
                                        <p>Konto: <span className="font-mono text-zinc-800">PL 12 3456 7890 0000 0000 1234 5678</span></p>
                                    </div>
                                    <div className="text-right">
                                        <p>Dokument wygenerowany elektronicznie.</p>
                                        <p>Nuffi ID: {Date.now()}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
