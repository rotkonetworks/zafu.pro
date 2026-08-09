import { createEffect, type ParentComponent } from "solid-js";
import Hanko from "./Hanko";

interface PageProps {
  /** Browser tab title; suffixed with the site name. */
  title: string;
  /** Optional page heading rendered as an H1. */
  heading?: string;
  /** Optional short lede under the heading. */
  lede?: string;
  /** Kanji for the header seal stamp; pass "" to hide. Default 座蒲 (zafu). */
  stamp?: string;
}

/**
 * Minimal page scaffold: sets document.title and renders an optional
 * heading/lede above the page content. Content agents can use this or
 * replace it with fully custom markup.
 */
const Page: ParentComponent<PageProps> = (props) => {
  createEffect(() => {
    document.title = `${props.title} — zafu.pro`;
  });

  return (
    <div class="page-in max-w-5xl mx-auto px-6 py-16">
      {props.heading && (
        <header class="mb-10 flex items-start justify-between gap-6">
          <div>
            <h1 class="text-3xl font-bold text-text">{props.heading}</h1>
            {props.lede && <p class="text-muted mt-3 max-w-2xl">{props.lede}</p>}
          </div>
          {props.stamp !== "" && <Hanko text={props.stamp} />}
        </header>
      )}
      {props.children}
    </div>
  );
};

export default Page;
