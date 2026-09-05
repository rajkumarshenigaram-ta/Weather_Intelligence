import React from 'react';
import { WeatherTheme } from '../services/weatherTheme';

interface WeatherSkeletonProps {
  theme?: WeatherTheme;
}

export const WeatherSkeleton: React.FC<WeatherSkeletonProps> = ({ theme }) => {
  const isDark = theme?.isDark ?? false;
  const panelCls = isDark ? 'glass-panel-dark' : 'glass-panel';
  const shimmerCls = isDark ? 'bg-white/10' : 'bg-slate-200/70';
  const shimmerLightCls = isDark ? 'bg-white/5' : 'bg-slate-100';

  return (
    <div className="w-full space-y-8 animate-pulse">
      {/* Current Weather Card Skeleton */}
      <div className={`rounded-3xl p-6 sm:p-8 ${panelCls}`}>
        {/* Header */}
        <div className={`flex justify-between items-start pb-6 border-b ${isDark ? 'border-white/10' : 'border-slate-200/60'}`}>
          <div className="space-y-2">
            <div className={`h-8 w-48 rounded-xl ${shimmerCls}`} />
            <div className={`h-4 w-32 rounded-lg ${shimmerLightCls}`} />
          </div>
          <div className={`h-8 w-24 rounded-2xl ${shimmerLightCls}`} />
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6 items-center">
          <div className="md:col-span-6 flex items-center gap-6">
            <div className={`w-20 h-20 rounded-2xl shrink-0 ${shimmerCls}`} />
            <div className="space-y-3">
              <div className={`h-14 w-36 rounded-2xl ${shimmerCls}`} />
              <div className={`h-5 w-28 rounded-lg ${shimmerLightCls}`} />
            </div>
          </div>
          <div className="md:col-span-6 grid grid-cols-2 gap-3.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-24 rounded-2xl p-3 ${shimmerLightCls}`} />
            ))}
          </div>
        </div>
      </div>

      {/* 7-Day Forecast Cards Skeleton */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className={`h-6 w-36 rounded-lg ${shimmerCls}`} />
          <div className={`h-5 w-28 rounded-full ${shimmerLightCls}`} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className={`h-52 rounded-2xl p-4 space-y-3 ${panelCls}`}>
              <div className={`h-4 w-12 rounded-sm ${shimmerCls}`} />
              <div className={`h-12 w-12 rounded-xl mx-auto ${shimmerLightCls}`} />
              <div className={`h-4 w-full rounded-md ${shimmerLightCls}`} />
              <div className={`h-2 w-full rounded-full ${shimmerLightCls}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Temp Trend Chart Skeleton */}
      <div className={`rounded-3xl p-6 h-64 flex flex-col justify-between ${panelCls}`}>
        <div className={`h-6 w-48 rounded-lg ${shimmerCls}`} />
        <div className={`h-36 rounded-2xl ${shimmerLightCls}`} />
      </div>

      {/* Smart Planner Skeleton */}
      <div className={`rounded-3xl p-6 sm:p-8 space-y-4 ${panelCls}`}>
        <div className={`h-6 w-52 rounded-lg ${shimmerCls}`} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-32 rounded-2xl p-4 ${shimmerLightCls}`} />
          ))}
        </div>
      </div>
    </div>
  );
};
