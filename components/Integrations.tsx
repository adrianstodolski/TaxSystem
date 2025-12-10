
import React, { useEffect, useState } from 'react';
import { NuffiService } from '../services/api';
import { BankAccount, CryptoWallet, IntegrationStatus } from '../types';
import { Plus, CheckCircle2, Building, Bitcoin, Loader2, ShieldCheck, Lock, ArrowRight, XCircle, Wallet } from 'lucide-react';
import { Modal } from './ui/Modal';
import { toast } from './ui/Toast';

const BANKS = [
  { id: 'mbank', name: 'mBank', color: 'bg-red-500' },
  { id: 'pko', name: 'PKO BP', color: 'bg-blue-800' },
  { id: 'pekao', name: 'Bank Pekao', color: 'bg-red-700' },
  { id: 'ing', name: 'ING Bank', color: 'bg-orange-500' },
  { id: 'santander', name: 'Santander', color: 'bg-red-600' },
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
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
            >
              <div className={`w-10 h-10 rounded-full ${bank.color} text-white flex items-center justify-center font-bold text-xs shadow-sm`}>
                {bank.name.substring(0, 2).toUpperCase()}
              </div>
              <span className="font-medium text-gray-700 group-hover:text-indigo-700">{bank.name}</span>
            </button>
          ))}
        </div>
      );
    }

    if (status === 'SUCCESS') {
      return (
        <div className="text-center py-8 animate-in fade-in zoom-in">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={40} />
          </div>
          <h4 className="text-xl font-bold text-gray-900">Pomyślnie połączono!</h4>
          <p className="text-gray-500 mt-2 mb-6">Pobrano historię transakcji z ostatnich 12 miesięcy.</p>
          <button onClick={handleCloseModal} className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800">
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
                <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Lock size={24} className="text-indigo-600" />
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
                                : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                        {idx < currentStepIndex ? <CheckCircle2 size={14} /> : idx + 1}
                    </div>
                    <span className={`text-sm ${idx === currentStepIndex ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                        {step.label}
                    </span>
                </div>
            ))}
        </div>
        
        <div className="mt-8 bg-blue-50 p-3 rounded-lg flex items-center gap-3 text-xs text-blue-700">
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
          <h2 className="text-2xl font-bold text-gray-900">Integracje</h2>
          <p className="text-gray-500">Zarządzaj połączeniami bankowymi i giełdowymi.</p>
        </div>
      </header>

      {/* Banking Section */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Building className="text-gray-400" /> Bankowość (Open Banking)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
             [1, 2].map(i => <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse" />)
          ) : (
            <>
              {accounts.map(acc => (
                <div key={acc.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 font-bold">
                            {acc.providerName.substring(0,1)}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-sm">{acc.providerName}</p>
                            <p className="text-xs text-gray-500">**** {acc.accountNumber.slice(-4)}</p>
                        </div>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                      <p className="text-gray-500 text-xs mb-1">Saldo dostępne</p>
                      <p className="text-xl font-bold text-gray-900">{acc.balance.toLocaleString()} {acc.currency}</p>
                  </div>
                </div>
              ))}
              
              {/* Add New Bank Button */}
              <button 
                onClick={() => setIsModalOpen(true)}
                className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-gray-500 hover:text-indigo-600 h-full min-h-[200px]"
              >
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                    <Plus size={24} />
                </div>
                <span className="font-medium">Połącz nowy bank</span>
                <span className="text-xs mt-1 text-gray-400">Obsługiwane przez SaltEdge</span>
              </button>
            </>
          )}
        </div>
      </section>

      {/* Crypto Section */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Bitcoin className="text-gray-400" /> Web3 & Giełdy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallets.map(wallet => (
            <div key={wallet.id} className="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800 text-white relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                <div className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-bold">
                    {wallet.provider}
                </div>
                <CheckCircle2 size={18} className="text-green-500" />
                </div>
                <p className="text-slate-400 text-sm mb-1">Adres / Sieć</p>
                <p className="font-mono text-white mb-4 truncate" title={wallet.address}>{wallet.address}</p>
                <div className="flex items-end justify-between">
                <div>
                    <p className="text-slate-400 text-sm mb-1">Aktywa</p>
                    <p className="text-xl font-bold text-white">{wallet.assetCount} Tokenów</p>
                </div>
                <span className="text-xs text-slate-500 uppercase">{wallet.chain}</span>
                </div>
            </div>
          ))}

          {/* Connect Web3 Wallet */}
          <button 
            onClick={() => setWeb3ModalOpen(true)}
            className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-6 hover:border-orange-500 hover:bg-orange-50 transition-all text-gray-500 hover:text-orange-600 h-full min-h-[200px]"
          >
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                <Wallet size={24} />
            </div>
            <span className="font-medium">Podłącz Portfel Web3</span>
            <span className="text-xs mt-1 text-gray-400">MetaMask, Ledger, Trezor</span>
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
              <button onClick={() => handleWeb3Connect('MetaMask')} className="w-full flex items-center gap-4 p-4 border rounded-xl hover:bg-orange-50 hover:border-orange-200 transition-colors">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">M</div>
                  <div className="text-left">
                      <h4 className="font-bold text-slate-900">MetaMask</h4>
                      <p className="text-xs text-slate-500">Browser Extension</p>
                  </div>
              </button>
              <button onClick={() => handleWeb3Connect('Ledger')} className="w-full flex items-center gap-4 p-4 border rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors">
                  <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold">L</div>
                  <div className="text-left">
                      <h4 className="font-bold text-slate-900">Ledger</h4>
                      <p className="text-xs text-slate-500">Hardware Wallet (USB/BLE)</p>
                  </div>
              </button>
              <button onClick={() => handleWeb3Connect('Trezor')} className="w-full flex items-center gap-4 p-4 border rounded-xl hover:bg-green-50 hover:border-green-200 transition-colors">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">T</div>
                  <div className="text-left">
                      <h4 className="font-bold text-slate-900">Trezor</h4>
                      <p className="text-xs text-slate-500">Hardware Wallet</p>
                  </div>
              </button>
              {connectingWeb3 && (
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500 py-2">
                      <Loader2 className="animate-spin" size={16} /> Podpisywanie wiadomości...
                  </div>
              )}
          </div>
      </Modal>
    </div>
  );
};
