export default function Hero() {
  return (
    <section class="section-container border-b border-border py-32">
      <div class="font-mono text-xs font-semibold letter-spacing-0.12em text-dim2 uppercase mb-5">
        Privacy Wallet
      </div>
      <h1 class="text-5xl font-bold text-text-em mb-6 leading-tight">
        Zafu for <span class="text-accent">Chrome</span>
      </h1>
      <p class="text-lg text-dim max-w-2xl mb-8 leading-relaxed">
        Privacy-first wallet for Zcash shielded transactions and Penumbra DeFi. Air-gapped cold signing via Zigner, FROST multisig, watch-only mode. Open source, MIT license.
      </p>
      <div class="flex gap-3 flex-wrap">
        <a href="https://chromewebstore.google.com/detail/zafu" class="btn-primary">
          Install from Chrome Web Store
        </a>
        <a href="https://github.com/rotkonetworks/zafu/releases" class="btn-outline">
          GitHub Releases
        </a>
      </div>
    </section>
  );
}
