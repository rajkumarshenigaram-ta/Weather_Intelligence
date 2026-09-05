import React from 'react';
import {
  Umbrella,
  Calendar,
  CalendarCheck,
  CalendarHeart,
  Sparkles,
  Shirt,
  Layers,
  Wind,
  LucideProps,
} from 'lucide-react';

interface WeatherIconProps extends LucideProps {
  name: string;
  className?: string;
  animated?: boolean;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  name,
  className = 'w-8 h-8',
  animated = false,
  ...props
}) => {
  // Custom multi-layer SVG weather illustrations
  switch (name) {
    case 'Sun':
      return (
        <svg
          viewBox="0 0 64 64"
          className={`${className} overflow-visible ${animated ? 'weather-glow' : ''}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <defs>
            <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ea580c" />
            </radialGradient>
            <linearGradient id="rayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <filter id="sunGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Sun Rays */}
          <g stroke="url(#rayGrad)" strokeWidth="3" strokeLinecap="round">
            <line x1="32" y1="6" x2="32" y2="14" />
            <line x1="32" y1="50" x2="32" y2="58" />
            <line x1="6" y1="32" x2="14" y2="32" />
            <line x1="50" y1="32" x2="58" y2="32" />
            <line x1="13.6" y1="13.6" x2="19.3" y2="19.3" />
            <line x1="44.7" y1="44.7" x2="50.4" y2="50.4" />
            <line x1="13.6" y1="50.4" x2="19.3" y2="44.7" />
            <line x1="44.7" y1="19.3" x2="50.4" y2="13.6" />
          </g>
          {/* Sun Core */}
          <circle cx="32" cy="32" r="14" fill="url(#sunGrad)" filter="url(#sunGlow)" />
        </svg>
      );

    case 'SunMedium':
    case 'SunDim':
      return (
        <svg
          viewBox="0 0 64 64"
          className={`${className} overflow-visible`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <defs>
            <radialGradient id="sunMedGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="70%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="16" fill="url(#sunMedGrad)" />
          <circle cx="32" cy="32" r="22" stroke="#fde047" strokeWidth="2" strokeDasharray="4 6" opacity="0.8" />
        </svg>
      );

    case 'Moon':
      return (
        <svg
          viewBox="0 0 64 64"
          className={`${className} overflow-visible ${animated ? 'weather-glow' : ''}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <defs>
            <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0e7ff" />
              <stop offset="50%" stopColor="#a5b4fc" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
            <filter id="moonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <path
            d="M44 38.5C42.2 46.8 34.3 52.8 25 51.5C14.8 50.1 7.2 40.5 8.1 30.2C8.9 20.8 17.5 13.7 26.8 14C23.5 17.8 22.2 23.3 23.5 28.5C25.4 36.1 32.9 40.5 40.5 39.5C41.7 39.3 42.9 38.9 44 38.5Z"
            fill="url(#moonGrad)"
            filter="url(#moonGlow)"
          />
          {/* Subtle stars */}
          <path d="M46 14L47.5 18L51.5 19.5L47.5 21L46 25L44.5 21L40.5 19.5L44.5 18Z" fill="#c7d2fe" opacity="0.9" />
          <path d="M53 32L54 34.5L56.5 35.5L54 36.5L53 39L52 36.5L49.5 35.5L52 34.5Z" fill="#e0e7ff" opacity="0.75" />
        </svg>
      );

    case 'CloudSun':
      return (
        <svg
          viewBox="0 0 64 64"
          className={`${className} overflow-visible`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <defs>
            <radialGradient id="partialSunGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="80%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ea580c" />
            </radialGradient>
            <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <filter id="cloudShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.15" />
            </filter>
          </defs>
          {/* Peeking Sun */}
          <circle cx="42" cy="22" r="11" fill="url(#partialSunGrad)" />
          {/* Fluffy Cloud */}
          <path
            d="M20 48H45C50.5 48 55 43.5 55 38C55 32.8 51 28.5 46 28.1C44.8 20.3 38.1 14.5 30 14.5C21.4 14.5 14.4 20.9 13.4 29.3C8.7 30.6 5.5 35 5.5 40C5.5 44.4 12 48 20 48Z"
            fill="url(#cloudGrad)"
            filter="url(#cloudShadow)"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
        </svg>
      );

    case 'CloudMoon':
      return (
        <svg
          viewBox="0 0 64 64"
          className={`${className} overflow-visible`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <defs>
            <linearGradient id="moonBehindGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0e7ff" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
            <linearGradient id="nightCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>
          {/* Moon Behind */}
          <path
            d="M48 20C47.2 24.5 43.2 27.8 38.5 27C33.4 26.2 29.6 21.4 30 16.3C30.4 11.6 34.7 8.1 39.4 8.2C37.8 10.1 37.1 12.8 37.8 15.4C38.7 19.2 42.5 21.4 46.3 20.9C46.9 20.8 47.5 20.6 48 20Z"
            fill="url(#moonBehindGrad)"
          />
          {/* Cloud */}
          <path
            d="M20 50H45C50.5 50 55 45.5 55 40C55 34.8 51 30.5 46 30.1C44.8 22.3 38.1 16.5 30 16.5C21.4 16.5 14.4 22.9 13.4 31.3C8.7 32.6 5.5 37 5.5 42C5.5 46.4 12 50 20 50Z"
            fill="url(#nightCloudGrad)"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.5"
          />
        </svg>
      );

    case 'Cloud':
      return (
        <svg
          viewBox="0 0 64 64"
          className={`${className} overflow-visible`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <defs>
            <linearGradient id="overcastGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="60%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <linearGradient id="backCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
          </defs>
          {/* Background darker cloud */}
          <path
            d="M28 42H48C53 42 57 38 57 33C57 28.3 53.4 24.5 48.9 24.1C47.8 17 41.8 11.8 34.5 11.8C26.8 11.8 20.4 17.6 19.5 25.2C15.3 26.3 12.4 30.3 12.4 34.8C12.4 38.8 18.2 42 28 42Z"
            fill="url(#backCloudGrad)"
            opacity="0.6"
          />
          {/* Foreground cloud */}
          <path
            d="M20 50H45C50.5 50 55 45.5 55 40C55 34.8 51 30.5 46 30.1C44.8 22.3 38.1 16.5 30 16.5C21.4 16.5 14.4 22.9 13.4 31.3C8.7 32.6 5.5 37 5.5 42C5.5 46.4 12 50 20 50Z"
            fill="url(#overcastGrad)"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
        </svg>
      );

    case 'CloudFog':
      return (
        <svg
          viewBox="0 0 64 64"
          className={`${className} overflow-visible`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <defs>
            <linearGradient id="fogGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#64748b" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path
            d="M22 34H44C48 34 51 31 51 27C51 23.2 48.2 20.2 44.5 19.9C43.5 13.7 38.2 9 32 9C25.1 9 19.5 14.1 18.7 20.8C15 21.8 12.5 25.3 12.5 29C12.5 32.5 16 34 22 34Z"
            fill="#cbd5e1"
            opacity="0.8"
          />
          {/* Fog bands */}
          <line x1="12" y1="42" x2="52" y2="42" stroke="url(#fogGrad)" strokeWidth="3" strokeLinecap="round" />
          <line x1="16" y1="48" x2="48" y2="48" stroke="url(#fogGrad)" strokeWidth="3" strokeLinecap="round" />
          <line x1="22" y1="54" x2="42" y2="54" stroke="url(#fogGrad)" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'CloudDrizzle':
    case 'CloudRain':
    case 'CloudRainWind':
      return (
        <svg
          viewBox="0 0 64 64"
          className={`${className} overflow-visible ${animated ? 'weather-glow' : ''}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <defs>
            <linearGradient id="rainCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="60%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <linearGradient id="dropGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          <path
            d="M18 38H44C49 38 53 34 53 29C53 24.3 49.4 20.5 44.9 20.1C43.8 13 37.8 8 30.5 8C22.8 8 16.4 13.8 15.5 21.4C11.3 22.5 8.4 26.5 8.4 31C8.4 35 12 38 18 38Z"
            fill="url(#rainCloudGrad)"
            stroke="#ffffff"
            strokeWidth="1.2"
          />
          {/* Rain Drops */}
          <line x1="20" y1="44" x2="16" y2="54" stroke="url(#dropGrad)" strokeWidth="3" strokeLinecap="round" />
          <line x1="30" y1="43" x2="26" y2="57" stroke="url(#dropGrad)" strokeWidth="3" strokeLinecap="round" />
          <line x1="40" y1="44" x2="36" y2="54" stroke="url(#dropGrad)" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'CloudLightning':
      return (
        <svg
          viewBox="0 0 64 64"
          className={`${className} overflow-visible ${animated ? 'weather-glow' : ''}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <defs>
            <linearGradient id="stormCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <filter id="boltGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>
          <path
            d="M18 36H44C49 36 53 32 53 27C53 22.3 49.4 18.5 44.9 18.1C43.8 11 37.8 6 30.5 6C22.8 6 16.4 11.8 15.5 19.4C11.3 20.5 8.4 24.5 8.4 29C8.4 33 12 36 18 36Z"
            fill="url(#stormCloudGrad)"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.2"
          />
          {/* Lightning Bolt */}
          <polygon
            points="32,32 23,45 31,45 27,58 41,41 33,41"
            fill="url(#boltGrad)"
            filter="url(#boltGlow)"
          />
        </svg>
      );

    case 'CloudSnow':
    case 'Snowflake':
      return (
        <svg
          viewBox="0 0 64 64"
          className={`${className} overflow-visible`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <defs>
            <linearGradient id="snowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="50%" stopColor="#7dd3fc" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
          <g stroke="url(#snowGrad)" strokeWidth="2.5" strokeLinecap="round">
            {/* 3 Main Axis */}
            <line x1="32" y1="12" x2="32" y2="52" />
            <line x1="15" y1="22" x2="49" y2="42" />
            <line x1="15" y1="42" x2="49" y2="22" />
            {/* Crystals */}
            <path d="M28 16L32 12L36 16" />
            <path d="M28 48L32 52L36 48" />
            <path d="M19 21L15 22L16 27" />
            <path d="M45 43L49 42L48 37" />
            <path d="M19 43L15 42L16 37" />
            <path d="M45 21L49 22L48 27" />
          </g>
          <circle cx="32" cy="32" r="3.5" fill="#38bdf8" />
        </svg>
      );

    case 'Wind':
      return <Wind className={className} {...props} />;
    case 'Umbrella':
      return <Umbrella className={className} {...props} />;
    case 'Calendar':
      return <Calendar className={className} {...props} />;
    case 'CalendarCheck':
      return <CalendarCheck className={className} {...props} />;
    case 'CalendarHeart':
      return <CalendarHeart className={className} {...props} />;
    case 'Sparkles':
      return <Sparkles className={className} {...props} />;
    case 'Shirt':
      return <Shirt className={className} {...props} />;
    case 'Layers':
      return <Layers className={className} {...props} />;
    default:
      return (
        <svg
          viewBox="0 0 64 64"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <circle cx="32" cy="32" r="16" fill="#38bdf8" opacity="0.8" />
        </svg>
      );
  }
};
