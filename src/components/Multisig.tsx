export default function Multisig() {
  return (
    <section class="section-container border-b border-border py-20">
      <h2 class="text-3xl font-bold text-text-em mb-6">FROST Threshold Multisig</h2>
      <p class="text-lg text-dim max-w-2xl mb-12">
        Zafu supports t-of-n FROST threshold signing on both Penumbra and Zcash. Share key material via QR codes, perform distributed signing ceremonies without a single point of failure.
      </p>

      <div class="space-y-px bg-border border border-border">
        <div class="card">
          <h3 class="font-semibold text-text-em mb-2">Distributed Key Generation</h3>
          <p class="text-sm text-dim">Generate threshold keys via QR-based DKG. All participants verify key shares offline.</p>
        </div>
        <div class="card">
          <h3 class="font-semibold text-text-em mb-2">Threshold Signing</h3>
          <p class="text-sm text-dim">Require t-of-n signatures to authorize transactions. No single key can sign alone.</p>
        </div>
        <div class="card">
          <h3 class="font-semibold text-text-em mb-2">Cross-Chain</h3>
          <p class="text-sm text-dim">Create multisig vaults on Penumbra and Zcash. Use same key material across both chains.</p>
        </div>
        <div class="card">
          <h3 class="font-semibold text-text-em mb-2">QR-Only Signing</h3>
          <p class="text-sm text-dim">Sign threshold ceremonies via QR codes. No device-to-device network communication.</p>
        </div>
      </div>
    </section>
  );
}
