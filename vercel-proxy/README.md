# Proxy CORS facultatif pour KAS AI

À utiliser seulement si le navigateur bloque l'appel direct à l'API à cause de CORS.

## Déploiement

1. Déploie ce dossier comme projet Vercel indépendant (Root Directory : `vercel-proxy`) ou place son contenu à la racine d'un dépôt séparé.
2. Ajoute les variables d'environnement Vercel :
   - `UPSTREAM_API_URL` : `https://wormgptn-i6n8.vercel.app/api/chat`
   - `ALLOWED_ORIGIN` : l'origine exacte du site GitHub Pages, par exemple `https://mon-compte.github.io`
3. Déploie.
4. Configure `VITE_API_URL` dans les variables GitHub Actions du projet frontend avec `https://nom-du-proxy.vercel.app/api/chat`.
5. Relance le déploiement GitHub Pages.

Ce proxy transmet uniquement le JSON reçu au backend. Il ne doit pas recevoir ni stocker de secrets côté navigateur.
