import { posts as builtPosts, type BlogPost } from "virtual:zafu-posts";

export type { BlogPost };

/** All posts, newest first (already sorted at build time). */
export const posts = builtPosts;

/** Find a single post by slug. */
export function postBySlug(slug: string): BlogPost | undefined {
  return builtPosts.find((p) => p.slug === slug);
}

/**
 * Known author -> profile URL. Bylines matching a name here link out to that
 * profile; unknown authors render as plain text.
 */
const AUTHOR_URLS: Record<string, string> = {
  hitch: "https://forum.zcashcommunity.com/u/hitch/summary",
};

/** The profile URL for a byline author, if we have one. */
export function authorUrl(name: string | undefined): string | undefined {
  return name ? AUTHOR_URLS[name] : undefined;
}

/** "2026-09-21" -> "September 21, 2026" (raw string on parse failure). */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
