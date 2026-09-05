import { CurrentWeather, DailyForecast, SmartPlanItem, TemperatureUnit } from '../types';
import { convertTemp } from '../services/weatherApi';

/**
 * Helper to join list of day names nicely: ["Tuesday", "Thursday"] => "Tuesday and Thursday"
 */
function joinDays(days: string[]): string {
  if (days.length === 0) return '';
  if (days.length === 1) return days[0];
  if (days.length === 2) return `${days[0]} and ${days[1]}`;
  return `${days.slice(0, -1).join(', ')}, and ${days[days.length - 1]}`;
}

/**
 * Generates natural plain-English smart planning advice based on 7-day weather data
 */
export function generateSmartPlanning(
  daily: DailyForecast[],
  current: CurrentWeather,
  unit: TemperatureUnit
): SmartPlanItem[] {
  if (!daily || daily.length === 0) {
    return [];
  }

  const items: SmartPlanItem[] = [];

  // 1. UMBRELLA & RAIN ADVISORY
  const rainyDays = daily.filter((d) => d.rainProbMax >= 35 || d.precipitationSum >= 1.0);
  if (rainyDays.length > 0) {
    const dayNames = rainyDays.map((d) => (d.dayName === 'Today' ? 'today' : d.dayName));
    const highestRainProb = Math.max(...rainyDays.map((d) => d.rainProbMax));
    const rainDaysText = joinDays(dayNames);

    items.push({
      id: 'rain-umbrella',
      category: 'umbrella',
      title: 'Umbrella & Rain Advisory',
      advice:
        rainyDays.length === 1
          ? `Rain is likely on ${rainDaysText} (${highestRainProb}% chance). Be sure to carry an umbrella and opt for waterproof shoes if you are heading out.`
          : `Wet weather is anticipated on ${rainDaysText}, with precipitation chance reaching up to ${highestRainProb}%. Keep a compact umbrella in your everyday bag and plan travel with extra time.`,
      impactDays: dayNames,
      severity: 'warning',
      icon: 'Umbrella',
    });
  } else {
    items.push({
      id: 'rain-umbrella',
      category: 'umbrella',
      title: 'Dry Skies All Week',
      advice: 'No significant rain is predicted across the entire 7-day outlook. Leave the umbrellas at home and enjoy uninterrupted dry days for travel and outdoor plans.',
      impactDays: ['All week'],
      severity: 'positive',
      icon: 'Sun',
    });
  }

  // 2. WEEKEND OUTLOOK
  const weekendDays = daily.filter((d) => d.isWeekend);
  if (weekendDays.length > 0) {
    const saturday = weekendDays.find((d) => d.dayName === 'Saturday' || d.shortDay === 'Sat');
    const sunday = weekendDays.find((d) => d.dayName === 'Sunday' || d.shortDay === 'Sun');

    const weekendRain = weekendDays.some((d) => d.rainProbMax >= 40);
    const avgWeekendTemp =
      weekendDays.reduce((acc, d) => acc + d.tempMax, 0) / weekendDays.length;
    const formattedAvgWeekendTemp = `${convertTemp(avgWeekendTemp, unit)}°${unit === 'fahrenheit' ? 'F' : 'C'}`;

    if (!weekendRain && avgWeekendTemp >= 16 && avgWeekendTemp <= 29) {
      items.push({
        id: 'weekend-outlook',
        category: 'weekend',
        title: 'Prime Weekend for Outdoor Plans',
        advice: `The upcoming weekend looks ideal! Both Saturday and Sunday will stay dry with daytime highs averaging ${formattedAvgWeekendTemp}. Perfect timing for picnics, outdoor dining, hiking, or sports.`,
        impactDays: weekendDays.map((d) => d.dayName),
        severity: 'positive',
        icon: 'CalendarHeart',
      });
    } else if (weekendRain) {
      let detail = '';
      if (saturday && sunday) {
        if (saturday.rainProbMax < 35 && sunday.rainProbMax >= 40) {
          detail = `Saturday is the drier pick with a high of ${convertTemp(saturday.tempMax, unit)}°, while Sunday brings a ${sunday.rainProbMax}% chance of rain. Schedule outdoor plans for Saturday!`;
        } else if (sunday.rainProbMax < 35 && saturday.rainProbMax >= 40) {
          detail = `Saturday may see rain (${saturday.rainProbMax}%), but Sunday clears up with a high of ${convertTemp(sunday.tempMax, unit)}°. Sunday is your best bet for being outside.`;
        } else {
          detail = `Both Saturday and Sunday have chances of rain showers (up to ${Math.max(saturday.rainProbMax, sunday.rainProbMax)}%). Great excuse for cozy indoor brunch, museum visits, or movie nights.`;
        }
      } else {
        detail = 'Showers are possible this weekend. Consider keeping indoor backup plans ready.';
      }

      items.push({
        id: 'weekend-outlook',
        category: 'weekend',
        title: 'Weekend Weather Watch',
        advice: detail,
        impactDays: weekendDays.map((d) => d.dayName),
        severity: 'warning',
        icon: 'Calendar',
      });
    } else {
      // Dry but either cool or hot
      const isChilly = avgWeekendTemp < 15;
      items.push({
        id: 'weekend-outlook',
        category: 'weekend',
        title: isChilly ? 'Crisp & Dry Weekend' : 'Warm Weekend Ahead',
        advice: isChilly
          ? `Dry weather ahead this weekend, but expect brisk temperatures averaging ${formattedAvgWeekendTemp}. Great for scenic walks or cozy coffee dates with a warm coat.`
          : `Warm and clear weekend ahead with highs around ${formattedAvgWeekendTemp}. Stay hydrated and enjoy the sunny weather outdoors.`,
        impactDays: weekendDays.map((d) => d.dayName),
        severity: 'info',
        icon: 'CalendarCheck',
      });
    }
  }

  // 3. BEST OUTDOOR DAY
  // Calculate best outdoor day score
  const scoredDays = daily.map((day) => {
    let score = 100;
    // Penalize rain heavily
    score -= day.rainProbMax * 0.9;
    // Penalize precipitation
    score -= day.precipitationSum * 8;
    // Ideal temperature is ~21°C (70°F)
    const tempDiff = Math.abs(day.tempMax - 21);
    score -= tempDiff * 2.2;
    // Penalize high wind
    if (day.windSpeedMax > 25) {
      score -= (day.windSpeedMax - 25) * 1.5;
    }
    // Bonus for clear/partly cloudy weather codes (0, 1, 2)
    if (day.weatherCode <= 2) {
      score += 10;
    }
    return { day, score };
  });

  scoredDays.sort((a, b) => b.score - a.score);
  const bestDay = scoredDays[0]?.day;

  if (bestDay) {
    const formattedBestHigh = `${convertTemp(bestDay.tempMax, unit)}°${unit === 'fahrenheit' ? 'F' : 'C'}`;
    const bestDayLabel = bestDay.dayName === 'Today' ? 'Today' : `${bestDay.dayName} (${bestDay.formattedDate})`;

    items.push({
      id: 'best-outdoor-day',
      category: 'outdoor',
      title: `Best Day Outside: ${bestDay.dayName}`,
      advice: `${bestDayLabel} stands out as the most pleasant day of the week with a top temperature of ${formattedBestHigh}, low rain likelihood (${bestDay.rainProbMax}%), and gentle breezes. Prioritize outdoor workouts, errands, or gardening for this day.`,
      impactDays: [bestDay.dayName],
      severity: 'positive',
      icon: 'Sparkles',
    });
  }

  // 4. CLOTHING & LAYERING ADVICE
  const avgHigh = daily.reduce((acc, d) => acc + d.tempMax, 0) / daily.length;
  const avgLow = daily.reduce((acc, d) => acc + d.tempMin, 0) / daily.length;
  const maxSwing = Math.max(...daily.map((d) => d.tempMax - d.tempMin));

  let clothingAdvice = '';
  let clothingTitle = 'Wardrobe & Layering Tips';
  let clothingIcon = 'Shirt';

  if (maxSwing >= 9) {
    clothingAdvice = `Substantial temperature swings between morning and afternoon (up to ${Math.round(maxSwing)}°C difference). Dressing in versatile layers—such as a jacket over a light shirt—ensures you stay comfortable throughout the day.`;
    clothingTitle = 'Layer Up for Daily Temp Swings';
    clothingIcon = 'Layers';
  } else if (avgHigh >= 27) {
    clothingAdvice = `Warm week ahead with afternoon highs averaging ${convertTemp(avgHigh, unit)}°${unit === 'fahrenheit' ? 'F' : 'C'}. Loose, breathable cotton or linen clothing, sunglasses, and a water bottle are recommended.`;
    clothingTitle = 'Light & Breathable Clothing';
    clothingIcon = 'Sun';
  } else if (avgHigh <= 10) {
    clothingAdvice = `Brisk conditions this week with highs hovering around ${convertTemp(avgHigh, unit)}°${unit === 'fahrenheit' ? 'F' : 'C'} and lows down to ${convertTemp(avgLow, unit)}°${unit === 'fahrenheit' ? 'F' : 'C'}. A warm insulated coat, scarf, and warm footwear are essential.`;
    clothingTitle = 'Bundle Up: Cold Temperatures';
    clothingIcon = 'Snowflake';
  } else {
    clothingAdvice = `Mild and steady weather across the week with highs averaging ${convertTemp(avgHigh, unit)}°${unit === 'fahrenheit' ? 'F' : 'C'}. A standard light jacket or knit sweater will comfortably carry you through most days.`;
    clothingTitle = 'Comfortable Transitional Wear';
    clothingIcon = 'Shirt';
  }

  items.push({
    id: 'clothing-advice',
    category: 'clothing',
    title: clothingTitle,
    advice: clothingAdvice,
    impactDays: ['All week'],
    severity: 'info',
    icon: clothingIcon,
  });

  // 5. SUN & UV PROTECTION
  const maxUV = Math.max(...daily.map((d) => d.uvIndexMax));
  if (maxUV >= 6) {
    const highUVDays = daily
      .filter((d) => d.uvIndexMax >= 6)
      .map((d) => (d.dayName === 'Today' ? 'today' : d.dayName));

    items.push({
      id: 'uv-alert',
      category: 'uv',
      title: 'High UV Alert',
      advice: `UV radiation peaks at ${maxUV} on ${joinDays(highUVDays)}. Sunburn can occur rapidly; apply SPF 30+ sunscreen, wear protective sunglasses, and seek shade during midday hours (11 AM – 3 PM).`,
      impactDays: highUVDays,
      severity: 'warning',
      icon: 'SunDim',
    });
  }

  // 6. WIND & BREEZE ADVISORY
  const windyDays = daily.filter((d) => d.windSpeedMax >= 32);
  if (windyDays.length > 0) {
    const maxWind = Math.max(...windyDays.map((d) => d.windSpeedMax));
    const windyDayNames = windyDays.map((d) => (d.dayName === 'Today' ? 'today' : d.dayName));

    items.push({
      id: 'wind-advisory',
      category: 'wind',
      title: 'Gusty Winds Expected',
      advice: `Noticeable wind gusts reaching up to ${Math.round(maxWind)} km/h are expected on ${joinDays(windyDayNames)}. Secure loose outdoor furniture or patio items, and wear a windbreaker if cycling or walking outdoors.`,
      impactDays: windyDayNames,
      severity: 'info',
      icon: 'Wind',
    });
  }

  return items;
}
