import { TrendingUp, TrendingDown, DollarSign, Plus, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatDate, clsx } from '../utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

const MONTHLY_DATA = [
  { month: 'Jun', income: 32000, expense: 21000 },
  { month: 'Jul', income: 18000, expense: 28000 },
  { month: 'Aug', income: 25000, expense: 19000 },
  { month: 'Sep', income: 42000, expense: 22000 },
  { month: 'Oct', income: 55000, expense: 18000 },
];

const TRANSACTIONS = [
  { date: '2026-10-22', type: 'income', category: 'Paddy Sale', amount: 18500, note: 'Kharif paddy sold at APMC' },
  { date: '2026-10-20', type: 'expense', category: 'Fertilizer', amount: 4200, note: 'Urea + DAP for banana' },
  { date: '2026-10-18', type: 'income', category: 'Milk Sale', amount: 3800, note: 'Weekly dairy income' },
  { date: '2026-10-15', type: 'expense', category: 'Labor', amount: 3500, note: 'Harvesting groundnut' },
  { date: '2026-10-10', type: 'expense', category: 'Irrigation', amount: 1800, note: 'Electric pump charges' },
  { date: '2026-10-08', type: 'income', category: 'Egg Sale', amount: 2880, note: '240 eggs × ₹12' },
  { date: '2026-10-05', type: 'expense', category: 'Seeds', amount: 2200, note: 'Rabi crop seeds' },
  { date: '2026-10-01', type: 'income', category: 'Banana Sale', amount: 12000, note: 'Ney Poovan batch' },
];

export default function FinancePage() {
  const totalIncome = TRANSACTIONS.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = TRANSACTIONS.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const netProfit = totalIncome - totalExpense;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Farm Finance</h1>
          <p className="section-subtitle">Track income, expenses and profitability (Demo Data)</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-sm"><Plus className="w-4 h-4" /> Add Income</button>
          <button className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add Expense</button>
        </div>
      </div>

      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-center gap-2 text-xs text-yellow-700 dark:text-yellow-400">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        All financial figures are illustrative demo data. Consult a Chartered Accountant for actual farm financial planning.
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Income (Oct)', value: totalIncome, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Total Expense (Oct)', value: totalExpense, icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
          { label: 'Net Profit (Oct)', value: netProfit, icon: DollarSign, color: netProfit >= 0 ? 'text-forest dark:text-lime' : 'text-red-600', bg: 'bg-mint dark:bg-brand-900/20' },
        ].map(s => (
          <div key={s.label} className={clsx('card border-0', s.bg)}>
            <div className="flex items-center gap-3">
              <s.icon className={clsx('w-6 h-6', s.color)} />
              <div>
                <div className={clsx('text-2xl font-bold', s.color)}>{formatCurrency(s.value)}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Monthly Income vs Expense (Demo)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => [formatCurrency(v)]} />
              <Legend />
              <Bar dataKey="income" fill="#176B45" radius={[3,3,0,0]} name="Income" />
              <Bar dataKey="expense" fill="#ef4444" radius={[3,3,0,0]} name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Net Profit Trend (Demo)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MONTHLY_DATA.map(m => ({ ...m, profit: m.income - m.expense }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => [formatCurrency(v), 'Net Profit']} />
              <Line type="monotone" dataKey="profit" stroke="#176B45" strokeWidth={2.5} dot={{ r: 4, fill: '#176B45' }} name="Net Profit" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction log */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions (Demo)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 dark:border-gray-800">
              {['Date','Type','Category','Note','Amount'].map(h =>
                <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500">{h}</th>)}
            </tr></thead>
            <tbody>
              {TRANSACTIONS.map((t, i) => (
                <tr key={i} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">{formatDate(t.date)}</td>
                  <td className="py-2.5 px-3">
                    <span className={clsx('badge text-xs', t.type === 'income' ? 'badge-green' : 'badge-red')}>{t.type}</span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-gray-900 dark:text-white">{t.category}</td>
                  <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400 text-xs">{t.note}</td>
                  <td className={clsx('py-2.5 px-3 font-bold', t.type === 'income' ? 'text-green-600' : 'text-red-600')}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
