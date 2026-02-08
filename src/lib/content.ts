import fs from "node:fs/promises";
import path from "node:path";

export type PageIndexType = "page" | "category" | "post" | "rss";

export interface UrlIndexRecord {
  url: string;
  type: PageIndexType;
}

export interface MigratedPage {
  url: string;
  slug: string;
  type: "page" | "category";
  title: string | null;
  metaDescription: string | null;
  h1: string | null;
  html: string | null;
}

export interface MigratedPost {
  url: string;
  slug: string;
  title: string | null;
  metaDescription: string | null;
  h1: string | null;
  html: string | null;
  date: string | null;
  category: string | null;
}

export interface PostIndexEntry {
  url: string;
  slug: string;
  title: string | null;
  metaDescription: string | null;
  date: string | null;
  category: string | null;
}

const migrationRoot = path.join(process.cwd(), "migration");

async function readJsonFileSafe<T>(relativePath: string): Promise<T | null> {
  const fullPath = path.join(migrationRoot, relativePath);
  try {
    const content = await fs.readFile(fullPath, "utf8");
    return JSON.parse(content) as T;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export async function getPagesIndex(): Promise<UrlIndexRecord[]> {
  const csvPath = path.join(migrationRoot, "urls.csv");

  let text: string;
  try {
    text = await fs.readFile(csvPath, "utf8");
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      return [];
    }
    throw error;
  }

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length <= 1) {
    return [];
  }

  const [, ...dataLines] = lines;
  const records: UrlIndexRecord[] = [];

  for (const line of dataLines) {
    const [url, type] = line.split(",");
    const cleanUrl = (url ?? "").trim();
    const cleanType = (type ?? "page").trim();

    if (!cleanUrl) continue;

    records.push({
      url: cleanUrl,
      type: cleanType as PageIndexType,
    });
  }

  return records;
}

export async function getPostsIndex(): Promise<PostIndexEntry[]> {
  const postsIndex = await readJsonFileSafe<PostIndexEntry[]>("posts_index.json");
  if (!postsIndex) return [];
  return postsIndex;
}

export async function getPageBySlug(slug: string): Promise<MigratedPage | null> {
  const normalized = slug === "" ? "index" : slug.replace(/^\/+/, "").replace(/\/+$/, "");
  return readJsonFileSafe<MigratedPage>(path.join("pages", `${normalized}.json`));
}

export async function getPostBySlug(slug: string): Promise<MigratedPost | null> {
  const normalized = slug.replace(/^\/+/, "").replace(/\/+$/, "");
  return readJsonFileSafe<MigratedPost>(path.join("posts", `${normalized}.json`));
}
