import { For } from "solid-js";
import Page from "../components/Page";
import SpecItem from "../components/SpecItem";
import { CodeBlock, LinkList, SpecGrid, SubSection } from "../components/PageKit";
import { SUPPORT_CHANNELS } from "../content/support";

/**
 * The zcli cloud agent is a planned service. Every mode below says whether
 * zcli can do it today; "planned" means no code for it exists yet. The
 * multisig points describe the planned co-signer seat, not current behaviour.
 */
const MODES = [
  {
    title: "watch-only",
    value: "works today",
    description: "the agent has a viewing key and no spending key. it follows your balance and history and tells you when payments arrive. it cannot spend.",
  },
  {
    title: "prepares, you sign",
    value: "works today",
    description: "the agent builds the transaction, you sign it in zafu or on zigner, and the agent sends it.",
  },
  {
    title: "one signer in a shared wallet",
    upcoming: true,
    description: "the agent holds one of the keys in a shared wallet, such as 2 of 3. it signs only when its rules allow, and it can never spend on its own.",
  },
  {
    title: "spending with limits",
    upcoming: true,
    description: "the agent holds a spending key, with limits you set, such as an amount per day or a list of allowed recipients.",
  },
  {
    title: "invoices from a viewing key",
    upcoming: true,
    description: "payment requests and notifications without a spending key on the server. merchant mode does this today, but needs the spending key.",
  },
  {
    title: "receive and forward",
    value: "works today · holds a key",
    description: "merchant mode takes payments on fresh addresses and forwards them to your cold wallet. whoever runs the server can spend what hasn't been forwarded yet.",
  },
];

const MULTISIG = [
  ["always available", "a shared wallet needs enough people online to sign. the agent is always online, so a 2 of 3 wallet only needs one person and the agent."],
  ["signs by your rules", "the agent signs only what its rules allow: an amount per day, a list of recipients, or payments that a person has already approved. anything else waits for a second person."],
  ["never spends alone", "the agent holds one key out of several. if the server is broken into, the attacker still can't move your funds."],
  ["a backup seat", "if you lose one of your own keys, you and the agent can still sign together and move the funds to a new wallet."],
] as const;

export default function Cloud() {
  return (
    <Page
      title="zcli cloud agent"
      heading="zcli cloud agent"
      lede="zcli running on a server around the clock: watching your wallet, sending payments, and acting as one of the signers in a shared wallet. it isn't offered yet. if you would use it, tell us how."
    >
      <SubSection id="multisig" title="a signer that is always online" lede="shared wallets work today in zafu, zigner and zcli. the agent would take one of the seats.">
        <dl class="mt-6 grid gap-x-10 gap-y-6 md:grid-cols-2">
          <For each={MULTISIG}>
            {([t, d]) => (
              <div>
                <dt class="text-text">{t}</dt>
                <dd class="m-0 mt-1 text-sm leading-relaxed text-muted">{d}</dd>
              </div>
            )}
          </For>
        </dl>
      </SubSection>

      <SubSection id="trust" title="what the agent can do" lede="a server with a spending key can spend your money, so the agent comes in modes, from no spending key at all to a limited one. use the least that does the job.">
        <SpecGrid cols={3}>
          <For each={MODES}>{(m) => <SpecItem {...m} />}</For>
        </SpecGrid>
      </SubSection>

      <SubSection id="run" title="two ways to run it">
        <SpecGrid cols={2}>
          <SpecItem title="on your own server" value="free" description="install zcli from the release and run the daemon yourself. the modes marked as working today are available now.">
            <CodeBlock code="zclid --view-only --fvk <viewing key hex> --listen 127.0.0.1:9067" caption="watch-only: the server has no spending key." />
          </SpecItem>
          <SpecItem title="we run it for you" upcoming description="the same agent on our servers, kept running and up to date. which modes we will host is not decided yet.">
            <p class="mt-4 border border-dashed border-border-strong p-3 text-xs text-muted">pricing · not decided yet</p>
          </SpecItem>
        </SpecGrid>
      </SubSection>

      <SubSection id="infra" title="what it runs on" lede="the same server at zcash.rotko.net that zafu and zcli already sync from. paying members would get priority when the server is busy, without revealing which member they are. free sync is never slowed down." />

      <SubSection id="talk" title="talk to us" lede="there is no sign-up yet. if you would use the agent, tell us what for and which mode you would trust.">
        <LinkList items={SUPPORT_CHANNELS.slice(0, 2)} />
      </SubSection>
    </Page>
  );
}
