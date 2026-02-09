/**
 * Script de migration du contenu de https://www.templeboyer-legal.fr vers le dossier local `migration/`.
 *
 * Il ne modifie jamais le site source : il se contente de lire le HTML public, de l'analyser
 * et de sérialiser le contenu dans des fichiers JSON / Markdown et quelques fichiers CSV d'index.
 *
 * Usage prévu (à NE PAS exécuter dans ce dépôt pour l'instant) :
 *   npm run migrate:templeboyer
 * qui appelle :
 *   ts-node --esm scripts/migrate-templeboyer.ts
 */

import axios from "axios";
import * as cheerio from "cheerio";
import fetch from "node-fetch";
import fs from "node:fs/promises";
import path from "node:path";

type CheerioRoot = ReturnType<typeof cheerio.load>;

const BASE_URL = "https://www.templeboyer-legal.fr" as const;

const OUTPUT_ROOT = path.join(process.cwd(), "migration");
const PAGES_DIR = path.join(OUTPUT_ROOT, "pages");
const POSTS_DIR = path.join(OUTPUT_ROOT, "posts");
const MEDIA_DIR = path.join(OUTPUT_ROOT, "media");
const URLS_CSV_PATH = path.join(OUTPUT_ROOT, "urls.csv");
const POSTS_INDEX_PATH = path.join(OUTPUT_ROOT, "posts_index.json");
const MEDIA_MAP_CSV_PATH = path.join(OUTPUT_ROOT, "media_map.csv");
const MISSING_PATH = path.join(OUTPUT_ROOT, "missing.txt");

// Typage de base pour les différents artefacts de migration

type UrlRecordType = "page" | "category" | "post" | "rss";

interface UrlRecord {
  url: string;
  type: UrlRecordType;
  statusCode: number | null;
  title: string | null;
  metaDescription: string | null;
  h1: string | null;
}

interface MigratedPage {
  url: string;
  slug: string;
  type: "page" | "category";
  title: string | null;
  metaDescription: string | null;
  h1: string | null;
  html: string | null;
}

interface MigratedPost {
  url: string;
  slug: string;
  title: string | null;
  metaDescription: string | null;
  h1: string | null;
  html: string | null;
  /** ISO 8601 (ex: 2024-01-31T10:00:00.000Z) ou null si non déterminée */
  date: string | null;
  /** Catégorie éditoriale (titre de la page thème, ou null) */
  category: string | null;
}

interface PostIndexEntry {
  url: string;
  slug: string;
  title: string | null;
  metaDescription: string | null;
  date: string | null;
  category: string | null;
}

