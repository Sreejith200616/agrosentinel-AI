import { useState } from 'react';
import { AlertTriangle, CheckCircle, Plus, Info, Activity, Beaker, TrendingUp, FileText } from 'lucide-react';
import { formatDate, generateId, clsx } from '../utils';
import type { SoilReading } from '../types';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

const DEMO_READINGS: SoilReading[] = [
  { id: '1', farmId: 'farm-1', date: '2026-10-15', ph: 6.8, nitrogen: 280, phosphorus: 45, potassium: 220, organicCarbon: 0.72, ec: 0.45, moisture: 48, texture: 'Black Cotton', source: 'lab', notes: 'Annual soil test - TNAU lab' },
  { id: '2', farmId: 'farm-1', date: '2026-07-10', ph: 6.6, nitrogen: 255, phosphorus: 42, potassium: 210, organicCarbon: 0.68, ec: 0.42, moisture: 52, texture: 'Black Cotton', source: 'lab', notes: 'Pre-kharif test' },
  { id: '3', farmId: 'farm-1', date: '2026-01-05', ph: 6.9, nitrogen: 270, phosphorus: 48, potassium: 225, organicCarbon: 0.70, ec: 0.48, moisture: 40, texture: 'Black Cotton', source: 'lab' },
];

const THRESHOLDS = {
  ph: { low: 6.0, high: 7.5, unit: '', name: 'Soil pH', ideal: '6.0–7.5' },
  nitrogen: { low: 280, high: 560, unit: 'kg/ha', name: 'Nitrogen (N)', ideal: '>280 kg/ha' },
  phosphorus: { low: 11, high: 22, unit: 'kg/ha', name: 'Phosphorus (P)', ideal: '>22 kg/ha' },
  potassium: { low: 110, high: 280, unit: 'kg/ha', name: 'Potassium (K)', ideal: '>280 kg/ha' },
  organicCarbon: { low: 0.5, high: 0.75, unit: '%', name: 'Organic Carbon', ideal: '>0.75%' },
  ec: { low: 0, high: 1.0, unit: 'dS/m', name: 'Electrical Conductivity', ideal: '<1.0 dS/m' },
  moisture: { low: 40, high: 70, unit: '%', name: 'Soil Moisture', ideal: '40–70%' },
};

function getStatus(key: keyof typeof THRESHOLDS, value: number) {
  const t = THRESHOLDS[key];
  if (key === 'ec') return value <= t.high ? 'good' : 'poor';
  if (key === 'ph') return value >= t.low && value <= t.high ? 'good' : value < t.low ? 'acid' : 'alkaline';
  if (value >= t.high) return 'good';
  if (value >= t.low) return 'moderate';
  return 'poor';
}

