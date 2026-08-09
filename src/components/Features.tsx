export default function Features() {
  const features = [
    {
      title: "Privacy First",
      desc: "Penumbra and Zcash shielded transactions. Zero-knowledge proofs. Client-side state.",
    },
    {
      title: "Air-Gapped Signing",
      desc: "Pair with Zigner device for hot/cold separation. Sign via QR codes only. No private keys on web.",
    },
    {
      title: "FROST Multisig",
      desc: "t-of-n threshold signing. QR-based DKG. Works on both Penumbra and Zcash.",
    },
    {
      title: "Watch-Only Mode",
      desc: "View transactions with viewing keys only. Perfect for delegation and monitoring.",
    },
    {
      title: "Multichain",
      desc: "Penumbra DeFi, Zcash Orchard pool, IBC bridges. All in one extension.",
    },
    {
      title: "Open Source",
      desc: "MIT license. Full source on GitHub. Community auditable.",
    },
  ];

  return (
    <section id="features" class="section-container border-b border-border py-20">
      <h2 class="text-3xl font-bold text-text-em mb-12">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
        {features.map((feature) => (
          <div class="card">
            <h3 class="font-semibold text-text-em mb-2">{feature.title}</h3>
            <p class="text-sm text-dim leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
