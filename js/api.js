export async function rechercherVille(ville) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(ville)}&count=5&language=fr&format=json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Erreur lors de la communication avec l'API.");
  }

  const data = await response.json();

  return data;
}
