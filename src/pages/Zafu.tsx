import { A } from "@solidjs/router";
import Page from "../components/Page";
import { Feature, ProductHead, Watermark } from "../components/PageKit";
import { ZafuGroup, ZafuHome, ZafuProving, ZafuReceive, ZafuSend, ZafuSignIn, ZafuWelcome } from "../components/Screens";
import { CHROME_STORE_URL, ZAFU_RELEASES_URL } from "../content/links";
import { PEER_REFERRAL_URL } from "../content/ramps";

export default function Zafu() {
  return (
    <Page title="zafu, the browser extension">
      <section class="relative grid grid-cols-1 items-center overflow-hidden gap-12 pb-14 lg:grid-cols-[minmax(0,1fr)_400px]">
        <Watermark sumi="/media/art/bamboo-sumi.webp" washi="/media/art/enso-washi.webp" class="-right-10 -top-8 h-[560px] w-[300px]" />
        <ProductHead
          name="zafu"
          line="a wallet for zcash and penumbra that runs as a chrome extension. your keys stay on your computer, encrypted with your password."
          base="/zafu"
        >
          <a href={CHROME_STORE_URL} class="btn-primary">add to chrome</a>
          <a href={ZAFU_RELEASES_URL} class="btn-outline">latest release</a>
          <A href="/zafu/docs#install" class="btn text-muted hover:text-text">install guide</A>
        </ProductHead>
        <div class="relative flex justify-center">
          <ZafuWelcome />
        </div>
      </section>

      <Feature id="home" title="home" body="your balance, with shielded funds first. coins sitting in a transparent address are marked as public, and you can shield them in one step.">
        <ZafuHome />
      </Feature>
      <Feature id="send" flip title="send" body="enter the address and amount, then check the summary before you send. zafu prepares the transaction on your computer, which takes a few seconds. you can close the window while it finishes.">
        <ZafuSend />
        <ZafuProving />
      </Feature>
      <Feature id="receive" title="receive" body="zafu gives you a new shielded address each time you show or copy one, so the people who pay you can't link their payments to each other.">
        <ZafuReceive />
      </Feature>
      <Feature id="swap" flip title="swap, buy and sell" body="trade between zec and other coins from the swap screen. to get zec in the first place, or turn it back into money, use peer.">
        <div class="grid w-full max-w-xl gap-4">
          <div class="card">
            <span class="text-text">zec to other coins</span>
            <p class="mt-2 text-sm text-muted">swap zec to or from btc, eth, usdc, sol and more, through near intents or thorchain. both are outside services that zafu does not run. zafu charges no fee of its own during the beta.</p>
          </div>
          <div class="card">
            <span class="text-text">on penumbra</span>
            <p class="mt-2 text-sm text-muted">swaps run on penumbra's own exchange, which keeps your trades private. no outside service is involved.</p>
          </div>
          <a href={PEER_REFERRAL_URL} class="card block hover:border-border-strong">
            <span class="text-text">buy and sell with peer</span>
            <p class="mt-2 text-sm text-muted">buy: pay a seller with revolut, wise, zelle or monzo and the zec arrives in zafu. cash out: swap zec to usdc and sell it on peer to receive money in the same apps. peer is an outside service.</p>
          </a>
        </div>
      </Feature>
      <Feature id="groups" title="groups" body="a shared wallet that needs approval from several people, such as 2 of 3. each group has its own private chat, and people join with a short code.">
        <ZafuGroup />
      </Feature>
      <Feature id="apps" flip title="sign in to apps" body="sites like zk.poker can ask you to sign in with zafu. each site sees a different identity, so sites can't tell they are dealing with the same person.">
        <ZafuSignIn />
      </Feature>
    </Page>
  );
}
