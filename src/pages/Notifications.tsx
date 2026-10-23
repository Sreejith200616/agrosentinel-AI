import { useApp } from '../context/AppContext';
import { Bell, CheckCircle, AlertTriangle, Info, TrendingUp, Droplets, Bug, Leaf, Trash2 } from 'lucide-react';
import { clsx } from '../utils';

const DEMO_NOTIFICATIONS = [
  { id: '1', type: 'warning', icon: Droplets, title: 'Irrigation Due', body: 'Banana field soil moisture at 32% — irrigation recommended today.', time: '2h ago', read: false },
  { id: '2', type: 'info', icon: TrendingUp, title: 'Market Price Alert', body: 'Paddy modal price up 8% at Thanjavur APMC. Current: ₹2,250/quintal (demo).', time: '4h ago', read: false },
  { id: '3', type: 'warning', icon: Bug, title: 'Pest Advisory', body: 'Monitor paddy fields for Brown Plant Hopper (BPH) outbreak risk this week. Check stem bases.', time: '6h ago', read: true },
  { id: '4', type: 'success', icon: CheckCircle, title: 'Soil Test Report Ready', body: 'Your latest soil test (Oct 15) has been analyzed. Soil health score: 78/100.', time: '1d ago', read: true },
  { id: '5', type: 'info', icon: Leaf, title: 'Fertilizer Reminder', body: 'Second dose of fertilizer due for groundnut crop in 3 days. See Fertilizer Advisor.', time: '1d ago', read: true },
  { id: '6', type: 'info', icon: Info, title: 'Weather Advisory', body: 'Northeast monsoon expected to be 15% above normal for Cauvery delta region this season.', time: '2d ago', read: true },
  { id: '7', type: 'success', icon: CheckCircle, title: 'Biogas Plant Active', body: 'Daily gas output: 1.3 m³. Digestate ready for composting unit.', time: '2d ago', read: true },
  { id: '8', type: 'warning', icon: AlertTriangle, title: 'Harvest Window Alert', body: 'Groundnut forecast maturity in 12 days. Plan harvest logistics.', time: '3d ago', read: true },
];

function typeColor(type: string) {
  if (type === 'warning') return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
  if (type === 'success') return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
  return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
}

function iconColor(type: string) {
  if (type === 'warning') return 'text-yellow-600 dark:text-yellow-400';
  if (type === 'success') return 'text-green-600 dark:text-green-400';
  return 'text-blue-600 dark:text-blue-400';
}

export default function NotificationsPage() {
  const { notifications } = useApp();
  const unread = DEMO_NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Notifications</h1>
          <p className="section-subtitle">{unread} unread alerts and reminders</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost text-sm"><CheckCircle className="w-4 h-4" /> Mark All Read</button>
          <button className="btn-ghost text-sm text-red-500"><Trash2 className="w-4 h-4" /> Clear All</button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {['All','Unread','Alerts','Reminders','Updates'].map(tab => (
          <button key={tab} className={clsx('px-4 py-2 rounded-xl text-sm font-medium transition-colors',
            tab === 'All' ? 'bg-forest text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700')}>
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="space-y-3">
        {unread > 0 && (
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">
            New ({unread})
          </div>
        )}
        
        {DEMO_NOTIFICATIONS.map((n, i) => {
          const isNewSection = !n.read && i === 0;
          const isReadSection = n.read && (i === 0 || !DEMO_NOTIFICATIONS[i - 1].read);
          
          return (
            <div key={n.id}>
              {isReadSection && (
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1 mt-4 mb-2">
                  Earlier
                </div>
              )}
              <div className={clsx(
                'flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md',
                typeColor(n.type),
                !n.read && 'ring-2 ring-forest/20 dark:ring-lime/20',
              )}>
                <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/60 dark:bg-gray-900/40', iconColor(n.type))}>
                  <n.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">{n.title}</span>
                    {!n.read && <span className="w-2 h-2 bg-forest rounded-full flex-shrink-0" />}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5 leading-relaxed">{n.body}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{n.time}</p>
                </div>
                <button className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notification settings link */}
      <div className="card text-center">
        <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Configure which alerts you receive in</p>
        <a href="/settings" className="text-forest dark:text-lime text-sm hover:underline font-medium">Settings → Notifications</a>
      </div>
    </div>
  );
}
