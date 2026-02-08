# Audit technique – templeboyer-legal.fr (source)

## 1. Contexte général

- **Domaine analysé** : https://www.templeboyer-legal.fr/
- **Secteur** : cabinet d’avocat d’affaires international (Paris).
- **Structure globale** :
  - Home avec présentation du cabinet et carrousel d’images.
  - Pages fixes : Le Cabinet, Compétences (hub + sous-pages), Honoraires, Partenariats, Contact, Plan d’accès, Mentions légales, Confidentialité.
  - Hub de contenus : `/publications-actualites` + pages "thèmes" (droit des contrats, contentieux, droit commercial, concurrence, distribution, consommation, PI, e‑commerce/NTIC, droit européen/international, contrats industriels, expertise sectorielle).
  - Articles individuels : URLs de type `publication-XXXXX-...html` listées via `/publications-actualites` et le flux RSS `/rss.php`.

## 2. Piste techno / CMS

> Cette section reste volontairement factuelle, basée uniquement sur ce qui est visible publiquement.

- Site généré côté serveur (HTML rendu, pas d’application SPA moderne visible).
- URLs typées PHP (`rss.php`, liens `.../mentions-legales.php` dans certains footers d’anciennes versions), ce qui suggère un **CMS ou moteur propriétaire PHP**.
- Mentions récurrentes de **SiteAvocat / myavocat.fr** dans les assets et crédits (générateur de sites pour avocats), ce qui laisse penser à :
  - un thème / template propriétaire,
  - un back-office spécifique non accessible au crawl (admin/login). 
- Assets images parfois servis depuis un sous-domaine ou un domaine tiers (ex : `temple.myavocat.fr`), ce qui introduit une dépendance externe pour les médias.

## 3. Architecture d’URL (source)

### 3.1. Pages fixes

- `/` – accueil (présentation, valeurs, intro cabinet).
- `/le-cabinet/` – présentation détaillée, parcours, valeurs.
- `/competences/` – hub des domaines (contrats, contentieux, droit commercial, etc.).
- Sous-pages de compétences (exemples) :
  - `/competences/contrats-commerciaux-et-industriels.html`
  - `/competences/precontentieux-et-contentieux-commercial.html`
  - `/competences/droit-commercial-droit-des-affaires.html`
  - `/competences/droit-de-la-concurrence.html`
  - `/competences/droit-de-la-distribution.html`
  - `/competences/droit-de-la-consommation.html`
  - `/competences/droit-de-la-propriete-intellectuelle-et-industrielle.html`
  - `/competences/e-commerce.html`
  - `/competences/droit-europeen-et-international-des-affaires.html`
  - `/competences/contrats-industriels-complexes-ingenierie.html`
  - `/competences/expertise-sectorielle-industrie-retail-services.html`
- Autres pages :
  - `/honoraires/`
  - `/partenariats/`
  - `/contact/`
  - `/plan-d-acces/`
  - `/mentions-legales` (ou variante `.php` selon les versions)
  - `/confidentialite` (idem).

Certaines URLs de compétences sont **présentes dans le menu mais renvoient 404** (d’après le crawl du premier sous‑agent) :

- `/competences/droit-commercial-droit-des-societes.html`
- `/competences/droit-des-nouvelles-technologies.html`
- `/competences/droit-de-la-construction-ingenierie.html`
- `/competences/droit-du-travail.html`
- `/competences/droit-de-la-propriete-industrielle-et-intellectuelle.html`

Elles sont tracées dans `migration/missing.txt`.

### 3.2. Publications & actualités

- Hub : `/publications-actualites/`.
- Pages de thèmes :
  - `/publications-actualites/liste-des-publications-juridiques-2007-2026.html`
  - `/publications-actualites/droit-des-contrats.html`
  - `/publications-actualites/contentieux-et-procedure.html`
  - `/publications-actualites/droit-commercial.html`
  - `/publications-actualites/droit-de-la-concurrence.html`
  - `/publications-actualites/droit-de-la-distribution.html`
  - `/publications-actualites/droit-de-la-consommation.html`
  - `/publications-actualites/propriete-intellectuelle-et-industrielle.html`
  - `/publications-actualites/e-commerce.html`
  - `/publications-actualites/droit-europeen-et-international.html`
  - `/publications-actualites/contrats-industriels-complexes-ingenierie.html`
  - `/publications-actualites/expertise-sectorielle.html`

### 3.3. Articles

- Pattern d’URL : `https://www.templeboyer-legal.fr/publication-XXXXX-...html`
  - `XXXXX` = identifiant numérique.
  - Suffixe = titre de l’article slugifié.
- Liste complète des articles exposée via :
  - Flux RSS global : `/rss.php`.
- Le flux RSS fournit pour chaque entrée :
  - `<title>` (titre éditorial),
  - `<link>` (URL `publication-*.html`),
  - `<pubDate>` (date au format RFC),
  - `<description>` (résumé HTML ou texte),
  - éventuellement `<category>`.

## 4. SEO actuel – observations factuelles

- **Titres & H1** :
  - Chaque page semble disposer d’un `<title>` cohérent et d’un `<h1>` principal.
  - Les pages de thèmes utilisent un H1 du type « Actualités Droit des Contrats », « Publications Contentieux et Procédure », etc.
