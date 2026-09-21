/**
 * Ambient declaration for the build-time blog virtual module emitted by
 * `zafuPostsPlugin` in vite.config.ts. The content is generated from
 * `src/posts/*.md` at build time; this keeps the runtime imports type-safe.
 */
declare module "virtual:zafu-posts" {
  export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    description?: string;
    author?: string;
    tags?: string[];
    html: string;
  }
  export const posts: BlogPost[];
}
