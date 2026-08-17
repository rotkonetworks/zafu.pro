import { For } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import { useTheme } from "./ThemeProvider";

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
      <div class="max-w-5xl mx-auto px-6 flex items-center justify-between py-4 gap-4">
        <div class="flex items-center gap-6">
          <A
            href="/"
            class="group flex items-center gap-2 font-mono text-lg font-semibold text-text hover:text-accent transition-colors"
            aria-label="zafu.pro home"
          >
            <img
              src="/media/logos/zafu-enso-512.png"
              alt=""
              aria-hidden="true"
              class="h-6 w-6 shrink-0"
            />
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

        <ul class="flex items-center gap-5 list-none">
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
            <a
              href="https://github.com/rotkonetworks/zafu"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-muted hover:text-text transition-colors"
            >
              github
            </a>
          </li>
          <li>
            <button
              type="button"
              onClick={cycleTheme}
              title={`Theme: ${theme()} (click to cycle)`}
              aria-label={`Switch theme, current: ${theme()}`}
              class="text-xs font-mono text-muted hover:text-accent transition-colors border border-border px-2 py-1 bg-transparent cursor-pointer"
            >
              {theme()}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
