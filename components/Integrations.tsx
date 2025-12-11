
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { BankAccount, CryptoWallet, IntegrationStatus } from '../types';
import { Plus, CheckCircle2, Building, Bitcoin, Loader2, ShieldCheck, Lock, ArrowRight, XCircle, Wallet } from 'lucide-react';
import { Modal } from './ui/Modal';
import { toast } from './ui/Toast';

const BANKS = [
  { id: 'mbank', name: 'mBank', color: 'bg-red-600' },
  { id: 'pko', name: 'PKO BP', color: 'bg-blue-800' },
  { id: 'pekao', name: 'Bank Pekao', color: 'bg-red-700' },
  { id: 'ing', name: 'ING Bank', color: 'bg-orange-600' },
  { id: 'santander', name: 'Santander', color: 'bg-red-700' },
  { id: 'millennium', name: 'Millennium', color: 'bg-pink-700' },
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
    setTimeout(() => setStatus('AUTHENTICATING'), 1500); // Handshake
    setTimeout(() => setStatus('FETCHING'), 3500); // User approved
    setTimeout(() => {
        setStatus('SUCCESS');
        fetchData(); // Refresh list
    }, 5500);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setStatus('IDLE');
    setSelectedBank(null);
  };

  const handleWeb3Connect = async (provider: string) => {
      setConnectingWeb3(true);
      await new Promise(r => setTimeout(r, 2000)); // Simulate signing
      toast.success('Portfel połączony', `Pomyślnie zintegrowano ${provider}.`);
      setConnectingWeb3(false);
      setWeb3ModalOpen(false);
      // In real app, this would add to 'wallets' state
  };

  const renderModalContent = () => {
    if (status === 'IDLE') {
      return (
        <div className="grid grid-cols-2 gap-4">
          {BANKS.map(bank => (
            <button
              key={bank.id}
              onClick={() => startConnection(bank.id)}
              className="flex items-center gap-3 p-4 rounded-xl border border-slate-700 hover:border-indigo-500 hover:bg-slate-800 transition-all group bg-slate-900"
            >
              <div className={`w-10 h-10 rounded-full ${bank.color} text-white flex items-center justify-center font-bold text-xs shadow-sm`}>
                {bank.name.substring(0, 2).toUpperCase()}
              </div>
              <span className="font-medium text-slate-300 group-hover:text-white">{bank.name}</span>
            </button>
          ))}
        </div>
      );
    }

    if (status === 'SUCCESS') {
      return (
        <div className="text-center py-8 animate-in fade-in zoom-in">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
            <CheckCircle2 size={40} />
          </div>
          <h4 className="text-xl font-bold text-white">Pomyślnie połączono!</h4>
          <p className="text-slate-400 mt-2 mb-6">Pobrano historię transakcji z ostatnich 12 miesięcy.</p>
          <button onClick={handleCloseModal} className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-700 border border-slate-700">
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
        <div className="flex justify-center mb-8">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-indigo-900 border-t-indigo-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Lock size={24} className="text-indigo-500" />
                </div>
            </div>
        </div>
        
        <div className="space-y-4 max-w-sm mx-auto">
            {steps.map((step, idx) => (
                <div key={step.s} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
                        idx < currentStepIndex 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : idx === currentStepIndex 
                                ? 'bg-indigo-600 border-indigo-600 text-white animate-pulse' 
                                : 'bg-slate-800 border-slate-700 text-slate-500'
                    }`}>
                        {idx < currentStepIndex ? <CheckCircle2 size={14} /> : idx + 1}
                    </div>
                    <span className={`text-sm ${idx === currentStepIndex ? 'font-bold text-white' : 'text-slate-500'}`}>
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
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Integracje</h2>
          <p className="text-slate-400">Zarządzaj połączeniami bankowymi i giełdowymi.</p>
        </div>
      </header>

      {/* Banking Section */}
      <section>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Building className="text-slate-400" /> Bankowość (Open Banking)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
             [1, 2].map(i => <div key={i} className="h-40 bg-slate-800/50 rounded-xl animate-pulse" />)
          ) : (
            <>
              {accounts.map(acc => (
                <div key={acc.id} className="glass-card p-6 rounded-xl relative overflow-hidden group hover:shadow-indigo-500/10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-300 font-bold border border-slate-700">
                            {acc.providerName.substring(0,1)}
                        </div>
                        <div>
                            <p className="font-bold text-white text-sm">{acc.providerName}</p>
                            <p className="text-xs text-slate-400">**** {acc.accountNumber.slice(-4)}</p>
                        </div>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                      <p className="text-slate-500 text-xs mb-1">Saldo dostępne</p>
                      <p className="text-xl font-bold text-white">{acc.balance.toLocaleString()} {acc.currency}</p>
                  </div>
                </div>
              ))}
              
              {/* Add New Bank Button */}
              <button 
                onClick={() => setIsModalOpen(true)}
                className="border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center p-6 hover:border-indigo-500 hover:bg-indigo-500/5 transition-all text-slate-500 hover:text-indigo-400 h-full min-h-[200px]"
              >
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3">
                    <Plus size={24} className="text-slate-400" />
                </div>
                <span className="font-medium">Połącz nowy bank</span>
                <span className="text-xs mt-1 text-slate-600">Obsługiwane przez SaltEdge</span>
              </button>
            </>
          )}
        </div>
      </section>

      {/* Crypto Section */}
      <section>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Bitcoin className="text-slate-400" /> Web3 & Giełdy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallets.map(wallet => (
            <div key={wallet.id} className="glass-card p-6 rounded-xl text-white relative overflow-hidden group hover:border-indigo-500/50">
                <div className="flex justify-between items-start mb-4">
                <div className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-bold">
                    {wallet.provider}
                </div>
                <CheckCircle2 size={18} className="text-green-500" />
                </div>
                <p className="text-slate-400 text-sm mb-1">Adres / Sieć</p>
                <p className="font-mono text-white mb-4 truncate text-sm bg-black/20 p-2 rounded" title={wallet.address}>{wallet.address}</p>
                <div className="flex items-end justify-between">
                <div>
                    <p className="text-slate-400 text-sm mb-1">Aktywa</p>
                    <p className="text-xl font-bold text-white">{wallet.assetCount} Tokenów</p>
                </div>
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">{wallet.chain}</span>
                </div>
            </div>
          ))}

          {/* Connect Web3 Wallet */}
          <button 
            onClick={() => setWeb3ModalOpen(true)}
            className="border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center p-6 hover:border-orange-500 hover:bg-orange-500/5 transition-all text-slate-500 hover:text-orange-500 h-full min-h-[200px]"
          >
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3">
                <Wallet size={24} className="text-slate-400" />
            </div>
            <span className="font-medium">Podłącz Portfel Web3</span>
            <span className="text-xs mt-1 text-slate-600">MetaMask, Ledger, Trezor</span>
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
              <button onClick={() => handleWeb3Connect('MetaMask')} className="w-full flex items-center gap-4 p-4 border border-slate-700 rounded-xl hover:bg-orange-500/10 hover:border-orange-500/50 transition-colors bg-slate-900">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">M</div>
                  <div className="text-left">
                      <h4 className="font-bold text-white">MetaMask</h4>
                      <p className="text-xs text-slate-400">Browser Extension</p>
                  </div>
              </button>
              <button onClick={() => handleWeb3Connect('Ledger')} className="w-full flex items-center gap-4 p-4 border border-slate-700 rounded-xl hover:bg-slate-800 hover:border-slate-500 transition-colors bg-slate-900">
                  <div className="w-10 h-10 bg-black border border-slate-700 rounded-full flex items-center justify-center text-white font-bold">L</div>
                  <div className="text-left">
                      <h4 className="font-bold text-white">Ledger</h4>
                      <p className="text-xs text-slate-400">Hardware Wallet (USB/BLE)</p>
                  </div>
              </button>
              <button onClick={() => handleWeb3Connect('Trezor')} className="w-full flex items-center gap-4 p-4 border border-slate-700 rounded-xl hover:bg-green-500/10 hover:border-green-500/50 transition-colors bg-slate-900">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">T</div>
                  <div className="text-left">
                      <h4 className="font-bold text-white">Trezor</h4>
                      <p className="text-xs text-slate-400">Hardware Wallet</p>
                  </div>
              </button>
              {connectingWeb3 && (
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-400 py-2">
                      <Loader2 className="animate-spin text-indigo-500" size={16} /> Podpisywanie wiadomości...
                  </div>
              )}
          </div>
      </Modal>
    </div>
  );
};
