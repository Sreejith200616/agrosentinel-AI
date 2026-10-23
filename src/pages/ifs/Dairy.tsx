import { useState } from 'react';
import { Beef, Plus, AlertTriangle, CheckCircle, TrendingUp, Droplets } from 'lucide-react';
import { formatCurrency, formatDate, clsx } from '../../utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const milkData = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - (29 - i));
  return { date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }), liters: Math.round(48 + Math.random() * 15) };
});

const ANIMALS = [
  { id: 'C1', type: 'Cow (HF)', count: 3, milk: 18, feed: 45, status: 'Healthy' },
  { id: 'C2', type: 'Cow (Jersey)', count: 3, milk: 15, feed: 42, status: 'Healthy' },
  { id: 'C3', type: 'Cow (Local)', count: 2, milk: 8, feed: 30, status: 'Healthy' },
  { id: 'B1', type: 'Buffalo', count: 4, milk: 14, feed: 60, status: 'Healthy' },
];

const VACCINATIONS = [
  { disease: 'FMD (Foot & Mouth)', date: '2026-11-15', animals: 'All cattle', status: 'Upcoming' },
  { disease: 'HS (Haemorrhagic Septicaemia)', date: '2026-12-01', animals: 'All cattle', status: 'Upcoming' },
  { disease: 'BQ (Black Quarter)', date: '2026-12-15', animals: 'Cattle >6m', status: 'Scheduled' },
];

export default function DairyPage() {
  const [showForm, setShowForm] = useState(false);
  const totalMilk = ANIMALS.reduce((s, a) => s + a.milk, 0);
  const totalFeed = ANIMALS.reduce((s, a) => s + a.feed, 0);
  const milkIncome = totalMilk * 30 * 38;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Dairy Farming</h1>
          <p className="section-subtitle">Cattle & buffalo herd management (Demo Data)</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="btn-primary"><Plus className="w-4 h-4" /> Add Animal</button>
      </div>

      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-400">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <strong>Important:</strong>&nbsp;Animal manure must be properly composted (minimum 45 days) before any agricultural application. Do not apply raw manure to food crops.
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Animals', value: '12', sub: '8 cows + 4 buffaloes', color: 'text-amber-600' },
          { label: 'Daily Milk', value: `${totalMilk}L`, sub: 'Combined all animals', color: 'text-blue-600' },
          { label: 'Monthly Income', value: formatCurrency(milkIncome), sub: '@ ₹38/litre (estimated)', color: 'text-green-600' },
          { label: 'Manure/day', value: '120 kg', sub: '→ Composting unit', color: 'text-amber-700' },
        ].map(s => (
          <div key={s.label} className="card">
            <div className={clsx('text-2xl font-bold', s.color)}>{s.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Milk chart */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Daily Milk Production — Last 30 Days (Demo)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={milkData}>
            <defs>
              <linearGradient id="milkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 9 }} interval={4} />
            <YAxis tick={{ fontSize: 10 }} unit="L" />
            <Tooltip formatter={(v: any) => [`${v} L`, 'Milk']} />
            <Area type="monotone" dataKey="liters" stroke="#f59e0b" fill="url(#milkGrad)" strokeWidth={2} name="Milk (L)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Herd table */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Herd Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 dark:border-gray-800">
              {['Category','Count','Daily Milk (L)','Feed (kg/day)','Status'].map(h =>
                <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500">{h}</th>)}
            </tr></thead>
            <tbody>
              {ANIMALS.map(a => (
                <tr key={a.id} className="border-b border-gray-50 dark:border-gray-800">
                  <td className="py-2.5 px-3 font-medium text-gray-900 dark:text-white">{a.type}</td>
                  <td className="py-2.5 px-3">{a.count}</td>
                  <td className="py-2.5 px-3 text-amber-600 font-semibold">{a.milk}L</td>
                  <td className="py-2.5 px-3">{a.feed} kg</td>
                  <td className="py-2.5 px-3"><span className="badge badge-green">{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vaccination */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Upcoming Vaccinations</h3>
        <div className="space-y-2">
          {VACCINATIONS.map(v => (
            <div key={v.disease} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-900 dark:text-white">{v.disease}</div>
                <div className="text-xs text-gray-500">{v.animals}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-200">{formatDate(v.date)}</div>
                <span className="badge badge-blue text-xs">{v.status}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">Consult a licensed veterinarian for vaccination schedules and dosage.</p>
      </div>
    </div>
  );
}
