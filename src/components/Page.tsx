import { createEffect, onMount, type ParentComponent } from "solid-js";
import { Stamp } from "./Seal";

interface PageProps {
  /** Browser tab title; suffixed with the site name. */
  title: string;
  /** Optional page heading rendered as an H1. */
  heading?: string;
  /** Optional short lede under the heading. */
  lede?: string;
  /** Kanji for an outlined hanko beside the heading; omit for none. */
  stamp?: string;
}

/**
 * Minimal page scaffold: sets document.title and renders an optional
 * heading/lede above the page content. Content agents can use this or
 * replace it with fully custom markup.
 */
const Page: ParentComponent<PageProps> = (props) => {
  createEffect(() => {
    document.title = `${props.title} · zafu.pro`;
  });

  // Lazy routes mount their content after navigation resolves, so the browser
  // has already given up on scrolling to a cross-page #hash by the time the
  // target exists. Re-run the scroll once this page is in the DOM.
  onMount(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView();
    });
  });

  return (
    <div class="page-in mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      {props.heading && (
        <header class="mb-12 flex items-start justify-between gap-6">
          <div>
            <h1 class="text-4xl sm:text-5xl">{props.heading}</h1>
            {props.lede && <p class="mt-4 max-w-2xl text-muted">{props.lede}</p>}
          </div>
          {props.stamp && <Stamp text={props.stamp} class="mt-2 hidden sm:inline-flex" />}
        </header>
      )}
      {props.children}
    </div>
  );
};

export default Page;
