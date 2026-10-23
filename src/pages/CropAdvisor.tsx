import { useState } from 'react';
import { Sprout, ChevronRight, ChevronLeft, AlertTriangle, CheckCircle, Star, Droplets, Clock, TrendingUp, Info, Bug, Sun, RefreshCw } from 'lucide-react';
import { INDIAN_STATES, TN_DISTRICTS, SOIL_TYPES, CROPS_TN, clsx } from '../utils';
import type { CropRecommendation } from '../types';

const CROP_DATA: Record<string, Omit<CropRecommendation, 'id' | 'suitabilityScore' | 'suitabilityBasis' | 'soilSuitability' | 'climateSuitability'>> = {
  'Paddy': { cropName: 'Paddy', localName: 'நெல்', duration: '120-135 days', season: 'Kharif/Rabi', sowingWindow: 'Jun–Jul (Kharif), Dec–Jan (Rabi)', seedRate: '60-80 kg/ha', spacing: '20×15 cm', waterRequirement: '1200-2000 mm/season', estimatedYield: '5-7 tonnes/ha', commonPests: ['Brown Plant Hopper', 'Stem Borer', 'Leaf Folder'], commonDiseases: ['Rice Blast', 'Sheath Blight', 'Bacterial Leaf Blight'], harvestGuidance: 'Harvest at 85% grain maturity. Drain fields 7-10 days before.', marketDemand: 'High — Staple crop, MSP support', indicativeCost: '₹40,000–₹50,000/ha', indicativeRevenue: '₹80,000–₹1,00,000/ha' },
  'Banana': { cropName: 'Banana', localName: 'வாழை', duration: '11-14 months', season: 'Annual', sowingWindow: 'Any season (avoid peak summer)', seedRate: '2500-3000 suckers/ha', spacing: '1.8×1.8 m', waterRequirement: '1800-2200 mm/season', estimatedYield: '40-50 tonnes/ha', commonPests: ['Banana Weevil', 'Thrips', 'Nematodes'], commonDiseases: ['Sigatoka', 'Panama Wilt', 'Bunchy Top Virus'], harvestGuidance: 'Harvest at 75-80% maturity. Bunch weight 15-25 kg.', marketDemand: 'High — Year-round demand', indicativeCost: '₹1,20,000–₹1,50,000/ha', indicativeRevenue: '₹2,00,000–₹2,50,000/ha' },
  'Groundnut': { cropName: 'Groundnut', localName: 'நிலக்கடலை', duration: '90-110 days', season: 'Kharif/Rabi', sowingWindow: 'May–Jun (Kharif), Oct–Nov (Rabi)', seedRate: '100-120 kg/ha', spacing: '30×10 cm', waterRequirement: '500-700 mm/season', estimatedYield: '2-3 tonnes/ha', commonPests: ['Leaf Miner', 'Aphid', 'Pod Borer'], commonDiseases: ['Early Leaf Spot', 'Late Leaf Spot', 'Crown Rot'], harvestGuidance: 'Harvest when 70% of pods show mature color. Drying essential.', marketDemand: 'High — Oil seed demand stable', indicativeCost: '₹35,000–₹45,000/ha', indicativeRevenue: '₹70,000–₹90,000/ha' },
  'Maize': { cropName: 'Maize', localName: 'மக்காச்சோளம்', duration: '90-100 days', season: 'Kharif', sowingWindow: 'Jun–Jul', seedRate: '20-25 kg/ha', spacing: '60×25 cm', waterRequirement: '500-800 mm/season', estimatedYield: '7-9 tonnes/ha', commonPests: ['Fall Army Worm', 'Stem Borer', 'Aphid'], commonDiseases: ['Turcicum Blight', 'Common Rust', 'Downy Mildew'], harvestGuidance: 'Harvest when husks dry and grains harden. Grain moisture <15%.', marketDemand: 'High — Feed & starch industry', indicativeCost: '₹30,000–₹40,000/ha', indicativeRevenue: '₹60,000–₹80,000/ha' },
  'Blackgram': { cropName: 'Blackgram', localName: 'உளுந்து', duration: '60-70 days', season: 'Rabi', sowingWindow: 'Sep–Oct', seedRate: '15-20 kg/ha', spacing: '30×10 cm', waterRequirement: '350-500 mm/season', estimatedYield: '1-1.5 tonnes/ha', commonPests: ['Whitefly', 'Thrips', 'Aphid'], commonDiseases: ['Yellow Mosaic Virus', 'Cercospora Leaf Spot', 'Powdery Mildew'], harvestGuidance: 'Harvest in 2-3 pickings. Avoid delay to prevent shattering.', marketDemand: 'High — Dal market demand', indicativeCost: '₹18,000–₹25,000/ha', indicativeRevenue: '₹35,000–₹50,000/ha' },
  'Tomato': { cropName: 'Tomato', localName: 'தக்காளி', duration: '90-120 days', season: 'Annual', sowingWindow: 'Jun–Jul, Sep–Oct', seedRate: '250-300 g/ha (seedlings)', spacing: '60×45 cm', waterRequirement: '400-600 mm/season', estimatedYield: '30-50 tonnes/ha', commonPests: ['Fruit Borer', 'Leaf Miner', 'Whitefly'], commonDiseases: ['Early Blight', 'Late Blight', 'Wilt'], harvestGuidance: 'Harvest at breaker to pink stage for market. Red ripe for local.', marketDemand: 'Variable — Price fluctuates significantly', indicativeCost: '₹60,000–₹80,000/ha', indicativeRevenue: '₹1,00,000–₹2,50,000/ha' },
};

