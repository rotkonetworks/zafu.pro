import { For } from "solid-js";
import Page from "../components/Page";

/**
 * Brand / media kit. Logos, favicons, store + social assets and the palette,
 * served from /public/brand. Static - no keys, no logic.
 */

const PALETTE = [
  { name: "canvas", hex: "#0c0a08", note: "bg" },
  { name: "elev-1", hex: "#131009" },
  { name: "elev-2", hex: "#1a1611" },
  { name: "line", hex: "#241f18" },
  { name: "ink", hex: "#f2ecdf", note: "text" },
  { name: "muted", hex: "#948a79" },
  { name: "gold", hex: "#f4b728", note: "action" },
  { name: "hanko", hex: "#c73e3a", note: "seal only" },
];

const SIZES = [16, 32, 48, 128];

const Frame = (props: { children: any; tone?: "dark" | "light" | "checker" }) => (
  <div
    class="flex items-center justify-center min-h-[150px] p-5 border border-border"
    classList={{
      "bg-[#0c0a08]": props.tone !== "light" && props.tone !== "checker",
      "bg-[#f4f4f4]": props.tone === "light",
    }}
    style={
      props.tone === "checker"
        ? {
            "background-image":
              "conic-gradient(#1a1611 90deg,#131009 90deg 180deg,#1a1611 180deg 270deg,#131009 270deg)",
            "background-size": "20px 20px",
          }
        : undefined
    }
  >
    {props.children}
  </div>
);

const Asset = (props: { src: string; label: string; meta: string; tone?: "dark" | "light" | "checker"; max?: string }) => (
  <a
    href={props.src}
    download=""
    class="group block border border-border bg-surface overflow-hidden hover:border-border-strong transition-colors"
  >
    <Frame tone={props.tone}>
      <img src={props.src} alt={props.label} class="max-w-full" style={{ "max-height": props.max ?? "200px" }} />
    </Frame>
    <div class="flex items-center justify-between gap-2 px-3 py-2.5 border-t border-border text-xs">
      <span class="text-text">{props.label}</span>
      <span class="text-muted group-hover:text-accent transition-colors">{props.meta} ↓</span>
    </div>
  </a>
);

const Section = (props: { title: string; sub?: string; children: any }) => (
  <section class="mt-14">
    <h2 class="text-xs uppercase tracking-[0.14em] text-muted pb-2.5 mb-5 border-b border-border">
      {props.title}
    </h2>
    {props.sub && <p class="text-muted text-xs -mt-3 mb-5 max-w-2xl">{props.sub}</p>}
    {props.children}
  </section>
);

export default function Brand() {
  return (
    <Page
      title="Brand"
      heading="Brand & media kit"
      lede="logos, favicons, store and social assets. sumi ink, one gold, one seal. click any asset to download."
    >
      <Section title="Palette" sub="warm-black sumi surfaces. gold is the single action colour; hanko red marks the seal and nothing else.">
        <div class="grid gap-3" style={{ "grid-template-columns": "repeat(auto-fill,minmax(150px,1fr))" }}>
          <For each={PALETTE}>
            {(c) => (
              <div class="border border-border overflow-hidden bg-surface">
                <div class="h-16" style={{ "background-color": c.hex }} />
                <div class="px-2.5 py-2 text-[11px]">
                  <div class="text-text">
                    {c.name}
                    {c.note && <span class="text-dim2"> · {c.note}</span>}
                  </div>
                  <div class="text-muted uppercase">{c.hex}</div>
                </div>
              </div>
            )}
          </For>
        </div>
      </Section>

      <Section title="Type" sub="iosevka term for body and data; shippori mincho for display headings and big numbers. square corners, lowercase voice.">
        <div class="grid gap-3 sm:grid-cols-2">
          <div class="border border-border bg-surface p-5">
            <div class="font-display text-3xl text-text">匿 12.4501</div>
            <div class="mt-2 text-[11px] text-muted">shippori mincho · display</div>
          </div>
          <div class="border border-border bg-surface p-5">
            <div class="font-mono text-sm text-text">u1qz8k...4mre · synced</div>
            <div class="mt-2 text-[11px] text-muted">iosevka term · body, data</div>
          </div>
        </div>
      </Section>

      <Section title="seal" sub="the zafu mark: 匿 on vermillion. vector master, with png sizes tuned by hand for 16, 32 and 48.">
        <div class="grid gap-4" style={{ "grid-template-columns": "repeat(auto-fill,minmax(240px,1fr))" }}>
          <Asset src="/media/favicons/seal.svg" label="vector" meta="svg · paths, no font" tone="checker" />
          <Asset src="/media/logos/zafu-seal-512.png" label="on dark" meta="512² png" tone="dark" max="150px" />
          <Asset src="/media/logos/zafu-seal-512.png" label="on light" meta="512² png" tone="light" max="150px" />
        </div>
        <div class="mt-4 flex flex-wrap items-end gap-6 border border-border p-5">
          <For each={SIZES}>
            {(s) => (
              <div class="flex flex-col items-center gap-2 text-[11px] text-muted">
                <img src={`/media/favicons/seal-${s}.png`} width={s} height={s} alt="" />
                {s}²
              </div>
            )}
          </For>
        </div>
      </Section>

      <Section title="Chrome Web Store">
        <div class="grid gap-4" style={{ "grid-template-columns": "repeat(auto-fill,minmax(240px,1fr))" }}>
          <Asset src="/media/store/marquee-1400x560.png" label="marquee" meta="1400×560" tone="dark" />
          <Asset src="/media/store/small-tile-440x280.png" label="small tile" meta="440×280" tone="dark" />
          <Asset src="/media/store/screenshot-1280x800.png" label="screenshot" meta="1280×800" tone="dark" />
          <Asset src="/media/store/screenshot-640x400.png" label="screenshot" meta="640×400" tone="dark" />
        </div>
      </Section>

      <Section title="Social">
        <div class="grid gap-4" style={{ "grid-template-columns": "repeat(auto-fill,minmax(240px,1fr))" }}>
          <Asset src="/media/social/cover.png" label="cover" meta="banner" tone="dark" />
          <Asset src="/media/social/profile.png" label="profile" meta="avatar" tone="checker" max="160px" />
        </div>
      </Section>
    </Page>
  );
}
