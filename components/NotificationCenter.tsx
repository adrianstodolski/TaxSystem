
import React, { useEffect, useState, useRef } from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info, X, Clock, ChevronRight } from 'lucide-react';
import { Notification, ViewState } from '../types';
import { NuffiService } from '../services/api';

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
          case 'SUCCESS': return <CheckCircle2 size={16} className="text-green-600" />;
          case 'WARNING': return <AlertTriangle size={16} className="text-amber-600" />;
          case 'INFO': return <Info size={16} className="text-blue-600" />;
          default: return <Info size={16} />;
      }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-full transition-colors ${isOpen ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
        )}
      </button>

      {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 origin-top-right">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="font-bold text-gray-900 text-sm">Powiadomienia</h3>
                  {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-xs text-indigo-600 font-medium hover:text-indigo-800">
                          Oznacz wszystkie
                      </button>
                  )}
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-400 text-sm">
                          Brak nowych powiadomień
                      </div>
                  ) : (
                      <div className="divide-y divide-gray-50">
                          {notifications.map(n => (
                              <div key={n.id} className={`p-4 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-indigo-50/30' : ''}`}>
                                  <div className="flex gap-3 items-start">
                                      <div className={`mt-0.5 p-1.5 rounded-full shrink-0 ${
                                          n.type === 'SUCCESS' ? 'bg-green-100' : 
                                          n.type === 'WARNING' ? 'bg-amber-100' : 'bg-blue-100'
                                      }`}>
                                          {getIcon(n.type)}
                                      </div>
                                      <div className="flex-1">
                                          <div className="flex justify-between items-start">
                                              <h4 className={`text-sm ${!n.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{n.title}</h4>
                                              <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2 flex items-center gap-1">
                                                  <Clock size={10} /> {n.timestamp}
                                              </span>
                                          </div>
                                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{n.message}</p>
                                          
                                          {n.action && (
                                              <button 
                                                onClick={() => handleAction(n)}
                                                className="mt-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 flex items-center gap-1 transition-colors"
                                              >
                                                  {n.action.label} <ChevronRight size={12} />
                                              </button>
                                          )}
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};
