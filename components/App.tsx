
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Integrations } from './components/Integrations';
import { TaxCommandCenter } from './components/TaxCommandCenter'; // Replaced TaxWizard & TaxEngine view
import { Documents } from './components/Documents';
import { Settings } from './components/Settings';
import { CryptoHub } from './components/CryptoHub';
import { Treasury } from './components/Treasury';
import { Wealth } from './components/Wealth';
import { Reports } from './components/Reports';
import { Auth } from './components/Auth';
import { Toaster } from './components/ui/Toast';
import { NotificationCenter } from './components/NotificationCenter';
import { AIChat } from './components/AIChat';
import { ViewState, SubscriptionPlan, UserProfile, Workspace } from './types';
import { Menu, Search, Command } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from './store/useStore';

// Global Search & Modals
import { GlobalSearch } from './components/GlobalSearch';
import { WelcomeModal } from './components/WelcomeModal';

// Intelligence HQ
import { PredictiveTax } from './components/PredictiveTax';
import { RiskCenter } from './components/RiskCenter';
import { ESG } from './components/ESG';
import { MarketIntel } from './components/MarketIntel';
import { Ledgerverse } from './components/Ledgerverse';
import { WarRoom } from './components/WarRoom';

// Finance OS
import { YapilyConnect } from './components/YapilyConnect';
import { NuffiPay } from './components/NuffiPay';
import { Cards } from './components/Cards';
import { Subscriptions } from './components/Subscriptions';
import { SmartTreasury } from './components/SmartTreasury';

// Investment Deck
import { Derivatives } from './components/Derivatives';
import { Bonds } from './components/Bonds';
import { RealEstate } from './components/RealEstate';
import { DeFiArcheology } from './components/DeFiArcheology';
import { WhaleWatcher } from './components/WhaleWatcher';
import { YieldScout } from './components/YieldScout';
import { TokenScanner } from './components/TokenScanner';

// Accounting Core
import { GeneralLedger } from './components/GeneralLedger';
import { TaxOptimizer } from './components/TaxOptimizer';
import { TaxAuditDefender } from './components/TaxAuditDefender';
import { AuditSnapshots } from './components/AuditSnapshots';

// Operations
import { Contractors } from './components/Contractors';
import { Projects } from './components/Projects';
import { Payroll } from './components/Payroll';
import { Warehouse } from './components/Warehouse';
import { Vehicles } from './components/Vehicles';
import { BusinessTravel } from './components/BusinessTravel';
import { Ecommerce } from './components/Ecommerce';
import { Contracts } from './components/Contracts';
import { Marketplace } from './components/Marketplace';

// Tools & Settings
import { DevPortal } from './components/DevPortal';
import { SystemStatus } from './components/SystemStatus';
import { HelpCenter } from './components/HelpCenter';
import { DesignSystemPreview } from './components/DesignSystemPreview'; // NEW

