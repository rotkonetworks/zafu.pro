import { A } from "@solidjs/router";
import Page from "../components/Page";
import { Feature, ProductHead, Watermark } from "../components/PageKit";
import { ZafuGroup, ZafuHome, ZafuProving, ZafuReceive, ZafuSend, ZafuSignIn, ZafuWelcome } from "../components/Screens";
import { CHROME_STORE_URL, ZAFU_RELEASES_URL } from "../content/links";

export default function Zafu() {
  return (
    <Page title="zafu, the browser extension">
      <section class="relative grid grid-cols-1 items-center overflow-hidden gap-12 pb-14 lg:grid-cols-[minmax(0,1fr)_400px]">
        <Watermark sumi="/media/art/bamboo-sumi.webp" washi="/media/art/enso-washi.webp" class="-right-10 -top-8 h-[560px] w-[300px]" />
        <ProductHead
          name="zafu"
          line="the browser extension. a shielded wallet for zcash and penumbra that builds every proof on your own computer."
          base="/zafu"
          note="the screens on this page are the 1.0 design, which arrives in q4 2026. today's release looks different, and features still being finished are marked."
        >
          <a href={CHROME_STORE_URL} class="btn-primary">add to chrome</a>
          <a href={ZAFU_RELEASES_URL} class="btn-outline">latest release</a>
          <A href="/zafu/docs#install" class="btn text-muted hover:text-text">install guide</A>
        </ProductHead>
        <div class="relative flex justify-center">
          <ZafuWelcome />
        </div>
      </section>

      <Feature id="home" title="home" body="one balance, shielded first. coins in a transparent address are marked public, with a way to shield them.">
        <ZafuHome />
      </Feature>
      <Feature id="send" flip title="send" body="a form, then a review. the proof is made on this computer, and zafu shows each step while it works. you may close the window; it carries on.">
        <ZafuSend />
        <ZafuProving />
      </Feature>
      <Feature id="receive" title="receive" body="a fresh shielded address each time you show or copy one, so separate payments are not linked by address.">
        <ZafuReceive />
      </Feature>
      <Feature id="groups" flip title="groups" body="a FROST multisig with its own sealed chat. co-signers join with a short room code. payments that wait for the other seals are being finished for 1.0.">
        <ZafuGroup />
      </Feature>
      <Feature id="apps" title="apps and identity" body="apps such as zk.poker ask zafu to sign in. each site gets its own identity key, so sites cannot link you to one another.">
        <ZafuSignIn />
      </Feature>
    </Page>
  );
}
