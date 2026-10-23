import { useState } from 'react';
import { AlertTriangle, CheckCircle, Calculator, Printer, Info, Leaf, FlaskConical } from 'lucide-react';
import { CROPS_TN, FERTILIZER_PRODUCTS, formatCurrency, clsx } from '../utils';

const NPK_RECS: Record<string, { n: number; p: number; k: number }> = {
  'Paddy': { n: 120, p: 60, k: 60 }, 'Banana': { n: 200, p: 60, k: 300 },
  'Groundnut': { n: 25, p: 50, k: 50 }, 'Sugarcane': { n: 275, p: 75, k: 150 },
  'Cotton': { n: 120, p: 60, k: 60 }, 'Maize': { n: 120, p: 60, k: 60 },
  'Tomato': { n: 150, p: 75, k: 75 }, 'Onion': { n: 120, p: 60, k: 100 },
  'Blackgram': { n: 25, p: 50, k: 25 }, 'Greengram': { n: 25, p: 50, k: 25 },
  'Coconut': { n: 100, p: 40, k: 120 }, 'Brinjal': { n: 100, p: 50, k: 50 },
};

const SCHEDULES: Record<string, { timing: string; n: number; p: number; k: number }[]> = {
  'Paddy': [
    { timing: 'Basal (at transplanting)', n: 0, p: 100, k: 50 },
    { timing: 'Tillering (25-30 DAS)', n: 50, p: 0, k: 50 },
    { timing: 'Panicle Initiation (55-60 DAS)', n: 50, p: 0, k: 0 },
  ],
  'default': [
    { timing: 'Basal (before sowing)', n: 25, p: 100, k: 50 },
    { timing: 'Top Dress 1 (30 DAS)', n: 50, p: 0, k: 50 },
    { timing: 'Top Dress 2 (60 DAS)', n: 25, p: 0, k: 0 },
  ],
};

interface FertResult {
  crop: string; area: number;
  npkPerHa: { n: number; p: number; k: number };
  npkTotal: { n: number; p: number; k: number };
  products: { name: string; qty: number; cost: number; type: string }[];
  schedule: { timing: string; products: string; notes: string }[];
  totalCost: number;
  warnings: string[];
}

