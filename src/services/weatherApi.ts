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
 * Normalize strings by removing diacritics, lowercase, and stripping non-alphanumeric chars
 */
export function cleanCityString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9\s]/g, ' ')   // strip symbols
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculates Levenshtein distance between two strings
 */
export function calculateLevenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // deletion
        dp[i][j - 1] + 1,      // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return dp[m][n];
}

/**
 * Common city abbreviations or aliases
 */
export const CITY_ALIASES: Record<string, string> = {
  nyc: 'New York',
  la: 'Los Angeles',
  sf: 'San Francisco',
  dc: 'Washington',
  rio: 'Rio de Janeiro',
};

/**
 * Common keyboard walk sequences and spam patterns
 */
const KEYBOARD_MASH_PATTERNS = [
  'qwerty', 'asdfgh', 'zxcvbn', 'qwert', 'asdfg', 'zxcvb',
  'qwer', 'asdf', 'zxcv', 'qwe', 'asd', 'zxc',
  'uiop', 'hjkl', 'bnm', 'lkjh', 'fdsa', 'poiuy', 'rewq',
  'blabla', 'test'
];

/**
 * Checks if a search query is random gibberish, pure numbers, or invalid text
 */
export function isGibberishOrInvalidQuery(query: string): boolean {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return true;

  // Must contain at least one alphabetic letter
  if (!/[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]/.test(trimmed)) {
    return true;
  }

  // Letters must make up at least 50% of the query (rejects '1234a', '!@#$a', etc.)
  const lettersCount = (trimmed.match(/[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]/g) || []).length;
  const nonSpaceChars = trimmed.replace(/\s+/g, '').length;
  if (nonSpaceChars > 0 && lettersCount / nonSpaceChars < 0.5) {
    return true;
  }

  const alphaLower = trimmed.toLowerCase().replace(/[^a-z]/g, '');

  // Check keyboard mash patterns (e.g. 'asdf', 'qwerty', 'asd')
  if (KEYBOARD_MASH_PATTERNS.includes(alphaLower)) {
    return true;
  }
  for (const mash of KEYBOARD_MASH_PATTERNS) {
    if (mash.length >= 4 && alphaLower.includes(mash)) {
      return true;
    }
  }

  // If 4+ chars and contains no vowels at all (e.g. 'dfgh', 'zxcvb')
  if (trimmed.length >= 4 && !/[aeiouy\u00C0-\u024F\u1E00-\u1EFF]/i.test(trimmed)) {
    return true;
  }

  // 3+ identical consecutive characters (e.g. 'aaaa', 'zzzzzz')
  if (/(.)\1{2,}/i.test(trimmed)) {
    return true;
  }

  // Repeating syllables or keyboard spam like 'blablabla', 'asdfasdf'
  if (/^(.{2,4})\1{2,}$/i.test(trimmed)) {
    return true;
  }

  return false;
}

/**
 * Validates whether a candidate city closely matches the user's query
 */
