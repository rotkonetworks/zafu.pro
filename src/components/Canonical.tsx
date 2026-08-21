import { createEffect } from "solid-js";
import { useLocation } from "@solidjs/router";

/** The one hostname search engines should index. www and the rotko.net names
 *  all resolve here, so every page must point at this origin regardless of
 *  which host served it. */
const CANONICAL_ORIGIN = "https://zafu.pro";

function upsert(selector: string, create: () => HTMLElement, apply: (el: HTMLElement) => void) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  apply(el);
}

/**
 * Keeps <link rel="canonical"> and og:url in step with the current route.
 *
 * This is a single-page app: every route is served the same index.html, so a
 * canonical baked into that file would name ONE url for the whole site and
 * actively tell search engines the other pages are duplicates of it. Setting it
 * per route is the difference between deep pages being indexed and being folded
 * away as alternates.
 *
 * Rendered inside the router root so it covers every route, not just the ones
 * built on <Page>. Query strings and hashes are dropped: they never identify a
 * distinct document here, and leaving them in multiplies one page into many.
 */
export default function Canonical() {
  const location = useLocation();

  createEffect(() => {
    // Normalise: no query, no hash, no trailing slash except at the root.
    const path = location.pathname.replace(/\/+$/, "") || "/";
    const url = `${CANONICAL_ORIGIN}${path}`;

    upsert(
      'link[rel="canonical"]',
      () => {
        const l = document.createElement("link");
        l.setAttribute("rel", "canonical");
        return l;
      },
      (el) => el.setAttribute("href", url),
    );

    upsert(
      'meta[property="og:url"]',
      () => {
        const m = document.createElement("meta");
        m.setAttribute("property", "og:url");
        return m;
      },
      (el) => el.setAttribute("content", url),
    );
  });

  return null;
}
