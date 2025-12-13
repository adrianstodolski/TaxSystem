
import React, { useEffect, useState, useRef } from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info, X, Clock, ChevronRight } from 'lucide-react';
import { Notification, ViewState } from '../types';
import { NuffiService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationCenterProps {
  onNavigate: (view: ViewState) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onNavigate }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
      setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async () => {
      const data = await NuffiService.fetchNotifications();
      setNotifications(data);
  };

  const markAsRead = (id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n));
  };

  const markAllAsRead = () => {
      setNotifications(prev => prev.map(n => ({...n, read: true})));
  };

  const handleAction = (notification: Notification) => {
      markAsRead(notification.id);
      setIsOpen(false);
      if(notification.action?.actionType === 'NAVIGATE' && notification.action.target) {
          onNavigate(notification.action.target);
      }
  };

  const getIcon = (type: string) => {
      switch(type) {
          case 'SUCCESS': return <CheckCircle2 size={16} className="text-emerald-400" />;
          case 'WARNING': return <AlertTriangle size={16} className="text-amber-400" />;
          case 'INFO': return <Info size={16} className="text-blue-400" />;
          default: return <Info size={16} />;
      }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition-all border ${isOpen ? 'bg-white/10 text-white border-white/10' : 'text-zinc-400 hover:text-white border-transparent hover:bg-white/5'}`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_5px_#ef4444] animate-pulse"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
            <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-3 w-80 bg-[#0A0A0C]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden origin-top-right"
            >
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <h3 className="font-bold text-white text-sm">Powiadomienia</h3>
                    {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="text-[10px] text-gold font-bold uppercase hover:text-[#FCD34D] tracking-wider border border-gold/20 px-2 py-0.5 rounded bg-gold/5 transition-colors">
                            Oznacz wszystkie
                        </button>
                    )}
                </div>

                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-zinc-500 text-sm">
                            Brak nowych powiadomień
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {notifications.map(n => (
                                <div key={n.id} className={`p-4 hover:bg-white/5 transition-colors group ${!n.read ? 'bg-white/[0.02]' : ''}`}>
                                    <div className="flex gap-3 items-start">
                                        <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 border ${
                                            n.type === 'SUCCESS' ? 'bg-emerald-500/10 border-emerald-500/20' : 
                                            n.type === 'WARNING' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-blue-500/10 border-blue-500/20'
                                        }`}>
                                            {getIcon(n.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className={`text-sm ${!n.read ? 'font-bold text-white' : 'font-medium text-zinc-300'}`}>{n.title}</h4>
                                                <span className="text-[10px] text-zinc-500 whitespace-nowrap ml-2 flex items-center gap-1 font-mono">
                                                    {n.timestamp}
                                                </span>
                                            </div>
                                            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{n.message}</p>
                                            
                                            {n.action && (
                                                <button 
                                                  onClick={() => handleAction(n)}
                                                  className="mt-2 text-xs font-bold text-gold bg-gold/10 px-3 py-1.5 rounded-lg hover:bg-gold/20 flex items-center gap-1 transition-colors border border-gold/20 w-full justify-center"
                                                >
                                                    {n.action.label} <ChevronRight size={12} />
                                                </button>
                                            )}
                                        </div>
                                        {!n.read && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-2"></div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
