# Comparateur de Prix de Billets de Train

Une application web permettant de rechercher et comparer les prix des billets de train selon différentes dates et critères.

![Capture d'écran de l'application](screenshot.png)

## Fonctionnalités

- Recherche de billets entre différentes villes françaises
- Sélection de dates avec navigation facile (jour précédent/suivant)
- Affichage des horaires, durées et prix
- Tri des résultats par prix, heure de départ ou durée
- Filtrage par classe de voyage (Standard, Confort, Première classe)
- Interface responsive s'adaptant aux mobiles et ordinateurs

## Informations techniques

Cette application est construite avec:

- React 18
- Tailwind CSS pour le style
- Lucide React pour les icônes

## Installation

1. Clonez ce dépôt:
```bash
git clone https://github.com/votre-nom-utilisateur/comparateur-train.git
cd comparateur-train
```

2. Installez les dépendances:
```bash
npm install
```

3. Lancez l'application en mode développement:
```bash
npm start
```

L'application sera disponible à l'adresse [http://localhost:3000](http://localhost:3000)

## Déploiement

Pour déployer l'application vers GitHub Pages:

```bash
npm run deploy
```

## Remarque importante

Cette application utilise des données simulées pour démontrer la fonctionnalité. Dans une application réelle, il faudrait se connecter à une API de réservation de train (SNCF, Trainline, etc.) pour obtenir des données réelles sur les horaires et les prix.

## Licence

MIT