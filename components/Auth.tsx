
import React, { useState, useEffect, useRef } from 'react';
import { NuffiService } from '../services/api';
import { ShieldCheck, ArrowRight, Loader2, CheckCircle2, Building, Mail, Lock, UserCheck, Fingerprint, MapPin, Hash, Search, Home, Map, Activity, Check, Briefcase, FileText, Info, Download, History, Printer, Plus, Minus, ScanFace, FileSearch, Database, Terminal, Shield, X, Wallet, Sparkles } from 'lucide-react';
import { SubscriptionPlan, UserProfile } from '../types';
import { toast } from './ui/Toast';
import { Modal } from './ui/Modal';
import { motion } from 'framer-motion';

interface AuthProps {
  onLogin: (token: string, plan: SubscriptionPlan, user: UserProfile) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('demo@nuffi.com');
  const [password, setPassword] = useState('password');
  const [nip, setNip] = useState('');
  const [gusData, setGusData] = useState<any>(null);
  const [checkingNip, setCheckingNip] = useState(false);
  
  // Login Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        await new Promise(r => setTimeout(r, 1000)); // Cinematic delay
        const { token, plan, user } = await NuffiService.login(email, password);
        onLogin(token, plan, user);
        toast.success('Access Granted', 'Witaj w Nuffi OS.');
    } catch (err) {
        toast.error('Access Denied', 'Nieprawidłowe poświadczenia.');
    } finally {
        setLoading(false);
    }
  };

  const handleNipCheck = async () => {
      if(nip.length !== 10) return;
      setCheckingNip(true);
      const data = await NuffiService.fetchGusData(nip);
      setGusData(data);
      setCheckingNip(false);
      if(data) toast.success('GUS/CEIDG', 'Pobrano dane firmy.');
  };

  const handleRegister = async () => {
      setLoading(true);
      await NuffiService.register(nip, email);
      const { token, plan, user } = await NuffiService.login('demo@nuffi.com', 'password');
      onLogin(token, plan, user);
      setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-[#D4AF37] selection:text-black">
      
      {/* --- BACKGROUND ATMOSPHERE --- */}
      <div className="absolute inset-0 pointer-events-none">
          {/* Grid */}
          <div className="absolute inset-0" style={{ 
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', 
              backgroundSize: '50px 50px',
              maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
          }}></div>
          {/* Gold Glow Only */}
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[100px]"></div>
      </div>

      {/* --- MAIN CARD --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-[#0A0A0C]/80 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-[0_0_50px_-10px_rgba(0,0,0,0.7)] overflow-hidden"
      >
        
        {/* LEFT: BRANDING */}
        <div className="relative p-12 flex flex-col justify-between border-r border-white/5 overflow-hidden group">
            {/* Dynamic Background on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center">
                        <ShieldCheck className="text-[#D4AF37]" size={20} />
                    </div>
                    <span className="text-2xl font-bold text-white tracking-tight font-mono">Nuffi<span className="text-[#D4AF37]">.OS</span></span>
                </div>
                
                <h1 className="text-5xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
                    Architektura <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Twojego Kapitału.</span>
                </h1>
                
                <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                    Symbioza tradycyjnej księgowości i aktywów cyfrowych. 
                    Pełna automatyzacja KSeF, AI Tax Optimization i Wealth Management w jednym terminalu.
                </p>
            </div>

            <div className="relative z-10 mt-12">
                <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4">
                    <span>Trusted by leaders</span>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div>
                <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="h-8 w-24 bg-white/10 rounded flex items-center justify-center font-bold text-white">Google</div>
                    <div className="h-8 w-24 bg-white/10 rounded flex items-center justify-center font-bold text-white">Stripe</div>
                    <div className="h-8 w-24 bg-white/10 rounded flex items-center justify-center font-bold text-white">Binance</div>
                </div>
            </div>
        </div>

        {/* RIGHT: FORM */}
        <div className="p-12 bg-[#050505] flex flex-col justify-center">
            {mode === 'LOGIN' ? (
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Witaj w systemie</h2>
                        <p className="text-zinc-500 text-sm">Zaloguj się, aby uzyskać dostęp do terminala.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors" size={18} />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-[#0A0A0C] border border-white/10 rounded-xl text-white placeholder-zinc-700 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all outline-none"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between ml-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Hasło</label>
                                <a href="#" className="text-[10px] text-[#D4AF37] hover:underline">Reset?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors" size={18} />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-[#0A0A0C] border border-white/10 rounded-xl text-white placeholder-zinc-700 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#D4AF37] text-black py-4 rounded-xl font-bold hover:bg-[#FCD34D] transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_-5px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.6)] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Uruchom Terminal <ArrowRight size={18} /></>}
                        </button>
                    </form>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="px-4 bg-[#050505] text-zinc-600">Alternatywne Metody</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-300 text-sm font-bold transition-all">
                            <Fingerprint size={16} /> Civic ID
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-300 text-sm font-bold transition-all">
                            <Wallet size={16} /> Wallet Connect
                        </button>
                    </div>

                    <div className="text-center">
                        <button onClick={() => setMode('REGISTER')} className="text-zinc-500 hover:text-white text-sm transition-colors">
                            Nie posiadasz konta? <span className="text-[#D4AF37] font-bold">Dołącz do Nuffi</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Rejestracja Podmiotu</h2>
                        <p className="text-zinc-500 text-sm">Automatyczny pobór danych z rejestrów (GUS/CEIDG/KRS).</p>
                    </div>

                    {!gusData ? (
                        <div className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Numer NIP</label>
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors" size={18} />
                                    <input 
                                        type="text" 
                                        value={nip}
                                        onChange={e => setNip(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleNipCheck()}
                                        className="w-full pl-12 pr-4 py-4 bg-[#0A0A0C] border border-white/10 rounded-xl text-white placeholder-zinc-700 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all outline-none font-mono"
                                        placeholder="000-000-00-00"
                                    />
                                    <button 
                                        onClick={handleNipCheck}
                                        disabled={checkingNip || nip.length < 10}
                                        className="absolute right-2 top-2 bottom-2 bg-white/10 hover:bg-white/20 text-white px-4 rounded-lg font-bold text-xs transition-colors disabled:opacity-0"
                                    >
                                        {checkingNip ? <Loader2 className="animate-spin" size={16} /> : 'Pobierz'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-start gap-4">
                                <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                                    <CheckCircle2 size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">{gusData.name}</h4>
                                    <p className="text-zinc-400 text-xs mt-1">{gusData.street} {gusData.propertyNumber}, {gusData.city}</p>
                                    <div className="flex gap-2 mt-2">
                                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-zinc-300 border border-white/5">NIP: {gusData.nip}</span>
                                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-zinc-300 border border-white/5">VAT: {gusData.vatStatus}</span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleRegister}
                                disabled={loading}
                                className="w-full bg-[#D4AF37] text-black py-4 rounded-xl font-bold hover:bg-[#FCD34D] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_-5px_rgba(212,175,55,0.4)]"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <>Potwierdź i Utwórz Konto</>}
                            </button>
                            
                            <button onClick={() => setGusData(null)} className="w-full text-zinc-500 hover:text-white text-xs">
                                To nie ta firma? Wpisz NIP ponownie.
                            </button>
                        </div>
                    )}

                    <div className="text-center pt-4">
                        <button onClick={() => setMode('LOGIN')} className="text-zinc-500 hover:text-white text-sm transition-colors">
                            Masz już konto? <span className="text-[#D4AF37] font-bold">Zaloguj się</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
      </motion.div>
    </div>
  );
};
