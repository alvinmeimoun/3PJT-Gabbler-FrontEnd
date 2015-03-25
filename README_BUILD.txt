Une fois le projet récupéré :

S'assurer que Node.JS est installé sur l'environnement de travail.


#Etape 1 : Installation

Ouvrir un terminal

Se placer dans le dossier SPA_DEV_ASSETS
- cd SPA_DEV_ASSETS

Puis entrer les commandes :

- npm install ( plutôt long environ 30 min)
- npm install bower
- bower update
- bower install gulp

INFO : En cas d'erreur "ENOGIT git is not installed or not in the PATH" sous Windows, éxécuter les commandes depuis le Shell Git

Se placer dans le dossier SOURCE
- cd SOURCE (ou cd ../SOURCE si actuellement placé dans SPA_DEV_ASSETS)

Et entrer la commande :
- npm install



# Etape 2 : GULP
# Permet de compresser l'ensemble des fichiers JS, CSS ... afin d'optimiser les ressources web

Se placer dans le dossier SPA_DEV_ASSETS
- cd SPA_DEV_ASSETS (ou cd ../SPA_DEV_ASSETS si actuellement placé dans SOURCE)

Puis entrer les commandes :
- gulp default
- gulp inject



# Démarrer le site

cd SOURCE
npm start

Site accessible à l'adresse localhost:8000/index.html



# Instructions de développement

LE CODE EST A ECRIRE DANS LE REPERTOIRE SPA_DEV_ASSETS
A CHAQUE MAJ : cd SPA_DEV_ASSETS puis taper la commande 'gulp'