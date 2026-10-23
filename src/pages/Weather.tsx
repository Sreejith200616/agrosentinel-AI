import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Cloud, Droplets, Wind, Sun, AlertTriangle, MapPin, Thermometer,
  RefreshCw, CheckCircle, XCircle, AlertCircle, Sunrise, Sunset,
  Eye, ArrowUp, ArrowDown
} from 'lucide-react';
import { fetchWeather, getDemoWeather } from '../services/weather';
import { getWeatherInfo, formatTemp, windDirection, getUVIndex, formatDate, formatTime, clsx } from '../utils';
import type { WeatherData } from '../types';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts';

const LOCATIONS = [
  { name: 'Thanjavur', lat: 10.787, lng: 79.1378 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Coimbatore', lat: 11.0168, lng: 76.9558 },
  { name: 'Madurai', lat: 9.9252, lng: 78.1198 },
  { name: 'Trichy', lat: 10.7905, lng: 78.7047 },
  { name: 'Salem', lat: 11.6643, lng: 78.1460 },
];

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);

  async function loadWeather(lat: number, lng: number) {
    setLoading(true);
    try {
      const data = await fetchWeather(lat, lng);
      setWeather(data);
      setIsDemo(false);
    } catch {
      const data = getDemoWeather(lat, lng);
      setWeather(data);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadWeather(selectedLocation.lat, selectedLocation.lng); }, [selectedLocation]);

  const winfo = weather ? getWeatherInfo(weather.current.weathercode) : null;
  const uvInfo = weather ? getUVIndex(weather.current.uvindex) : null;

  // Hourly data for next 24h
  const hourlyData = weather
    ? weather.hourly.time.slice(0, 24).map((t, i) => ({
        time: new Date(t).toLocaleTimeString('en-IN', { hour: '2-digit' }),
        temp: weather.hourly.temperature_2m[i],
        rain: weather.hourly.precipitation_probability[i],
        code: weather.hourly.weathercode[i],
      }))
    : [];

  // Daily forecast
  const dailyData = weather?.daily.time.map((t, i) => ({
    date: t,
    label: formatDate(t),
    max: weather.daily.temperature_2m_max[i],
    min: weather.daily.temperature_2m_min[i],
    rain: weather.daily.precipitation_sum[i],
    rainProb: weather.daily.precipitation_probability_max[i],
    code: weather.daily.weathercode[i],
    wind: weather.daily.windspeed_10m_max[i],
    sunrise: weather.daily.sunrise[i],
    sunset: weather.daily.sunset[i],
    uv: weather.daily.uv_index_max[i],
  })) ?? [];

  // Agricultural window assessment
  const agWindows = weather ? [
    {
      activity: 'Irrigation',
      icon: Droplets,
      status: weather.daily.precipitation_probability_max[0] > 60 ? 'postpone' : 'good',
      reason: weather.daily.precipitation_probability_max[0] > 60
        ? 'High rain probability (>60%) — consider postponing'
        : 'Low rain expected — good time to irrigate',
    },
    {
      activity: 'Spraying',
      icon: Wind,
      status: weather.current.windspeed > 25 ? 'avoid' : weather.current.windspeed > 15 ? 'caution' : 'good',
      reason: weather.current.windspeed > 25 ? 'Wind too high (>25 km/h) — spray drift risk'
        : weather.current.windspeed > 15 ? 'Moderate wind — spray with caution'
        : 'Wind conditions suitable for spraying',
    },
    {
      activity: 'Sowing',
      icon: Sun,
      status: weather.daily.temperature_2m_max[0] > 38 ? 'caution' : 'good',
      reason: weather.daily.temperature_2m_max[0] > 38
        ? 'High temperature — sow in early morning'
        : 'Temperature suitable for field operations',
    },
    {
      activity: 'Harvesting',
      icon: CheckCircle,
      status: weather.daily.precipitation_probability_max[0] > 50 ? 'postpone' : 'good',
      reason: weather.daily.precipitation_probability_max[0] > 50
        ? 'Rain expected — risk of grain quality loss'
        : 'Dry conditions suitable for harvesting',
    },
  ] : [];

  // Alerts
  const weatherAlerts = weather ? [
    ...(weather.daily.precipitation_probability_max[0] > 70 ? [{
      type: 'warning', icon: AlertTriangle,
      title: 'Heavy Rain Alert',
      msg: `Rain probability ${weather.daily.precipitation_probability_max[0]}% tomorrow. Expected: ${weather.daily.precipitation_sum[1]?.toFixed(1)} mm. Delay field operations.`,
    }] : []),
    ...(weather.daily.temperature_2m_max[0] > 38 ? [{
      type: 'warning', icon: Thermometer,
      title: 'Heat Stress Alert',
      msg: `Max temp ${formatTemp(weather.daily.temperature_2m_max[0])} expected. Irrigate crops in early morning. Avoid afternoon fieldwork.`,
    }] : []),
    ...(weather.daily.windspeed_10m_max[0] > 40 ? [{
      type: 'critical', icon: Wind,
      title: 'Strong Wind Warning',
      msg: `Wind speeds up to ${weather.daily.windspeed_10m_max[0]} km/h. Avoid spraying. Secure shade nets and greenhouse covers.`,
    }] : []),
  ] : [];

  const statusIcon = (s: string) => {
    if (s === 'good') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (s === 'caution') return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="section-title">Weather Intelligence</h1>
          <p className="section-subtitle">Real-time forecast and agricultural planning</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedLocation.name}
            onChange={e => setSelectedLocation(LOCATIONS.find(l => l.name === e.target.value) ?? LOCATIONS[0])}
            className="input py-2 w-44"
          >
            {LOCATIONS.map(l => <option key={l.name}>{l.name}</option>)}
          </select>
          <button onClick={() => loadWeather(selectedLocation.lat, selectedLocation.lng)} className="btn-secondary py-2">
            <RefreshCw className={clsx('w-4 h-4', loading && 'animate-spin')} /> Refresh
          </button>
        </div>
      </div>

      {/* Data source banner */}
      <div className={clsx(
        'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium',
        isDemo ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800'
               : 'bg-mint dark:bg-brand-900/20 text-forest dark:text-lime border border-brand-200 dark:border-brand-800'
      )}>
        <Cloud className="w-4 h-4" />
        {isDemo
          ? '⚠ DEMO WEATHER DATA — Live API call failed. Showing illustrative data.'
          : `✓ Live Weather Data from Open-Meteo (open-meteo.com) · Updated: ${weather ? formatTime(weather.fetchedAt) : '--'}`}
      </div>

      {/* Weather alerts */}
      {weatherAlerts.length > 0 && (
        <div className="space-y-2">
          {weatherAlerts.map((a, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
              <a.icon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-yellow-800 dark:text-yellow-200 text-sm">{a.title}</div>
                <div className="text-yellow-700 dark:text-yellow-300 text-xs mt-0.5">{a.msg}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
      ) : weather && (
        <>
          {/* Current conditions */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card lg:col-span-2 bg-gradient-to-br from-forest to-emerald text-white border-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-white/70 text-sm font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {selectedLocation.name}
                  </div>
                  <div className="text-5xl font-bold mt-2">{formatTemp(weather.current.temperature)}</div>
                  <div className="text-white/80 text-lg mt-1">{winfo?.label}</div>
                  <div className="text-white/60 text-sm">Feels like {formatTemp(weather.current.apparent_temperature)}</div>
                </div>
                <div className="text-6xl">{winfo?.emoji}</div>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-6 pt-4 border-t border-white/20">
                {[
                  { icon: Droplets, label: 'Humidity', value: `${weather.current.humidity}%` },
                  { icon: Wind, label: 'Wind', value: `${weather.current.windspeed} km/h ${windDirection(weather.current.winddirection)}` },
                  { icon: Sun, label: 'UV Index', value: `${weather.current.uvindex.toFixed(0)} (${uvInfo?.label})` },
                  { icon: Cloud, label: 'Rain', value: `${weather.current.precipitation} mm` },
                ].map(m => (
                  <div key={m.label} className="text-center">
                    <m.icon className="w-4 h-4 mx-auto text-white/60 mb-1" />
                    <div className="text-white text-xs font-semibold">{m.value}</div>
                    <div className="text-white/50 text-xs">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
            {[
              { label: "Today's High", value: formatTemp(weather.daily.temperature_2m_max[0]), icon: ArrowUp, color: 'text-red-500' },
              { label: "Today's Low", value: formatTemp(weather.daily.temperature_2m_min[0]), icon: ArrowDown, color: 'text-blue-500' },
              { label: 'Rain Probability', value: `${weather.daily.precipitation_probability_max[0]}%`, icon: Droplets, color: 'text-blue-500' },
              { label: 'Max Wind', value: `${weather.daily.windspeed_10m_max[0]} km/h`, icon: Wind, color: 'text-gray-500' },
            ].map(s => (
              <div key={s.label} className="card flex flex-col justify-between">
                <s.icon className={clsx('w-6 h-6', s.color)} />
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{s.value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Hourly */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">24-Hour Forecast</h3>
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-3 pb-2" style={{ minWidth: 'max-content' }}>
                {hourlyData.map((h, i) => {
                  const hi = getWeatherInfo(h.code);
                  return (
                    <div key={i} className="flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 min-w-[64px]">
                      <span className="text-xs text-gray-400 dark:text-gray-500">{h.time}</span>
                      <span className="text-xl">{hi.emoji}</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatTemp(h.temp)}</span>
                      <span className="text-xs text-blue-500">{h.rain}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 7-day daily forecast + rain chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">7-Day Forecast</h3>
              <div className="space-y-2">
                {dailyData.map((d, i) => {
                  const di = getWeatherInfo(d.code);
                  return (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <span className="text-2xl w-8">{di.emoji}</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200 w-24 flex-shrink-0">
                        {i === 0 ? 'Today' : d.label}
                      </span>
                      <div className="flex-1 flex items-center gap-2">
                        <Droplets className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-xs text-blue-500">{d.rainProb}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-red-500 font-medium">{formatTemp(d.max)}</span>
                        <span className="text-gray-300">/</span>
                        <span className="text-blue-500">{formatTemp(d.min)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">7-Day Rainfall (mm)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} unit="mm" />
                  <Tooltip formatter={(v: any) => [`${v} mm`, 'Rainfall']} />
                  <Bar dataKey="rain" fill="#176B45" radius={[4, 4, 0, 0]} name="Rainfall" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Agricultural windows */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Agricultural Activity Windows — Today</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {agWindows.map(w => (
                <div key={w.activity} className={clsx(
                  'p-4 rounded-xl border',
                  w.status === 'good' && 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
                  w.status === 'caution' && 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
                  w.status === 'avoid' || w.status === 'postpone' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : '',
                )}>
                  <div className="flex items-center gap-2 mb-2">
                    {statusIcon(w.status)}
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">{w.activity}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{w.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Crop impact */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Crop-Specific Weather Impact</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { crop: 'Paddy', impact: weather.current.humidity > 80 ? 'High humidity — monitor for blast disease' : 'Conditions normal for paddy', type: weather.current.humidity > 80 ? 'warning' : 'good' },
                { crop: 'Banana', impact: weather.daily.temperature_2m_max[0] > 36 ? 'Heat stress — increase watering frequency' : 'Temperature suitable for banana growth', type: weather.daily.temperature_2m_max[0] > 36 ? 'caution' : 'good' },
                { crop: 'Groundnut', impact: weather.daily.precipitation_probability_max[0] > 60 ? 'Delay any spraying operations' : 'Good conditions for groundnut development', type: weather.daily.precipitation_probability_max[0] > 60 ? 'caution' : 'good' },
              ].map(c => (
                <div key={c.crop} className={clsx(
                  'p-4 rounded-xl',
                  c.type === 'good' && 'bg-green-50 dark:bg-green-900/20',
                  c.type === 'warning' && 'bg-red-50 dark:bg-red-900/20',
                  c.type === 'caution' && 'bg-yellow-50 dark:bg-yellow-900/20',
                )}>
                  <div className="font-semibold text-gray-900 dark:text-white mb-1">{c.crop}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{c.impact}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
              Source: Open-Meteo · Data: {isDemo ? 'Demo (illustrative)' : 'Live'} · Location: {selectedLocation.name} ({weather.lat}°N, {weather.lng}°E)
            </p>
          </div>
        </>
      )}
    </div>
  );
}
