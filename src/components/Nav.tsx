import { For } from "solid-js";
import { A } from "@solidjs/router";
import { useTheme } from "./ThemeProvider";
import { Seal } from "./Seal";

/** One flat row: the products first, then everything else. No dropdowns. */
export const NAV_LINKS = [
  { label: "zafu", href: "/zafu" },
  { label: "zigner", href: "/zigner" },
  { label: "zcli", href: "/zcli" },
  { label: "cloud agent", href: "/cloud" },
  { label: "get zec", href: "/buy" },
  { label: "roadmap", href: "/roadmap" },
  { label: "blog", href: "/blog" },
] as const;

export default function Nav() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav class="sticky top-0 z-50 border-b border-border bg-bg">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <A href="/" class="flex items-center gap-2.5 text-text" aria-label="zafu.pro home">
          <Seal />
          <span class="font-display text-lg">zafu</span>
        </A>
        <ul class="order-last flex w-full list-none flex-wrap gap-x-5 gap-y-1 p-0 text-sm md:order-none md:ml-auto md:w-auto">
          <For each={NAV_LINKS}>
            {(l) => (
              <li>
                <A href={l.href} activeClass="text-accent" inactiveClass="text-muted hover:text-text">
                  {l.label}
                </A>
              </li>
            )}
          </For>
        </ul>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`switch to ${theme() === "sumi" ? "washi (light)" : "sumi (dark)"}`}
          class="ml-auto h-8 cursor-pointer border border-border bg-transparent px-2.5 text-xs text-muted hover:text-text md:ml-0"
        >
          {theme() === "sumi" ? "washi" : "sumi"}
        </button>
      </div>
    </nav>
  );
}
