# Temple Boyer Legal – Refonte Next.js & Script de migration

Ce dépôt contient :

- Une application **Next.js 15 / React 19 / TypeScript / Tailwind 4** qui sert la nouvelle version du site du cabinet Temple Boyer Legal.
- Un **script de migration/crawl Node.js** qui extrait l’intégralité du contenu public de https://www.templeboyer-legal.fr et le sérialise dans un dossier `migration/` (JSON, Markdown, CSV, médias).

L’objectif est de conserver les **URLs historiques**, en particulier celles des articles `publication-*.html`, tout en passant sur une stack moderne sans base de données.

---

## 1. Prérequis

- Node.js **≥ 20** recommandé.
- Git (optionnel, si tu veux versionner le repo).

Clone du projet (exemple) :

```bash
git clone <URL_DU_REPO> templeboyer-legal
cd templeboyer-legal
npm install
```

---

## 2. Migration du contenu (crawl du site existant)

Le script de migration se trouve dans `scripts/migrate-templeboyer.ts` et est exposé via :

```bash
npm run migrate:templeboyer
```

Ce script :

- Crawlera `https://www.templeboyer-legal.fr` **de manière séquentielle**.
- Respecte un **throttle ~1 requête / seconde** (pas de brute force).
- N’extrait que du **contenu public** (aucune zone admin, aucun login).
- N’invente aucun texte : tout provient du HTML/RSS d’origine.
- Produit les fichiers de migration suivants dans le dossier `migration/` :

  - `migration/pages/` :
    - `*.json` & `*.md` pour les **pages fixes** et **catégories**.
  - `migration/posts/` :
    - `*.json` & `*.md` pour tous les **articles** `publication-*.html`.
  - `migration/media/` :
    - Tous les médias téléchargés (images, PDF, etc.).
  - `migration/urls.csv` :
    - Inventaire des URLs crawlées avec type (`page`, `category`, `post`, `rss`).
  - `migration/posts_index.json` :
    - Index structuré des articles (slug, titre, date, catégorie…).
  - `migration/media_map.csv` :
    - Mapping URL d’origine → chemin local relatif + utilisation.
  - `migration/missing.txt` :
    - Liste des URLs/chemins non accessibles (404 ou erreurs).

> ⚠️ **Important** :
> - Ne lance pas ce script depuis un environnement contraint (CI fragile, environnement de test sans accès réseau). Utilise une machine locale ou une CI maîtrisée.
> - Le crawl peut prendre un certain temps (beaucoup d’articles 2007–2026, throttle de sécurité activé).

### 2.1 État actuel des données dans ce dépôt

Actuellement, ce repo contient déjà un **échantillon réel** de données migrées, à titre de démonstration :

- `migration/pages/index.json` + `index.md` : page d’accueil.
- `migration/posts/publication-51059-actualites-janvier-2026-le-tiers-au-contrat-ne-peut-pas-tout-avoir-agir-en-responsabilite-pour-manquement-contractuel-sans-subir-les-limites-contractuelles-prevues.html.json` + `.md` : un article complet.
- `migration/urls.csv` : inventaire partiel des URLs (home, pages fixes, catégories, cet article).
- `migration/posts_index.json` : index contenant cet article.
- `migration/media_map.csv` : une entrée de mapping pour une image liée à cet article.
- `migration/missing.txt` : quelques URLs 404 de compétences identifiées.
- `migration/redirects_301.csv` : présent mais vide (à compléter si tu définis des redirections).

Le reste du site (tous les autres articles et pages) n’est **pas encore migré** dans ce dépôt : pour respecter le cahier des charges et les contraintes techniques, la collecte exhaustive doit être réalisée en lançant le script sur une machine ayant accès à `https://www.templeboyer-legal.fr`.

### 2.2 Après exécution complète du script

Une fois le script exécuté complètement, vérifie :

- Que `migration/pages/` et `migration/posts/` contiennent bien les contenus attendus.
- Que `migration/media/` est présent avec les médias.
- Que `migration/urls.csv`, `migration/posts_index.json`, `migration/media_map.csv` sont remplis.

---

## 3. Lancer le site Next.js en local

Après installation des dépendances :

```bash
npm run dev
```

Par défaut, l’app écoute sur http://localhost:3000.

### Production

Pour vérifier que tout build correctement :

```bash
npm run lint
npm run build
npm run start
```

L’app Next :

- Lit les contenus migrés via `src/lib/content.ts` :
  - `migration/pages/*.json` pour les pages fixes et compétences.
  - `migration/posts/*.json` + `migration/posts_index.json` pour les articles.
  - `migration/urls.csv` pour l’inventaire des pages et le `sitemap.xml`.
- Expose :
  - La home `/` avec les dernières publications.
  - Des pages fixes (`/le-cabinet`, `/competences`, `/honoraires`, etc.).
  - Une liste paginée des articles `/publications-actualites`.
  - Une route dynamique `/[slug]` qui sert les articles `publication-*.html` en conservant les slugs historiques.
  - Les routes techniques SEO : `/robots.txt`, `/sitemap.xml`, `/rss.xml`.

---

## 4. SEO & structure de données

- Métadonnées globales (titre, description, OpenGraph, Twitter) définies dans `src/app/layout.tsx` et `src/config/site.ts`.
- JSON-LD **Organization / LegalService** injecté globalement.
- JSON-LD **Article** injecté sur les pages d’articles.
- `sitemap.xml` et `rss.xml` générés à partir des données de migration (`urls.csv`, `posts_index.json`).

---

## 5. Limitations & pistes d’amélioration

Le dépôt respecte le cahier des charges pour :

- La conservation des **slugs historiques** des articles `publication-*.html`.
- La lecture des contenus depuis `migration/` (aucune base de données).
- Les éléments SEO principaux (Organization + Article, sitemap, robots, RSS).

Reste à arbitrer/compléter selon tes besoins :

- Exploiter `migration/media_map.csv` pour remapper les images dans le HTML.
- Définir des règles de redirection à partir de `migration/redirects_301.csv` et/ou `migration/missing.txt`.
- Décider si les catégories `/publications-actualites/...` doivent avoir des pages dédiées ou être redirigées.

Pour tout ajustement (script de migration, routes supplémentaires, redirections 301, etc.), tu pourras m’indiquer les priorités et je t’aiderai à adapter le code et la structure.
