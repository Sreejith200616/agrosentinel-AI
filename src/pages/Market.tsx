import { useState, useMemo } from 'react';
import { Search, Star, TrendingUp, TrendingDown, Download, AlertTriangle, MapPin, Calendar } from 'lucide-react';
import { DEMO_MARKET_PRICES, generatePriceHistory, searchMarketPrices } from '../services/market';
import { formatCurrency, formatDate, clsx } from '../utils';
import type { MarketPrice } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function MarketPage() {
  const [query, setQuery] = useState('');
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set(['Paddy (Common)', 'Banana (Ney Poovan)']));
  const [selected, setSelected] = useState<MarketPrice | null>(DEMO_MARKET_PRICES[0]);

  const filtered = useMemo(() => searchMarketPrices(query), [query]);
  const priceHistory = useMemo(() => selected ? generatePriceHistory(selected.modalPrice) : [], [selected]);

  function toggleWatch(commodity: string) {
    setWatchlist(prev => {
      const s = new Set(prev);
      s.has(commodity) ? s.delete(commodity) : s.add(commodity);
      return s;
    });
  }

  function downloadCSV() {
    const header = 'Commodity,Market,State,Min Price,Modal Price,Max Price,Unit,Date\n';
    const rows = DEMO_MARKET_PRICES.map(p =>
      `"${p.commodity}","${p.market}","${p.state}",${p.minPrice},${p.modalPrice},${p.maxPrice},"${p.unit}","${p.date}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'agrosentinel_market_prices_demo.csv';
    a.click(); URL.revokeObjectURL(url);
  }

  const trend = priceHistory.length > 7
    ? priceHistory[priceHistory.length - 1].price > priceHistory[priceHistory.length - 8].price
    : true;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Market Intelligence</h1>
          <p className="section-subtitle">Agricultural commodity prices and market trends</p>
        </div>
        <button onClick={downloadCSV} className="btn-secondary text-sm">
          <Download className="w-4 h-4" /> Download CSV
        </button>
      </div>

      {/* Demo banner */}
      <div className="flex items-center gap-3 px-4 py-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
        <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
        <div className="text-sm">
          <strong className="text-orange-800 dark:text-orange-200">DEMO DATA ONLY</strong>
          <span className="text-orange-700 dark:text-orange-300"> — These are illustrative prices for demonstration purposes. Not actual market prices. For real prices, visit </span>
          <a href="https://agmarknet.gov.in" target="_blank" rel="noopener noreferrer" className="underline font-medium text-orange-700 dark:text-orange-300">agmarknet.gov.in</a>
        </div>
      </div>

      {/* Watchlist */}
      {watchlist.size > 0 && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" /> Watchlist
          </h3>
          <div className="flex flex-wrap gap-3">
            {[...watchlist].map(c => {
              const p = DEMO_MARKET_PRICES.find(m => m.commodity === c);
              if (!p) return null;
              return (
                <div key={c} className="flex items-center gap-3 px-4 py-3 bg-mint dark:bg-brand-900/20 rounded-xl border border-brand-200 dark:border-brand-800">
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{p.commodity}</div>
                    <div className="text-xs text-gray-500">{p.market}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-forest dark:text-lime font-bold">{formatCurrency(p.modalPrice)}</div>
                    <div className="text-xs text-gray-400">/{p.unit}</div>
                  </div>
                  <button onClick={() => toggleWatch(c)} className="text-yellow-500 hover:text-gray-400 transition-colors">
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search + table */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search commodity..."
              className="input pl-9"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                {['Watch','Commodity','Market','Min','Modal','Max','Unit','Date'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr
                  key={`${p.commodity}-${p.market}`}
                  className={clsx(
                    'border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer',
                    selected?.commodity === p.commodity && 'bg-mint/30 dark:bg-brand-900/20'
                  )}
                  onClick={() => setSelected(p)}
                >
                  <td className="py-2.5 px-3">
                    <button onClick={e => { e.stopPropagation(); toggleWatch(p.commodity); }}
                      className={clsx('transition-colors', watchlist.has(p.commodity) ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400')}>
                      <Star className={clsx('w-4 h-4', watchlist.has(p.commodity) && 'fill-current')} />
                    </button>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-gray-900 dark:text-white">{p.commodity}</td>
                  <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">{p.market}</td>
                  <td className="py-2.5 px-3 text-gray-600 dark:text-gray-300">{formatCurrency(p.minPrice)}</td>
                  <td className="py-2.5 px-3 font-bold text-forest dark:text-lime">{formatCurrency(p.modalPrice)}</td>
                  <td className="py-2.5 px-3 text-gray-600 dark:text-gray-300">{formatCurrency(p.maxPrice)}</td>
                  <td className="py-2.5 px-3 text-gray-400">/{p.unit}</td>
                  <td className="py-2.5 px-3 text-gray-400">{formatDate(p.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Price chart */}
      {selected && (
        <div className="card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{selected.commodity} — Price Trend (30 Days)</h3>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="w-3.5 h-3.5" /> {selected.market}
                </div>
                <div className={clsx('flex items-center gap-1 text-sm font-medium', trend ? 'text-green-600' : 'text-red-600')}>
                  {trend ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {trend ? 'Upward trend' : 'Downward trend'} (7-day)
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-forest dark:text-lime">{formatCurrency(selected.modalPrice)}</div>
              <div className="text-xs text-gray-400">Modal price / {selected.unit}</div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={d => d.slice(5)} />
              <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']}
                tickFormatter={v => `₹${(v/1000).toFixed(1)}k`} />
              <Tooltip formatter={(v: any) => [formatCurrency(v), 'Modal Price']} labelFormatter={(l: any) => String(formatDate(l))} />
              <ReferenceLine y={selected.modalPrice} stroke="#A3D977" strokeDasharray="5 5" label={{ value: 'Current', fontSize: 10, fill: '#A3D977' }} />
              <Line type="monotone" dataKey="price" stroke="#176B45" strokeWidth={2.5} dot={false} name="Price" />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 mt-2">
            * Illustrative price trend for demonstration only. Data source: Demo · Actual price data: agmarknet.gov.in
          </p>
        </div>
      )}
    </div>
  );
}
