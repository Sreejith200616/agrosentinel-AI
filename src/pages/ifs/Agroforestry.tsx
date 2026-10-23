import { TreePine, Plus } from 'lucide-react';
import { formatDate, clsx } from '../../utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TREES = [
  { species: 'Moringa (Drum Stick)', count: 50, planted: '2024-06-15', age: 2.3, height: '3.5m', survival: 94, benefit: 'Leaf vegetable, nutritional' },
  { species: 'Teak (Tectona grandis)', count: 30, planted: '2023-07-01', age: 3.3, height: '5.2m', survival: 90, benefit: 'Timber, long-term income' },
  { species: 'Neem (Azadirachta indica)', count: 20, planted: '2023-07-01', age: 3.3, height: '4.8m', survival: 95, benefit: 'Biopesticide, shade' },
  { species: 'Mango (Alphonso)', count: 40, planted: '2022-08-01', age: 4.2, height: '3.1m', survival: 88, benefit: 'Fruit income, 3rd year onwards' },
  { species: 'Coconut (hybrid)', count: 25, planted: '2022-06-01', age: 4.4, height: '2.8m', survival: 92, benefit: 'Nut income, 5th year onwards' },
  { species: 'Gliricidia (Green manure)', count: 15, planted: '2025-01-01', age: 1.8, height: '2.2m', survival: 96, benefit: 'N-fixing, fodder, shade' },
];

const co2Data = Array.from({ length: 5 }, (_, i) => ({
  year: `Year ${i + 1}`,
  co2: Math.round(180 * (i + 1) * 1.2),
}));

export default function AgroforestryPage() {
  const totalTrees = TREES.reduce((s, t) => s + t.count, 0);
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="section-title">Agroforestry</h1><p className="section-subtitle">Farm trees and timber management (Demo Data)</p></div>
        <button className="btn-primary"><Plus className="w-4 h-4" /> Add Species</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tree Species', value: '6', sub: '180 total trees' },
          { label: 'Total Trees', value: totalTrees.toString(), sub: 'On farm boundary/plots' },
          { label: 'Avg Survival', value: '92.5%', sub: 'Across all species' },
          { label: 'CO₂ Sequestered', value: '~810 kg', sub: 'Estimated this year' },
        ].map(s => (
          <div key={s.label} className="card"><div className="text-2xl font-bold text-teal-600 dark:text-teal-400">{s.value}</div><div className="text-sm text-gray-500 mt-0.5">{s.label}</div><div className="text-xs text-gray-400">{s.sub}</div></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Estimated CO₂ Sequestration (Cumulative)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={co2Data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} unit=" kg" />
              <Tooltip formatter={(v: any) => [`${v} kg CO₂`, 'Sequestered']} />
              <Area type="monotone" dataKey="co2" stroke="#0d9488" fill="#ccfbf1" strokeWidth={2} name="CO₂" />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 mt-2">Estimated using average biomass accumulation rates. Actual values vary by species and conditions.</p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Agroforestry Benefits</h3>
          <div className="space-y-2">
            {[
              { benefit: 'Soil Conservation', desc: 'Tree roots reduce erosion, improve soil structure' },
              { benefit: 'Microclimate', desc: 'Shade reduces crop heat stress in summer' },
              { benefit: 'Biodiversity', desc: 'Habitat for pollinators and natural pest enemies' },
              { benefit: 'Additional Income', desc: 'Timber, fruit, and leaf products diversify income' },
              { benefit: 'Carbon Sequestration', desc: 'Trees store atmospheric CO₂ long-term' },
            ].map(b => (
              <div key={b.benefit} className="flex items-start gap-2 p-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                <TreePine className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                <div><div className="text-sm font-medium text-gray-800 dark:text-gray-200">{b.benefit}</div><div className="text-xs text-gray-500">{b.desc}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Tree Inventory</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 dark:border-gray-800">{['Species','Count','Planted','Age','Height','Survival','Benefit'].map(h => <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500">{h}</th>)}</tr></thead>
            <tbody>
              {TREES.map(t => (
                <tr key={t.species} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-gray-900 dark:text-white">{t.species}</td>
                  <td className="py-2.5 px-3">{t.count}</td>
                  <td className="py-2.5 px-3 text-gray-500">{formatDate(t.planted)}</td>
                  <td className="py-2.5 px-3">{t.age} yrs</td>
                  <td className="py-2.5 px-3">{t.height}</td>
                  <td className="py-2.5 px-3"><span className={clsx('badge', t.survival >= 90 ? 'badge-green' : 'badge-yellow')}>{t.survival}%</span></td>
                  <td className="py-2.5 px-3 text-gray-500 text-xs max-w-[160px]">{t.benefit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
