export interface WeatherTheme {
  id: string;
  name: string;
  isDark: boolean;
  // Dynamic background classes & styles
  bgGradient: string;
  ambientOrbs: {
    color: string;
    position: string;
    size: string;
    animation: string;
  }[];
  // Glassmorphic panel classes
  panelClass: string;
  subpanelClass: string;
  buttonClass: string;
  borderClass: string;
  // Typography & accents
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentBadge: string;
  accentText: string;
  glowColor: string;
  chartLineHigh: string;
  chartLineLow: string;
  chartAreaGradFrom: string;
}

export function getWeatherTheme(weatherCode: number, isDay: boolean = true): WeatherTheme {
  // NIGHT TIME THEMES
  if (!isDay) {
    if (weatherCode >= 95) {
      // Thunderstorm at night
      return {
        id: 'storm-night',
        name: 'Thunderstorm Night',
        isDark: true,
        bgGradient: 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900',
        ambientOrbs: [
          { color: 'bg-purple-600/30', position: 'top-10 left-1/4', size: 'w-96 h-96', animation: 'animate-ambient-1' },
          { color: 'bg-amber-400/20', position: 'top-1/3 right-10', size: 'w-80 h-80', animation: 'animate-ambient-2' },
          { color: 'bg-indigo-600/35', position: 'bottom-20 left-10', size: 'w-96 h-96', animation: 'animate-ambient-3' },
        ],
        panelClass: 'glass-panel-dark',
        subpanelClass: 'glass-subpanel-dark',
        buttonClass: 'glass-button-dark',
        borderClass: 'border-white/10',
        textPrimary: 'text-white',
        textSecondary: 'text-slate-300',
        textMuted: 'text-slate-400',
        accentBadge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        accentText: 'text-purple-400',
        glowColor: 'rgba(168, 85, 247, 0.4)',
        chartLineHigh: '#c084fc',
        chartLineLow: '#38bdf8',
        chartAreaGradFrom: 'rgba(192, 132, 252, 0.35)',
      };
    }

    if (weatherCode >= 51 && weatherCode <= 82) {
      // Rain at night
      return {
        id: 'rain-night',
        name: 'Rainy Night',
        isDark: true,
        bgGradient: 'bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950',
        ambientOrbs: [
          { color: 'bg-blue-600/30', position: 'top-0 right-1/4', size: 'w-96 h-96', animation: 'animate-ambient-1' },
          { color: 'bg-cyan-500/20', position: 'bottom-10 left-1/3', size: 'w-80 h-80', animation: 'animate-ambient-2' },
          { color: 'bg-indigo-700/25', position: 'top-1/2 left-10', size: 'w-96 h-96', animation: 'animate-ambient-3' },
        ],
        panelClass: 'glass-panel-dark',
        subpanelClass: 'glass-subpanel-dark',
        buttonClass: 'glass-button-dark',
        borderClass: 'border-white/10',
        textPrimary: 'text-white',
        textSecondary: 'text-slate-300',
        textMuted: 'text-slate-400',
        accentBadge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        accentText: 'text-blue-400',
        glowColor: 'rgba(59, 130, 246, 0.35)',
        chartLineHigh: '#60a5fa',
        chartLineLow: '#38bdf8',
        chartAreaGradFrom: 'rgba(96, 165, 250, 0.3)',
      };
    }

    // Clear or cloudy night (Midnight Slate / Deep Indigo)
    return {
      id: 'clear-night',
      name: 'Clear Night',
      isDark: true,
      bgGradient: 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900',
      ambientOrbs: [
        { color: 'bg-indigo-600/30', position: 'top-12 left-1/5', size: 'w-96 h-96', animation: 'animate-ambient-1' },
        { color: 'bg-sky-500/20', position: 'bottom-16 right-1/4', size: 'w-80 h-80', animation: 'animate-ambient-2' },
        { color: 'bg-violet-700/25', position: 'top-1/2 right-10', size: 'w-88 h-88', animation: 'animate-ambient-3' },
      ],
      panelClass: 'glass-panel-dark',
      subpanelClass: 'glass-subpanel-dark',
      buttonClass: 'glass-button-dark',
      borderClass: 'border-white/10',
      textPrimary: 'text-white',
      textSecondary: 'text-slate-300',
      textMuted: 'text-slate-400',
      accentBadge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      accentText: 'text-indigo-400',
      glowColor: 'rgba(99, 102, 241, 0.35)',
      chartLineHigh: '#818cf8',
      chartLineLow: '#38bdf8',
      chartAreaGradFrom: 'rgba(129, 140, 248, 0.3)',
    };
  }

  // DAY TIME THEMES

  // Thunderstorm Day (Dark slate / moody charcoal with electric violet accents)
  if (weatherCode >= 95) {
    return {
      id: 'storm-day',
      name: 'Thunderstorm',
      isDark: true,
      bgGradient: 'bg-gradient-to-br from-slate-900 via-purple-950/90 to-slate-950',
      ambientOrbs: [
        { color: 'bg-purple-600/35', position: 'top-8 left-10', size: 'w-96 h-96', animation: 'animate-ambient-1' },
        { color: 'bg-amber-400/25', position: 'bottom-16 right-12', size: 'w-80 h-80', animation: 'animate-ambient-2' },
        { color: 'bg-indigo-500/30', position: 'top-1/3 right-1/3', size: 'w-96 h-96', animation: 'animate-ambient-3' },
      ],
      panelClass: 'glass-panel-dark',
      subpanelClass: 'glass-subpanel-dark',
      buttonClass: 'glass-button-dark',
      borderClass: 'border-white/10',
      textPrimary: 'text-white',
      textSecondary: 'text-slate-300',
      textMuted: 'text-slate-400',
      accentBadge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      accentText: 'text-purple-400',
      glowColor: 'rgba(168, 85, 247, 0.4)',
      chartLineHigh: '#fbbf24',
      chartLineLow: '#c084fc',
      chartAreaGradFrom: 'rgba(251, 191, 36, 0.35)',
    };
  }

  // Rain / Drizzle Day (Cool blue & oceanic aquatic sheen)
  if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {
    return {
      id: 'rain-day',
      name: 'Rain & Showers',
      isDark: false,
      bgGradient: 'bg-gradient-to-br from-sky-100 via-blue-50 to-slate-200/90',
      ambientOrbs: [
        { color: 'bg-blue-400/35', position: 'top-6 left-12', size: 'w-96 h-96', animation: 'animate-ambient-1' },
        { color: 'bg-cyan-300/35', position: 'bottom-10 right-10', size: 'w-88 h-88', animation: 'animate-ambient-2' },
        { color: 'bg-sky-300/30', position: 'top-1/2 right-1/4', size: 'w-96 h-96', animation: 'animate-ambient-3' },
      ],
      panelClass: 'glass-panel',
      subpanelClass: 'glass-subpanel',
      buttonClass: 'glass-button',
      borderClass: 'border-white/60',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-700',
      textMuted: 'text-slate-500',
      accentBadge: 'bg-blue-100 text-blue-800 border-blue-200',
      accentText: 'text-blue-600',
      glowColor: 'rgba(37, 99, 235, 0.25)',
      chartLineHigh: '#2563eb',
      chartLineLow: '#0284c7',
      chartAreaGradFrom: 'rgba(37, 99, 235, 0.25)',
    };
  }

  // Snow / Freezing Day (Icy Arctic Blue & Frosted Lavender)
  if ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86)) {
    return {
      id: 'snow-day',
      name: 'Snow & Frost',
      isDark: false,
      bgGradient: 'bg-gradient-to-br from-indigo-100/90 via-sky-50 to-blue-100/80',
      ambientOrbs: [
        { color: 'bg-indigo-300/40', position: 'top-8 right-12', size: 'w-96 h-96', animation: 'animate-ambient-1' },
        { color: 'bg-blue-200/45', position: 'bottom-12 left-10', size: 'w-88 h-88', animation: 'animate-ambient-2' },
        { color: 'bg-cyan-200/35', position: 'top-1/3 left-1/3', size: 'w-96 h-96', animation: 'animate-ambient-3' },
      ],
      panelClass: 'glass-panel',
      subpanelClass: 'glass-subpanel',
      buttonClass: 'glass-button',
      borderClass: 'border-white/60',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-700',
      textMuted: 'text-slate-500',
      accentBadge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      accentText: 'text-indigo-600',
      glowColor: 'rgba(99, 102, 241, 0.25)',
      chartLineHigh: '#6366f1',
      chartLineLow: '#38bdf8',
      chartAreaGradFrom: 'rgba(99, 102, 241, 0.25)',
    };
  }

  // Fog / Overcast Day (Soft Silver Slate & Diffused Mist)
  if (weatherCode === 3 || weatherCode === 45 || weatherCode === 48) {
    return {
      id: 'overcast-day',
      name: 'Overcast & Fog',
      isDark: false,
      bgGradient: 'bg-gradient-to-br from-slate-200/90 via-stone-100/90 to-slate-200/90',
      ambientOrbs: [
        { color: 'bg-slate-400/25', position: 'top-10 left-12', size: 'w-96 h-96', animation: 'animate-ambient-1' },
        { color: 'bg-stone-300/30', position: 'bottom-12 right-12', size: 'w-88 h-88', animation: 'animate-ambient-2' },
        { color: 'bg-sky-200/30', position: 'top-1/2 left-1/2', size: 'w-96 h-96', animation: 'animate-ambient-3' },
      ],
      panelClass: 'glass-panel',
      subpanelClass: 'glass-subpanel',
      buttonClass: 'glass-button',
      borderClass: 'border-white/60',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-700',
      textMuted: 'text-slate-500',
      accentBadge: 'bg-slate-200/80 text-slate-800 border-slate-300',
      accentText: 'text-slate-700',
      glowColor: 'rgba(100, 116, 139, 0.2)',
      chartLineHigh: '#475569',
      chartLineLow: '#0ea5e9',
      chartAreaGradFrom: 'rgba(71, 85, 105, 0.2)',
    };
  }

  // Partly Cloudy Day (Breezy Sky Azure & Soft Sunlight)
  if (weatherCode === 2) {
    return {
      id: 'partly-cloudy-day',
      name: 'Partly Cloudy',
      isDark: false,
      bgGradient: 'bg-gradient-to-br from-sky-100 via-amber-50/60 to-blue-100/70',
      ambientOrbs: [
        { color: 'bg-sky-400/30', position: 'top-8 left-10', size: 'w-96 h-96', animation: 'animate-ambient-1' },
        { color: 'bg-amber-300/30', position: 'top-16 right-10', size: 'w-80 h-80', animation: 'animate-ambient-2' },
        { color: 'bg-cyan-300/25', position: 'bottom-10 left-1/4', size: 'w-96 h-96', animation: 'animate-ambient-3' },
      ],
      panelClass: 'glass-panel',
      subpanelClass: 'glass-subpanel',
      buttonClass: 'glass-button',
      borderClass: 'border-white/60',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-700',
      textMuted: 'text-slate-500',
      accentBadge: 'bg-sky-100 text-sky-800 border-sky-200',
      accentText: 'text-sky-600',
      glowColor: 'rgba(2, 132, 199, 0.25)',
      chartLineHigh: '#f59e0b',
      chartLineLow: '#0284c7',
      chartAreaGradFrom: 'rgba(245, 158, 11, 0.25)',
    };
  }

  // Sunny / Clear Day (Warm golden aura & sun-drenched sky)
  return {
    id: 'sunny-day',
    name: 'Sunny & Clear',
    isDark: false,
    bgGradient: 'bg-gradient-to-br from-amber-100/90 via-orange-50/80 to-sky-100/80',
    ambientOrbs: [
      { color: 'bg-amber-400/40', position: 'top-6 left-12', size: 'w-96 h-96', animation: 'animate-ambient-1' },
      { color: 'bg-orange-300/35', position: 'bottom-12 right-12', size: 'w-88 h-88', animation: 'animate-ambient-2' },
      { color: 'bg-sky-300/35', position: 'top-1/3 right-1/4', size: 'w-96 h-96', animation: 'animate-ambient-3' },
    ],
    panelClass: 'glass-panel',
    subpanelClass: 'glass-subpanel',
    buttonClass: 'glass-button',
    borderClass: 'border-white/60',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    textMuted: 'text-slate-500',
    accentBadge: 'bg-amber-100 text-amber-800 border-amber-200',
    accentText: 'text-amber-600',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    chartLineHigh: '#f59e0b',
    chartLineLow: '#0284c7',
    chartAreaGradFrom: 'rgba(245, 158, 11, 0.28)',
  };
}
