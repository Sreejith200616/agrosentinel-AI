import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, Farm, Theme, Language, Notification } from '../types';

// ── Demo seed data ──────────────────────────────────────────────
const DEMO_FARM: Farm = {
  id: 'farm-1',
  name: 'Sundaram Farm',
  location: 'Thanjavur, Tamil Nadu',
  lat: 10.787,
  lng: 79.1378,
  area: 4.5,
  areaUnit: 'acres',
  crops: ['Paddy', 'Banana', 'Groundnut'],
  soilType: 'Black Cotton',
  irrigationType: 'Drip',
  createdAt: '2024-01-15T00:00:00Z',
};

const DEMO_USER: User = {
  id: 'user-demo',
  name: 'Rajan Sundaram',
  email: 'rajan@agrosentinel.demo',
  phone: '+91-9876543210',
  state: 'Tamil Nadu',
  district: 'Thanjavur',
  language: 'en',
  farms: [DEMO_FARM],
  activeFarmId: 'farm-1',
  createdAt: '2024-01-01T00:00:00Z',
};

const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'weather',
    title: 'Heavy Rain Alert',
    message: 'Heavy rainfall (45mm) expected in Thanjavur tomorrow. Consider delaying irrigation.',
    severity: 'warning',
    isRead: false,
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 'n2',
    type: 'crop',
    title: 'Paddy Harvest Window',
    message: 'Your Paddy crop is approaching harvest stage (85 days). Prepare harvesting equipment.',
    severity: 'info',
    isRead: false,
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 'n3',
    type: 'irrigation',
    title: 'Irrigation Due',
    message: 'Banana field scheduled for irrigation today. Soil moisture at 32% (below threshold).',
    severity: 'warning',
    isRead: false,
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
  {
    id: 'n4',
    type: 'fertilizer',
    title: 'Fertilizer Application Reminder',
    message: 'Second split dose of NPK fertilizer due for Groundnut within 3 days.',
    severity: 'info',
    isRead: true,
    timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: 'n5',
    type: 'market',
    title: 'Paddy Price Up 8%',
    message: 'Paddy modal price increased to ₹2,150/quintal in Thanjavur APMC. Good selling opportunity.',
    severity: 'success',
    isRead: true,
    timestamp: new Date(Date.now() - 36 * 3600000).toISOString(),
  },
];

// ── Context interfaces ──────────────────────────────────────────
interface AppContextType {
  user: User;
  activeFarm: Farm | undefined;
  theme: Theme;
  language: Language;
  notifications: Notification[];
  unreadCount: number;
  sidebarOpen: boolean;
  isDemo: boolean;

  setTheme: (t: Theme) => void;
  setLanguage: (l: Language) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (v: boolean) => void;
  setActiveFarm: (farmId: string) => void;
  addFarm: (farm: Farm) => void;
  updateFarm: (farm: Farm) => void;
  deleteFarm: (farmId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (n: Notification) => void;
  updateUser: (u: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(DEMO_USER);
  const [theme, setThemeState] = useState<Theme>('light');
  const [language, setLang] = useState<Language>('en');
  const [notifications, setNotifications] = useState<Notification[]>(DEMO_NOTIFICATIONS);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activeFarm = user.farms.find(f => f.id === user.activeFarmId);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const setLanguage = useCallback((l: Language) => {
    setLang(l);
    setUser(u => ({ ...u, language: l }));
  }, []);

  const toggleSidebar = useCallback(() => setSidebarOpen(v => !v), []);

  const setActiveFarm = useCallback((farmId: string) => {
    setUser(u => ({ ...u, activeFarmId: farmId }));
  }, []);

  const addFarm = useCallback((farm: Farm) => {
    setUser(u => ({ ...u, farms: [...u.farms, farm], activeFarmId: farm.id }));
  }, []);

  const updateFarm = useCallback((farm: Farm) => {
    setUser(u => ({ ...u, farms: u.farms.map(f => f.id === farm.id ? farm : f) }));
  }, []);

  const deleteFarm = useCallback((farmId: string) => {
    setUser(u => {
      const farms = u.farms.filter(f => f.id !== farmId);
      return { ...u, farms, activeFarmId: farms[0]?.id };
    });
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, isRead: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(ns => ns.map(n => ({ ...n, isRead: true })));
  }, []);

  const addNotification = useCallback((n: Notification) => {
    setNotifications(ns => [n, ...ns]);
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser(u => ({ ...u, ...data }));
  }, []);

  return (
    <AppContext.Provider value={{
      user, activeFarm, theme, language, notifications, unreadCount,
      sidebarOpen, isDemo: true,
      setTheme, setLanguage, toggleSidebar, setSidebarOpen,
      setActiveFarm, addFarm, updateFarm, deleteFarm,
      markNotificationRead, markAllRead, addNotification, updateUser,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
