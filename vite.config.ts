import { defineConfig, type Plugin } from "vite";
import solidPlugin from "vite-plugin-solid";
import UnoCSS from "unocss/vite";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import fm from "front-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

/**
 * Build-time blog. Each `src/posts/*.md` file is parsed for front-matter and
 * rendered to HTML with remark at BUILD time, then emitted as the virtual
 * module `virtual:zafu-posts`. The production bundle therefore ships only the
 * rendered HTML strings and metadata - no remark / front-matter at runtime.
 *
 * Slug: an explicit front-matter `slug`, else the filename with a leading
 * `YYYY-MM-DD-` date prefix stripped and `.md` removed. Posts are sorted newest
 * first by `date`.
 *
 * SECURITY: `sanitize: false` lets posts carry raw HTML, which is what inline
 * SVG diagrams need (the default schema strips them). The markdown is
 * repo-internal (authored by us), so that is acceptable here. Do NOT point this
 * at user-supplied markdown without adding sanitization.
 */
interface BuiltPost {
  slug: string;
  title: string;
  date: string;
  description?: string;
  author?: string;
  tags?: string[];
  html: string;
}

function zafuPostsPlugin(): Plugin {
  const VIRT = "virtual:zafu-posts";
  const RESOLVED = "\0" + VIRT;
  const postsDir = path.resolve(__dirname, "src/posts");

  const build = (): BuiltPost[] => {
    let files: string[] = [];
    try {
      files = readdirSync(postsDir).filter((f) => f.endsWith(".md"));
    } catch {
      return []; // no posts dir yet
    }
    const posts = files.map((file) => {
      const raw = readFileSync(path.join(postsDir, file), "utf8");
      const { attributes, body } = fm<{
        title?: string;
        date?: string;
        slug?: string;
        description?: string;
        author?: string;
        tags?: string[];
      }>(raw);
      const html = String(
        remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).processSync(body),
      );
      const base = file.replace(/\.md$/, "");
      const slug = attributes.slug ?? base.replace(/^\d{4}-\d{2}-\d{2}-/, "");
      const date = attributes.date ?? base.match(/^(\d{4}-\d{2}-\d{2})/)?.[1] ?? "";
      return {
        slug,
        title: attributes.title ?? slug,
        date,
        description: attributes.description,
        author: attributes.author,
        tags: attributes.tags,
        html,
      } satisfies BuiltPost;
    });
    posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    return posts;
  };

  let cache: BuiltPost[] | null = null;
  return {
    name: "zafu-posts",
    resolveId(id) {
      return id === VIRT ? RESOLVED : null;
    },
    load(id) {
      if (id !== RESOLVED) return null;
      cache ??= build();
      return `export const posts = ${JSON.stringify(cache)};\n`;
    },
    handleHotUpdate(ctx) {
      if (!ctx.file.endsWith(".md") || !ctx.file.includes("/posts/")) return;
      cache = null; // rebuild on next load
      const mod = ctx.server.moduleGraph.getModuleById(RESOLVED);
      return mod ? [mod] : undefined;
    },
  };
}

export default defineConfig({
  plugins: [zafuPostsPlugin(), UnoCSS(), solidPlugin()],
  build: {
    target: "esnext",
  },
});
