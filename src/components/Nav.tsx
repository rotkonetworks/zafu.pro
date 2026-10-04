import { createEffect, createSignal, For, onCleanup, Show } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import { useTheme } from "./ThemeProvider";
import { Lockup } from "./Seal";

type NavLink = { label: string; href: string; note?: string };
type NavItem = NavLink & { sub?: readonly NavLink[] };

/** The products, each with its own pages in a dropdown, then the docs and the blog. */
export const NAV: readonly NavItem[] = [
  {
    label: "zafu",
    href: "/zafu",
    sub: [
      { label: "overview", href: "/zafu" },
      { label: "docs", href: "/zafu/docs" },
      { label: "security", href: "/zafu/security" },
      { label: "specs", href: "/zafu/specs" },
    ],
  },
  {
    label: "zigner",
    href: "/zigner",
    sub: [
      { label: "overview", href: "/zigner" },
      { label: "docs", href: "/zigner/docs" },
      { label: "security", href: "/zigner/security" },
      { label: "specs", href: "/zigner/specs" },
    ],
  },
  {
    label: "zcli",
    href: "/zcli",
    sub: [
      { label: "overview", href: "/zcli" },
      { label: "cloud agent", href: "/cloud", note: "planned" },
    ],
  },
  {
    label: "docs",
    href: "/zafu/docs",
    sub: [
      { label: "zafu", href: "/zafu/docs" },
      { label: "zigner", href: "/zigner/docs" },
    ],
  },
  { label: "blog", href: "/blog" },
];

/** Flat list for the footer: the top-level entries only. */
export const NAV_LINKS: readonly NavLink[] = NAV.map(({ label, href }) => ({ label, href }));

function Menu(props: { item: NavItem }) {
  const location = useLocation();
  const [open, setOpen] = createSignal(false);
  let el!: HTMLLIElement;

  // close on navigation, and on a click or tap anywhere else
  createEffect(() => { location.pathname; location.hash; setOpen(false); });
  const away = (e: PointerEvent) => { if (!el.contains(e.target as Node)) setOpen(false); };
  document.addEventListener("pointerdown", away);
  onCleanup(() => document.removeEventListener("pointerdown", away));

  const active = () => (props.item.sub ?? [props.item]).some((s) => location.pathname === s.href || location.pathname.startsWith(`${s.href}/`));

  return (
    <li
      ref={el}
      class="relative"
      onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
    >
      <button
        type="button"
        aria-expanded={open()}
        aria-haspopup="true"
        onClick={() => setOpen(!open())}
        class={`flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 font-[inherit] text-sm ${active() ? "text-accent" : "text-muted hover:text-text"}`}
      >
        {props.item.label}
        <span aria-hidden="true" class={`text-[10px] transition-transform ${open() ? "rotate-180" : ""}`}>▾</span>
      </button>
      <Show when={open()}>
        <ul class="absolute left-0 top-full z-50 m-0 min-w-40 list-none border border-border bg-surface p-0 py-1 shadow-lg">
          <For each={props.item.sub}>
            {(s) => (
              <li>
                <A
                  href={s.href}
                  end
                  activeClass="text-accent"
                  inactiveClass="text-muted hover:text-text"
                  class="flex items-baseline justify-between gap-4 px-3 py-1.5 hover:bg-surface-2"
                >
                  {s.label}
                  <Show when={s.note}>
                    <span class="text-[10px] text-dim2">{s.note}</span>
                  </Show>
                </A>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </li>
  );
}

export default function Nav() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav class="sticky top-0 z-50 border-b border-border bg-bg">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <A href="/" aria-label="zafu.pro home">
          <Lockup />
        </A>
        <ul class="order-last flex w-full list-none flex-wrap gap-x-5 gap-y-1 p-0 text-sm md:order-none md:ml-auto md:w-auto">
          <For each={NAV}>
            {(item) =>
              item.sub ? (
                <Menu item={item} />
              ) : (
                <li>
                  <A href={item.href} activeClass="text-accent" inactiveClass="text-muted hover:text-text">
                    {item.label}
                  </A>
                </li>
              )
            }
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
