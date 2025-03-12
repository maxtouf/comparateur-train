# Créer un nouveau dépôt sur GitHub d'abord via l'interface web
# Remplacez 'votre-nom-utilisateur' par votre nom d'utilisateur GitHub

# Initialiser le dépôt Git local
git init

# Ajouter l'URL distante (remplacez par l'URL de votre dépôt)
git remote add origin https://github.com/votre-nom-utilisateur/comparateur-train.git

# Ajouter tous les fichiers au suivi Git
git add .

# Faire un premier commit
git commit -m "Premier commit : application de comparaison de billets de train"

# Pousser les changements vers GitHub
git push -u origin main

# Si vous utilisez la branche master au lieu de main
# git push -u origin master

# Pour déployer sur GitHub Pages après avoir configuré package.json
npm run deploy