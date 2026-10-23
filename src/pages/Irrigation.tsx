import { Droplets, Plus, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { formatDate, clsx } from '../utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ZONES = [
  { id: 'IZ1', name: 'Paddy Field', method: 'Flood', crop: 'Paddy', lastIrr: '2026-10-21', nextIrr: '2026-10-23', status: 'Due Today', moisture: 65 },
  { id: 'IZ2', name: 'Banana Plot', method: 'Drip', crop: 'Banana', lastIrr: '2026-10-22', nextIrr: '2026-10-24', status: 'Scheduled', moisture: 52 },
  { id: 'IZ3', name: 'Groundnut Field', method: 'Sprinkler', crop: 'Groundnut', lastIrr: '2026-10-20', nextIrr: '2026-10-25', status: 'Upcoming', moisture: 38 },
];

const waterData = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - (13 - i));
  const rain = i % 5 === 0 ? Math.round(15 + Math.random() * 20) : 0;
  const irr = rain === 0 ? Math.round(20 + Math.random() * 15) : 0;
  return { date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }), irrigation: irr, rainfall: rain };
});

export default function IrrigationPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Irrigation Management</h1>
          <p className="section-subtitle">Schedule and monitor field irrigation (Demo Data)</p>
        </div>
        <button className="btn-primary"><Plus className="w-4 h-4" /> Add Schedule</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Due Today', value: '1', sub: 'Paddy field', color: 'text-red-600' },
          { label: 'This Week', value: '3', sub: 'Total irrigations', color: 'text-blue-600' },
          { label: 'Water Used (Month)', value: '42,000 L', sub: 'All fields combined', color: 'text-cyan-600' },
          { label: 'Rain Received', value: '18 mm', sub: 'Last 7 days', color: 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="card">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Water Use — Last 14 Days (Demo)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={waterData}>
            <defs>
              <linearGradient id="irrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#176B45" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#176B45" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 10 }} unit=" L" />
            <Tooltip formatter={(v: any, n: string) => [`${v} ${n === 'irrigation' ? 'L' : 'mm'}`, n === 'irrigation' ? 'Irrigation' : 'Rainfall']} />
            <Area type="monotone" dataKey="irrigation" stroke="#176B45" fill="url(#irrGrad)" strokeWidth={2} name="irrigation" />
            <Area type="monotone" dataKey="rainfall" stroke="#3b82f6" fill="url(#rainGrad)" strokeWidth={2} name="rainfall" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
          <div className="flex items-center gap-1"><div className="w-3 h-1 bg-forest rounded" /> Irrigation (L)</div>
          <div className="flex items-center gap-1"><div className="w-3 h-1 bg-blue-500 rounded" /> Rainfall (mm)</div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">Irrigation Schedule</h3>
        {ZONES.map(z => (
          <div key={z.id} className={clsx('card flex items-center gap-4', z.status === 'Due Today' && 'border-red-200 dark:border-red-800')}>
            <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
              z.status === 'Due Today' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30')}>
              <Droplets className={clsx('w-5 h-5', z.status === 'Due Today' ? 'text-red-600' : 'text-blue-600')} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900 dark:text-white">{z.name}</span>
                <span className="badge badge-blue text-xs">{z.method}</span>
                <span className={clsx('badge text-xs', z.status === 'Due Today' ? 'badge-red' : 'badge-green')}>{z.status}</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">{z.crop} · Next: {formatDate(z.nextIrr)} · Moisture: {z.moisture}%</div>
            </div>
            <div className="flex-shrink-0">
              <div className="h-1.5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className={clsx('h-full rounded-full', z.moisture > 50 ? 'bg-blue-500' : z.moisture > 35 ? 'bg-yellow-500' : 'bg-red-500')} style={{ width: `${z.moisture}%` }} />
              </div>
              <div className="text-xs text-gray-400 text-right mt-0.5">{z.moisture}%</div>
            </div>
            <button className="btn-ghost text-xs py-1.5 px-3 flex-shrink-0">Mark Done ✓</button>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Irrigation Efficiency Tips</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[
            'Use drip irrigation for banana and vegetables — saves 30–50% water vs flood irrigation.',
            'Irrigate in early morning or evening to minimize evaporation losses.',
            'Monitor soil moisture before each irrigation — avoid over-watering which promotes disease.',
            'Integrate rainfall data into scheduling — skip irrigation if rain ≥15mm received.',
          ].map((t, i) => (
            <div key={i} className="flex items-start gap-2 p-3 bg-mint dark:bg-brand-900/20 rounded-xl">
              <CheckCircle className="w-4 h-4 text-forest dark:text-lime flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-200">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
