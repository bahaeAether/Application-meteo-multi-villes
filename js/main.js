import { rechercherVille } from "./api.js";
import { villes } from "./data.js";

const formulaireRecherche = document.querySelector("#recherche-formulaire");
const villeInput = document.querySelector("#ville-input");
const messageErreur = document.querySelector("#erreur");

formulaireRecherche.addEventListener("submit", async (event) => {
  event.preventDefault();

  const ville = villeInput.value.trim();

  if (ville === "") {
    messageErreur.textContent = "Veuillez saisir le nom d'une ville.";
    messageErreur.hidden = false;
    return;
  }
  if (rechercheVille(ville) === undefined) {
    messageErreur.textContent = "Le nom de la ville que vous avez saisi n'est pas valable.";
    messageErreur.hidden = false;
    return;
  }

  messageErreur.hidden = true;

  try {
    const data = await rechercherVille(rechercheVille(ville));

    console.log("Réponse de l'API :", data);
  } catch (error) {
    console.error(error);
  }
  finally {
    console.log("request Done!");
  }
});

function rechercheVille(cityName) {
  return villes.find(ville => ville.nom.toLowerCase() === cityName.toLowerCase());
}


// const villes = [
//   "nador",
//   "agadir",
//   "laayoune",
//   "dakhla",
//   "marrakech",
//   "casablanca",
//   "rabat",
//   "tanger",
//   "Tétouan",
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
//   "ouarzazate"
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

//       if (ville === "tanger") console.log(data);


//       // Chercher le résultat correspondant au Maroc
//       let resultatMaroc = data.results.find(function(resultat) {
//         return resultat.country_code === "MA" || resultat.country_code === "EH";
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
