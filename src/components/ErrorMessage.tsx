import React from 'react';
import { AlertCircle, RotateCcw, MapPin } from 'lucide-react';
import { WeatherTheme } from '../services/weatherTheme';

interface ErrorMessageProps {
  message?: string;
  onRetry: () => void;
  onSelectPopularCity: (city: string) => void;
  theme?: WeatherTheme;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = 'City not found, please try again',
  onRetry,
  onSelectPopularCity,
  theme,
}) => {
  const isDark = theme?.isDark ?? false;

  return (
    <div
      id="city-not-found-message"
      className={`w-full max-w-2xl mx-auto my-12 rounded-3xl p-8 text-center transition-all backdrop-blur-xl ${
        isDark
          ? 'bg-slate-900/80 border border-rose-500/30 text-white shadow-2xl'
          : 'bg-white/80 border border-rose-200 text-slate-800 shadow-xl'
      }`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border ${
        isDark ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-rose-50 text-rose-600 border-rose-100'
      }`}>
        <AlertCircle className="w-7 h-7" />
      </div>

      <h2 className="text-xl font-bold mb-2">{message}</h2>
      <p className={`text-sm max-w-md mx-auto mb-6 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
        We could not find matching weather data for your search. Please check the spelling or select one of the suggested cities below.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
        <button
          id="retry-search-btn"
          type="button"
          onClick={onRetry}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-sm font-semibold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> Try Searching Again
        </button>
      </div>

      <div className={`pt-6 border-t ${isDark ? 'border-white/10' : 'border-slate-200/70'}`}>
        <p className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center justify-center gap-1.5 ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          <MapPin className="w-3.5 h-3.5 text-sky-400" /> Popular Destinations
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {['San Francisco', 'London', 'Tokyo', 'New York', 'Paris'].map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => onSelectPopularCity(city)}
              className={`text-xs px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/15'
                  : 'bg-white/70 hover:bg-white text-slate-700 border-slate-200 hover:text-slate-900'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
