import { For, Show, type JSX, type ParentComponent } from "solid-js";

/**
 * Helpers for technical content pages, complementing Page/Section/SpecItem.
 * All styling uses the theme CSS variables so light/dark both work.
 */

/** Titled block inside a Page: h2 + optional lede + content. */
export const SubSection: ParentComponent<{
  id?: string;
  title: string;
  lede?: string;
}> = (props) => {
  return (
    <section id={props.id} class="mt-14 first:mt-0">
      <h2 class="m-0 text-xl font-semibold text-[var(--color-text)] sm:text-2xl">
        {props.title}
      </h2>
      <Show when={props.lede}>
        <p class="m-0 mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">
          {props.lede}
        </p>
      </Show>
      <div class="mt-6">{props.children}</div>
    </section>
  );
};

/** Responsive card grid for SpecItem entries. */
export const SpecGrid: ParentComponent<{ cols?: 1 | 2 | 3 }> = (props) => {
  const cols = () =>
    props.cols === 1
      ? ""
      : props.cols === 3
        ? "sm:grid-cols-2 lg:grid-cols-3"
        : "sm:grid-cols-2";
  return <div class={`grid gap-4 ${cols()}`}>{props.children}</div>;
};

/** Numbered step list for procedural docs. */
export function Steps(props: {
  items: {
    title: string;
    body: string | JSX.Element;
    link?: { href: string; text: string };
  }[];
}) {
  return (
    <ol class="m-0 grid list-none gap-4 p-0">
      <For each={props.items}>
        {(item, i) => (
          <li class="flex gap-4 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
            <span class="shrink-0 font-mono text-xs font-semibold text-[var(--color-accent)] pt-0.5">
              {String(i() + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 class="m-0 text-sm font-semibold text-[var(--color-text)]">
                {item.title}
              </h3>
              <div class="mt-1 text-sm leading-relaxed text-[var(--color-text-muted)]">
                {item.body}
              </div>
              <Show when={item.link}>
                <a
                  href={item.link!.href}
                  class="mt-2 inline-block font-mono text-xs text-[var(--color-accent)] hover:underline"
                >
                  {item.link!.text}
                </a>
              </Show>
            </div>
          </li>
        )}
      </For>
    </ol>
  );
}

export function LinkList(props: {
  items: { title: string; href: string; value?: string; description?: string }[];
}) {
  return (
    <ul class="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
      <For each={props.items}>
        {(item) => (
          <li class="m-0">
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              class="flex h-full flex-col border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 transition-colors hover:border-[var(--color-border-strong)]"
            >
              <span class="flex items-baseline gap-2">
                <span class="text-sm font-semibold text-[var(--color-text)]">
                  {item.title}
                </span>
                <Show when={item.value}>
                  <span class="ml-auto font-mono text-xs text-[var(--color-accent)]">
                    {item.value}
                  </span>
                </Show>
              </span>
              <Show when={item.description}>
                <span class="mt-1 text-sm leading-relaxed text-[var(--color-text-muted)]">
                  {item.description}
                </span>
              </Show>
            </a>
          </li>
        )}
      </For>
    </ul>
  );
}

export function CodeBlock(props: { code: string; caption?: string }) {
  return (
    <figure class="m-0 my-4">
      <pre class="m-0 overflow-x-auto border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 font-mono text-sm leading-relaxed text-[var(--color-text)]">
        <code>{props.code}</code>
      </pre>
      <Show when={props.caption}>
        <figcaption class="mt-2 text-xs text-[var(--color-text-muted)]">
          {props.caption}
        </figcaption>
      </Show>
    </figure>
  );
}
