import { CurrentWeather, DailyForecast, GeoLocation, TemperatureUnit, WeatherConditionInfo, WeatherData } from '../types';

/**
 * Maps WMO weather code to readable descriptions and styling
 */
export function getWeatherInfo(code: number, isDay: boolean = true): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        label: isDay ? 'Clear sky' : 'Clear night',
        icon: isDay ? 'Sun' : 'Moon',
        color: 'text-amber-500',
        bgColor: 'bg-amber-50 dark:bg-amber-950/30',
      };
    case 1:
      return {
        label: isDay ? 'Mainly clear' : 'Mainly clear',
        icon: isDay ? 'SunMedium' : 'Moon',
        color: 'text-amber-400',
        bgColor: 'bg-amber-50/70 dark:bg-amber-950/20',
      };
    case 2:
      return {
        label: 'Partly cloudy',
        icon: isDay ? 'CloudSun' : 'CloudMoon',
        color: 'text-sky-500',
        bgColor: 'bg-sky-50 dark:bg-sky-950/30',
      };
    case 3:
      return {
        label: 'Overcast',
        icon: 'Cloud',
        color: 'text-slate-500',
        bgColor: 'bg-slate-100 dark:bg-slate-800/40',
      };
    case 45:
    case 48:
      return {
        label: 'Foggy',
        icon: 'CloudFog',
        color: 'text-stone-400',
        bgColor: 'bg-stone-100 dark:bg-stone-900/30',
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Drizzle',
        icon: 'CloudDrizzle',
        color: 'text-cyan-500',
        bgColor: 'bg-cyan-50 dark:bg-cyan-950/30',
      };
    case 56:
    case 57:
      return {
        label: 'Freezing drizzle',
        icon: 'CloudSnow',
        color: 'text-cyan-600',
        bgColor: 'bg-cyan-50 dark:bg-cyan-950/30',
      };
    case 61:
    case 63:
    case 65:
      return {
        label: code === 65 ? 'Heavy rain' : code === 63 ? 'Moderate rain' : 'Light rain',
        icon: 'CloudRain',
        color: 'text-blue-500',
        bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      };
    case 66:
    case 67:
      return {
        label: 'Freezing rain',
        icon: 'CloudSnow',
        color: 'text-indigo-500',
        bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
      };
    case 71:
    case 73:
    case 75:
      return {
        label: code === 75 ? 'Heavy snow' : code === 73 ? 'Moderate snow' : 'Light snow',
        icon: 'Snowflake',
        color: 'text-blue-300',
        bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      };
    case 77:
      return {
        label: 'Snow grains',
        icon: 'Snowflake',
        color: 'text-blue-300',
        bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      };
    case 80:
    case 81:
    case 82:
      return {
        label: code === 82 ? 'Violent rain showers' : 'Rain showers',
        icon: 'CloudRainWind',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      };
    case 85:
    case 86:
      return {
        label: 'Snow showers',
        icon: 'CloudSnow',
        color: 'text-indigo-400',
        bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
      };
    case 95:
      return {
        label: 'Thunderstorm',
        icon: 'CloudLightning',
        color: 'text-amber-600',
        bgColor: 'bg-amber-100/60 dark:bg-amber-950/40',
      };
    case 96:
    case 99:
      return {
        label: 'Thunderstorm with hail',
        icon: 'CloudLightning',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50 dark:bg-purple-950/30',
      };
    default:
      return {
        label: 'Partly cloudy',
        icon: 'CloudSun',
        color: 'text-sky-500',
        bgColor: 'bg-sky-50 dark:bg-sky-950/30',
      };
  }
}

/**
 * Searches cities using Open-Meteo Geocoding API
 */
