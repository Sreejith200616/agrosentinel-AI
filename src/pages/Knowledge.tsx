import { BookOpen, Search, ChevronRight, ExternalLink, Leaf, Droplets, FlaskConical, Bug, TrendingUp, Globe } from 'lucide-react';
import { useState } from 'react';
import { clsx } from '../utils';

const ARTICLES = [
  { id: '1', category: 'Soil Health', icon: FlaskConical, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', title: 'Understanding Soil pH and Crop Suitability', summary: 'Soil pH affects nutrient availability. Most crops prefer 6.0–7.5. Learn how to adjust soil pH using lime (to raise) or sulfur (to lower).', readTime: '4 min', tags: ['Soil', 'pH', 'Nutrients'] },
  { id: '2', category: 'Crop Advisory', icon: Leaf, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', title: 'TNAU Paddy Cultivation Guide', summary: 'Standard paddy cultivation practices from TNAU — variety selection, nursery management, transplanting, fertilization, and harvest.', readTime: '8 min', tags: ['Paddy', 'TNAU', 'Kharif'] },
  { id: '3', category: 'Pest Management', icon: Bug, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', title: 'IPM Guide: Brown Plant Hopper in Paddy', summary: 'Integrated Pest Management for BPH — economic threshold levels, resistant varieties, biological control using Cyrtorhinus, and safe chemical options as last resort.', readTime: '6 min', tags: ['IPM', 'BPH', 'Paddy'] },
  { id: '4', category: 'Irrigation', icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', title: 'Drip Irrigation for Banana: Water & Cost Savings', summary: 'How drip irrigation reduces water usage by up to 50% for banana cultivation. Scheduling, emitter placement, and fertigation integration.', readTime: '5 min', tags: ['Drip', 'Banana', 'Water'] },
  { id: '5', category: 'Market', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', title: 'How to Use AgMarkNet for Price Discovery', summary: 'Step-by-step guide to using the official government AgMarkNet portal for real agricultural commodity price data across APMCs.', readTime: '3 min', tags: ['Market', 'Price', 'APMC'] },
  { id: '6', category: 'IFS', icon: Globe, color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-900/20', title: 'Integrated Farming System: ICAR Guidelines', summary: 'Introduction to IFS — linking crops, livestock, and horticulture for year-round income stability, resource recycling, and ecological sustainability.', readTime: '7 min', tags: ['IFS', 'ICAR', 'Sustainability'] },
  { id: '7', category: 'Soil Health', icon: FlaskConical, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', title: 'Vermicompost vs FYM: Which is Better?', summary: 'Comparison of vermicompost and farm yard manure (FYM) for nutrient content, application rates, cost-benefit analysis, and crop response.', readTime: '5 min', tags: ['Organic', 'Compost', 'FYM'] },
  { id: '8', category: 'Crop Advisory', icon: Leaf, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', title: 'Groundnut Cultivation in Tamil Nadu', summary: 'Comprehensive guide: variety selection (VRI 3, TMV 2), sowing time, seed treatment, spacing, fertilizer schedule, and pod borer management.', readTime: '6 min', tags: ['Groundnut', 'Tamil Nadu', 'Rabi'] },
];

const EXTERNAL_LINKS = [
  { name: 'TNAU Agritech Portal', url: 'https://agritech.tnau.ac.in', desc: 'Crop guides, pest identification, farming techniques' },
  { name: 'AgMarkNet — Market Prices', url: 'https://agmarknet.gov.in', desc: 'Official government agricultural market price data' },
  { name: 'IMD Agromet', url: 'https://agromet.imd.gov.in', desc: 'India Meteorological Department agro-advisory' },
  { name: 'ICAR Research Journals', url: 'https://epubs.icar.org.in', desc: 'Scientific agriculture research publications' },
  { name: 'KVK Locator', url: 'https://kvk.icar.gov.in', desc: 'Find your nearest Krishi Vigyan Kendra' },
  { name: 'PM Kisan Portal', url: 'https://pmkisan.gov.in', desc: 'PM-KISAN farmer support scheme information' },
];

export default function KnowledgePage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(ARTICLES.map(a => a.category)))];
  
  const filtered = ARTICLES.filter(a => {
    const matchCat = activeCategory === 'All' || a.category === activeCategory;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title">Knowledge Base</h1>
        <p className="section-subtitle">Agricultural guides, best practices, and external resources</p>
      </div>

      {/* Search */}
      <div className="relative max-w-xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search articles, topics, crops..."
          className="input pl-10 w-full"
        />
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={clsx('px-4 py-2 rounded-xl text-sm font-medium transition-all',
              activeCategory === cat ? 'bg-forest text-white shadow' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700')}>
            {cat}
          </button>
        ))}
      </div>

      {/* Articles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map(a => (
          <div key={a.id} className={clsx('card cursor-pointer hover:shadow-card-hover transition-all', expandedId === a.id && 'ring-2 ring-forest/30 dark:ring-lime/30')}
            onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}>
            <div className="flex items-start gap-3">
              <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', a.bg)}>
                <a.icon className={clsx('w-5 h-5', a.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-gray-400">{a.category}</span>
                  <span className="text-xs text-gray-300">·</span>
                  <span className="text-xs text-gray-400">{a.readTime} read</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mt-0.5 leading-snug">{a.title}</h3>
                {expandedId === a.id ? (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">{a.summary}</p>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{a.summary}</p>
                )}
                <div className="flex items-center gap-1 mt-2 flex-wrap">
                  {a.tags.map(t => <span key={t} className="badge badge-blue text-xs">{t}</span>)}
                </div>
              </div>
              <ChevronRight className={clsx('w-4 h-4 text-gray-400 flex-shrink-0 mt-1 transition-transform', expandedId === a.id && 'rotate-90')} />
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No articles found for "{search}"</p>
        </div>
      )}

      {/* External Resources */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-forest dark:text-lime" /> Official Agricultural Resources
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {EXTERNAL_LINKS.map(l => (
            <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer"
              className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
              <ExternalLink className="w-4 h-4 text-forest dark:text-lime flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white text-sm group-hover:text-forest dark:group-hover:text-lime transition-colors">{l.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{l.desc}</div>
              </div>
            </a>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">External links open in a new tab. AgroSentinel AI is not affiliated with these external resources.</p>
      </div>
    </div>
  );
}
