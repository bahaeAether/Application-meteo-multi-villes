export async function rechercherVille(ville) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${ville.latitude}&longitude=${ville.longitude}&forecast_days=1&hourly=temperature_2m&hourly=cloud_cover&hourly=wind_speed_10m`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur lors de la communication avec l'API: ${response.status} (${response.statusText})`);
    }

    const data = await response.json();

    return data;
  }
  catch (error) {
    console.log(error);
  }
}
