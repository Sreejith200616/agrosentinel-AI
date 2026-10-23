// Market price demo data and service
import type { MarketPrice } from '../types';

// Demo market prices (Tamil Nadu, clearly labeled as demo)
export const DEMO_MARKET_PRICES: MarketPrice[] = [
  { commodity: 'Paddy (Common)', state: 'Tamil Nadu', district: 'Thanjavur', market: 'Thanjavur APMC', minPrice: 1980, modalPrice: 2150, maxPrice: 2280, unit: 'Quintal', date: new Date(Date.now() - 86400000).toISOString().slice(0,10), source: 'Demo Data', isDemo: true },
  { commodity: 'Paddy (Fine)', state: 'Tamil Nadu', district: 'Thanjavur', market: 'Thanjavur APMC', minPrice: 2200, modalPrice: 2420, maxPrice: 2580, unit: 'Quintal', date: new Date(Date.now() - 86400000).toISOString().slice(0,10), source: 'Demo Data', isDemo: true },
  { commodity: 'Banana (Ney Poovan)', state: 'Tamil Nadu', district: 'Thanjavur', market: 'Trichy APMC', minPrice: 1200, modalPrice: 1450, maxPrice: 1800, unit: 'Quintal', date: new Date(Date.now() - 86400000).toISOString().slice(0,10), source: 'Demo Data', isDemo: true },
  { commodity: 'Banana (Robusta)', state: 'Tamil Nadu', district: 'Coimbatore', market: 'Coimbatore APMC', minPrice: 1000, modalPrice: 1200, maxPrice: 1500, unit: 'Quintal', date: new Date(Date.now() - 86400000).toISOString().slice(0,10), source: 'Demo Data', isDemo: true },
  { commodity: 'Groundnut (Shell)', state: 'Tamil Nadu', district: 'Villupuram', market: 'Villupuram APMC', minPrice: 4800, modalPrice: 5200, maxPrice: 5600, unit: 'Quintal', date: new Date(Date.now() - 86400000).toISOString().slice(0,10), source: 'Demo Data', isDemo: true },
  { commodity: 'Tomato', state: 'Tamil Nadu', district: 'Dindigul', market: 'Dindigul APMC', minPrice: 800, modalPrice: 1200, maxPrice: 1800, unit: 'Quintal', date: new Date(Date.now() - 86400000).toISOString().slice(0,10), source: 'Demo Data', isDemo: true },
  { commodity: 'Onion', state: 'Tamil Nadu', district: 'Salem', market: 'Salem APMC', minPrice: 600, modalPrice: 900, maxPrice: 1300, unit: 'Quintal', date: new Date(Date.now() - 86400000).toISOString().slice(0,10), source: 'Demo Data', isDemo: true },
  { commodity: 'Coconut', state: 'Tamil Nadu', district: 'Coimbatore', market: 'Pollachi APMC', minPrice: 1200, modalPrice: 1450, maxPrice: 1700, unit: '100 Nuts', date: new Date(Date.now() - 86400000).toISOString().slice(0,10), source: 'Demo Data', isDemo: true },
  { commodity: 'Sugarcane', state: 'Tamil Nadu', district: 'Trichy', market: 'Trichy Mill', minPrice: 2750, modalPrice: 3050, maxPrice: 3200, unit: 'Tonne', date: new Date(Date.now() - 86400000).toISOString().slice(0,10), source: 'Demo Data', isDemo: true },
  { commodity: 'Cotton', state: 'Tamil Nadu', district: 'Coimbatore', market: 'Coimbatore APMC', minPrice: 5800, modalPrice: 6400, maxPrice: 7000, unit: 'Quintal', date: new Date(Date.now() - 86400000).toISOString().slice(0,10), source: 'Demo Data', isDemo: true },
  { commodity: 'Chilli (Dry)', state: 'Tamil Nadu', district: 'Ramanathapuram', market: 'Ramanathapuram APMC', minPrice: 9000, modalPrice: 11000, maxPrice: 13500, unit: 'Quintal', date: new Date(Date.now() - 86400000).toISOString().slice(0,10), source: 'Demo Data', isDemo: true },
  { commodity: 'Turmeric', state: 'Tamil Nadu', district: 'Erode', market: 'Erode APMC', minPrice: 7000, modalPrice: 8500, maxPrice: 10000, unit: 'Quintal', date: new Date(Date.now() - 86400000).toISOString().slice(0,10), source: 'Demo Data', isDemo: true },
  { commodity: 'Maize', state: 'Tamil Nadu', district: 'Dharmapuri', market: 'Dharmapuri APMC', minPrice: 1450, modalPrice: 1650, maxPrice: 1800, unit: 'Quintal', date: new Date(Date.now() - 86400000).toISOString().slice(0,10), source: 'Demo Data', isDemo: true },
  { commodity: 'Blackgram', state: 'Tamil Nadu', district: 'Vellore', market: 'Vellore APMC', minPrice: 5500, modalPrice: 6200, maxPrice: 7000, unit: 'Quintal', date: new Date(Date.now() - 86400000).toISOString().slice(0,10), source: 'Demo Data', isDemo: true },
  { commodity: 'Greengram', state: 'Tamil Nadu', district: 'Madurai', market: 'Madurai APMC', minPrice: 6000, modalPrice: 7000, maxPrice: 8000, unit: 'Quintal', date: new Date(Date.now() - 86400000).toISOString().slice(0,10), source: 'Demo Data', isDemo: true },
];

// Generate 30-day price history for a commodity
export function generatePriceHistory(modalPrice: number, days = 30): { date: string; price: number }[] {
  const history = [];
  let price = modalPrice;
  for (let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    price = price + (Math.random() - 0.48) * (modalPrice * 0.04);
    price = Math.max(modalPrice * 0.7, Math.min(modalPrice * 1.3, price));
    history.push({ date: d.toISOString().slice(0, 10), price: Math.round(price) });
  }
  return history;
}

export function searchMarketPrices(query: string, state?: string): MarketPrice[] {
  const q = query.toLowerCase();
  return DEMO_MARKET_PRICES.filter(p =>
    (!q || p.commodity.toLowerCase().includes(q)) &&
    (!state || p.state === state)
  );
}
