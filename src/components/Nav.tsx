import { For } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import { useTheme } from "./ThemeProvider";
import Hanko from "./Hanko";

const SECTIONS = [
  { label: "security", path: "security" },
  { label: "specs", path: "specs" },
  { label: "docs", path: "docs" },
  { label: "roadmap", path: "roadmap" },
] as const;

export default function Nav() {
  const location = useLocation();
  const { theme, cycleTheme } = useTheme();

  const product = () =>
    location.pathname === "/zigner" || location.pathname.startsWith("/zigner/")
      ? "zigner"
      : "zafu";

  const base = () => `/${product()}`;

  return (
    <nav class="border-b border-border sticky top-0 z-50 bg-bg/90 backdrop-blur">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 flex flex-wrap items-center gap-x-4 gap-y-3 py-3 sm:py-4">
        <div class="flex items-center gap-4 sm:gap-6">
          <A
            href="/"
            class="flex items-center gap-2 font-mono text-base text-text hover:text-accent transition-colors"
            aria-label="zafu.pro home"
          >
            <Hanko size={22} tilt={0} />
            <span>
              zafu<span class="text-accent">.</span>pro
            </span>
          </A>
          {/* Product switcher */}
          <div class="flex border border-border text-xs font-mono">
            <A
              href="/zafu"
              class="px-3 py-1 transition-colors"
              classList={{
                "bg-accent text-accent-contrast": product() === "zafu",
                "text-muted hover:text-text": product() !== "zafu",
              }}
            >
              zafu
            </A>
            <A
              href="/zigner"
              class="px-3 py-1 transition-colors border-l border-border"
              classList={{
                "bg-accent text-accent-contrast": product() === "zigner",
                "text-muted hover:text-text": product() !== "zigner",
              }}
            >
              zigner
            </A>
          </div>
        </div>

        <ul class="order-last flex w-full flex-wrap items-center gap-x-4 gap-y-2 list-none sm:order-none sm:ml-auto sm:w-auto sm:gap-5">
          <For each={SECTIONS}>
            {(section) => (
              <li>
                <A
                  href={`${base()}/${section.path}`}
                  class="text-sm transition-colors"
                  activeClass="text-accent"
                  inactiveClass="text-muted hover:text-text"
                >
                  {section.label}
                </A>
              </li>
            )}
          </For>
          <li>
            <A
              href="/blog"
              class="text-sm transition-colors"
              activeClass="text-accent"
              inactiveClass="text-muted hover:text-text"
            >
              blog
            </A>
          </li>
          <li>
            <a
              href="https://github.com/rotkonetworks/zafu"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-muted hover:text-text transition-colors"
            >
              github
            </a>
          </li>
        </ul>
        <button
          type="button"
          onClick={cycleTheme}
          title={`Theme: ${theme()} (click to cycle)`}
          aria-label={`Switch theme, current: ${theme()}`}
          class="ml-auto sm:ml-0 text-xs font-mono text-muted hover:text-accent transition-colors border border-border px-2 py-1 bg-transparent cursor-pointer"
        >
          {theme()}
        </button>
      </div>
    </nav>
  );
}
