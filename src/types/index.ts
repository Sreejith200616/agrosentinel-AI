// Core TypeScript types for AgroSentinel AI

export interface Farm {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  area: number; // in acres
  areaUnit: 'acres' | 'hectares';
  crops: string[];
  soilType: string;
  irrigationType: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  state: string;
  district: string;
  language: string;
  farms: Farm[];
  activeFarmId?: string;
  avatar?: string;
  createdAt: string;
}

export interface WeatherCurrent {
  temperature: number;
  humidity: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  precipitation: number;
  uvindex: number;
  apparent_temperature: number;
  is_day: number;
  time: string;
}

export interface WeatherHourly {
  time: string[];
  temperature_2m: number[];
  precipitation_probability: number[];
  precipitation: number[];
  weathercode: number[];
  windspeed_10m: number[];
  relativehumidity_2m: number[];
}

export interface WeatherDaily {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  weathercode: number[];
  windspeed_10m_max: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
}

export interface WeatherData {
  current: WeatherCurrent;
  hourly: WeatherHourly;
  daily: WeatherDaily;
  lat: number;
  lng: number;
  timezone: string;
  fetchedAt: string;
}

export interface CropRecommendation {
  id: string;
  cropName: string;
  localName?: string;
  suitabilityScore: number;
  suitabilityBasis: string;
  duration: string;
  season: string;
  sowingWindow: string;
  seedRate: string;
  spacing: string;
  waterRequirement: string;
  soilSuitability: string;
  climateSuitability: string;
  estimatedYield: string;
  commonPests: string[];
  commonDiseases: string[];
  harvestGuidance: string;
  marketDemand: string;
  indicativeCost?: string;
  indicativeRevenue?: string;
}

export interface SoilReading {
  id: string;
  farmId: string;
  date: string;
  ph: number;
  nitrogen: number; // kg/ha
  phosphorus: number;
  potassium: number;
  organicCarbon: number; // %
  ec: number; // dS/m
  moisture: number; // %
  texture: string;
  notes?: string;
  source: 'lab' | 'sensor' | 'manual';
}

export interface FertilizerPlan {
  cropName: string;
  area: number;
  growthStage: string;
  npkRequired: { n: number; p: number; k: number };
  fertilizers: FertilizerItem[];
  schedule: ApplicationSchedule[];
  totalCost: number;
  warnings: string[];
}

export interface FertilizerItem {
  name: string;
  quantity: number; // kg
  nutrientPercent: { n: number; p: number; k: number };
  cost: number;
  type: 'chemical' | 'organic' | 'biofertilizer';
}

export interface ApplicationSchedule {
  timing: string;
  daysAfterSowing: number;
  fertilizers: string[];
  method: string;
  notes: string;
}

export interface DiseaseDetectionResult {
  disease: string;
  confidence?: number;
  symptoms: string;
  alternativeCauses: string[];
  immediateActions: string[];
  preventionPractices: string[];
  ipmGuidance: string;
  safetyPrecautions: string;
  isDemo: boolean;
}

export interface MarketPrice {
  commodity: string;
  state: string;
  district: string;
  market: string;
  minPrice: number;
  modalPrice: number;
  maxPrice: number;
  unit: string;
  date: string;
  source: string;
  isDemo: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isTyping?: boolean;
}

export interface Notification {
  id: string;
  type: 'weather' | 'crop' | 'irrigation' | 'fertilizer' | 'pest' | 'market' | 'livestock' | 'reminder';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
}

export interface IFSModule {
  id: string;
  type: 'crop' | 'dairy' | 'poultry' | 'duck' | 'fish' | 'goat' | 'compost' | 'beekeeping' | 'mushroom' | 'agroforestry' | 'biogas';
  name: string;
  enabled: boolean;
  data: Record<string, unknown>;
}

export interface ExpenseRecord {
  id: string;
  farmId: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  enterprise: string;
  season: string;
}

export interface IncomeRecord {
  id: string;
  farmId: string;
  commodity: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalAmount: number;
  date: string;
  enterprise: string;
}

export interface AlertThreshold {
  type: string;
  enabled: boolean;
  value?: number;
}

export type Language = 'en' | 'ta' | 'hi' | 'ml' | 'te' | 'kn';

export type Theme = 'light' | 'dark';

export type SoilType =
  | 'Red Sandy Loam'
  | 'Black Cotton'
  | 'Alluvial'
  | 'Laterite'
  | 'Sandy'
  | 'Loamy'
  | 'Clay'
  | 'Sandy Loam';

export type IrrigationType =
  | 'Drip'
  | 'Sprinkler'
  | 'Flood'
  | 'Furrow'
  | 'Rain-fed';

export type Season = 'Kharif' | 'Rabi' | 'Zaid' | 'Annual' | 'Perennial';
