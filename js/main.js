import { rechercherVille } from "./api.js";

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

  messageErreur.hidden = true;

  try {
    const data = await rechercherVille(ville);

    console.log("Réponse de l'API :", data);

  } catch (error) {
    console.error(error);
  }

});
