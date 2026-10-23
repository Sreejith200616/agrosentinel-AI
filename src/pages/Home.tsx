import { Link } from 'react-router-dom';
import TeamSection from '../components/TeamSection';
import {
  Cloud, Sprout, FlaskConical, TrendingUp, Bug, Network, MessageCircle,
  Droplets, Leaf, BarChart2, ChevronRight, Star, ArrowRight, CheckCircle,
  Map, Zap, Globe, Users
} from 'lucide-react';

const FEATURES = [
  { icon: Cloud, title: 'Weather Intelligence', desc: 'Real-time forecasts from Open-Meteo API with agricultural activity windows.', to: '/weather', color: 'from-blue-500 to-cyan-400' },
  { icon: Sprout, title: 'AI Crop Advisor', desc: 'Data-driven crop recommendations based on your soil, season, and location.', to: '/crop-advisor', color: 'from-green-600 to-emerald-400' },
  { icon: FlaskConical, title: 'Soil Health Monitor', desc: 'Track NPK, pH, and organic carbon to maintain optimal soil nutrition.', to: '/soil-health', color: 'from-amber-600 to-yellow-400' },
  { icon: TrendingUp, title: 'Market Intelligence', desc: 'Monitor agricultural commodity prices and identify selling opportunities.', to: '/market', color: 'from-purple-600 to-violet-400' },
  { icon: Bug, title: 'Disease Detection', desc: 'Upload crop photos for simulated disease identification with IPM guidance.', to: '/disease', color: 'from-red-500 to-orange-400' },
  { icon: Network, title: 'Integrated Farming', desc: '11 enterprise modules for crops, dairy, poultry, fish, biogas and more.', to: '/ifs', color: 'from-teal-600 to-green-400' },
];

const STATS = [
  { value: '500+', label: 'Crops in Database', icon: Leaf, note: 'Illustrative' },
  { value: '17', label: 'Feature Modules', icon: BarChart2, note: 'Across all sections' },
  { value: '6', label: 'Languages', icon: Globe, note: 'Including Tamil' },
  { value: 'Live', label: 'Weather Data', icon: Cloud, note: 'Open-Meteo API' },
];

const STEPS = [
  { num: '01', title: 'Set Up Your Farm', desc: 'Enter your farm location, soil type, and current crops to personalise the platform.' },
  { num: '02', title: 'Get Intelligence', desc: 'Receive AI-powered crop advice, weather alerts, and market price insights in real time.' },
  { num: '03', title: 'Manage & Grow', desc: 'Track soil health, fertilizer plans, IFS enterprises, and financials in one dashboard.' },
  { num: '04', title: 'Make Better Decisions', desc: 'Ask AgroBot, analyse disease photos, and optimise your irrigation and precision farming.' },
];

