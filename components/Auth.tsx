

import React, { useState, useEffect, useRef } from 'react';
import { NuffiService } from '../services/api';
import { ShieldCheck, ArrowRight, Loader2, CheckCircle2, Building, Mail, Lock, UserCheck, Fingerprint, MapPin, Hash, Search, Home, Map, Activity, Check, Briefcase, FileText, Info, Download, History, Printer, Plus, Minus, ScanFace, FileSearch, Database, Terminal, Shield, X, Wallet } from 'lucide-react';
import { SubscriptionPlan, UserProfile } from '../types';
import { toast } from './ui/Toast';
import { Modal } from './ui/Modal';

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
  const [kycStatus, setKycStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS'>('IDLE');
  const [kycStage, setKycStage] = useState('');
  const [kycProgress, setKycProgress] = useState(0);
  const [kycLogs, setKycLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const [isCeidgSource, setIsCeidgSource] = useState(false);
  const [reportTab, setReportTab] = useState<'DETAILS' | 'HISTORY'>('DETAILS');
  const [isDownloading, setIsDownloading] = useState(false);
  const [mapZoom, setMapZoom] = useState(1);
  const [showPdf, setShowPdf] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [street, setStreet] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [aptNumber, setAptNumber] = useState('');
  const [companyCity, setCompanyCity] = useState('');
  const [companyZip, setCompanyZip] = useState('');
  const [pkd, setPkd] = useState('');
  const [pkdDesc, setPkdDesc] = useState('');
  const [startDate, setStartDate] = useState('');
  const [vatStatus, setVatStatus] = useState<string>('');
  const [regon, setRegon] = useState('');
  const [legalForm, setLegalForm] = useState<string>('');
  const [shareCapital, setShareCapital] = useState<number | undefined>(undefined);
  const [representatives, setRepresentatives] = useState<string[]>([]);
  const [krs, setKrs] = useState<string>('');

  useEffect(() => {
      if (logsEndRef.current) {
          logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
  }, [kycLogs]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        const { token, plan, user } = await NuffiService.login(email, password);
        onLogin(token, plan, user);
        toast.success('Witaj z powrotem!', 'Zalogowano pomyślnie.');
    } catch (err) {
        toast.error('Błąd logowania', 'Nieprawidłowy email lub hasło. Użyj demo@nuffi.com');
    } finally {
        setLoading(false);
    }
  };

  const handleCivicLogin = async () => {
      setLoading(true);
      toast.info('Civic Identity', 'Łączenie z Civic Auth...');
      await new Promise(r => setTimeout(r, 2000));
      toast.success('Zweryfikowano przez Civic', 'Tożsamość potwierdzona biometrycznie.');
      const { token, plan, user } = await NuffiService.login('demo@nuffi.com', 'password');
      onLogin(token, plan, user);
      setLoading(false);
  };

  const handleNftLogin = async () => {
      setLoading(true);
      toast.info('Moralis Token Gate', 'Sprawdzanie posiadania NFT dostępowego...');
      const hasAccess = await NuffiService.verifyNftAccess('0xUserWallet');
      if (hasAccess) {
          toast.success('Dostęp przyznany', 'Weryfikacja NFT pomyślna. Witaj w Nuffi Premium.');
          const { token, plan, user } = await NuffiService.login('demo@nuffi.com', 'password');
          onLogin(token, plan, user);
      } else {
          toast.error('Brak dostępu', 'Nie posiadasz wymaganego NFT w portfelu.');
      }
      setLoading(false);
  };

  const handleNipCheck = async () => {
      if(nip.length !== 10) return;
      setCheckingNip(true);
      const data = await NuffiService.fetchGusData(nip);
      setGusData(data);
      if (data) {
          setCompanyName(data.name);
          setStreet(data.street || '');
          setHouseNumber(data.propertyNumber || '');
          setAptNumber(data.apartmentNumber || '');
          setCompanyCity(data.city);
          setCompanyZip(data.zipCode);
          setPkd(data.pkd || '');
          setPkdDesc(data.pkdDesc || '');
          setStartDate(data.startDate || '');
          setVatStatus(data.vatStatus || '');
          setRegon(data.regon || '');
          setLegalForm(data.legalForm || 'JDG');
          setShareCapital(data.shareCapital);
          setRepresentatives(data.representatives || []);
          setKrs(data.krs || '');
          setIsCeidgSource(true);
          toast.success('Pobrano dane z CEIDG/GUS', `Formularz uzupełniony dla firmy: ${data.name}`);
      } else {
          toast.warning('Nie znaleziono firmy', 'Sprawdź poprawność numeru NIP lub spróbuj ponownie.');
      }
      setCheckingNip(false);
  };

  const startKycProcess = async () => {
      setKycStatus('PROCESSING');
      setKycLogs([]);
      setKycProgress(0);
      const addLog = (msg: string) => setKycLogs(prev => [...prev, `[${new Date().toLocaleTimeString().split(' ')[0]}] ${msg}`]);
      const stages = [
          { name: 'ID_SCAN', label: 'Weryfikacja Dokumentu', steps: ['Initializing secure session (TLS 1.3)...', 'Connecting to identity provider...', 'Requesting camera access...', 'Capturing ID document (Front)...', 'Analyzing hologram pattern...', 'Extracting OCR data...', 'Checksum validation: OK.'] },
          { name: 'BIOMETRICS', label: 'Analiza Biometryczna', steps: ['Locating facial features...', 'Mapping 3D depth grid...', 'Checking liveness (active blink)...', 'Calculating face vector hash...', 'Matching face with ID photo...', 'Similarity Score: 99.8%.'] },
          { name: 'COMPLIANCE', label: 'AML & Sankcje', steps: ['Connecting to global databases...', 'Scanning PEP lists (Politically Exposed)...', 'Checking OFAC/EU sanction lists...', 'Analyzing adverse media...', 'Risk Assessment: LOW.'] }
      ];
      let totalSteps = stages.reduce((acc, stage) => acc + stage.steps.length, 0);
      let currentStep = 0;
      for (const stage of stages) {
          setKycStage(stage.name);
          for (const step of stage.steps) {
             addLog(step);
             currentStep++;
             setKycProgress((currentStep / totalSteps) * 100);
             await new Promise(r => setTimeout(r, 600));
          }
      }
      addLog('Verification Complete. Access Granted.');
      setKycStatus('SUCCESS');
  };

  const handleRegister = async () => {
      setLoading(true);
      await NuffiService.register(nip, email);
      const { token, plan, user } = await NuffiService.login('demo@nuffi.com', 'password');
      onLogin(token, plan, user);
      setLoading(false);
  };

  const downloadExtract = async () => {
      setIsDownloading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsDownloading(false);
      setShowPdf(true);
      toast.success('Pobrano Dokument', `Oficjalny odpis ${legalForm === 'JDG' ? 'CEIDG' : 'KRS'} dla NIP ${nip} został wygenerowany.`);
  };

  const getLegalFormLabel = (code: string) => {
      switch(code) {
          case 'JDG': return 'Jednoosobowa Działalność';
          case 'KRS_SP_Z_OO': return 'Spółka z o.o.';
          case 'KRS_SA': return 'Spółka Akcyjna';
          case 'KRS_SP_KOM': return 'Spółka Komandytowa';
          case 'CIVIL': return 'Spółka Cywilna';
          default: return code;
      }
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 blur-sm"></div>
      
      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 overflow-hidden border border-white/20">
        
        {/* Left Side: Brand */}
        <div className="bg-indigo-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-16 -mb-16"></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                        <ShieldCheck size={32} />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">Nuffi</span>
                </div>
                <h2 className="text-4xl font-bold mb-6 leading-tight">
                    {mode === 'LOGIN' ? 'Twoje Finanse.\nPod Kontrolą.' : 'Rejestracja Firmy.\nAutomatycznie.'}
                </h2>
                <p className="text-indigo-100 text-lg">
                    Kompleksowa platforma podatkowa dla nowoczesnych przedsiębiorców. KSeF, Open Banking i Krypto w jednym miejscu.
                </p>
                <div className="mt-8 flex items-center gap-2 text-xs bg-indigo-700/50 p-2 rounded border border-indigo-500/30 w-fit">
                    <ShieldCheck size={14} /> Secured by SumSub & Civic
                </div>
            </div>
            
            <div className="relative z-10 mt-12 flex items-center gap-4 text-sm font-medium text-indigo-200">
                <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-indigo-600"></div>
                    ))}
                </div>
                <span>Dołącz do 10,000+ firm</span>
            </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-12 flex flex-col justify-center overflow-y-auto max-h-[90vh] custom-scrollbar">
            <div className="flex justify-end mb-8">
                <button 
                    onClick={() => { setMode(mode === 'LOGIN' ? 'REGISTER' : 'LOGIN'); setGusData(null); setKycStatus('IDLE'); setNip(''); setIsCeidgSource(false); }}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                    {mode === 'LOGIN' ? 'Nie masz konta? Zarejestruj się' : 'Masz już konto? Zaloguj się'}
                </button>
            </div>

            {mode === 'LOGIN' ? (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">Zaloguj się</h3>
                        <p className="text-gray-500 text-sm">Użyj demo@nuffi.com / password</p>
                    </div>
                    
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="email" 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="Adres email"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="password" 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="Hasło"
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Zaloguj się <ArrowRight size={18} /></>}
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                        <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">lub</span></div>
                    </div>

                    <button 
                        onClick={handleCivicLogin}
                        className="w-full border border-green-500 text-green-700 bg-green-50 py-3 rounded-xl font-bold hover:bg-green-100 transition-all flex items-center justify-center gap-2"
                    >
                        <Fingerprint size={18} /> Zaloguj z Civic Secure ID
                    </button>

                    <button 
                        onClick={handleNftLogin}
                        className="w-full border border-purple-500 text-purple-700 bg-purple-50 py-3 rounded-xl font-bold hover:bg-purple-100 transition-all flex items-center justify-center gap-2 mt-3"
                    >
                        <Wallet size={18} /> Zaloguj portfelem (NFT Gate)
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">Stwórz konto firmowe</h3>
                        <p className="text-gray-500 text-sm">Pobierzemy dane z CEIDG / GUS automatycznie.</p>
                    </div>

                    {!gusData ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Podaj NIP</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input 
                                            type="text" 
                                            value={nip}
                                            onChange={e => setNip(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleNipCheck()}
                                            placeholder="np. 5213214567"
                                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                    <button 
                                        onClick={handleNipCheck}
                                        disabled={checkingNip || nip.length < 10}
                                        className="bg-gray-900 text-white px-6 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center gap-2"
                                    >
                                        {checkingNip ? <Loader2 className="animate-spin" /> : <><Search size={18} /> Szukaj</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 h-full">
                            {kycStatus === 'PROCESSING' ? (
                                <div className="py-6 space-y-6 animate-in fade-in flex flex-col items-center justify-center h-full min-h-[400px]">
                                    {/* Advanced Visualization */}
                                    <div className="relative w-40 h-40 flex items-center justify-center">
                                        {/* Status Ring */}
                                        <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                                            <circle 
                                                cx="80" cy="80" r="76" 
                                                fill="none" 
                                                stroke="#4F46E5" 
                                                strokeWidth="4" 
                                                strokeDasharray="477"
                                                strokeDashoffset={477 - (477 * kycProgress / 100)}
                                                strokeLinecap="round"
                                                className="transition-all duration-300"
                                            />
                                        </svg>

                                        {/* Inner Animated Elements */}
                                        <div className="absolute inset-4 rounded-full border border-indigo-100 flex items-center justify-center overflow-hidden bg-slate-50">
                                            {kycStage === 'ID_SCAN' && (
                                                <div className="relative w-full h-full flex items-center justify-center animate-in zoom-in duration-300">
                                                    <FileSearch size={40} className="text-indigo-600" />
                                                    <div className="absolute inset-0 bg-indigo-500/10 h-1 top-0 animate-[scan_2s_linear_infinite]"></div>
                                                </div>
                                            )}
                                            {kycStage === 'BIOMETRICS' && (
                                                <div className="relative w-full h-full flex items-center justify-center animate-in zoom-in duration-300">
                                                    <ScanFace size={40} className="text-purple-600" />
                                                    <div className="absolute w-full h-full border-2 border-purple-200 rounded-full animate-ping opacity-50"></div>
                                                </div>
                                            )}
                                            {kycStage === 'COMPLIANCE' && (
                                                <div className="relative w-full h-full flex items-center justify-center animate-in zoom-in duration-300">
                                                    <ShieldCheck size={40} className="text-blue-600" />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-20 h-20 border-t-2 border-blue-500 rounded-full animate-spin"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Checklist */}
                                    <div className="w-full max-w-sm grid grid-cols-3 gap-2">
                                        {[
                                            { id: 'ID_SCAN', label: 'Dokument', icon: FileText },
                                            { id: 'BIOMETRICS', label: 'Biometria', icon: ScanFace },
                                            { id: 'COMPLIANCE', label: 'AML/PEP', icon: Database },
                                        ].map(item => {
                                            // Determine state: Pending, Current, Done
                                            const stages = ['ID_SCAN', 'BIOMETRICS', 'COMPLIANCE'];
                                            const currentIndex = stages.indexOf(kycStage);
                                            const itemIndex = stages.indexOf(item.id);
                                            
                                            let state = 'PENDING';
                                            if (itemIndex < currentIndex) state = 'DONE';
                                            if (itemIndex === currentIndex) state = 'CURRENT';

                                            return (
                                                <div key={item.id} className={`flex flex-col items-center p-2 rounded-lg border transition-all duration-300 ${
                                                    state === 'CURRENT' ? 'bg-white border-indigo-200 shadow-sm transform scale-105' :
                                                    state === 'DONE' ? 'bg-green-50 border-green-200 opacity-80' :
                                                    'bg-slate-50 border-transparent opacity-50'
                                                }`}>
                                                    <div className={`mb-1 ${state === 'CURRENT' ? 'text-indigo-600 animate-pulse' : state === 'DONE' ? 'text-green-600' : 'text-slate-400'}`}>
                                                        {state === 'DONE' ? <CheckCircle2 size={16} /> : <item.icon size={16} />}
                                                    </div>
                                                    <span className="text-[9px] font-bold uppercase">{item.label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Live Terminal Log */}
                                    <div className="w-full bg-[#0F172A] rounded-lg border border-slate-700 p-3 font-mono text-[10px] h-32 overflow-hidden flex flex-col relative shadow-inner">
                                        <div className="flex items-center justify-between border-b border-slate-700 pb-1 mb-2 text-slate-500">
                                            <div className="flex gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            </div>
                                            <span className="flex items-center gap-1"><Terminal size={8} /> civic-auth-sdk</span>
                                        </div>
                                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
                                            {kycLogs.map((log, i) => (
                                                <div key={i} className="text-green-400 animate-in slide-in-from-left-2 duration-200">
                                                    <span className="text-slate-600 mr-2">{log.split(']')[0]}]</span>
                                                    {log.split(']')[1]}
                                                </div>
                                            ))}
                                            <div ref={logsEndRef} />
                                        </div>
                                    </div>
                                </div>
                            ) : kycStatus === 'SUCCESS' ? (
                                <div className="space-y-4 text-center py-8 animate-in zoom-in">
                                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-green-50">
                                        <ShieldCheck size={40} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-xl">Tożsamość Potwierdzona</h4>
                                        <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
                                            Pomyślnie zweryfikowano dane reprezentanta firmy <strong>{companyName}</strong>. 
                                            Konto jest gotowe do użycia.
                                        </p>
                                        <div className="mt-4 flex justify-center gap-2">
                                            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100 flex items-center gap-1">
                                                <Check size={12} /> KYC: OK
                                            </span>
                                            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100 flex items-center gap-1">
                                                <Check size={12} /> AML: OK
                                            </span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleRegister}
                                        disabled={loading}
                                        className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 mt-6"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : <>Utwórz Konto Firmowe <ArrowRight size={18} /></>}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                                            <CheckCircle2 size={16} /> Dane pobrane z CEIDG/KRS
                                        </div>
                                        <button 
                                            onClick={() => { setGusData(null); setIsCeidgSource(false); }}
                                            className="text-xs text-indigo-600 hover:underline"
                                        >
                                            Zmień NIP
                                        </button>
                                    </div>

                                    {/* Auto-filled Form */}
                                    <div className="space-y-3">
                                        <div>
                                            <label className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase mb-1">
                                                Nazwa Firmy
                                                {isCeidgSource && <span className="text-[10px] text-green-600 bg-green-50 px-1.5 rounded border border-green-100">ZWERYFIKOWANO</span>}
                                            </label>
                                            <div className="relative">
                                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                <input 
                                                    type="text" 
                                                    value={companyName}
                                                    onChange={e => setCompanyName(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-12 gap-3">
                                            <div className="col-span-8">
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ulica</label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                    <input 
                                                        type="text" 
                                                        value={street}
                                                        onChange={e => setStreet(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nr Domu</label>
                                                <input 
                                                    type="text" 
                                                    value={houseNumber}
                                                    onChange={e => setHouseNumber(e.target.value)}
                                                    className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-center font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nr Lok.</label>
                                                <input 
                                                    type="text" 
                                                    value={aptNumber}
                                                    onChange={e => setAptNumber(e.target.value)}
                                                    className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-center font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kod Pocztowy</label>
                                                <div className="relative">
                                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                    <input 
                                                        type="text" 
                                                        value={companyZip}
                                                        onChange={e => setCompanyZip(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Miejscowość</label>
                                                <input 
                                                    type="text" 
                                                    value={companyCity}
                                                    onChange={e => setCompanyCity(e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                                                />
                                            </div>
                                        </div>

                                        {/* Register Details (KRS/CEIDG REPORT) */}
                                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-3 relative overflow-hidden">
                                            {/* Report Header */}
                                            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <FileText size={16} className="text-slate-400" />
                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Raport o podmiocie (GUS)</span>
                                                </div>
                                                <div className="flex gap-1 bg-white p-0.5 rounded border border-slate-200">
                                                    <button 
                                                        onClick={() => setReportTab('DETAILS')}
                                                        className={`text-[10px] px-2 py-0.5 rounded font-bold transition-all ${reportTab === 'DETAILS' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                                                    >
                                                        DANE
                                                    </button>
                                                    <button 
                                                        onClick={() => setReportTab('HISTORY')}
                                                        className={`text-[10px] px-2 py-0.5 rounded font-bold transition-all flex items-center gap-1 ${reportTab === 'HISTORY' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                                                    >
                                                        HISTORIA {gusData.history && gusData.history.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>}
                                                    </button>
                                                </div>
                                            </div>

                                            {reportTab === 'DETAILS' ? (
                                                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm animate-in fade-in">
                                                    <div>
                                                        <div className="text-[10px] text-slate-400 uppercase font-bold">Forma Prawna</div>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase border ${legalForm !== 'JDG' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-600 border-slate-200'}`}>
                                                                {legalForm === 'JDG' ? 'CEIDG' : 'KRS'}
                                                            </span>
                                                            <span className="font-bold text-slate-900 truncate" title={getLegalFormLabel(legalForm)}>{getLegalFormLabel(legalForm)}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div>
                                                        <div className="text-[10px] text-slate-400 uppercase font-bold">REGON</div>
                                                        <div className="font-mono font-bold text-slate-900 tracking-wide">{regon}</div>
                                                    </div>

                                                    {krs && (
                                                        <div>
                                                            <div className="text-[10px] text-slate-400 uppercase font-bold">Numer KRS</div>
                                                            <div className="font-mono font-bold text-indigo-600">{krs}</div>
                                                        </div>
                                                    )}

                                                    {shareCapital && (
                                                        <div>
                                                            <div className="text-[10px] text-slate-400 uppercase font-bold">Kapitał Zakładowy</div>
                                                            <div className="font-mono font-bold text-slate-900">{formatCurrency(shareCapital)}</div>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="col-span-2">
                                                        <div className="text-[10px] text-slate-400 uppercase font-bold">Branża (PKD)</div>
                                                        <div className="font-mono font-bold text-slate-900">{pkd}</div>
                                                        {pkdDesc && <div className="text-xs text-slate-500 truncate" title={pkdDesc}>{pkdDesc}</div>}
                                                    </div>

                                                    <div className="col-span-2">
                                                        <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Status VAT (Podatnik)</div>
                                                        <div className={`text-xs font-bold px-2 py-1 rounded border inline-flex items-center gap-1 ${
                                                            vatStatus === 'ACTIVE' ? 'bg-green-100 text-green-700 border-green-200' :
                                                            vatStatus === 'EXEMPT' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                            'bg-amber-100 text-amber-700 border-amber-200'
                                                        }`}>
                                                            {vatStatus === 'ACTIVE' && <Check size={12} />}
                                                            {vatStatus === 'ACTIVE' ? 'Czynny Podatnik VAT' : vatStatus === 'EXEMPT' ? 'Zwolniony z VAT' : 'Zawieszony'}
                                                        </div>
                                                    </div>

                                                    <div className="col-span-2">
                                                        {/* Simulated Dynamic Map */}
                                                        <div className="h-28 w-full bg-slate-200 rounded-lg overflow-hidden relative border border-slate-300 group">
                                                            {/* Background Pattern to simulate map terrain */}
                                                            <div className="absolute inset-0 bg-blue-50 opacity-50" style={{backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
                                                            
                                                            {/* Streets Simulation */}
                                                            <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300" style={{ transform: `scale(${mapZoom})` }}>
                                                                <div className="w-[120%] h-2 bg-white transform -rotate-3 border-t border-b border-gray-300 absolute"></div>
                                                                <div className="h-[120%] w-2 bg-white transform rotate-12 border-l border-r border-gray-300 absolute"></div>
                                                            </div>
                                                            
                                                            {/* Pin Marker */}
                                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 transition-transform group-hover:-translate-y-3 duration-300">
                                                                <MapPin className="text-red-600 fill-red-600 drop-shadow-md" size={32} />
                                                            </div>

                                                            {/* Map Controls */}
                                                            <div className="absolute top-2 right-2 flex flex-col gap-1 z-20">
                                                                <button 
                                                                    onClick={() => setMapZoom(z => Math.min(z + 0.5, 3))}
                                                                    className="w-5 h-5 bg-white border border-gray-300 rounded flex items-center justify-center text-slate-500 shadow-sm hover:bg-slate-50"
                                                                >
                                                                    <Plus size={12} />
                                                                </button>
                                                                <button 
                                                                    onClick={() => setMapZoom(z => Math.max(z - 0.5, 1))}
                                                                    className="w-5 h-5 bg-white border border-gray-300 rounded flex items-center justify-center text-slate-500 shadow-sm hover:bg-slate-50"
                                                                >
                                                                    <Minus size={12} />
                                                                </button>
                                                            </div>

                                                            {/* Address Label */}
                                                            <div className="absolute bottom-2 left-2 right-2 flex justify-center z-20">
                                                                <span className="text-[10px] font-bold text-slate-700 bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm border border-slate-200 truncate flex items-center gap-1">
                                                                    <Map size={10} /> {street} {houseNumber}, {companyCity}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-3 animate-in fade-in min-h-[150px]">
                                                    {gusData?.history && gusData.history.length > 0 ? (
                                                        gusData.history.map((entry: any, i: number) => (
                                                            <div key={i} className="flex gap-3 items-start group relative">
                                                                <div className="relative mt-1.5 flex flex-col items-center">
                                                                    <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full shrink-0 ring-2 ring-white z-10"></div>
                                                                    {i !== gusData.history.length - 1 && <div className="w-0.5 h-full bg-slate-200 absolute top-2.5"></div>}
                                                                </div>
                                                                <div className="pb-4">
                                                                    <p className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded inline-block mb-1">{entry.date}</p>
                                                                    <p className="text-xs font-medium text-slate-800 leading-snug">{entry.description}</p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center py-8 text-slate-400 text-xs flex flex-col items-center">
                                                            <History size={24} className="mb-2 opacity-50" />
                                                            Brak wpisów historycznych dla tego podmiotu.
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {representatives.length > 0 && reportTab === 'DETAILS' && (
                                                <div className="border-t border-slate-200 pt-2 mt-2">
                                                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Reprezentacja</div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {representatives.map((rep, idx) => (
                                                            <div key={idx} className="text-[10px] text-slate-700 bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">
                                                                {rep}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="border-t border-slate-200 pt-2 mt-2 flex justify-end">
                                                <button 
                                                    onClick={downloadExtract}
                                                    disabled={isDownloading}
                                                    className="text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded flex items-center gap-1 transition-colors disabled:opacity-50 border border-transparent hover:border-indigo-100"
                                                >
                                                    {isDownloading ? <Loader2 size={12} className="animate-spin" /> : <Printer size={12} />}
                                                    {isDownloading ? 'Generowanie...' : 'Pobierz Odpis (PDF)'}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">E-mail Firmowy</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                <input 
                                                    type="email" 
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                                    placeholder="kontakt@firma.pl"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={startKycProcess}
                                        disabled={loading}
                                        className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 mt-4"
                                    >
                                        Dalej: Weryfikacja KYC <UserCheck size={18} />
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>

      {/* PDF PREVIEW MODAL */}
      <Modal isOpen={showPdf} onClose={() => setShowPdf(false)} title="Podgląd Dokumentu Urzędowego">
          <div className="bg-white p-8 max-w-3xl mx-auto shadow-2xl border border-gray-200 font-serif text-black relative min-h-[600px]">
              {/* Paper Texture */}
              <div className="absolute inset-0 bg-[#fdfbf7] opacity-50 pointer-events-none"></div>
              
              {/* Header */}
              <div className="relative z-10 text-center border-b-2 border-black pb-4 mb-6">
                  <div className="flex justify-center mb-2">
                      <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center">
                          <Building size={32} />
                      </div>
                  </div>
                  <h1 className="text-xl font-bold uppercase tracking-wider">Ministerstwo Rozwoju i Technologii</h1>
                  <h2 className="text-lg font-bold mt-2">WYDRUK Z CENTRALNEJ EWIDENCJI I INFORMACJI O DZIAŁALNOŚCI GOSPODARCZEJ</h2>
                  <p className="text-xs mt-1">Stan na dzień: {new Date().toLocaleDateString('pl-PL')}</p>
              </div>

              <div className="relative z-10 text-xs space-y-6">
                  <div className="grid grid-cols-2 gap-8">
                      <div>
                          <p className="font-bold uppercase border-b border-gray-300 mb-1">Dane Przedsiębiorcy</p>
                          <div className="space-y-1">
                              <p><span className="font-bold">Imię i Nazwisko:</span> {legalForm === 'JDG' ? companyName.split('"')[0].trim() : 'n/d'}</p>
                              <p><span className="font-bold">NIP:</span> {nip}</p>
                              <p><span className="font-bold">REGON:</span> {regon}</p>
                          </div>
                      </div>
                      <div>
                          <p className="font-bold uppercase border-b border-gray-300 mb-1">Dane Firmy</p>
                          <div className="space-y-1">
                              <p><span className="font-bold">Nazwa:</span> {companyName}</p>
                              <p><span className="font-bold">Data rozpoczęcia:</span> {startDate}</p>
                              <p><span className="font-bold">Status:</span> {vatStatus === 'ACTIVE' ? 'AKTYWNY' : 'ZAWIESZONY'}</p>
                          </div>
                      </div>
                  </div>

                  <div>
                      <p className="font-bold uppercase border-b border-gray-300 mb-1">Adresy</p>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <p className="font-bold italic">Adres do doręczeń:</p>
                              <p>{street} {houseNumber}{aptNumber ? '/' + aptNumber : ''}</p>
                              <p>{companyZip} {companyCity}</p>
                          </div>
                          <div>
                              <p className="font-bold italic">Stałe miejsce wykonywania działalności:</p>
                              <p>{street} {houseNumber}{aptNumber ? '/' + aptNumber : ''}</p>
                              <p>{companyZip} {companyCity}</p>
                          </div>
                      </div>
                  </div>

                  <div>
                      <p className="font-bold uppercase border-b border-gray-300 mb-1">Klasyfikacja PKD</p>
                      <p><span className="font-bold">{pkd}</span> - {pkdDesc}</p>
                  </div>

                  <div className="border-t-2 border-black pt-4 mt-8 text-[10px] text-center text-gray-500">
                      <p>Niniejszy wydruk jest zgodny z art. 46 ust. 1 ustawy o CEIDG i Punkcie Informacji dla Przedsiębiorcy.</p>
                      <p className="font-mono mt-1">ID Wydruku: {Math.random().toString(36).substring(7).toUpperCase()}-{Date.now()}</p>
                  </div>
              </div>

              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none z-0">
                  <div className="border-8 border-black p-12 rounded-full transform -rotate-45">
                      <span className="text-9xl font-bold uppercase">ORYGINAŁ</span>
                  </div>
              </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowPdf(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">Zamknij</button>
              <button className="px-4 py-2 text-sm bg-slate-900 text-white rounded hover:bg-slate-800 flex items-center gap-2">
                  <Download size={14} /> Zapisz na dysku
              </button>
          </div>
      </Modal>
    </div>
  );
};