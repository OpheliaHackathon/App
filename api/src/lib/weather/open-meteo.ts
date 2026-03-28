export type WeatherCurrentResult = {
  city: string;
  country?: string;
  latitude: number;
  longitude: number;
  temperatureC: number;
  weatherCode: number;
  conditionIt: string;
  humidityPct?: number;
  windKmh?: number;
};

const WMO_WEATHER_LABELS_IT: Record<number, string> = {
  0: "Sereno",
  1: "Prevalentemente sereno",
  2: "Parzialmente nuvoloso",
  3: "Nuvoloso",
  45: "Nebbia",
  48: "Nebbia con brina",
  51: "Pioggia leggera",
  53: "Pioggia moderata",
  55: "Pioggia intensa",
  56: "Pioggia gelata leggera",
  57: "Pioggia gelata forte",
  61: "Pioggia leggera",
  63: "Pioggia moderata",
  65: "Pioggia forte",
  66: "Pioggia gelata leggera",
  67: "Pioggia gelata forte",
  71: "Neve leggera",
  73: "Neve moderata",
  75: "Neve intensa",
  77: "Granelli di ghiaccio",
  80: "Rovesci leggeri",
  81: "Rovesci moderati",
  82: "Rovesci violenti",
  85: "Rovesci di neve",
  86: "Forte nevicata a rovesci",
  95: "Temporale",
  96: "Temporale con grandine",
  99: "Temporale forte con grandine",
};

function labelForWmoCode(code: number): string {
  return WMO_WEATHER_LABELS_IT[code] ?? "Condizioni variabili";
}

type GeocodeHit = {
  name: string;
  latitude: number;
  longitude: number;
  country_code?: string;
};

type GeocodeResponse = {
  results?: GeocodeHit[];
};

type ForecastResponse = {
  current?: {
    temperature_2m?: number;
    weather_code?: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
  };
};

export async function fetchCurrentWeatherForCity(
  city: string,
): Promise<
  { ok: true; data: WeatherCurrentResult } | { ok: false; error: string }
> {
  const q = city.trim();
  if (q.length < 2) {
    return { ok: false, error: "Nome città troppo corto" };
  }

  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=it`;
  const geoRes = await fetch(geoUrl);
  if (!geoRes.ok) {
    return { ok: false, error: "Geocoding non riuscito" };
  }
  const geoJson = (await geoRes.json()) as GeocodeResponse;
  const hit = geoJson.results?.[0];
  if (!hit) {
    return { ok: false, error: `Città non trovata: ${q}` };
  }

  const lat = hit.latitude;
  const lon = hit.longitude;
  const forecastUrl =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m`;

  const fcRes = await fetch(forecastUrl);
  if (!fcRes.ok) {
    return { ok: false, error: "Previsione non disponibile" };
  }
  const fcJson = (await fcRes.json()) as ForecastResponse;
  const cur = fcJson.current;
  if (cur?.temperature_2m === undefined || cur?.weather_code === undefined) {
    return { ok: false, error: "Dati meteo incompleti" };
  }

  return {
    ok: true,
    data: {
      city: hit.name,
      country: hit.country_code,
      latitude: lat,
      longitude: lon,
      temperatureC: cur.temperature_2m,
      weatherCode: cur.weather_code,
      conditionIt: labelForWmoCode(cur.weather_code),
      humidityPct: cur.relative_humidity_2m,
      windKmh: cur.wind_speed_10m,
    },
  };
}
