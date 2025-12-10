
import React, { useState } from 'react';
import { NavSection, ViewState } from '../types';
import { 
    LayoutDashboard, Wallet, Layers, ShieldCheck, Cpu, Globe, 
    CreditCard, Users, FolderKanban, Package, Car, MapPin, 
    Briefcase, FileText, Magnet, Telescope, ShieldAlert, Archive, 
    BookOpen, PieChart, Leaf, FileBarChart, Download, UploadCloud, 
    Calculator, BarChart2, BrainCircuit, Terminal, Server, GraduationCap, 
    Settings, LogOut, ChevronDown, ChevronRight, Zap,
    RefreshCw, TrendingUp, Bitcoin, Home, Search, Radar, Wand2 as MagicWand
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  plan: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, plan, isOpen, onClose }) => {
  const [expandedHub, setExpandedHub] = useState<string>('FINANCE');

  const navigation: NavSection[] = [
      {
          id: 'INTELLIGENCE',
          title: 'Intelligence HQ',
          icon: BrainCircuit,
          items: [
              { view: ViewState.DASHBOARD, label: 'Command Center', icon: LayoutDashboard },
              { view: ViewState.PREDICTIVE_TAX, label: 'Predictive AI', icon: Telescope, badge: 'PRO' },
              { view: ViewState.RISK_CENTER, label: 'Risk & Compliance', icon: ShieldAlert },
              { view: ViewState.ESG, label: 'ESG Sustainability', icon: Leaf },
              { view: ViewState.MARKET_INTEL, label: 'Market Benchmarks', icon: BarChart2 },
          ]
      },
      {
          id: 'FINANCE',
          title: 'Finance OS',
          icon: Wallet,
          items: [
              { view: ViewState.YAPILY_CONNECT, label: 'Banking Core', icon: Wallet },
              { view: ViewState.TREASURY, label: 'Treasury & FX', icon: Layers },
              { view: ViewState.NUFFI_PAY, label: 'Merchant Gateway', icon: CreditCard },
              { view: ViewState.CARDS, label: 'Corporate Cards', icon: CreditCard },
              { view: ViewState.SUBSCRIPTIONS, label: 'Subscription Mgr', icon: RefreshCw },
          ]
      },
      {
          id: 'INVESTMENT',
          title: 'Investment Deck',
          icon: TrendingUp,
          items: [
              { view: ViewState.CRYPTO_HUB, label: 'Crypto & DeFi', icon: Bitcoin },
              { view: ViewState.WEALTH, label: 'Stocks & ETF', icon: TrendingUp },
              { view: ViewState.DERIVATIVES, label: 'Derivatives', icon: Layers, badge: 'NEW' },
              { view: ViewState.BONDS, label: 'Bonds', icon: FileText },
              { view: ViewState.REAL_ESTATE, label: 'Real Estate', icon: Home },
              { view: ViewState.DEFI_ARCHEOLOGY, label: 'DeFi Forensics', icon: Search, badge: 'AI' },
              { view: ViewState.WHALE_WATCHER, label: 'Whale Watcher', icon: Radar, badge: 'PRO' },
          ]
      },
      {
          id: 'ACCOUNTING',
          title: 'Accounting Core',
          icon: BookOpen,
          items: [
              { view: ViewState.TAX_ENGINE, label: 'Tax Engine (Rust)', icon: Cpu, badge: 'CORE' },
              { view: ViewState.GENERAL_LEDGER, label: 'General Ledger', icon: BookOpen },
              { view: ViewState.TAX_WIZARD, label: 'Tax Wizard', icon: MagicWand },
              { view: ViewState.DOCUMENTS, label: 'Documents (KSeF)', icon: FileText },
              { view: ViewState.TAX_OPTIMIZER, label: 'Tax Optimizer', icon: Magnet },
              { view: ViewState.AUDIT_DEFENDER, label: 'Audit Defender', icon: ShieldCheck },
              { view: ViewState.REPORTS, label: 'Reports BI', icon: FileBarChart },
          ]
      },
      {
          id: 'OPERATIONS',
          title: 'Operations',
          icon: Briefcase,
          items: [
              { view: ViewState.CONTRACTORS, label: 'CRM & Network', icon: Users },
              { view: ViewState.PROJECTS, label: 'Projects', icon: FolderKanban },
              { view: ViewState.PAYROLL, label: 'Payroll (HR)', icon: Users },
              { view: ViewState.WAREHOUSE, label: 'Warehouse (WMS)', icon: Package },
              { view: ViewState.VEHICLES, label: 'Fleet Mgmt', icon: Car },
              { view: ViewState.BUSINESS_TRAVEL, label: 'Travel & Expenses', icon: MapPin },
          ]
      }
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 border-r border-slate-900/50 backdrop-blur-xl flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Brand Area */}
        <div className="h-16 flex items-center px-6 border-b border-white/5">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-900/20">
                    <ShieldCheck className="text-white" size={18} />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white tracking-tight font-mono">Nuffi<span className="text-indigo-500">.OS</span></h1>
                </div>
            </div>
            <div className="ml-auto">
                <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">{plan}</span>
            </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
            <div className="space-y-1">
                {navigation.map((section) => (
                    <div key={section.id} className="mb-2">
                        <button
                            onClick={() => setExpandedHub(expandedHub === section.id ? '' : section.id)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${expandedHub === section.id ? 'bg-white/5 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
                        >
                            <div className="flex items-center gap-3">
                                <section.icon size={18} className={`${expandedHub === section.id ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                                <span className="text-sm font-semibold tracking-wide">{section.title}</span>
                            </div>
                            <ChevronRight size={14} className={`transition-transform duration-200 ${expandedHub === section.id ? 'rotate-90 text-indigo-400' : 'text-slate-600'}`} />
                        </button>

                        <AnimatePresence>
                            {expandedHub === section.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pl-4 pr-1 py-2 space-y-0.5 border-l border-white/5 ml-4 mt-1">
                                        {section.items.map((item) => (
                                            <button
                                                key={item.view}
                                                onClick={() => { onChangeView(item.view); if(window.innerWidth < 1024) onClose(); }}
                                                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-all relative group ${currentView === item.view ? 'bg-indigo-600/10 text-indigo-300' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon size={16} className={`transition-colors ${currentView === item.view ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
                                                    <span className="truncate">{item.label}</span>
                                                </div>
                                                {item.badge && (
                                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                                                        item.badge === 'PRO' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                                                        item.badge === 'AI' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                        item.badge === 'CORE' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                        'bg-slate-700 text-slate-300 border-slate-600'
                                                    }`}>
                                                        {item.badge}
                                                    </span>
                                                )}
                                                {currentView === item.view && (
                                                    <motion.div layoutId="activeNav" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-indigo-500 rounded-r-full -ml-[17px]" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            {/* Dev & Tools Section */}
            <div className="mt-6 pt-6 border-t border-white/5">
                <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Developer Zone</p>
                <button onClick={() => onChangeView(ViewState.DEV_PORTAL)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 ${currentView === ViewState.DEV_PORTAL ? 'bg-white/5 text-white' : ''}`}>
                    <Terminal size={16} /> API & Keys
                </button>
                <button onClick={() => onChangeView(ViewState.SYSTEM_STATUS)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 ${currentView === ViewState.SYSTEM_STATUS ? 'bg-white/5 text-white' : ''}`}>
                    <Server size={16} /> System Status
                </button>
            </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-white/5 bg-slate-900/50">
            <button onClick={() => onChangeView(ViewState.SETTINGS)} className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/5 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-inner">
                    JD
                </div>
                <div className="text-left flex-1">
                    <p className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">Jan Doe</p>
                    <p className="text-xs text-slate-500">CEO @ Nuffi</p>
                </div>
                <Settings size={16} className="text-slate-500 group-hover:text-white transition-colors" />
            </button>
        </div>
    </div>
  );
};
