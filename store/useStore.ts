
import { create } from 'zustand';
import { UserProfile, Notification, Workspace } from '../types';

interface AppState {
  user: UserProfile | null;
  notifications: Notification[];
  isLoading: boolean;
  activeWorkspace: Workspace;
  
  setUser: (user: UserProfile) => void;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markRead: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setWorkspace: (workspace: Workspace) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  notifications: [],
  isLoading: false,
  activeWorkspace: Workspace.BUSINESS, // Default start

  setUser: (user) => set({ user }),
  setNotifications: (notifications) => set({ notifications }),
  addNotification: (notification) => set((state) => ({ notifications: [notification, ...state.notifications] })),
  markRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setWorkspace: (workspace) => set({ activeWorkspace: workspace }),
}));
