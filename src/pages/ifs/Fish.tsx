import { Fish, AlertTriangle, Droplets, Activity } from 'lucide-react';
import { formatCurrency, clsx } from '../../utils';

const PONDS = [
  { id: 'A', name: 'Pond A', area: '0.5 ac', species: 'Rohu, Catla, Common Carp', stocked: 500, ph: 7.2, do_: 6.5, temp: 28, ammonia: 0.02 },
  { id: 'B', name: 'Pond B', area: '0.3 ac', species: 'Tilapia', stocked: 400, ph: 7.5, do_: 7.1, temp: 29, ammonia: 0.01 },
];

function wqStatus(ph: number, do_: number) {
  const phOk = ph >= 6.5 && ph <= 8.5;
  const doOk = do_ >= 5;
  if (phOk && doOk) return 'good';
  if (!phOk || do_ < 3) return 'poor';
  return 'caution';
}

export default function FishPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="section-title">Fish Farming</h1><p className="section-subtitle">Pond aquaculture management (Demo Data)</p></div>
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" /><strong>Water Reuse Notice:</strong>&nbsp;Fish pond water must be tested for pathogens, nutrient levels, and salinity before any irrigation use. Obtain laboratory analysis and confirm safety with agricultural/environmental officers.
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Ponds', value: '2', sub: '0.8 acres total' },
          { label: 'Fish Stocked', value: '900', sub: 'Combined both ponds' },
          { label: 'Days to Harvest', value: '~90', sub: 'Pond A primary crop' },
          { label: 'Est. Yield', value: '450 kg', sub: 'Combined harvest (est.)' },
        ].map(s => (
          <div key={s.label} className="card"><div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{s.value}</div><div className="text-sm text-gray-500 mt-0.5">{s.label}</div><div className="text-xs text-gray-400 mt-0.5">{s.sub}</div></div>
        ))}
      </div>
      {PONDS.map(p => {
        const status = wqStatus(p.ph, p.do_);
        return (
          <div key={p.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div><h3 className="font-semibold text-gray-900 dark:text-white">{p.name} — {p.area}</h3><div className="text-sm text-gray-500">{p.species}</div></div>
              <span className={clsx('badge', status === 'good' ? 'badge-green' : status === 'caution' ? 'badge-yellow' : 'badge-red')}>
                {status === 'good' ? '✓ WQ Good' : status === 'caution' ? '⚠ Monitor' : '✗ Action Needed'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'pH', value: p.ph.toString(), ok: p.ph >= 6.5 && p.ph <= 8.5, ideal: '6.5–8.5' },
                { label: 'DO (mg/L)', value: p.do_.toString(), ok: p.do_ >= 5, ideal: '>5 mg/L' },
                { label: 'Temperature', value: `${p.temp}°C`, ok: p.temp <= 32, ideal: '<32°C' },
                { label: 'Ammonia (ppm)', value: p.ammonia.toString(), ok: p.ammonia < 0.05, ideal: '<0.05 ppm' },
              ].map(m => (
                <div key={m.label} className={clsx('p-3 rounded-xl', m.ok ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20')}>
                  <div className={clsx('text-xl font-bold', m.ok ? 'text-green-600' : 'text-red-600')}>{m.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{m.label}</div>
                  <div className="text-xs text-gray-400">Ideal: {m.ideal}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Fish Pond Water — Irrigation Use Guidelines</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-yellow-700 dark:text-yellow-300">Test for E.coli, total coliforms, and BOD before any irrigation use. Use certified laboratory services.</div>
          </div>
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <Droplets className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-blue-700 dark:text-blue-300">If water quality meets FAO guidelines, it can be used for irrigation of non-food crops or with drip systems (avoiding fruit contact). Consult local environmental officers.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
