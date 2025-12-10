
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { TaxSnapshot } from '../types';
import { Archive, Lock, Unlock, Clock, FileCheck, RotateCcw, Plus, Download, Shield } from 'lucide-react';
import { toast } from './ui/Toast';

export const AuditSnapshots: React.FC = () => {
    const [snapshots, setSnapshots] = useState<TaxSnapshot[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await NuffiService.fetchSnapshots();
            setSnapshots(data);
            setLoading(false);
        };
        load();
    }, []);

    const handleCreate = async () => {
        const name = prompt('Nazwa migawki (np. Przed korektą VAT):');
        if (name) {
            await NuffiService.createSnapshot(name);
            toast.success('Utworzono migawkę', 'Stan ksiąg został zabezpieczony.');
            // Refresh logic omitted for brevity
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Archive className="text-indigo-600" /> Audit Snapshots (Bezpieczny Audyt)
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Zarządzanie wersjami ksiąg, punktami przywracania i archiwizacją.
                    </p>
                </div>
                <button 
                    onClick={handleCreate}
                    className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-800 flex items-center gap-2 shadow-lg"
                >
                    <Plus size={18} /> Utwórz Migawkę
                </button>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {snapshots.map(snap => (
                    <div key={snap.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${snap.status === 'LOCKED' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                    {snap.status === 'LOCKED' ? <Lock size={24} /> : <Unlock size={24} />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-slate-900">{snap.name}</h4>
                                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                        <span className="flex items-center gap-1"><Clock size={14} /> {snap.createdAt}</span>
                                        <span className="flex items-center gap-1"><FileCheck size={14} /> {snap.dataSize}</span>
                                        <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">Hash: {snap.hash.substring(0, 10)}...</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50" title="Pobierz paczkę">
                                    <Download size={20} />
                                </button>
                                <button 
                                    onClick={() => toast.info('Przywracanie...', 'Inicjowanie procedury rollback.')}
                                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 text-xs flex items-center gap-2"
                                >
                                    <RotateCcw size={14} /> Przywróć
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                            {snap.tags.map(tag => (
                                <span key={tag} className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-100 uppercase">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        
                        {snap.status === 'LOCKED' && (
                            <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
                                <Shield size={10} /> IMMUTABLE
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
