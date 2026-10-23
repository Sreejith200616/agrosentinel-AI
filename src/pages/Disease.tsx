import { useState, useRef, useCallback } from 'react';
import { Upload, Bug, AlertTriangle, CheckCircle, Info, Leaf, Shield, Clock, Eye, Zap } from 'lucide-react';
import { CROPS_TN, generateId, formatDate, clsx } from '../utils';
import { analyzeDisease } from '../services/ai';
import type { DiseaseDetectionResult } from '../types';

const DEMO_DISEASES: Record<string, DiseaseDetectionResult> = {
  'Paddy': {
    disease: 'Rice Blast (Pyricularia oryzae)',
    confidence: undefined,
    symptoms: 'Diamond-shaped lesions with grey or whitish centers and brown margins on leaves. In severe cases, lesions coalesce causing leaf death.',
    alternativeCauses: ['Brown Spot (Cochliobolus miyabeanus)', 'Bacterial Leaf Blight (Xanthomonas oryzae)', 'Nutrient deficiency (N or Si)'],
    immediateActions: [
      'Remove and destroy severely infected plant material',
      'Avoid excessive nitrogen application which promotes blast',
      'Ensure good drainage and avoid water stress',
      'Consult your local agricultural extension officer before any chemical application',
    ],
    preventionPractices: [
      'Use blast-resistant varieties (ADT 43, CO 51)',
      'Balanced fertilization — avoid excess N',
      'Maintain proper plant spacing for good air circulation',
      'Use clean, certified disease-free seeds',
    ],
    ipmGuidance: '1. Cultural: Resistant variety, balanced nutrition, proper spacing\n2. Biological: Trichoderma-based bio-fungicides (consult label)\n3. Chemical: Only if infection >10% leaf area. Consult agricultural officer for registered fungicide options.',
    safetyPrecautions: 'Always read pesticide labels before use. Wear PPE (gloves, mask, goggles). Follow re-entry interval and pre-harvest interval. Do not apply near water bodies.',
    isDemo: true,
  },
  'Banana': {
    disease: 'Yellow Sigatoka (Mycosphaerella musicola)',
    confidence: undefined,
    symptoms: 'Initially pale yellow streaks parallel to leaf veins. Streaks enlarge to form brown spots with yellow halos. Older leaves more severely affected.',
    alternativeCauses: ['Black Sigatoka (Mycosphaerella fijiensis)', 'Nutrient deficiency (Mg or K)', 'Sunscorch damage'],
    immediateActions: ['Remove and destroy severely affected leaves (do not compost)', 'Improve air circulation by pruning suckers', 'Ensure adequate potassium nutrition'],
    preventionPractices: ['Maintain proper spacing', 'Remove old leaves regularly', 'Balanced K fertilization', 'Use disease-free tissue culture plants'],
    ipmGuidance: '1. Cultural: Leaf surgery (remove infected portions), good drainage\n2. Nutrition: Potassium nutrition improves resistance\n3. Chemical: Consult extension officer for registered fungicides if infection is severe.',
    safetyPrecautions: 'Follow all label directions for any fungicide used. Observe pre-harvest intervals.',
    isDemo: true,
  },
  'Groundnut': {
    disease: 'Early Leaf Spot (Cercospora arachidicola)',
    confidence: undefined,
    symptoms: 'Circular brown spots with yellow halos on upper leaf surface. Spots 1–10mm diameter. Spots appear first on older leaves.',
    alternativeCauses: ['Late Leaf Spot (Cercosporidium personatum)', 'Bacterial wilt', 'Rust (Puccinia arachidis)'],
    immediateActions: ['Monitor disease spread weekly', 'Collect and destroy fallen infected leaves', 'Avoid overhead irrigation'],
    preventionPractices: ['Crop rotation (avoid groundnut after groundnut)', 'Use resistant varieties (TMV 2, VRI 3)', 'Timely fungicide spray if epidemic starts'],
    ipmGuidance: '1. Cultural: Crop rotation, field sanitation, proper spacing\n2. Biological: Trichoderma-based products at sowing\n3. Chemical: Consult extension officer for threshold-based spraying.',
    safetyPrecautions: 'Maintain pre-harvest intervals. Use registered products only.',
    isDemo: true,
  },
  'default': {
    disease: 'Suspected Nitrogen Deficiency',
    confidence: undefined,
    symptoms: 'Yellowing starts from older leaves and progresses upward. Plants appear pale green with stunted growth.',
    alternativeCauses: ['Magnesium deficiency', 'Sulfur deficiency', 'Waterlogging causing N leaching', 'Root damage from nematodes'],
    immediateActions: ['Soil test to confirm nutrient levels', 'Foliar spray of 2% urea solution (200g/10L) as quick fix', 'Check for waterlogging and drainage issues'],
    preventionPractices: ['Regular soil testing', 'Balanced fertilization program', 'Use of biofertilizers (Azospirillum)', 'Organic matter incorporation'],
    ipmGuidance: 'Abiotic stress management:\n1. Confirm diagnosis with soil/tissue test\n2. Address drainage if waterlogged\n3. Apply recommended N fertilizer in 2 splits\n4. Consider green manure for long-term improvement',
    safetyPrecautions: 'Urea foliar spray should not exceed 2% to avoid leaf burn. Spray in early morning or evening.',
    isDemo: true,
  },
};

