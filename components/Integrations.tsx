
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { BankAccount, CryptoWallet, IntegrationStatus } from '../types';
import { Plus, CheckCircle2, Building, Bitcoin, Loader2, ShieldCheck, Lock, ArrowRight, XCircle, Wallet } from 'lucide-react';
import { Modal } from './ui/Modal';
import { toast } from './ui/Toast';

const BANKS = [
  { id: 'mbank', name: 'mBank', color: 'bg-gradient-to-br from-red-600 to-red-700', logo: 'M' },
  { id: 'pko', name: 'PKO BP', color: 'bg-gradient-to-br from-blue-800 to-blue-900', logo: 'P' },
  { id: 'pekao', name: 'Bank Pekao', color: 'bg-gradient-to-br from-red-800 to-red-900', logo: 'Ż' },
  { id: 'ing', name: 'ING Bank', color: 'bg-gradient-to-br from-orange-500 to-orange-600', logo: 'L' },
  { id: 'santander', name: 'Santander', color: 'bg-gradient-to-br from-red-600 to-red-800', logo: 'S' },
  { id: 'millennium', name: 'Millennium', color: 'bg-gradient-to-br from-pink-700 to-purple-800', logo: 'M' },
  { id: 'revolut', name: 'Revolut', color: 'bg-gradient-to-br from-blue-500 to-blue-600', logo: 'R' },
  { id: 'railsr', name: 'Railsr (Embedded)', color: 'bg-gradient-to-br from-indigo-900 to-slate-900', logo: 'Railsr' },
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
    
    // Simulate OAuth Flow
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

  const renderModalContent = () => {
    if (status === 'IDLE') {
      return (
        <div className="grid grid-cols-2 gap-4">
          {BANKS.map(bank => (
            <button
              key={bank.id}
              onClick={() => startConnection(bank.id)}
              className="flex items-center gap-3 p-4 rounded-xl border border-white/5 hover:border-[#D4AF37]/50 bg-white/5 hover:bg-white/10 transition-all group"
            >
              <div className={`w-10 h-10 rounded-full ${bank.color} text-white flex items-center justify-center font-bold text-xs shadow-lg`}>
                {bank.name.substring(0, 2).toUpperCase()}
              </div>
              <span className="font-bold text-zinc-300 group-hover:text-white text-sm">{bank.name}</span>
            </button>
          ))}
        </div>
      );
    }

    if (status === 'SUCCESS') {
      return (
        <div className="text-center py-8 animate-in fade-in zoom-in">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
            <CheckCircle2 size={40} />
          </div>
          <h4 className="text-xl font-bold text-white">Pomyślnie połączono!</h4>
          <p className="text-zinc-400 mt-2 mb-8 text-sm">Pobrano historię transakcji z ostatnich 12 miesięcy.</p>
          <button onClick={handleCloseModal} className="w-full bg-[#D4AF37] text-black py-3 rounded-xl font-bold hover:bg-[#FCD34D] transition-colors">
            Gotowe
          </button>
        </div>
      );
    }

    // Loading / Connecting States
    const steps = [
      { s: 'CONNECTING', label: 'Nawiązywanie bezpiecznego połączenia (TLS 1.3)...' },
      { s: 'AUTHENTICATING', label: 'Oczekiwanie na autoryzację w aplikacji banku...' },
      { s: 'FETCHING', label: 'Pobieranie historii rachunków i transakcji...' },
    ];

    const currentStepIndex = steps.findIndex(step => step.s === status);

    return (
      <div className="py-8">
        <div className="flex justify-center mb-10">
            <div className="relative">
                <div className="w-24 h-24 border-4 border-white/5 border-t-[#D4AF37] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Lock size={24} className="text-[#D4AF37]" />
                </div>
            </div>
        </div>
        
        <div className="space-y-4 max-w-sm mx-auto">
            {steps.map((step, idx) => (
                <div key={step.s} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border font-bold ${
                        idx < currentStepIndex 
                            ? 'bg-green-500 border-green-500 text-black' 
                            : idx === currentStepIndex 
                                ? 'bg-[#D4AF37] border-[#D4AF37] text-black animate-pulse' 
                                : 'bg-transparent border-white/20 text-zinc-600'
                    }`}>
                        {idx < currentStepIndex ? <CheckCircle2 size={12} /> : idx + 1}
                    </div>
                    <span className={`text-xs ${idx === currentStepIndex ? 'font-bold text-white' : 'text-zinc-500'}`}>
                        {step.label}
                    </span>
                </div>
            ))}
        </div>
        
        <div className="mt-8 bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg flex items-center gap-3 text-xs text-blue-400">
            <ShieldCheck size={16} />
            <p>Połączenie szyfrowane i zgodne ze standardem PSD2.</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex justify-between items-center border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Building className="text-[#D4AF37]" /> Integracje
          </h2>
          <p className="text-zinc-400 mt-1">Zarządzaj połączeniami bankowymi i giełdowymi.</p>
        </div>
      </header>

      {/* Banking Section */}
      <section>
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
          Bankowość (Open Banking)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
             [1, 2].map(i => <div key={i} className="h-40 bg-white/5 rounded-xl animate-pulse" />)
          ) : (
            <>
              {accounts.map(acc => (
                <div key={acc.id} className="neo-card p-6 rounded-2xl relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white font-bold border border-white/10 text-lg">
                            {acc.providerName.substring(0,1)}
                        </div>
                        <div>
                            <p className="font-bold text-white text-sm">{acc.providerName}</p>
                            <p className="text-xs text-zinc-500 font-mono mt-0.5">
                                •••• {acc.accountNumber.slice(-4)}
                            </p>
                        </div>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                      <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Saldo dostępne</p>
                      <p className="text-2xl font-bold text-white font-mono">{acc.balance.toLocaleString()} {acc.currency}</p>
                  </div>
                </div>
              ))}
              
              {/* Add New Bank Button */}
              <button 
                onClick={() => setIsModalOpen(true)}
                className="border border-dashed border-white/10 bg-white/5 rounded-2xl flex flex-col items-center justify-center p-6 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 transition-all text-zinc-500 hover:text-[#D4AF37] h-full min-h-[200px] group"
              >
                <div className="w-14 h-14 bg-black/40 rounded-full flex items-center justify-center mb-4 border border-white/5 group-hover:border-[#D4AF37]/30 transition-colors">
                    <Plus size={24} />
                </div>
                <span className="font-bold text-sm">Połącz nowy bank</span>
                <span className="text-xs mt-1 text-zinc-600">Obsługiwane przez SaltEdge</span>
              </button>
            </>
          )}
        </div>
      </section>

      {/* Crypto Section */}
      <section>
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2 mt-8">
          Web3 & Giełdy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallets.map(wallet => (
            <div key={wallet.id} className="neo-card p-6 rounded-2xl relative overflow-hidden group">
                <div className="flex justify-between items-start mb-6">
                    <div className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">
                        {wallet.provider}
                    </div>
                    <CheckCircle2 size={18} className="text-green-500" />
                </div>
                
                <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Adres / Sieć</p>
                <p className="font-mono text-white mb-6 truncate text-xs bg-black/40 p-2 rounded border border-white/5" title={wallet.address}>
                    {wallet.address}
                </p>
                
                <div className="flex items-end justify-between border-t border-white/10 pt-4">
                    <div>
                        <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Aktywa</p>
                        <p className="text-lg font-bold text-white">{wallet.assetCount} Tokenów</p>
                    </div>
                    <span className="text-[10px] text-zinc-500 bg-white/5 px-2 py-1 rounded border border-white/5 uppercase font-bold">{wallet.chain}</span>
                </div>
            </div>
          ))}

          {/* Connect Web3 Wallet */}
          <button 
            onClick={() => setWeb3ModalOpen(true)}
            className="border border-dashed border-white/10 bg-white/5 rounded-2xl flex flex-col items-center justify-center p-6 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all text-zinc-500 hover:text-orange-500 h-full min-h-[200px] group"
          >
            <div className="w-14 h-14 bg-black/40 rounded-full flex items-center justify-center mb-4 border border-white/5 group-hover:border-orange-500/30 transition-colors">
                <Wallet size={24} />
            </div>
            <span className="font-bold text-sm">Podłącz Portfel Web3</span>
            <span className="text-xs mt-1 text-zinc-600">MetaMask, Ledger, Trezor</span>
          </button>
        </div>
      </section>

      {/* OAuth Simulation Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={status === 'IDLE' ? "Wybierz bank" : "Łączenie z bankiem"}
      >
        {renderModalContent()}
      </Modal>

      {/* Web3 Modal */}
      <Modal isOpen={web3ModalOpen} onClose={() => setWeb3ModalOpen(false)} title="Wybierz Portfel">
          <div className="space-y-4">
              <button onClick={() => handleWeb3Connect('MetaMask')} className="w-full flex items-center gap-4 p-4 border border-white/10 bg-white/5 rounded-xl hover:bg-orange-500/10 hover:border-orange-500/50 transition-colors">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">M</div>
                  <div className="text-left">
                      <h4 className="font-bold text-white">MetaMask</h4>
                      <p className="text-xs text-zinc-400">Browser Extension</p>
                  </div>
              </button>
              <button onClick={() => handleWeb3Connect('Ledger')} className="w-full flex items-center gap-4 p-4 border border-white/10 bg-white/5 rounded-xl hover:bg-white/10 hover:border-white/30 transition-colors">
                  <div className="w-10 h-10 bg-black border border-white/20 rounded-full flex items-center justify-center text-white font-bold">L</div>
                  <div className="text-left">
                      <h4 className="font-bold text-white">Ledger</h4>
                      <p className="text-xs text-zinc-400">Hardware Wallet (USB/BLE)</p>
                  </div>
              </button>
              <button onClick={() => handleWeb3Connect('Trezor')} className="w-full flex items-center gap-4 p-4 border border-white/10 bg-white/5 rounded-xl hover:bg-green-500/10 hover:border-green-500/50 transition-colors">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">T</div>
                  <div className="text-left">
                      <h4 className="font-bold text-white">Trezor</h4>
                      <p className="text-xs text-zinc-400">Hardware Wallet</p>
                  </div>
              </button>
              {connectingWeb3 && (
                  <div className="flex items-center justify-center gap-2 text-sm text-zinc-400 py-2">
                      <Loader2 className="animate-spin text-[#D4AF37]" size={16} /> Podpisywanie wiadomości...
                  </div>
              )}
          </div>
      </Modal>
    </div>
  );
};