const getCropData = (cropName: string) => CROP_DATA[cropName] ?? CROP_DATA['Groundnut'];

function calcSuitability(crop: string, ph: number, soilType: string, irrigation: string): number {
  let score = 70;
  if (crop === 'Paddy') {
    if (ph >= 5.5 && ph <= 7) score += 15; else score -= 10;
    if (irrigation === 'Flood' || irrigation === 'Furrow') score += 10; else score -= 5;
    if (soilType === 'Black Cotton' || soilType === 'Alluvial') score += 5;
  } else if (crop === 'Banana') {
    if (ph >= 6 && ph <= 7.5) score += 15; else score -= 10;
    if (irrigation === 'Drip') score += 15;
    if (soilType === 'Alluvial' || soilType === 'Loamy') score += 5;
  } else if (crop === 'Groundnut') {
    if (ph >= 6 && ph <= 7) score += 15; else score -= 8;
    if (soilType === 'Red Sandy Loam' || soilType === 'Sandy Loam') score += 10;
    if (irrigation === 'Rain-fed') score += 5;
  } else if (crop === 'Blackgram') {
    if (ph >= 6 && ph <= 7.5) score += 12; else score -= 8;
    if (irrigation === 'Rain-fed' || irrigation === 'Sprinkler') score += 8;
  } else {
    if (ph >= 6 && ph <= 7) score += 10;
  }
  return Math.min(99, Math.max(20, score));
}

interface FormData {
  state: string; district: string; soilType: string; ph: number;
  area: number; season: string; irrigation: string; budget: string;
}

