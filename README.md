Projet 2 - Tableau de bord des jeux olympiques

Ce projet est une application Angular permettant d’afficher et d’analyser les performances des pays ayant participé aux Jeux Olympiques.

# Fonctionnalités principales

✔ Dashboard principal :

    Affiche le nombre total de JO organisés
    Indique le nombre de pays participants
    Représente la répartition des médailles par pays sous forme de Pie Chart (ngx-charts)
    Permet de cliquer sur un pays pour voir ses détails

✔ Page de détails d’un pays :

    Affiche le nom du pays
    Indique le nombre total de participations, de médailles et d’athlètes
    Présente l’évolution du nombre de médailles au fil des années sous forme de Line Chart (ngx-charts)
    Permet de retourner au dashboard en un clic

# Installation et démarrage
1️⃣ Cloner le projet

git clone https://github.com/ton-utilisateur/OlympicGamesDashboard.git
cd OlympicGamesDashboard

2️⃣ Installer les dépendances

npm install (or npm install --legacy-peer-deps)

3️⃣ Lancer l’application en local

ng serve

🔹 Accéder à l’application via http://localhost:4200/

# Build du projet

Pour générer une version prête pour la production, exécute :

ng build

Les fichiers seront stockés dans le dossier dist/

📂 assets/mock/olympic.json → Données des JO utilisées par l’application

# Technologies utilisées

    Angular 18
    TypeScript
    ngx-charts pour les graphiques dynamiques
    SCSS pour le style et la responsivité

Auteur : Allan Bouhadjar