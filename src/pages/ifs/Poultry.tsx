import { Bird, AlertTriangle, Egg, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const eggData = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - (13 - i));
  return { date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }), eggs: Math.round(235 + Math.random() * 20 - 10) };
});

export default function PoultryPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="section-title">Poultry Farming</h1><p className="section-subtitle">Broiler & layer flock management (Demo Data)</p></div>
      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-sm text-red-700 dark:text-red-400">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" /><strong>Safety:</strong>&nbsp;Raw poultry manure must never be applied directly to food crops. Composting for minimum 60 days with proper turning is required before agricultural use.
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Broiler Flock', value: '500', sub: 'Avg weight 1.8 kg', color: 'text-orange-600' },
          { label: 'Layer Flock', value: '300', sub: 'Production rate 80%', color: 'text-yellow-600' },
          { label: 'Daily Eggs', value: '240', sub: 'From 300 layers', color: 'text-amber-600' },
          { label: 'Monthly Income', value: formatCurrency(38000), sub: 'Eggs + broiler (est.)', color: 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="card">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Egg Production — Last 14 Days (Demo)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={eggData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v: any) => [`${v} eggs`, 'Production']} />
            <Bar dataKey="eggs" fill="#eab308" radius={[3,3,0,0]} name="Eggs" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Vaccination Schedule</h3>
          {[
            { disease: 'Newcastle Disease', date: '2026-11-10', type: 'Broiler + Layer' },
            { disease: 'Infectious Bursal Disease', date: '2026-11-25', type: 'Layer only' },
            { disease: 'Marek\'s Disease', date: '2026-12-05', type: 'Day-old chicks' },
          ].map(v => (
            <div key={v.disease} className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800 text-sm">
              <div><div className="font-medium text-gray-800 dark:text-gray-200">{v.disease}</div><div className="text-xs text-gray-400">{v.type}</div></div>
              <span className="badge badge-blue text-xs">{v.date}</span>
            </div>
          ))}
          <p className="text-xs text-gray-400 mt-2">Consult a poultry veterinarian for dosage and administration.</p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Manure Management</h3>
          <div className="space-y-2 text-sm">
            <div className="p-2.5 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <div className="font-medium text-orange-800 dark:text-orange-200">Daily Manure: ~80 kg/day</div>
              <div className="text-xs text-orange-700 dark:text-orange-300 mt-1">Route to dedicated composting unit. Maintain separation from food areas.</div>
            </div>
            <div className="p-2.5 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="font-medium text-green-800 dark:text-green-200">After composting (60+ days):</div>
              <div className="text-xs text-green-700 dark:text-green-300 mt-1">High-value organic fertilizer. Test for pathogens before field application.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
