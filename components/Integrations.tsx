
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { BankAccount, CryptoWallet, IntegrationStatus } from '../types';
import { Plus, CheckCircle2, Building, Loader2, ShieldCheck, Lock, Wallet, ArrowRight, Activity, Server, Globe, RefreshCw, Cpu, Wifi, ChevronLeft } from 'lucide-react';
import { Modal } from './ui/Modal';
import { toast } from './ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';

const BANKS = [
  { id: 'mbank', name: 'mBank', color: 'from-red-600 to-red-900', logo: 'M' },
  { id: 'pko', name: 'PKO BP', color: 'from-blue-800 to-blue-950', logo: 'P' },
  { id: 'pekao', name: 'Bank Pekao', color: 'from-red-800 to-red-950', logo: 'Ż' },
  { id: 'ing', name: 'ING Bank', color: 'from-orange-500 to-orange-700', logo: 'L' },
  { id: 'revolut', name: 'Revolut', color: 'from-blue-500 to-indigo-600', logo: 'R' },
];

export const Integrations: React.FC = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [wallets, setWallets] = useState<CryptoWallet[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<IntegrationStatus>('IDLE');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  // Web3 Connect
  const [web3ModalOpen, setWeb3ModalOpen] = useState(false);
  const [connectingWeb3, setConnectingWeb3] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [accs, wals] = await Promise.all([
      NuffiService.fetchAccounts(),
      NuffiService.fetchWallets()
    ]);
    setAccounts(accs);
    setWallets(wals);
    setLoading(false);
  };

  const startConnection = (bankId: string) => {
    setSelectedBank(bankId);
    setStatus('CONNECTING');
    setTimeout(() => setStatus('AUTHENTICATING'), 1500); 
    setTimeout(() => setStatus('FETCHING'), 3500); 
    setTimeout(() => {
        setStatus('SUCCESS');
        fetchData(); 
    }, 5500);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setStatus('IDLE');
    setSelectedBank(null);
  };

  const handleWeb3Connect = async (provider: string) => {
      setConnectingWeb3(true);
      await new Promise(r => setTimeout(r, 2000));
      toast.success('Portfel połączony', `Pomyślnie zintegrowano ${provider}.`);
      setConnectingWeb3(false);
      setWeb3ModalOpen(false);
  };

  // Telemetry Mock
  const PingGraph = () => (
      <div className="flex items-end gap-0.5 h-6 opacity-30">
          {Array.from({length: 30}).map((_,i) => (
              <div key={i} className="w-1 bg-emerald-500 rounded-t-sm" style={{height: `${Math.random() * 100}%`}}></div>
          ))}
      </div>
  );

  const renderModalContent = () => {
    if (status === 'IDLE') {
      return (
        <div className="grid grid-cols-1 gap-3">
          {BANKS.map(bank => (
            <button
              key={bank.id}
              onClick={() => startConnection(bank.id)}
              className="flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-gold/30 bg-white/5 hover:bg-white/10 transition-all group"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${bank.color} text-white flex items-center justify-center font-bold text-lg shadow-lg`}>
                {bank.name.substring(0, 1)}
              </div>
              <div className="flex-1 text-left">
                  <span className="font-bold text-zinc-200 block text-sm">{bank.name}</span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">PSD2 / Open Banking</span>
              </div>
              <ArrowRight size={16} className="text-zinc-500 group-hover:text-gold opacity-0 group-hover:opacity-100 transition-all" />
            </button>
          ))}
        </div>
      );
    }

    if (status === 'SUCCESS') {
      return (
        <div className="text-center py-8 animate-in fade-in zoom-in">
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
            <CheckCircle2 size={40} />
          </div>
          <h4 className="text-xl font-bold text-white">Połączenie Bezpieczne</h4>
          <p className="text-zinc-400 mt-2 mb-8 text-sm">Tunel szyfrowany ustanowiony. Pobrano historię.</p>
          <button onClick={handleCloseModal} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/20">
            Zakończ
          </button>
        </div>
      );
    }

    // Terminal Style Loading
    const steps = [
      { s: 'CONNECTING', label: 'Inicjalizacja handshake TLS 1.3...' },
      { s: 'AUTHENTICATING', label: 'Weryfikacja certyfikatu eIDAS...' },
      { s: 'FETCHING', label: 'Synchronizacja rejestru (AIS/PIS)...' },
    ];
    const currentStepIndex = steps.findIndex(step => step.s === status);

    return (
      <div className="py-6 font-mono">
        <div className="bg-black border border-white/10 rounded-xl p-4 text-xs space-y-2 mb-6 h-48 overflow-hidden relative">
            <div className="text-emerald-500">$ nuffi connect --provider={selectedBank}</div>
            {steps.map((step, idx) => (
                <div key={step.s} className={`flex items-center gap-2 ${idx > currentStepIndex ? 'opacity-30' : 'opacity-100'}`}>
                    <span className={idx <= currentStepIndex ? 'text-green-500' : 'text-zinc-600'}>
                        {idx < currentStepIndex ? '[OK]' : idx === currentStepIndex ? '[..]' : '[  ]'}
                    </span>
                    <span className={idx === currentStepIndex ? 'text-white animate-pulse' : 'text-zinc-400'}>
                        {step.label}
                    </span>
                </div>
            ))}
            <div className="absolute bottom-4 left-4 right-4 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                    className="h-full bg-gold"
                    initial={{ width: '0%' }}
                    animate={{ width: `${((currentStepIndex + 1) / 3) * 100}%` }}
                    transition={{ duration: 0.5 }}
                ></motion.div>
            </div>
        </div>
        
        <div className="flex justify-center text-zinc-500 text-[10px] items-center gap-2">
            <Lock size={10} /> 
            <span>End-to-End Encrypted Channel</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex justify-between items-center border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Server className="text-gold" /> Nexus Connectivity
          </h2>
          <p className="text-zinc-400 mt-1">Zarządzanie węzłami bankowymi i bramkami Web3.</p>
        </div>
        <div className="flex gap-4 items-center">
            <div className="hidden md:flex items-center gap-2 bg-[#0A0A0C] border border-white/10 px-3 py-1.5 rounded-lg text-xs font-mono text-emerald-400">
                <Wifi size={12} /> GATEWAY ONLINE
            </div>
            <div className="hidden md:flex items-center gap-2 bg-[#0A0A0C] border border-white/10 px-3 py-1.5 rounded-lg text-xs font-mono text-blue-400">
                <Activity size={12} /> 24ms LATENCY
            </div>
        </div>
      </header>

      {/* Banking Section */}
      <section>
        <div className="flex justify-between items-end mb-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Building size={14} /> Węzły Bankowe (Open Banking)
            </h3>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-bold border border-white/10 transition-colors flex items-center gap-2"
            >
                <Plus size={14} /> Dodaj Węzeł
            </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading ? (
             [1, 2].map(i => <div key={i} className="h-32 bg-white/5 rounded-xl animate-pulse" />)
          ) : (
            <>
              {accounts.map(acc => (
                <div key={acc.id} className="group relative bg-[#0F0F12] border border-white/10 rounded-xl overflow-hidden hover:border-gold/30 transition-all">
                  {/* Status LED */}
                  <div className="absolute top-3 right-3 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981] animate-pulse"></div>
                  
                  <div className="p-5">
                      <div className="flex items-center gap-4 mb-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-inner ${acc.colorTheme.replace('from-', 'bg-').split(' ')[0]}`}>
                              {acc.providerName.substring(0,1)}
                          </div>
                          <div>
                              <h4 className="font-bold text-white text-sm">{acc.providerName}</h4>
                              <p className="text-[10px] text-zinc-500 font-mono tracking-wider">
                                  *** {acc.accountNumber.slice(-4)}
                              </p>
                          </div>
                      </div>
                      
                      <div className="flex items-end justify-between border-t border-white/5 pt-3">
                          <div>
                              <p className="text-[9px] text-zinc-500 uppercase font-bold">API Status</p>
                              <p className="text-emerald-400 text-xs font-bold">Connected</p>
                          </div>
                          <div className="text-right">
                              <p className="text-[9px] text-zinc-500 uppercase font-bold">Sync</p>
                              <p className="text-zinc-300 text-xs font-mono">1m ago</p>
                          </div>
                      </div>
                  </div>
                  
                  {/* Hover Actions Overlay */}
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 text-white border border-white/10"><RefreshCw size={16}/></button>
                      <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 text-white border border-white/10"><ArrowRight size={16}/></button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>

      {/* Crypto Section */}
      <section className="mt-8">
        <div className="flex justify-between items-end mb-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Cpu size={14} /> Węzły Blockchain (RPC)
            </h3>
            <button 
                onClick={() => setWeb3ModalOpen(true)}
                className="bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-indigo-600/20 transition-colors flex items-center gap-2"
            >
                <Plus size={14} /> Połącz Wallet
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {wallets.map(wallet => (
            <div key={wallet.id} className="group relative bg-[#0F0F12] border border-white/10 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all">
                <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-2 w-fit">
                            <Wallet size={10} /> {wallet.provider}
                        </div>
                        <div className="flex gap-1">
                            <div className="w-1 h-3 bg-indigo-500 rounded-full"></div>
                            <div className="w-1 h-3 bg-indigo-500/50 rounded-full"></div>
                            <div className="w-1 h-3 bg-indigo-500/20 rounded-full"></div>
                        </div>
                    </div>
                    
                    <div className="font-mono text-zinc-300 text-xs bg-black/40 p-2 rounded border border-white/5 truncate mb-3">
                        {wallet.address}
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                        <div className="flex items-center gap-2">
                            <Globe size={12} className="text-zinc-500" />
                            <span className="text-xs text-white font-bold">{wallet.chain}</span>
                        </div>
                        <PingGraph />
                    </div>
                </div>
            </div>
          ))}
        </div>
      </section>

      {/* OAuth Simulation Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={status === 'IDLE' ? "Wybierz Bramkę Dostępową" : "Nawiązywanie Połączenia"}
      >
        {renderModalContent()}
      </Modal>

      {/* Web3 Modal */}
      <Modal isOpen={web3ModalOpen} onClose={() => setWeb3ModalOpen(false)} title="Wybierz Sygnatariusza">
          <div className="space-y-3">
              <button onClick={() => handleWeb3Connect('MetaMask')} className="w-full flex items-center gap-4 p-4 border border-white/10 bg-[#0F0F12] rounded-xl hover:bg-orange-500/10 hover:border-orange-500/50 transition-colors group">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-orange-600 font-bold border border-white/10 group-hover:scale-110 transition-transform">M</div>
                  <div className="text-left flex-1">
                      <h4 className="font-bold text-white text-sm">MetaMask</h4>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-wide">Browser Injection</p>
                  </div>
                  <ChevronLeft className="rotate-180 text-zinc-600" size={16} />
              </button>
              <button onClick={() => handleWeb3Connect('Ledger')} className="w-full flex items-center gap-4 p-4 border border-white/10 bg-[#0F0F12] rounded-xl hover:bg-white/10 hover:border-white/30 transition-colors group">
                  <div className="w-10 h-10 bg-black border border-white/20 rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">L</div>
                  <div className="text-left flex-1">
                      <h4 className="font-bold text-white text-sm">Ledger</h4>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-wide">Hardware (USB/BLE)</p>
                  </div>
                  <ChevronLeft className="rotate-180 text-zinc-600" size={16} />
              </button>
              {connectingWeb3 && (
                  <div className="flex items-center justify-center gap-2 text-sm text-gold py-4 font-bold animate-pulse font-mono">
                      <Loader2 className="animate-spin" size={16} /> SIGNING MESSAGE...
                  </div>
              )}
          </div>
      </Modal>
    </div>
  );
};