export default function FertilizerPage() {
  const [crop, setCrop] = useState('Paddy');
  const [area, setArea] = useState(1);
  const [stage, setStage] = useState('Basal');
  const [soilN, setSoilN] = useState(180);
  const [result, setResult] = useState<FertResult | null>(null);

  function calculate() {
    const rec = NPK_RECS[crop] ?? { n: 100, p: 50, k: 50 };
    const areaHa = area * 0.4047;

    // Adjust for soil status
    const adjN = Math.max(0, rec.n - (soilN > 280 ? 20 : soilN > 180 ? 0 : 20));
    const npkHa = { n: adjN, p: rec.p, k: rec.k };
    const npkTotal = { n: npkHa.n * areaHa, p: npkHa.p * areaHa, k: npkHa.k * areaHa };

    // Calculate fertilizer products
    const products: FertResult['products'] = [];
    const warnings: string[] = [];

    // Urea for N
    if (npkTotal.n > 0) {
      const urea = FERTILIZER_PRODUCTS.find(f => f.name === 'Urea')!;
      const qty = (npkTotal.n / (urea.n / 100));
      products.push({ name: 'Urea (46% N)', qty: Math.round(qty), cost: Math.round(qty * urea.pricePerKg), type: 'chemical' });
    }

    // DAP for P
    if (npkTotal.p > 0) {
      const dap = FERTILIZER_PRODUCTS.find(f => f.name === 'DAP')!;
      const qty = (npkTotal.p / (dap.p / 100));
      const nFromDAP = qty * (dap.n / 100);
      products.push({ name: 'DAP (18N:46P)', qty: Math.round(qty), cost: Math.round(qty * dap.pricePerKg), type: 'chemical' });
      if (nFromDAP > npkTotal.n * 0.3) warnings.push('DAP provides significant N — adjust Urea quantity to avoid N excess.');
    }

    // MOP for K
    if (npkTotal.k > 0) {
      const mop = FERTILIZER_PRODUCTS.find(f => f.name === 'MOP')!;
      const qty = (npkTotal.k / (mop.k / 100));
      products.push({ name: 'MOP (60% K)', qty: Math.round(qty), cost: Math.round(qty * mop.pricePerKg), type: 'chemical' });
    }

    // Organic option
    const fymQty = Math.round(areaHa * 5000);
    products.push({ name: 'FYM/Compost (recommended)', qty: fymQty, cost: Math.round(fymQty * 0.5), type: 'organic' });

    const schedule = (SCHEDULES[crop] ?? SCHEDULES['default']).map(s => ({
      timing: s.timing,
      products: [
        s.p > 0 ? 'DAP' : '', s.k > 0 ? 'MOP' : '', s.n > 0 ? 'Urea' : '',
      ].filter(Boolean).join(', ') || 'No application in this dose',
      notes: 'Apply in moist soil. Avoid waterlogged or very dry conditions.',
    }));

    if (rec.n > 150) warnings.push('High N crop — apply in at least 3 split doses to minimize leaching.');
    warnings.push('Always verify recommendations with your local agricultural extension officer.');

    setResult({
      crop, area, npkPerHa: npkHa, npkTotal,
      products,
      schedule,
      totalCost: products.reduce((s, p) => s + p.cost, 0),
      warnings,
    });
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div>
        <h1 className="section-title">Fertilizer Advisor</h1>
        <p className="section-subtitle">Crop-specific nutrient management calculator</p>
      </div>

      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-400">
        <Info className="w-4 h-4 flex-shrink-0" />
        Based on standard TNAU recommendations. For best results, use actual soil test values. Consult your local Extension Officer.
      </div>

      {/* Input form */}
      <div className="card">
        <h2 className="font-bold text-gray-900 dark:text-white mb-5">Fertilizer Calculator</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="label">Crop</label>
            <select className="input" value={crop} onChange={e => setCrop(e.target.value)}>
              {CROPS_TN.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Farm Area (Acres)</label>
            <input type="number" className="input" min={0.1} step={0.5} value={area}
              onChange={e => setArea(parseFloat(e.target.value))} />
          </div>
          <div>
            <label className="label">Growth Stage</label>
            <select className="input" value={stage} onChange={e => setStage(e.target.value)}>
              {['Basal','Tillering','Vegetative','Flowering','Grain Filling','Top Dressing'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="label">Soil N Status (kg/ha) <span className="text-gray-400 font-normal">optional</span></label>
            <input type="number" className="input" value={soilN}
              onChange={e => setSoilN(parseFloat(e.target.value))} placeholder="280" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-5">
          <Calculator className="w-4 h-4" /> Calculate Fertilizer Plan
        </button>
      </div>

      {result && (
        <div className="space-y-4 animate-slide-up">
          {/* NPK Summary */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Nitrogen (N)', value: result.npkTotal.n, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              { label: 'Phosphorus (P)', value: result.npkTotal.p, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
              { label: 'Potassium (K)', value: result.npkTotal.k, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
            ].map(s => (
              <div key={s.label} className={clsx('card text-center', s.bg, 'border-0')}>
                <div className={clsx('text-3xl font-bold', s.color)}>{Math.round(s.value)}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">kg total</div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-1">{s.label}</div>
                <div className="text-xs text-gray-400">{Math.round(s.value / 0.4047 / result.area)} kg/ha</div>
              </div>
            ))}
          </div>

          {/* Products table */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Fertilizer Products & Quantities</h3>
              <button onClick={() => window.print()} className="btn-ghost text-sm py-1.5">
                <Printer className="w-4 h-4" /> Print
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    {['Product','Quantity (kg)','Type','Est. Cost'].map(h => (
                      <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.products.map(p => (
                    <tr key={p.name} className="border-b border-gray-50 dark:border-gray-800">
                      <td className="py-3 px-3 font-medium text-gray-900 dark:text-white">{p.name}</td>
                      <td className="py-3 px-3 text-forest dark:text-lime font-bold">{p.qty}</td>
                      <td className="py-3 px-3">
                        <span className={clsx('badge', p.type === 'organic' ? 'badge-green' : 'badge-blue')}>
                          {p.type}
                        </span>
                      </td>
                      <td className="py-3 px-3">{formatCurrency(p.cost)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <td colSpan={3} className="py-3 px-3 font-bold text-gray-900 dark:text-white">Total Input Cost</td>
                    <td className="py-3 px-3 font-bold text-forest dark:text-lime">{formatCurrency(result.totalCost)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Schedule */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Application Schedule ({result.crop})</h3>
            <div className="space-y-3">
              {result.schedule.map((s, i) => (
                <div key={i} className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="w-7 h-7 bg-forest text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{s.timing}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">{s.products}</div>
                    <div className="text-xs text-gray-400 mt-1">{s.notes}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warnings */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Important Notes</h3>
            <div className="space-y-2">
              {result.warnings.map((w, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-200">{w}</span>
                </div>
              ))}
              <div className="flex items-start gap-2 text-sm">
                <Leaf className="w-4 h-4 text-forest dark:text-lime flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-200">Integrate FYM or compost for improved soil health and nutrient use efficiency.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
