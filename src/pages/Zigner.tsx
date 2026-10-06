import { For } from "solid-js";
import Page from "../components/Page";
import { Card, Feature, ProductHead, Watermark } from "../components/PageKit";
import { ZignerAnswer, ZignerHome, ZignerReview, ZignerScan } from "../components/Screens";
import { ZIGNER_FDROID_URL, ZIGNER_RELEASES_URL } from "../content/links";

const LOOP = [
  ["scan", "zafu shows the transaction as a qr code, and zigner scans it with the camera."],
  ["review", "zigner shows what you are about to sign: the amount, the recipient and the fee."],
  ["sign", "hold the button to sign. zigner shows the signature as a qr code, and zafu scans it and sends the transaction."],
] as const;

export default function Zigner() {
  return (
    <Page title="zigner, the offline signer">
      <section class="relative grid grid-cols-1 items-center overflow-hidden gap-12 pb-14 lg:grid-cols-[minmax(0,1fr)_390px]">
        <Watermark sumi="/media/art/castle-sumi.webp" washi="/media/art/castle-washi.webp" class="-right-16 -top-6 h-[600px] w-[440px]" />
        <ProductHead
          name="zigner"
          line="an offline signer for zcash and penumbra. install it on a spare android phone, keep that phone offline, and use it to approve transactions from zafu."
          base="/zigner"
        >
          <a href={ZIGNER_FDROID_URL} class="btn-primary">f-droid repository</a>
          <a href={ZIGNER_RELEASES_URL} class="btn-outline">signed apk</a>
        </ProductHead>
        <div class="relative flex justify-center">
          <ZignerHome />
        </div>
      </section>

      <section class="border-t border-border py-14">
        <h2 class="text-3xl">how signing works</h2>
        <p class="mt-3 max-w-xl text-muted">
          zigner only talks to the outside world through its camera and screen. it uses no network, usb or bluetooth connection, so your keys never leave the phone.
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

      <Feature id="networks" title="zcash and penumbra" body="zigner supports these two networks and nothing else, so it can show you every detail of what you sign.">
        <div class="grid w-full max-w-xl gap-4 sm:grid-cols-2">
          <div class="card">
            <span class="text-text">zcash</span>
            <p class="mt-2 text-sm text-muted">shielded sends, and acting as one of the signers in a shared wallet.</p>
          </div>
          <div class="card">
            <span class="text-text">penumbra</span>
            <p class="mt-2 text-sm text-muted">transfers, swaps, staking, voting and IBC transfers.</p>
          </div>
        </div>
      </Feature>

      <section class="border-t border-border py-14">
        <h2 class="text-3xl">works with</h2>
        <div class="mt-8 grid gap-4 sm:grid-cols-3">
          <Card href="/zafu" title="zafu" tag="extension" body="the setup we recommend: zafu holds a watch-only copy of your wallet, and zigner signs." />
          <Card href="https://vizor.cash/" title="vizor" tag="desktop" body="an independent zcash desktop wallet. zigner works there in place of a keystone." />
          <Card href="https://zodl.com" title="zodl" tag="mobile" body="an independent zcash mobile wallet. tested with zigner for importing a viewing key and signing by qr." />
        </div>
      </section>
    </Page>
  );
}
