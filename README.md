# Weather Intelligence

A modern, responsive weather and weekly planning web application built with **React**, **Vite**, **Tailwind CSS**, and **Open-Meteo APIs**. It delivers real-time weather metrics, 7-day forecasts, temperature trend visualizations, and actionable plain-English planning advice without requiring external API keys.

---

## Overview

Weather Intelligence helps users plan their week around upcoming weather conditions. All weather and geocoding queries are executed entirely client-side via Open-Meteo's open-access endpoints, eliminating the need for API keys or secret environment variables. The interface features a glassmorphic design with dynamic background gradients that adapt automatically to the active weather conditions (golden amber for clear skies, cool cyan/blue for rain, deep slate for storms or nighttime).

---

## Features

- **Validated City Search & Suggestions**:
  - Real-time debounced autocomplete using Open-Meteo's Geocoding API.
  - Robust validation filtering out random keyboard mashing (e.g., `asdfghjkl`, `qwerty`), numbers without letters (`12345`), and vowelless noise.
  - Levenshtein distance string similarity, multi-word token matching, and population thresholds to prevent selecting unintended fuzzy matches.
  - Keeps the searched city name visible inside the input field after selection.
- **Current Weather Metrics**:
  - Real-time temperature with one-click Celsius (`°C`) and Fahrenheit (`°F`) conversion.
  - WMO weather code descriptions and custom weather condition iconography.
  - Core environmental vitals: Apparent ("feels like") temperature, relative humidity, wind speed, UV index, and precipitation probability.
- **7-Day Interactive Forecast Cards**:
  - High and low daily temperatures.
  - Precipitation probability badges and weather condition labels.
  - Clickable daily cards to inspect detailed conditions for any day of the coming week.
- **7-Day Temperature Trend Chart**:
  - Polished SVG area and spline chart displaying high and low temperature trajectories.
  - Smooth curved lines, translucent gradient fills, and date/temperature tooltips.
- **Smart Planning Advice**:
  - Rule-based planning engine that translates raw forecast data into plain-English advice.
  - Highlights umbrella reminders for rain, jacket alerts for cold snaps, outdoor-friendly days, and high UV warnings.
- **Weather-Adaptive Dynamic Theming**:
  - Ambient glassmorphic backgrounds that automatically shift lighting and palette to match current weather (Clear, Cloudy, Rainy, Stormy, Snow, Night).
  - Manual theme preview switcher to inspect different visual states.

---

## AI Studio to GitHub & Cloudflare Deployment Guide

This project can be edited in **Google AI Studio**, committed to **GitHub**, and automatically deployed to **Cloudflare Pages**.

### 1. Exporting from Google AI Studio to GitHub
1. In the Google AI Studio project interface, open the application menu / settings.
2. Select **Export to GitHub** (or connect your GitHub account if prompted).
3. Choose your repository name (e.g., `weather-intelligence`) and push the project.
4. Alternatively, download the project as a ZIP archive, initialize a local Git repository, and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Weather Intelligence app"
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```

### 2. Deploying on Cloudflare Pages
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages**.
2. Click **Create Application** and select the **Pages** tab.
3. Click **Connect to Git** and authorize your GitHub account.
4. Select the repository you just pushed.
5. In the **Set up builds and deployments** configuration screen:
   - **Project name**: `weather-intelligence` (or your preferred name)
   - **Production branch**: `main`
   - **Framework preset**: `Vite` (or `None`)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave blank or default)
6. Under **Environment variables** (optional), ensure Node.js is modern (e.g., `NODE_VERSION = 18` or higher).
7. Click **Save and Deploy**. Cloudflare Pages will install dependencies, execute `npm run build`, and serve the static files from `dist/` across its global edge network.
8. **Continuous Deployment**: Any subsequent commits pushed to your `main` branch on GitHub will automatically trigger a new Cloudflare Pages deployment.

---

## Local Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher recommended)
- `npm` (bundled with Node.js)

### Installation & Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
   cd <your-repo-name>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser to `http://localhost:3000` to view the application.

4. **Type-check and lint**:
   ```bash
   npm run lint
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```
   The production-ready assets will be compiled into the `dist/` directory.

6. **Preview production build locally**:
   ```bash
   npm run preview
   ```

---

## State Persistence & Error Handling Notes

### State Persistence Across Reloads
- **URL Parameter Synchronization**:
  - When a city is selected, the application updates the browser's address bar with `?city=<CityName>` (e.g., `?city=London`) via `window.history.replaceState` without triggering a full page refresh.
  - Browser back/forward navigation is supported via a `popstate` event listener, synchronizing the loaded forecast with the URL history.
- **LocalStorage Caching**:
  - The currently selected city name and geographic coordinates are persisted to `localStorage` under `weather_active_city_name` and `weather_active_location`.
- **Initialization Hierarchy on Page Load / Refresh**:
  1. **URL Query Parameter**: Checks `window.location.search` for `?city=...`. If found, fetches weather for that city.
  2. **LocalStorage Location**: If no URL parameter is present, checks for cached coordinates in `localStorage`.
  3. **LocalStorage City Name**: If only a city name string was stored, queries the geocoding service for matching coordinates.
  4. **Fallback Default**: If no prior state exists, defaults smoothly to London, England, UK (`DEFAULT_CITY`).
- **Input Field Persistence**:
  - When the user selects or searches for a city, the city name remains visible inside the search bar input after the forecast loads, rather than clearing out. A clear button (`X`) is provided to reset the input when desired.

### Error Handling & Validation
- **Rejection of Gibberish & Invalid Queries**:
  - The Open-Meteo Geocoding API uses loose matching that can return obscure hamlets for random keystrokes (e.g., `12345` or `asdfghjkl`).
  - The application intercepts searches using heuristics:
    - Verifies that the query contains alphabetic characters and isn't solely numbers or symbols.
    - Checks for keyboard walk patterns (`asdf`, `qwerty`, `zxcv`, etc.) and vowel presence.
    - Uses Levenshtein edit distance and word token overlap to ensure the returned city name closely resembles what the user typed.
    - Requires high population thresholds for short 3-letter prefix matches to avoid unpopulated landmarks.
- **Friendly Error State**:
  - If a city cannot be found, network requests fail, or the query is invalid, the app triggers a clean error state (`ErrorMessage.tsx`) displaying:
    - `"City not found, please try again"`
    - Helpful recovery actions: a **Try Searching Again** button and one-click chips for popular global cities (San Francisco, London, Tokyo, New York, Paris).
  - Previous valid weather data is preserved in memory so users do not encounter broken or empty screens.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Weather Data**: [Open-Meteo Weather & Geocoding APIs](https://open-meteo.com/) (Free, open-source, no API keys required)
