import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Cloud, Sprout, FlaskConical, Bug, TrendingUp,
  Network, MapPin, Droplets, Calculator, Mic, MessageCircle,
  Bell, BookOpen, Settings, ChevronLeft, ChevronRight, Leaf,
  Fish, Beef, Bird, Worm, TreePine, Flame, Hexagon, X, Menu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { clsx } from '../../utils';

const NAV_ITEMS = [
  { path: '/',           label: 'Home',               icon: Leaf,            group: 'main' },
  { path: '/dashboard',  label: 'Dashboard',          icon: LayoutDashboard, group: 'main' },
  { path: '/weather',    label: 'Weather',            icon: Cloud,           group: 'main' },
  { path: '/crop-advisor',label: 'Crop Advisor',      icon: Sprout,          group: 'advisory' },
  { path: '/soil-health',label: 'Soil Health',        icon: Hexagon,         group: 'advisory' },
  { path: '/fertilizer', label: 'Fertilizer',         icon: FlaskConical,    group: 'advisory' },
  { path: '/disease',    label: 'Pest & Disease',     icon: Bug,             group: 'advisory' },
  { path: '/market',     label: 'Market Prices',      icon: TrendingUp,      group: 'advisory' },
  { path: '/ifs',        label: 'Integrated Farming', icon: Network,         group: 'ifs' },
  { path: '/ifs/dairy',  label: '↳ Dairy',            icon: Beef,            group: 'ifs', sub: true },
  { path: '/ifs/poultry',label: '↳ Poultry',          icon: Bird,            group: 'ifs', sub: true },
  { path: '/ifs/fish',   label: '↳ Fish Farming',     icon: Fish,            group: 'ifs', sub: true },
  { path: '/ifs/compost',label: '↳ Composting',       icon: Worm,            group: 'ifs', sub: true },
  { path: '/ifs/biogas', label: '↳ Biogas',           icon: Flame,           group: 'ifs', sub: true },
  { path: '/ifs/agroforestry',label:'↳ Agroforestry', icon: TreePine,        group: 'ifs', sub: true },
  { path: '/precision',  label: 'Precision Ag',       icon: MapPin,          group: 'tools' },
  { path: '/irrigation', label: 'Irrigation',         icon: Droplets,        group: 'tools' },
  { path: '/finance',    label: 'Finance',            icon: Calculator,      group: 'tools' },
  { path: '/chatbot',    label: 'AI Chatbot',         icon: MessageCircle,   group: 'tools' },
  { path: '/voice',      label: 'Voice Assistant',    icon: Mic,             group: 'tools' },
  { path: '/notifications',label: 'Alerts',           icon: Bell,            group: 'info' },
  { path: '/knowledge',  label: 'Knowledge Center',   icon: BookOpen,        group: 'info' },
  { path: '/settings',   label: 'Settings',           icon: Settings,        group: 'info' },
];

const GROUP_LABELS: Record<string, string> = {
  main: 'OVERVIEW',
  advisory: 'ADVISORY',
  ifs: 'INTEGRATED FARMING',
  tools: 'TOOLS',
  info: 'INFORMATION',
};

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ mobile, onClose }: SidebarProps) {
  const { sidebarOpen, toggleSidebar, unreadCount, activeFarm } = useApp();
  const location = useLocation();
  const [ifsExpanded, setIfsExpanded] = useState(
    location.pathname.startsWith('/ifs')
  );

  const collapsed = !mobile && !sidebarOpen;

  const filteredItems = NAV_ITEMS.filter(item => {
    if (item.sub && !ifsExpanded) return false;
    return true;
  });

  let currentGroup = '';

  return (
    <aside
      className={clsx(
        'flex flex-col h-full bg-gradient-brand transition-all duration-300 overflow-hidden',
        collapsed ? 'w-16' : 'w-64',
        mobile && 'w-72'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <img
          src="/favicon.jpg"
          alt="AgroSentinel AI Logo"
          className="w-9 h-9 rounded-xl flex-shrink-0 object-cover shadow-lg"
        />
        {(!collapsed || mobile) && (
          <div className="min-w-0">
            <div className="text-white font-bold text-sm leading-tight">AgroSentinel</div>
            <div className="text-lime text-xs font-medium">AI Platform</div>
          </div>
        )}
        <div className="ml-auto flex items-center gap-1">
          {mobile ? (
            <button onClick={onClose} className="p-1 text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={toggleSidebar}
              className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Farm indicator */}
      {(!collapsed || mobile) && activeFarm && (
        <div className="mx-3 mt-3 px-3 py-2 bg-white/10 rounded-xl">
          <div className="text-white/60 text-xs">Active Farm</div>
          <div className="text-white text-sm font-medium truncate">{activeFarm.name}</div>
          <div className="text-lime text-xs truncate">{activeFarm.location}</div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-3 px-2">
        {filteredItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));
          const showGroupLabel = !collapsed && !mobile && item.group !== currentGroup && !item.sub;

          if (!item.sub) currentGroup = item.group;

          return (
            <div key={item.path}>
              {showGroupLabel && (
                <div className="px-3 pt-4 pb-1 text-white/40 text-xs font-semibold tracking-widest">
                  {GROUP_LABELS[item.group]}
                </div>
              )}
              {item.path === '/ifs' ? (
                <button
                  onClick={() => setIfsExpanded(v => !v)}
                  className={clsx(
                    'nav-link w-full text-left',
                    isActive && 'active'
                  )}
                >
                  <Icon className="w-4.5 h-4.5 flex-shrink-0" style={{width:'18px',height:'18px'}} />
                  {(!collapsed || mobile) && (
                    <>
                      <span className="flex-1 truncate">{item.label}</span>
                      <ChevronRight className={clsx('w-3.5 h-3.5 transition-transform', ifsExpanded && 'rotate-90')} />
                    </>
                  )}
                </button>
              ) : (
                <Link
                  to={item.path}
                  onClick={mobile ? onClose : undefined}
                  className={clsx(
                    'nav-link',
                    isActive && 'active',
                    item.sub && (!collapsed) && 'pl-6'
                  )}
                >
                  <Icon className="flex-shrink-0" style={{width:'16px',height:'16px'}} />
                  {(!collapsed || mobile) && (
                    <span className="flex-1 truncate text-sm">{item.label}</span>
                  )}
                  {item.path === '/notifications' && unreadCount > 0 && (!collapsed || mobile) && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom version */}
      {(!collapsed || mobile) && (
        <div className="px-4 py-3 border-t border-white/10 text-white/40 text-xs">
          AgroSentinel AI v1.0
        </div>
      )}
    </aside>
  );
}
