import { For } from "solid-js";
import { A } from "@solidjs/router";
import Page from "../components/Page";
import { Lockup } from "../components/Seal";
import { ZafuHome } from "../components/Screens";
import { Card, Watermark } from "../components/PageKit";
import { CHROME_STORE_URL, ZAFU_RELEASES_URL, ZK_POKER_URL } from "../content/links";

const WAYS = [
  {
    n: "01",
    where: "browser extension",
    name: "zafu",
    href: "/zafu",
    body: "the wallet. send, receive and shield zec, and use penumbra for transfers, swaps and staking.",
  },
  {
    n: "02",
    where: "offline phone",
    name: "zigner",
    href: "/zigner",
    body: "turns a spare android phone into a signer that never goes online. it approves transactions from zafu by qr code.",
  },
  {
    n: "03",
    where: "command line",
    name: "zcli",
    href: "/zcli",
    body: "a zcash wallet for linux and macos, for scripts and servers. it can run with a viewing key only.",
  },
] as const;

const FEATURES = [
  ["shielded by default", "your zec is kept in the shielded pool. coins that arrive at a transparent address are marked as public, and you can shield them in one step."],
  ["a new address every time", "zafu gives you a fresh address each time you show or copy one, so the people who pay you can't link their payments to each other."],
  ["swap", "swap zec for btc, eth, usdc, sol and other coins without leaving the wallet, with no zafu fee during the beta. on penumbra, trade and stake on penumbra's private exchange."],
  ["buy and cash out", "buy zec with revolut, wise, zelle or monzo through peer, right in zafu. to cash out, swap zec to usdc and sell it on peer for money in the same apps."],
  ["hardware signing", "keep your keys off the computer with zigner or a keystone. a ledger works for transparent zec."],
  ["shared wallets", "a wallet that needs approval from several people, such as 2 of 3. each group has a private chat, and people join with a short code."],
  ["contacts and messages", "save contacts and send them encrypted messages from the wallet."],
  ["sign in to apps", "apps can ask you to sign in with zafu. each site gets a different identity, so sites can't tell they are dealing with the same person."],
  ["watch-only wallets", "add a wallet with only its viewing key to follow the balance and history, and sign elsewhere."],
] as const;

export default function Home() {
  return (
    <Page title="held in your own hands, seen by no one">
      <section class="relative grid grid-cols-1 items-center overflow-hidden gap-12 lg:grid-cols-[minmax(0,1fr)_400px]">
        <Watermark sumi="/media/art/bamboo-sumi.webp" washi="/media/art/enso-washi.webp" class="-right-10 -top-8 h-[560px] w-[300px]" />
        <div>
          <Lockup size={34} slogan />
          <h1 class="mt-8 text-5xl leading-tight sm:text-6xl">
            held in your own hands,
            <br />
            seen by no one.
          </h1>
          <p class="mt-6 max-w-lg text-lg text-muted">
            zafu is a wallet for zcash and penumbra. it runs in your browser, keeps your keys on your device, and uses shielded transactions by default.
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
        <h2 class="text-3xl">what zafu does</h2>
        <dl class="mt-8 grid gap-x-10 gap-y-6 md:grid-cols-2">
          <For each={FEATURES}>
            {([t, d]) => (
              <div>
                <dt class="text-text">{t}</dt>
                <dd class="m-0 mt-1 text-sm leading-relaxed text-muted">{d}</dd>
              </div>
            )}
          </For>
        </dl>
      </section>

      <section class="mt-24">
        <h2 class="text-3xl">zafu, zigner and zcli</h2>
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
      </section>

      <section class="mt-24">
        <A href="/zafu/docs#install" class="card block hover:border-border-strong">
          <span class="font-display text-2xl text-text">get started</span>
          <span class="mt-2 block text-sm text-muted">add zafu to chrome, create a wallet and write down the recovery phrase. the install guide covers each step, and how to buy zec.</span>
        </A>
      </section>

      <section class="mt-24">
        <h2 class="text-3xl">around zafu</h2>
        <div class="mt-8 grid gap-4 sm:grid-cols-3">
          <Card href={ZK_POKER_URL} title="zk.poker" tag="beta" body="heads-up hold'em for zec or for free. sign in with zafu." />
          <Card href="https://penumbra.fi" title="penumbra dex" tag="live" body="the penumbra exchange. swap and stake from zafu." />
          <Card href="https://z.cash" title="zcash" tag="ironwood" body="the private currency zafu is built for." />
        </div>
      </section>
    </Page>
  );
}
