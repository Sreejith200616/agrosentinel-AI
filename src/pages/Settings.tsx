import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Sun, Moon, Globe, Bell, Shield, Info, Save, CheckCircle, ChevronRight, MapPin, Leaf } from 'lucide-react';
import { INDIAN_STATES, TN_DISTRICTS, SOIL_TYPES, CROPS_TN, clsx } from '../utils';
import toast from 'react-hot-toast';

const SECTIONS = ['Profile', 'Farm Details', 'Preferences', 'Notifications', 'Privacy', 'About'];

export default function SettingsPage() {
  const { user, activeFarm, theme, setTheme, language, setLanguage } = useApp();
  const [activeSection, setActiveSection] = useState('Profile');
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    toast.success('Settings saved!');
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div>
        <h1 className="section-title">Settings</h1>
        <p className="section-subtitle">Manage your profile, farm, and app preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar nav */}
        <div className="card p-2 h-fit">
          <nav className="space-y-1">
            {SECTIONS.map(s => (
              <button key={s} onClick={() => setActiveSection(s)}
                className={clsx('w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  activeSection === s ? 'bg-forest text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800')}>
                {s}
                <ChevronRight className={clsx('w-4 h-4', activeSection === s ? 'text-white/60' : 'text-gray-400')} />
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-4">
          {activeSection === 'Profile' && (
            <div className="card space-y-5">
              <h2 className="font-semibold text-gray-900 dark:text-white text-lg">Profile Settings</h2>
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <div className="w-16 h-16 bg-gradient-to-br from-forest to-emerald rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                  {user.name[0]}
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.phone || 'No phone set'}</div>
                  <div className="text-sm text-gray-500">{user.district}, {user.state}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="label">Full Name</label>
                  <input defaultValue={user.name} className="input" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="label">Phone Number</label>
                  <input defaultValue={user.phone || ''} className="input" placeholder="+91 00000 00000" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="label">State</label>
                  <select className="input" defaultValue={user.state}>
                    {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="label">District</label>
                  <select className="input" defaultValue={user.district}>
                    {TN_DISTRICTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={handleSave} className="btn-primary">
                {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Profile</>}
              </button>
            </div>
          )}

          {activeSection === 'Farm Details' && (
            <div className="card space-y-5">
              <h2 className="font-semibold text-gray-900 dark:text-white text-lg">Farm Details</h2>
              {activeFarm && (
                <div className="p-4 bg-mint dark:bg-brand-900/20 rounded-2xl border border-brand-200 dark:border-brand-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="w-4 h-4 text-forest dark:text-lime" />
                    <span className="font-semibold text-forest dark:text-lime">Active Farm: {activeFarm.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <div>Location: {activeFarm.location}</div>
                    <div>Area: {activeFarm.area} acres</div>
                    <div>Soil: {activeFarm.soilType}</div>
                    <div>Crops: {activeFarm.crops.join(', ')}</div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Farm Name</label><input defaultValue={activeFarm?.name} className="input" /></div>
                <div><label className="label">Area (Acres)</label><input type="number" defaultValue={activeFarm?.area} className="input" /></div>
                <div><label className="label">Soil Type</label>
                  <select className="input" defaultValue={activeFarm?.soilType}>
                    {SOIL_TYPES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div><label className="label">Primary Crop</label>
                  <select className="input">
                    {CROPS_TN.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={handleSave} className="btn-primary"><Save className="w-4 h-4" /> Save Farm Details</button>
            </div>
          )}

          {activeSection === 'Preferences' && (
            <div className="card space-y-5">
              <h2 className="font-semibold text-gray-900 dark:text-white text-lg">App Preferences</h2>
              <div>
                <label className="label">Theme</label>
                <div className="flex gap-3 mt-1">
                  {[['light', Sun, 'Light'], ['dark', Moon, 'Dark']].map(([val, Icon, label]) => (
                    <button key={val as string} onClick={() => setTheme(val as 'light' | 'dark')}
                      className={clsx('flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all',
                        theme === val ? 'bg-forest text-white border-forest' : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-forest')}>
                      {/* @ts-ignore */}
                      <Icon className="w-4 h-4" /> {label as string}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Language</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-1">
                  {[['en','English 🇬🇧'],['ta','தமிழ் 🇮🇳'],['hi','हिंदी 🇮🇳'],['te','తెలుగు 🇮🇳'],['kn','ಕನ್ನಡ 🇮🇳'],['ml','മലയാളം 🇮🇳']].map(([val, label]) => (
                    <button key={val} onClick={() => setLanguage(val as any)}
                      className={clsx('px-3 py-2 rounded-xl border text-sm font-medium transition-all text-left',
                        language === val ? 'bg-forest text-white border-forest' : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700')}>
                      {label}
                    </button>
                  ))}
                </div>
                {language !== 'en' && <p className="text-xs text-gray-400 mt-2">Note: Full multilingual interface coming soon. Most content is currently in English.</p>}
              </div>
              <div>
                <label className="label">Temperature Unit</label>
                <div className="flex gap-3">
                  {['Celsius (°C)', 'Fahrenheit (°F)'].map(u => (
                    <button key={u} className={clsx('px-4 py-2 rounded-xl border text-sm font-medium',
                      u.includes('Celsius') ? 'bg-forest text-white border-forest' : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700')}>
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'Notifications' && (
            <div className="card space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white text-lg">Notification Preferences</h2>
              {[
                { label: 'Weather Alerts', desc: 'Rain, heat stress, and strong wind warnings', enabled: true },
                { label: 'Market Price Alerts', desc: 'Price changes for your watchlisted crops', enabled: true },
                { label: 'Irrigation Reminders', desc: 'Scheduled irrigation and soil moisture alerts', enabled: true },
                { label: 'Pest & Disease Advisories', desc: 'Regional pest outbreak advisories', enabled: true },
                { label: 'Fertilizer Reminders', desc: 'Due date reminders for fertilizer applications', enabled: false },
                { label: 'IFS Activity Updates', desc: 'Dairy, poultry, fish pond status updates', enabled: false },
              ].map(n => (
                <div key={n.label} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">{n.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{n.desc}</div>
                  </div>
                  <button className={clsx('w-11 h-6 rounded-full transition-colors relative',
                    n.enabled ? 'bg-forest' : 'bg-gray-300 dark:bg-gray-600')}>
                    <div className={clsx('absolute w-4 h-4 bg-white rounded-full top-1 transition-transform',
                      n.enabled ? 'left-6' : 'left-1')} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'Privacy' && (
            <div className="card space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white text-lg">Privacy & Data</h2>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-300 space-y-2">
                <div className="font-semibold">Data Storage</div>
                <div>AgroSentinel AI is a demonstration platform. No personal data is transmitted to external servers. All data (farm records, settings) is stored locally in your browser session only.</div>
                <div>Weather data is fetched from Open-Meteo (open-meteo.com) — a public API with no personal data involved. See their <a href="https://open-meteo.com/en/terms" target="_blank" rel="noopener noreferrer" className="underline">terms of service</a>.</div>
                <div>If you configure a Gemini API key, your chat queries are sent to Google's Gemini API. Review Google's <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">Privacy Policy</a>.</div>
              </div>
              <div className="flex gap-3">
                <button className="btn-ghost text-red-500 border-red-200 text-sm">Clear All Local Data</button>
                <button className="btn-ghost text-sm">Export Data (JSON)</button>
              </div>
            </div>
          )}

          {activeSection === 'About' && (
            <div className="card space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white text-lg">About AgroSentinel AI</h2>
              <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-forest to-emerald rounded-2xl text-white">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Leaf className="w-8 h-8 text-lime" />
                </div>
                <div>
                  <div className="font-black text-xl">AgroSentinel AI</div>
                  <div className="text-white/70 text-sm">Smart Farming. Better Decisions. Sustainable Future.</div>
                  <div className="text-white/50 text-xs mt-1">Version 1.0.0 · Demo Platform</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  ['Frontend', 'React 18 + TypeScript + Vite'],
                  ['Styling', 'Tailwind CSS v3 + Custom Design System'],
                  ['Charts', 'Recharts'],
                  ['Routing', 'React Router v6'],
                  ['Weather API', 'Open-Meteo (open-meteo.com) — Open source'],
                  ['AI Engine', 'Google Gemini 1.5 Flash (requires API key)'],
                  ['Icons', 'Lucide React'],
                  ['Data', 'TNAU recommendations · Demo market data · ICAR guidelines'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1.5 border-b border-gray-50 dark:border-gray-800">
                    <span className="text-gray-500 dark:text-gray-400">{k}</span>
                    <span className="font-medium text-gray-900 dark:text-white text-right">{v}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-xs text-yellow-700 dark:text-yellow-400">
                <strong>Disclaimer:</strong> AgroSentinel AI is a demonstration platform. AI recommendations, disease diagnoses, and market prices are illustrative and should not replace advice from qualified agricultural experts.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
