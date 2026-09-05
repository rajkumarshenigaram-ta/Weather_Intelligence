import { useState, useEffect, useCallback, useMemo } from 'react';
import { CloudSun, RefreshCw, Palette, Check } from 'lucide-react';
import { GeoLocation, TemperatureUnit, WeatherData, SmartPlanItem } from './types';
import { fetchWeatherData, searchCities } from './services/weatherApi';
import { generateSmartPlanning } from './utils/planner';
import { getWeatherTheme, WeatherTheme } from './services/weatherTheme';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeather';
import { ForecastRow } from './components/ForecastRow';
import { TempTrendChart } from './components/TempTrendChart';
import { SmartPlanning } from './components/SmartPlanning';
import { WeatherSkeleton } from './components/WeatherSkeleton';
import { ErrorMessage } from './components/ErrorMessage';

const DEFAULT_CITY: GeoLocation = {
  id: 5391959,
  name: 'San Francisco',
  latitude: 37.7749,
  longitude: -122.4194,
  admin1: 'California',
  country: 'United States',
  country_code: 'US',
};

// Preset weather condition themes for quick manual exploration
const THEME_PRESETS = [
  { id: 'auto', label: 'Auto (Live Weather)', code: -1, isDay: true },
  { id: 'sunny-day', label: 'Warm Golden (Sunny)', code: 0, isDay: true },
  { id: 'rain-day', label: 'Cool Blue (Rainy)', code: 61, isDay: true },
  { id: 'storm-night', label: 'Dark Slate (Storm)', code: 95, isDay: false },
  { id: 'clear-night', label: 'Midnight (Clear Night)', code: 0, isDay: false },
  { id: 'overcast-day', label: 'Silver Mist (Overcast)', code: 3, isDay: true },
  { id: 'snow-day', label: 'Arctic Frost (Snow)', code: 71, isDay: true },
];

const STORAGE_KEY_CITY_NAME = 'weather_active_city_name';
const STORAGE_KEY_LOCATION = 'weather_active_location';

function getInitialSavedCity(): { location: GeoLocation | null; cityName: string | null } {
  try {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlCity = urlParams.get('city')?.trim();
      if (urlCity) {
        return { location: null, cityName: urlCity };
      }
      const rawLoc = localStorage.getItem(STORAGE_KEY_LOCATION);
      if (rawLoc) {
        const parsed = JSON.parse(rawLoc);
        if (parsed && typeof parsed.latitude === 'number' && !isNaN(parsed.latitude)) {
          return { location: parsed, cityName: parsed.name };
        }
      }
      const savedName = localStorage.getItem(STORAGE_KEY_CITY_NAME)?.trim();
      if (savedName) {
        return { location: null, cityName: savedName };
      }
    }
  } catch {
    // fallback
  }
  return { location: DEFAULT_CITY, cityName: DEFAULT_CITY.name };
}

