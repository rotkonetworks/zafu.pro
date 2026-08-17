import { For } from "solid-js";
import Page from "../components/Page";

/**
 * Brand / media kit. Logos, favicons, store + social assets and the palette,
 * served from /public/brand. Static — no keys, no logic.
 */

const PALETTE: Array<{ name: string; hex: string; note?: string }> = [
  { name: "gold", hex: "#f4b728", note: "accent · cold/zigner" },
  { name: "gold-light", hex: "#fcd34d" },
  { name: "gold-dark", hex: "#b8860b" },
  { name: "hanko", hex: "#c73e3a", note: "personality accent" },
  { name: "blue", hex: "#3b82f6", note: "hot/zafu" },
  { name: "canvas", hex: "#0c0a08", note: "bg" },
  { name: "elev-1", hex: "#131009" },
  { name: "elev-2", hex: "#1a1611" },
  { name: "fg-high", hex: "#f2ecdf", note: "text" },
  { name: "fg-muted", hex: "#948a79" },
  { name: "border", hex: "#322a21" },
];

const SIZES = [16, 32, 48, 128];

const Frame = (props: { children: any; tone?: "dark" | "light" | "checker" }) => (
  <div
    class="flex items-center justify-center min-h-[150px] p-5 rounded-lg border border-border"
    classList={{
      "bg-[#0a0a0a]": props.tone !== "light" && props.tone !== "checker",
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
    class="group block rounded-lg border border-border bg-surface overflow-hidden hover:border-border-strong transition-colors"
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
      lede="Logos, favicons, store and social assets. Warm-black, gold, monospace. Click any asset to download."
    >
      <Section title="Palette" sub="Warm-black surfaces. Gold is the cold/zigner accent; vermillion is the personality accent (never a button fill); blue is the hot/zafu side.">
        <div class="grid gap-3" style={{ "grid-template-columns": "repeat(auto-fill,minmax(150px,1fr))" }}>
          <For each={PALETTE}>
            {(c) => (
              <div class="rounded-lg border border-border overflow-hidden bg-surface">
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

      <Section title="Logo — enso" sub="The launch / app mark. Transparent, square with margin.">
        <div class="grid gap-4" style={{ "grid-template-columns": "repeat(auto-fill,minmax(240px,1fr))" }}>
          <Asset src="/media/logos/zafu-enso-512.png" label="enso" meta="512² · alpha" tone="checker" />
          <Asset src="/media/logos/zafu-enso-512.png" label="on dark" meta="#0a0a0a" tone="dark" max="150px" />
          <Asset src="/media/logos/zafu-enso-512.png" label="on light" meta="#f4f4f4" tone="light" max="150px" />
          <Asset src="/media/logos/zafu-logo.png" label="source" meta="png" tone="checker" />
        </div>
      </Section>

      <Section title="Favicon — enso vs Z" sub="The detailed enso blurs into a disc at 16px; the plain Z stays legible small. Rendered at real pixels.">
        <div class="rounded-lg border border-border overflow-hidden">
          <div class="grid text-[11px]" style={{ "grid-template-columns": "auto 1fr 1fr" }}>
            <div class="px-4 py-3 bg-surface text-muted uppercase tracking-[0.1em]">size</div>
            <div class="px-4 py-3 bg-surface text-muted uppercase tracking-[0.1em]">enso</div>
            <div class="px-4 py-3 bg-surface text-muted uppercase tracking-[0.1em]">plain Z</div>
            <For each={SIZES}>
              {(s) => (
                <>
                  <div class="px-4 py-4 text-dim2 border-t border-border flex items-center">{s}²</div>
                  <For each={["enso", "z"]}>
                    {(kind) => (
                      <div class="px-4 py-4 border-t border-border flex items-center gap-4">
                        <div class="bg-[#0a0a0a] rounded p-1.5">
                          <img src={`/media/favicons/${kind}-${s}.png`} width={s} height={s} alt="" />
                        </div>
                        {s < 48 && (
                          <div class="bg-[#0a0a0a] rounded p-1.5">
                            <img
                              src={`/media/favicons/${kind}-${s}.png`}
                              width={s * 3}
                              height={s * 3}
                              style={{ "image-rendering": "pixelated" }}
                              alt=""
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </For>
                </>
              )}
            </For>
          </div>
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
