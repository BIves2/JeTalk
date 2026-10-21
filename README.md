# JeTalk

Application d'apprentissage des langues (français / anglais) avec cours, traduction, conversations vocales et suivi de progression.

- **Frontend** : React 19, Vite, Tailwind CSS 4, React Router, i18next
- **Backend** : Node.js, Express 5, Prisma 7, SQLite (local) ou Turso (production)
- **IA** : API Groq (en ligne) ou modèle Qwen local (hors-ligne, facultatif)
- **Voix** : synthèse Edge TTS + détection vocale dans le navigateur

---

## Sommaire

1. [Prérequis](#prérequis)
2. [Installation locale](#installation-locale)
3. [Variables d'environnement](#variables-denvironnement)
4. [Lancer le projet](#lancer-le-projet)
5. [Scripts disponibles](#scripts-disponibles)
6. [Déploiement gratuit (GitHub + Render + Turso)](#déploiement-gratuit-github--render--turso)
7. [Dépannage](#dépannage)
8. [Sécurité](#sécurité)

---

## Prérequis

- **Node.js 20.19+** (Node 22 recommandé)
- **pnpm 11+** (`npm install -g pnpm`)
- Un compte **Groq** pour l'IA en ligne : <https://console.groq.com/keys>

> **Windows / PowerShell** : si la commande `pnpm` est bloquée par la stratégie d'exécution, utilisez `pnpm.cmd` (ex. `pnpm.cmd install`).

---

## Installation locale

```bash
git clone https://github.com/<votre-compte>/jetalk.git
cd jetalk
pnpm install
```

Copiez le fichier d'exemple puis renseignez vos valeurs :

```bash
cp .env.example .env
```

Sous Windows PowerShell :

```powershell
Copy-Item .env.example .env
```

Initialisez la base SQLite locale et ajoutez les cours de démonstration :

```bash
pnpm db:init
pnpm db:seed
```

> `pnpm db:seed` remplace les cours existants. Ne l'exécutez pas sur une base contenant des données que vous voulez conserver.

---

## Variables d'environnement

| Variable | Obligatoire | Description |
| --- | --- | --- |
| `DATABASE_URL` | Oui | `file:./database/dev.db` en local, ou l'URL `libsql://...` de Turso en production |
| `DATABASE_AUTH_TOKEN` | En production | Jeton d'accès Turso |
| `JWT_SECRET` | Oui | Chaîne aléatoire longue servant à signer les sessions |
| `GROQ_API` | Recommandé | Clé API Groq pour la traduction et les conversations |
| `PORT` | Non | Port du serveur Express (5000 par défaut) |
| `NODE_ENV` | Non | `development` ou `production` |
| `CLIENT_URL` | Non | URL(s) du frontend autorisée(s) par CORS, séparées par des virgules |
| `VITE_API_URL` | Non | Force l'URL de l'API côté frontend (utile si le frontend est sur un autre domaine) |
| `ENABLE_LOCAL_MODEL` | Non | Mettre `false` pour désactiver complètement le modèle Qwen local |

Générer un secret solide :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Lancer le projet

Ouvrez **deux terminaux** :

```bash
# Terminal 1 — API Express (http://localhost:5000)
pnpm dev:server

# Terminal 2 — frontend Vite (http://localhost:5173)
pnpm dev
```

Ouvrez ensuite <http://localhost:5173>.

### Tester le mode production en local

```bash
pnpm build
pnpm start
```

Le serveur Express sert à la fois l'API et le build React sur <http://localhost:5000>. Les routes comme `/terms`, `/privacy`, `/about` ou `/login` fonctionnent grâce au fallback SPA.

---

## Scripts disponibles

| Commande | Rôle |
| --- | --- |
| `pnpm dev` | Lance Vite en développement |
| `pnpm dev:server` | Lance l'API Express avec rechargement automatique |
| `pnpm build` | Génère le build de production dans `dist/` |
| `pnpm start` | Démarre Express et sert `dist/` + l'API |
| `pnpm db:init` | Crée les tables (local ou Turso), sans supprimer les données |
| `pnpm db:seed` | Insère les cours de démonstration |
| `pnpm db:push` | Synchronise le schéma Prisma avec la base locale |
| `pnpm db:generate` | Régénère le client Prisma |
| `pnpm lint` | Vérifie le code avec ESLint |

---

## Déploiement gratuit (GitHub + Render + Turso)

GitHub héberge le **code**. Une application Node + base de données ne peut pas tourner sur GitHub Pages. La méthode gratuite recommandée est :

- **GitHub** : code source et déclenchement automatique des déploiements
- **Render** (offre gratuite) : serveur Node qui sert l'API et le frontend
- **Turso** (offre gratuite) : base SQLite hébergée et persistante

> Le plan gratuit Render met le service en veille après 15 minutes d'inactivité. Le premier chargement suivant peut prendre environ une minute. Les données restent dans Turso.

### Étape 1 — Publier le code sur GitHub

Créez un dépôt **vide** sur GitHub (sans README ni .gitignore), puis :

```bash
git add .
git commit -m "Préparation du déploiement"
git branch -M main
git remote add origin https://github.com/<votre-compte>/jetalk.git
git push -u origin main
```

> La base `database/dev.db` et le fichier `.env` ne sont **pas** versionnés. Vérifiez avec `git status` avant de pousser.

### Étape 2 — Créer la base Turso

1. Créez un compte sur <https://turso.tech>.
2. Créez une base nommée `jetalk` (choisissez la région la plus proche de vos utilisateurs).
3. Copiez son **URL** : `libsql://jetalk-....turso.io`.
4. Créez un **token** d'accès pour cette base et copiez-le.

Initialisez le schéma et les cours depuis votre machine, en pointant temporairement vers Turso.

**PowerShell :**

```powershell
$env:DATABASE_URL="libsql://jetalk-....turso.io"
$env:DATABASE_AUTH_TOKEN="votre-token-turso"
pnpm db:init
pnpm db:seed
Remove-Item Env:DATABASE_URL
Remove-Item Env:DATABASE_AUTH_TOKEN
```

**macOS / Linux :**

```bash
DATABASE_URL="libsql://jetalk-....turso.io" \
DATABASE_AUTH_TOKEN="votre-token-turso" \
pnpm db:init

DATABASE_URL="libsql://jetalk-....turso.io" \
DATABASE_AUTH_TOKEN="votre-token-turso" \
pnpm db:seed
```

> L'offre gratuite Render ne donne pas accès à un shell : l'initialisation de Turso se fait donc depuis votre machine, avant le déploiement.

### Étape 3 — Déployer sur Render

**Méthode automatique (blueprint fourni) :**

1. Sur <https://render.com>, cliquez sur **New → Blueprint**.
2. Connectez votre compte GitHub et sélectionnez le dépôt `jetalk`.
3. Render détecte `render.yaml`.
4. Renseignez les variables secrètes demandées :
   - `DATABASE_URL` : l'URL Turso
   - `DATABASE_AUTH_TOKEN` : le token Turso
   - `GROQ_API` : votre clé Groq
5. Cliquez sur **Apply** et attendez la fin du build.

**Méthode manuelle (équivalente) :**

1. **New → Web Service** → sélectionnez le dépôt.
2. Runtime : **Node**
3. Build Command : `corepack enable && pnpm install --frozen-lockfile && pnpm build`
4. Start Command : `node server/index.js`
5. Plan : **Free**
6. Health Check Path : `/api/health`
7. Variables d'environnement :
   - `NODE_ENV=production`
   - `DATABASE_URL=libsql://...`
   - `DATABASE_AUTH_TOKEN=...`
   - `JWT_SECRET=<chaîne aléatoire>`
   - `GROQ_API=...`
8. Déployez.

### Étape 4 — Vérifier

Une fois le déploiement terminé, testez :

- `https://votre-service.onrender.com/api/health` → `{"status":"ok"}`
- `https://votre-service.onrender.com/` → page d'accueil
- `/terms`, `/privacy`, `/about` → pages légales (plus de 404)
- `/login` → connexion, puis navigation dans le tableau de bord

> Si vous utilisez un domaine personnalisé, ajoutez-le à la variable `CLIENT_URL` sur Render (ex. `https://jetalk.fr`). Render fournit déjà `RENDER_EXTERNAL_URL` pour le domaine `onrender.com`.

### Mises à jour

Chaque `git push` sur `main` redéploie automatiquement le service Render.

---

## Dépannage

| Problème | Solution |
| --- | --- |
| `pnpm` bloqué sous PowerShell | Utilisez `pnpm.cmd` |
| Erreur CORS | Ajoutez l'URL exacte du frontend dans `CLIENT_URL` |
| Les pages `/terms`, `/privacy`, `/about` renvoient 404 en production | Vérifiez que le build est bien lancé avec `pnpm start` (Express sert `dist/` et le fallback SPA) |
| Erreur 401 / session perdue | Vérifiez `JWT_SECRET`, puis reconnectez-vous |
| Traduction ou conversation indisponible (503) | Vérifiez `GROQ_API` ; le modèle local n'est pas déployé |
| Build Render très long | `node-llama-cpp` est volumineux ; le modèle Qwen n'est pas téléchargé, seul le paquet l'est |
| Base vide après déploiement | Relancez `pnpm db:init` puis `pnpm db:seed` avec les variables Turso |

---

## Sécurité

- Ne versionnez **jamais** `.env` : il contient `JWT_SECRET` et `GROQ_API`.
- Ne versionnez **jamais** `database/*.db` : elle contient les comptes utilisateurs.
- Utilisez un `JWT_SECRET` long et aléatoire, différent entre local et production.
- En production, les cookies de session sont `httpOnly` et `secure` (HTTPS obligatoire).
- La clé Groq reste côté serveur ; elle n'est jamais exposée au navigateur.

---

## Modèle local (facultatif)

Le mode hors-ligne utilise `models/Qwen2.5-1.5B-Instruct-Q4_K_M.gguf` (environ 986 Mo). Ce fichier n'est pas versionné et n'est pas nécessaire en production : l'application utilise Groq en priorité. Pour le désactiver explicitement :

```env
ENABLE_LOCAL_MODEL=false
```
