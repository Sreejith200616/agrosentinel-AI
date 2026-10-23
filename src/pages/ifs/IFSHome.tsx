import { Link } from 'react-router-dom';
import { Leaf, Beef, Bird, Fish, Flame, TreePine, Worm, AlertTriangle, ArrowRight, CheckCircle, GitBranch, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { clsx, formatCurrency } from '../../utils';

const ENTERPRISES = [
  { icon: Leaf, title: 'Crop Farming', desc: 'Paddy, Banana, Groundnut cultivation', status: 'active', metric: '4.5 ac · 3 crops', to: '/dashboard', color: 'bg-green-500' },
  { icon: Beef, title: 'Dairy Farming', desc: 'Cattle, buffalo milk production', status: 'active', metric: '12 animals · 55 L/day', to: '/ifs/dairy', color: 'bg-amber-500' },
  { icon: Bird, title: 'Poultry Farming', desc: 'Broiler and layer management', status: 'active', metric: '800 birds · 240 eggs/day', to: '/ifs/poultry', color: 'bg-yellow-500' },
  { icon: Fish, title: 'Fish Farming', desc: 'Pond aquaculture systems', status: 'active', metric: '2 ponds · 0.8 ac', to: '/ifs/fish', color: 'bg-blue-500' },
  { icon: Worm, title: 'Vermicomposting', desc: 'Organic waste to compost', status: 'active', metric: '2 active batches', to: '/ifs/compost', color: 'bg-amber-700' },
  { icon: Flame, title: 'Biogas Plant', desc: 'Renewable energy from dung', status: 'active', metric: '3m³ · 1.2 m³ gas/day', to: '/ifs/biogas', color: 'bg-orange-500' },
  { icon: TreePine, title: 'Agroforestry', desc: 'Farm trees and timber', status: 'active', metric: '180 trees · 6 species', to: '/ifs/agroforestry', color: 'bg-teal-500' },
  { icon: Bird, title: 'Duck Farming', desc: 'Duck flock and egg production', status: 'coming', metric: 'Not started', to: '/ifs', color: 'bg-cyan-500' },
  { icon: Beef, title: 'Goat & Sheep', desc: 'Small ruminant farming', status: 'coming', metric: 'Not started', to: '/ifs', color: 'bg-gray-500' },
  { icon: GitBranch, title: 'Beekeeping', desc: 'Honey production, pollination', status: 'coming', metric: 'Not started', to: '/ifs', color: 'bg-yellow-600' },
  { icon: Leaf, title: 'Mushroom Farming', desc: 'Substrate cultivation', status: 'coming', metric: 'Not started', to: '/ifs', color: 'bg-purple-500' },
];

const INCOME_DATA = [
  { name: 'Crops', value: 145000, color: '#176B45' },
  { name: 'Dairy', value: 55000, color: '#f59e0b' },
  { name: 'Poultry', value: 38000, color: '#eab308' },
  { name: 'Fish', value: 22000, color: '#3b82f6' },
  { name: 'Compost/Biogas', value: 8000, color: '#a16207' },
];

// IFS resource flow nodes
const FLOWS = [
  { from: 'Crops', to: 'Livestock', via: 'Crop residues (suitable only)', safe: true },
  { from: 'Dairy/Poultry', to: 'Composting', via: 'Animal manure (must be composted 45+ days)', safe: false },
  { from: 'Composting', to: 'Crops', via: 'Treated compost', safe: true },
  { from: 'Composting', to: 'Biogas', via: 'Organic slurry', safe: true },
  { from: 'Biogas', to: 'Crops', via: 'Treated digestate (test before use)', safe: false },
  { from: 'Fish Pond', to: 'Crops', via: 'Pond water (quality test required)', safe: false },
  { from: 'Crops', to: 'Composting', via: 'Harvest by-products', safe: true },
];

export default function IFSPage() {
  const totalIncome = INCOME_DATA.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title">Integrated Farming System</h1>
        <p className="section-subtitle">Manage all farm enterprises together for maximum efficiency and sustainability</p>
      </div>

      {/* Safety notice */}
      <div className="flex items-start gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-red-700 dark:text-red-300">
          <strong>Important Safety Notice:</strong> Raw animal manure, untreated poultry waste, fish pond water, and biogas digestate must undergo proper treatment, quality testing, and stabilization before any agricultural use. Never apply untreated waste directly to food crops. Follow local regulatory guidelines.
        </div>
      </div>

      {/* Resource flow diagram */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">IFS Resource Flow Diagram</h2>
        <div className="overflow-x-auto">
          <div className="min-w-[640px] relative">
            {/* Center farm */}
            <div className="flex flex-wrap gap-4 justify-center items-start p-4">
              {/* Left: Crops */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 border-2 border-green-400 rounded-2xl flex items-center justify-center">
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">Crops</span>
              </div>

              {/* Center arrows */}
              <div className="flex flex-col gap-2 mt-6">
                {FLOWS.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="font-medium text-gray-600 dark:text-gray-300 w-24 text-right">{f.from}</span>
                    <div className={clsx('flex items-center gap-1 px-2 py-1 rounded-full text-xs',
                      f.safe ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400')}>
                      <ArrowRight className="w-3 h-3" />
                      <span>{f.via}</span>
                    </div>
                    <span className="font-medium text-gray-600 dark:text-gray-300 w-24">{f.to}</span>
                    {!f.safe && <AlertTriangle className="w-3 h-3 text-yellow-500" />}
                  </div>
                ))}
              </div>

              {/* Right: Biogas */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-400 rounded-2xl flex items-center justify-center">
                  <Flame className="w-8 h-8 text-orange-600" />
                </div>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">Biogas</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2 px-4">
              <div className="flex items-center gap-1 text-xs text-green-600"><div className="w-4 h-1 bg-green-400 rounded" /> Safe transfer</div>
              <div className="flex items-center gap-1 text-xs text-yellow-600"><div className="w-4 h-1 bg-yellow-400 rounded" /> Treatment required</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise cards */}
      <div>
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Farm Enterprises</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ENTERPRISES.map(e => (
            <Link
              key={e.title}
              to={e.to}
              className={clsx('card hover:shadow-card-hover transition-all group', e.status === 'coming' && 'opacity-70')}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', e.color)}>
                  <e.icon className="w-5 h-5 text-white" />
                </div>
                {e.status === 'active'
                  ? <span className="badge badge-green text-xs">Active</span>
                  : <span className="badge bg-gray-100 text-gray-500 text-xs">Coming Soon</span>}
              </div>
              <div className="font-semibold text-gray-900 dark:text-white text-sm">{e.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{e.desc}</div>
              <div className="text-xs font-medium text-forest dark:text-lime mt-2">{e.metric}</div>
              {e.status === 'active' && (
                <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mt-3 group-hover:text-forest dark:group-hover:text-lime transition-colors">
                  Manage <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Income chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Annual Income by Enterprise (Demo)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={INCOME_DATA} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {INCOME_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: any) => [formatCurrency(v), 'Income']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Enterprise Summary (Demo Data)</h3>
          <div className="space-y-2">
            {INCOME_DATA.map(d => (
              <div key={d.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <div className="flex-1 text-sm text-gray-700 dark:text-gray-200">{d.name}</div>
                <div className="font-semibold text-gray-900 dark:text-white">{formatCurrency(d.value)}</div>
                <div className="text-xs text-gray-400">{((d.value / totalIncome) * 100).toFixed(0)}%</div>
              </div>
            ))}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-2 flex items-center gap-3">
              <div className="w-3 h-3" />
              <div className="flex-1 text-sm font-bold text-gray-900 dark:text-white">Total (Illustrative)</div>
              <div className="font-bold text-forest dark:text-lime">{formatCurrency(totalIncome)}</div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">⚠ Illustrative figures for demonstration only. Actual income varies.</p>
        </div>
      </div>
    </div>
  );
}
