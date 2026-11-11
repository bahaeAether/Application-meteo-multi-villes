import { recupererMeteo } from "./api.js";
import { villes, WEATHER_CODES } from "./data.js";

const formulaireRecherche = document.querySelector("#recherche-formulaire");
const villeInput = document.querySelector("#ville-input");
const messageErreur = document.querySelector("#erreur");
const chargement = document.querySelector("#chargement");
const dialogHoraires = document.querySelector("#dialog-horaires");
const boutonFermer = document.querySelector("#fermer-dialog");

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

    afficherMeteoActuelle(ville, data);
    afficherPrevisions(data);
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

boutonFermer.addEventListener("click", function () {
  dialogHoraires.close();
});

dialogHoraires.addEventListener("click", function (event) {
  if (event.target === dialogHoraires) {
    dialogHoraires.close();
  }
});

function trouverVille(nomVille) {
  return villes.find(function (ville) {
    return ville.nom.toLowerCase() === nomVille.toLowerCase();
  });
}

function obtenirDescriptionMeteo(code) {
  const weatherObject = WEATHER_CODES[code];

  if (weatherObject) return weatherObject;

  return {
    description: "Conditions inconnues",
    icone: "❔",
  };
}

function afficherMeteoActuelle(ville, data) {
  const meteo = data.current;
  const unite = data.current_units;

  const condition = obtenirDescriptionMeteo(meteo.weather_code);

  document.querySelector("#ville-nom").textContent = ville.nom;

  document.querySelector("#icone-meteo").textContent = condition.icone;

  document.querySelector("#description-meteo").textContent =
    condition.description;

  document.querySelector("#temperature").textContent =
    meteo.temperature_2m + " " + unite.temperature_2m;

  document.querySelector("#humidite").textContent =
    meteo.relative_humidity_2m + " " + unite.relative_humidity_2m;

  document.querySelector("#vent").textContent =
    meteo.wind_speed_10m + " " + unite.wind_speed_10m;

  document.querySelector("#meteo-actuelle").hidden = false;
}

function afficherPrevisions(data) {
  const previsions = data.daily;
  const unite = data.daily_units;
  const conteneur = document.querySelector("#previsions");

  // Vider les anciennes prévisions
  conteneur.innerHTML = "";

  // Vérifier si les données sont disponibles
  if (!previsions || !previsions.time) {
    conteneur.textContent = "Prévisions indisponibles.";
    document.querySelector("#section-previsions").hidden = false;
    return;
  }

  // Parcourir les jours de prévision
  previsions.time.forEach(function (date, index) {
    const condition = obtenirDescriptionMeteo(previsions.weather_code[index]);

    // Formater la date en français
    const dateFormatee = new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "short",
    }).format(new Date(date + "T12:00:00"));

    // Créer la carte
    const carte = document.createElement("article");
    carte.classList.add("carte-prevision");
    carte.setAttribute("role", "button");
    carte.setAttribute("tabindex", "0");

    carte.addEventListener("click", function () {
      afficherHoraires(data, date);
    });

    carte.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        afficherHoraires(data, date);
      }
    });

    // Créer les éléments de la carte
    const jour = document.createElement("h3");
    jour.textContent = dateFormatee;

    const icone = document.createElement("p");
    icone.textContent = condition.icone;

    const description = document.createElement("p");
    description.textContent = condition.description;

    const temperatureMax = document.createElement("p");
    temperatureMax.textContent =
      "Max : " +
      (previsions.temperature_2m_max[index] ?? "Indisponible") +
      (previsions.temperature_2m_max[index] != null
        ? " " + unite.temperature_2m_max
        : "");

    const temperatureMin = document.createElement("p");
    temperatureMin.textContent =
      "Min : " +
      (previsions.temperature_2m_min[index] ?? "Indisponible") +
      (previsions.temperature_2m_min[index] != null
        ? " " + unite.temperature_2m_min
        : "");

    // Ajouter les éléments à la carte
    carte.append(jour, icone, description, temperatureMax, temperatureMin);

    // Ajouter la carte au conteneur
    conteneur.appendChild(carte);
  });

  // Afficher la section des prévisions
  document.querySelector("#section-previsions").hidden = false;
}

function afficherHoraires(data, dateSelectionnee) {
  const horaires = data.hourly;
  const unite = data.hourly_units;

  const titre = document.querySelector("#titre-horaires");
  const liste = document.querySelector("#liste-horaires");

  liste.innerHTML = "";

  if (!horaires || !horaires.time) {
    liste.textContent = "Prévisions horaires indisponibles.";
    dialogHoraires.showModal();
    return;
  }

  // Formater la date du titre
  const dateFormatee = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(dateSelectionnee + "T12:00:00"));

  titre.textContent = "Météo heure par heure - " + dateFormatee;

  // Parcourir les heures
  horaires.time.forEach(function (heure, index) {
    if (heure.startsWith(dateSelectionnee)) {
      const condition = obtenirDescriptionMeteo(horaires.weather_code[index]);

      // Créer la carte
      const carte = document.createElement("article");
      carte.classList.add("carte-horaire");

      // Heure
      const heureElement = document.createElement("h3");
      heureElement.textContent = heure.slice(11, 16);

      // Icône météo
      const icone = document.createElement("span");
      icone.classList.add("icone-horaire");
      icone.textContent = condition.icone;

      // Conteneur des informations
      const informations = document.createElement("div");
      informations.classList.add("informations-horaires");

      const description = document.createElement("p");
      description.classList.add("description-horaire");
      description.textContent = condition.description;

      const temperature = document.createElement("p");
      temperature.textContent =
        "Température : " +
        horaires.temperature_2m[index] +
        " " +
        unite.temperature_2m;

      const ressenti = document.createElement("p");
      ressenti.textContent =
        "Ressenti : " +
        horaires.apparent_temperature[index] +
        " " +
        unite.apparent_temperature;

      const nuages = document.createElement("p");
      nuages.textContent =
        "Nuages : " + horaires.cloud_cover[index] + " " + unite.cloud_cover;

      const vent = document.createElement("p");
      vent.textContent =
        "Vent : " + horaires.wind_speed_10m[index] + " " + unite.wind_speed_10m;

      informations.append(description, temperature, ressenti, nuages, vent);

      // Ajouter les éléments à la carte
      carte.append(heureElement, icone, informations);

      liste.appendChild(carte);
    }
  });

  dialogHoraires.showModal();
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
