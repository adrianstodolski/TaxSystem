
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Integrations } from './components/Integrations';
import { TaxWizard } from './components/TaxWizard';
import { History } from './components/History';
import { Documents } from './components/Documents';
import { Settings } from './components/Settings';
import { ScenarioPlanner } from './components/ScenarioPlanner';
import { Assets } from './components/Assets';
import { AIChat } from './components/AIChat';
import { Contractors } from './components/Contractors';
import { Reports } from './components/Reports';
import { Budgeting } from './components/Budgeting';
import { DataExport } from './components/DataExport';
import { CryptoHub } from './components/CryptoHub';
import { YapilyConnect } from './components/YapilyConnect';
import { B2BNetwork } from './components/B2BNetwork';
import { Treasury } from './components/Treasury';
import { Projects } from './components/Projects';
import { Cards } from './components/Cards';
import { Payroll } from './components/Payroll';
import { Warehouse } from './components/Warehouse';
import { Vehicles } from './components/Vehicles';
import { Ecommerce } from './components/Ecommerce';
import { InternationalTax } from './components/InternationalTax';
import { TaxAuditDefender } from './components/TaxAuditDefender';
import { MarketIntel } from './components/MarketIntel';
import { ESG } from './components/ESG';
import { Wealth } from './components/Wealth';
import { Contracts } from './components/Contracts';
import { Marketplace } from './components/Marketplace';
import { Auth } from './components/Auth';
import { Pricing } from './components/Pricing';
import { Toaster } from './components/ui/Toast';
import { GlobalSearch } from './components/GlobalSearch';
import { NotificationCenter } from './components/NotificationCenter';
import { WelcomeModal } from './components/WelcomeModal';
import { Forensics } from './components/Forensics';
import { TaxEngine } from './components/TaxEngine';
import { PredictiveTax } from './components/PredictiveTax';
import { RealEstate } from './components/RealEstate';
import { Loans } from './components/Loans';
import { GlobalTax } from './components/GlobalTax';
import { TaxOptimizer } from './components/TaxOptimizer';
import { Dividends } from './components/Dividends';
import { GeneralLedger } from './components/GeneralLedger';
import { AccountantDashboard } from './components/AccountantDashboard';
import { AiClassifier } from './components/AiClassifier';
import { NuffiPay } from './components/NuffiPay';
import { SmartRules } from './components/SmartRules';
import { ImportWizard } from './components/ImportWizard';
import { RiskCenter } from './components/RiskCenter';
import { DeFiArcheology } from './components/DeFiArcheology'; 
import { AuditSnapshots } from './components/AuditSnapshots';
import { TimeTracker } from './components/TimeTracker';
import { Mailbox } from './components/Mailbox'; 
import { PriceCalculator } from './components/PriceCalculator'; 
import { TokenScanner } from './components/TokenScanner';
import { Subscriptions } from './components/Subscriptions';
import { WhaleWatcher } from './components/WhaleWatcher';
import { DebtCollector } from './components/DebtCollector';
import { CapTable } from './components/CapTable';
import { BusinessTravel } from './components/BusinessTravel';
import { CashRegister } from './components/CashRegister';
import { Derivatives } from './components/Derivatives';
import { Bonds } from './components/Bonds';
import { DevPortal } from './components/DevPortal'; 
import { SystemStatus } from './components/SystemStatus'; 
import { HelpCenter } from './components/HelpCenter'; 
import { ViewState, SubscriptionPlan, UserProfile } from './types';
import { NuffiService } from './services/api';
import { Menu, Search, Command } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>(SubscriptionPlan.FREE);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [showWelcome, setShowWelcome] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Analytics Tracking
  useEffect(() => {
      if (isAuthenticated) {
          NuffiService.trackEvent('PAGE_VIEW', { view: currentView, user: currentUser?.email });
      }
  }, [currentView, isAuthenticated]);

  const handleLogin = (token: string, plan: SubscriptionPlan, user: UserProfile) => {
      setIsAuthenticated(true);
      setCurrentPlan(plan);
      setCurrentUser(user);
      setShowWelcome(true); 
      NuffiService.trackEvent('LOGIN', { method: 'EMAIL', plan });
  };

  const renderContent = () => {
    const ViewComponent = () => {
        switch (currentView) {
            case ViewState.DASHBOARD: return <Dashboard onNavigate={setCurrentView} />;
            case ViewState.INTEGRATIONS: return <Integrations />;
            case ViewState.TAX_WIZARD: return <TaxWizard />;
            case ViewState.DOCUMENTS: return <Documents />;
            case ViewState.CONTRACTORS: return <Contractors />;
            case ViewState.ASSETS: return <Assets />;
            case ViewState.HISTORY: return <History />;
            case ViewState.SETTINGS: return <Settings />;
            case ViewState.SCENARIOS: return <ScenarioPlanner />;
            case ViewState.REPORTS: return <Reports />;
            case ViewState.BUDGETS: return <Budgeting />;
            case ViewState.EXPORT: return <DataExport />;
            case ViewState.CRYPTO_HUB: return <CryptoHub />;
            case ViewState.YAPILY_CONNECT: return <YapilyConnect />;
            case ViewState.B2B_NETWORK: return <B2BNetwork />;
            case ViewState.TREASURY: return <Treasury />;
            case ViewState.PROJECTS: return <Projects />;
            case ViewState.CARDS: return <Cards />;
            case ViewState.PAYROLL: return <Payroll />;
            case ViewState.WAREHOUSE: return <Warehouse />;
            case ViewState.VEHICLES: return <Vehicles />;
            case ViewState.ECOMMERCE: return <Ecommerce />;
            case ViewState.INTERNATIONAL: return <InternationalTax />;
            case ViewState.AUDIT_DEFENDER: return <TaxAuditDefender />;
            case ViewState.MARKET_INTEL: return <MarketIntel />;
            case ViewState.ESG: return <ESG />;
            case ViewState.WEALTH: return <Wealth />;
            case ViewState.CONTRACTS: return <Contracts />;
            case ViewState.MARKETPLACE: return <Marketplace />;
            case ViewState.FORENSICS: return <Forensics />;
            case ViewState.TAX_ENGINE: return <TaxEngine />;
            case ViewState.PREDICTIVE_TAX: return <PredictiveTax />;
            case ViewState.REAL_ESTATE: return <RealEstate />;
            case ViewState.LOANS: return <Loans />;
            case ViewState.GLOBAL_TAX: return <GlobalTax />;
            case ViewState.TAX_OPTIMIZER: return <TaxOptimizer />;
            case ViewState.DIVIDENDS: return <Dividends />;
            case ViewState.GENERAL_LEDGER: return <GeneralLedger />;
            case ViewState.ACCOUNTANT_DASHBOARD: return <AccountantDashboard />;
            case ViewState.AI_CLASSIFIER: return <AiClassifier />;
            case ViewState.NUFFI_PAY: return <NuffiPay />;
            case ViewState.SMART_RULES: return <SmartRules />;
            case ViewState.IMPORT_WIZARD: return <ImportWizard />;
            case ViewState.RISK_CENTER: return <RiskCenter />;
            case ViewState.DEFI_ARCHEOLOGY: return <DeFiArcheology />;
            case ViewState.AUDIT_SNAPSHOTS: return <AuditSnapshots />;
            case ViewState.TIME_TRACKER: return <TimeTracker />;
            case ViewState.MAILBOX: return <Mailbox />;
            case ViewState.PRICE_CALCULATOR: return <PriceCalculator />;
            case ViewState.TOKEN_SCANNER: return <TokenScanner />;
            case ViewState.PRICING: return <Pricing />;
            case ViewState.SUBSCRIPTIONS: return <Subscriptions />;
            case ViewState.WHALE_WATCHER: return <WhaleWatcher />;
            case ViewState.DEBT_COLLECTOR: return <DebtCollector />;
            case ViewState.CAP_TABLE: return <CapTable />;
            case ViewState.BUSINESS_TRAVEL: return <BusinessTravel />;
            case ViewState.CASH_REGISTER: return <CashRegister />;
            case ViewState.DERIVATIVES: return <Derivatives />;
            case ViewState.BONDS: return <Bonds />;
            case ViewState.DEV_PORTAL: return <DevPortal />;
            case ViewState.SYSTEM_STATUS: return <SystemStatus />;
            case ViewState.HELP_CENTER: return <HelpCenter />;
            default: return <Dashboard onNavigate={setCurrentView} />;
        }
    };

    return (
        <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
        >
            <ViewComponent />
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
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20" 
           style={{ 
               backgroundImage: `radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%), 
                                 radial-gradient(at 100% 100%, rgba(168, 85, 247, 0.15) 0px, transparent 50%),
                                 radial-gradient(#1e293b 1px, transparent 1px)`, 
               backgroundSize: '100% 100%, 100% 100%, 30px 30px' 
           }}
      ></div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          ></div>
      )}

      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        plan={currentPlan} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 lg:ml-72 flex flex-col h-screen relative z-10 w-full">
        {/* Top Header - Glassmorphism */}
        <header className="h-16 bg-slate-950/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-8 shrink-0 z-40 relative">
          <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-slate-400 hover:text-white p-2 -ml-2"
              >
                  <Menu size={24} />
              </button>
              
              {/* Global Search Component */}
              <div className="hidden md:flex items-center gap-3 w-96 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-400 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all cursor-text" onClick={() => document.getElementById('global-search')?.focus()}>
                 <Search size={16} />
                 <input 
                    id="global-search"
                    type="text" 
                    placeholder="Search transactions, assets..." 
                    className="bg-transparent border-none outline-none text-slate-200 placeholder-slate-500 w-full"
                 />
                 <div className="flex items-center gap-1 text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-400">
                    <Command size={10} /> K
                 </div>
              </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <NotificationCenter onNavigate={setCurrentView} />
            
            <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-white/5">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-200 tracking-tight">{currentUser?.firstName} {currentUser?.lastName}</p>
                    <p className="text-xs text-slate-500 truncate max-w-[150px] font-medium">{currentUser?.companyName || 'Brak firmy'}</p>
                </div>
                <div 
                    className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 cursor-pointer hover:scale-105 transition-transform" 
                    onClick={() => setCurrentView(ViewState.SETTINGS)}
                >
                    {currentUser?.firstName.charAt(0)}{currentUser?.lastName.charAt(0)}
                </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8 custom-scrollbar">
            <div className="max-w-[1920px] mx-auto pb-20">
                <AnimatePresence mode="wait">
                    {renderContent()}
                </AnimatePresence>
            </div>
        </div>
      </main>

      {/* Global Widgets */}
      <AIChat />
      <Toaster />
      <WelcomeModal isOpen={showWelcome} onClose={() => setShowWelcome(false)} />
    </div>
  );
}
