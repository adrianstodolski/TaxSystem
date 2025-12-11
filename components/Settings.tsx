
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { UserProfile, UserRole, ApiVaultStatus, ApiProvider, CryptoExchange } from '../types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Shield, Briefcase, Save, Loader2, Key, Users, Plus, Lock, CheckCircle2, RefreshCw, XCircle, AlertTriangle, MoreHorizontal } from 'lucide-react';
import { toast } from './ui/Toast';
import { Modal } from './ui/Modal';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

// Zod Schema
const profileSchema = z.object({
  firstName: z.string().min(2, "Imię musi mieć min. 2 znaki"),
  lastName: z.string().min(2, "Nazwisko musi mieć min. 2 znaki"),
  email: z.string().email("Niepoprawny format email"),
  nip: z.string().length(10, "NIP musi mieć 10 cyfr").regex(/^\d+$/, "Tylko cyfry"),
  companyName: z.string().min(1, "Nazwa firmy wymagana"),
  cryptoStrategy: z.enum(['FIFO', 'LIFO', 'HIFO']),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'TAX' | 'SECURITY' | 'CRYPTO' | 'TEAM' | 'VAULT'>('PROFILE');
  const { user, setUser } = useStore();
  const [apiStatus, setApiStatus] = useState<ApiVaultStatus[]>([]);
  const [exchangeStatus, setExchangeStatus] = useState<Record<string, boolean>>({});
  
  // Forms
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema)
  });

  // API Key Modal State
  const [apiModalOpen, setApiModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiSecretInput, setApiSecretInput] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const [userData, apis, exStatus] = await Promise.all([
        NuffiService.fetchUserProfile(),
        NuffiService.fetchApiVaultStatus(),
        NuffiService.getExchangeConnectionStatus()
      ]);
      setUser(userData);
      reset(userData as any); // Populate form
      setApiStatus(apis);
      setExchangeStatus(exStatus);
    };
    loadData();
  }, [reset, setUser]);

  const onSubmitProfile = async (data: ProfileFormValues) => {
    if (!user) return;
    const updated = { ...user, ...data };
    await NuffiService.updateUserProfile(updated);
    setUser(updated);
    toast.success('Zapisano', 'Profil został zaktualizowany.');
  };

  const handleUpdateApiKey = async () => {
      if(!selectedProvider) return;
      await new Promise(r => setTimeout(r, 1000));
      await NuffiService.saveExchangeKeys(selectedProvider, apiKeyInput, apiSecretInput);
      setApiModalOpen(false);
      const newStatus = await NuffiService.getExchangeConnectionStatus();
      setExchangeStatus(newStatus);
      toast.success('Połączono', `Klucze dla ${selectedProvider} zaktualizowane.`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <header className="animate-in fade-in slide-in-from-top-4 duration-500">
        <h2 className="text-2xl font-bold text-white">Ustawienia Konta</h2>
        <p className="text-slate-400">Zarządzaj swoimi danymi, rezydencją podatkową i bezpieczeństwem.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="space-y-2">
            {[
                { id: 'PROFILE', label: 'Profil', icon: User },
                { id: 'CRYPTO', label: 'Giełdy & API', icon: RefreshCw },
                { id: 'VAULT', label: 'API Vault', icon: Key },
                { id: 'TEAM', label: 'Zespół', icon: Users },
                { id: 'TAX', label: 'Dane Podatkowe', icon: Briefcase },
                { id: 'SECURITY', label: 'Bezpieczeństwo', icon: Shield },
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab.id ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                    <tab.icon size={18} /> {tab.label}
                </button>
            ))}
        </div>

        {/* Content Area */}
        <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="md:col-span-3 glass-card p-8 rounded-2xl min-h-[500px]"
        >
          {activeTab === 'PROFILE' && (
            <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-white/10 pb-4">Dane Osobowe</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Imię</label>
                  <input {...register('firstName')} className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                  {errors.firstName && <span className="text-red-400 text-xs">{errors.firstName.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Nazwisko</label>
                  <input {...register('lastName')} className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                  {errors.lastName && <span className="text-red-400 text-xs">{errors.lastName.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                  <input {...register('email')} className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                  {errors.email && <span className="text-red-400 text-xs">{errors.email.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">NIP</label>
                  <input {...register('nip')} className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                  {errors.nip && <span className="text-red-400 text-xs">{errors.nip.message}</span>}
                </div>
              </div>
              <div className="flex justify-end pt-4">
                  <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50">
                      {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Zapisz zmiany</>}
                  </button>
              </div>
            </form>
          )}

          {activeTab === 'CRYPTO' && (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
                <div className="border-b border-white/10 pb-4 mb-6">
                    <h3 className="text-lg font-bold text-white">Integracje Giełdowe</h3>
                    <p className="text-sm text-slate-400">Podłącz klucze API (Read-Only).</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {Object.keys(CryptoExchange).map((key) => {
                        const isConnected = exchangeStatus[key];
                        return (
                            <motion.div variants={itemVariants} key={key} className={`p-5 rounded-2xl border transition-all ${isConnected ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-900/30 border-slate-700'}`}>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-white shadow-sm border border-slate-600">{key[0]}</div>
                                        <div>
                                            <h4 className="font-bold text-white">{key}</h4>
                                            {isConnected ? <span className="text-green-400 text-xs font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Connected</span> : <span className="text-slate-500 text-xs">Disconnected</span>}
                                        </div>
                                    </div>
                                    <button onClick={() => { setSelectedProvider(key); setApiModalOpen(true); }} className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold border border-slate-600 hover:bg-slate-700">
                                        {isConnected ? 'Edytuj' : 'Połącz'}
                                    </button>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </motion.div>
          )}

          {activeTab === 'TEAM' && (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <div>
                        <h3 className="text-lg font-bold text-white">Zarządzanie Zespołem</h3>
                        <p className="text-sm text-slate-400">Uprawnienia dostępu i role (RBAC).</p>
                    </div>
                    <button onClick={() => toast.success('Zaproszenie wysłane', 'Mail z linkiem aktywacyjnym został wysłany.')} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-500 flex items-center gap-2 shadow-lg">
                        <Plus size={16} /> Zaproś
                    </button>
                </div>
                <div className="space-y-4">
                    {[
                        { name: 'Jan Kowalski', email: 'jan@nuffi.io', role: 'ADMIN', status: 'ACTIVE' },
                        { name: 'Anna Nowak', email: 'anna@nuffi.io', role: 'ACCOUNTANT', status: 'ACTIVE' },
                        { name: 'Piotr Wiśniewski', email: 'piotr@nuffi.io', role: 'VIEWER', status: 'PENDING' },
                    ].map((member, i) => (
                        <motion.div variants={itemVariants} key={i} className="flex items-center justify-between p-4 bg-slate-900/30 border border-slate-700 rounded-xl hover:border-indigo-500/30 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-slate-600 shadow-sm">
                                    {member.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-white text-sm">{member.name}</p>
                                    <p className="text-xs text-slate-400">{member.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-slate-300 border border-slate-700">{member.role}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${member.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                                    {member.status}
                                </span>
                                <button className="text-slate-500 hover:text-white p-2 hover:bg-white/5 rounded-lg"><MoreHorizontal size={16} /></button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
          )}
          
          {/* Other tabs placeholder */}
          {(activeTab !== 'PROFILE' && activeTab !== 'CRYPTO' && activeTab !== 'TEAM') && (
              <div className="text-center py-20 text-slate-500">
                  Konfiguracja dla {activeTab} dostępna w pełnej wersji Enterprise.
              </div>
          )}
        </motion.div>
      </div>

      <Modal isOpen={apiModalOpen} onClose={() => setApiModalOpen(false)} title="Konfiguracja API">
          <div className="space-y-4">
              <p className="text-sm text-slate-400">Wprowadź klucze dla <strong>{selectedProvider}</strong>.</p>
              <input type="text" placeholder="API Key" value={apiKeyInput} onChange={e => setApiKeyInput(e.target.value)} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white" />
              <input type="password" placeholder="API Secret" value={apiSecretInput} onChange={e => setApiSecretInput(e.target.value)} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white" />
              <button onClick={handleUpdateApiKey} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">Zapisz</button>
          </div>
      </Modal>
    </div>
  );
};
