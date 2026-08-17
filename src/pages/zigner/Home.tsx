import { A } from "@solidjs/router";
import Page from "../../components/Page";
import { ZignerArt } from "../../components/ProductArt";

export default function ZignerHome() {
  return (
    <Page title="Zigner" stamp="">
      {/* hero */}
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <h1 class="text-4xl font-bold text-text sm:text-5xl">Zigner</h1>
          <p class="mt-4 max-w-xl text-lg text-muted">
            Air-gapped signer for a dedicated Android phone. Spending keys live behind
            StrongBox or TEE hardware; the only channel in or out is the camera and screen.
          </p>
          <div class="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="https://github.com/rotkonetworks/zigner/releases"
              class="transition-opacity hover:opacity-80"
            >
              <img src="/badge-github.png" alt="Get it on GitHub" class="h-13 w-auto" />
            </a>
            <a
              href="https://foss.rotko.net"
              class="transition-opacity hover:opacity-80"
            >
              <img src="/badge-fdroid.png" alt="Get it on F-Droid" class="h-13 w-auto" />
            </a>
            {/* Google Play — hidden until the listing is live; restore this badge then.
            <img
              src="/badge-playstore.png"
              alt="Google Play — coming soon"
              title="coming soon"
              class="h-13 w-auto cursor-default opacity-35 grayscale"
            />
            */}
            <A
              href="/zigner/docs"
              class="border border-border px-5 py-3 font-mono text-sm text-text transition-colors hover:border-border-strong"
            >
              setup guide
            </A>
          </div>
          <p class="mt-4 font-mono text-xs text-muted">
            works on any android · no SIM required · pixel 8+ for StrongBox
          </p>
        </div>
        <ZignerArt class="w-full max-w-lg justify-self-center" />
      </div>

      {/* quick pillars */}
      <div class="mt-16 grid gap-4 sm:grid-cols-3">
        <div class="card">
          <h3 class="text-base font-semibold text-text">Hardware-backed</h3>
          <p class="mt-2 text-sm leading-relaxed text-muted">
            Titan M2 StrongBox on Pixel 8+, TEE elsewhere. AES-256-GCM at the master key.
          </p>
        </div>
        <div class="card">
          <h3 class="text-base font-semibold text-text">QR-only air gap</h3>
          <p class="mt-2 text-sm leading-relaxed text-muted">
            RaptorQ fountain codes over animated QR. No USB, no Bluetooth, no network — ever.
          </p>
        </div>
        <div class="card">
          <h3 class="text-base font-semibold text-text">FROST multisig</h3>
          <p class="mt-2 text-sm leading-relaxed text-muted">
            t-of-n threshold signing with dealerless DKG and nonce-reuse protection.
          </p>
        </div>
      </div>

      {/* companion apps */}
      <div class="mt-20">
        <div class="mb-6 flex items-baseline gap-3">
          <h2 class="text-2xl font-semibold text-text">Works With</h2>
          <span class="font-mono text-xs text-muted">
            zcash ecosystem wallets — zigner speaks the keystone QR format, so it slots
            in wherever keystone is supported
          </span>
        </div>
        <div class="grid gap-4 sm:grid-cols-3">
          <A
            href="/"
            class="card block border-accent transition-opacity hover:opacity-90"
          >
            <div class="flex items-baseline justify-between gap-3">
              <h3 class="text-base font-semibold text-text">Zafu</h3>
              <span class="shrink-0 bg-accent px-1.5 py-0.5 font-mono text-xs font-semibold lowercase text-bg">
                web extension
              </span>
            </div>
            <p class="mt-2 text-sm leading-relaxed text-muted">
              Our Zcash + Penumbra Chrome-extension wallet — Zigner's first-class
              companion. Watch-only mode with QR cold signing is the recommended setup.
            </p>
            <p class="mt-3 font-mono text-xs text-accent">zafu.pro →</p>
          </A>
          <a
            href="https://vizor.cash/"
            class="card block transition-colors hover:border-border-strong"
          >
            <div class="flex items-baseline justify-between gap-3">
              <h3 class="text-base font-semibold text-text">Vizor</h3>
              <span class="shrink-0 font-mono text-xs text-accent">desktop</span>
            </div>
            <p class="mt-2 text-sm leading-relaxed text-muted">
              Third-party self-custody shielded ZEC desktop wallet. Imports
              Keystone-format accounts — use Zigner in place of a Keystone to keep
              spending keys off the desktop.
            </p>
            <p class="mt-3 font-mono text-xs text-accent">vizor.cash →</p>
          </a>
          <a
            href="https://zodl.com"
            class="card block transition-colors hover:border-border-strong"
          >
            <div class="flex items-baseline justify-between gap-3">
              <h3 class="text-base font-semibold text-text">Zodl</h3>
              <span class="shrink-0 font-mono text-xs text-accent">mobile</span>
            </div>
            <p class="mt-2 text-sm leading-relaxed text-muted">
              Third-party Zcash wallet, tested with Zigner: viewing-key import and PCZT
              QR signing work in place of a Keystone. FOSS builds at foss.zodl.com.
            </p>
            <p class="mt-3 font-mono text-xs text-accent">zodl.com →</p>
          </a>
        </div>
      </div>
    </Page>
  );
}
