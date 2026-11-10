export async function recupererMeteo(ville) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${ville.latitude}&longitude=${ville.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=5`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Erreur API : ${response.status} (${response.statusText})`,
    );
  }

  const data = await response.json();

  return data;
}
