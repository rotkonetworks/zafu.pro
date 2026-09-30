import { For } from "solid-js";
import Page from "../components/Page";
import { Card, Feature, ProductHead, Watermark } from "../components/PageKit";
import { ZignerAnswer, ZignerHome, ZignerReview, ZignerScan } from "../components/Screens";
import { ZIGNER_FDROID_URL, ZIGNER_RELEASES_URL } from "../content/links";

const LOOP = [
  ["scan", "zafu shows the request as an animated qr code. zigner reads it with the camera."],
  ["review", "zigner decodes it against your own keys and shows what you are signing, in full."],
  ["answer", "hold to sign. the signature comes back as a qr code for zafu to read and send."],
] as const;

export default function Zigner() {
  return (
    <Page title="zigner, the offline signer">
      <section class="relative grid grid-cols-1 items-center gap-12 pb-14 lg:grid-cols-[minmax(0,1fr)_390px]">
        <Watermark sumi="/media/art/castle-sumi.webp" washi="/media/art/castle-washi.webp" class="-right-16 -top-6 h-[600px] w-[440px]" />
        <ProductHead
          name="zigner"
          line="keys that never go online. an air-gapped signer for a spare android phone, for zcash and penumbra."
          base="/zigner"
          note="the screens on this page are the 1.0 design, which arrives in q4 2026."
        >
          <a href={ZIGNER_FDROID_URL} class="btn-primary">f-droid repository</a>
          <a href={ZIGNER_RELEASES_URL} class="btn-outline">signed apk</a>
        </ProductHead>
        <div class="relative flex justify-center">
          <ZignerHome />
        </div>
      </section>

      <section class="border-t border-border py-14">
        <h2 class="text-3xl">scan, review, answer</h2>
        <p class="mt-3 max-w-xl text-muted">
          the camera and the screen are the only way in or out. no usb, no bluetooth, no network. each qr code carries one network, so a zcash request is never read as a penumbra one.
        </p>
        <div class="mt-10 grid justify-items-center gap-8 lg:grid-cols-3">
          <For each={[ZignerScan, ZignerReview, ZignerAnswer]}>
            {(S, i) => (
              <figure class="m-0 flex w-full max-w-[390px] flex-col gap-4">
                <S />
                <figcaption class="text-sm text-muted">
                  <span class="text-text">{LOOP[i()][0]}</span> · {LOOP[i()][1]}
                </figcaption>
              </figure>
            )}
          </For>
        </div>
      </section>

      <Feature id="networks" title="two networks, kept apart" body="zcash and penumbra, nothing else, so the review screen can describe every field it signs.">
        <div class="grid w-full max-w-xl gap-4 sm:grid-cols-2">
          <div class="card">
            <span class="text-text">zcash</span>
            <p class="mt-2 text-sm text-muted">shielded ironwood sends as PCZT, and a seat in a FROST group.</p>
          </div>
          <div class="card">
            <span class="text-text">penumbra</span>
            <p class="mt-2 text-sm text-muted">transfers, swaps, staking, voting and IBC, from the same phone.</p>
          </div>
        </div>
      </Feature>

      <section class="border-t border-border py-14">
        <h2 class="text-3xl">works with</h2>
        <div class="mt-8 grid gap-4 sm:grid-cols-3">
          <Card href="/zafu" title="zafu" tag="extension" body="the first companion. a watch-only zafu wallet with zigner signing is the setup we suggest." />
          <Card href="https://vizor.cash/" title="vizor" tag="desktop" body="an independent shielded zec desktop wallet. zigner can stand in for a keystone there." />
          <Card href="https://zodl.com" title="zodl" tag="mobile" body="an independent zcash wallet, tested with zigner for viewing-key import and qr signing." />
        </div>
      </section>
    </Page>
  );
}
