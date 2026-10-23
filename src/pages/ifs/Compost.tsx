import { Worm, Plus, CheckCircle, Clock } from 'lucide-react';
import { formatDate, clsx } from '../../utils';

const BATCHES = [
  { id: 'B1', name: 'Batch A', startDate: '2026-10-07', material: 'Paddy straw + cattle dung + kitchen waste', weight: 200, days: 15, ready: false, temp: 52, cnRatio: 28 },
  { id: 'B2', name: 'Batch B', startDate: '2026-09-07', material: 'Vegetable waste + FYM + crop residues', weight: 150, days: 45, ready: true, temp: 38, cnRatio: 22 },
];

export default function CompostPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="section-title">Vermicomposting & Composting</h1><p className="section-subtitle">Organic waste to nutrient-rich compost (Demo Data)</p></div>
        <button className="btn-primary"><Plus className="w-4 h-4" /> New Batch</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Batches', value: '2', sub: '1 ready for use' },
          { label: 'Total Input', value: '350 kg', sub: 'Organic waste processed' },
          { label: 'Est. Output', value: '~120 kg', sub: 'Quality compost' },
          { label: 'NPK (approx.)', value: 'N1.5% P0.75% K1.5%', sub: 'Vermicompost average' },
        ].map(s => (
          <div key={s.label} className="card"><div className="text-xl font-bold text-amber-700 dark:text-amber-400">{s.value}</div><div className="text-sm text-gray-500 mt-0.5">{s.label}</div><div className="text-xs text-gray-400 mt-0.5">{s.sub}</div></div>
        ))}
      </div>
      <div className="space-y-4">
        {BATCHES.map(b => (
          <div key={b.id} className="card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{b.name}</h3>
                <div className="text-xs text-gray-500">Started: {formatDate(b.startDate)} · {b.days} days ago</div>
              </div>
              <span className={clsx('badge', b.ready ? 'badge-green' : 'badge-yellow')}>
                {b.ready ? '✓ Ready to Use' : `In Progress (${b.days}/45 days)`}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">{b.material}</div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm"><div className="font-bold text-gray-900 dark:text-white">{b.weight} kg</div><div className="text-xs text-gray-400">Input weight</div></div>
              <div className={clsx('p-2.5 rounded-xl text-sm', b.temp > 50 ? 'bg-green-50 dark:bg-green-900/20' : b.ready ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20')}>
                <div className={clsx('font-bold', b.temp > 50 ? 'text-green-700' : 'text-gray-700 dark:text-gray-200')}>{b.temp}°C</div>
                <div className="text-xs text-gray-400">Temperature {b.temp > 50 ? '(active)' : '(cooling)'}</div>
              </div>
              <div className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm"><div className="font-bold text-gray-900 dark:text-white">{b.cnRatio}:1</div><div className="text-xs text-gray-400">C:N Ratio {b.cnRatio <= 25 ? '(Good)' : '(High - add N)'}</div></div>
            </div>
            <div className="mt-3">
              <div className="text-xs text-gray-400 mb-1">Maturity progress</div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, (b.days / 45) * 100)}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Input Sources — This Month</h3>
        <div className="space-y-2">
          {[
            { source: 'Paddy straw', qty: '120 kg', from: 'Crop residues' },
            { source: 'Cattle/buffalo dung', qty: '80 kg', from: 'Dairy unit' },
            { source: 'Poultry manure (composted)', qty: '60 kg', from: 'Poultry unit (aged 60d)' },
            { source: 'Kitchen & vegetable waste', qty: '30 kg', from: 'Farm household' },
          ].map(i => (
            <div key={i.source} className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-sm">
              <div><div className="font-medium text-gray-800 dark:text-gray-200">{i.source}</div><div className="text-xs text-gray-400">{i.from}</div></div>
              <span className="font-bold text-amber-700 dark:text-amber-400">{i.qty}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
