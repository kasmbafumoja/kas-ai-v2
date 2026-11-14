# KAS AI v2 — L'Éveil

Interface de chat React + Vite, en français, conçue pour être publiée gratuitement sur **GitHub Pages** et utiliser ton API Vercel.

## 1. Ce que contient le projet

- Interface responsive sombre, rouge et violette.
- Conversations enregistrées dans le navigateur (`localStorage`).
- Contexte récent envoyé à l'API à chaque message.
- Indicateur de réponse, messages d'erreur et bouton de copie.
- Déploiement automatique sur GitHub Pages avec GitHub Actions.
- API configurée par défaut : `https://wormgptn-i6n8.vercel.app/api/chat`.
- Un proxy Vercel facultatif est fourni dans `vercel-proxy/` si l'API refuse les requêtes du navigateur à cause de CORS.

## 2. Prérequis

- Un compte GitHub.
- Node.js 20 ou plus récent si tu veux tester le site sur ton ordinateur.
- Une API accessible par Internet qui accepte `POST` avec le JSON `{"message":"..."}`.

**Important :** GitHub Pages héberge seulement le site frontend. L'API reste hébergée séparément sur Vercel. Ne mets jamais une clé privée ou un mot de passe dans le code frontend ou dans une variable `VITE_*`.

## 3. Tester le projet en local

Dans le dossier du projet :

```bash
npm install
cp .env.example .env
npm run dev
```

Ouvre l'adresse locale affichée par Vite, généralement `http://localhost:5173`.

Pour vérifier directement ton API depuis un terminal :

```bash
curl -i -X POST "https://wormgptn-i6n8.vercel.app/api/chat" \
  -H "Content-Type: application/json" \
  --data-raw '{"message":"Bonjour. Réponds en français."}'
```

Le test `curl` vérifie l'accès au serveur, mais **ne vérifie pas CORS**. CORS concerne les appels envoyés depuis le navigateur.

## 4. Publier sur GitHub Pages

1. Crée un nouveau dépôt GitHub, par exemple `kas-ai`.
2. Décompresse le ZIP et envoie **le contenu** du dossier `kas-ai-v2` dans le dépôt.
3. Vérifie que le fichier `package.json` est à la racine du dépôt.
4. Dans GitHub, ouvre **Settings → Pages**.
5. Dans **Build and deployment**, choisis **GitHub Actions** comme source.
6. Envoie les fichiers sur la branche `main`. Le workflow `.github/workflows/deploy.yml` va construire et publier le site.
7. Après la fin du workflow, GitHub affichera l'adresse publique de ton site dans **Settings → Pages**.

Le workflow configure automatiquement le chemin du dépôt. Tu n'as donc normalement pas besoin de modifier `vite.config.js`.

### Modifier l'adresse de l'API

Par défaut, le site utilise l'API déjà indiquée dans `src/config.js`.

Pour remplacer cette adresse sans modifier le code :
1. Dans ton dépôt GitHub, ouvre **Settings → Secrets and variables → Actions → Variables**.
2. Crée une variable nommée `VITE_API_URL`.
3. Mets comme valeur l'adresse complète de ton endpoint, par exemple `https://ton-projet.vercel.app/api/chat`.
4. Relance le workflow depuis **Actions → Deploy KAS AI to GitHub Pages → Run workflow**.

L'adresse d'une API publique n'est pas un secret. Une clé privée, en revanche, ne doit jamais être ajoutée à une variable `VITE_*`.

## 5. Si le chat ne répond pas : vérifier CORS

Si le site s'affiche mais que l'envoi échoue avec une erreur de connexion/CORS, cela signifie souvent que l'API Vercel ne permet pas à ton domaine GitHub Pages de l'appeler depuis le navigateur.

Deux possibilités :

- **Option A :** configurer CORS dans le backend Vercel actuel pour autoriser ton domaine GitHub Pages et les requêtes `OPTIONS`.
- **Option B :** déployer le proxy facultatif inclus dans `vercel-proxy/`, puis mettre son endpoint dans la variable `VITE_API_URL`.

### Déployer le proxy facultatif

1. Dans Vercel, crée un nouveau projet et importe le dossier `vercel-proxy` comme racine du projet. Tu peux aussi placer ce dossier dans un dépôt séparé.
2. Dans les variables d'environnement Vercel, ajoute :
   - `UPSTREAM_API_URL` = `https://wormgptn-i6n8.vercel.app/api/chat`
   - `ALLOWED_ORIGIN` = l'adresse exacte de ton site GitHub Pages, par exemple `https://ton-compte.github.io`
3. Déploie le projet.
4. Dans GitHub → Settings → Secrets and variables → Actions → Variables, règle `VITE_API_URL` sur `https://ton-proxy.vercel.app/api/chat`.
5. Relance le workflow GitHub Pages.

Le proxy ne stocke pas de clé secrète et ne remplace pas l'API : il transmet simplement la requête à ton endpoint Vercel actuel et ajoute les en-têtes CORS.

## 6. Limites à connaître

- Les conversations sont enregistrées dans le navigateur utilisé. Elles ne sont pas synchronisées entre plusieurs téléphones ou navigateurs.
- Le contexte récent est renvoyé dans le champ `message` à chaque requête. Le backend reçoit donc un seul champ texte, pas un tableau de rôles `system/user/assistant`.
- Si ton API impose une autre structure JSON ou renvoie un format inhabituel, il faudra adapter `src/lib/api.js`.
- Les messages peuvent être perdus si l'utilisateur efface les données du navigateur.
- Une API publique peut avoir des limites de débit ou devenir indisponible.

## 7. Structure du projet

```text
kas-ai-v2/
├── .github/workflows/deploy.yml
├── public/
│   ├── .nojekyll
│   └── sigil.svg
├── src/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── App.jsx
│   ├── config.js
│   ├── index.css
│   └── main.jsx
├── vercel-proxy/
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```
