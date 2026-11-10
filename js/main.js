import { recupererMeteo } from "./api.js";
import { villes } from "./data.js";

const formulaireRecherche = document.querySelector("#recherche-formulaire");
const villeInput = document.querySelector("#ville-input");
const messageErreur = document.querySelector("#erreur");
const chargement = document.querySelector("#chargement");

function trouverVille(nomVille) {
  return villes.find(function (ville) {
    return ville.nom.toLowerCase() === nomVille.toLowerCase();
  });
}

formulaireRecherche.addEventListener("submit", async function (event) {
  event.preventDefault();

  const nomVille = villeInput.value.trim();

  if (nomVille === "") {
    messageErreur.textContent = "Veuillez saisir le nom d'une ville.";
    messageErreur.hidden = false;
    return;
  }

  const ville = trouverVille(nomVille);

  if (!ville) {
    messageErreur.textContent =
      "Cette ville n'est pas disponible dans notre liste.";
    messageErreur.hidden = false;
    return;
  }

  messageErreur.hidden = true;
  chargement.hidden = false;

  try {
    const data = await recupererMeteo(ville);

    console.log("Ville :", ville.nom);
    console.log("Données météo :", data);
  } catch (error) {
    messageErreur.textContent =
      "Impossible de récupérer les données météo. Veuillez réessayer.";
    messageErreur.hidden = false;

    console.error(error);
  } finally {
    chargement.hidden = true;
  }
});













// const villes = [
//   "nador",
//   "agadir",
//   "laayoune",
//   "dakhla",
//   "marrakech",
//   "casablanca",
//   "rabat",
//   "tanger",
//   "tetouane",
//   "oujda",
//   "kenitra",
//   "meknes",
//   "fes",
//   "mohammedia",
//   "el jadida",
//   "settat",
//   "safi",
//   "youssoufia",
//   "beni mellal",
//   "taza",
//   "ouarzazate",
//   "essaouira"
// ];

// async function recupererCoordonnees() {
//   const resultats = await Promise.all(
//     villes.map(async function(ville) {
//       const url =
//         `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(ville)}&count=5&language=fr&format=json`;

//       const response = await fetch(url);

//       if (!response.ok) {
//         throw new Error("Erreur HTTP pour " + ville);
//       }

//       const data = await response.json();

//       if (!data.results) {
//         return {
//           ville: ville,
//           latitude: null,
//           longitude: null,
//           pays: "Aucun résultat"
//         };
//       }

//       // Chercher le résultat correspondant au Maroc
//       let resultatMaroc = data.results.find(function(resultat) {
//         return resultat.country_code === "MA";
//       });

//       if (!resultatMaroc) {
//         return {
//           ville: ville,
//           latitude: null,
//           longitude: null,
//           pays: "Maroc introuvable"
//         };
//       }

//       return {
//         ville: resultatMaroc.name,
//         latitude: resultatMaroc.latitude,
//         longitude: resultatMaroc.longitude,
//         pays: resultatMaroc.country
//       };
//     })
//   );

//   console.table(resultats);
//   return resultats;
// }

// recupererCoordonnees();