const IFS_ICONS = [
  { icon: Leaf, label: 'Crops', color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
  { icon: Star, label: 'Dairy', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' },
  { icon: Zap, label: 'Poultry', color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30' },
  { icon: Droplets, label: 'Fish', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
  { icon: Network, label: 'Compost', color: 'text-amber-700 bg-amber-100 dark:bg-amber-900/30' },
  { icon: Zap, label: 'Biogas', color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30' },
  { icon: Globe, label: 'Agroforestry', color: 'text-teal-600 bg-teal-100 dark:bg-teal-900/30' },
  { icon: Star, label: 'Goat/Sheep', color: 'text-gray-600 bg-gray-100 dark:bg-gray-800' },
  { icon: Users, label: 'Beekeeping', color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30' },
  { icon: Leaf, label: 'Mushroom', color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' },
  { icon: Star, label: 'Duckery', color: 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30' },
];

const FAQS = [
  { q: 'Is the weather data real or simulated?', a: 'Weather data is fetched live from Open-Meteo (open-meteo.com), a free and open-source weather API. If the live fetch fails, clearly-labelled demo data is shown as a fallback.' },
  { q: 'Does the disease detection actually use AI?', a: 'In this demo, the disease detection is simulated based on the crop species selected — it does not analyze the uploaded image with a real model. Results are illustrative. Always consult a qualified plant pathologist.' },
  { q: 'Are the market prices real?', a: 'No. Market prices shown are illustrative demo data only. For real prices, visit agmarknet.gov.in — the official Government of India agricultural market data portal.' },
  { q: 'What is the AgroBot chatbot powered by?', a: 'AgroBot uses Google Gemini 1.5 Flash AI when a valid API key is configured in the environment. Without a key, it operates in demo mode with pre-written agricultural knowledge responses.' },
  { q: 'Can I trust the fertilizer and crop recommendations for my field?', a: 'Recommendations are based on standard TNAU (Tamil Nadu Agricultural University) guidelines and general agronomic principles. They are starting points for discussion — always verify with your local agricultural extension officer or Krishi Vigyan Kendra before application.' },
];

export default function HomePage() {
  return (
    <div className="space-y-0 -m-6 animate-fade-in">
      {/* Hero */}
      <section className="relative min-h-[520px] flex items-center bg-gradient-to-br from-forest via-emerald to-brand-700 overflow-hidden px-6 py-16">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-lime/5 rounded-full -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-lime text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-lime rounded-full animate-pulse" />
            Smart Agriculture Intelligence Platform
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">
            Your Farm. Your Data.<br />
            <span className="text-lime">Smarter Decisions.</span>
          </h1>

          <p className="text-white/75 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            AgroSentinel AI brings weather intelligence, AI crop advisory, soil health, market prices, 
            disease detection, and integrated farm management to every farmer.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/dashboard" className="flex items-center gap-2 bg-white text-forest font-bold px-8 py-3.5 rounded-xl hover:bg-lime hover:text-forest transition-all shadow-xl hover:shadow-2xl hover:scale-105">
              <BarChart2 className="w-5 h-5" /> View Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/chatbot" className="flex items-center gap-2 bg-white/10 backdrop-blur text-white border border-white/30 font-bold px-8 py-3.5 rounded-xl hover:bg-white/20 transition-all hover:scale-105">
              <MessageCircle className="w-5 h-5" /> Ask AgroBot
            </Link>
          </div>

          {/* Quick nav pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-10">
            {[
              { label: '🌦 Weather', to: '/weather' },
              { label: '🌱 Crop Advisor', to: '/crop-advisor' },
              { label: '🧪 Soil Health', to: '/soil-health' },
              { label: '💰 Market', to: '/market' },
              { label: '🐛 Disease', to: '/disease' },
              { label: '🔗 IFS', to: '/ifs' },
            ].map(p => (
              <Link key={p.label} to={p.to}
                className="px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 text-sm rounded-full transition-all hover:scale-105">
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mb-6">Illustrative figures for demonstration purposes</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <div className="w-12 h-12 bg-mint dark:bg-brand-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <s.icon className="w-6 h-6 text-forest dark:text-lime" />
                </div>
                <div className="text-3xl font-black text-forest dark:text-lime">{s.value}</div>
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-1">{s.label}</div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 dark:bg-gray-800/30 px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Everything Your Farm Needs</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">Six powerful intelligence modules — all in one platform.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <Link key={f.title} to={f.to}
                className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 border border-gray-100 dark:border-gray-800">
                <div className={`h-2 bg-gradient-to-r ${f.color}`} />
                <div className="p-5">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${f.color}`}>
                    <f.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                  <div className="flex items-center gap-1 mt-4 text-xs font-medium text-forest dark:text-lime group-hover:gap-2 transition-all">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white dark:bg-gray-900 px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">How It Works</h2>
            <p className="text-gray-500 dark:text-gray-400">Simple steps to smarter farming decisions</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-brand-200 to-brand-100 dark:from-brand-800 dark:to-brand-900 z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-forest to-emerald text-white rounded-2xl flex items-center justify-center text-2xl font-black mb-4 shadow-lg">
                    {step.num}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IFS showcase */}
      <section className="bg-gradient-to-br from-forest/5 to-brand-50 dark:from-brand-900/20 dark:to-gray-900 px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Integrated Farming System</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto">
            Manage 11 farm enterprises together — from crops and dairy to biogas and agroforestry — for maximum sustainability and income.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {IFS_ICONS.map(e => (
              <div key={e.label} className="flex flex-col items-center gap-2 w-16">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${e.color}`}>
                  <e.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{e.label}</span>
              </div>
            ))}
          </div>
          <Link to="/ifs" className="btn-primary inline-flex">
            Explore IFS Modules <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Sample Stories */}
      <section className="bg-white dark:bg-gray-900 px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium rounded-full mb-3">Sample Stories · Illustrative Content</div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">How Farmers Could Benefit</h2>
            <p className="text-gray-400 text-sm">These are illustrative examples — not real testimonials.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { name: 'Ramu (Illustrative)', location: 'Thanjavur, Tamil Nadu', crop: 'Paddy Farmer · 5 acres', story: 'Using the AI Crop Advisor, identified that switching to a disease-resistant paddy variety suited to his soil pH would improve yields. The fertilizer calculator helped plan split-dose applications.', avatar: 'R' },
              { name: 'Selvi (Illustrative)', location: 'Coimbatore, Tamil Nadu', crop: 'Banana Farmer · 3 acres', story: 'Weather Intelligence helped Selvi avoid spraying during high-wind days, reducing pesticide waste by an estimated 20%. Market price alerts helped time harvests better.', avatar: 'S' },
              { name: 'Kannan (Illustrative)', location: 'Madurai, Tamil Nadu', crop: 'IFS Farmer · 8 acres', story: 'By linking dairy manure composting with crop nutrition and biogas for household energy, an IFS approach could reduce input costs and diversify income across seasons.', avatar: 'K' },
            ].map(s => (
              <div key={s.name} className="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-forest text-white rounded-full flex items-center justify-center font-bold">{s.avatar}</div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{s.name}</div>
                    <div className="text-xs text-gray-400">{s.location}</div>
                    <div className="text-xs text-forest dark:text-lime">{s.crop}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">"{s.story}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 dark:bg-gray-800/30 px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details key={i} className="group bg-white dark:bg-gray-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">{faq.q}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0 ml-3" />
                </summary>
                <div className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-forest to-emerald px-6 py-14">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">Ready to Farm Smarter?</h2>
          <p className="text-white/70 mb-8">Explore the full platform with realistic demo data — no registration required.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/dashboard" className="flex items-center gap-2 bg-white text-forest font-bold px-8 py-3.5 rounded-xl hover:bg-lime transition-all shadow-xl hover:scale-105">
              <BarChart2 className="w-5 h-5" /> Open Dashboard
            </Link>
            <Link to="/chatbot" className="flex items-center gap-2 bg-white/10 border border-white/30 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/20 transition-all">
              <MessageCircle className="w-5 h-5" /> Chat with AgroBot
            </Link>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <TeamSection />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <img src="/favicon.jpg" alt="AgroSentinel AI" className="w-7 h-7 rounded-lg object-cover" />
                <span className="font-bold text-white text-sm">AgroSentinel AI</span>
              </div>
              <p className="text-xs leading-relaxed">Smart Farming. Better Decisions. Sustainable Future.</p>
            </div>
            <div>
              <div className="text-white font-semibold text-sm mb-3">Platform</div>
              {[['Dashboard','/dashboard'],['Weather','/weather'],['Crop Advisor','/crop-advisor'],['Market','/market']].map(([l,t]) =>
                <Link key={l} to={t} className="block text-xs hover:text-white transition-colors mb-1.5">{l}</Link>)}
            </div>
            <div>
              <div className="text-white font-semibold text-sm mb-3">IFS Modules</div>
              {[['Dairy','/ifs/dairy'],['Poultry','/ifs/poultry'],['Fish Farming','/ifs/fish'],['Biogas','/ifs/biogas']].map(([l,t]) =>
                <Link key={l} to={t} className="block text-xs hover:text-white transition-colors mb-1.5">{l}</Link>)}
            </div>
            <div>
              <div className="text-white font-semibold text-sm mb-3">Resources</div>
              {[['Knowledge Base','/knowledge'],['AgroBot','/chatbot'],['Settings','/settings']].map(([l,t]) =>
                <Link key={l} to={t} className="block text-xs hover:text-white transition-colors mb-1.5">{l}</Link>)}
              <a href="https://agmarknet.gov.in" target="_blank" rel="noopener noreferrer" className="block text-xs hover:text-white transition-colors mb-1.5">AgMarkNet ↗</a>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs">© 2026 AgroSentinel AI · Demo platform for educational purposes.</p>
            <p className="text-xs">Weather: Open-Meteo · Market: Demo data · AI: Google Gemini</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