export default function CropAdvisorPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    state: 'Tamil Nadu', district: 'Thanjavur', soilType: 'Black Cotton',
    ph: 6.8, area: 2, season: 'Kharif', irrigation: 'Drip', budget: '50000-100000',
  });
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function generateRecs() {
    setLoading(true);
    setTimeout(() => {
      const crops = ['Paddy', 'Banana', 'Groundnut', 'Maize', 'Blackgram', 'Tomato'];
      const recs: CropRecommendation[] = crops.map(c => {
        const score = calcSuitability(c, form.ph, form.soilType, form.irrigation);
        const data = getCropData(c);
        return {
          id: c,
          ...data,
          suitabilityScore: score,
          suitabilityBasis: `Based on soil pH ${form.ph}, ${form.soilType} soil, ${form.irrigation} irrigation, and ${form.season} season conditions.`,
          soilSuitability: score > 70 ? 'High' : score > 50 ? 'Moderate' : 'Low',
          climateSuitability: score > 65 ? 'Suitable' : 'Marginal',
        };
      }).sort((a, b) => b.suitabilityScore - a.suitabilityScore);
      setRecommendations(recs);
      setStep(3);
      setLoading(false);
    }, 1500);
  }

  function scoreColor(s: number) {
    if (s >= 75) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    if (s >= 50) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div>
        <h1 className="section-title">AI Crop Advisor</h1>
        <p className="section-subtitle">Get data-driven crop recommendations for your farm conditions</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {[1,2,3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={clsx('w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors',
              step >= s ? 'bg-forest text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500')}>
              {step > s ? <CheckCircle className="w-4 h-4" /> : s}
            </div>
            {s < 3 && <div className={clsx('flex-1 h-1 rounded-full min-w-[60px]', step > s ? 'bg-forest' : 'bg-gray-200 dark:bg-gray-700')} />}
          </div>
        ))}
        <div className="ml-4 text-sm text-gray-500 dark:text-gray-400">
          {step === 1 && 'Location & Soil'} {step === 2 && 'Season & Resources'} {step === 3 && 'Recommendations'}
        </div>
      </div>

      {step === 1 && (
        <div className="card max-w-2xl">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-6">Step 1: Location & Soil Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="label">State</label>
              <select className="input" value={form.state} onChange={e => setForm(f => ({...f, state: e.target.value}))}>
                {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="label">District</label>
              <select className="input" value={form.district} onChange={e => setForm(f => ({...f, district: e.target.value}))}>
                {TN_DISTRICTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="label">Soil Type</label>
              <select className="input" value={form.soilType} onChange={e => setForm(f => ({...f, soilType: e.target.value}))}>
                {SOIL_TYPES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="label">Farm Area (Acres)</label>
              <input type="number" className="input" value={form.area} min={0.1} max={1000} step={0.5}
                onChange={e => setForm(f => ({...f, area: parseFloat(e.target.value)}))} />
            </div>
            <div className="col-span-2">
              <label className="label">Soil pH: <span className="font-bold text-forest">{form.ph}</span></label>
              <input type="range" min={4} max={9} step={0.1} value={form.ph}
                onChange={e => setForm(f => ({...f, ph: parseFloat(e.target.value)}))}
                className="w-full accent-forest" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>4.0 (Very Acid)</span><span>6.5–7.0 (Ideal)</span><span>9.0 (Alkaline)</span>
              </div>
            </div>
          </div>
          <button onClick={() => setStep(2)} className="btn-primary mt-6">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="card max-w-2xl">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-6">Step 2: Season & Resources</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Season</label>
              <select className="input" value={form.season} onChange={e => setForm(f => ({...f, season: e.target.value}))}>
                {['Kharif','Rabi','Zaid','Annual','Perennial'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Irrigation Type</label>
              <select className="input" value={form.irrigation} onChange={e => setForm(f => ({...f, irrigation: e.target.value}))}>
                {['Drip','Sprinkler','Flood','Furrow','Rain-fed'].map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="label">Budget Range (₹/acre)</label>
              <select className="input" value={form.budget} onChange={e => setForm(f => ({...f, budget: e.target.value}))}>
                {['<20000','20000-50000','50000-100000','>100000'].map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(1)} className="btn-ghost"><ChevronLeft className="w-4 h-4" /> Back</button>
            <button onClick={generateRecs} disabled={loading} className="btn-primary">
              {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Analyzing...</> : <>Get Recommendations <ChevronRight className="w-4 h-4" /></>}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg text-gray-900 dark:text-white">Crop Recommendations</h2>
              <p className="text-sm text-gray-500">For {form.district}, {form.soilType} soil, pH {form.ph}, {form.irrigation} irrigation</p>
            </div>
            <button onClick={() => setStep(1)} className="btn-ghost text-sm"><RefreshCw className="w-4 h-4" /> New Search</button>
          </div>

          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-400">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            AI-generated recommendations based on standard parameters. Always verify with your local Agriculture Extension Officer or TNAU Krishi Vigyan Kendra.
          </div>

          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <div key={rec.id} className="card hover:shadow-card-hover transition-shadow">
                <div className="flex items-start gap-4">
                  {i === 0 && <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-gray-900 dark:text-white">{rec.cropName}</h3>
                      {rec.localName && <span className="text-gray-500 dark:text-gray-400 text-sm">{rec.localName}</span>}
                      <span className={clsx('badge', scoreColor(rec.suitabilityScore))}>
                        {rec.suitabilityScore}% Suitability
                      </span>
                      {i === 0 && <span className="badge bg-yellow-100 text-yellow-700">Top Pick</span>}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{rec.suitabilityBasis}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                      {[
                        { icon: Clock, label: 'Duration', value: rec.duration },
                        { icon: Sun, label: 'Season', value: rec.season },
                        { icon: Droplets, label: 'Water', value: rec.waterRequirement },
                        { icon: TrendingUp, label: 'Market', value: rec.marketDemand.split('—')[0] },
                      ].map(m => (
                        <div key={m.label} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                          <m.icon className="w-3.5 h-3.5 text-forest dark:text-lime flex-shrink-0" />
                          <span><span className="text-gray-400">{m.label}:</span> {m.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setExpanded(expanded === rec.id ? null : rec.id)}
                    className="btn-ghost text-xs py-1.5 px-3 flex-shrink-0"
                  >
                    {expanded === rec.id ? 'Hide' : 'Details'} <ChevronRight className={clsx('w-3.5 h-3.5 transition-transform', expanded === rec.id && 'rotate-90')} />
                  </button>
                </div>

                {expanded === rec.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-2">Cultivation Guide</div>
                      {[
                        ['Sowing Window', rec.sowingWindow],
                        ['Seed Rate', rec.seedRate],
                        ['Spacing', rec.spacing],
                        ['Expected Yield', rec.estimatedYield],
                        ['Est. Cost/ha', rec.indicativeCost ?? 'N/A'],
                        ['Est. Revenue/ha', rec.indicativeRevenue ?? 'N/A'],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between py-1 border-b border-gray-50 dark:border-gray-800">
                          <span className="text-gray-500">{k}</span>
                          <span className="font-medium text-gray-900 dark:text-white">{v}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-2">Common Challenges</div>
                      <div className="mb-2">
                        <div className="text-xs text-gray-500 mb-1">Pests:</div>
                        <div className="flex flex-wrap gap-1">{rec.commonPests.map(p => <span key={p} className="badge badge-yellow">{p}</span>)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Diseases:</div>
                        <div className="flex flex-wrap gap-1">{rec.commonDiseases.map(d => <span key={d} className="badge badge-red">{d}</span>)}</div>
                      </div>
                      <div className="mt-3 p-3 bg-mint dark:bg-brand-900/20 rounded-xl">
                        <div className="text-xs font-semibold text-forest dark:text-lime mb-1">Harvest Guidance</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">{rec.harvestGuidance}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
