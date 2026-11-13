# Tableau de bord météo — Open-Meteo

## Présentation du projet

**Tableau de bord météo** est une application web qui permet de consulter les conditions météorologiques actuelles et les prévisions des prochains jours pour plusieurs villes marocaines.

L'application utilise l'API publique **Open-Meteo** pour récupérer les données météorologiques en temps réel et les afficher dans une interface simple et intuitive.

Ce projet a été réalisé dans le cadre d'un projet individuel de cinq jours, avec pour objectif de pratiquer l'utilisation de l'API Fetch en JavaScript.

## Fonctionnalités

- Rechercher une ville parmi une liste de villes marocaines disponibles.
- Consulter les conditions météorologiques actuelles :
  - Température
  - Humidité relative
  - Vitesse du vent
  - Description et icône météo
- Consulter les prévisions météorologiques journalières sur cinq jours.
- Cliquer sur une carte journalière pour afficher les prévisions heure par heure.
- Adapter les icônes météo aux conditions de jour et de nuit.
- Afficher un indicateur de chargement pendant les requêtes.
- Gérer les erreurs de recherche, de connexion et de réponse de l'API.
- Relancer une requête sans recharger la page.
- Interrompre automatiquement une requête qui dépasse le délai d'attente prévu.

## villes supportées

L'application permet actuellement de consulter la météo de 22 villes marocaines :

- Agadir
- Beni Mellal
- Casablanca
- Dakhla
- El Jadida
- Essaouira
- Fes
- Kenitra
- Laayoune
- Marrakech
- Meknes
- Mohammedia
- Nador
- Ouarzazate
- Oujda
- Rabat
- Safi
- Settat
- Tanger
- Taza
- Tetouan
- Youssoufia

La recherche est limitée à cette liste prédéfinie. Les noms des villes doivent correspondre aux villes disponibles dans l'application.

## Technologies utilisées

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Fetch API
- Open-Meteo API

## API utilisée

Le projet utilise l'API publique **Open-Meteo**, qui fournit des données météorologiques sans nécessiter de clé API pour cet usage.

Endpoint utilisé :

`https://api.open-meteo.com/v1/forecast`

Les données récupérées comprennent :

- Les conditions météorologiques actuelles.
- Les prévisions journalières.
- Les prévisions horaires.
- Les heures de lever et de coucher du soleil.

La localisation est définie à partir des coordonnées géographiques de chaque ville. Le paramètre `timezone=auto` permet d'obtenir les horaires correspondant au fuseau horaire local.

Documentation officielle : https://open-meteo.com/en/docs

## Structure du projet

```text
tableau-meteo/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── api.js
│   └── data.js
└── README.md
```

## Gestion des erreurs

L'application prend en charge plusieurs situations :

- Champ de recherche vide.
- Ville non disponible dans la liste.
- Problème de connexion Internet.
- Erreur provenant de l'API.
- Données météorologiques indisponibles.
- Délai d'attente dépassé.

Un bouton permet de relancer la requête avec la même ville sans actualiser la page.

## Limites et améliorations possibles

- La recherche est limitée aux villes présentes dans la liste locale.
- L'application dépend de la disponibilité du service Open-Meteo.
- Une recherche dynamique de villes avec l'API Geocoding pourrait être ajoutée ultérieurement.

## Captures d'écran

*Les captures d'écran de l'application seront ajoutées dans cette section.*

## Board Trello

[Tableau de bord météo | Trello](https://trello.com/invite/b/6af1afde7cd953a53b1b0c7a/ATTI2b097cb6eef4e1a13f37a2989edde4388081D808/tableau-de-bord-meteo-open-meteo)

## Site en ligne

[Tableau de bord météo](https://bahaeaether.github.io/Application-meteo-multi-villes/)
