import React from 'react';
import { SmartPlanItem, DailyForecast } from '../types';
import { WeatherTheme } from '../services/weatherTheme';
import { WeatherIcon } from './WeatherIcon';
import { Compass, CheckCircle2, AlertCircle, Info, CalendarDays } from 'lucide-react';

interface SmartPlanningProps {
  plans: SmartPlanItem[];
  daily: DailyForecast[];
  theme: WeatherTheme;
}

export const SmartPlanning: React.FC<SmartPlanningProps> = ({ plans, daily, theme }) => {
  if (!plans || plans.length === 0) return null;

  const isDark = theme.isDark;
  const dryDaysCount = daily.filter((d) => d.rainProbMax < 30 && d.precipitationSum === 0).length;
  const rainyDaysCount = daily.length - dryDaysCount;

  return (
    <div
      id="smart-planning-section"
      className={`rounded-3xl p-6 sm:p-8 mb-8 transition-all duration-300 relative overflow-hidden ${theme.panelClass}`}
    >
      {/* Section Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b ${
        isDark ? 'border-white/10' : 'border-slate-200/60'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl ${
            isDark ? 'bg-sky-500/20 text-sky-400' : 'bg-sky-100/90 text-sky-700'
          }`}>
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${theme.textPrimary}`}>
              Smart Week Planner
            </h2>
            <p className={`text-xs mt-0.5 font-medium ${theme.textMuted}`}>
              Actionable, plain-English advice tailored to upcoming conditions
            </p>
          </div>
        </div>

        {/* Quick summary tally pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border backdrop-blur-md ${
            isDark
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : 'bg-emerald-50/90 text-emerald-800 border-emerald-200 shadow-2xs'
          }`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            {dryDaysCount} Dry {dryDaysCount === 1 ? 'Day' : 'Days'}
          </span>
          {rainyDaysCount > 0 && (
            <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border backdrop-blur-md ${
              isDark
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                : 'bg-blue-50/90 text-blue-800 border-blue-200 shadow-2xs'
            }`}>
              <Compass className="w-3.5 h-3.5" />
              {rainyDaysCount} Rain {rainyDaysCount === 1 ? 'Day' : 'Days'}
            </span>
          )}
        </div>
      </div>

      {/* Advice Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {plans.map((item) => {
          const isWarning = item.severity === 'warning';
          const isPositive = item.severity === 'positive';

          const cardTheme = isWarning
            ? {
                border: isDark ? 'border-amber-400/30' : 'border-amber-200/80',
                bg: isDark ? 'bg-amber-950/30 backdrop-blur-md' : 'bg-amber-50/60 backdrop-blur-md',
                iconBg: isDark ? 'bg-amber-400/20 text-amber-300' : 'bg-amber-100 text-amber-800',
                badgeBg: isDark ? 'bg-amber-400/15 text-amber-200 border-amber-400/20' : 'bg-amber-100/90 text-amber-900 border-amber-200',
                statusIcon: <AlertCircle className="w-4 h-4 text-amber-500" />,
              }
            : isPositive
            ? {
                border: isDark ? 'border-emerald-400/30' : 'border-emerald-200/80',
                bg: isDark ? 'bg-emerald-950/30 backdrop-blur-md' : 'bg-emerald-50/60 backdrop-blur-md',
                iconBg: isDark ? 'bg-emerald-400/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800',
                badgeBg: isDark ? 'bg-emerald-400/15 text-emerald-200 border-emerald-400/20' : 'bg-emerald-100/90 text-emerald-900 border-emerald-200',
                statusIcon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
              }
            : {
                border: isDark ? 'border-white/10' : 'border-white/70',
                bg: isDark ? 'bg-white/5 backdrop-blur-md' : 'bg-white/60 backdrop-blur-md',
                iconBg: isDark ? 'bg-sky-500/20 text-sky-300' : 'bg-sky-100 text-sky-800',
                badgeBg: isDark ? 'bg-white/10 text-slate-200 border-white/10' : 'bg-slate-100 text-slate-700 border-slate-200',
                statusIcon: <Info className="w-4 h-4 text-sky-500" />,
              };

          return (
            <div
              key={item.id}
              className={`p-5 sm:p-6 rounded-2xl border ${cardTheme.border} ${cardTheme.bg} transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${cardTheme.iconBg} shrink-0`}>
                      <WeatherIcon name={item.icon} className="w-5 h-5" />
                    </div>
                    <h3 className={`text-base font-bold ${theme.textPrimary}`}>{item.title}</h3>
                  </div>
                  <div className="shrink-0">{cardTheme.statusIcon}</div>
                </div>

                {/* Plain-English Advice Paragraph */}
                <p className={`text-sm leading-relaxed pl-0.5 mt-1 font-medium ${theme.textSecondary}`}>
                  {item.advice}
                </p>
              </div>

              {/* Impact Days Tags */}
              <div className={`mt-5 pt-3.5 border-t flex items-center gap-1.5 flex-wrap ${
                isDark ? 'border-white/10' : 'border-slate-200/60'
              }`}>
                <span className={`text-[11px] font-semibold ${theme.textMuted}`}>Applicable:</span>
                {item.impactDays.map((day) => (
                  <span
                    key={day}
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${cardTheme.badgeBg}`}
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