- **Meta descriptions** :
  - Présentes sur de nombreuses pages, via `<meta name="description">`.
- **Flux RSS** :
  - `/rss.php` expose toutes les publications, ce qui est positif pour l’indexation cumulée et les abonnements RSS.
- **Erreurs 404** :
  - Les quelques URLs de compétences en 404 sont problématiques côté UX et SEO (liens morts depuis le menu principal).
- **Images & médias** :
  - Multiples images de carrousel et d’illustration d’articles.
  - Certaines référencées sur un domaine externe (ex: `temple.myavocat.fr`), ce qui peut compliquer la maîtrise des performances et du cache.

## 5. Principaux risques / points d’attention pour la migration

1. **Conservation des URLs**
   - Les URLs d’articles (`publication-*.html`) doivent être **préservées à l’identique** pour ne pas perdre l’historique SEO.
   - Les pages fixes et les pages de thèmes doivent conserver leurs slugs actuels autant que possible (`/le-cabinet`, `/competences/...`, `/publications-actualites/...`).

2. **404 existantes**
   - Les URLs de compétences déjà en 404 aujourd’hui :
     - doivent soit rester en 404 dans la nouvelle architecture, soit être redirigées proprement vers des pages de remplacement (`redirects_301.csv`),
     - ne doivent pas être recréées artificiellement avec du contenu qui n’existe pas.

3. **Dépendances media externes**
   - Certaines images étant servies depuis d’autres domaines, il existe un risque de ressources manquantes à moyen terme.
   - La stratégie de migration prévoit un **téléchargement local** dans `migration/media/*` et un mapping `migration/media_map.csv` pour reprendre la main sur les médias.

4. **Structure HTML hétérogène**
   - Le HTML des pages semble issu de gabarits différents (home, compétences, articles, pages de thèmes), ce qui complique un parsing naïf.
   - Le script `scripts/migrate-templeboyer.ts` a été conçu avec des heuristiques prudentes :
     - tentative d’isoler le contenu principal (`main`, `article`, `#content`, `#main`, etc.),
     - fallback sur le `<body>` complet quand aucun conteneur évident n’est identifié,
     - aucune insertion de texte inventé, uniquement du HTML existant.

5. **Évolution du domaine / internationalisation**
   - Il existe un site miroir en `.com` (anglais) avec sa propre structure.
   - Le présent projet ne touche **que** le `.fr`.
   - Attention à ne pas mélanger contenus FR/EN dans les métadonnées ou les flux (un flux RSS distinct sera généré pour la nouvelle app Next côté `.fr`).

## 6. Stratégie de migration retenue

1. **Extraction automatisée (script Node/TS)**
   - Script `scripts/migrate-templeboyer.ts` utilisant `axios` + `cheerio` + `node-fetch`.
   - Throttle d’au moins ~1100 ms entre chaque requête HTTP pour respecter le serveur source.
   - Parcours :
     - Pages fixes (`STATIC_PAGE_PATHS`) : home, Le Cabinet, Compétences, sous-pages clés, Honoraires, Partenariats, Contact, Plan d’accès, Mentions légales, Confidentialité, `rss.php?guide`.
     - Pages de thèmes (`CATEGORY_PATHS`) : toutes les URLs de `/publications-actualites/...` listées plus haut.
     - Flux RSS global (`/rss.php`) pour découvrir et migrer **tous** les articles `publication-*.html`.
     - URLs potentiellement manquantes (`MAYBE_MISSING_PATHS`) pour tracer les 404.
   - Production :
     - `migration/urls.csv`
     - `migration/pages/*.json` + `.md`
     - `migration/posts/*.json` + `.md`
     - `migration/media/*` + `migration/media_map.csv`
     - `migration/posts_index.json`
     - `migration/missing.txt`

2. **Nouvelle app Next.js**
   - Lecture directe des fichiers de `migration/` à build-time / runtime serveur (pas de DB).
   - Routes figées pour les pages principales (`/le-cabinet`, `/competences/...`, `/honoraires`, `/publications-actualites`, etc.).
   - Route dynamique pour les articles : `/[slug]` avec `slug = "publication-...html"`.

3. **SEO & Perf**
   - Canonical basé sur les URLs historiques.
   - Sitemap et RSS générés à partir de `urls.csv` et `posts_index.json`.
   - Utilisation de `next/image` possible ultérieurement en se basant sur `media_map.csv`.

## 7. Points à vérifier lors de l’exécution réelle

Lors du premier run de `npm run migrate:templeboyer` sur un environnement local :

- Contrôler la taille et l’exhaustivité de :
  - `migration/urls.csv` (doit contenir toutes les pages/flux/articles trouvés par le script).
  - `migration/posts_index.json` (doit contenir tous les articles du flux RSS, avec `slug`, `title`, `date` si disponible, `category` quand présente).
- Vérifier que :
  - Les pages de compétences attendues ont bien un JSON et un MD dans `migration/pages/`.
  - Les articles récents ont un contenu HTML complet dans `migration/posts/`.
  - `migration/media/` contient des fichiers images pertinents et que `media_map.csv` est rempli.
  - `missing.txt` liste bien les 404 et autres URLs inaccessibles.

Ce fichier sert de référence pour garder une vision claire des contraintes techniques et SEO du site source tout au long de la refonte/migration.
