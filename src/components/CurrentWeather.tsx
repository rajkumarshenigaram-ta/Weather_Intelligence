import React from 'react';
import {
  Wind,
  Droplets,
  CloudRain,
  Sun,
  Sunset,
  Compass,
} from 'lucide-react';
import { CurrentWeather as CurrentWeatherType, DailyForecast, GeoLocation, TemperatureUnit } from '../types';
import {
  formatTemp,
  formatSpeed,
  getWindCompass,
  getWeatherInfo,
  convertTemp,
} from '../services/weatherApi';
import { WeatherTheme } from '../services/weatherTheme';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherProps {
  current: CurrentWeatherType;
  todayForecast?: DailyForecast;
  location: GeoLocation;
  unit: TemperatureUnit;
  onToggleUnit: () => void;
  theme: WeatherTheme;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherProps> = ({
  current,
  todayForecast,
  location,
  unit,
  onToggleUnit,
  theme,
}) => {
  const condition = getWeatherInfo(current.weatherCode, current.isDay);
  const locationSubtitle = [location.admin1, location.country].filter(Boolean).join(', ');
  const isDark = theme.isDark;

  const getUVBadge = (uv: number) => {
    if (uv <= 2) return { text: 'Low', color: isDark ? 'text-emerald-300 bg-emerald-500/20 border-emerald-500/30' : 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (uv <= 5) return { text: 'Moderate', color: isDark ? 'text-amber-300 bg-amber-500/20 border-amber-500/30' : 'text-amber-700 bg-amber-50 border-amber-200' };
    if (uv <= 7) return { text: 'High', color: isDark ? 'text-orange-300 bg-orange-500/20 border-orange-500/30' : 'text-orange-700 bg-orange-50 border-orange-200' };
    return { text: 'Very High', color: isDark ? 'text-rose-300 bg-rose-500/20 border-rose-500/30' : 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const uvBadge = todayForecast ? getUVBadge(todayForecast.uvIndexMax) : null;

  return (
    <div
      id="current-weather-card"
      className={`rounded-3xl p-6 sm:p-8 mb-8 transition-all duration-300 relative overflow-hidden ${theme.panelClass}`}
    >
      {/* Decorative subtle ambient inner light reflection */}
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none filter blur-3xl opacity-30 -mr-20 -mt-20"
        style={{ backgroundColor: theme.glowColor }}
      />

      {/* Header: Location & Unit Switcher */}
      <div className={`flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b ${isDark ? 'border-white/10' : 'border-slate-200/60'}`}>
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${theme.textPrimary}`}>
              {location.name}
            </h1>
            {location.country_code && (
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border font-mono ${
                isDark
                  ? 'bg-white/10 border-white/15 text-slate-200'
                  : 'bg-white/80 border-slate-200 text-slate-700 shadow-2xs'
              }`}>
                {location.country_code}
              </span>
            )}
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${theme.accentBadge}`}>
              {theme.name}
            </span>
          </div>
          {locationSubtitle && (
            <p className={`text-sm mt-1 font-medium ${theme.textMuted}`}>{locationSubtitle}</p>
          )}
        </div>

        {/* Temperature Unit Toggle */}
        <div className={`flex items-center self-start p-1 rounded-2xl border backdrop-blur-md ${
          isDark
            ? 'bg-black/30 border-white/15 text-slate-300'
            : 'bg-slate-100/70 border-white/80 text-slate-600'
        }`}>
          <button
            id="unit-celsius-btn"
            type="button"
            onClick={() => unit !== 'celsius' && onToggleUnit()}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              unit === 'celsius'
                ? isDark
                  ? 'bg-white/20 text-white shadow-xs'
                  : 'bg-white text-slate-900 shadow-xs'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            °C
          </button>
          <button
            id="unit-fahrenheit-btn"
            type="button"
            onClick={() => unit !== 'fahrenheit' && onToggleUnit()}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              unit === 'fahrenheit'
                ? isDark
                  ? 'bg-white/20 text-white shadow-xs'
                  : 'bg-white text-slate-900 shadow-xs'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            °F
          </button>
        </div>
      </div>

      {/* Main Stats: Big Hero Temp + Condition Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-6">
        {/* Hero temperature & weather condition */}
        <div className="md:col-span-6 flex items-center gap-6">
          <div className="relative shrink-0">
            {/* Glowing circular backdrop for the custom weather icon */}
            <div
              className="absolute inset-0 rounded-full blur-xl opacity-70 transition-all"
              style={{ backgroundColor: theme.glowColor }}
            />
            <div className={`relative p-4 rounded-2xl backdrop-blur-md border ${
              isDark ? 'bg-white/10 border-white/15' : 'bg-white/80 border-white/90 shadow-xs'
            }`}>
              <WeatherIcon name={condition.icon} className="w-16 h-16 sm:w-20 sm:h-20" animated={true} />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className={`text-6xl sm:text-7xl font-extrabold tracking-tight ${theme.textPrimary}`}>
                {convertTemp(current.temperature, unit)}°
              </span>
              <span className={`text-2xl font-semibold ${theme.textMuted}`}>
                {unit === 'fahrenheit' ? 'F' : 'C'}
              </span>
            </div>
            <p className={`text-xl font-bold mt-1 ${theme.textPrimary}`}>{condition.label}</p>
            <p className={`text-sm mt-0.5 font-medium ${theme.textMuted}`}>
              Feels like {formatTemp(current.apparentTemperature, unit)}
              {todayForecast && (
                <span className={`ml-2 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  • H: {formatTemp(todayForecast.tempMax, unit)} / L: {formatTemp(todayForecast.tempMin, unit)}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Quick highlight metrics: Wind & Humidity required by prompt */}
        <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-2 gap-3.5">
          {/* Wind Speed */}
          <div className={`rounded-2xl p-4 flex items-center gap-3.5 transition-all ${theme.subpanelClass}`}>
            <div className={`p-2.5 rounded-xl shrink-0 ${
              isDark ? 'bg-sky-500/20 text-sky-400' : 'bg-sky-100/90 text-sky-700'
            }`}>
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <p className={`text-xs font-semibold ${theme.textMuted}`}>Wind Speed</p>
              <p className={`text-base sm:text-lg font-bold ${theme.textPrimary}`}>
                {formatSpeed(current.windSpeed, unit)}
              </p>
              <p className={`text-xs font-medium flex items-center gap-1 ${theme.textMuted}`}>
                <Compass className="w-3 h-3 text-sky-500" />
                {getWindCompass(current.windDirection)} ({current.windDirection}°)
              </p>
            </div>
          </div>

          {/* Humidity */}
          <div className={`rounded-2xl p-4 flex items-center gap-3.5 transition-all ${theme.subpanelClass}`}>
            <div className={`p-2.5 rounded-xl shrink-0 ${
              isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100/90 text-blue-700'
            }`}>
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <p className={`text-xs font-semibold ${theme.textMuted}`}>Humidity</p>
              <p className={`text-base sm:text-lg font-bold ${theme.textPrimary}`}>{current.relativeHumidity}%</p>
              <p className={`text-xs font-medium ${theme.textMuted}`}>
                {current.relativeHumidity > 65
                  ? 'Humid air'
                  : current.relativeHumidity < 30
                  ? 'Dry air'
                  : 'Comfortable'}
              </p>
            </div>
          </div>

          {/* Rain / Precipitation */}
          <div className={`rounded-2xl p-4 flex items-center gap-3.5 transition-all ${theme.subpanelClass}`}>
            <div className={`p-2.5 rounded-xl shrink-0 ${
              isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100/90 text-cyan-700'
            }`}>
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <p className={`text-xs font-semibold ${theme.textMuted}`}>Precipitation</p>
              <p className={`text-base sm:text-lg font-bold ${theme.textPrimary}`}>
                {todayForecast ? `${todayForecast.rainProbMax}%` : '0%'}
              </p>
              <p className={`text-xs font-medium ${theme.textMuted}`}>
                {todayForecast && todayForecast.precipitationSum > 0
                  ? `${todayForecast.precipitationSum} mm rain`
                  : 'No rain expected'}
              </p>
            </div>
          </div>

          {/* UV Index / Sun */}
          <div className={`rounded-2xl p-4 flex items-center gap-3.5 transition-all ${theme.subpanelClass}`}>
            <div className={`p-2.5 rounded-xl shrink-0 ${
              isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100/90 text-amber-700'
            }`}>
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className={`text-xs font-semibold ${theme.textMuted}`}>UV Index</p>
                {uvBadge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${uvBadge.color}`}>
                    {uvBadge.text}
                  </span>
                )}
              </div>
              <p className={`text-base sm:text-lg font-bold ${theme.textPrimary}`}>
                {todayForecast ? todayForecast.uvIndexMax : '--'}
              </p>
              <p className={`text-xs font-medium ${theme.textMuted}`}>
                {todayForecast?.sunset ? (
                  <span className="flex items-center gap-1">
                    <Sunset className="w-3 h-3 text-amber-500" /> Sunset {todayForecast.sunset}
                  </span>
                ) : (
                  'Daily peak'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