interface HistoryItem {
  id: string; date: string; crop: string; disease: string; action: string;
}

const DEMO_HISTORY: HistoryItem[] = [
  { id: '1', date: '2026-10-01', crop: 'Paddy', disease: 'Rice Blast (simulated)', action: 'Consulted extension officer. Improved drainage.' },
  { id: '2', date: '2026-09-15', crop: 'Banana', disease: 'Sigatoka (simulated)', action: 'Removed infected leaves. Improved K nutrition.' },
];

export default function DiseasePage() {
  const [selectedCrop, setSelectedCrop] = useState('Paddy');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseDetectionResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(DEMO_HISTORY);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setImageUrl(URL.createObjectURL(file));
    setImageFile(file);
    setImageName(file.name);
    setResult(null);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) handleFile(file);
  }, [handleFile]);

  async function analyze() {
    if (!imageUrl || !imageFile) return;
    setLoading(true);
    try {
      // Convert image to base64 for Gemini Vision
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const aiResult = await analyzeDisease(base64, selectedCrop);
        const mapped: DiseaseDetectionResult = {
          disease: aiResult.diseaseName,
          confidence: aiResult.confidence as any,
          symptoms: aiResult.symptoms,
          alternativeCauses: [],
          immediateActions: aiResult.immediateActions,
          preventionPractices: aiResult.prevention,
          ipmGuidance: aiResult.ipm,
          safetyPrecautions: 'Always read pesticide labels. Wear PPE (gloves, mask, goggles). Follow re-entry intervals. Consult your agricultural extension officer before any chemical application.',
          isDemo: aiResult.isDemo,
        };
        setResult(mapped);
        setLoading(false);
      };
      reader.readAsDataURL(imageFile);
    } catch {
      const r = DEMO_DISEASES[selectedCrop] ?? DEMO_DISEASES['default'];
      setResult(r);
      setLoading(false);
    }
  }

  function saveHistory() {
    if (!result) return;
    const item: HistoryItem = {
      id: generateId(),
      date: new Date().toISOString().slice(0, 10),
      crop: selectedCrop,
      disease: result.disease + ' (simulated)',
      action: 'Saved for review',
    };
    setHistory(prev => [item, ...prev]);
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div>
        <h1 className="section-title">Pest & Disease Detection</h1>
        <p className="section-subtitle">Upload a crop photo for AI-assisted diagnosis</p>
      </div>

      {/* Status banner - live vs demo */}
      <div className={clsx('flex items-start gap-3 px-4 py-3 rounded-xl border text-sm',
        import.meta.env.VITE_GEMINI_API_KEY
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
          : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800')}>
        {import.meta.env.VITE_GEMINI_API_KEY
          ? <><Zap className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" /><div><strong className="text-green-800 dark:text-green-200">🤖 LIVE AI MODE — Gemini Vision Active</strong><span className="text-green-700 dark:text-green-300"> — Upload a real crop photo and click Analyse for genuine AI disease detection. Always verify with an agricultural expert before treatment.</span></div></>
          : <><AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" /><div><strong className="text-orange-800 dark:text-orange-200">DEMONSTRATION MODE</strong><span className="text-orange-700 dark:text-orange-300"> — No API key configured. Results are simulated based on selected crop. Add VITE_GEMINI_API_KEY to .env to enable real AI detection.</span></div></>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload area */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">1. Upload Crop Photo</h2>
          
          <div>
            <label className="label">Select Crop Species</label>
            <select className="input" value={selectedCrop} onChange={e => setSelectedCrop(e.target.value)}>
              {CROPS_TN.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={clsx(
              'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all',
              dragging ? 'border-forest bg-mint dark:bg-brand-900/30' : 'border-gray-300 dark:border-gray-600 hover:border-forest dark:hover:border-lime hover:bg-gray-50 dark:hover:bg-gray-800/50'
            )}
          >
            <input ref={inputRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            
            {imageUrl ? (
              <div className="space-y-2">
                <img src={imageUrl} alt="Uploaded crop" className="max-h-40 mx-auto rounded-xl object-cover" />
                <p className="text-sm text-gray-600 dark:text-gray-300">{imageName}</p>
                <p className="text-xs text-gray-400">Click to change image</p>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-10 h-10 text-gray-400 mx-auto" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Drag & drop or click to upload</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — clear photo of affected leaf/plant</p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={analyze}
            disabled={!imageUrl || loading}
            className={clsx('btn-primary w-full justify-center', (!imageUrl || loading) && 'opacity-50 cursor-not-allowed')}
          >
            {loading ? (
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 animate-spin" /> Analyzing...</span>
            ) : (
              <><Bug className="w-4 h-4" /> Analyze Image</>
            )}
          </button>

          {loading && (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-4 rounded w-full" />)}
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="card space-y-4 animate-slide-up">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white">{result.disease}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="badge badge-yellow text-xs">Simulated Result</span>
                  <span className="badge badge-blue text-xs">{selectedCrop}</span>
                </div>
              </div>
              <button onClick={saveHistory} className="btn-ghost text-xs py-1.5">Save ✓</button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Symptoms Observed</div>
                <p className="text-sm text-gray-700 dark:text-gray-200">{result.symptoms}</p>
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Alternative Causes</div>
                <div className="flex flex-wrap gap-1">
                  {result.alternativeCauses.map(c => <span key={c} className="badge badge-yellow text-xs">{c}</span>)}
                </div>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Immediate Actions
                </div>
                <ul className="space-y-1">
                  {result.immediateActions.map((a, i) => (
                    <li key={i} className="text-xs text-blue-700 dark:text-blue-300 flex items-start gap-1.5">
                      <span className="flex-shrink-0 mt-0.5">•</span>{a}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1 flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5" /> IPM Guidance
                </div>
                <p className="text-xs text-green-700 dark:text-green-300 whitespace-pre-line">{result.ipmGuidance}</p>
              </div>

              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" /> Safety Precautions
                </div>
                <p className="text-xs text-red-700 dark:text-red-300">{result.safetyPrecautions}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* History */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Detection History (Demo)</h3>
        {history.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">No detection history yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  {['Date','Crop','Detected Issue','Action Taken'].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map(h => (
                  <tr key={h.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="py-2.5 px-3 text-gray-600 dark:text-gray-300">{formatDate(h.date)}</td>
                    <td className="py-2.5 px-3 font-medium text-gray-900 dark:text-white">{h.crop}</td>
                    <td className="py-2.5 px-3 text-gray-700 dark:text-gray-200">{h.disease}</td>
                    <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">{h.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
