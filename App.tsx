
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
import { ViewState, SubscriptionPlan, UserProfile } from './types';
import { NuffiService } from './services/api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>(SubscriptionPlan.FREE);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [showWelcome, setShowWelcome] = useState(false);

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
      setShowWelcome(true); // Show welcome modal on login
      NuffiService.trackEvent('LOGIN', { method: 'EMAIL', plan });
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard onNavigate={setCurrentView} />;
      case ViewState.INTEGRATIONS:
        return <Integrations />;
      case ViewState.TAX_WIZARD:
        return <TaxWizard />;
      case ViewState.DOCUMENTS:
        return <Documents />;
      case ViewState.CONTRACTORS:
        return <Contractors />;
      case ViewState.ASSETS:
        return <Assets />;
      case ViewState.HISTORY:
        return <History />;
      case ViewState.SETTINGS:
        return <Settings />;
      case ViewState.SCENARIOS:
        return <ScenarioPlanner />;
      case ViewState.REPORTS:
        return <Reports />;
      case ViewState.BUDGETS:
        return <Budgeting />;
      case ViewState.EXPORT:
        return <DataExport />;
      case ViewState.CRYPTO_HUB:
        return <CryptoHub />;
      case ViewState.YAPILY_CONNECT:
        return <YapilyConnect />;
      case ViewState.B2B_NETWORK:
        return <B2BNetwork />;
      case ViewState.TREASURY:
        return <Treasury />;
      case ViewState.PROJECTS:
        return <Projects />;
      case ViewState.CARDS:
        return <Cards />;
      case ViewState.PAYROLL:
        return <Payroll />;
      case ViewState.WAREHOUSE:
        return <Warehouse />;
      case ViewState.VEHICLES:
        return <Vehicles />;
      case ViewState.ECOMMERCE:
        return <Ecommerce />;
      case ViewState.INTERNATIONAL:
        return <InternationalTax />;
      case ViewState.AUDIT_DEFENDER:
        return <TaxAuditDefender />;
      case ViewState.MARKET_INTEL:
        return <MarketIntel />;
      case ViewState.ESG:
        return <ESG />;
      case ViewState.WEALTH:
        return <Wealth />;
      case ViewState.CONTRACTS:
        return <Contracts />;
      case ViewState.MARKETPLACE:
        return <Marketplace />;
      case ViewState.FORENSICS:
        return <Forensics />;
      case ViewState.TAX_ENGINE:
        return <TaxEngine />;
      case ViewState.PREDICTIVE_TAX:
        return <PredictiveTax />;
      case ViewState.REAL_ESTATE:
        return <RealEstate />;
      case ViewState.LOANS:
        return <Loans />;
      case ViewState.GLOBAL_TAX:
        return <GlobalTax />;
      case ViewState.TAX_OPTIMIZER:
        return <TaxOptimizer />;
      case ViewState.PRICING:
        return <Pricing />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
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
    <div className="flex min-h-screen font-sans bg-[#F8FAFC] text-slate-900 overflow-hidden relative selection:bg-indigo-500 selection:text-white">
      {/* Subtle Grid Pattern Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40" 
           style={{ 
               backgroundImage: `radial-gradient(#CBD5E1 1px, transparent 1px)`, 
               backgroundSize: '24px 24px' 
           }}
      ></div>

      <Sidebar currentView={currentView} onChangeView={setCurrentView} plan={currentPlan} />

      <main className="flex-1 ml-64 flex flex-col h-screen relative z-10">
        {/* Top Header - Corporate Clean */}
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-40 relative shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          {/* Global Search Component */}
          <div className="w-96">
             <GlobalSearch onNavigate={setCurrentView} />
          </div>

          <div className="flex items-center gap-6">
            {/* Notification Center */}
            <NotificationCenter onNavigate={setCurrentView} />
            
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-900 tracking-tight">{currentUser?.firstName} {currentUser?.lastName}</p>
                    <p className="text-xs text-slate-500 truncate max-w-[150px] font-medium">{currentUser?.companyName || 'Brak firmy'}</p>
                </div>
                <div 
                    className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-700 font-bold border border-slate-200 cursor-pointer hover:bg-slate-200 transition-all" 
                    onClick={() => setCurrentView(ViewState.SETTINGS)}
                >
                    {currentUser?.firstName.charAt(0)}{currentUser?.lastName.charAt(0)}
                </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-8 custom-scrollbar">
            <div className="max-w-[1600px] mx-auto pb-20">
                {renderContent()}
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
