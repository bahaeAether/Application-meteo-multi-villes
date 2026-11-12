import { recupererMeteo } from "./api.js";
import { villes, WEATHER_CODES } from "./data.js";

const formulaireRecherche = document.querySelector("#recherche-formulaire");
const villeInput = document.querySelector("#ville-input");
const messageErreur = document.querySelector("#erreur");
const chargement = document.querySelector("#chargement");
const dialogHoraires = document.querySelector("#dialog-horaires");
const boutonFermer = document.querySelector("#fermer-dialog");
const boutonActualiser = document.querySelector("#bouton-actualiser");

formulaireRecherche.addEventListener("submit", async function (event) {
  event.preventDefault();
  masquerAnciennesDonnees();
  boutonActualiser.hidden = true;

  const nomVille = villeInput.value.trim();

  if (nomVille === "") {
    afficherErreur("Veuillez saisir le nom d'une ville.");
    return;
  }

  const ville = trouverVille(nomVille);

  if (!ville) {
    afficherErreur("Cette ville n'est pas disponible dans notre liste.");
    return;
  }

  await rechercherMeteo(ville);
});

boutonActualiser.addEventListener("click", function () {
  const nomVille = villeInput.value.trim();
  const ville = trouverVille(nomVille);

  if (ville) {
    rechercherMeteo(ville);
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

async function rechercherMeteo(ville) {
  messageErreur.hidden = true;
  masquerAnciennesDonnees();
  boutonActualiser.hidden = true;
  chargement.hidden = false;

  try {
    const data = await recupererMeteo(ville);
    if (!data.current) {
      throw new Error("Données météo actuelles indisponibles.");
    }
    if (!data.daily || !data.daily.time) {
      throw new Error("Prévisions météo indisponibles.");
    }

    afficherMeteoActuelle(ville, data);
    afficherPrevisions(data);

    console.log(data);
  } catch (error) {
    console.error(error);
    boutonActualiser.hidden = false;

    if (!navigator.onLine) {
      afficherErreur("Vérifiez votre connexion Internet.");
    } else if (error.message.startsWith("Erreur API")) {
      afficherErreur(
        "Le service météo est temporairement indisponible : " + error,
      );
    } else if (error.message.includes("indisponibles")) {
      afficherErreur("Les données météo demandées sont indisponibles.");
    } else {
      afficherErreur("Une erreur est survenue. Veuillez réessayer.");
    }
  } finally {
    chargement.hidden = true;
  }
}

function trouverVille(nomVille) {
  return villes.find(function (ville) {
    return ville.nom.toLowerCase() === nomVille.toLowerCase();
  });
}

function afficherErreur(message) {
  messageErreur.textContent = message;
  messageErreur.hidden = false;
}

function obtenirDescriptionMeteo(code, nuit = false) {
  const weatherObject = WEATHER_CODES[code];

  if (!weatherObject) {
    return {
      description: "Conditions inconnues",
      icone: "❔",
    };
  }

  return {
    description: weatherObject.description,
    icone: nuit
      ? weatherObject.iconeNuit || weatherObject.icone
      : weatherObject.icone,
  };
}

function estLaNuit(dateHeure, daily) {
  const date = dateHeure.slice(0, 10);

  const index = daily.time.indexOf(date);

  if (index === -1 || !daily.sunrise[index] || !daily.sunset[index]) {
    return false;
  }

  const sunrise = daily.sunrise[index];
  const sunset = daily.sunset[index];

  return dateHeure < sunrise || dateHeure >= sunset;
}

function afficherMeteoActuelle(ville, data) {
  const meteo = data.current;
  const unite = data.current_units;

  const nuit = estLaNuit(meteo.time, data.daily);
  const condition = obtenirDescriptionMeteo(meteo.weather_code, nuit);

  document.querySelector("#ville-nom").textContent = ville.nom;

  document.querySelector("#icone-meteo").textContent = condition.icone;

  document.querySelector("#description-meteo").textContent =
    condition.description;

  document.querySelector("#temperature").textContent =
    (meteo.temperature_2m ?? "Indisponible") +
    (meteo.temperature_2m != null ? " " + unite.temperature_2m : "");

  document.querySelector("#humidite").textContent =
    (meteo.relative_humidity_2m ?? "Indisponible") +
    (meteo.relative_humidity_2m != null
      ? " " + unite.relative_humidity_2m
      : "");

  document.querySelector("#vent").textContent =
    (meteo.wind_speed_10m ?? "Indisponible") +
    (meteo.wind_speed_10m != null ? " " + unite.wind_speed_10m : "");

  document.querySelector("#meteo-actuelle").hidden = false;
}

function afficherPrevisions(data) {
  const previsions = data.daily;
  const unite = data.daily_units;
  const conteneur = document.querySelector("#previsions");

  conteneur.innerHTML = "";

  if (!previsions || !previsions.time) {
    conteneur.textContent = "Prévisions indisponibles.";
    document.querySelector("#section-previsions").hidden = false;
    return;
  }

  previsions.time.forEach(function (date, index) {
    const condition = obtenirDescriptionMeteo(previsions.weather_code[index]);

    const dateFormatee = new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "short",
    }).format(new Date(date + "T12:00:00"));

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

    carte.append(jour, icone, description, temperatureMax, temperatureMin);

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

  const dateFormatee = new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(dateSelectionnee + "T12:00:00"));

  titre.textContent = "Météo heure par heure - " + dateFormatee;

  horaires.time.forEach(function (heure, index) {
    if (heure.startsWith(dateSelectionnee)) {
      const nuit = estLaNuit(heure, data.daily);

      const condition = obtenirDescriptionMeteo(
        horaires.weather_code[index],
        nuit,
      );

      const carte = document.createElement("article");
      carte.classList.add("carte-horaire");

      const heureElement = document.createElement("h3");
      heureElement.textContent = heure.slice(11, 16);

      const icone = document.createElement("span");
      icone.classList.add("icone-horaire");
      icone.textContent = condition.icone;

      const informations = document.createElement("div");
      informations.classList.add("informations-horaires");

      const description = document.createElement("p");
      description.classList.add("description-horaire");
      description.textContent = condition.description;

      const temperature = document.createElement("p");
      temperature.textContent =
        "Température : " +
        (horaires.temperature_2m[index] ?? "Indisponible") +
        (horaires.temperature_2m[index] != null
          ? " " + unite.temperature_2m_max
          : "");

      const ressenti = document.createElement("p");
      ressenti.textContent =
        "Ressenti : " +
        (horaires.apparent_temperature[index] ?? "Indisponible") +
        (unite.apparent_temperature[index] != null
          ? " " + unite.apparent_temperature
          : "");

      const nuages = document.createElement("p");
      nuages.textContent =
        "Nuages : " +
        (horaires.cloud_cover[index] ?? "Indisponible") +
        (unite.cloud_cover[index] != null ? " " + unite.cloud_cover : "");

      const vent = document.createElement("p");
      vent.textContent =
        "Vent : " +
        (horaires.wind_speed_10m[index] ?? "Indisponible") +
        (unite.wind_speed_10m[index] != null ? " " + unite.wind_speed_10m : "");

      informations.append(description, temperature, ressenti, nuages, vent);

      carte.append(heureElement, icone, informations);

      liste.appendChild(carte);
    }
  });

  dialogHoraires.showModal();
}

function masquerAnciennesDonnees() {
  document.querySelector("#meteo-actuelle").hidden = true;
  document.querySelector("#section-previsions").hidden = true;

  dialogHoraires.close();
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
