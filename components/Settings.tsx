
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { UserProfile, CryptoExchange } from '../types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Shield, Briefcase, Save, Loader2, Key, Users, Plus, CheckCircle2, RefreshCw, MoreHorizontal, QrCode, Smartphone, LogOut, Laptop, Globe, Usb, Cpu, Server, Lock } from 'lucide-react';
import { toast } from './ui/Toast';
import { Modal } from './ui/Modal';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

const profileSchema = z.object({
  firstName: z.string().min(2, "Imię musi mieć min. 2 znaki"),
  lastName: z.string().min(2, "Nazwisko musi mieć min. 2 znaki"),
  email: z.string().email("Niepoprawny format email"),
  nip: z.string().length(10, "NIP musi mieć 10 cyfr").regex(/^\d+$/, "Tylko cyfry"),
  companyName: z.string().min(1, "Nazwa firmy wymagana"),
  cryptoStrategy: z.enum(['FIFO', 'LIFO', 'HIFO']),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const SecurityView: React.FC = () => {
    const [twoFaEnabled, setTwoFaEnabled] = useState(false);
    const [showQr, setShowQr] = useState(false);

    return (
        <div className="space-y-8 animate-in fade-in">
            {/* 2FA Section */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden">
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <h4 className="text-white font-bold text-lg flex items-center gap-2">
                            <Shield size={18} className="text-gold" /> Uwierzytelnianie (2FA)
                        </h4>
                        <p className="text-zinc-400 text-xs mt-1">
                            Google Authenticator / YubiKey
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={twoFaEnabled} onChange={() => { if(!twoFaEnabled) setShowQr(true); else setTwoFaEnabled(false); }} className="sr-only peer" />
                            <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                        </label>
                    </div>
                </div>

                {showQr && !twoFaEnabled && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-6 border-t border-white/10 pt-6">
                        <div className="flex gap-6 items-center">
                            <div className="bg-white p-2 rounded-lg">
                                <QrCode size={100} className="text-black" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <p className="text-sm font-bold text-white mb-1">Zeskanuj kod QR</p>
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="CODE" className="neo-input w-24 px-3 py-2 rounded-lg text-center font-mono tracking-widest text-sm" />
                                        <button onClick={() => { setTwoFaEnabled(true); setShowQr(false); toast.success('2FA włączone', 'Konto zabezpieczone.'); }} className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg font-bold text-xs transition-colors border border-white/10">
                                            Weryfikuj
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Hardware Wallet */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-onyx rounded-lg flex items-center justify-center border border-white/10">
                        <Usb className="text-blue-400" size={20} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm">Security Key</h4>
                        <p className="text-zinc-500 text-xs">FIDO2 / U2F (Ledger, Trezor, YubiKey)</p>
                    </div>
                </div>
                <button className="text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-600/30 transition-colors">
                    Add Device
                </button>
            </div>

            {/* Active Sessions */}
            <div className="space-y-3">
                <h4 className="text-zinc-500 font-bold text-xs uppercase tracking-wider">Active Sessions</h4>
                {[
                    { device: 'MacBook Pro 16"', location: 'Warsaw, PL', ip: '89.123.45.67', current: true },
                    { device: 'iPhone 14 Pro', location: 'Warsaw, PL', ip: '188.14.22.11', current: false },
                ].map((session, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-black/40 rounded-lg border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="text-zinc-500">
                                {session.device.includes('iPhone') ? <Smartphone size={16} /> : <Laptop size={16} />}
                            </div>
                            <div>
                                <p className="text-white font-bold text-xs flex items-center gap-2">
                                    {session.device} 
                                    {session.current && <span className="bg-green-500/20 text-green-400 text-[9px] px-1.5 py-0.5 rounded border border-green-500/30">CURRENT</span>}
                                </p>
                                <p className="text-zinc-600 text-[10px] flex items-center gap-1 mt-0.5 font-mono">
                                    {session.ip}
                                </p>
                            </div>
                        </div>
                        {!session.current && (
                            <button className="text-zinc-600 hover:text-rose-500 transition-colors">
                                <LogOut size={14} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'TAX' | 'SECURITY' | 'CRYPTO' | 'TEAM' | 'VAULT'>('PROFILE');
  const { user, setUser } = useStore();
  const [exchangeStatus, setExchangeStatus] = useState<Record<string, boolean>>({});
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema)
  });

  const [apiModalOpen, setApiModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiSecretInput, setApiSecretInput] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const [userData, exStatus] = await Promise.all([
        NuffiService.fetchUserProfile(),
        NuffiService.getExchangeConnectionStatus()
      ]);
      setUser(userData);
      reset(userData as any);
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
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      <header className="flex items-center gap-3 border-b border-white/10 pb-6">
        <div className="p-2 bg-white/5 rounded-lg border border-white/5">
            <Cpu size={24} className="text-zinc-400" />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-white">System Config</h2>
            <p className="text-zinc-500 text-sm font-mono">v3.0.1-alpha • Build 2405</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation - Sidebar Style */}
        <div className="space-y-1">
            <p className="px-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">General</p>
            {[
                { id: 'PROFILE', label: 'Identity', icon: User },
                { id: 'SECURITY', label: 'Security', icon: Shield },
                { id: 'TEAM', label: 'Access Control', icon: Users },
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${
                    activeTab === tab.id ? 'bg-white/10 text-white border border-white/10' : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                >
                    <tab.icon size={16} /> {tab.label}
                </button>
            ))}
            
            <p className="px-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-6 mb-2">Modules</p>
            {[
                { id: 'CRYPTO', label: 'Connectors', icon: Server },
                { id: 'VAULT', label: 'API Vault', icon: Key },
                { id: 'TAX', label: 'Fiscal Data', icon: Briefcase },
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${
                    activeTab === tab.id ? 'bg-white/10 text-white border border-white/10' : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                >
                    <tab.icon size={16} /> {tab.label}
                </button>
            ))}
        </div>

        {/* Content Area - Panel Style */}
        <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="md:col-span-3 neo-card p-8 rounded-2xl min-h-[600px] border border-white/10 bg-[#0A0A0C]"
        >
          {activeTab === 'PROFILE' && (
            <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-8">
              <div>
                  <h3 className="text-lg font-bold text-white mb-1">Identity Profile</h3>
                  <p className="text-zinc-500 text-sm">Personal and business identification data.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">First Name</label>
                  <input {...register('firstName')} className="neo-input w-full px-4 py-3 rounded-xl text-sm border-white/10 focus:border-gold/50" />
                  {errors.firstName && <span className="text-rose-500 text-xs">{errors.firstName.message}</span>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">Last Name</label>
                  <input {...register('lastName')} className="neo-input w-full px-4 py-3 rounded-xl text-sm border-white/10 focus:border-gold/50" />
                  {errors.lastName && <span className="text-rose-500 text-xs">{errors.lastName.message}</span>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">Email Address</label>
                  <input {...register('email')} className="neo-input w-full px-4 py-3 rounded-xl text-sm border-white/10 focus:border-gold/50" />
                  {errors.email && <span className="text-rose-500 text-xs">{errors.email.message}</span>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">Tax ID (NIP)</label>
                  <input {...register('nip')} className="neo-input w-full px-4 py-3 rounded-xl text-sm font-mono border-white/10 focus:border-gold/50" />
                  {errors.nip && <span className="text-rose-500 text-xs">{errors.nip.message}</span>}
                </div>
              </div>
              
              <div className="flex justify-end pt-6 border-t border-white/5">
                  <button type="submit" disabled={isSubmitting} className="bg-white text-black px-6 py-2.5 rounded-lg font-bold hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 text-sm">
                      {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Save Configuration</>}
                  </button>
              </div>
            </form>
          )}

          {activeTab === 'SECURITY' && <SecurityView />}

          {activeTab === 'CRYPTO' && (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-white mb-1">External Connectors</h3>
                    <p className="text-zinc-500 text-sm">Manage API keys for exchanges and banks (Read-Only).</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                    {Object.keys(CryptoExchange).map((key) => {
                        const isConnected = exchangeStatus[key];
                        return (
                            <motion.div variants={itemVariants} key={key} className={`p-4 rounded-xl border transition-all flex items-center justify-between group ${isConnected ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center font-bold text-zinc-400 border border-white/10 group-hover:text-white transition-colors">{key[0]}</div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{key}</h4>
                                        <p className="text-[10px] text-zinc-500 font-mono">Status: {isConnected ? 'Active' : 'Inactive'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {isConnected && <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_5px_#22c55e]"></div>}
                                    <button onClick={() => { setSelectedProvider(key); setApiModalOpen(true); }} className="text-xs font-bold text-zinc-400 hover:text-white px-3 py-1.5 rounded border border-white/10 hover:bg-white/5 transition-colors">
                                        Configure
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
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">Team Access</h3>
                        <p className="text-zinc-500 text-sm">Manage RBAC roles and permissions.</p>
                    </div>
                    <button onClick={() => toast.success('Invite sent', 'Email dispatched.')} className="bg-white/10 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-white/20 flex items-center gap-2 border border-white/10 transition-colors">
                        <Plus size={14} /> Add Member
                    </button>
                </div>
                <div className="space-y-3">
                    {[
                        { name: 'Jan Kowalski', email: 'jan@nuffi.io', role: 'ADMIN', status: 'ACTIVE' },
                        { name: 'Anna Nowak', email: 'anna@nuffi.io', role: 'ACCOUNTANT', status: 'ACTIVE' },
                        { name: 'Piotr Wiśniewski', email: 'piotr@nuffi.io', role: 'VIEWER', status: 'PENDING' },
                    ].map((member, i) => (
                        <motion.div variants={itemVariants} key={i} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 border border-white/5">
                                    {member.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-white text-xs">{member.name}</p>
                                    <p className="text-[10px] text-zinc-500">{member.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-mono bg-black/40 px-2 py-1 rounded text-zinc-400 border border-white/5">{member.role}</span>
                                <div className={`w-1.5 h-1.5 rounded-full ${member.status === 'ACTIVE' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                                <button className="text-zinc-600 hover:text-white transition-colors"><MoreHorizontal size={14} /></button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
          )}
          
          {(activeTab === 'VAULT' || activeTab === 'TAX') && (
              <div className="flex flex-col items-center justify-center h-full text-zinc-500 opacity-50">
                  <Lock size={48} className="mb-4" />
                  <p className="text-sm">Module Locked in Free Tier</p>
              </div>
          )}
        </motion.div>
      </div>

      <Modal isOpen={apiModalOpen} onClose={() => setApiModalOpen(false)} title="API Configuration">
          <div className="space-y-4">
              <p className="text-sm text-zinc-400">Enter read-only API keys for <strong>{selectedProvider}</strong>.</p>
              <input type="text" placeholder="API Key" value={apiKeyInput} onChange={e => setApiKeyInput(e.target.value)} className="neo-input w-full px-4 py-3 rounded-xl text-sm font-mono text-white border-white/10" />
              <input type="password" placeholder="API Secret" value={apiSecretInput} onChange={e => setApiSecretInput(e.target.value)} className="neo-input w-full px-4 py-3 rounded-xl text-sm font-mono text-white border-white/10" />
              <button onClick={handleUpdateApiKey} className="w-full bg-gold text-black py-3 rounded-xl font-bold hover:bg-[#FCD34D] transition-colors shadow-lg text-sm">Save Credentials</button>
          </div>
      </Modal>
    </div>
  );
};
