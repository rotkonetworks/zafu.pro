import { For } from "solid-js";
import { A } from "@solidjs/router";
import Page from "../components/Page";
import { Seal } from "../components/Seal";
import { ZafuHome } from "../components/Screens";
import { Card, Watermark } from "../components/PageKit";
import { CHROME_STORE_URL, ZAFU_RELEASES_URL, ZK_POKER_URL } from "../content/links";

const WAYS = [
  {
    n: "01",
    where: "in the browser",
    name: "zafu",
    href: "/zafu",
    body: "the extension keeps your keys encrypted with your password and builds every proof on your computer.",
  },
  {
    n: "02",
    where: "on an offline phone",
    name: "zigner",
    href: "/zigner",
    body: "keys stay on an android phone that never goes online. zafu shows a qr code, zigner signs, zafu reads the answer.",
  },
  {
    n: "03",
    where: "on your own machine",
    name: "zcli",
    href: "/zcli",
    body: "a command-line wallet and daemon for terminals, scripts and servers. it can run watch-only and leave signing to you.",
  },
] as const;

export default function Home() {
  return (
    <Page title="shielded money, held in your own hands">
      <section class="relative grid grid-cols-1 items-center overflow-hidden gap-12 lg:grid-cols-[minmax(0,1fr)_400px]">
        <Watermark sumi="/media/art/bamboo-sumi.webp" washi="/media/art/enso-washi.webp" class="-right-10 -top-8 h-[560px] w-[300px]" />
        <div>
          <span class="flex items-center gap-3">
            <Seal size={34} />
            <span class="font-display text-2xl text-text">zafu</span>
          </span>
          <h1 class="mt-8 text-5xl leading-tight sm:text-6xl">
            shielded money,
            <br />
            held in your own hands.
          </h1>
          <p class="mt-6 max-w-lg text-lg text-muted">
            a wallet for zcash, and penumbra too. private by default, and the keys stay with you.
          </p>
          <div class="mt-9 flex flex-wrap gap-3">
            <a href={CHROME_STORE_URL} class="btn-primary">add to chrome</a>
            <a href={ZAFU_RELEASES_URL} class="btn-outline">latest release</a>
            <A href="/zafu/docs#install" class="btn text-muted hover:text-text">install guide</A>
          </div>
          <p class="mt-5 text-xs text-muted">free · open source · MIT licensed</p>
        </div>
        <div class="relative flex justify-center">
          <ZafuHome />
        </div>
      </section>

      <section class="mt-24">
        <h2 class="text-3xl">three ways to hold your keys</h2>
        <div class="mt-8 grid gap-4 md:grid-cols-3">
          <For each={WAYS}>
            {(w) => (
              <A href={w.href} class="card flex flex-col hover:border-border-strong">
                <span class="text-xs text-muted">{w.n} · {w.where}</span>
                <span class="mt-3 font-display text-2xl text-text">{w.name}</span>
                <span class="mt-2 text-sm leading-relaxed text-muted">{w.body}</span>
                <span class="mt-auto pt-4 text-xs text-accent">about {w.name}</span>
              </A>
            )}
          </For>
        </div>
        <p class="mt-5 text-sm text-muted">
          planned: zcli as an always-on agent that we run for you.{" "}
          <A href="/cloud" class="accent-link">the cloud agent</A>
        </p>
      </section>

      <section class="mt-24 grid gap-4 md:grid-cols-2">
        <A href="/buy" class="card hover:border-border-strong">
          <span class="font-display text-2xl text-text">get zec, or cash out</span>
          <span class="mt-2 block text-sm text-muted">buy through peer, sell through zcashto.cash. both are outside services.</span>
        </A>
        <A href="/roadmap" class="card hover:border-border-strong">
          <span class="font-display text-2xl text-text">road to 1.0</span>
          <span class="mt-2 block text-sm text-muted">the wallet is complete in q4 2026. what shipped and what is left.</span>
        </A>
      </section>

      <section class="mt-24">
        <h2 class="text-3xl">around zafu</h2>
        <div class="mt-8 grid gap-4 sm:grid-cols-3">
          <Card href={ZK_POKER_URL} title="zk.poker" tag="beta" body="heads-up hold'em for zec or free play, with pots in a 2 of 3 FROST escrow." />
          <Card href="https://penumbra.fi" title="penumbra dex" tag="live" body="penumbra: shielded batch swaps, staking and IBC, used straight from zafu." />
          <Card href="https://z.cash" title="zcash" tag="ironwood" body="encrypted money. ironwood is the active shielded pool." />
        </div>
      </section>
    </Page>
  );
}
