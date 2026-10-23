import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search, Bell, Sun, Moon, Globe, Menu,
  User, Settings, LogOut, ChevronDown, Leaf
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { clsx, timeAgo } from '../../utils';
import type { Language } from '../../types';

const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English',    native: 'English' },
  { code: 'ta', label: 'Tamil',      native: 'தமிழ்' },
  { code: 'hi', label: 'Hindi',      native: 'हिंदी' },
  { code: 'ml', label: 'Malayalam',  native: 'മലയാളം' },
  { code: 'te', label: 'Telugu',     native: 'తెలుగు' },
  { code: 'kn', label: 'Kannada',    native: 'ಕನ್ನಡ' },
];

const BREADCRUMB_MAP: Record<string, string> = {
  '':               'Home',
  'dashboard':      'Dashboard',
  'weather':        'Weather Intelligence',
  'crop-advisor':   'Crop Advisor',
  'soil-health':    'Soil Health',
  'fertilizer':     'Fertilizer Advisor',
  'disease':        'Pest & Disease',
  'market':         'Market Prices',
  'ifs':            'Integrated Farming',
  'precision':      'Precision Agriculture',
  'irrigation':     'Irrigation',
  'finance':        'Farm Finance',
  'chatbot':        'AI Chatbot',
  'voice':          'Voice Assistant',
  'notifications':  'Alerts',
  'knowledge':      'Knowledge Center',
  'settings':       'Settings',
  'dairy':          'Dairy Farming',
  'poultry':        'Poultry Farming',
  'fish':           'Fish Farming',
  'compost':        'Composting',
  'biogas':         'Biogas',
  'agroforestry':   'Agroforestry',
};

export default function TopBar() {
  const { theme, setTheme, language, setLanguage, notifications, unreadCount, markNotificationRead, markAllRead, toggleSidebar } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState('');

  const notifsRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) setShowNotifs(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setShowLang(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Breadcrumbs
  const segments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    { label: 'AgroSentinel', path: '/' },
    ...segments.map((seg, i) => ({
      label: BREADCRUMB_MAP[seg] ?? seg,
      path: '/' + segments.slice(0, i + 1).join('/'),
    })),
  ];

  const currentLang = LANGUAGES.find(l => l.code === language);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/knowledge?q=${encodeURIComponent(search)}`);
      setSearch('');
    }
  }

  const severityColors: Record<string, string> = {
    critical: 'bg-red-500',
    warning: 'bg-yellow-500',
    success: 'bg-green-500',
    info: 'bg-blue-500',
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4 px-4 flex-shrink-0 z-10">
      {/* Hamburger (mobile) */}
      <button
        onClick={toggleSidebar}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-500 dark:text-gray-400"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Breadcrumbs */}
      <nav className="hidden md:flex items-center gap-1 text-sm flex-1 min-w-0">
        {breadcrumbs.map((b, i) => (
          <span key={b.path} className="flex items-center gap-1 min-w-0">
            {i > 0 && <span className="text-gray-300 dark:text-gray-600">/</span>}
            {i === breadcrumbs.length - 1 ? (
              <span className="text-gray-700 dark:text-gray-200 font-medium truncate">{b.label}</span>
            ) : (
              <Link to={b.path} className="text-gray-400 dark:text-gray-500 hover:text-forest dark:hover:text-lime transition-colors truncate">
                {b.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* Search */}
      <form onSubmit={handleSearch} className="hidden lg:flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 w-64 group focus-within:border-forest dark:focus-within:border-lime transition-colors">
        <Search className="w-4 h-4 text-gray-400 group-focus-within:text-forest flex-shrink-0" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search knowledge..."
          className="bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 outline-none flex-1 min-w-0"
        />
      </form>

      {/* Right actions */}
      <div className="flex items-center gap-1 ml-auto md:ml-0">

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-500 dark:text-gray-400"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        {/* Language */}
        <div ref={langRef} className="relative">
          <button
            onClick={() => { setShowLang(v => !v); setShowNotifs(false); setShowProfile(false); }}
            className="flex items-center gap-1 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-500 dark:text-gray-400"
          >
            <Globe className="w-5 h-5" />
            <span className="hidden sm:block text-xs font-medium">{currentLang?.native}</span>
            <ChevronDown className="w-3 h-3 hidden sm:block" />
          </button>
          {showLang && (
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl w-48 py-1 z-50 animate-fade-in">
              {LANGUAGES.map(l => (
                <button
                  key={l.code}
                  onClick={() => { setLanguage(l.code); setShowLang(false); }}
                  className={clsx(
                    'flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
                    language === l.code ? 'text-forest dark:text-lime font-semibold' : 'text-gray-700 dark:text-gray-200'
                  )}
                >
                  <span className="font-medium">{l.native}</span>
                  <span className="text-gray-400 dark:text-gray-500 text-xs">{l.label}</span>
                  {language === l.code && <span className="ml-auto text-forest dark:text-lime">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div ref={notifsRef} className="relative">
          <button
            onClick={() => { setShowNotifs(v => !v); setShowLang(false); setShowProfile(false); }}
            className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-500 dark:text-gray-400"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          {showNotifs && (
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl w-96 max-h-96 overflow-y-auto z-50 animate-fade-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="font-semibold text-gray-900 dark:text-white">Notifications</span>
                <button onClick={markAllRead} className="text-xs text-forest dark:text-lime hover:underline">Mark all read</button>
              </div>
              {notifications.slice(0, 8).map(n => (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={clsx(
                    'flex gap-3 px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors',
                    !n.isRead && 'bg-mint/30 dark:bg-brand-900/20'
                  )}
                >
                  <div className={clsx('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', severityColors[n.severity])} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{n.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.message}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{timeAgo(n.timestamp)}</div>
                  </div>
                  {!n.isRead && <div className="w-2 h-2 bg-forest rounded-full flex-shrink-0 mt-1.5" />}
                </div>
              ))}
              <div className="px-4 py-3 text-center">
                <Link to="/notifications" onClick={() => setShowNotifs(false)} className="text-sm text-forest dark:text-lime hover:underline font-medium">
                  View all alerts
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setShowProfile(v => !v); setShowNotifs(false); setShowLang(false); }}
            className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <img src="/favicon.jpg" alt="AgroSentinel AI" className="w-8 h-8 rounded-xl object-cover shadow" />
            <ChevronDown className="w-3 h-3 text-gray-400 dark:text-gray-500 hidden sm:block" />
          </button>
          {showProfile && (
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl w-52 py-1 z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <div className="font-semibold text-gray-900 dark:text-white text-sm">Rajan Sundaram</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Thanjavur, TN</div>
                <div className="text-xs text-forest dark:text-lime mt-1">Demo Mode Active</div>
              </div>
              <Link to="/settings" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                <User className="w-4 h-4" /> Profile
              </Link>
              <Link to="/settings" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Settings className="w-4 h-4" /> Settings
              </Link>
              <div className="border-t border-gray-100 dark:border-gray-700 mt-1">
                <button className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
