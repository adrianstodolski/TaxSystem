
import React from 'react';
import { LayoutDashboard, Wallet, FileText, History, Settings, ShieldCheck, FileSpreadsheet, Calculator, Box, Users, FileBarChart, PieChart, Download, Bitcoin, Radio, Star, Globe, Landmark, FolderKanban, CreditCard, Briefcase, Package, ShoppingBag, Car, Map, Scale, BarChart2, Leaf, TrendingUp, ScrollText, Store, ScanSearch, Cpu, Telescope, Home, Activity, Magnet, Receipt, BookOpen, BrainCircuit, Workflow, UploadCloud, ShieldAlert, Layers, Archive, Clock, Mail, Siren, Repeat, Radar, Gavel, MapPin, Terminal, Server, GraduationCap } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  plan: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, plan }) => {
  
  // Section 1: Management & AI
  const mainNav = [
    { view: ViewState.DASHBOARD, icon: LayoutDashboard, label: 'Pulpit', badge: '' },
    { view: ViewState.MAILBOX, icon: Mail, label: 'Skrzynka (Faktury)', badge: 'AI' },
    { view: ViewState.TIME_TRACKER, icon: Clock, label: 'Czas Pracy (RCP)', badge: 'NEW' },
    { view: ViewState.SMART_RULES, icon: Workflow, label: 'Smart Rules (Auto)', badge: 'BETA' },
    { view: ViewState.SUBSCRIPTIONS, icon: Repeat, label: 'Subskrypcje', badge: 'NEW' },
  ];

  // Section 2: Capital Markets (Inwestycje)
  const marketsNav = [
    { view: ViewState.WEALTH, icon: TrendingUp, label: 'Wealth (Akcje/ETF)', badge: 'NEW' },
    { view: ViewState.CRYPTO_HUB, icon: Bitcoin, label: 'Crypto Hub', badge: '' },
    { view: ViewState.DERIVATIVES, icon: Layers, label: 'Derywaty (Opcje)', badge: 'NEW' },
    { view: ViewState.BONDS, icon: ScrollText, label: 'Obligacje', badge: 'NEW' },
    { view: ViewState.TREASURY, icon: Activity, label: 'Skarbiec (FX/Ledger)', badge: '' },
    { view: ViewState.WHALE_WATCHER, icon: Radar, label: 'Whale Watcher', badge: 'PRO' },
    { view: ViewState.DEFI_ARCHEOLOGY, icon: Layers, label: 'DeFi Archeology', badge: 'LABS' },
    { view: ViewState.TOKEN_SCANNER, icon: Siren, label: 'Token Scanner', badge: 'SEC' },
  ];

  // Section 3: Operations (Operacyjne)
  const opsNav = [
    { view: ViewState.DOCUMENTS, icon: FileSpreadsheet, label: 'Dokumenty (KSeF)', badge: '' },
    { view: ViewState.YAPILY_CONNECT, icon: Radio, label: 'Bankowość', badge: '' },
    { view: ViewState.NUFFI_PAY, icon: CreditCard, label: 'Nuffi Pay (POS)', badge: 'NEW' },
    { view: ViewState.CONTRACTORS, icon: Users, label: 'Kontrahenci & WL', badge: '' },
    { view: ViewState.PROJECTS, icon: FolderKanban, label: 'Projekty', badge: '' },
    { view: ViewState.WAREHOUSE, icon: Package, label: 'Magazyn (WMS)', badge: '' },
    { view: ViewState.VEHICLES, icon: Car, label: 'Flota', badge: '' },
    { view: ViewState.BUSINESS_TRAVEL, icon: MapPin, label: 'Delegacje', badge: 'NEW' },
    { view: ViewState.CASH_REGISTER, icon: Wallet, label: 'Kasa (KP/KW)', badge: 'NEW' },
    { view: ViewState.PAYROLL, icon: Briefcase, label: 'Kadry i Płace', badge: '' },
    { view: ViewState.ASSETS, icon: Box, label: 'Środki Trwałe', badge: '' },
    { view: ViewState.REAL_ESTATE, icon: Home, label: 'Nieruchomości', badge: 'NEW' },
    { view: ViewState.LOANS, icon: Landmark, label: 'Kredyty', badge: 'NEW' },
    { view: ViewState.CONTRACTS, icon: ScrollText, label: 'Umowy (CLM)', badge: 'NEW' },
    { view: ViewState.ECOMMERCE, icon: ShoppingBag, label: 'E-commerce', badge: '' },
    { view: ViewState.B2B_NETWORK, icon: Globe, label: 'B2B Network', badge: '' },
    { view: ViewState.MARKETPLACE, icon: Store, label: 'Marketplace', badge: 'NEW' },
  ];

  // Section 4: Tax & Compliance (Podatki)
  const taxNav = [
    { view: ViewState.TAX_WIZARD, icon: FileText, label: 'Kreator PIT/CIT', badge: '' },
    { view: ViewState.INTERNATIONAL, icon: Map, label: 'VAT OSS & Intrastat', badge: '' },
    { view: ViewState.GLOBAL_TAX, icon: Globe, label: 'Global Tax (UE)', badge: 'NEW' },
    { view: ViewState.DIVIDENDS, icon: Receipt, label: 'Dywidendy & WHT', badge: 'NEW' },
    { view: ViewState.TAX_OPTIMIZER, icon: Magnet, label: 'Optymalizator', badge: 'AI' },
    { view: ViewState.PREDICTIVE_TAX, icon: Telescope, label: 'Predictive Tax', badge: 'PRO' },
    { view: ViewState.TAX_ENGINE, icon: Cpu, label: 'Tax Engine Core', badge: 'RUST' },
    { view: ViewState.RISK_CENTER, icon: ShieldAlert, label: 'Risk Center', badge: 'NEW' },
    { view: ViewState.AUDIT_DEFENDER, icon: Scale, label: 'Tarcza (Audit)', badge: '' },
    { view: ViewState.FORENSICS, icon: ScanSearch, label: 'Forensics', badge: 'AI' },
    { view: ViewState.AUDIT_SNAPSHOTS, icon: Archive, label: 'Snapshots', badge: 'PRO' },
    { view: ViewState.GENERAL_LEDGER, icon: BookOpen, label: 'Księga Główna', badge: 'NEW' },
    { view: ViewState.DEBT_COLLECTOR, icon: Gavel, label: 'Windykacja', badge: 'NEW' },
    { view: ViewState.CAP_TABLE, icon: PieChart, label: 'Cap Table', badge: 'NEW' },
    { view: ViewState.ESG, icon: Leaf, label: 'ESG Reporting', badge: 'NEW' },
    { view: ViewState.REPORTS, icon: FileBarChart, label: 'Raporty BI', badge: '' },
    { view: ViewState.EXPORT, icon: Download, label: 'JPK & Eksport', badge: '' },
  ];

  // Tools
  const toolsNav = [
    { view: ViewState.IMPORT_WIZARD, icon: UploadCloud, label: 'Import Wizard', badge: 'AI' },
    { view: ViewState.PRICE_CALCULATOR, icon: Calculator, label: 'Kalkulator Cen', badge: 'NEW' },
    { view: ViewState.MARKET_INTEL, icon: BarChart2, label: 'Market Intel', badge: '' },
  ];

  const accountantItems = [
      { view: ViewState.ACCOUNTANT_DASHBOARD, icon: Briefcase, label: 'Pulpit Księgowego', badge: 'PRO' },
      { view: ViewState.AI_CLASSIFIER, icon: BrainCircuit, label: 'Nuffi AI Lab', badge: 'BETA' },
  ];

  const devItems = [
      { view: ViewState.DEV_PORTAL, icon: Terminal, label: 'Developer Portal', badge: 'API' },
      { view: ViewState.SYSTEM_STATUS, icon: Server, label: 'Status Systemu', badge: '' },
  ];

  const renderNavSection = (title: string, items: any[]) => (
      <>
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-4 mb-2 px-3 opacity-80">{title}</div>
        <nav className="space-y-0.5">
            {items.map((item) => (
                <button
                    key={item.view}
                    onClick={() => onChangeView(item.view)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative ${
                    currentView === item.view
                        ? 'bg-indigo-600/10 text-indigo-400 font-medium'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                >
                    {currentView === item.view && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 bg-indigo-500 rounded-r-full"></div>
                    )}
                    <item.icon size={16} className={`shrink-0 transition-colors ${currentView === item.view ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    <span className="text-[13px] truncate flex-1 text-left">{item.label}</span>
                    {item.badge && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ml-2 ${
                            item.badge === 'RUST' ? 'bg-orange-600 text-white' : 
                            item.badge === 'PRO' ? 'bg-indigo-600 text-white' :
                            item.badge === 'AI' ? 'bg-purple-600 text-white' :
                            item.badge === 'NEW' ? 'bg-teal-600 text-white' :
                            item.badge === 'LABS' ? 'bg-pink-600 text-white' :
                            item.badge === 'SEC' ? 'bg-rose-600 text-white' :
                            item.badge === 'BETA' ? 'bg-amber-600 text-white' :
                            item.badge === 'API' ? 'bg-slate-500 text-white' :
                            'bg-blue-600 text-white'
                        }`}>
                            {item.badge}
                        </span>
                    )}
                </button>
            ))}
        </nav>
      </>
  );

  return (
    <div className="w-64 h-screen flex flex-col fixed left-0 top-0 z-50 bg-[#0B1120] text-slate-300 border-r border-slate-800 shadow-2xl font-sans">
      <div className="p-5 flex items-center gap-3 border-b border-slate-800/50 bg-[#0F172A]">
        <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-900/50">
          <ShieldCheck size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white font-sans">Nuffi<span className="text-indigo-500">.io</span></h1>
          <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 tracking-wide uppercase">{plan}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
          </div>
        </div>
      </div>

      <div className="px-3 py-2 overflow-y-auto custom-scrollbar flex-1 pb-20">
        {renderNavSection('Zarządzanie', mainNav)}
        {renderNavSection('Rynki Kapitałowe', marketsNav)}
        {renderNavSection('Operacje & Majątek', opsNav)}
        {renderNavSection('Podatki & Zgodność', taxNav)}
        {renderNavSection('Narzędzia', toolsNav)}
        {renderNavSection('Strefa Partnera', accountantItems)}
        {renderNavSection('Deweloperzy', devItems)}
        
        {/* Help Center Link */}
        <div className="mt-6 mb-2 px-3">
            <button
                onClick={() => onChangeView(ViewState.HELP_CENTER)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative border border-slate-700 hover:border-indigo-500 bg-[#0F172A] ${
                currentView === ViewState.HELP_CENTER
                    ? 'text-indigo-400 border-indigo-500'
                    : 'text-slate-400 hover:text-white'
                }`}
            >
                <GraduationCap size={18} className="shrink-0 text-indigo-500" />
                <span className="text-[13px] font-bold truncate flex-1 text-left">Nuffi Academy</span>
            </button>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800/50 bg-[#0F1623] absolute bottom-0 w-full">
         <button 
            onClick={() => onChangeView(ViewState.PRICING)}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] shadow-lg shadow-orange-900/20 mb-2"
        >
            <Star size={14} className="fill-white" /> Upgrade Planu
        </button>
        <button 
            onClick={() => onChangeView(ViewState.SETTINGS)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                currentView === ViewState.SETTINGS ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
        >
          <Settings size={16} />
          <span className="text-sm font-medium">Ustawienia</span>
        </button>
      </div>
    </div>
  );
};
