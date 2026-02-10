import fs from "node:fs/promises";
import path from "node:path";

export type PageIndexType = "page" | "category";

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
  url: string | null;
  slug: string;
  title: string | null;
  metaDescription: string | null;
  h1: string | null;
  html: string | null;
  date: string | null;
  category: string | null;
}

export interface PostIndexEntry {
  url: string | null;
  slug: string;
  title: string | null;
  metaDescription: string | null;
  date: string | null;
  category: string | null;
}

const contentRoot = path.join(process.cwd(), "content");

interface ParsedFrontmatter {
  data: Record<string, string>;
  content: string;
}

function parseFrontmatter(source: string): ParsedFrontmatter {
  if (!source.startsWith("---")) {
    return { data: {}, content: source };
  }

  const endIndex = source.indexOf("\n---", 3);
  if (endIndex === -1) {
    return { data: {}, content: source };
  }

  const raw = source.slice(3, endIndex).trim();
  const rest = source.slice(endIndex + 4);

  const data: Record<string, string> = {};
  const lines = raw.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const colonIndex = trimmed.indexOf(":");
    if (colonIndex === -1) continue;

    const key = trimmed.slice(0, colonIndex).trim();
    let value = trimmed.slice(colonIndex + 1).trim();

    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    data[key] = value;
  }

  return { data, content: rest.trimStart() };
}

async function readMarkdownFile(relativePath: string): Promise<ParsedFrontmatter | null> {
  const fullPath = path.join(contentRoot, relativePath);
  try {
    const text = await fs.readFile(fullPath, "utf8");
    return parseFrontmatter(text);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export async function getPagesIndex(): Promise<UrlIndexRecord[]> {
  const pagesDir = path.join(contentRoot, "pages");

  let entries: string[];
  try {
    entries = await fs.readdir(pagesDir);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      return [];
    }
    throw error;
  }

  const records: UrlIndexRecord[] = [];

  async function walk(relativeDir: string) {
    const absoluteDir = path.join(contentRoot, relativeDir);
    let names: string[];
    try {
      names = await fs.readdir(absoluteDir);
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code === "ENOENT") {
        return;
      }
      throw error;
    }

    for (const name of names) {
      const absolutePath = path.join(absoluteDir, name);
      const stat = await fs.stat(absolutePath);

      if (stat.isDirectory()) {
        await walk(path.join(relativeDir, name));
      } else if (name.endsWith(".md")) {
        const relativePath = path.join(relativeDir, name);
        const parsed = await readMarkdownFile(relativePath);
        if (!parsed) continue;

        const url = (parsed.data.url ?? "").trim();
        const type = (parsed.data.type ?? "page").trim() as PageIndexType;

        if (!url) continue;

        records.push({
          url,
          type,
        });
      }
    }
  }

  await walk("pages");

  return records;
}

export async function getPostsIndex(): Promise<PostIndexEntry[]> {
  const postsDir = path.join(contentRoot, "posts");

  let names: string[];
  try {
    names = await fs.readdir(postsDir);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      return [];
    }
    throw error;
  }

  const entries: PostIndexEntry[] = [];

  for (const name of names) {
    if (!name.endsWith(".md")) continue;

    const parsed = await readMarkdownFile(path.join("posts", name));
    if (!parsed) continue;

    const data = parsed.data;
    const slug = name.replace(/\.md$/, "").trim();

    entries.push({
      url: (data.url ?? "").trim() || null,
      slug,
      title: data.title ?? null,
      metaDescription: data.metaDescription ?? null,
      date: data.date ?? null,
      category: data.category ?? null,
    });
  }

  entries.sort((a, b) => {
    if (a.date && b.date) {
      return a.date < b.date ? 1 : -1;
    }
    if (a.date) return -1;
    if (b.date) return 1;
    return 0;
  });

  return entries;
}

export async function getPageBySlug(slug: string): Promise<MigratedPage | null> {
  const normalized = slug === "" ? "index" : slug.replace(/^\/+/, "").replace(/\/+$/, "");
  const parsed = await readMarkdownFile(path.join("pages", `${normalized}.md`));

  if (!parsed) return null;

  const data = parsed.data;

  return {
    url: (data.url ?? "").trim(),
    slug: (data.slug ?? normalized).trim(),
    type: ((data.type as "page" | "category") ?? "page"),
    title: data.title ?? null,
    metaDescription: data.metaDescription ?? null,
    h1: data.h1 ?? null,
    html: parsed.content || null,
  };
}

export async function getPostBySlug(slug: string): Promise<MigratedPost | null> {
  const normalized = slug.replace(/^\/+/, "").replace(/\/+$/, "");
  const parsed = await readMarkdownFile(path.join("posts", `${normalized}.md`));

  if (!parsed) return null;

  const data = parsed.data;

  return {
    url: (data.url ?? "").trim() || null,
    slug: normalized,
    title: data.title ?? null,
    metaDescription: data.metaDescription ?? null,
    h1: data.h1 ?? null,
    html: parsed.content || null,
    date: data.date ?? null,
    category: data.category ?? null,
  };
}
