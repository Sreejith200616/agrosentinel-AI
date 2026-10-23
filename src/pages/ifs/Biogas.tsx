import { Flame, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const gasData = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - (13 - i));
  return { date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }), gas: parseFloat((1.1 + Math.random() * 0.5).toFixed(2)) };
});

const LPG_SAVED = 30 * 1.3 * 70; // 30 days * 1.3m³ * ₹70/m³ equivalent

export default function BiogasPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="section-title">Biogas Plant</h1><p className="section-subtitle">Renewable energy from organic waste (Demo Data)</p></div>
      <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl flex items-center gap-2 text-sm text-orange-700 dark:text-orange-400">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" /><strong>Digestate Notice:</strong>&nbsp;Biogas digestate must be stabilized and tested before agricultural application. pH, pathogen reduction, and nutrient levels should be verified. Consult agricultural and environmental officers.
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Digester Capacity', value: '3 m³', sub: 'Fixed-dome type' },
          { label: 'Daily Gas Production', value: '~1.3 m³', sub: 'Estimated' },
          { label: 'Daily Digestate', value: '~25 kg', sub: 'After stabilization' },
          { label: 'Monthly LPG Saving', value: formatCurrency(Math.round(LPG_SAVED)), sub: 'Estimated equivalent' },
        ].map(s => (
          <div key={s.label} className="card"><div className="text-xl font-bold text-orange-600 dark:text-orange-400">{s.value}</div><div className="text-sm text-gray-500 mt-0.5">{s.label}</div><div className="text-xs text-gray-400">{s.sub}</div></div>
        ))}
      </div>
      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Daily Gas Production — Last 14 Days (Demo)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={gasData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 10 }} unit="m³" />
            <Tooltip formatter={(v: any) => [`${v} m³`, 'Biogas']} />
            <Bar dataKey="gas" fill="#f97316" radius={[3,3,0,0]} name="Gas (m³)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Daily Feedstock Input</h3>
          <div className="space-y-2 text-sm">
            {[
              { label: 'Cattle Dung', qty: '40 kg' },
              { label: 'Organic Kitchen Waste', qty: '10 kg' },
              { label: 'Water (to slurry)', qty: '50 L' },
              { label: 'Total Slurry', qty: '~100 kg' },
            ].map(f => (
              <div key={f.label} className="flex justify-between py-1.5 border-b border-gray-50 dark:border-gray-800">
                <span className="text-gray-600 dark:text-gray-300">{f.label}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{f.qty}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Digestate Quality (Demo)</h3>
          <div className="space-y-2 text-sm">
            {[
              { param: 'Nitrogen (N)', value: '~1.2%', note: 'Slow-release' },
              { param: 'Phosphorus (P)', value: '~0.6%', note: 'Available' },
              { param: 'Potassium (K)', value: '~1.0%', note: 'Soluble' },
              { param: 'pH', value: '6.8–7.5', note: 'Near neutral' },
            ].map(d => (
              <div key={d.param} className="flex justify-between py-1.5 border-b border-gray-50 dark:border-gray-800">
                <div><div className="text-gray-700 dark:text-gray-200">{d.param}</div><div className="text-xs text-gray-400">{d.note}</div></div>
                <span className="font-semibold text-orange-600 dark:text-orange-400">{d.value}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">Get lab analysis before field application. Allow proper stabilization period.</p>
        </div>
      </div>
    </div>
  );
}
