
import React from 'react';
import { LayoutDashboard, Wallet, FileText, History, Settings, ShieldCheck, FileSpreadsheet, Calculator, Box, Users, FileBarChart, PieChart, Download, Bitcoin, Radio, Star, Globe, Landmark, FolderKanban, CreditCard, Briefcase, Package, ShoppingBag, Car, Map, Scale, BarChart2, Leaf, TrendingUp, ScrollText, Store, ScanSearch, Cpu, Telescope, Home, Activity, Magnet } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  plan: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, plan }) => {
  const navItems = [
    { view: ViewState.DASHBOARD, icon: LayoutDashboard, label: 'Pulpit' },
    { view: ViewState.TAX_OPTIMIZER, icon: Magnet, label: 'Optymalizator (Hedge)', badge: 'AI' }, // New Item
    { view: ViewState.PREDICTIVE_TAX, icon: Telescope, label: 'Predictive Tax AI', badge: 'PRO' },
    { view: ViewState.TAX_ENGINE, icon: Cpu, label: 'Tax Engine Core', badge: 'RUST' },
    { view: ViewState.FORENSICS, icon: ScanSearch, label: 'Forensics & Audit', badge: 'AI' },
    { view: ViewState.GLOBAL_TAX, icon: Globe, label: 'Global Tax (UE)', badge: 'NEW' },
    { view: ViewState.WEALTH, icon: TrendingUp, label: 'Inwestycje (Wealth)', badge: 'NEW' },
    { view: ViewState.REAL_ESTATE, icon: Home, label: 'Nieruchomości', badge: 'NEW' },
    { view: ViewState.LOANS, icon: Landmark, label: 'Kredyty i Leasingi', badge: 'NEW' },
    { view: ViewState.B2B_NETWORK, icon: Globe, label: 'Open Company Intel' },
    { view: ViewState.ESG, icon: Leaf, label: 'ESG / Eco', badge: 'NEW' },
    { view: ViewState.MARKET_INTEL, icon: BarChart2, label: 'Analityka Rynku' },
    { view: ViewState.SCENARIOS, icon: Calculator, label: 'Symulator Podatkowy' },
    { view: ViewState.CRYPTO_HUB, icon: Bitcoin, label: 'Crypto Hub' },
    { view: ViewState.TREASURY, icon: Activity, label: 'Skarbiec (FX)' },
    { view: ViewState.YAPILY_CONNECT, icon: Radio, label: 'Bankowość & Płatności' },
    { view: ViewState.CARDS, icon: CreditCard, label: 'Karty Firmowe' },
    { view: ViewState.PAYROLL, icon: Briefcase, label: 'Kadry i Płace' },
    { view: ViewState.REPORTS, icon: FileBarChart, label: 'Raporty BI' },
    { view: ViewState.PROJECTS, icon: FolderKanban, label: 'Projekty' },
    { view: ViewState.BUDGETS, icon: PieChart, label: 'Budżety' },
    { view: ViewState.ECOMMERCE, icon: ShoppingBag, label: 'E-commerce' },
    { view: ViewState.INTERNATIONAL, icon: Map, label: 'VAT OSS & Intrastat' },
    { view: ViewState.CONTRACTS, icon: ScrollText, label: 'Rejestr Umów', badge: 'NEW' },
    { view: ViewState.DOCUMENTS, icon: FileSpreadsheet, label: 'Dokumenty (KSeF)' },
    { view: ViewState.WAREHOUSE, icon: Package, label: 'Magazyn (WMS)' },
    { view: ViewState.VEHICLES, icon: Car, label: 'Flota (Pojazdy)' },
    { view: ViewState.CONTRACTORS, icon: Users, label: 'Kontrahenci & WL' },
    { view: ViewState.ASSETS, icon: Box, label: 'Majątek' },
    { view: ViewState.INTEGRATIONS, icon: Wallet, label: 'Integracje' },
    { view: ViewState.AUDIT_DEFENDER, icon: Scale, label: 'Tarcza Antykontrolna' },
    { view: ViewState.EXPORT, icon: Download, label: 'Eksport & JPK' },
    { view: ViewState.MARKETPLACE, icon: Store, label: 'Marketplace', badge: 'NEW' },
    { view: ViewState.TAX_WIZARD, icon: FileText, label: 'Moje PITy' },
    { view: ViewState.HISTORY, icon: History, label: 'Historia' },
  ];

  return (
    <div className="w-64 h-screen flex flex-col fixed left-0 top-0 z-50 bg-[#0B1120] text-slate-300 border-r border-slate-800 shadow-2xl font-sans">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
        <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-900/50">
          <ShieldCheck size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white font-sans">Nuffi<span className="text-indigo-500">.io</span></h1>
          <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 tracking-wide uppercase">{plan}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 overflow-y-auto custom-scrollbar flex-1">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Menu Główne</div>
        <nav className="space-y-0.5">
            {navItems.slice(0, 16).map((item) => ( // Adjusted slice for new item
            <button
                key={item.view}
                onClick={() => onChangeView(item.view)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                currentView === item.view
                    ? 'bg-indigo-600/10 text-indigo-400 font-medium'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
            >
                {currentView === item.view && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 bg-indigo-500 rounded-r-full"></div>
                )}
                <item.icon size={18} className={`transition-colors ${currentView === item.view ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="text-sm truncate flex-1 text-left">{item.label}</span>
                {item.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ml-2 ${
                        item.badge === 'RUST' ? 'bg-orange-600 text-white' : 
                        item.badge === 'PRO' ? 'bg-indigo-600 text-white' :
                        item.badge === 'AI' ? 'bg-purple-600 text-white' :
                        'bg-blue-600 text-white'
                    }`}>
                        {item.badge}
                    </span>
                )}
            </button>
            ))}
        </nav>

        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-6 mb-2 px-2">Księgowość & Operacje</div>
        <nav className="space-y-0.5">
            {navItems.slice(16).map((item) => (
            <button
                key={item.view}
                onClick={() => onChangeView(item.view)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                currentView === item.view
                    ? 'bg-indigo-600/10 text-indigo-400 font-medium'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
            >
                {currentView === item.view && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 bg-indigo-500 rounded-r-full"></div>
                )}
                <item.icon size={18} className={`transition-colors ${currentView === item.view ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="text-sm truncate flex-1 text-left">{item.label}</span>
                {item.badge && (
                    <span className="text-[9px] font-bold bg-purple-600 text-white px-1.5 py-0.5 rounded ml-2">
                        {item.badge}
                    </span>
                )}
            </button>
            ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800/50 bg-[#0F1623]">
         <button 
            onClick={() => onChangeView(ViewState.PRICING)}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] shadow-lg shadow-orange-900/20 mb-3"
        >
            <Star size={14} className="fill-white" /> Upgrade Planu
        </button>
        <button 
            onClick={() => onChangeView(ViewState.SETTINGS)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                currentView === ViewState.SETTINGS ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
        >
          <Settings size={18} />
          <span className="text-sm font-medium">Ustawienia</span>
        </button>
      </div>
    </div>
  );
};
