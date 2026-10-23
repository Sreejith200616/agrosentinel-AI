// Open-Meteo weather API service (free, no API key required)
import type { WeatherData, WeatherCurrent, WeatherHourly, WeatherDaily } from '../types';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function fetchWeather(lat: number, lng: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    current: [
      'temperature_2m','relative_humidity_2m','apparent_temperature',
      'is_day','precipitation','weather_code','wind_speed_10m',
      'wind_direction_10m','uv_index',
    ].join(','),
    hourly: [
      'temperature_2m','relative_humidity_2m','precipitation_probability',
      'precipitation','weather_code','wind_speed_10m',
    ].join(','),
    daily: [
      'temperature_2m_max','temperature_2m_min','precipitation_sum',
      'precipitation_probability_max','weather_code','wind_speed_10m_max',
      'sunrise','sunset','uv_index_max',
    ].join(','),
    timezone: 'Asia/Kolkata',
    forecast_days: '7',
    wind_speed_unit: 'kmh',
  });

  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error(`Weather API error: ${res.statusText}`);
  const data = await res.json();

  const current: WeatherCurrent = {
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    windspeed: data.current.wind_speed_10m,
    winddirection: data.current.wind_direction_10m,
    weathercode: data.current.weather_code,
    precipitation: data.current.precipitation,
    uvindex: data.current.uv_index ?? 0,
    apparent_temperature: data.current.apparent_temperature,
    is_day: data.current.is_day,
    time: data.current.time,
  };

  const hourly: WeatherHourly = {
    time: data.hourly.time,
    temperature_2m: data.hourly.temperature_2m,
    precipitation_probability: data.hourly.precipitation_probability,
    precipitation: data.hourly.precipitation,
    weathercode: data.hourly.weather_code,
    windspeed_10m: data.hourly.wind_speed_10m,
    relativehumidity_2m: data.hourly.relative_humidity_2m,
  };

  const daily: WeatherDaily = {
    time: data.daily.time,
    temperature_2m_max: data.daily.temperature_2m_max,
    temperature_2m_min: data.daily.temperature_2m_min,
    precipitation_sum: data.daily.precipitation_sum,
    precipitation_probability_max: data.daily.precipitation_probability_max,
    weathercode: data.daily.weather_code,
    windspeed_10m_max: data.daily.wind_speed_10m_max,
    sunrise: data.daily.sunrise,
    sunset: data.daily.sunset,
    uv_index_max: data.daily.uv_index_max,
  };

  return {
    current, hourly, daily,
    lat, lng,
    timezone: data.timezone,
    fetchedAt: new Date().toISOString(),
  };
}

// Fallback demo data for when the API is unavailable
export function getDemoWeather(lat = 10.787, lng = 79.137): WeatherData {
  const now = new Date();
  const times = Array.from({ length: 24 }, (_, i) => {
    const d = new Date(now);
    d.setHours(d.getHours() + i, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });

  const dailyDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });

  return {
    current: {
      temperature: 31.4,
      humidity: 72,
      windspeed: 14,
      winddirection: 220,
      weathercode: 3,
      precipitation: 0,
      uvindex: 7,
      apparent_temperature: 36.2,
      is_day: 1,
      time: now.toISOString(),
    },
    hourly: {
      time: times,
      temperature_2m: [29,28,27,27,28,29,31,33,34,34,33,32,31,31,32,33,32,30,29,28,28,27,27,27],
      precipitation_probability: [5,5,5,5,5,5,5,10,15,20,30,40,50,55,60,55,45,30,20,10,5,5,5,5],
      precipitation: [0,0,0,0,0,0,0,0,0,0.2,0.5,1.2,2.1,2.5,2.0,1.5,0.8,0.3,0,0,0,0,0,0],
      weathercode: [1,0,0,0,1,1,2,2,3,3,61,61,63,63,63,61,61,2,1,0,0,0,0,0],
      windspeed_10m: [10,9,8,8,9,11,13,15,16,15,14,13,14,16,17,15,13,11,10,9,9,8,8,8],
      relativehumidity_2m: [75,76,77,78,77,75,72,68,66,68,72,76,80,82,83,80,76,74,75,76,77,78,78,79],
    },
    daily: {
      time: dailyDates,
      temperature_2m_max: [34, 33, 31, 30, 32, 33, 35],
      temperature_2m_min: [25, 24, 23, 23, 24, 24, 25],
      precipitation_sum: [0, 2.5, 8.1, 15.2, 4.0, 0.5, 0],
      precipitation_probability_max: [10, 40, 70, 85, 50, 20, 5],
      weathercode: [1, 61, 63, 65, 61, 2, 1],
      windspeed_10m_max: [18, 22, 28, 35, 24, 16, 14],
      sunrise: dailyDates.map(d => `${d}T06:15`),
      sunset: dailyDates.map(d => `${d}T18:28`),
      uv_index_max: [9, 6, 5, 3, 7, 8, 10],
    },
    lat, lng,
    timezone: 'Asia/Kolkata',
    fetchedAt: now.toISOString(),
  };
}
