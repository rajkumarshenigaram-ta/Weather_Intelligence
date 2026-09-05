import React from 'react';
import { DailyForecast, TemperatureUnit } from '../types';
import { convertTemp, getWeatherInfo } from '../services/weatherApi';
import { WeatherTheme } from '../services/weatherTheme';
import { WeatherIcon } from './WeatherIcon';
import { Droplets, Wind, Sun, ArrowUp, ArrowDown } from 'lucide-react';

interface ForecastRowProps {
  daily: DailyForecast[];
  unit: TemperatureUnit;
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
  theme: WeatherTheme;
}

export const ForecastRow: React.FC<ForecastRowProps> = ({
  daily,
  unit,
  selectedDayIndex,
  onSelectDay,
  theme,
}) => {
  if (!daily || daily.length === 0) return null;

  const isDark = theme.isDark;
  const globalMin = Math.min(...daily.map((d) => d.tempMin));
  const globalMax = Math.max(...daily.map((d) => d.tempMax));
  const tempRange = Math.max(globalMax - globalMin, 1);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${theme.textPrimary}`}>
            7-Day Forecast
          </h2>
          <p className={`text-xs mt-0.5 font-medium ${theme.textMuted}`}>
            Select any day to highlight in trend chart & view detailed stats
          </p>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${theme.accentBadge}`}>
          Daily Outlook
        </span>
      </div>

      {/* Responsive cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-3.5">
        {daily.map((day, index) => {
          const condition = getWeatherInfo(day.weatherCode, true);
          const isSelected = selectedDayIndex === index;
          const isToday = index === 0;

          // Calculate temperature bar position & width percentage
          const leftPercent = Math.max(0, Math.min(100, ((day.tempMin - globalMin) / tempRange) * 100));
          const widthPercent = Math.max(
            15,
            Math.min(100 - leftPercent, ((day.tempMax - day.tempMin) / tempRange) * 100)
          );

          return (
            <button
              key={day.date}
              id={`forecast-card-${index}`}
              type="button"
              onClick={() => onSelectDay(index)}
              className={`p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-300 flex flex-col justify-between cursor-pointer relative group backdrop-blur-xl ${
                isSelected
                  ? isDark
                    ? 'bg-white/20 border-2 border-sky-400 ring-4 ring-sky-400/20 shadow-lg -translate-y-1'
                    : 'bg-white/95 border-2 border-sky-500 ring-4 ring-sky-500/15 shadow-md -translate-y-1'
                  : isDark
                  ? 'bg-slate-900/50 border border-white/10 hover:bg-slate-900/75 hover:border-white/25 hover:-translate-y-1 hover:shadow-lg'
                  : 'bg-white/70 border border-white/70 hover:bg-white/90 hover:border-white hover:-translate-y-1 hover:shadow-md'
              }`}
            >
              {/* Day & Date Header */}
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-extrabold ${
                      isSelected
                        ? isDark ? 'text-sky-300' : 'text-sky-700'
                        : isToday
                        ? isDark ? 'text-sky-400' : 'text-sky-600'
                        : theme.textPrimary
                    }`}
                  >
                    {day.shortDay}
                  </span>
                  {day.isWeekend && !isToday && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      isDark ? 'bg-amber-400/20 text-amber-300' : 'bg-amber-100 text-amber-800'
                    }`}>
                      Wknd
                    </span>
                  )}
                  {isToday && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      isDark ? 'bg-sky-400/20 text-sky-300' : 'bg-sky-100 text-sky-800'
                    }`}>
                      Today
                    </span>
                  )}
                </div>
                <p className={`text-[11px] font-medium mt-0.5 ${theme.textMuted}`}>{day.formattedDate}</p>
              </div>

              {/* Weather Icon & Label */}
              <div className="my-3 flex flex-col items-center">
                <div className={`p-2.5 rounded-2xl mb-1.5 transition-transform duration-300 group-hover:scale-110 ${
                  isDark ? 'bg-white/10' : 'bg-white/80 shadow-2xs'
                }`}>
                  <WeatherIcon name={condition.icon} className="w-9 h-9" />
                </div>
                <span className={`text-xs font-semibold text-center line-clamp-1 ${theme.textSecondary}`}>
                  {condition.label}
                </span>
              </div>

              {/* High & Low Temp */}
              <div>
                <div className="flex items-baseline justify-between text-xs font-bold mb-1.5">
                  <span className={`text-sm font-extrabold ${theme.textPrimary}`}>
                    {convertTemp(day.tempMax, unit)}°
                  </span>
                  <span className={`text-xs font-medium ${theme.textMuted}`}>
                    {convertTemp(day.tempMin, unit)}°
                  </span>
                </div>

                {/* Visual temperature bar representing relative range */}
                <div className={`w-full h-1.5 rounded-full overflow-hidden relative mb-2.5 ${
                  isDark ? 'bg-white/10' : 'bg-slate-200/70'
                }`}>
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-orange-500 absolute transition-all duration-300"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>

                {/* Rain probability pill */}
                <div className={`flex items-center justify-between text-[11px] pt-1.5 border-t ${
                  isDark ? 'border-white/10' : 'border-slate-200/60'
                }`}>
                  <span className={`flex items-center gap-1 font-medium ${theme.textMuted}`}>
                    <Droplets className={`w-3 h-3 ${day.rainProbMax >= 30 ? 'text-blue-500' : 'text-slate-400'}`} />
                    {day.rainProbMax}%
                  </span>
                  {day.precipitationSum > 0 && (
                    <span className={`font-bold ${isDark ? 'text-cyan-300' : 'text-blue-600'}`}>
                      {day.precipitationSum}mm
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Expanded Details */}
      {daily[selectedDayIndex] && (
        <div className={`mt-4 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 text-xs transition-all ${theme.panelClass}`}>
          <div className="flex items-center gap-3">
            <span className={`font-bold text-sm ${theme.textPrimary}`}>
              {daily[selectedDayIndex].dayName}, {daily[selectedDayIndex].formattedDate}
            </span>
            <span className={`font-semibold px-2 py-0.5 rounded-md ${isDark ? 'bg-white/10 text-slate-200' : 'bg-white text-slate-700 shadow-2xs'}`}>
              High: {convertTemp(daily[selectedDayIndex].tempMax, unit)}° / Low: {convertTemp(daily[selectedDayIndex].tempMin, unit)}°
            </span>
          </div>

          <div className={`flex items-center gap-4 sm:gap-6 flex-wrap font-medium ${theme.textSecondary}`}>
            <span className="flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-500" />
              Precipitation: <strong className={theme.textPrimary}>{daily[selectedDayIndex].rainProbMax}%</strong>
              {daily[selectedDayIndex].precipitationSum > 0 && ` (${daily[selectedDayIndex].precipitationSum} mm)`}
            </span>
            <span className="flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-sky-500" />
              Peak Wind: <strong className={theme.textPrimary}>{Math.round(daily[selectedDayIndex].windSpeedMax)} km/h</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-500" />
              UV Index: <strong className={theme.textPrimary}>{daily[selectedDayIndex].uvIndexMax}</strong>
            </span>
            {daily[selectedDayIndex].sunrise && (
              <span className="flex items-center gap-1.5">
                <ArrowUp className="w-3.5 h-3.5 text-amber-500" /> {daily[selectedDayIndex].sunrise}
                <ArrowDown className="w-3.5 h-3.5 text-orange-500 ml-1.5" /> {daily[selectedDayIndex].sunset}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
