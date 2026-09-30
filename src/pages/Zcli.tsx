import { For } from "solid-js";
import Page from "../components/Page";
import SpecItem from "../components/SpecItem";
import { CodeBlock, SpecGrid, SubSection } from "../components/PageKit";
import { ZCLI_AUR_URL, ZCLI_GITHUB_URL, ZCLI_RELEASES_URL } from "../content/links";

// Commands are copied from the zcli README (github.com/rotkonetworks/zcli).
const QUICKSTART = `zcli init sync
zcli view balance --json
zcli tx send 0.1 u1... --memo "invoice 42" --dry-run --json`;

const COMMANDS = `zcli view        balance | address | notes | history | export        (alias: v)
zcli transaction send | shield | migrate                             (alias: tx)
zcli signer      export-notes | scan | verify                        (alias: s)
zcli multisig    host | join | dealer | dkg-part1..3 | sign-* | ...   (alias: ms)
zcli init        create | import-fvk | sync | phrase | migrate
zcli service     merchant | board | license-server | tree-info`;

const DAEMON = `zclid -i ~/.ssh/id_ed25519                           # unix socket only
zclid -i ~/.ssh/id_ed25519 --listen 127.0.0.1:9067   # + TCP for agents`;

const FEATURES = [
  { title: "json everywhere", value: "--json", description: "machine-readable output with no prompts, progress bars or qr codes. ZCLI_JSON=1 does the same." },
  { title: "keys you already have", value: "ssh · bip39", description: "the seed is an ed25519 ssh key or a mnemonic, so the same key gives the same wallet on any host." },
  { title: "watch-only", value: "-w", description: "run with a viewing key only. zcli builds and proves; a person or a signer authorizes elsewhere." },
  { title: "dry runs", value: "--dry-run", description: "select notes, compute the fee and prove the transaction, without broadcasting it." },
  { title: "a daemon", value: "zclid", description: "keeps the wallet at the chain tip and serves it over gRPC, on a unix socket or an authenticated tcp port." },
  { title: "FROST multisig", value: "zcli ms", description: "host a key generation, share the room code, and co-signers join. dealer and manual rounds too." },
  { title: "zigner", value: "zcli signer", description: "export notes as an animated qr for zigner, and scan the signed answer back from a webcam." },
  { title: "verification", value: "zcli signer verify", description: "checks the header chain proof, note and nullifier proofs, and independent nodes before trusting a server." },
  { title: "merchant mode", value: "zcli service", description: "payment requests on fresh addresses, signed webhooks, and forwarding to a cold address." },
];

export default function Zcli() {
  return (
    <Page title="zcli, the command-line wallet">
      <section class="grid grid-cols-1 items-center gap-12 pb-4 lg:grid-cols-2">
        <div>
          <h1 class="text-5xl sm:text-6xl">zcli</h1>
          <p class="mt-5 max-w-lg text-lg text-muted">
            a zcash wallet for terminals, scripts and servers. every command can answer in json, and a daemon keeps the wallet at the chain tip.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a href={ZCLI_RELEASES_URL} class="btn-primary">latest release</a>
            <a href={ZCLI_GITHUB_URL} class="btn-outline">source</a>
          </div>
          <p class="mt-5 text-xs text-muted">MIT licensed · verifies what the server sends before believing it</p>
        </div>
        <CodeBlock code={QUICKSTART} caption="sync, check the balance, and prove a send without broadcasting it." />
      </section>

      <SubSection id="install" title="install">
        <SpecGrid cols={2}>
          <a href={ZCLI_RELEASES_URL} class="block">
            <SpecItem title="release binaries" value="github" description="zcli and zclid for linux (x86_64, aarch64) and macos (intel, apple silicon), with sha256 sums." />
          </a>
          <a href={ZCLI_AUR_URL} class="block">
            <SpecItem title="arch linux" value="zcli-git" description="built from source on the AUR." />
          </a>
        </SpecGrid>
      </SubSection>

      <SubSection id="features" title="what it does">
        <SpecGrid cols={3}>
          <For each={FEATURES}>{(f) => <SpecItem {...f} />}</For>
        </SpecGrid>
      </SubSection>

      <SubSection id="commands" title="commands">
        <CodeBlock code={COMMANDS} />
      </SubSection>

      <SubSection id="daemon" title="the daemon" lede="custody is a deployment choice: start zclid with --view-only and a viewing key, and it answers every query and prepares transactions for someone else to sign.">
        <CodeBlock code={DAEMON} caption="the tcp listener is off unless you ask for it, and then needs a bearer token." />
      </SubSection>

      <SubSection id="backend" title="backend" lede="zcli syncs from zidecar at zcash.rotko.net, which serves compact blocks with proofs, and cross-checks against independent lightwalletd nodes. trial decryption stays on your machine." />
    </Page>
  );
}
