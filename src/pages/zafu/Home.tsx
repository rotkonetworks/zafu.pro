import { For } from "solid-js";
import { A } from "@solidjs/router";
import Page from "../../components/Page";
import Hanko from "../../components/Hanko";
import WalletDemo from "../../components/WalletDemo";
import { LinkList } from "../../components/PageKit";
import { RAMP_LINKS, RAMPS_NOTE } from "../../content/ramps";

const PILLARS = [
  {
    title: "shielded by default",
    body: "ironwood for zcash, with a fresh receive address every time. penumbra for private swaps, staking and IBC.",
  },
  {
    title: "cold signing",
    body: "zigner or keystone over QR, ledger for transparent zec. proofs are made on your device.",
  },
  {
    title: "ZID identity",
    body: "off-chain identity, private contact discovery, post-quantum messages. no KYC, no registry.",
  },
];

/** External card: title, small tag, one line of copy, destination. */
function Card(props: { href: string; title: string; tag: string; body: string; seal?: boolean }) {
  return (
    <a href={props.href} class="card group block transition-colors hover:border-border-strong">
      <div class="flex items-baseline justify-between gap-3">
        <h3 class="text-base text-text">
          {props.seal && <span class="mr-1.5 text-hanko">♦</span>}
          {props.title}
        </h3>
        <span class="shrink-0 border border-border px-1.5 py-0.5 font-mono text-xs tracking-wider text-muted">
          {props.tag}
        </span>
      </div>
      <p class="mt-2 text-sm leading-relaxed text-muted">{props.body}</p>
      <p class="mt-3 font-mono text-xs text-accent">
        {props.href.replace(/^https:\/\//, "")} →
      </p>
    </a>
  );
}

function SectionHead(props: { title: string; sub: string }) {
  return (
    <div class="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <h2 class="text-2xl text-text">{props.title}</h2>
      <span class="font-mono text-xs text-muted">{props.sub}</span>
    </div>
  );
}

export default function ZafuHome() {
  return (
    <Page title="Zafu" stamp="">
      {/* hero art: the samurai on the zafu, the gold-and-ink enso */}
      <figure class="m-0 border border-border bg-surface">
        <picture>
          <source
            media="(max-width: 640px)"
            srcset="/media/hero/samurai-crop-800.webp"
            type="image/webp"
          />
          <source
            srcset="/media/hero/samurai-960.webp 960w, /media/hero/samurai-1600.webp 1600w"
            sizes="(max-width: 1024px) 100vw, 1024px"
            type="image/webp"
          />
          <img
            src="/media/social/cover.png"
            alt="ink painting: a samurai sits on a zafu cushion facing a gold-and-ink enso with the calligraphy 秘署"
            width="1983"
            height="793"
            class="block h-auto w-full aspect-[1320/793] object-cover sm:aspect-[1983/793]"
          />
        </picture>
      </figure>

      {/* hero copy + demo */}
      <div class="mt-12 grid items-center gap-12 lg:grid-cols-2">
        <div>
          <div class="flex items-center gap-4">
            <h1 class="text-5xl text-text sm:text-6xl">zafu</h1>
            <Hanko size={44} tilt={-4} />
          </div>
          <p class="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            a private wallet for zcash and penumbra, in your browser. shielded by
            default, signed cold, proved on your device.
          </p>
          <div class="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="https://chromewebstore.google.com/detail/zafu-wallet-beta/bhlogefpcebekhjpomlodifcelldoimn"
              class="transition-opacity hover:opacity-80"
              title="Install Zafu from the Chrome Web Store"
            >
              <img
                src="/badge-chrome.png"
                alt="Available in the Chrome Web Store"
                class="h-13 w-auto"
              />
            </a>
            <a
              href="https://github.com/rotkonetworks/zafu/releases/latest"
              class="transition-opacity hover:opacity-80"
              title="Latest beta build, ahead of the store when a review is pending"
            >
              <img src="/badge-github.png" alt="Get it on GitHub" class="h-13 w-auto" />
            </a>
            <A href="/zafu/docs#install" class="btn-outline font-mono">
              install guide
            </A>
          </div>
          <p class="mt-4 font-mono text-xs text-muted">free · open source · MIT licensed</p>
        </div>
        <WalletDemo class="w-full max-w-lg justify-self-center" />
      </div>

      {/* pillars */}
      <div class="mt-16 grid gap-4 sm:grid-cols-3">
        <For each={PILLARS}>
          {(p) => (
            <div class="card">
              <h3 class="text-base text-text">{p.title}</h3>
              <p class="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
            </div>
          )}
        </For>
      </div>

      {/* fiat ramps */}
      <div id="get-zec" class="mt-20 scroll-mt-24">
        <SectionHead title="get zec / cash out" sub="buy and sell with the apps you already use" />
        <LinkList items={RAMP_LINKS} cols={3} />
        <p class="mt-4 max-w-2xl font-mono text-xs leading-relaxed text-muted">{RAMPS_NOTE}</p>
      </div>

      {/* ecosystem */}
      <div class="mt-20">
        <SectionHead title="ecosystem" sub="apps built on zafu" />
        <div class="grid gap-4 sm:grid-cols-2">
          <Card
            href="https://zkbtc.org"
            title="zk.poker"
            tag="beta"
            seal
            body="heads-up hold'em where you see and hear your opponent. real zec stakes or free play, pots held in 2-of-3 FROST escrow."
          />
          <Card
            href="https://penumbra.fi"
            title="penumbra dex"
            tag="live"
            body="shielded batch swaps with no price discovery to validators: no MEV, no slippage surveillance. trade straight from zafu."
          />
        </div>
      </div>

      {/* networks */}
      <div class="mt-20">
        <SectionHead title="networks" sub="what zafu is built on" />
        <div class="grid gap-4 sm:grid-cols-2">
          <Card
            href="https://z.cash"
            title="zcash"
            tag="ironwood"
            body="encrypted money with client-side proving. ironwood is the active pool; orchard is legacy, migrate-only through the NU6.3 turnstile."
          />
          <Card
            href="https://penumbra.fi"
            title="penumbra"
            tag="decaf377"
            body="encrypted defi: batch swaps on the dex, staking, governance voting and IBC transfers, private by default."
          />
        </div>
      </div>
    </Page>
  );
}