interface MediaMapEntry {
  originUrl: string;
  localPath: string;
  usedOn: string; // slug d'article ou de page
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function ensureDirectories(): Promise<void> {
  const dirs = [OUTPUT_ROOT, PAGES_DIR, POSTS_DIR, MEDIA_DIR];
  await Promise.all(dirs.map((dirPath) => fs.mkdir(dirPath, { recursive: true })));
}

async function fetchHtml(url: string): Promise<{ status: number; html: string }>
{
  // Throttle strict : on attend au moins 1100 ms entre chaque requête réseau.
  await sleep(1100);

  const response = await axios.get<string>(url, {
    validateStatus: () => true,
    responseType: "text",
  });

  return { status: response.status, html: response.data };
}

async function downloadBinary(url: string): Promise<Buffer | null> {
  await sleep(1100);

  const response = await fetch(url);
  if (!response.ok) {
    return null;
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function extractMeta($: CheerioRoot): {
  title: string | null;
  metaDescription: string | null;
  h1: string | null;
} {
  const title = ($("title").first().text() || "").trim() || null;
  const metaDescription =
    ($('meta[name="description"]').attr("content") || "").trim() || null;
  const h1 = ($("h1").first().text() || "").trim() || null;

  return { title, metaDescription, h1 };
}

function extractMainHtml($: CheerioRoot): string | null {
  // Heuristique prudente : on essaie les zones classiques, sinon on tombe
  // en repli sur le contenu du <body> complet.
  const mainSelectors = [
    "main",
    "article",
    "#content",
    "#contenu",
    ".main-content",
    "#main",
  ];

  for (const selector of mainSelectors) {
    const node = $(selector).first();
    if (node.length > 0) {
      const html = node.html();
      if (html && html.trim().length > 0) {
        return html.trim();
      }
    }
  }

  const body = $("body").first();
  const bodyHtml = body.html();
  return bodyHtml && bodyHtml.trim().length > 0 ? bodyHtml.trim() : null;
}

function normalizePageSlugFromPath(pathname: string): string {
  if (!pathname || pathname === "/") {
    return "index";
  }

  const cleaned = pathname.replace(/^\/+/, "").replace(/\/+$/, "");
  return cleaned;
}

function slugFromUrl(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl);
    const segments = url.pathname.split("/").filter(Boolean);
    const last = segments[segments.length - 1];
    return last ?? null;
  } catch {
   </old_code><new_code>function parseRssPubDate(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed.toISOString();
}

function parseDateFromHtml($: CheerioRoot): string | null {
  const text = $("body").text();
  const match = text.match(/Publié\s+le\s+(\d{2}\/\d{2}\/\d{4})/i);
  if (!match) return null;

  const [day, month, year] = match[1].split("/").map((value) => parseInt(value, 10));
  if (!day || !month || !year) return null;

  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString();
}</old_code><new_code>function parseDateFromHtml($: CheerioRoot): string | null {ateFromHtml($: CheerioRoot): string | null {
null {
  const text = $("body").text();
  const match = text.match(/Publié\s+le\s+(\d{2}\/\d{2}\/\d{4})/i);
  if (!match) return null;

  const [day, month, year] = match[1].split("/").map((value) => parseInt(value, 10));
  if (!day || !month || !year) return null;

  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString();
}

async function writeJsonFile(filePath: string, data: unknown): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function writeTextFile(filePath: string, content: string): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, content, "utf8");
}

function toCsvValue(value: string | number | null): string {
  if (value === null || value === undefined) {
    return "";
  }
  const stringValue = String(value);
  if (stringValue.includes(",") || stringValue.includes("\"")) {
    const escaped = stringValue.replace(/"/g, '""');
    return `"${escaped}"`;
  }
  return stringValue;
}

function buildUrlsCsv(urls: UrlRecord[]): string {
  const header = "url,type,status_code,title,meta_description,h1";
  const lines = urls.map((record) =>
    [
      toCsvValue(record.url),
      toCsvValue(record.type),
      toCsvValue(record.statusCode ?? ""),
      toCsvValue(record.title),
      toCsvValue(record.metaDescription),
      toCsvValue(record.h1),
    ].join(","),
  );
  return [header, ...lines].join("\n");
}

function buildMediaMapCsv(entries: MediaMapEntry[]): string {
  const header = "origin_url,local_path,used_on";
  const lines = entries.map((entry) =>
    [
      toCsvValue(entry.originUrl),
      toCsvValue(entry.localPath),
      toCsvValue(entry.usedOn),
    ].join(","),
  );
  return [header, ...lines].join("\n");
}

async function loadExistingPostsIndex(): Promise<PostIndexEntry[]> {
  try {
    const raw = await fs.readFile(POSTS_INDEX_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as PostIndexEntry[];
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

function ensureUniqueMediaFilename(filename: string, usedNames: Set<string>): string {
  if (!usedNames.has(filename)) {
    usedNames.add(filename);
    return filename;
  }

  const ext = path.extname(filename);
  const base = path.basename(filename, ext) || "media";

  let counter = 1;
  let candidate = `${base}-${counter}${ext}`;
  while (usedNames.has(candidate)) {
    counter += 1;
    candidate = `${base}-${counter}${ext}`;
  }

  usedNames.add(candidate);
  return candidate;
}

async function collectAndDownloadMedia(
  html: string,
  usedOnSlug: string,
  mediaFilenames: Set<string>,
): Promise<MediaMapEntry[]> {
  const $ = cheerio.load(html);
  const entries: MediaMapEntry[] = [];

  const srcs = new Set<string>();
  $("img").each((_, element) => {
    const src = $(element).attr("src");
    if (src) {
      srcs.add(src);
    }
  });

  for (const src of srcs) {
    // Normalisation de l'URL absolue côté media
    let absoluteUrl: string;
    try {
      absoluteUrl = new URL(src, BASE_URL).toString();
    } catch {
      // URL mal formée : on l'ignore simplement
      continue;
    }

    const urlObject = new URL(absoluteUrl);
    const originalFilename = path.basename(urlObject.pathname) || "media";
    const localFilename = ensureUniqueMediaFilename(originalFilename, mediaFilenames);
    const localPath = path.join(MEDIA_DIR, localFilename);

    const buffer = await downloadBinary(absoluteUrl);
    if (!buffer) {
      continue;
    }

    await writeBinaryFile(localPath, buffer);

    const relativeToMigrationRoot = path.relative(OUTPUT_ROOT, localPath);
    entries.push({
      originUrl: absoluteUrl,
      localPath: relativeToMigrationRoot,
      usedOn: usedOnSlug,
    });
  }

  return entries;
}

async function writeBinaryFile(filePath: string, content: Buffer): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, content);
}

// ------------------ Parcours des URL ------------------

const STATIC_PAGE_PATHS: string[] = [
  "/",
  "/le-cabinet",
  "/competences",
  // Exemple fourni : sous-page de compétences
  "/competences/contrats-commerciaux-et-industriels.html",
  "/honoraires",
  "/partenariats",
  "/contact",
  "/plan-d-acces",
  "/mentions-legales",
  "/confidentialite",
  "/rss.php?guide",
];

const CATEGORY_PATHS: string[] = [
  "/publications-actualites",
  "/publications-actualites/liste-des-publications-juridiques-2007-2026.html",
  "/publications-actualites/droit-des-contrats.html",
  "/publications-actualites/contentieux-et-procedure.html",
  "/publications-actualites/droit-commercial.html",
  "/publications-actualites/droit-de-la-concurrence.html",
  "/publications-actualites/droit-de-la-distribution.html",
  "/publications-actualites/droit-de-la-consommation.html",
  "/publications-actualites/propriete-intellectuelle-et-industrielle.html",
  "/publications-actualites/e-commerce.html",
  "/publications-actualites/droit-europeen-et-international.html",
  "/publications-actualites/contrats-industriels-complexes-ingenierie.html",
  "/publications-actualites/expertise-sectorielle.html",
];

const RSS_PATHS: string[] = [
  "/rss.php",
];

const MAYBE_MISSING_PATHS: string[] = [
  "/competences/droit-commercial-droit-des-societes.html",
  "/competences/droit-des-nouvelles-technologies.html",
  "/competences/droit-de-la-construction-ingenierie.html",
  "/competences/droit-du-travail.html",
  "/competences/droit-de-la-propriete-industrielle-et-intellectuelle.html",
];

async function crawlStaticPage(
  pathname: string,
  urls: UrlRecord[],
  missingPaths: Set<string>,
): Promise<void> {
  const absoluteUrl = new URL(pathname, BASE_URL).toString();
  const { status, html } = await fetchHtml(absoluteUrl);
  const $ = cheerio.load(html);
  const { title, metaDescription, h1 } = extractMeta($);

  const type: UrlRecordType = "page";

  urls.push({
    url: absoluteUrl,
    type,
    statusCode: status,
    title,
    metaDescription,
    h1,
  });

  if (status !== 200) {
    missingPaths.add(pathname);
    return;
  }

  const mainHtml = extractMainHtml($);
  const slug = normalizePageSlugFromPath(pathname);

  const page: MigratedPage = {
    url: absoluteUrl,
    slug,
    type: "page",
    title,
    metaDescription,
    h1,
    html: mainHtml,
  };

  const jsonPath = path.join(PAGES_DIR, `${slug}.json`);
  const mdPath = path.join(PAGES_DIR, `${slug}.md`);

  await writeJsonFile(jsonPath, page);

  const mdFrontMatter = [
    "---",
    `url: ${page.url}`,
    `slug: ${page.slug}`,
    `title: ${page.title ?? ""}`,
    `metaDescription: ${page.metaDescription ?? ""}`,
    `h1: ${page.h1 ?? ""}`,
    `type: ${page.type}`,
    "---",
    "",
    page.html ?? "",
    "",
  ].join("\n");

  await writeTextFile(mdPath, mdFrontMatter);
}

async function crawlCategoryPage(
  pathname: string,
  urls: UrlRecord[],
  missingPaths: Set<string>,
): Promise<void> {
  const absoluteUrl = new URL(pathname, BASE_URL).toString();
  const { status, html } = await fetchHtml(absoluteUrl);
  const $ = cheerio.load(html);
  const { title, metaDescription, h1 } = extractMeta($);

  urls.push({
    url: absoluteUrl,
    type: "category",
    statusCode: status,
    title,
    metaDescription,
    h1,
  });

  if (status !== 200) {
    missingPaths.add(pathname);
    return;
  }

  const mainHtml = extractMainHtml($);
  const slug = normalizePageSlugFromPath(pathname);

  const page: MigratedPage = {
    url: absoluteUrl,
    slug,
    type: "category",
    title,
    metaDescription,
    h1,
    html: mainHtml,
  };

  const jsonPath = path.join(PAGES_DIR, `${slug}.json`);
  const mdPath = path.join(PAGES_DIR, `${slug}.md`);

  await writeJsonFile(jsonPath, page);

  const mdFrontMatter = [
    "---",
    `url: ${page.url}`,
    `slug: ${page.slug}`,
    `title: ${page.title ?? ""}`,
    `metaDescription: ${page.metaDescription ?? ""}`,
    `h1: ${page.h1 ?? ""}`,
    `type: ${page.type}`,
    "---",
    "",
    page.html ?? "",
    "",
  ].join("\n");

  await writeTextFile(mdPath, mdFrontMatter);
}

async function crawlRssFeed(
  pathname: string,
  urls: UrlRecord[],
  postsIndex: PostIndexEntry[],
  missingPaths: Set<string>,
  mediaFilenames: Set<string>,
  mediaMapEntries: MediaMapEntry[],
): Promise<void> {
  const feedUrl = new URL(pathname, BASE_URL).toString();
  const { status, html } = await fetchHtml(feedUrl);

  urls.push({
    url: feedUrl,
    type: "rss",
    statusCode: status,
    title: null,
    metaDescription: null,
    h1: null,
  });

  if (status !== 200) {
    missingPaths.add(pathname);
    return;
  }

  const $feed = cheerio.load(html, { xmlMode: true });
  const items = $feed("item");

  for (let index = 0; index < items.length; index += 1) {
    const item = items.eq(index);
    const link = item.find("link").first().text().trim();
    const title = item.find("title").first().text().trim() || null;
    const descriptionFromRss =
      item.find("description").first().text().trim() || null;
    const pubDateRaw = item.find("pubDate").first().text().trim() || null;
    const categoryFromRss = item.find("category").first().text().trim() || null;

    if (!link) {
      // Item sans URL : on l'ignore.
      continue;
    }

    const slug = slugFromUrl(link);
    if (!slug) {
      continue;
    }

    // Si l'article est déjà dans l'index, on évite les doublons
    const alreadyInIndex = postsIndex.some((entry) => entry.slug === slug);
    if (alreadyInIndex) {
      continue;
    }

    const { status: articleStatus, html: articleHtml } = await fetchHtml(link);
    const $article = cheerio.load(articleHtml);
    const { metaDescription, h1 } = extractMeta($article);
    const mainHtml = extractMainHtml($article);

    urls.push({
      url: link,
      type: "post",
      statusCode: articleStatus,
      title,
      metaDescription,
      h1,
    });

    if (articleStatus !== 200) {
      const articleUrl = new URL(link);
      missingPaths.add(articleUrl.pathname);
      continue;
    }

    const dateFromRss = parseRssPubDate(pubDateRaw);
    const dateFromHtml = parseDateFromHtml($article as unknown as cheerio.CheerioAPI);
    const finalDate = dateFromRss ?? dateFromHtml ?? null;

    const post: MigratedPost = {
      url: link,
      slug,
      title,
      metaDescription: metaDescription ?? descriptionFromRss,
      h1,
      html: mainHtml,
      date: finalDate,
      category: categoryFromRss || null,
    };

    const jsonPath = path.join(POSTS_DIR, `${slug}.json`);
    const mdPath = path.join(POSTS_DIR, `${slug}.md`);

    await writeJsonFile(jsonPath, post);

    const mdFrontMatter = [
      "---",
      `url: ${post.url}`,
      `slug: ${post.slug}`,
      `title: ${post.title ?? ""}`,
      `metaDescription: ${post.metaDescription ?? ""}`,
      `h1: ${post.h1 ?? ""}`,
      `date: ${post.date ?? ""}`,
      `category: ${post.category ?? ""}`,
      "---",
      "",
      post.html ?? "",
      "",
    ].join("\n");

    await writeTextFile(mdPath, mdFrontMatter);

    postsIndex.push({
      url: post.url,
      slug: post.slug,
      title: post.title,
      metaDescription: post.metaDescription,
      date: post.date,
      category: post.category,
    });

    if (post.html) {
      const mediaEntries = await collectAndDownloadMedia(
        post.html,
        post.slug,
        mediaFilenames,
      );
      mediaEntries.forEach((entry) => mediaMapEntries.push(entry));
    }
  }
}

async function run(): Promise<void> {
  await ensureDirectories();

  const urls: UrlRecord[] = [];
  const missingPaths = new Set<string>();
  const postsIndex = await loadExistingPostsIndex();
  const mediaFilenames = new Set<string>();
  const mediaMapEntries: MediaMapEntry[] = [];

  // Pages fixes
  for (const pathname of STATIC_PAGE_PATHS) {
    // On ignore les erreurs individuelles mais on laisse remonter les erreurs système
    // (écriture disque, etc.)
    try {
      await crawlStaticPage(pathname, urls, missingPaths);
    } catch (error) {
      console.error("Erreur lors du crawl de la page statique", pathname, error);
    }
  }

  // Pages connues susceptibles d'être manquantes (404) mais qu'on souhaite tracer
  for (const pathname of MAYBE_MISSING_PATHS) {
    try {
      await crawlStaticPage(pathname, urls, missingPaths);
    } catch (error) {
      console.error(
        "Erreur lors du crawl de la page potentiellement manquante",
        pathname,
        error,
      );
    }
  }

  // Pages de catégories
  for (const pathname of CATEGORY_PATHS) {
    try {
      await crawlCategoryPage(pathname, urls, missingPaths);
    } catch (error) {
      console.error("Erreur lors du crawl de la page de catégorie", pathname, error);
    }
  }

  // Flux RSS (tous les articles, sans filtrage "recent")
  for (const pathname of RSS_PATHS) {
    try {
      await crawlRssFeed(
        pathname,
        urls,
        postsIndex,
        missingPaths,
        mediaFilenames,
        mediaMapEntries,
      );
    } catch (error) {
      console.error("Erreur lors du crawl du flux RSS", pathname, error);
    }
  }

  // Écriture des artefacts d'index
  const urlsCsv = buildUrlsCsv(urls);
  await writeTextFile(URLS_CSV_PATH, `${urlsCsv}\n`);

  await writeJsonFile(POSTS_INDEX_PATH, postsIndex);

  const mediaMapCsv = buildMediaMapCsv(mediaMapEntries);
  await writeTextFile(MEDIA_MAP_CSV_PATH, `${mediaMapCsv}\n`);

  if (missingPaths.size > 0) {
    const missingContent = Array.from(missingPaths)
      .sort()
      .join("\n");
    await writeTextFile(MISSING_PATH, `${missingContent}\n`);
  }
}

run().catch((error) => {
  // On log l'erreur mais on n'essaie pas de la masquer.
  // Le code de sortie non nul permet d'identifier un échec éventuel dans le pipeline.
  // eslint-disable-next-line no-console
  console.error("Erreur fatale pendant la migration Temple Boyer Legal:", error);
  process.exit(1);
});