export function validateAndScoreCityMatch(
  query: string,
  city: {
    name: string;
    country?: string;
    admin1?: string;
    country_code?: string;
    population?: number;
  }
): { isMatch: boolean; score: number } {
  if (isGibberishOrInvalidQuery(query)) {
    return { isMatch: false, score: 0 };
  }

  const cleanQuery = cleanCityString(query);
  const cleanName = cleanCityString(city.name);
  const cleanCountry = cleanCityString(city.country || '');
  const cleanAdmin = cleanCityString(city.admin1 || '');
  const cleanCode = cleanCityString(city.country_code || '');

  // Check alias match (e.g. 'nyc' -> 'New York', 'sf' -> 'San Francisco')
  const resolvedAlias = CITY_ALIASES[cleanQuery];
  if (resolvedAlias && cleanCityString(resolvedAlias) === cleanName) {
    return { isMatch: true, score: 1.0 };
  }

  // Split query on comma if user typed 'City, Region' (e.g. 'Paris, France' or 'Portland, OR')
  let cityPart = cleanQuery;
  let regionPart = '';
  if (query.includes(',')) {
    const parts = query.split(',');
    cityPart = cleanCityString(parts[0]);
    regionPart = cleanCityString(parts.slice(1).join(' '));
  }

  // 1. Exact name match
  if (cleanName === cityPart) {
    if (regionPart) {
      const regionMatches =
        cleanCountry.includes(regionPart) ||
        cleanAdmin.includes(regionPart) ||
        cleanCode === regionPart;
      return { isMatch: true, score: regionMatches ? 1.0 : 0.95 };
    }
    return { isMatch: true, score: 1.0 };
  }

  // 2. Prefix match (e.g. user typing 'san fran' or 'tok' for 'Tokyo')
  if (cityPart.length >= 3) {
    if (cleanName.startsWith(cityPart)) {
      // For short 3-letter queries, require significant population or short city name
      if (cityPart.length === 3) {
        const pop = city.population || 0;
        if (pop >= 10000 || cleanName.length <= 6) {
          return { isMatch: true, score: 0.92 };
        }
      } else {
        return { isMatch: true, score: 0.92 };
      }
    }
    // Or city name is prefix of query (e.g. query is 'San Francisco CA')
    if (cityPart.startsWith(cleanName) && cleanName.length >= 3) {
      return { isMatch: true, score: 0.9 };
    }
  }

  // 3. Word-level token match for multi-word city names (e.g. 'york' for 'New York', 'rio' for 'Rio de Janeiro')
  const nameWords = cleanName.split(' ').filter(Boolean);
  const queryWords = cityPart.split(' ').filter(Boolean);

  if (queryWords.length === 1 && queryWords[0].length >= 3) {
    if (nameWords.includes(queryWords[0])) {
      return { isMatch: true, score: 0.88 };
    }
  } else if (queryWords.length > 1) {
    const allMatch = queryWords.every((w) => nameWords.includes(w));
    if (allMatch) {
      return { isMatch: true, score: 0.94 };
    }
  }

  // 4. Typo tolerance via Levenshtein edit distance
  if (cityPart.length >= 4 && cleanName.length >= 3) {
    const dist = calculateLevenshtein(cityPart, cleanName);
    const maxLen = Math.max(cityPart.length, cleanName.length);
    const similarity = 1 - dist / maxLen;

    const maxAllowedDist = cityPart.length <= 4 ? 1 : cityPart.length <= 7 ? 2 : 3;
    if (dist <= maxAllowedDist && similarity >= 0.72) {
      return { isMatch: true, score: similarity * 0.85 };
    }
  }

  return { isMatch: false, score: 0 };
}

/**
 * Searches cities using Open-Meteo Geocoding API with strict validation to reject gibberish
 */
export async function searchCities(query: string): Promise<GeoLocation[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2 || isGibberishOrInvalidQuery(trimmed)) {
    return [];
  }

  const cleanQuery = cleanCityString(trimmed);
  const resolvedQuery = CITY_ALIASES[cleanQuery] || trimmed;

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    resolvedQuery
  )}&count=10&language=en&format=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Geocoding service unavailable');
  }

  const data = await response.json();
  if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
    return [];
  }

  // Validate and filter each result so only genuine close matches are returned
  const matches: { location: GeoLocation; score: number }[] = [];

  for (const item of data.results as Record<string, unknown>[]) {
    const location: GeoLocation = {
      id: Number(item.id),
      name: String(item.name),
      latitude: Number(item.latitude),
      longitude: Number(item.longitude),
      country: item.country ? String(item.country) : undefined,
      country_code: item.country_code ? String(item.country_code) : undefined,
      admin1: item.admin1 ? String(item.admin1) : undefined,
      timezone: item.timezone ? String(item.timezone) : undefined,
      population: item.population !== undefined ? Number(item.population) : undefined,
    };

    const validation = validateAndScoreCityMatch(trimmed, location);
    if (validation.isMatch) {
      matches.push({ location, score: validation.score });
    }
  }

  // If no candidates closely match the user's search query, treat as unrecognized
  if (matches.length === 0) {
    return [];
  }

  // Sort by match score first, then by population for ties
  matches.sort((a, b) => {
    if (Math.abs(a.score - b.score) > 0.05) {
      return b.score - a.score;
    }
    const popA = a.location.population || 0;
    const popB = b.location.population || 0;
    return popB - popA;
  });

  return matches.map((m) => m.location);
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
