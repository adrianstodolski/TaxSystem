
import React, { useEffect, useState } from 'react';
import { User, Shield, Briefcase, Save, Loader2, Building, Bitcoin, Info, AlertTriangle, Monitor, Smartphone, Globe, Users, Plus, Mail, Key, Server, Lock, CheckCircle2 } from 'lucide-react';
import { UserProfile, TaxOffice, TaxationForm, AuditEntry, TeamMember, UserRole, ApiVaultStatus, ApiProvider } from '../types';
import { NuffiService } from '../services/api';
import { toast } from './ui/Toast';
import { Modal } from './ui/Modal';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'TAX' | 'SECURITY' | 'CRYPTO' | 'TEAM' | 'VAULT'>('VAULT'); // Default to Vault to show keys
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [taxOffices, setTaxOffices] = useState<TaxOffice[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [apiStatus, setApiStatus] = useState<ApiVaultStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Invite Modal
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('VIEWER');
  const [sendingInvite, setSendingInvite] = useState(false);

  // API Key Modal
  const [apiModalOpen, setApiModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ApiProvider | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const [user, offices, logs, teamMembers, apis] = await Promise.all([
        NuffiService.fetchUserProfile(),
        NuffiService.fetchTaxOffices(),
        NuffiService.fetchAuditLogs(),
        NuffiService.fetchTeamMembers(),
        NuffiService.fetchApiVaultStatus()
      ]);
      setProfile(user);
      setTaxOffices(offices);
      setAuditLogs(logs);
      setTeam(teamMembers);
      setApiStatus(apis);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    await NuffiService.updateUserProfile(profile);
    setSaving(false);
    toast.success('Zapisano zmiany', 'Twój profil podatkowy został zaktualizowany.');
  };

  const handleInvite = async () => {
      if(!inviteEmail) return;
      setSendingInvite(true);
      await NuffiService.inviteTeamMember(inviteEmail, inviteRole);
      setSendingInvite(false);
      setInviteModalOpen(false);
      setInviteEmail('');
      toast.success('Zaproszenie wysłane', `Użytkownik ${inviteEmail} otrzymał dostęp.`);
      const t = await NuffiService.fetchTeamMembers();
      setTeam([...t, { id: 'new', firstName: 'Zaproszony', lastName: 'Użytkownik', email: inviteEmail, role: inviteRole, status: 'PENDING', lastActive: '-' }]);
  };

  const handleUpdateApiKey = async () => {
      if(!selectedProvider) return;
      setSaving(true);
      await NuffiService.updateApiKey(selectedProvider, apiKeyInput);
      setSaving(false);
      setApiModalOpen(false);
      setApiKeyInput('');
      toast.success('Klucz API zaktualizowany', `Integracja z ${selectedProvider} jest aktywna.`);
      const apis = await NuffiService.fetchApiVaultStatus();
      setApiStatus(apis);
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  const getRoleBadge = (role: UserRole) => {
      switch(role) {
          case 'ADMIN': return 'bg-purple-100 text-purple-700';
          case 'ACCOUNTANT': return 'bg-green-100 text-green-700';
          case 'ANALYST': return 'bg-blue-100 text-blue-700';
          default: return 'bg-gray-100 text-gray-700';
      }
  };

  const openApiKeyModal = (provider: ApiProvider) => {
      setSelectedProvider(provider);
      setApiKeyInput('');
      setApiModalOpen(true);
  };

  if (loading) return <div className="p-8"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      <header>
        <h2 className="text-2xl font-bold text-gray-900">Ustawienia Konta</h2>
        <p className="text-gray-500">Zarządzaj swoimi danymi, rezydencją podatkową i bezpieczeństwem.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="space-y-2">
          <button
            onClick={() => setActiveTab('PROFILE')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'PROFILE' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <User size={18} /> Profil
          </button>
          <button
            onClick={() => setActiveTab('VAULT')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'VAULT' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Key size={18} /> API Vault (Secrets)
          </button>
          <button
            onClick={() => setActiveTab('TEAM')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'TEAM' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users size={18} /> Zespół
          </button>
          <button
            onClick={() => setActiveTab('TAX')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'TAX' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Briefcase size={18} /> Dane Podatkowe
          </button>
          <button
            onClick={() => setActiveTab('CRYPTO')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'CRYPTO' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Bitcoin size={18} /> Giełda & Krypto
          </button>
          <button
            onClick={() => setActiveTab('SECURITY')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'SECURITY' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Shield size={18} /> Bezpieczeństwo
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 bg-white p-8 rounded-2xl shadow-sm border border-gray-200 min-h-[500px]">
          {activeTab === 'PROFILE' && profile && (
            <div className="space-y-6 animate-in fade-in">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-4">Dane Osobowe</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Imię</label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nazwisko</label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adres E-mail</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'VAULT' && (
              <div className="space-y-6 animate-in fade-in">
                  <div className="border-b pb-4 mb-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <Lock className="text-indigo-600" size={20} />
                          Nuffi API Vault
                      </h3>
                      <p className="text-sm text-gray-500">
                          Bezpieczny magazyn kluczy API. Te klucze aktywują funkcje Enterprise (Banking, Crypto Analytics, KYC).
                          Twoje klucze są obecnie aktywne i zabezpieczone.
                      </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                      {Object.values(ApiProvider).map(provider => {
                          const status = apiStatus.find(s => s.provider === provider);
                          return (
                              <div key={provider} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                  <div className="flex items-center gap-4">
                                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${status?.isConnected ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                                          <Server size={20} />
                                      </div>
                                      <div>
                                          <h4 className="font-bold text-gray-900">{provider}</h4>
                                          {status?.isConnected ? (
                                              <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                                                  <CheckCircle2 size={12} /> Aktywny
                                                  <span className="text-gray-400">|</span>
                                                  <span className="text-gray-500 text-[10px] uppercase tracking-wide">{status.featuresUnlocked.join(', ')}</span>
                                              </div>
                                          ) : (
                                              <p className="text-xs text-gray-500">Nie skonfigurowano</p>
                                          )}
                                      </div>
                                  </div>
                                  <button 
                                    onClick={() => openApiKeyModal(provider)}
                                    className="text-xs font-bold bg-white border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 text-gray-700"
                                  >
                                      {status?.isConnected ? 'Edytuj' : 'Konfiguruj'}
                                  </button>
                              </div>
                          );
                      })}
                  </div>
              </div>
          )}

          {/* ... other tabs (TEAM, TAX, CRYPTO, SECURITY) remain the same ... */}
          {activeTab === 'TEAM' && (
              <div className="space-y-6 animate-in fade-in">
                  <div className="flex justify-between items-center border-b pb-4">
                      <div>
                          <h3 className="text-lg font-bold text-gray-900">Zarządzanie Zespołem</h3>
                          <p className="text-sm text-gray-500">Zaproś księgowych i pracowników do konta.</p>
                      </div>
                      <button 
                        onClick={() => setInviteModalOpen(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 flex items-center gap-2"
                      >
                          <Plus size={16} /> Zaproś
                      </button>
                  </div>

                  <div className="overflow-hidden border border-gray-200 rounded-xl">
                      <table className="w-full text-sm text-left">
                          <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                              <tr>
                                  <th className="px-6 py-3 font-medium">Użytkownik</th>
                                  <th className="px-6 py-3 font-medium">Rola</th>
                                  <th className="px-6 py-3 font-medium">Status</th>
                                  <th className="px-6 py-3 font-medium text-right">Ost. aktywność</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                              {team.map(member => (
                                  <tr key={member.id} className="hover:bg-gray-50">
                                      <td className="px-6 py-4">
                                          <div className="flex items-center gap-3">
                                              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                                  {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                                              </div>
                                              <div>
                                                  <p className="font-bold text-gray-900">{member.firstName} {member.lastName}</p>
                                                  <p className="text-xs text-gray-500">{member.email}</p>
                                              </div>
                                          </div>
                                      </td>
                                      <td className="px-6 py-4">
                                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border border-transparent ${getRoleBadge(member.role)}`}>
                                              {member.role}
                                          </span>
                                      </td>
                                      <td className="px-6 py-4">
                                          {member.status === 'ACTIVE' && <span className="text-green-600 text-xs font-bold flex items-center gap-1"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Aktywny</span>}
                                          {member.status === 'PENDING' && <span className="text-amber-600 text-xs font-bold flex items-center gap-1"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div> Zaproszony</span>}
                                          {member.status === 'LOCKED' && <span className="text-red-600 text-xs font-bold flex items-center gap-1"><div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div> Zablokowany</span>}
                                      </td>
                                      <td className="px-6 py-4 text-right text-gray-500 font-mono text-xs">
                                          {member.lastActive}
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          )}

          {activeTab === 'TAX' && profile && (
            <div className="space-y-6 animate-in fade-in">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-4">Konfiguracja Podatkowa</h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PESEL</label>
                    <input
                      type="text"
                      value={profile.pesel}
                      onChange={(e) => handleChange('pesel', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">NIP</label>
                    <input
                      type="text"
                      value={profile.nip}
                      onChange={(e) => handleChange('nip', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Właściwy Urząd Skarbowy</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select
                      value={profile.taxOfficeCode}
                      onChange={(e) => handleChange('taxOfficeCode', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-white"
                    >
                      {taxOffices.map((office) => (
                        <option key={office.code} value={office.code}>
                          {office.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Forma Opodatkowania (2024)</label>
                  <select
                    value={profile.taxationForm}
                    onChange={(e) => handleChange('taxationForm', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    {Object.values(TaxationForm).map((form) => (
                      <option key={form} value={form}>
                        {form}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    Zmiana formy opodatkowania jest możliwa tylko do 20 dnia miesiąca następującego po miesiącu, w którym osiągnięto pierwszy przychód.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'CRYPTO' && profile && (
            <div className="space-y-6 animate-in fade-in">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-4">Strategia Giełdowa (Zyski Kapitałowe)</h3>
              
              <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-blue-800 text-sm mb-4">
                  <Info className="shrink-0" />
                  <p>Wybór metody rozliczania kosztów uzyskania przychodu ma kluczowy wpływ na wysokość podatku. Zalecana metoda w Polsce to FIFO (First In, First Out).</p>
              </div>

              <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Metoda kolejkowania (Inventory Method)</label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['FIFO', 'LIFO', 'HIFO'].map((method) => (
                       <button
                         key={method}
                         onClick={() => handleChange('cryptoStrategy', method)}
                         className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                            profile.cryptoStrategy === method 
                            ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                            : 'border-gray-200 hover:border-indigo-300'
                         }`}
                       >
                         {profile.cryptoStrategy === method && (
                             <div className="absolute top-2 right-2 text-indigo-600">
                                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                             </div>
                         )}
                         <div className="font-bold text-gray-900">{method}</div>
                         <div className="text-xs text-gray-500 mt-1">
                            {method === 'FIFO' ? 'Pierwsze weszło, pierwsze wyszło' : method === 'LIFO' ? 'Ostatnie weszło, pierwsze wyszło' : 'Najdroższe wyszło pierwsze'}
                         </div>
                       </button>
                    ))}
                  </div>
              </div>

              <div className="mt-6 border-t pt-6">
                <h4 className="font-bold text-gray-800 mb-2">Automatyczna integracja API</h4>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-100 p-2 rounded text-orange-600">
                            <Bitcoin size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-sm">Binance / Coinbase / Kraken</p>
                            <p className="text-xs text-gray-500">Import transakcji w czasie rzeczywistym</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked readOnly />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'SECURITY' && (
            <div className="space-y-8 animate-in fade-in">
              <div>
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-4 mb-4">Bezpieczeństwo Konta</h3>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                    <Shield className="text-amber-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-amber-800">Uwierzytelnianie dwuskładnikowe (2FA)</h4>
                      <p className="text-sm text-amber-700 mt-1">Zalecamy włączenie 2FA dla dodatkowej ochrony danych finansowych.</p>
                      <button className="mt-3 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-amber-700 transition-colors">
                        Włącz 2FA
                      </button>
                    </div>
                  </div>
              </div>

              <div>
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-4 mb-4">Dziennik Zdarzeń (Audit Log)</h3>
                  <div className="overflow-hidden border border-gray-200 rounded-xl">
                      <table className="w-full text-sm text-left">
                          <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                              <tr>
                                  <th className="px-4 py-3 font-medium">Akcja</th>
                                  <th className="px-4 py-3 font-medium">Data</th>
                                  <th className="px-4 py-3 font-medium">IP / Urządzenie</th>
                                  <th className="px-4 py-3 font-medium text-right">Status</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                              {auditLogs.map(log => (
                                  <tr key={log.id} className="hover:bg-gray-50">
                                      <td className="px-4 py-3 font-medium text-gray-900">{log.action}</td>
                                      <td className="px-4 py-3 text-gray-500">{log.date}</td>
                                      <td className="px-4 py-3 text-gray-500">
                                          <div className="flex flex-col text-xs">
                                              <span className="flex items-center gap-1"><Globe size={10} /> {log.ip}</span>
                                              <span className="flex items-center gap-1"><Monitor size={10} /> {log.device}</span>
                                          </div>
                                      </td>
                                      <td className="px-4 py-3 text-right">
                                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                                              log.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                          }`}>
                                              {log.status === 'FAILURE' && <AlertTriangle size={10} />}
                                              {log.status}
                                          </span>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
          )}

          {activeTab !== 'SECURITY' && activeTab !== 'TEAM' && activeTab !== 'VAULT' && (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
                >
                  {saving ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Zapisz zmiany</>}
                </button>
              </div>
          )}
        </div>
      </div>

      {/* API Key Modal */}
      <Modal isOpen={apiModalOpen} onClose={() => setApiModalOpen(false)} title={`Konfiguracja: ${selectedProvider}`}>
          <div className="space-y-4">
              <p className="text-sm text-gray-500">
                  Wprowadź klucz API (Secret/Token) dla dostawcy <strong>{selectedProvider}</strong>. 
                  Klucz zostanie bezpiecznie przechowany w Nuffi Vault.
              </p>
              
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">API Key / Secret</label>
                  <input 
                    type="password"
                    value={apiKeyInput}
                    onChange={e => setApiKeyInput(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Wklej swój klucz tutaj..."
                  />
              </div>

              <div className="bg-amber-50 p-3 rounded-lg flex gap-2 text-xs text-amber-800">
                  <AlertTriangle size={16} className="shrink-0" />
                  <p>Nigdy nie udostępniaj klucza osobom trzecim. Nuffi używa szyfrowania AES-256 do przechowywania Twoich sekretów.</p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                  <button onClick={() => setApiModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-bold">Anuluj</button>
                  <button 
                    onClick={handleUpdateApiKey}
                    disabled={!apiKeyInput}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700"
                  >
                      {saving ? <Loader2 className="animate-spin" size={16} /> : 'Zapisz Klucz'}
                  </button>
              </div>
          </div>
      </Modal>
    </div>
  );
};
