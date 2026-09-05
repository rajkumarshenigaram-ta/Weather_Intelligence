export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string; // State or region
  timezone?: string;
}

export interface CurrentWeather {
  time: string;
  temperature: number; // in Celsius from API
  apparentTemperature: number;
  relativeHumidity: number;
  windSpeed: number; // in km/h from API
  windDirection: number;
  weatherCode: number;
  isDay: boolean;
  precipitation: number;
}

export interface DailyForecast {
  date: string; // "2026-09-05"
  dayName: string; // "Saturday" or "Today"
  shortDay: string; // "Sat" or "Today"
  formattedDate: string; // "Sep 5"
  weatherCode: number;
  tempMax: number; // in Celsius
  tempMin: number; // in Celsius
  apparentMax: number;
  apparentMin: number;
  precipitationSum: number; // in mm
  rainProbMax: number; // percentage 0-100
  windSpeedMax: number; // in km/h
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
  isWeekend: boolean;
}

export interface WeatherData {
  location: GeoLocation;
  current: CurrentWeather;
  daily: DailyForecast[];
  timezone: string;
}

export type AdviceCategory = 'umbrella' | 'weekend' | 'outdoor' | 'clothing' | 'uv' | 'wind';

export interface SmartPlanItem {
  id: string;
  category: AdviceCategory;
  title: string;
  advice: string;
  impactDays: string[];
  severity: 'positive' | 'warning' | 'info';
  icon: string; // Lucide icon identifier
}

export interface WeatherConditionInfo {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
}