// Legacy / Extras / Tools
import { Assets } from './components/Assets';
import { Budgeting } from './components/Budgeting';
import { DataExport } from './components/DataExport';
import { B2BNetwork } from './components/B2BNetwork';
import { InternationalTax } from './components/InternationalTax';
import { AiClassifier } from './components/AiClassifier';
import { SmartRules } from './components/SmartRules';
import { ImportWizard } from './components/ImportWizard';
import { TimeTracker } from './components/TimeTracker';
import { Mailbox } from './components/Mailbox';
import { PriceCalculator } from './components/PriceCalculator';
import { DebtCollector } from './components/DebtCollector';
import { CapTable } from './components/CapTable';
import { CashRegister } from './components/CashRegister';
import { History } from './components/History';
import { Dividends } from './components/Dividends';
import { Forensics } from './components/Forensics';
import { GlobalTax } from './components/GlobalTax';
import { AccountantDashboard } from './components/AccountantDashboard';
import { ScenarioPlanner } from './components/ScenarioPlanner';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>(SubscriptionPlan.FREE);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  
  // Use Global Store for Workspace Context
  const { activeWorkspace } = useStore();
  
  // Lifted State for Search
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
      const handleOpenWelcome = () => setWelcomeOpen(true);
      window.addEventListener('nuffi:open-welcome', handleOpenWelcome);
      return () => window.removeEventListener('nuffi:open-welcome', handleOpenWelcome);
  }, []);

  // Reset View when switching workspaces to avoid confusion
  useEffect(() => {
      setCurrentView(ViewState.DASHBOARD);
  }, [activeWorkspace]);

  // Global Keydown for Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      // Optional: Open on '/' if not in input
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
    let Component;
    switch (currentView) {
        // Intelligence & Dashboard
        case ViewState.DASHBOARD: Component = Dashboard; break;
        case ViewState.LEDGERVERSE: Component = Ledgerverse; break;
        case ViewState.WAR_ROOM: Component = WarRoom; break;
        case ViewState.PREDICTIVE_TAX: Component = PredictiveTax; break;
        case ViewState.RISK_CENTER: Component = RiskCenter; break;
        case ViewState.ESG: Component = ESG; break;
        case ViewState.MARKET_INTEL: Component = MarketIntel; break;

        // Finance (Business)
        case ViewState.YAPILY_CONNECT: Component = YapilyConnect; break;
        case ViewState.TREASURY: Component = Treasury; break;
        case ViewState.SMART_TREASURY: Component = SmartTreasury; break;
        case ViewState.NUFFI_PAY: Component = NuffiPay; break;
        case ViewState.CARDS: Component = Cards; break;
        case ViewState.SUBSCRIPTIONS: Component = Subscriptions; break;

        // Investment (Wealth)
        case ViewState.CRYPTO_HUB: Component = CryptoHub; break;
        case ViewState.YIELD_SCOUT: Component = YieldScout; break;
        case ViewState.WEALTH: Component = Wealth; break;
        case ViewState.DERIVATIVES: Component = Derivatives; break;
        case ViewState.BONDS: Component = Bonds; break;
        case ViewState.REAL_ESTATE: Component = RealEstate; break;
        case ViewState.DEFI_ARCHEOLOGY: Component = DeFiArcheology; break;
        case ViewState.WHALE_WATCHER: Component = WhaleWatcher; break;
        case ViewState.TOKEN_SCANNER: Component = TokenScanner; break;

        // Accounting & Taxes (Unified)
        case ViewState.TAX_WIZARD: // Fallback to unified center
        case ViewState.TAX_ENGINE: // Fallback to unified center
            Component = TaxCommandCenter; 
            break;
        
        case ViewState.GENERAL_LEDGER: Component = GeneralLedger; break;
        case ViewState.DOCUMENTS: Component = Documents; break;
        case ViewState.TAX_OPTIMIZER: Component = TaxOptimizer; break;
        case ViewState.AUDIT_DEFENDER: Component = TaxAuditDefender; break;
        case ViewState.REPORTS: Component = Reports; break;
        case ViewState.AUDIT_SNAPSHOTS: Component = AuditSnapshots; break;

        // Operations
        case ViewState.CONTRACTORS: Component = Contractors; break;
        case ViewState.PROJECTS: Component = Projects; break;
        case ViewState.PAYROLL: Component = Payroll; break;
        case ViewState.WAREHOUSE: Component = Warehouse; break;
        case ViewState.VEHICLES: Component = Vehicles; break;
        case ViewState.BUSINESS_TRAVEL: Component = BusinessTravel; break;
        case ViewState.ECOMMERCE: Component = Ecommerce; break;
        case ViewState.CONTRACTS: Component = Contracts; break;
        case ViewState.MARKETPLACE: Component = Marketplace; break;

        // Tools
        case ViewState.SETTINGS: Component = Settings; break;
        case ViewState.DEV_PORTAL: Component = DevPortal; break;
        case ViewState.SYSTEM_STATUS: Component = SystemStatus; break;
        case ViewState.HELP_CENTER: Component = HelpCenter; break;
        case ViewState.DESIGN_SYSTEM: Component = DesignSystemPreview; break; // NEW

        // Extras / Legacy Mappings
        case ViewState.INTEGRATIONS: Component = Integrations; break;
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
        case ViewState.DIVIDENDS: Component = Dividends; break;
        case ViewState.FORENSICS: Component = Forensics; break;
        case ViewState.GLOBAL_TAX: Component = GlobalTax; break;
        case ViewState.ACCOUNTANT_DASHBOARD: Component = AccountantDashboard; break;
        case ViewState.SCENARIOS: Component = ScenarioPlanner; break;

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
    <div className="flex min-h-screen font-sans bg-[#020617] text-slate-200 overflow-hidden relative selection:bg-indigo-500 selection:text-white">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 mesh-bg"></div>

      {/* Global Modals - Rendered at root level via Props */}
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
              className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
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
        <header className="h-16 bg-slate-950/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-8 shrink-0 z-40 relative">
          <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white p-2 -ml-2">
                  <Menu size={24} />
              </button>
              
              {/* Functional Search Trigger */}
              <div 
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex items-center gap-3 w-96 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/10 hover:border-white/20 transition-all cursor-text group"
              >
                 <Search size={16} className="group-hover:text-indigo-400 transition-colors" />
                 <input 
                    type="text" 
                    placeholder={activeWorkspace === Workspace.BUSINESS ? "Szukaj faktur, klientów..." : "Szukaj tickerów, aktywów..."}
                    className="bg-transparent border-none outline-none text-slate-200 placeholder-slate-500 w-full cursor-pointer pointer-events-none"
                    readOnly
                 />
                 <div className="ml-auto flex items-center gap-1 text-[10px] bg-black/30 px-1.5 py-0.5 rounded text-slate-500 font-mono border border-white/5">
                    <Command size={10} /> K
                 </div>
              </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <NotificationCenter onNavigate={setCurrentView} />
            <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-white/5">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-200">{currentUser?.firstName} {currentUser?.lastName}</p>
                    <p className="text-xs text-slate-500 truncate max-w-[150px]">{currentUser?.companyName}</p>
                </div>
                <div 
                    onClick={() => setCurrentView(ViewState.SETTINGS)}
                    className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 cursor-pointer hover:scale-105 transition-transform border border-white/10"
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