function getStatusColor(status: string) {
  if (status === 'good') return 'text-green-600 dark:text-green-400';
  if (status === 'moderate') return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

function computeScore(r: SoilReading): number {
  let score = 0;
  if (r.ph >= 6.0 && r.ph <= 7.5) score += 15; else score += 5;
  if (r.nitrogen >= 280) score += 20; else if (r.nitrogen >= 180) score += 12; else score += 4;
  if (r.phosphorus >= 22) score += 15; else if (r.phosphorus >= 11) score += 9; else score += 3;
  if (r.potassium >= 280) score += 15; else if (r.potassium >= 110) score += 9; else score += 3;
  if (r.organicCarbon >= 0.75) score += 20; else if (r.organicCarbon >= 0.5) score += 12; else score += 4;
  if (r.ec <= 1.0) score += 10; else score += 3;
  if (r.moisture >= 40 && r.moisture <= 70) score += 5; else score += 2;
  return score;
}

export default function SoilHealthPage() {
  const [readings, setReadings] = useState<SoilReading[]>(DEMO_READINGS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<SoilReading>>({ source: 'lab', texture: 'Black Cotton' });

  const latest = readings[0];
  const score = computeScore(latest);

  const radarData = [
    { subject: 'N', value: Math.min(100, (latest.nitrogen / 560) * 100) },
    { subject: 'P', value: Math.min(100, (latest.phosphorus / 22) * 100) },
    { subject: 'K', value: Math.min(100, (latest.potassium / 280) * 100) },
    { subject: 'OC', value: Math.min(100, (latest.organicCarbon / 0.75) * 100) },
    { subject: 'Moisture', value: Math.min(100, (latest.moisture / 70) * 100) },
  ];

  function addReading() {
    const r: SoilReading = {
      id: generateId(), farmId: 'farm-1',
      date: form.date ?? new Date().toISOString().slice(0, 10),
      ph: form.ph ?? 7, nitrogen: form.nitrogen ?? 200,
      phosphorus: form.phosphorus ?? 20, potassium: form.potassium ?? 150,
      organicCarbon: form.organicCarbon ?? 0.5, ec: form.ec ?? 0.5,
      moisture: form.moisture ?? 45, texture: form.texture ?? 'Black Cotton',
      source: form.source as 'lab' | 'sensor' | 'manual',
    };
    setReadings(prev => [r, ...prev]);
    setShowForm(false);
    setForm({ source: 'lab', texture: 'Black Cotton' });
  }

  const params: Array<{ key: keyof typeof THRESHOLDS; value: number }> = [
    { key: 'ph', value: latest.ph },
    { key: 'nitrogen', value: latest.nitrogen },
    { key: 'phosphorus', value: latest.phosphorus },
    { key: 'potassium', value: latest.potassium },
    { key: 'organicCarbon', value: latest.organicCarbon },
    { key: 'ec', value: latest.ec },
    { key: 'moisture', value: latest.moisture },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Soil Health</h1>
          <p className="section-subtitle">Monitor and manage soil nutrient status</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Soil Test
        </button>
      </div>

      {/* Lab notice */}
      <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-sm text-blue-700 dark:text-blue-300">
        <Info className="w-4 h-4 flex-shrink-0" />
        <strong>Laboratory measurements are recommended for reliable nutrient recommendations.</strong>&nbsp;Values from certified soil testing labs (TNAU, ICAR) are preferred.
      </div>

      {/* Add form */}
      {showForm && (
        <div className="card">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Add New Soil Test Reading</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div><label className="label">Date</label><input type="date" className="input" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} /></div>
            <div><label className="label">pH</label><input type="number" className="input" step={0.1} min={4} max={9} placeholder="6.5" value={form.ph ?? ''} onChange={e => setForm(f => ({...f, ph: parseFloat(e.target.value)}))} /></div>
            <div><label className="label">N (kg/ha)</label><input type="number" className="input" placeholder="280" value={form.nitrogen ?? ''} onChange={e => setForm(f => ({...f, nitrogen: parseFloat(e.target.value)}))} /></div>
            <div><label className="label">P (kg/ha)</label><input type="number" className="input" placeholder="45" value={form.phosphorus ?? ''} onChange={e => setForm(f => ({...f, phosphorus: parseFloat(e.target.value)}))} /></div>
            <div><label className="label">K (kg/ha)</label><input type="number" className="input" placeholder="220" value={form.potassium ?? ''} onChange={e => setForm(f => ({...f, potassium: parseFloat(e.target.value)}))} /></div>
            <div><label className="label">OC (%)</label><input type="number" className="input" step={0.01} placeholder="0.72" value={form.organicCarbon ?? ''} onChange={e => setForm(f => ({...f, organicCarbon: parseFloat(e.target.value)}))} /></div>
            <div><label className="label">EC (dS/m)</label><input type="number" className="input" step={0.01} placeholder="0.45" value={form.ec ?? ''} onChange={e => setForm(f => ({...f, ec: parseFloat(e.target.value)}))} /></div>
            <div><label className="label">Source</label>
              <select className="input" value={form.source} onChange={e => setForm(f => ({...f, source: e.target.value as 'lab'|'sensor'|'manual'}))}>
                <option value="lab">Laboratory</option>
                <option value="sensor">Sensor</option>
                <option value="manual">Manual Entry</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={addReading} className="btn-primary">Save Reading</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      )}

      {/* Health score + radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Overall Soil Health Score</div>
          <div className={clsx('text-6xl font-bold mb-2',
            score >= 70 ? 'text-green-600' : score >= 45 ? 'text-yellow-600' : 'text-red-600')}>
            {score}
          </div>
          <div className="text-sm text-gray-500">/100</div>
          <div className={clsx('badge mt-3', score >= 70 ? 'badge-green' : score >= 45 ? 'badge-yellow' : 'badge-red')}>
            {score >= 70 ? '✓ Good' : score >= 45 ? '⚠ Moderate' : '✗ Needs Attention'}
          </div>
          <div className="text-xs text-gray-400 mt-3">Latest test: {formatDate(latest.date)} · {latest.source.toUpperCase()}</div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Nutrient Profile</h3>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <Radar name="Soil" dataKey="value" stroke="#176B45" fill="#176B45" fillOpacity={0.25} />
              <Tooltip formatter={(v: any) => [`${v.toFixed(0)}%`, 'Adequacy']} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Stats</h3>
          <div className="space-y-2">
            {[
              { label: 'Soil Texture', value: latest.texture },
              { label: 'pH Level', value: `${latest.ph} (${latest.ph < 6 ? 'Acid' : latest.ph > 7.5 ? 'Alkaline' : 'Near Neutral'})` },
              { label: 'EC Level', value: `${latest.ec} dS/m (${latest.ec < 1 ? 'Safe' : 'Marginal'})` },
              { label: 'Moisture', value: `${latest.moisture}%` },
              { label: 'Organic Carbon', value: `${latest.organicCarbon}% (${latest.organicCarbon >= 0.75 ? 'High' : latest.organicCarbon >= 0.5 ? 'Medium' : 'Low'})` },
            ].map(s => (
              <div key={s.label} className="flex justify-between text-sm py-1.5 border-b border-gray-50 dark:border-gray-800">
                <span className="text-gray-500 dark:text-gray-400">{s.label}</span>
                <span className="font-medium text-gray-900 dark:text-white">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Parameter cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {params.map(({ key, value }) => {
          const t = THRESHOLDS[key];
          const status = getStatus(key, value);
          const pct = key === 'ec' ? Math.min(100, (value / 2) * 100)
            : key === 'ph' ? ((value - 4) / 5) * 100
            : Math.min(100, (value / t.high) * 100);
          return (
            <div key={key} className="card">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t.name}</div>
              <div className={clsx('text-2xl font-bold', getStatusColor(status))}>
                {value}<span className="text-sm font-normal ml-1">{t.unit}</span>
              </div>
              <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className={clsx('h-full rounded-full',
                  status === 'good' ? 'bg-green-500' : status === 'moderate' ? 'bg-yellow-500' : 'bg-red-500'
                )} style={{ width: `${pct}%` }} />
              </div>
              <div className="text-xs text-gray-400 mt-1">Ideal: {t.ideal}</div>
            </div>
          );
        })}
      </div>

      {/* Amendments */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Soil Amendment Suggestions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {latest.organicCarbon < 0.75 && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
              <div className="font-semibold text-yellow-800 dark:text-yellow-200 text-sm">Increase Organic Carbon</div>
              <div className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">Apply FYM 5–10 t/ha or vermicompost 2–3 t/ha before sowing. Practice crop residue incorporation.</div>
            </div>
          )}
          {latest.nitrogen < 280 && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <div className="font-semibold text-red-800 dark:text-red-200 text-sm">Low Nitrogen</div>
              <div className="text-xs text-red-700 dark:text-red-300 mt-1">Consider green manure crops (Sesbania, Dhaincha). Apply recommended N doses in split. Use biofertilizer Azospirillum.</div>
            </div>
          )}
          {latest.ph >= 6 && latest.ph <= 7.5 && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="font-semibold text-green-800 dark:text-green-200 text-sm">pH is Optimal ✓</div>
              <div className="text-xs text-green-700 dark:text-green-300 mt-1">Soil pH {latest.ph} is suitable for most crops. Maintain with balanced fertilization and organic inputs.</div>
            </div>
          )}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="font-semibold text-blue-800 dark:text-blue-200 text-sm">EC is Safe ✓</div>
            <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">EC {latest.ec} dS/m is below the salinity threshold. Avoid excessive chemical fertilizers to maintain this.</div>
          </div>
        </div>
      </div>

      {/* History table */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Soil Test History (Demo Data)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                {['Date','pH','N (kg/ha)','P (kg/ha)','K (kg/ha)','OC (%)','EC','Source'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {readings.map(r => (
                <tr key={r.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="py-2.5 px-3 text-gray-700 dark:text-gray-200">{formatDate(r.date)}</td>
                  <td className="py-2.5 px-3 font-medium text-gray-900 dark:text-white">{r.ph}</td>
                  <td className="py-2.5 px-3">{r.nitrogen}</td>
                  <td className="py-2.5 px-3">{r.phosphorus}</td>
                  <td className="py-2.5 px-3">{r.potassium}</td>
                  <td className="py-2.5 px-3">{r.organicCarbon}</td>
                  <td className="py-2.5 px-3">{r.ec}</td>
                  <td className="py-2.5 px-3"><span className="badge badge-blue capitalize">{r.source}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
