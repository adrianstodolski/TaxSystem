
import React, { useState, useEffect } from 'react';
// Assuming App.tsx is in components/, these should be sibling imports
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { Integrations } from './Integrations';
import { TaxCommandCenter } from './TaxCommandCenter';
import { Documents } from './Documents';
import { Settings } from './Settings';
import { CryptoHub } from './CryptoHub';
import { Treasury } from './Treasury';
import { Wealth } from './Wealth';
import { Reports } from './Reports';
import { Auth } from './Auth';
import { Toaster } from './ui/Toast';
import { NotificationCenter } from './NotificationCenter';
import { AIChat } from './AIChat';
import { ViewState, SubscriptionPlan, UserProfile, Workspace } from '../types';
import { Menu, Search, Command } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../store/useStore';

// Global Search & Modals
import { GlobalSearch } from './GlobalSearch';
import { WelcomeModal } from './WelcomeModal';

// Modules
import { PredictiveTax } from './PredictiveTax';
import { RiskCenter } from './RiskCenter';
import { ESG } from './ESG';
import { MarketIntel } from './MarketIntel';
import { Ledgerverse } from './Ledgerverse';
import { WarRoom } from './WarRoom';
import { WalletCommand } from './WalletCommand';
import { YapilyConnect } from './YapilyConnect';
import { NuffiPay } from './NuffiPay';
import { Cards } from './Cards';
import { Subscriptions } from './Subscriptions';
import { SmartTreasury } from './SmartTreasury';
import { Loans } from './Loans';
import { Derivatives } from './Derivatives';
import { Bonds } from './Bonds';
import { RealEstate } from './RealEstate';
import { DeFiArcheology } from './DeFiArcheology';
import { WhaleWatcher } from './WhaleWatcher';
import { YieldScout } from './YieldScout';
import { TokenScanner } from './TokenScanner';
import { GeneralLedger } from './GeneralLedger';
import { TaxOptimizer } from './TaxOptimizer';
import { TaxAuditDefender } from './TaxAuditDefender';
import { AuditSnapshots } from './AuditSnapshots';
import { Contractors } from './Contractors';
import { Projects } from './Projects';
import { Payroll } from './Payroll';
import { Warehouse } from './Warehouse';
import { Vehicles } from './Vehicles';
import { BusinessTravel } from './BusinessTravel';
import { Ecommerce } from './Ecommerce';
import { Contracts } from './Contracts';
import { Marketplace } from './Marketplace';
import { DevPortal } from './DevPortal';
import { SystemStatus } from './SystemStatus';
import { HelpCenter } from './HelpCenter';
import { DesignSystemPreview } from './DesignSystemPreview';
import { DesignLabTest } from './DesignLabTest';
import { Assets } from './Assets';
import { Budgeting } from './Budgeting';
import { DataExport } from './DataExport';
import { B2BNetwork } from './B2BNetwork';
import { InternationalTax } from './InternationalTax';
import { AiClassifier } from './AiClassifier';
import { SmartRules } from './SmartRules';
import { ImportWizard } from './ImportWizard';
import { TimeTracker } from './TimeTracker';
import { Mailbox } from './Mailbox';
import { PriceCalculator } from './PriceCalculator';
import { DebtCollector } from './DebtCollector';
import { CapTable } from './CapTable';
import { CashRegister } from './CashRegister';
import { History } from './History';
import { Dividends } from './Dividends';
import { Forensics } from './Forensics';
import { GlobalTax } from './GlobalTax';
import { AccountantDashboard } from './AccountantDashboard';
import { ScenarioPlanner } from './ScenarioPlanner';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>(SubscriptionPlan.FREE);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  
  const { activeWorkspace } = useStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
      const handleOpenWelcome = () => setWelcomeOpen(true);
      window.addEventListener('nuffi:open-welcome', handleOpenWelcome);
      return () => window.removeEventListener('nuffi:open-welcome', handleOpenWelcome);
  }, []);

  // Sync View with Workspace Switch
  useEffect(() => {
      if (activeWorkspace === Workspace.WALLET) {
          // If switching TO Wallet workspace, default to Wallet Dashboard
          setCurrentView(ViewState.WALLET_DASHBOARD);
      } else {
          // Otherwise default to main Dashboard
          setCurrentView(ViewState.DASHBOARD);
      }
  }, [activeWorkspace]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogin = (token: string, plan: SubscriptionPlan, user: UserProfile) => {
      setIsAuthenticated(true);
      setCurrentPlan(plan);
      setCurrentUser(user);
      setTimeout(() => setWelcomeOpen(true), 1000);
  };

  const renderContent = () => {
    // Handling Wallet Views via Wrapper to pass 'view' prop
    if (
        currentView === ViewState.WALLET_DASHBOARD ||
        currentView === ViewState.WALLET_SEND ||
        currentView === ViewState.WALLET_RECEIVE ||
        currentView === ViewState.WALLET_SWAP ||
        currentView === ViewState.WALLET_BRIDGE ||
        currentView === ViewState.WALLET_DEVICE
    ) {
        return (
            <motion.div
                key="wallet-command"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
            >
                <WalletCommand view={currentView} />
            </motion.div>
        );
    }

    let Component;
    switch (currentView) {
        // --- INVESTOR WORKSPACE ---
        case ViewState.DASHBOARD: Component = Dashboard; break;
        case ViewState.WAR_ROOM: Component = WarRoom; break;
        case ViewState.CRYPTO_HUB: Component = CryptoHub; break;
        case ViewState.WEALTH: Component = Wealth; break;
        case ViewState.LEDGERVERSE: Component = Ledgerverse; break;
        case ViewState.YIELD_SCOUT: Component = YieldScout; break;
        case ViewState.DEFI_ARCHEOLOGY: Component = DeFiArcheology; break;
        case ViewState.WHALE_WATCHER: Component = WhaleWatcher; break;
        case ViewState.TOKEN_SCANNER: Component = TokenScanner; break;
        case ViewState.DERIVATIVES: Component = Derivatives; break;
        case ViewState.BONDS: Component = Bonds; break;
        case ViewState.REAL_ESTATE: Component = RealEstate; break;
        case ViewState.TAX_ENGINE: 
        case ViewState.TAX_WIZARD: 
            Component = TaxCommandCenter; 
            break;
        case ViewState.DIVIDENDS: Component = Dividends; break;
        case ViewState.FORENSICS: Component = Forensics; break;
        case ViewState.GLOBAL_TAX: Component = GlobalTax; break;
        case ViewState.FOREX: 
        case ViewState.TREASURY: Component = Treasury; break;
        case ViewState.COMMODITIES: Component = Wealth; break;
        
        // Business
        case ViewState.DOCUMENTS: Component = Documents; break;
        case ViewState.PREDICTIVE_TAX: Component = PredictiveTax; break;
        case ViewState.RISK_CENTER: Component = RiskCenter; break;
        case ViewState.ESG: Component = ESG; break;
        case ViewState.MARKET_INTEL: Component = MarketIntel; break;
        case ViewState.YAPILY_CONNECT: Component = YapilyConnect; break;
        case ViewState.SMART_TREASURY: Component = SmartTreasury; break;
        case ViewState.NUFFI_PAY: Component = NuffiPay; break;
        case ViewState.CARDS: Component = Cards; break;
        case ViewState.SUBSCRIPTIONS: Component = Subscriptions; break;
        case ViewState.LOANS: Component = Loans; break;
        case ViewState.GENERAL_LEDGER: Component = GeneralLedger; break;
        case ViewState.TAX_OPTIMIZER: 
        case ViewState.TAX_OPTIMIZER_PRO: Component = TaxOptimizer; break;
        case ViewState.AUDIT_DEFENDER: Component = TaxAuditDefender; break;
        case ViewState.REPORTS: Component = Reports; break;
        case ViewState.AUDIT_SNAPSHOTS: Component = AuditSnapshots; break;
        case ViewState.CONTRACTORS: Component = Contractors; break;
        case ViewState.PROJECTS: Component = Projects; break;
        case ViewState.PAYROLL: Component = Payroll; break;
        case ViewState.WAREHOUSE: Component = Warehouse; break;
        case ViewState.VEHICLES: Component = Vehicles; break;
        case ViewState.BUSINESS_TRAVEL: Component = BusinessTravel; break;
        case ViewState.ECOMMERCE: Component = Ecommerce; break;
        case ViewState.CONTRACTS: Component = Contracts; break;
        case ViewState.MARKETPLACE: Component = Marketplace; break;
        case ViewState.ASSETS: Component = Assets; break;
        case ViewState.BUDGETS: Component = Budgeting; break;
        case ViewState.EXPORT: Component = DataExport; break;
        case ViewState.B2B_NETWORK: Component = B2BNetwork; break;
        case ViewState.INTERNATIONAL: Component = InternationalTax; break;
        case ViewState.AI_CLASSIFIER: Component = AiClassifier; break;
        case ViewState.SMART_RULES: Component = SmartRules; break;
        case ViewState.IMPORT_WIZARD: Component = ImportWizard; break;
        case ViewState.TIME_TRACKER: Component = TimeTracker; break;
        case ViewState.MAILBOX: Component = Mailbox; break;
        case ViewState.PRICE_CALCULATOR: Component = PriceCalculator; break;
        case ViewState.DEBT_COLLECTOR: Component = DebtCollector; break;
        case ViewState.CAP_TABLE: Component = CapTable; break;
        case ViewState.CASH_REGISTER: Component = CashRegister; break;
        case ViewState.HISTORY: Component = History; break;
        case ViewState.ACCOUNTANT_DASHBOARD: Component = AccountantDashboard; break;
        case ViewState.SCENARIOS: Component = ScenarioPlanner; break;

        // Shared
        case ViewState.SETTINGS: Component = Settings; break;
        case ViewState.DEV_PORTAL: Component = DevPortal; break;
        case ViewState.SYSTEM_STATUS: Component = SystemStatus; break;
        case ViewState.HELP_CENTER: Component = HelpCenter; break;
        case ViewState.INTEGRATIONS: Component = Integrations; break;
        case ViewState.NOTIFICATIONS: Component = Dashboard; break;
        case ViewState.DESIGN_SYSTEM: Component = DesignSystemPreview; break;
        case ViewState.DESIGN_LAB_TEST: Component = DesignLabTest; break;

        default: Component = Dashboard;
    }

    return (
        <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full h-full"
        >
            <Component onNavigate={setCurrentView} />
        </motion.div>
    );
  };

  if (!isAuthenticated) {
      return (
          <>
            <Auth onLogin={handleLogin} />
            <Toaster />
          </>
      );
  }

  return (
    <div className="flex min-h-screen font-sans bg-[#050505] text-[#E1E1E3] overflow-hidden relative selection:bg-[#D4AF37] selection:text-black">
      <div className="grid-bg"></div>
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[100px]"></div>
      </div>

      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onNavigate={setCurrentView} 
      />
      <WelcomeModal isOpen={welcomeOpen} onClose={() => setWelcomeOpen(false)} />
      <AIChat />
      <Toaster />

      <AnimatePresence>
        {sidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            ></motion.div>
        )}
      </AnimatePresence>

      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        plan={currentPlan} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 lg:ml-72 flex flex-col h-screen relative z-10 w-full transition-all duration-300">
        <header className="h-16 bg-transparent backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 md:px-8 shrink-0 z-40 relative">
          <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-zinc-400 hover:text-white p-2 -ml-2">
                  <Menu size={24} />
              </button>
              
              <div 
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex items-center gap-3 w-96 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-zinc-400 hover:border-[#D4AF37]/30 hover:bg-white/10 transition-all cursor-text group"
              >
                 <Search size={16} className="group-hover:text-[#D4AF37] transition-colors" />
                 <input 
                    type="text" 
                    placeholder={activeWorkspace === Workspace.WALLET ? "Szukaj TxHash / Bloku..." : "Szukaj..."}
                    className="bg-transparent border-none outline-none text-[#E1E1E3] placeholder-zinc-600 w-full cursor-pointer pointer-events-none"
                    readOnly
                 />
                 <div className="ml-auto flex items-center gap-1 text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-zinc-500 font-mono border border-white/5">
                    <Command size={10} /> K
                 </div>
              </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <NotificationCenter onNavigate={setCurrentView} />
            <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-white/5">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-[#E1E1E3]">{currentUser?.firstName} {currentUser?.lastName}</p>
                    <p className="text-xs text-zinc-500 truncate max-w-[150px]">{currentUser?.companyName}</p>
                </div>
                <div 
                    onClick={() => setCurrentView(ViewState.SETTINGS)}
                    className="w-9 h-9 bg-[#141419] rounded-lg flex items-center justify-center text-white font-bold shadow-md border border-white/10 cursor-pointer hover:border-[#D4AF37]/50 transition-colors"
                >
                    {currentUser?.firstName.charAt(0)}{currentUser?.lastName.charAt(0)}
                </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8 custom-scrollbar">
            <div className="max-w-[1920px] mx-auto pb-20">
                <AnimatePresence mode="wait">
                    {renderContent()}
                </AnimatePresence>
            </div>
        </div>
      </main>
    </div>
  );
}