export default function App() {
  const initialSaved = useMemo(() => getInitialSavedCity(), []);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [smartPlans, setSmartPlans] = useState<SmartPlanItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [currentLocation, setCurrentLocation] = useState<GeoLocation>(initialSaved.location || DEFAULT_CITY);
  const [activeCityName, setActiveCityName] = useState<string>(initialSaved.cityName || DEFAULT_CITY.name);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [manualThemeId, setManualThemeId] = useState<string>('auto');
  const [showThemePicker, setShowThemePicker] = useState<boolean>(false);

  // Load weather for a given GeoLocation
  const loadWeather = useCallback(
    async (location: GeoLocation) => {
      // Validate coordinates
      if (isNaN(location.latitude) || isNaN(location.longitude)) {
        setError('City not found, please try again');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setActiveCityName(location.name);

      try {
        const data = await fetchWeatherData(location);
        setWeatherData(data);
        setCurrentLocation(location);
        setSelectedDayIndex(0);
        setLastUpdated(new Date());

        // Persist active city and location to localStorage
        try {
          localStorage.setItem(STORAGE_KEY_CITY_NAME, location.name);
          localStorage.setItem(STORAGE_KEY_LOCATION, JSON.stringify(location));
        } catch (e) {
          console.warn('Unable to persist active city to localStorage:', e);
        }

        // Keep URL query parameter in sync without page reload (e.g. ?city=London)
        try {
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.set('city', location.name);
          window.history.replaceState({ city: location.name }, '', currentUrl.toString());
        } catch (e) {
          console.warn('Unable to update URL parameter:', e);
        }

        // Generate smart planning advice
        const plans = generateSmartPlanning(data.daily, data.current, unit);
        setSmartPlans(plans);
      } catch (err) {
        console.error('Failed to load weather data:', err);
        setError('City not found, please try again');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [unit]
  );

  // Initial load: Read saved city from URL parameter or localStorage, falling back to default
  useEffect(() => {
    let isCancelled = false;

    const initializeCity = async () => {
      // 1. Check URL query parameters (e.g., ?city=London)
      const urlParams = new URLSearchParams(window.location.search);
      const urlCity = urlParams.get('city')?.trim();

      // 2. Check localStorage
      let storedLocation: GeoLocation | null = null;
      let storedCityName: string | null = null;
      try {
        const rawLoc = localStorage.getItem(STORAGE_KEY_LOCATION);
        if (rawLoc) {
          const parsed = JSON.parse(rawLoc);
          if (parsed && typeof parsed.latitude === 'number' && !isNaN(parsed.latitude)) {
            storedLocation = parsed;
          }
        }
        storedCityName = localStorage.getItem(STORAGE_KEY_CITY_NAME)?.trim() || null;
      } catch (e) {
        console.warn('Error reading from localStorage:', e);
      }

      // Priority 1: URL city parameter
      if (urlCity) {
        // Fast path: stored location matches URL city name
        if (
          storedLocation &&
          storedLocation.name.toLowerCase() === urlCity.toLowerCase()
        ) {
          if (!isCancelled) loadWeather(storedLocation);
          return;
        }

        // Fast path: matches DEFAULT_CITY
        if (DEFAULT_CITY.name.toLowerCase() === urlCity.toLowerCase()) {
          if (!isCancelled) loadWeather(DEFAULT_CITY);
          return;
        }

        // Search for the city from the URL query
        try {
          const results = await searchCities(urlCity);
          if (results.length > 0 && !isCancelled) {
            loadWeather(results[0]);
            return;
          }
        } catch (err) {
          console.error('Failed searching city from URL query parameter:', err);
        }
      }

      // Priority 2: Stored GeoLocation in localStorage
      if (storedLocation) {
        if (!isCancelled) loadWeather(storedLocation);
        return;
      }

      // Priority 3: Stored city name in localStorage
      if (storedCityName) {
        try {
          const results = await searchCities(storedCityName);
          if (results.length > 0 && !isCancelled) {
            loadWeather(results[0]);
            return;
          }
        } catch (err) {
          console.error('Failed searching city from localStorage:', err);
        }
      }

      // Priority 4: Fallback to default city
      if (!isCancelled) {
        loadWeather(DEFAULT_CITY);
      }
    };

    initializeCity();

    return () => {
      isCancelled = true;
    };
  }, [loadWeather]);

  // Handle browser back/forward history navigation
  useEffect(() => {
    const handlePopState = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const urlCity = urlParams.get('city')?.trim();
      if (urlCity && urlCity.toLowerCase() !== currentLocation?.name.toLowerCase()) {
        try {
          const results = await searchCities(urlCity);
          if (results.length > 0) {
            loadWeather(results[0]);
          }
        } catch (err) {
          console.warn('Error syncing popstate city:', err);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentLocation, loadWeather]);

  // Recalculate smart plans when temperature unit changes
  useEffect(() => {
    if (weatherData) {
      const plans = generateSmartPlanning(weatherData.daily, weatherData.current, unit);
      setSmartPlans(plans);
    }
  }, [unit, weatherData]);

  // Calculate dynamic theme based on live weather data or manual preview
  const theme: WeatherTheme = useMemo(() => {
    if (manualThemeId !== 'auto') {
      const preset = THEME_PRESETS.find((p) => p.id === manualThemeId);
      if (preset && preset.code !== -1) {
        return getWeatherTheme(preset.code, preset.isDay);
      }
    }
    if (weatherData) {
      return getWeatherTheme(weatherData.current.weatherCode, weatherData.current.isDay);
    }
    // Default pleasant sunny theme while loading
    return getWeatherTheme(0, true);
  }, [manualThemeId, weatherData]);

  // Handle city selection from search or chips
  const handleSelectCity = async (location: GeoLocation) => {
    if (isNaN(location.latitude) || isNaN(location.longitude)) {
      setError('City not found, please try again');
      return;
    }
    loadWeather(location);
  };

  // Handle popular city search from error state
  const handleSelectPopularCity = async (cityName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await searchCities(cityName);
      if (results && results.length > 0) {
        loadWeather(results[0]);
      } else {
        setError('City not found, please try again');
        setIsLoading(false);
      }
    } catch {
      setError('City not found, please try again');
      setIsLoading(false);
    }
  };

  // Toggle °C / °F
  const handleToggleUnit = () => {
    setUnit((prev) => (prev === 'celsius' ? 'fahrenheit' : 'celsius'));
  };

  // Manual refresh
  const handleRefresh = () => {
    if (currentLocation && !isLoading) {
      setIsRefreshing(true);
      loadWeather(currentLocation);
    }
  };

  const isDark = theme.isDark;

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-700 ease-in-out antialiased ${
        theme.bgGradient
      } ${isDark ? 'text-slate-100' : 'text-slate-800'}`}
    >
      {/* Dynamic Animated Ambient Light Orbs in Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {theme.ambientOrbs.map((orb, i) => (
          <div
            key={`${theme.id}-${i}`}
            className={`absolute ${orb.position} ${orb.size} ${orb.color} ${orb.animation} rounded-full filter blur-3xl opacity-50 transition-all duration-1000`}
          />
        ))}
        {/* Subtle grid mesh overlay for glass depth */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${isDark ? '#fff' : '#000'} 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Top Application Header with Frosted Glass */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 backdrop-blur-xl border-b ${
          isDark
            ? 'bg-slate-950/60 border-white/10 text-white'
            : 'bg-white/65 border-white/70 text-slate-900 shadow-2xs'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-sky-400 via-blue-500 to-amber-400 text-white rounded-2xl shadow-sm">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight block leading-tight">
                Weather & Week Planner
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[11px] font-medium hidden sm:inline ${theme.textMuted}`}>
                  Live Open-Meteo forecasts
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${theme.accentBadge}`}>
                  {theme.name}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Atmosphere theme selector pill */}
            <div className="relative">
              <button
                id="theme-selector-btn"
                type="button"
                onClick={() => setShowThemePicker(!showThemePicker)}
                title="Dynamic background theme"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md ${
                  isDark
                    ? 'bg-white/10 hover:bg-white/15 border-white/15 text-slate-200'
                    : 'bg-white/80 hover:bg-white border-white/80 text-slate-700 shadow-2xs'
                }`}
              >
                <Palette className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Theme:</span>
                <span className="max-w-[100px] truncate">
                  {manualThemeId === 'auto' ? 'Auto' : theme.name}
                </span>
              </button>

              {/* Theme Dropdown Popover */}
              {showThemePicker && (
                <div
                  className={`absolute right-0 mt-2 w-64 rounded-2xl p-2 shadow-2xl border backdrop-blur-2xl z-50 transition-all ${
                    isDark
                      ? 'bg-slate-900/95 border-white/15 text-slate-200'
                      : 'bg-white/95 border-white/80 text-slate-800 shadow-slate-900/10'
                  }`}
                >
                  <div className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Background Atmospheres
                  </div>
                  {THEME_PRESETS.map((preset) => {
                    const isSelected = manualThemeId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setManualThemeId(preset.id);
                          setShowThemePicker(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? isDark
                              ? 'bg-sky-500/20 text-sky-300 font-bold'
                              : 'bg-sky-100 text-sky-900 font-bold'
                            : isDark
                            ? 'hover:bg-white/10 text-slate-300'
                            : 'hover:bg-slate-100/80 text-slate-700'
                        }`}
                      >
                        <span>{preset.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-sky-500" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick unit switcher in header */}
            <div
              className={`flex items-center p-0.5 rounded-xl border backdrop-blur-md ${
                isDark ? 'bg-black/20 border-white/15' : 'bg-slate-100/80 border-white/80'
              }`}
            >
              <button
                type="button"
                onClick={() => setUnit('celsius')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  unit === 'celsius'
                    ? isDark
                      ? 'bg-white/20 text-white shadow-xs'
                      : 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                °C
              </button>
              <button
                type="button"
                onClick={() => setUnit('fahrenheit')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  unit === 'fahrenheit'
                    ? isDark
                      ? 'bg-white/20 text-white shadow-xs'
                      : 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                °F
              </button>
            </div>

            {/* Refresh button */}
            <button
              id="refresh-weather-btn"
              type="button"
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
              title="Refresh weather data"
              aria-label="Refresh forecast"
              className={`p-2 rounded-xl transition-all cursor-pointer disabled:opacity-40 border ${
                isDark
                  ? 'bg-white/10 hover:bg-white/15 border-white/15 text-slate-300 hover:text-white'
                  : 'bg-white/80 hover:bg-white border-white/80 text-slate-600 hover:text-slate-900 shadow-2xs'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
            </button>

            {/* Update time */}
            <div className="hidden lg:flex flex-col text-right">
              <span className={`text-[10px] font-semibold uppercase tracking-wider ${theme.textMuted}`}>
                Updated
              </span>
              <span className={`text-xs font-bold ${theme.textPrimary}`}>
                {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
        {/* Search Bar with Autocomplete & Popular City Chips */}
        <SearchBar
          onSelectCity={handleSelectCity}
          isLoading={isLoading}
          currentCityName={weatherData?.location.name || activeCityName}
          theme={theme}
        />

        {/* Error State: "City not found, please try again" */}
        {error ? (
          <ErrorMessage
            message={error}
            onRetry={() => {
              setError(null);
              if (weatherData) {
                // Keep showing previous good weather data
              } else {
                loadWeather(DEFAULT_CITY);
              }
            }}
            onSelectPopularCity={handleSelectPopularCity}
            theme={theme}
          />
        ) : isLoading && !weatherData ? (
          /* Initial skeleton loading state */
          <WeatherSkeleton theme={theme} />
        ) : weatherData ? (
          <div className="space-y-2">
            {/* Current Weather Card */}
            <CurrentWeatherCard
              current={weatherData.current}
              todayForecast={weatherData.daily[0]}
              location={weatherData.location}
              unit={unit}
              onToggleUnit={handleToggleUnit}
              theme={theme}
            />

            {/* Smart Planning Section: Plain-English Guidance */}
            <SmartPlanning plans={smartPlans} daily={weatherData.daily} theme={theme} />

            {/* 7-Day Forecast Cards */}
            <ForecastRow
              daily={weatherData.daily}
              unit={unit}
              selectedDayIndex={selectedDayIndex}
              onSelectDay={(idx) => setSelectedDayIndex(idx)}
              theme={theme}
            />

            {/* 7-Day Temperature Trend Chart */}
            <TempTrendChart daily={weatherData.daily} unit={unit} theme={theme} />
          </div>
        ) : null}
      </main>

      {/* Clean Glassmorphic Footer */}
      <footer
        className={`border-t py-6 mt-12 text-center text-xs relative z-10 backdrop-blur-md ${
          isDark
            ? 'border-white/10 bg-slate-950/40 text-slate-400'
            : 'border-white/60 bg-white/40 text-slate-600'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-semibold">Weather & Week Planner</span>
          <span className="font-medium">
            Weather forecasts powered by{' '}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-500 hover:underline font-semibold"
            >
              Open-Meteo
            </a>{' '}
            (Free & Open-Source)
          </span>
        </div>
      </footer>
    </div>
  );
}
