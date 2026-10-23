import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getDemoWeather } from '../services/weather';
import { DEMO_MARKET_PRICES } from '../services/market';
import { getWeatherInfo, formatTemp, formatCurrency, timeAgo, clsx } from '../utils';
import type { WeatherData } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Cloud, Droplets, Wind, Sun, AlertTriangle, TrendingUp, Leaf, MapPin,
  Plus, MessageCircle, ArrowRight, CheckCircle, Clock, Beef, Bird, Fish,
  Thermometer, Eye, Activity, Bell, Calculator, Sprout, FlaskConical,
  Bug, Network, Star, RefreshCw
} from 'lucide-react';

export default function DashboardPage() {
  const { user, activeFarm } = useApp();
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const w = getDemoWeather(activeFarm?.lat, activeFarm?.lng);
    setWeather(w);
  }, [activeFarm]);

  const weatherInfo = weather ? getWeatherInfo(weather.current.weathercode) : null;

  const tempChartData = weather
    ? weather.daily.time.map((t, i) => ({
        day: new Date(t).toLocaleDateString('en-IN', { weekday: 'short' }),
        max: weather.daily.temperature_2m_max[i],
        min: weather.daily.temperature_2m_min[i],
      }))
    : [];

  const crops = [
    { name: 'Paddy', area: '2.0 ac', health: 85, stage: 'Tillering', daysLeft: 55, color: 'bg-green-500' },
    { name: 'Banana', area: '1.5 ac', health: 92, stage: 'Fruit Dev.', daysLeft: 40, color: 'bg-yellow-500' },
    { name: 'Groundnut', area: '1.0 ac', health: 78, stage: 'Flowering', daysLeft: 35, color: 'bg-orange-500' },
  ];

  const alerts = [
    { type: 'warning', icon: Droplets, text: 'Banana field irrigation due today — soil moisture 32%', time: '2h ago' },
    { type: 'info', icon: FlaskConical, text: 'Fertilizer dose 2 due for Groundnut in 3 days', time: '5h ago' },
    { type: 'success', icon: TrendingUp, text: 'Paddy modal price up 8% in Thanjavur APMC', time: '1d ago' },
    { type: 'warning', icon: Bug, text: 'Monitor for Brown Plant Hopper in paddy field', time: '1d ago' },
  ];

  const quickActions = [
    { label: 'Add Record', icon: Plus, to: '/soil-health', color: 'bg-forest text-white' },
    { label: 'Get Advice', icon: Sprout, to: '/crop-advisor', color: 'bg-brand-100 text-forest' },
    { label: 'Ask AgroBot', icon: MessageCircle, to: '/chatbot', color: 'bg-purple-100 text-purple-700' },
    { label: 'Market Prices', icon: TrendingUp, to: '/market', color: 'bg-blue-100 text-blue-700' },
    { label: 'Fertilizer Plan', icon: FlaskConical, to: '/fertilizer', color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Weather', icon: Cloud, to: '/weather', color: 'bg-cyan-100 text-cyan-700' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="section-title">Welcome back, {user.name.split(' ')[0]} 👋</h1>
          <p className="section-subtitle flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {activeFarm?.name} · {activeFarm?.location}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-green">
            <span className="w-1.5 h-1.5 bg-forest rounded-full animate-pulse" />
            Demo Mode
          </span>
          <button className="btn-secondary text-sm py-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <Link to="/settings" className="btn-primary text-sm py-2">
            <Plus className="w-4 h-4" /> Add Farm
          </Link>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Soil pH', value: '6.8', sub: 'Slightly acidic · Good', icon: Activity, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Soil Moisture', value: '48%', sub: 'Adequate · Monitor', icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Active Crops', value: '3', sub: 'Paddy, Banana, Groundnut', icon: Leaf, color: 'text-forest', bg: 'bg-mint dark:bg-brand-900/20' },
          { label: 'Alerts', value: '4', sub: '2 warnings, 1 info', icon: Bell, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
        ].map(s => (
          <div key={s.label} className="card flex items-start gap-4">
            <div className={clsx('p-2.5 rounded-xl flex-shrink-0', s.bg)}>
              <s.icon className={clsx('w-5 h-5', s.color)} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">{s.label}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather card */}
        <div className="card bg-gradient-to-br from-forest to-emerald text-white border-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-white/70 text-sm font-medium">Current Weather</div>
              <div className="text-4xl font-bold mt-1">{weather ? formatTemp(weather.current.temperature) : '--'}</div>
              <div className="text-white/80 text-sm mt-1">{weatherInfo?.label}</div>
              <div className="text-white/60 text-xs mt-0.5">Feels like {weather ? formatTemp(weather.current.apparent_temperature) : '--'}</div>
            </div>
            <div className="text-5xl">{weatherInfo?.emoji ?? '🌥️'}</div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/20">
            {[
              { icon: Droplets, label: 'Humidity', value: `${weather?.current.humidity ?? '--'}%` },
              { icon: Wind, label: 'Wind', value: `${weather?.current.windspeed ?? '--'} km/h` },
              { icon: Sun, label: 'UV Index', value: weather?.current.uvindex.toFixed(0) ?? '--' },
            ].map(m => (
              <div key={m.label} className="text-center">
                <m.icon className="w-4 h-4 mx-auto text-white/70 mb-1" />
                <div className="text-white text-sm font-semibold">{m.value}</div>
                <div className="text-white/60 text-xs">{m.label}</div>
              </div>
            ))}
          </div>
          <Link to="/weather" className="flex items-center gap-1 text-white/70 hover:text-white text-xs mt-4 transition-colors">
            Full forecast <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 7-day temp chart */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">7-Day Temperature</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">Demo weather data · Open-Meteo</p>
            </div>
            <Link to="/weather" className="btn-ghost text-xs py-1.5 px-3">
              Details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={tempChartData}>
              <defs>
                <linearGradient id="maxGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#176B45" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#176B45" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="minGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A3D977" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#A3D977" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} unit="°" />
              <Tooltip formatter={(v: any) => [`${v}°C`]} />
              <Area type="monotone" dataKey="max" stroke="#176B45" fill="url(#maxGrad)" strokeWidth={2} name="Max" />
              <Area type="monotone" dataKey="min" stroke="#A3D977" fill="url(#minGrad)" strokeWidth={2} name="Min" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Crop health */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Crop Health Summary</h3>
              <p className="text-xs text-gray-400">Demo data · {activeFarm?.name}</p>
            </div>
            <Link to="/crop-advisor" className="btn-ghost text-xs py-1.5 px-3">View All <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          <div className="space-y-3">
            {crops.map(c => (
              <div key={c.name} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div className="w-10 h-10 bg-mint dark:bg-brand-900/40 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-5 h-5 text-forest dark:text-lime" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">{c.name}</span>
                    <span className="text-xs text-gray-500">{c.area}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className={clsx('h-full rounded-full', c.color)} style={{ width: `${c.health}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{c.health}%</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">{c.stage}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-500">~{c.daysLeft} days to harvest</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Alerts & Reminders</h3>
            <Link to="/notifications" className="text-xs text-forest dark:text-lime hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {alerts.map((a, i) => (
              <div key={i} className={clsx(
                'flex gap-3 p-2.5 rounded-xl text-sm',
                a.type === 'warning' && 'bg-yellow-50 dark:bg-yellow-900/20',
                a.type === 'info' && 'bg-blue-50 dark:bg-blue-900/20',
                a.type === 'success' && 'bg-green-50 dark:bg-green-900/20',
              )}>
                <a.icon className={clsx('w-4 h-4 mt-0.5 flex-shrink-0',
                  a.type === 'warning' && 'text-yellow-600',
                  a.type === 'info' && 'text-blue-600',
                  a.type === 'success' && 'text-green-600',
                )} />
                <div>
                  <p className="text-gray-700 dark:text-gray-200 text-xs leading-relaxed">{a.text}</p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market prices mini */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Market Prices</h3>
              <p className="text-xs text-orange-500 font-medium">⚠ Demo data only</p>
            </div>
            <Link to="/market" className="btn-ghost text-xs py-1.5 px-3">View All <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          <div className="space-y-2">
            {DEMO_MARKET_PRICES.slice(0, 4).map(p => (
              <div key={p.commodity} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{p.commodity}</div>
                  <div className="text-xs text-gray-400">{p.market}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-forest dark:text-lime">{formatCurrency(p.modalPrice)}</div>
                  <div className="text-xs text-gray-400">/{p.unit}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IFS Overview */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">IFS Enterprises</h3>
            <Link to="/ifs" className="btn-ghost text-xs py-1.5 px-3">Manage <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          <div className="space-y-2">
            {[
              { icon: Leaf,  label: 'Crop Farming', status: 'Active', metric: '3 crops, 4.5 ac', to: '/dashboard' },
              { icon: Beef,  label: 'Dairy', status: 'Active', metric: '12 animals, 55L/day', to: '/ifs/dairy' },
              { icon: Bird,  label: 'Poultry', status: 'Active', metric: '800 birds, 240 eggs/day', to: '/ifs/poultry' },
              { icon: Fish,  label: 'Fish Farming', status: 'Active', metric: '2 ponds, 0.8 ac', to: '/ifs/fish' },
            ].map(e => (
              <Link key={e.label} to={e.to} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                <div className="w-8 h-8 bg-mint dark:bg-brand-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                  <e.icon className="w-4 h-4 text-forest dark:text-lime" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{e.label}</div>
                  <div className="text-xs text-gray-400">{e.metric}</div>
                </div>
                <span className="badge badge-green text-xs">{e.status}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map(a => (
              <Link
                key={a.label}
                to={a.to}
                className={clsx('flex flex-col items-center gap-2 p-3 rounded-xl text-center text-xs font-medium hover:scale-105 transition-transform', a.color)}
              >
                <a.icon className="w-5 h-5" />
                {a.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 p-3 bg-mint dark:bg-brand-900/20 rounded-xl">
            <div className="text-xs font-medium text-forest dark:text-lime mb-1">💬 Recent AgroBot Chat</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">"What fertilizer should I apply for paddy at tillering stage?"</div>
            <Link to="/chatbot" className="text-xs text-forest dark:text-lime hover:underline mt-1 inline-block">Continue chat →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
