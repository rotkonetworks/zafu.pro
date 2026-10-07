import { Show, createSignal, onCleanup } from "solid-js";
import Page from "../components/Page";
import { ZAFU_STORE_URL } from "../content/links";

/**
 * zafu.pro/c#<card> and zafu.pro/j#<code>: links people share from zafu.
 * The part after `#` never leaves the browser, so this page reads it here,
 * checks its shape (the same rules zafu's own link reader uses) and only
 * ever hands it to a `zafu:` link. It is never fetched, logged or rendered.
 */
const KINDS = {
  c: {
    title: "a zafu card",
    line: "someone shared their zafu card with you",
    valid: /^[A-Za-z0-9_-]{16,2048}$/,
    zafu: (payload: string) => `zafu:contact#${payload}`,
  },
  j: {
    title: "a zafu group",
    line: "you've been invited to a group in zafu",
    valid: /^\d{3}(?:-[a-z]{2,12}){3}$/,
    zafu: (payload: string) => `zafu:join/${payload}`,
  },
} as const;

export default function SharedLink(props: { kind: keyof typeof KINDS }) {
  const kind = KINDS[props.kind];
  const [hash, setHash] = createSignal(window.location.hash);
  const onHash = () => setHash(window.location.hash);
  window.addEventListener("hashchange", onHash);
  onCleanup(() => window.removeEventListener("hashchange", onHash));

  const zafuHref = () => {
    const payload = hash().slice(1);
    return kind.valid.test(payload) ? kind.zafu(payload) : undefined;
  };

  return (
    <Page title={kind.title}>
      <section class="mx-auto flex max-w-md flex-col gap-6 py-12">
        <Show
          when={zafuHref()}
          fallback={
            <p class="m-0 font-display text-2xl text-text">
              this link looks incomplete · ask for a new one
            </p>
          }
        >
          {(href) => (
            <>
              <h1 class="m-0 font-display text-2xl text-text sm:text-3xl">{kind.line}</h1>
              <a href={href()} class="btn-primary">
                open in zafu
              </a>
              <p class="m-0 text-sm text-muted">
                don't have zafu yet?{" "}
                <a href={ZAFU_STORE_URL} rel="noreferrer" class="accent-link">
                  get it
                </a>
                , then open this link again
              </p>
            </>
          )}
        </Show>
        <p class="m-0 border-t border-border pt-4 text-xs text-dim2">
          this link stays in your browser · zafu.pro never sees it
        </p>
      </section>
    </Page>
  );
}
