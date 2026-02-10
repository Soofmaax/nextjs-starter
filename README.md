# Temple Boyer Legal – Site statique Next.js

Ce dépôt contient :

- Une application **Next.js 15 / React 19 / TypeScript / Tailwind 4** qui sert la nouvelle version du site du cabinet Temple Boyer Legal.
- Un dossier de **contenus éditoriaux** `content/` (pages et articles) que l’on peut modifier sans toucher au code.

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

## 2. Contenus éditoriaux (`content/`)

Tout le contenu éditorial servi par le site est stocké dans le dossier `content/` :

- `content/pages/` :
  - Fichiers `*.md` pour les **pages fixes** et les **pages de compétences**.
  - Chaque fichier contient :
    - un en-tête *frontmatter* très simple (clé: valeur) avec `slug`, `url`, `type`, `title`, `metaDescription`, `h1` ;
    - le contenu HTML à afficher (copié depuis l’ancien site).
- `content/posts/` :
  - Fichiers `*.md` pour les **articles de blog** (`publication-*.html`).
  - Chaque fichier contient un frontmatter avec au moins :
    - `slug` (par ex. `publication-51059-....html`),
    - `url` (par ex. `/publication-51059-....html`),
    - `title`, `metaDescription`, `h1`,
    - `date` (ISO, ex. `2026-01-19T00:00:00.000Z`),
    - `category`.

Le fichier `src/lib/content.ts` :

- lit ces fichiers Markdown,
- extrait le frontmatter,
- fournit :
  - les pages via `getPageBySlug(slug)` ;
  - la liste des articles via `getPostsIndex()` ;
  - le détail d’un article via `getPostBySlug(slug)`.

> Pour ajouter un article :
>
> 1. Créer un nouveau fichier dans `content/posts/` en partant d’un fichier existant.
> 2. Adapter le frontmatter (slug, url, titre, date, catégorie…).
> 3. Coller ou modifier le contenu HTML dans le corps du fichier.
>
> Au prochain déploiement, l’article est automatiquement pris en compte dans :
> - la liste `/publications-actualites` ;
> - la page d’accueil (3 derniers articles) ;
> - le sitemap `/sitemap.xml` et le flux `/rss.xml`.

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

- Lit les contenus éditoriaux via `src/lib/content.ts` à partir de `content/`.
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
- `sitemap.xml` et `rss.xml` générés à partir des contenus (`content/pages`, `content/posts`).

---

## 5. Limitations & pistes d’amélioration

Le dépôt respecte le cahier des charges pour :

- La conservation des **slugs historiques** des articles `publication-*.html`.
- La conservation des **slugs historiques** des articles `publication-*.html`.
- La lecture des contenus depuis des fichiers plats (`content/`), sans base de données.
- Les éléments SEO principaux (Organization + Article, sitemap, robots, RSS).

Reste à arbitrer/compléter selon tes besoins :

- Ajout de nouvelles pages ou compétences en dupliquant un fichier dans `content/pages/`.
- Ajout/modification d’articles en éditant ou en ajoutant un fichier dans `content/posts/`.
- Mise en place éventuelle d’une surcouche type CMS Git (Decap/Netlify CMS) si la cliente souhaite une interface d’édition visuelle plutôt que passer par GitHub.

Pour tout ajustement (routes supplémentaires, redirections 301, intégration d’un CMS Git, etc.), tu pourras m’indiquer les priorités et je t’aiderai à adapter le code et la structure.
