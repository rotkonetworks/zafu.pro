import { Show } from "solid-js";
import { A, useParams } from "@solidjs/router";
import Page from "../components/Page";
import { postBySlug, formatDate, authorUrl } from "../lib/blog";

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const post = () => postBySlug(params.slug);

  return (
    <Page title={post()?.title ?? "Post not found"} stamp="">
      <A href="/blog" class="accent-link text-sm">
        &larr; All posts
      </A>

      <Show
        when={post()}
        fallback={
          <div class="mt-10">
            <h1 class="text-3xl font-bold text-text">Post not found</h1>
            <p class="text-muted mt-3">
              That post doesn't exist or has been moved.
            </p>
          </div>
        }
      >
        {(p) => (
          <article class="mt-6">
            <header class="border-b border-border pb-8">
              <Show when={p().date}>
                <time
                  class="text-xs uppercase tracking-wider text-muted"
                  datetime={p().date}
                >
                  {formatDate(p().date)}
                </time>
              </Show>
              <h1 class="mt-2 text-3xl md:text-4xl font-bold text-text">
                {p().title}
              </h1>
              <Show when={p().author}>
                <p class="text-muted mt-3 text-sm">
                  by{" "}
                  <Show when={authorUrl(p().author)} fallback={p().author}>
                    <a
                      href={authorUrl(p().author)}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="accent-link"
                    >
                      {p().author}
                    </a>
                  </Show>
                </p>
              </Show>
            </header>
            {/* HTML is build-time-rendered from repo-internal markdown. */}
            <div class="prose-zafu mt-10" innerHTML={p().html} />
          </article>
        )}
      </Show>
    </Page>
  );
}
