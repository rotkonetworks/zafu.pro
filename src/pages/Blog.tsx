import { For, Show } from "solid-js";
import { A } from "@solidjs/router";
import Page from "../components/Page";
import { posts, formatDate } from "../lib/blog";

export default function Blog() {
  return (
    <Page
      title="Blog"
      heading="Blog"
      lede="Notes on building zafu - the wallet, the air-gapped signer, and the encryption stack underneath."
    >
      <Show
        when={posts.length > 0}
        fallback={<p class="text-muted">No posts yet.</p>}
      >
        <div class="space-y-4">
          <For each={posts}>
            {(p) => (
              <A
                href={`/blog/${p.slug}`}
                class="card block hover:border-border-strong transition-colors"
              >
                <Show when={p.date}>
                  <time
                    class="text-xs uppercase tracking-wider text-muted"
                    datetime={p.date}
                  >
                    {formatDate(p.date)}
                  </time>
                </Show>
                <h2 class="mt-2 text-xl font-bold text-text">{p.title}</h2>
                <Show when={p.description}>
                  <p class="mt-2 text-sm text-muted">{p.description}</p>
                </Show>
                <Show when={p.author}>
                  <p class="mt-3 text-xs text-muted">by {p.author}</p>
                </Show>
              </A>
            )}
          </For>
        </div>
      </Show>
    </Page>
  );
}
