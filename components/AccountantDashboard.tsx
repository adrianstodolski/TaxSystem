
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { ClientProfile } from '../types';
import { Users, AlertTriangle, CheckCircle2, Clock, MoreHorizontal, Send, FileText, Briefcase, Search, Plus, Filter } from 'lucide-react';
import { toast } from './ui/Toast';

export const AccountantDashboard: React.FC = () => {
    const [clients, setClients] = useState<ClientProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchClients();
            setClients(data);
            setLoading(false);
        };
        load();
    }, []);

    const handleRemind = async (client: ClientProfile) => {
        toast.info('Wysyłanie...', `Wysyłanie przypomnienia do ${client.name}.`);
        await NuffiService.sendClientReminder(client.id, 'DOCS');
        toast.success('Wysłano', 'Klient otrzymał powiadomienie push i email.');
    };

    const filteredClients = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.nip.includes(search));

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'OK': return 'text-green-600 bg-green-100';
            case 'DUE': return 'text-amber-600 bg-amber-100';
            case 'OVERDUE': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Briefcase className="text-indigo-600" /> Pulpit Księgowego
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Zarządzanie portfelem klientów (Multi-tenant).
                    </p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-lg shadow-indigo-200">
                    <Plus size={18} /> Dodaj Klienta
                </button>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase">Aktywni Klienci</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-2">{clients.length}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase">Dokumenty (Inbox)</p>
                    <h3 className="text-3xl font-bold text-indigo-600 mt-2">
                        {clients.reduce((acc, c) => acc + c.documentsToProcess, 0)}
                    </h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase">Zagrożone Terminy</p>
                    <h3 className="text-3xl font-bold text-rose-600 mt-2">
                        {clients.filter(c => c.vatStatus === 'OVERDUE' || c.pitStatus === 'OVERDUE').length}
                    </h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase">Zamknięcie Miesiąca</p>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 bg-slate-100 h-3 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full" style={{width: '65%'}}></div>
                        </div>
                        <span className="font-bold text-sm">65%</span>
                    </div>
                </div>
            </div>

            {/* Clients Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Szukaj firmy..." 
                            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"><Filter size={18} /></button>
                    </div>
                </div>

                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 font-medium">Firma</th>
                            <th className="px-6 py-3 font-medium">Status VAT</th>
                            <th className="px-6 py-3 font-medium">Status PIT/CIT</th>
                            <th className="px-6 py-3 font-medium">Dokumenty</th>
                            <th className="px-6 py-3 font-medium">Progres</th>
                            <th className="px-6 py-3 font-medium text-right">Akcje</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? <tr><td colSpan={6} className="p-8 text-center text-slate-400">Ładowanie klientów...</td></tr> : 
                            filteredClients.map(client => (
                                <tr key={client.id} className="hover:bg-slate-50 group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center font-bold">
                                                {client.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{client.name}</p>
                                                <p className="text-xs text-slate-500 font-mono">NIP: {client.nip}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${getStatusColor(client.vatStatus)}`}>
                                            {client.vatStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${getStatusColor(client.pitStatus)}`}>
                                            {client.pitStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <FileText size={16} className="text-slate-400" />
                                            <span className={`font-bold ${client.documentsToProcess > 0 ? 'text-indigo-600' : 'text-slate-500'}`}>
                                                {client.documentsToProcess} do oceny
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 w-48">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-500">Miesiąc</span>
                                            <span className="font-bold">{client.monthProgress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-indigo-600 h-full rounded-full" style={{width: `${client.monthProgress}%`}}></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleRemind(client)}
                                                className="p-2 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600" 
                                                title="Wyślij przypomnienie"
                                            >
                                                <Send size={16} />
                                            </button>
                                            <button className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-100">
                                                Otwórz
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};
