import { A } from "@solidjs/router";
import Page from "../../components/Page";
import WalletDemo from "../../components/WalletDemo";

export default function ZafuHome() {
  return (
    <Page title="Zafu" stamp="">
      {/* hero */}
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <h1 class="text-4xl font-bold text-text sm:text-5xl">Zafu</h1>
          <p class="mt-4 max-w-xl text-lg text-muted">
            Zcash &amp; Penumbra wallet as a Chrome extension. Ironwood pool, Penumbra
            swaps, ZID identity, FROST multisig. Cold signing via Zigner or Ledger —
            spending keys never touch an online device.
          </p>
          <div class="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="https://github.com/rotkonetworks/zafu/releases/latest"
              class="transition-opacity hover:opacity-80"
              title="Latest beta — always newest"
            >
              <img src="/badge-github.png" alt="Get it on GitHub" class="h-13 w-auto" />
            </a>
            <a
              href="https://chromewebstore.google.com/detail/zafu-wallet-beta/bhlogefpcebekhjpomlodifcelldoimn"
              class="group relative inline-block transition-opacity hover:opacity-80"
              title="Store build lags releases while reviews land — use the GitHub build for the newest release"
            >
              <img
                src="/badge-chrome.png"
                alt="Available in the Chrome Web Store (outdated build)"
                class="h-13 w-auto opacity-60 grayscale transition group-hover:opacity-80"
              />
              <span class="pointer-events-none absolute -right-1 -top-1 rounded-sm border border-accent/50 bg-bg px-1.5 py-0.5 font-mono text-[10px] leading-none text-accent">
                outdated
              </span>
            </a>
            <A
              href="/zafu/docs#install"
              class="border border-border px-5 py-3 font-mono text-sm text-text transition-colors hover:border-border-strong"
            >
              install guide
            </A>
          </div>
          <p class="mt-4 font-mono text-xs text-muted">
            free · open source · MIT licensed
          </p>
          <p class="mt-2 font-mono text-xs text-dim2">
            the Chrome Web Store build is outdated while reviews land — GitHub has the
            newest release.
          </p>
        </div>
        <WalletDemo class="w-full max-w-lg justify-self-center" />
      </div>

      {/* quick pillars */}
      <div class="mt-16 grid gap-4 sm:grid-cols-3">
        <div class="card">
          <h3 class="text-base font-semibold text-text">Shielded by default</h3>
          <p class="mt-2 text-sm leading-relaxed text-muted">
            Ironwood pool for Zcash; full shielded Penumbra: MEV-free swaps, staking,
            voting, IBC.
          </p>
        </div>
        <div class="card">
          <h3 class="text-base font-semibold text-text">Cold signing</h3>
          <p class="mt-2 text-sm leading-relaxed text-muted">
            Sign via air-gapped Zigner (QR) or Ledger hardware. Client-side proving,
            watch-only mode.
          </p>
        </div>
        <div class="card">
          <h3 class="text-base font-semibold text-text">ZID identity</h3>
          <p class="mt-2 text-sm leading-relaxed text-muted">
            Off-chain identity and social graph. No KYC, no registry, no linkable identifier.
          </p>
        </div>
      </div>

      {/* ecosystem */}
      <div class="mt-20">
        <div class="mb-6 flex items-baseline gap-3">
          <h2 class="text-2xl font-semibold text-text">Ecosystem</h2>
          <span class="font-mono text-xs text-muted">apps built on zafu</span>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <a
            href="https://zkbtc.org"
            class="card group block transition-colors hover:border-border-strong"
          >
            <div class="flex items-baseline justify-between gap-3">
              <h3 class="text-base font-semibold text-text">
                <span class="mr-1.5 text-[#c73e3a]">♦</span>zk.poker
              </h3>
              <span class="shrink-0 border border-border px-1.5 py-0.5 font-mono text-xs uppercase tracking-wider text-muted">
                beta
              </span>
            </div>
            <p class="mt-2 text-sm leading-relaxed text-muted">
              Heads-up hold'em where you see and hear your opponent. Real faces, real ZEC
              stakes or free play in the browser. Pots held in 2-of-3 FROST escrow — the
              first Zafu app.
            </p>
            <p class="mt-3 font-mono text-xs text-accent">zkbtc.org →</p>
          </a>
          <a
            href="https://dex.rotko.net"
            class="card group block transition-colors hover:border-border-strong"
          >
            <div class="flex items-baseline justify-between gap-3">
              <h3 class="text-base font-semibold text-text">dex.rotko.net</h3>
              <span class="shrink-0 border border-border px-1.5 py-0.5 font-mono text-xs uppercase tracking-wider text-muted">
                live
              </span>
            </div>
            <p class="mt-2 text-sm leading-relaxed text-muted">
              Penumbra DEX frontend. Shielded batch swaps with no price discovery to
              validators — MEV-free, no slippage surveillance. Trade straight from Zafu.
            </p>
            <p class="mt-3 font-mono text-xs text-accent">dex.rotko.net →</p>
          </a>
        </div>
      </div>
    </Page>
  );
}
