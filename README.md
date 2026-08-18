# AutoCare — projet Vite prêt à déployer

Ceci est la vitrine visuelle d'AutoCare (front-end uniquement, données simulées : pas de vraie base de
données, authentification ou paiement). C'est l'étape 1 du plan de mise en ligne : avoir une URL publique
à montrer.

## 1. Installer et tester en local

Il vous faut [Node.js](https://nodejs.org) (version 18 ou plus) installé sur votre ordinateur.

```bash
cd autocare-app
npm install
npm run dev
```

Ouvrez ensuite l'adresse affichée dans le terminal (en général `http://localhost:5173`).

## 2. Mettre le projet sur GitHub

1. Créez un compte sur [github.com](https://github.com) si vous n'en avez pas.
2. Créez un nouveau dépôt (bouton "New repository"), par exemple nommé `autocare`.
3. Depuis le dossier du projet :

```bash
git init
git add .
git commit -m "Premier import du prototype AutoCare"
git branch -M main
git remote add origin https://github.com/VOTRE-COMPTE/autocare.git
git push -u origin main
```

## 3. Déployer en ligne (gratuit) — méthode recommandée : Vercel

1. Allez sur [vercel.com](https://vercel.com) et créez un compte (connexion possible directement avec GitHub).
2. Cliquez sur **"Add New… → Project"**.
3. Sélectionnez le dépôt `autocare` que vous venez de créer.
4. Vercel détecte automatiquement Vite : laissez les réglages par défaut et cliquez sur **Deploy**.
5. Après 1 à 2 minutes, vous obtenez une URL publique du type `https://autocare-xxxx.vercel.app`.

### Alternative : Netlify

1. [netlify.com](https://netlify.com) → **"Add new site" → "Import an existing project"**.
2. Connectez votre dépôt GitHub.
3. Build command : `npm run build` — Publish directory : `dist`.
4. Cliquez sur **Deploy site**.

### Alternative sans GitHub (glisser-déposer)

1. En local : `npm run build` (crée un dossier `dist/`).
2. Allez sur [app.netlify.com/drop](https://app.netlify.com/drop) et glissez-déposez le dossier `dist`.
3. Un lien public est généré immédiatement.

## 4. Étape suivante : votre propre nom de domaine

Une fois déployé sur Vercel ou Netlify, allez dans les réglages du projet ("Domains") et ajoutez votre
nom de domaine (ex: `autocare.fr`) acheté chez un registrar (OVH, Gandi, Namecheap...). La plateforme vous
donnera les enregistrements DNS à renseigner chez votre registrar, et générera automatiquement le certificat
HTTPS.

## Rappel important

Ce site est une **maquette visuelle interactive** : les comptes, devis, garages et rendez-vous sont des
données simulées stockées uniquement en mémoire (elles se réinitialisent au rechargement de la page). Pour
un vrai lancement avec de vrais comptes et paiements, il faudra ajouter un back-end (base de données,
authentification, API) — voir l'étape 2 du plan.
