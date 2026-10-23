import { Map, Satellite, Grid, Ruler, Droplets, TrendingUp, AlertCircle } from 'lucide-react';
import { clsx } from '../utils';

const FIELD_ZONES = [
  { id: 'Z1', name: 'Zone A – North Field', area: 1.5, soilPh: 6.8, moisture: 52, ndvi: 0.74, status: 'Good', crop: 'Paddy' },
  { id: 'Z2', name: 'Zone B – South Field', area: 1.0, soilPh: 6.4, moisture: 38, ndvi: 0.61, status: 'Moisture Low', crop: 'Groundnut' },
  { id: 'Z3', name: 'Zone C – West Orchard', area: 1.5, soilPh: 7.0, moisture: 60, ndvi: 0.80, status: 'Good', crop: 'Banana' },
];

export default function PrecisionPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title">Precision Agriculture</h1>
        <p className="section-subtitle">Zone-based farm management and decision support (Demo Data)</p>
      </div>

      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-400">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        All field data shown is illustrative demo data. Real precision agriculture requires actual soil sensor networks or remote sensing data from satellite/drone imagery.
      </div>

      {/* Farm map placeholder */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Farm Zone Map (Demo)</h2>
          <div className="flex gap-2">
            <button className="btn-ghost text-xs py-1.5 px-3"><Grid className="w-3.5 h-3.5" /> Zones</button>
            <button className="btn-ghost text-xs py-1.5 px-3"><Satellite className="w-3.5 h-3.5" /> Satellite</button>
          </div>
        </div>
        {/* Visual farm map using CSS grid */}
        <div className="relative h-64 bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20 rounded-2xl overflow-hidden border border-green-200 dark:border-green-800">
          <div className="absolute inset-0 grid grid-cols-3 gap-2 p-4">
            {FIELD_ZONES.map((z, i) => (
              <div key={z.id} className={clsx(
                'rounded-xl flex flex-col items-center justify-center text-center p-3 cursor-pointer transition-all hover:scale-105',
                z.status === 'Good' ? 'bg-green-400/40 border-2 border-green-500' : 'bg-yellow-400/40 border-2 border-yellow-500'
              )}>
                <div className="text-xl font-black text-white drop-shadow">{z.id}</div>
                <div className="text-xs font-medium text-white/90 mt-1">{z.crop}</div>
                <div className="text-xs text-white/70">{z.area} ac</div>
                {z.status !== 'Good' && <AlertCircle className="w-4 h-4 text-yellow-300 mt-1" />}
              </div>
            ))}
          </div>
          <div className="absolute bottom-2 right-3 flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-white/70 dark:bg-gray-900/70 px-2 py-1 rounded-full">
              <Map className="w-3 h-3" /> Thanjavur Farm · 4.5 acres
            </div>
          </div>
        </div>
      </div>

      {/* Zone details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {FIELD_ZONES.map(z => (
          <div key={z.id} className="card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm">{z.name}</div>
                <div className="text-xs text-gray-400">{z.area} acres · {z.crop}</div>
              </div>
              <span className={clsx('badge text-xs', z.status === 'Good' ? 'badge-green' : 'badge-yellow')}>{z.status}</span>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Soil pH', value: z.soilPh.toString(), icon: '⚗️' },
                { label: 'Moisture', value: `${z.moisture}%`, icon: '💧' },
                { label: 'NDVI Index', value: z.ndvi.toFixed(2), icon: '🛰️' },
              ].map(m => (
                <div key={m.label} className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{m.icon} {m.label}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{m.value}</span>
                </div>
              ))}
            </div>
            {z.status !== 'Good' && (
              <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-xs text-yellow-700 dark:text-yellow-400">
                ⚠ {z.status} — Check irrigation schedule
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Variable Rate Application */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Variable Rate Application Plan (Demo)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 dark:border-gray-800">
              {['Zone','Crop','Urea (kg/ac)','DAP (kg/ac)','MOP (kg/ac)','Irrigation','Priority'].map(h =>
                <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500">{h}</th>)}
            </tr></thead>
            <tbody>
              {[
                { zone: 'Z1', crop: 'Paddy', urea: 28, dap: 14, mop: 14, irr: 'Normal', pri: 'Normal' },
                { zone: 'Z2', crop: 'Groundnut', urea: 6, dap: 12, mop: 12, irr: 'Increase 25%', pri: 'High' },
                { zone: 'Z3', crop: 'Banana', urea: 45, dap: 14, mop: 68, irr: 'Normal', pri: 'Normal' },
              ].map(r => (
                <tr key={r.zone} className="border-b border-gray-50 dark:border-gray-800">
                  <td className="py-2.5 px-3 font-bold text-forest dark:text-lime">{r.zone}</td>
                  <td className="py-2.5 px-3 font-medium text-gray-900 dark:text-white">{r.crop}</td>
                  <td className="py-2.5 px-3">{r.urea}</td>
                  <td className="py-2.5 px-3">{r.dap}</td>
                  <td className="py-2.5 px-3">{r.mop}</td>
                  <td className="py-2.5 px-3">{r.irr}</td>
                  <td className="py-2.5 px-3">
                    <span className={clsx('badge text-xs', r.pri === 'High' ? 'badge-red' : 'badge-green')}>{r.pri}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3">Illustrative recommendations only. Verify with soil test results and agronomist consultation.</p>
      </div>
    </div>
  );
}
