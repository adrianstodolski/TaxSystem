
import React from 'react';
import { NavSection, ViewState, Workspace } from '../types';
import { useStore } from '../store/useStore';
import { 
    LayoutDashboard, Wallet, Layers, ShieldCheck, Cpu, Globe, 
    CreditCard, Users, FolderKanban, Package, Car, MapPin, 
    BookOpen, PieChart, Leaf, FileBarChart, Calculator, BarChart2, BrainCircuit, Terminal, GraduationCap, 
    Settings, Zap, RefreshCw, TrendingUp, Bitcoin, Home, Search, Radar, Network, Gem, Swords, PiggyBank, BriefcaseBusiness,
    Building2, ShoppingCart, Landmark, ScrollText, Gavel, Scale, Repeat, Receipt, History, Activity, Box, Clock, Palette,
    FileText, Magnet, Telescope, ShieldAlert, FlaskConical, Command, Send, Shuffle, Smartphone, Lock
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  plan: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, plan, isOpen, onClose }) => {
  const { activeWorkspace, setWorkspace } = useStore();

  const businessNav: NavSection[] = [
      {
          id: 'HQ',
          title: 'Centrala (HQ)',
          icon: BrainCircuit,
          items: [
              { view: ViewState.DASHBOARD, label: 'Pulpit Prezesa', icon: LayoutDashboard },
              { view: ViewState.PREDICTIVE_TAX, label: 'Symulacje AI', icon: Telescope, badge: 'PRO' },
              { view: ViewState.RISK_CENTER, label: 'Centrum Ryzyka', icon: ShieldAlert },
              { view: ViewState.ESG, label: 'Raport ESG', icon: Leaf },
          ]
      },
      {
          id: 'FINANCE',
          title: 'Dział Finansowy (CFO)',
          icon: Landmark,
          items: [
              { view: ViewState.YAPILY_CONNECT, label: 'Rachunki Bankowe', icon: Building2 },
              { view: ViewState.TREASURY, label: 'Skarbiec & Waluty', icon: Activity },
              { view: ViewState.SMART_TREASURY, label: 'Lokowanie Nadwyżek', icon: PiggyBank, badge: 'AUTO' },
              { view: ViewState.NUFFI_PAY, label: 'Bramka Płatnicza', icon: CreditCard },
              { view: ViewState.LOANS, label: 'Kredyty i Leasingi', icon: Scale },
              { view: ViewState.CARDS, label: 'Karty Firmowe', icon: CreditCard },
              { view: ViewState.CASH_REGISTER, label: 'Raport Kasowy', icon: Wallet },
          ]
      },
      {
          id: 'REVENUE',
          title: 'Sprzedaż (Revenue)',
          icon: TrendingUp,
          items: [
              { view: ViewState.DOCUMENTS, label: 'Faktury (KSeF)', icon: FileText },
              { view: ViewState.CONTRACTORS, label: 'Klienci (CRM)', icon: Users },
              { view: ViewState.ECOMMERCE, label: 'E-commerce Hub', icon: ShoppingCart },
              { view: ViewState.PRICE_CALCULATOR, label: 'Kalkulator Cen', icon: Calculator },
              { view: ViewState.DEBT_COLLECTOR, label: 'Windykacja', icon: Gavel },
          ]
      },
      {
          id: 'OPS',
          title: 'Operacje (COO)',
          icon: Layers,
          items: [
              { view: ViewState.SUBSCRIPTIONS, label: 'Subskrypcje', icon: Repeat },
              { view: ViewState.PROJECTS, label: 'Projekty & Koszty', icon: FolderKanban },
              { view: ViewState.WAREHOUSE, label: 'Magazyn (WMS)', icon: Package },
              { view: ViewState.ASSETS, label: 'Środki Trwałe', icon: Box },
              { view: ViewState.VEHICLES, label: 'Flota Pojazdów', icon: Car },
              { view: ViewState.CONTRACTS, label: 'Rejestr Umów', icon: ScrollText },
          ]
      },
      {
          id: 'HR',
          title: 'Kadry (HR)',
          icon: Users,
          items: [
              { view: ViewState.PAYROLL, label: 'Płace & ZUS', icon: Users },
              { view: ViewState.TIME_TRACKER, label: 'Czas Pracy (RCP)', icon: Clock },
              { view: ViewState.BUSINESS_TRAVEL, label: 'Delegacje', icon: MapPin },
          ]
      },
      {
          id: 'ACCOUNTING',
          title: 'Księgowość',
          icon: BookOpen,
          items: [
              { view: ViewState.TAX_WIZARD, label: 'Centrum Podatkowe', icon: Calculator, badge: 'CORE' },
              { view: ViewState.GENERAL_LEDGER, label: 'Księga Główna', icon: BookOpen },
              { view: ViewState.INTERNATIONAL, label: 'VAT OSS / Intrastat', icon: Globe },
              { view: ViewState.AUDIT_DEFENDER, label: 'Audit Defender', icon: ShieldCheck },
              { view: ViewState.REPORTS, label: 'Sprawozdania', icon: FileBarChart },
              { view: ViewState.CAP_TABLE, label: 'Udziałowcy (Cap Table)', icon: PieChart },
          ]
      }
  ];

  const investorNav: NavSection[] = [
      {
          id: 'INVEST_HQ',
          title: 'Centrum Dowodzenia',
          icon: LayoutDashboard,
          items: [
              { view: ViewState.DASHBOARD, label: 'Majątek Netto', icon: LayoutDashboard },
              { view: ViewState.WAR_ROOM, label: 'War Room (Live)', icon: Swords, badge: 'LIVE' },
              { view: ViewState.LEDGERVERSE, label: 'Przepływy 3D', icon: Network },
          ]
      },
      {
          id: 'CRYPTO',
          title: 'Aktywa Cyfrowe (Web3)',
          icon: Bitcoin,
          items: [
              { view: ViewState.CRYPTO_HUB, label: 'Rynek & Research', icon: Radar },
              { view: ViewState.YIELD_SCOUT, label: 'DeFi Yield', icon: Gem, badge: 'APY' },
              { view: ViewState.DEFI_ARCHEOLOGY, label: 'DeFi Explorer', icon: Search },
              { view: ViewState.TOKEN_SCANNER, label: 'Audyt Tokenów', icon: ShieldAlert },
          ]
      },
      {
          id: 'TRADFI',
          title: 'Rynki Tradycyjne',
          icon: Globe,
          items: [
              { view: ViewState.WEALTH, label: 'Akcje & ETF', icon: TrendingUp },
              { view: ViewState.DERIVATIVES, label: 'Derywaty & Opcje', icon: Activity },
              { view: ViewState.BONDS, label: 'Obligacje', icon: FileText },
              { view: ViewState.TREASURY, label: 'Forex / Waluty', icon: RefreshCw },
              { view: ViewState.REAL_ESTATE, label: 'Nieruchomości', icon: Home },
          ]
      },
      {
          id: 'INTEL',
          title: 'Research (Alpha)',
          icon: Radar,
          items: [
              { view: ViewState.WHALE_WATCHER, label: 'Whale Watcher', icon: Radar },
              { view: ViewState.MARKET_INTEL, label: 'Analiza Rynku', icon: BarChart2 },
          ]
      },
      {
          id: 'TAX_INV',
          title: 'Podatki i Wyniki',
          icon: Calculator,
          items: [
              { view: ViewState.TAX_ENGINE, label: 'Silnik Podatkowy', icon: Cpu, badge: 'CORE' },
              { view: ViewState.TAX_OPTIMIZER, label: 'Optymalizacja Strat', icon: Magnet },
              { view: ViewState.GLOBAL_TAX, label: 'Dochody Zagraniczne', icon: Globe },
              { view: ViewState.DIVIDENDS, label: 'Dywidendy (WHT)', icon: Receipt },
              { view: ViewState.HISTORY, label: 'Archiwum', icon: History },
          ]
      }
  ];

  // *** NEW: WALLET NAVIGATION ***
  const walletNav: NavSection[] = [
      {
          id: 'WALLET_MAIN',
          title: 'Urządzenie (Hardware)',
          icon: Command,
          items: [
              { view: ViewState.WALLET_DASHBOARD, label: 'Pulpit Sterujący', icon: LayoutDashboard, badge: 'DEVICE' },
              { view: ViewState.WALLET_DEVICE, label: 'Ustawienia Nuffi Key', icon: Settings },
          ]
      },
      {
          id: 'WALLET_OPS',
          title: 'Operacje',
          icon: RefreshCw,
          items: [
              { view: ViewState.WALLET_SEND, label: 'Wyślij', icon: Send },
              { view: ViewState.WALLET_RECEIVE, label: 'Odbierz', icon: Wallet },
              { view: ViewState.WALLET_SWAP, label: 'Swap', icon: Shuffle },
              { view: ViewState.WALLET_BRIDGE, label: 'Bridge', icon: Globe },
          ]
      },
      {
          id: 'WALLET_SEC',
          title: 'Bezpieczeństwo',
          icon: ShieldCheck,
          items: [
              { view: ViewState.WALLET_DEVICE, label: 'Menadżer Kluczy', icon: Lock }, // Reuse view for now
          ]
      }
  ];

  let currentNav;
  if (activeWorkspace === Workspace.BUSINESS) currentNav = businessNav;
  else if (activeWorkspace === Workspace.WALLET) currentNav = walletNav;
  else currentNav = investorNav;

  return (
    // PURE GLASS SIDEBAR - NO SOLID COLORS
    <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-onyx/80 backdrop-blur-xl border-r border-white/5 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        {/* Header & Switcher */}
        <div className="p-5 border-b border-white/5 space-y-5 bg-transparent">
            {/* Logo Area */}
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-onyx-light flex items-center justify-center border border-white/10 text-gold shadow-sm">
                        <ShieldCheck size={18} />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-white tracking-tight font-mono leading-none">Nuffi<span className="text-gold">.OS</span></h1>
                        <p className="text-[10px] text-zinc-500 font-medium">
                            {activeWorkspace === Workspace.BUSINESS ? 'Enterprise Ed.' : activeWorkspace === Workspace.WALLET ? 'Hardware Ed.' : 'Wealth Ed.'}
                        </p>
                    </div>
                </div>
                <span className="text-[9px] font-bold bg-gold/10 text-gold px-2 py-0.5 rounded border border-gold/20 tracking-wider">{plan}</span>
            </div>

            {/* 3-WAY WORKSPACE SWITCHER */}
            <div className="relative bg-black/40 p-1 rounded-xl border border-white/5 flex backdrop-blur-sm">
                <motion.div 
                    className="absolute top-1 bottom-1 w-[calc(33.33%-3px)] rounded-lg shadow-sm z-0 bg-gold"
                    animate={{ 
                        x: activeWorkspace === Workspace.BUSINESS ? 0 : activeWorkspace === Workspace.INVESTOR ? '100%' : '200%' 
                    }}
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{ left: 4 }}
                />
                
                <button 
                    onClick={() => setWorkspace(Workspace.BUSINESS)}
                    className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-lg text-[10px] font-bold relative z-10 transition-colors ${activeWorkspace === Workspace.BUSINESS ? 'text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <BriefcaseBusiness size={12} /> FIRMA
                </button>
                <button 
                    onClick={() => setWorkspace(Workspace.INVESTOR)}
                    className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-lg text-[10px] font-bold relative z-10 transition-colors ${activeWorkspace === Workspace.INVESTOR ? 'text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <TrendingUp size={12} /> PORTFEL
                </button>
                <button 
                    onClick={() => setWorkspace(Workspace.WALLET)}
                    className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-lg text-[10px] font-bold relative z-10 transition-colors ${activeWorkspace === Workspace.WALLET ? 'text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <Command size={12} /> N.KEY
                </button>
            </div>
        </div>

        {/* Navigation Scroll Area */}
        <div className="flex-1 overflow-y-auto py-4 px-3 sidebar-scroll space-y-8">
            {currentNav.map((section) => (
                <div key={section.id} className="animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="px-3 mb-3 flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest opacity-80">
                        <section.icon size={12} /> {section.title}
                    </div>
                    <div className="space-y-1">
                        {section.items.map((item) => (
                            <button
                                key={item.view}
                                onClick={() => { onChangeView(item.view); if(window.innerWidth < 1024) onClose(); }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all relative group overflow-hidden ${currentView === item.view ? 'bg-white/5 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <div className="flex items-center gap-3 relative z-10">
                                    <item.icon size={18} className={`transition-colors ${currentView === item.view ? 'text-gold' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                                    <span className="truncate font-medium">{item.label}</span>
                                </div>
                                
                                {item.badge && (
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ml-2 relative z-10 ${
                                        item.badge === 'PRO' ? 'bg-purple-900/30 text-purple-400 border-purple-500/30' : 
                                        item.badge === 'AI' ? 'bg-gold/10 text-gold border-gold/20' :
                                        item.badge === 'CORE' ? 'bg-orange-900/30 text-orange-400 border-orange-500/30' :
                                        item.badge === 'LIVE' ? 'bg-red-900/30 text-red-400 border-red-500/30 animate-pulse' :
                                        item.badge === 'APY' ? 'bg-green-900/30 text-green-400 border-green-500/30' :
                                        item.badge === 'DEVICE' ? 'bg-blue-900/30 text-blue-400 border-blue-500/30' :
                                        'bg-zinc-800 text-zinc-400 border-zinc-700'
                                    }`}>
                                        {item.badge}
                                    </span>
                                )}

                                {currentView === item.view && (
                                    <motion.div 
                                        layoutId="activeIndicator"
                                        className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-gold" 
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            {/* Bottom Tools */}
            <div className="mt-8 pt-6 border-t border-white/5">
                <p className="px-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Ekosystem</p>
                
                <button onClick={() => onChangeView(ViewState.INTEGRATIONS)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 ${currentView === ViewState.INTEGRATIONS ? 'bg-white/5 text-white' : ''}`}>
                    <RefreshCw size={18} /> Integracje
                </button>
                <button onClick={() => onChangeView(ViewState.MARKETPLACE)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 ${currentView === ViewState.MARKETPLACE ? 'bg-white/5 text-white' : ''}`}>
                    <Building2 size={18} /> Marketplace
                </button>

                <div className="my-3 h-px bg-white/5 mx-3"></div>

                <button onClick={() => onChangeView(ViewState.DEV_PORTAL)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 ${currentView === ViewState.DEV_PORTAL ? 'bg-white/5 text-white' : ''}`}>
                    <Terminal size={18} /> API & Keys
                </button>
                <button onClick={() => onChangeView(ViewState.DESIGN_SYSTEM)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 ${currentView === ViewState.DESIGN_SYSTEM ? 'bg-white/5 text-white' : ''}`}>
                    <Palette size={18} /> Design Lab
                </button>
                <button onClick={() => onChangeView(ViewState.DESIGN_LAB_TEST)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 ${currentView === ViewState.DESIGN_LAB_TEST ? 'bg-white/5 text-white' : ''}`}>
                    <FlaskConical size={18} className="text-gold" /> Test Designu
                </button>
                <button onClick={() => onChangeView(ViewState.HELP_CENTER)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 ${currentView === ViewState.HELP_CENTER ? 'bg-white/5 text-white' : ''}`}>
                    <GraduationCap size={18} /> Akademia & AI
                </button>
            </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-white/5 bg-transparent">
            <button onClick={() => onChangeView(ViewState.SETTINGS)} className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-white/5 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-onyx-light flex items-center justify-center text-white font-bold border border-white/10 ring-2 ring-transparent group-hover:ring-gold/30 transition-all">
                    JD
                </div>
                <div className="text-left flex-1 min-w-0">
                    <p className="text-sm font-bold text-white group-hover:text-gold transition-colors truncate">Jan Doe</p>
                    <p className="text-xs text-zinc-500 truncate">jan@nuffi.io</p>
                </div>
                <Settings size={18} className="text-zinc-500 group-hover:text-white transition-colors" />
            </button>
        </div>
    </div>
  );
};
