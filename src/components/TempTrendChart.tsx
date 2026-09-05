import React, { useState } from 'react';
import { DailyForecast, TemperatureUnit } from '../types';
import { convertTemp } from '../services/weatherApi';
import { WeatherTheme } from '../services/weatherTheme';
import { TrendingUp, Sparkles } from 'lucide-react';

interface TempTrendChartProps {
  daily: DailyForecast[];
  unit: TemperatureUnit;
  theme: WeatherTheme;
}

export const TempTrendChart: React.FC<TempTrendChartProps> = ({ daily, unit, theme }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!daily || daily.length === 0) return null;

  const isDark = theme.isDark;

  // Extract high and low values converted to selected unit
  const highTemps = daily.map((d) => convertTemp(d.tempMax, unit));
  const lowTemps = daily.map((d) => convertTemp(d.tempMin, unit));

  const minTemp = Math.min(...lowTemps);
  const maxTemp = Math.max(...highTemps);
  const tempSpan = Math.max(maxTemp - minTemp, 4);

  // SVG dimensions & margins
  const width = 800;
  const height = 240;
  const paddingLeft = 45;
  const paddingRight = 45;
  const paddingTop = 40;
  const paddingBottom = 45;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Coordinate mapping functions
  const getX = (index: number) => {
    return paddingLeft + (index / (daily.length - 1)) * chartWidth;
  };

  const getY = (temp: number) => {
    const ratio = (temp - minTemp) / tempSpan;
    return height - paddingBottom - ratio * chartHeight;
  };

  // Build SVG path strings with smooth cubic bezier curves
  const highPoints = highTemps.map((temp, i) => ({ x: getX(i), y: getY(temp), temp, day: daily[i] }));
  const lowPoints = lowTemps.map((temp, i) => ({ x: getX(i), y: getY(temp), temp, day: daily[i] }));

  const buildPath = (points: { x: number; y: number }[]) => {
    return points.reduce((acc, pt, i) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`;
      const prev = points[i - 1];
      const cx1 = prev.x + (pt.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (pt.x - prev.x) / 2;
      const cy2 = pt.y;
      return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
    }, '');
  };

  const highPath = buildPath(highPoints);
  const lowPath = buildPath(lowPoints);

  // Area under high curve
  const highAreaPath = `${highPath} L ${highPoints[highPoints.length - 1].x} ${height - paddingBottom} L ${highPoints[0].x} ${height - paddingBottom} Z`;

  return (
    <div
      id="temperature-trend-chart-card"
      className={`rounded-3xl p-6 sm:p-7 mb-8 transition-all duration-300 relative overflow-hidden ${theme.panelClass}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl ${
            isDark ? 'bg-amber-400/20 text-amber-300' : 'bg-amber-100 text-amber-700'
          }`}>
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${theme.textPrimary}`}>
              Temperature Trajectory
            </h2>
            <p className={`text-xs mt-0.5 font-medium ${theme.textMuted}`}>
              Smooth high and low temperature curves across the week
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full inline-block shadow-2xs"
              style={{ backgroundColor: theme.chartLineHigh }}
            />
            <span className={theme.textPrimary}>Daytime High</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full inline-block shadow-2xs"
              style={{ backgroundColor: theme.chartLineLow }}
            />
            <span className={theme.textMuted}>Nighttime Low</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            {/* Linear gradient for high temp area */}
            <linearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.chartLineHigh} stopOpacity="0.32" />
              <stop offset="60%" stopColor={theme.chartLineHigh} stopOpacity="0.08" />
              <stop offset="100%" stopColor={theme.chartLineHigh} stopOpacity="0.0" />
            </linearGradient>

            {/* Linear gradient for high line */}
            <linearGradient id="trendLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={theme.chartLineHigh} />
              <stop offset="100%" stopColor={theme.chartLineHigh} />
            </linearGradient>

            {/* Filter for subtle line glow */}
            <filter id="curveGlow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={theme.chartLineHigh} floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 0.5, 1].map((fraction) => {
            const tempVal = Math.round(minTemp + fraction * tempSpan);
            const y = getY(tempVal);
            return (
              <g key={`grid-${fraction}`}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke={isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  className={`text-[10px] font-mono font-bold ${
                    isDark ? 'fill-slate-400' : 'fill-slate-500'
                  }`}
                >
                  {tempVal}°
                </text>
              </g>
            );
          })}

          {/* Shaded Area under High Temp Curve */}
          <path d={highAreaPath} fill="url(#trendAreaGrad)" />

          {/* High Temp Curve with smooth glow */}
          <path
            d={highPath}
            fill="none"
            stroke="url(#trendLineGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#curveGlow)"
          />

          {/* Low Temp Curve with dashed styling */}
          <path
            d={lowPath}
            fill="none"
            stroke={theme.chartLineLow}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="5 3"
            opacity="0.85"
          />

          {/* Data Points and Column guides */}
          {daily.map((day, i) => {
            const high = highPoints[i];
            const low = lowPoints[i];
            const isHovered = hoveredIndex === i;

            return (
              <g
                key={day.date}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Vertical hover line indicator */}
                <line
                  x1={high.x}
                  y1={paddingTop - 10}
                  x2={high.x}
                  y2={height - paddingBottom}
                  stroke={isHovered ? theme.chartLineHigh : 'transparent'}
                  strokeWidth={isHovered ? '2' : '0'}
                  strokeDasharray="3 3"
                  opacity={isHovered ? 0.8 : 0}
                />

                {/* High Temp Circle Marker */}
                <circle
                  cx={high.x}
                  cy={high.y}
                  r={isHovered ? 7 : 5}
                  fill={isDark ? '#0f172a' : '#ffffff'}
                  stroke={theme.chartLineHigh}
                  strokeWidth={isHovered ? 3.5 : 2.5}
                  className="transition-all duration-200"
                />

                {/* High Temp text label */}
                <text
                  x={high.x}
                  y={high.y - 12}
                  textAnchor="middle"
                  className={`text-[12px] font-extrabold transition-all duration-200 ${
                    isHovered ? 'scale-110' : ''
                  }`}
                  fill={isDark ? '#ffffff' : '#0f172a'}
                >
                  {high.temp}°
                </text>

                {/* Low Temp Circle Marker */}
                <circle
                  cx={low.x}
                  cy={low.y}
                  r={isHovered ? 6 : 4}
                  fill={isDark ? '#0f172a' : '#ffffff'}
                  stroke={theme.chartLineLow}
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-200"
                />

                {/* Low Temp text label */}
                <text
                  x={low.x}
                  y={low.y + 18}
                  textAnchor="middle"
                  className="text-[11px] font-semibold"
                  fill={isDark ? '#94a3b8' : '#64748b'}
                >
                  {low.temp}°
                </text>

                {/* X-axis Day Name */}
                <text
                  x={high.x}
                  y={height - paddingBottom + 20}
                  textAnchor="middle"
                  className={`text-[11px] font-bold ${
                    isHovered
                      ? isDark ? 'fill-sky-300 font-extrabold' : 'fill-sky-700 font-extrabold'
                      : day.shortDay === 'Today'
                      ? isDark ? 'fill-sky-400' : 'fill-sky-600'
                      : isDark ? 'fill-slate-300' : 'fill-slate-700'
                  }`}
                >
                  {day.shortDay}
                </text>

                {/* X-axis Date */}
                <text
                  x={high.x}
                  y={height - paddingBottom + 32}
                  textAnchor="middle"
                  className="text-[9px] font-medium"
                  fill={isDark ? '#64748b' : '#94a3b8'}
                >
                  {day.formattedDate}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Interactive hover detail banner */}
      {hoveredIndex !== null && daily[hoveredIndex] && (
        <div className={`mt-3 pt-3.5 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
          isDark ? 'border-white/10 text-slate-300' : 'border-slate-200/60 text-slate-600'
        }`}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className={`font-bold ${theme.textPrimary}`}>
              {daily[hoveredIndex].dayName}, {daily[hoveredIndex].formattedDate}:
            </span>
            <span className="font-semibold">
              High of {highTemps[hoveredIndex]}°{unit === 'fahrenheit' ? 'F' : 'C'} / Low of{' '}
              {lowTemps[hoveredIndex]}°{unit === 'fahrenheit' ? 'F' : 'C'}
            </span>
          </div>
          <span className="font-medium">
            Precipitation probability: <strong className={theme.textPrimary}>{daily[hoveredIndex].rainProbMax}%</strong>
          </span>
        </div>
      )}
    </div>
  );
};
