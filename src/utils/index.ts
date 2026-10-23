// Weather code to description/icon name mapping
export const WMO_CODES: Record<number, { label: string; icon: string; emoji: string }> = {
  0:  { label: 'Clear Sky',          icon: 'sun',             emoji: '☀️' },
  1:  { label: 'Mainly Clear',       icon: 'sun',             emoji: '🌤️' },
  2:  { label: 'Partly Cloudy',      icon: 'cloud-sun',       emoji: '⛅' },
  3:  { label: 'Overcast',           icon: 'cloud',           emoji: '☁️' },
  45: { label: 'Foggy',              icon: 'cloud-fog',       emoji: '🌫️' },
  48: { label: 'Icy Fog',            icon: 'cloud-fog',       emoji: '🌫️' },
  51: { label: 'Light Drizzle',      icon: 'cloud-drizzle',   emoji: '🌦️' },
  53: { label: 'Moderate Drizzle',   icon: 'cloud-drizzle',   emoji: '🌦️' },
  55: { label: 'Heavy Drizzle',      icon: 'cloud-drizzle',   emoji: '🌧️' },
  61: { label: 'Light Rain',         icon: 'cloud-rain',      emoji: '🌧️' },
  63: { label: 'Moderate Rain',      icon: 'cloud-rain',      emoji: '🌧️' },
  65: { label: 'Heavy Rain',         icon: 'cloud-rain',      emoji: '⛈️' },
  71: { label: 'Light Snow',         icon: 'cloud-snow',      emoji: '🌨️' },
  73: { label: 'Moderate Snow',      icon: 'cloud-snow',      emoji: '❄️' },
  75: { label: 'Heavy Snow',         icon: 'cloud-snow',      emoji: '❄️' },
  77: { label: 'Snow Grains',        icon: 'cloud-snow',      emoji: '🌨️' },
  80: { label: 'Light Showers',      icon: 'cloud-rain',      emoji: '🌦️' },
  81: { label: 'Moderate Showers',   icon: 'cloud-rain',      emoji: '🌧️' },
  82: { label: 'Violent Showers',    icon: 'cloud-lightning', emoji: '⛈️' },
  85: { label: 'Slight Snow Shower', icon: 'cloud-snow',      emoji: '🌨️' },
  86: { label: 'Heavy Snow Shower',  icon: 'cloud-snow',      emoji: '❄️' },
  95: { label: 'Thunderstorm',       icon: 'cloud-lightning', emoji: '⛈️' },
  96: { label: 'Thunderstorm + Hail',icon: 'cloud-lightning', emoji: '⛈️' },
  99: { label: 'Severe Thunderstorm',icon: 'cloud-lightning', emoji: '⛈️' },
};

export function getWeatherInfo(code: number) {
  return WMO_CODES[code] ?? { label: 'Unknown', icon: 'cloud', emoji: '🌥️' };
}

export function windDirection(deg: number): string {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

export function formatTemp(c: number): string {
  return `${Math.round(c)}°C`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export function formatNumber(n: number, decimals = 0): string {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: decimals }).format(n);
}

export function clsx(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getUVIndex(uv: number): { label: string; color: string } {
  if (uv <= 2) return { label: 'Low', color: 'text-green-600' };
  if (uv <= 5) return { label: 'Moderate', color: 'text-yellow-600' };
  if (uv <= 7) return { label: 'High', color: 'text-orange-600' };
  if (uv <= 10) return { label: 'Very High', color: 'text-red-600' };
  return { label: 'Extreme', color: 'text-purple-600' };
}

export function getAirQuality(humidity: number): string {
  if (humidity < 30) return 'Low Humidity – Crop stress risk';
  if (humidity > 85) return 'High Humidity – Disease risk';
  return 'Optimal humidity range';
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export const INDIAN_STATES = [
  'Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal',
];

export const TN_DISTRICTS = [
  'Ariyalur','Chengalpattu','Chennai','Coimbatore','Cuddalore','Dharmapuri',
  'Dindigul','Erode','Kallakurichi','Kancheepuram','Kanyakumari','Karur',
  'Krishnagiri','Madurai','Mayiladuthurai','Nagapattinam','Namakkal',
  'Nilgiris','Perambalur','Pudukkottai','Ramanathapuram','Ranipet',
  'Salem','Sivaganga','Tenkasi','Thanjavur','Theni','Thoothukudi',
  'Tiruchirappalli','Tirunelveli','Tirupattur','Tiruppur','Tiruvallur',
  'Tiruvannamalai','Tiruvarur','Vellore','Viluppuram','Virudhunagar',
];

export const SOIL_TYPES = [
  'Red Sandy Loam','Black Cotton','Alluvial','Laterite','Sandy','Loamy','Clay','Sandy Loam',
];

export const CROPS_TN = [
  'Paddy','Maize','Groundnut','Cotton','Sugarcane','Banana','Coconut',
  'Tomato','Onion','Brinjal','Bhendi','Chilli','Turmeric','Ginger',
  'Blackgram','Greengram','Cowpea','Sesame','Sunflower','Soybean',
  'Mango','Guava','Pomegranate','Moringa','Tapioca','Sweet Potato',
];

export const FERTILIZER_PRODUCTS = [
  { name: 'Urea', n: 46, p: 0,  k: 0,  pricePerKg: 6.5,  type: 'chemical' as const },
  { name: 'DAP',  n: 18, p: 46, k: 0,  pricePerKg: 27,   type: 'chemical' as const },
  { name: 'MOP',  n: 0,  p: 0,  k: 60, pricePerKg: 17,   type: 'chemical' as const },
  { name: '17:17:17', n: 17, p: 17, k: 17, pricePerKg: 22, type: 'chemical' as const },
  { name: '14:35:14', n: 14, p: 35, k: 14, pricePerKg: 25, type: 'chemical' as const },
  { name: 'SSP',  n: 0,  p: 16, k: 0,  pricePerKg: 7.5,  type: 'chemical' as const },
  { name: 'Ammonium Sulphate', n: 21, p: 0, k: 0, pricePerKg: 11, type: 'chemical' as const },
  { name: 'FYM (Farmyard Manure)', n: 0.5, p: 0.25, k: 0.5, pricePerKg: 0.5, type: 'organic' as const },
  { name: 'Vermicompost', n: 1.5, p: 0.75, k: 1.5, pricePerKg: 3, type: 'organic' as const },
  { name: 'Rhizobium', n: 0, p: 0, k: 0, pricePerKg: 45, type: 'biofertilizer' as const },
  { name: 'PSB (Phosphate Solubilizing Bacteria)', n: 0, p: 0, k: 0, pricePerKg: 50, type: 'biofertilizer' as const },
];
