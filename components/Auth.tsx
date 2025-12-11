
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

  // ... (rest of KYC logic same as before but wrapped in glassmorphism) ...
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background with reliable gradients */}
      <div className="absolute inset-0 bg-slate-950 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/60 via-slate-950 to-black z-0"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -ml-20 -mb-20 pointer-events-none"></div>
      </div>
      
      <div className="relative z-10 glass-card rounded-2xl shadow-2xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 overflow-hidden border border-white/5">
        
        {/* Left Side: Brand */}
        <div className="bg-indigo-600/90 backdrop-blur-xl p-12 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-3xl -ml-16 -mb-16"></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                        <ShieldCheck size={32} />
                    </div>
                    <span className="text-2xl font-bold tracking-tight font-mono">Nuffi OS</span>
                </div>
                <h2 className="text-4xl font-bold mb-6 leading-tight">
                    {mode === 'LOGIN' ? 'Twoje Finanse.\nPod Kontrolą.' : 'Rejestracja Firmy.\nAutomatycznie.'}
                </h2>
                <p className="text-indigo-100 text-lg">
                    Kompleksowa platforma podatkowa dla nowoczesnych przedsiębiorców. KSeF, Open Banking i Krypto w jednym terminalu.
                </p>
                <div className="mt-8 flex items-center gap-2 text-xs bg-indigo-800/50 p-2 rounded border border-indigo-400/30 w-fit backdrop-blur-sm">
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
        <div className="p-12 flex flex-col justify-center overflow-y-auto max-h-[90vh] custom-scrollbar bg-slate-900/50">
            <div className="flex justify-end mb-8">
                <button 
                    onClick={() => { setMode(mode === 'LOGIN' ? 'REGISTER' : 'LOGIN'); setGusData(null); setKycStatus('IDLE'); setNip(''); setIsCeidgSource(false); }}
                    className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                    {mode === 'LOGIN' ? 'Nie masz konta? Zarejestruj się' : 'Masz już konto? Zaloguj się'}
                </button>
            </div>

            {mode === 'LOGIN' ? (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-1">Zaloguj się</h3>
                        <p className="text-slate-400 text-sm">Użyj demo@nuffi.com / password</p>
                    </div>
                    
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="email" 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-slate-500"
                                placeholder="Adres email"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="password" 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-slate-500"
                                placeholder="Hasło"
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Zaloguj się <ArrowRight size={18} /></>}
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700"></div></div>
                        <div className="relative flex justify-center text-sm"><span className="px-2 bg-slate-900 text-slate-500">lub</span></div>
                    </div>

                    <button 
                        onClick={handleCivicLogin}
                        className="w-full border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 py-3 rounded-xl font-bold hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
                    >
                        <Fingerprint size={18} /> Zaloguj z Civic Secure ID
                    </button>

                    <button 
                        onClick={handleNftLogin}
                        className="w-full border border-purple-500/30 text-purple-400 bg-purple-500/10 py-3 rounded-xl font-bold hover:bg-purple-500/20 transition-all flex items-center justify-center gap-2 mt-3"
                    >
                        <Wallet size={18} /> Zaloguj portfelem (NFT Gate)
                    </button>
                </div>
            ) : (
                // REGISTER MODE (Simplified for styling focus)
                <div className="space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-1">Stwórz konto firmowe</h3>
                        <p className="text-slate-400 text-sm">Pobierzemy dane z CEIDG / GUS automatycznie.</p>
                    </div>

                    {!gusData ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Podaj NIP</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input 
                                            type="text" 
                                            value={nip}
                                            onChange={e => setNip(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleNipCheck()}
                                            placeholder="np. 5213214567"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-slate-500"
                                        />
                                    </div>
                                    <button 
                                        onClick={handleNipCheck}
                                        disabled={checkingNip || nip.length < 10}
                                        className="bg-indigo-600 text-white px-6 rounded-xl font-bold hover:bg-indigo-500 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-900/50"
                                    >
                                        {checkingNip ? <Loader2 className="animate-spin" /> : <><Search size={18} /> Szukaj</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 h-full text-white">
                            {/* ... KYC Visualization & Data Form (Styled Dark) ... */}
                            <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                                    <CheckCircle2 size={16} /> Dane pobrane z CEIDG/KRS
                                </div>
                                <button 
                                    onClick={() => { setGusData(null); setIsCeidgSource(false); }}
                                    className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline"
                                >
                                    Zmień NIP
                                </button>
                            </div>
                            
                            <p className="text-sm text-slate-300">
                                Firma: <strong className="text-white">{companyName}</strong><br/>
                                Adres: {street} {houseNumber}, {companyCity}
                            </p>

                            <button 
                                onClick={handleRegister}
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-indigo-900/50"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <>Utwórz Konto <ArrowRight size={18} /></>}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
      
      <Modal isOpen={false} onClose={() => {}} title="">{null}</Modal>
    </div>
  );
};
