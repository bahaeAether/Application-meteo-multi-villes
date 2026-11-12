export async function recupererMeteo(ville) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${ville.latitude}&longitude=${ville.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&hourly=temperature_2m,apparent_temperature,cloud_cover,wind_speed_10m,weather_code&forecast_days=5&timezone=auto`;

  const response = await fetch(url, {
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status} (${response.statusText})`);
  }

  const data = await response.json();

  return data;
}
