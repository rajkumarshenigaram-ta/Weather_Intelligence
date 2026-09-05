import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, Navigation } from 'lucide-react';
import { GeoLocation } from '../types';
import { searchCities } from '../services/weatherApi';
import { WeatherTheme } from '../services/weatherTheme';

interface SearchBarProps {
  onSelectCity: (location: GeoLocation) => void;
  isLoading: boolean;
  currentCityName?: string;
  theme: WeatherTheme;
}

const POPULAR_CITIES: GeoLocation[] = [
  { id: 5391959, name: 'San Francisco', latitude: 37.7749, longitude: -122.4194, admin1: 'California', country: 'United States' },
  { id: 2643743, name: 'London', latitude: 51.5085, longitude: -0.1257, country: 'United Kingdom' },
  { id: 1850147, name: 'Tokyo', latitude: 35.6895, longitude: 139.6917, country: 'Japan' },
  { id: 5128581, name: 'New York', latitude: 40.7143, longitude: -74.006, admin1: 'New York', country: 'United States' },
  { id: 2988507, name: 'Paris', latitude: 48.8534, longitude: 2.3488, country: 'France' },
  { id: 2147714, name: 'Sydney', latitude: -33.8678, longitude: 151.2073, admin1: 'New South Wales', country: 'Australia' },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectCity,
  isLoading,
  currentCityName,
  theme,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [locatingUser, setLocatingUser] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search for suggestions dropdown
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsSearchingSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingSuggestions(true);
      try {
        const results = await searchCities(trimmed);
        setSuggestions(results);
        setIsOpen(true);
      } catch (err) {
        console.error('Error fetching city suggestions:', err);
        setSuggestions([]);
      } finally {
        setIsSearchingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
      return;
    }

    setIsSearchingSuggestions(true);
    try {
      const results = await searchCities(trimmed);
      if (results && results.length > 0) {
        handleSelect(results[0]);
      } else {
        onSelectCity({
          id: -1,
          name: trimmed,
          latitude: NaN,
          longitude: NaN,
        });
      }
    } catch {
      onSelectCity({
        id: -1,
        name: trimmed,
        latitude: NaN,
        longitude: NaN,
      });
    } finally {
      setIsSearchingSuggestions(false);
    }
  };

  const handleSelect = (city: GeoLocation) => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.blur();
    onSelectCity(city);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
          );
          let cityName = 'Current Location';
          let countryName: string | undefined = undefined;
          if (res.ok) {
            const data = await res.json();
            cityName =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.address?.county ||
              'Current Location';
            countryName = data.address?.country;
          }
          onSelectCity({
            id: Date.now(),
            name: cityName,
            latitude: lat,
            longitude: lon,
            country: countryName,
          });
        } catch {
          onSelectCity({
            id: Date.now(),
            name: 'My Location',
            latitude: lat,
            longitude: lon,
          });
        } finally {
          setLocatingUser(false);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLocatingUser(false);
      },
      { timeout: 8000 }
    );
  };

  const isDark = theme.isDark;

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 relative z-40" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2.5">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            {isSearchingSuggestions || isLoading ? (
              <Loader2 className={`w-5 h-5 animate-spin ${isDark ? 'text-sky-400' : 'text-sky-600'}`} />
            ) : (
              <Search className={`w-5 h-5 ${isDark ? 'text-slate-400 group-focus-within:text-sky-400' : 'text-slate-500 group-focus-within:text-sky-600'} transition-colors`} />
            )}
          </div>

          <input
            id="city-search-input"
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            placeholder="Search city, town, or location (e.g. San Francisco, Tokyo, Rome)..."
            aria-label="Search city name"
            className={`w-full pl-12 pr-11 py-3.5 rounded-2xl text-base font-medium shadow-xs transition-all outline-none ${
              isDark
                ? 'bg-slate-900/60 backdrop-blur-xl border border-white/15 text-white placeholder:text-slate-400 focus:border-sky-400/80 focus:ring-4 focus:ring-sky-500/20'
                : 'bg-white/75 backdrop-blur-xl border border-white/70 text-slate-900 placeholder:text-slate-400 focus:border-sky-500/80 focus:ring-4 focus:ring-sky-500/15'
            }`}
            autoComplete="off"
          />

          {query && (
            <button
              id="clear-search-btn"
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Submit Search Button */}
        <button
          id="search-submit-btn"
          type="submit"
          disabled={isLoading || isSearchingSuggestions}
          className={`px-5 py-3.5 rounded-2xl font-semibold transition-all duration-200 shadow-xs flex items-center gap-1.5 disabled:opacity-50 whitespace-nowrap cursor-pointer hover:translate-y-[-1px] active:translate-y-[0px] ${
            isDark
              ? 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-sky-900/30'
              : 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-sky-500/20'
          }`}
        >
          <span>Search</span>
        </button>

        {/* Current Location Geolocation Button */}
        <button
          id="geolocation-btn"
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={locatingUser || isLoading}
          title="Detect current location"
          aria-label="Detect current location"
          className={`p-3.5 rounded-2xl transition-all duration-200 shadow-xs flex items-center justify-center disabled:opacity-50 cursor-pointer hover:translate-y-[-1px] ${
            isDark
              ? 'bg-slate-900/60 backdrop-blur-xl border border-white/15 text-slate-200 hover:bg-slate-800/80 hover:text-white'
              : 'bg-white/75 backdrop-blur-xl border border-white/70 text-slate-700 hover:bg-white hover:text-slate-900'
          }`}
        >
          {locatingUser ? (
            <Loader2 className="w-5 h-5 animate-spin text-sky-500" />
          ) : (
            <Navigation className="w-5 h-5" />
          )}
        </button>

        {/* Autocomplete suggestions dropdown */}
        {isOpen && suggestions.length > 0 && (
          <div
            className={`absolute top-full left-0 right-0 mt-2.5 rounded-2xl shadow-2xl border overflow-hidden max-h-72 overflow-y-auto backdrop-blur-2xl z-50 transition-all ${
              isDark
                ? 'bg-slate-900/90 border-white/15 text-slate-200'
                : 'bg-white/90 border-white/70 text-slate-800 shadow-slate-900/10'
            }`}
          >
            <div
              className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider border-b ${
                isDark
                  ? 'bg-slate-950/60 border-white/10 text-slate-400'
                  : 'bg-slate-50/80 border-slate-100 text-slate-500'
              }`}
            >
              Suggested Cities
            </div>
            {suggestions.map((city) => (
              <button
                key={`${city.id}-${city.name}-${city.latitude}`}
                type="button"
                onClick={() => handleSelect(city)}
                className={`w-full text-left px-4 py-3.5 flex items-center justify-between border-b last:border-0 transition-colors cursor-pointer ${
                  isDark
                    ? 'border-white/5 hover:bg-white/10'
                    : 'border-slate-100/80 hover:bg-sky-50/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
                  <span className="font-semibold">{city.name}</span>
                  {(city.admin1 || city.country) && (
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {[city.admin1, city.country].filter(Boolean).join(', ')}
                    </span>
                  )}
                </div>
                {city.country_code && (
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded-md border ${
                      isDark
                        ? 'bg-white/10 border-white/10 text-slate-300'
                        : 'bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                  >
                    {city.country_code}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Popular quick-pick cities chips */}
      <div className="mt-3.5 flex items-center gap-1.5 flex-wrap">
        <span
          className={`text-xs font-semibold mr-1 flex items-center gap-1 ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-sky-500" /> Popular:
        </span>
        {POPULAR_CITIES.map((city) => {
          const isActive = currentCityName?.toLowerCase() === city.name.toLowerCase();
          return (
            <button
              key={city.id}
              id={`quick-city-${city.name.toLowerCase().replace(/\s+/g, '-')}`}
              type="button"
              onClick={() => handleSelect(city)}
              className={`text-xs px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer backdrop-blur-md ${
                isActive
                  ? isDark
                    ? 'bg-sky-500/30 border border-sky-400 text-white font-bold shadow-xs'
                    : 'bg-sky-100/90 border border-sky-300 text-sky-900 font-bold shadow-xs'
                  : isDark
                  ? 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/15 hover:text-white'
                  : 'bg-white/60 border border-white/60 text-slate-700 hover:bg-white hover:text-slate-900'
              }`}
            >
              {city.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