export async function searchCities(query: string): Promise<GeoLocation[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=10&language=en&format=json`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Geocoding service unavailable');
  }

  const data = await response.json();
  if (!data.results || !Array.isArray(data.results)) {
    return [];
  }

  return data.results.map((item: Record<string, unknown>) => ({
    id: Number(item.id),
    name: String(item.name),
    latitude: Number(item.latitude),
    longitude: Number(item.longitude),
    country: item.country ? String(item.country) : undefined,
    country_code: item.country_code ? String(item.country_code) : undefined,
    admin1: item.admin1 ? String(item.admin1) : undefined,
    timezone: item.timezone ? String(item.timezone) : undefined,
  }));
}

/**
 * Fetches current weather and 7-day forecast from Open-Meteo
 */
export async function fetchWeatherData(location: GeoLocation): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: location.latitude.toString(),
    longitude: location.longitude.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max',
    timezone: 'auto',
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Weather data service temporarily unavailable');
  }

  const raw = await response.json();

  if (!raw.current || !raw.daily || !raw.daily.time) {
    throw new Error('Incomplete weather forecast returned');
  }

  const current: CurrentWeather = {
    time: raw.current.time,
    temperature: Math.round(raw.current.temperature_2m * 10) / 10,
    apparentTemperature: Math.round(raw.current.apparent_temperature * 10) / 10,
    relativeHumidity: Math.round(raw.current.relative_humidity_2m),
    windSpeed: Math.round(raw.current.wind_speed_10m * 10) / 10,
    windDirection: Math.round(raw.current.wind_direction_10m),
    weatherCode: raw.current.weather_code,
    isDay: Boolean(raw.current.is_day),
    precipitation: raw.current.precipitation ?? 0,
  };

  const dayTimes: string[] = raw.daily.time;
  const daily: DailyForecast[] = dayTimes.map((dateStr, index) => {
    // Parse date in UTC or split string to prevent timezone day shift
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);

    const isToday = index === 0;
    const dayOfWeek = dateObj.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday

    const dayName = isToday
      ? 'Today'
      : dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    const shortDay = isToday
      ? 'Today'
      : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    return {
      date: dateStr,
      dayName,
      shortDay,
      formattedDate,
      weatherCode: raw.daily.weather_code[index] ?? 0,
      tempMax: Math.round(raw.daily.temperature_2m_max[index] * 10) / 10,
      tempMin: Math.round(raw.daily.temperature_2m_min[index] * 10) / 10,
      apparentMax: Math.round((raw.daily.apparent_temperature_max?.[index] ?? raw.daily.temperature_2m_max[index]) * 10) / 10,
      apparentMin: Math.round((raw.daily.apparent_temperature_min?.[index] ?? raw.daily.temperature_2m_min[index]) * 10) / 10,
      precipitationSum: Math.round((raw.daily.precipitation_sum?.[index] ?? 0) * 10) / 10,
      rainProbMax: Math.round(raw.daily.precipitation_probability_max?.[index] ?? 0),
      windSpeedMax: Math.round((raw.daily.wind_speed_10m_max?.[index] ?? 0) * 10) / 10,
      uvIndexMax: Math.round((raw.daily.uv_index_max?.[index] ?? 0) * 10) / 10,
      sunrise: raw.daily.sunrise?.[index] ? raw.daily.sunrise[index].split('T')[1] : '',
      sunset: raw.daily.sunset?.[index] ? raw.daily.sunset[index].split('T')[1] : '',
      isWeekend,
    };
  });

  return {
    location,
    current,
    daily,
    timezone: raw.timezone || 'UTC',
  };
}

/**
 * Temperature conversion utilities
 */
export function convertTemp(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatTemp(celsius: number, unit: TemperatureUnit): string {
  const value = convertTemp(celsius, unit);
  return `${value}°${unit === 'fahrenheit' ? 'F' : 'C'}`;
}

export function formatSpeed(kmh: number, unit: TemperatureUnit): string {
  if (unit === 'fahrenheit') {
    // Convert to mph
    const mph = Math.round(kmh * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function getWindCompass(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round((degrees % 360) / 45) % 8;
  return directions[index];
}
