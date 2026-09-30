import { For } from "solid-js";
import Page from "../components/Page";
import SpecItem from "../components/SpecItem";
import { CodeBlock, LinkList, SpecGrid, SubSection } from "../components/PageKit";
import { SUPPORT_CHANNELS } from "../content/support";

/**
 * The zcli cloud agent is a planned service. Every mode below says whether
 * zcli can do it today; "planned" means no code for it exists yet.
 */
const MODES = [
  {
    title: "watch-only",
    value: "available in zclid",
    description: "the agent holds a viewing key, not a spending key. it follows balances, history and incoming payments, and cannot spend.",
  },
  {
    title: "prepare, sign elsewhere",
    value: "available in zclid",
    description: "the agent builds and proves a transaction, you sign it on zigner or in zafu, and the agent sends it on.",
  },
  {
    title: "watch-only invoices",
    upcoming: true,
    description: "payment requests and webhooks from a viewing key alone. merchant mode does this today, but it needs the spending key.",
  },
  {
    title: "co-signer seat",
    upcoming: true,
    description: "the agent holds one share in a FROST 2 of 3 group. alone it can never spend; it only adds its seal. the multisig is in zcli, the automatic seat is not yet.",
  },
  {
    title: "spending with limits",
    upcoming: true,
    description: "a spending key held under caps you set, such as an amount per day or a list of recipients.",
  },
  {
    title: "receive and sweep",
    value: "available · holds a key",
    description: "merchant mode takes payments on fresh addresses and forwards them to your cold address. whoever runs the server can spend what has not moved yet.",
  },
];

export default function Cloud() {
  return (
    <Page
      title="zcli cloud agent"
      heading="zcli cloud agent"
      lede="zcli, running around the clock on a server, for payments that should not wait for your laptop. it is planned and not yet offered; we would be glad to hear what you would use it for."
    >
      <SubSection id="trust" title="first, who can spend" lede="a server that holds a spending key can spend. so the agent comes in modes, from no spending key at all to a limited one. we suggest the least that does the job.">
        <SpecGrid cols={3}>
          <For each={MODES}>{(m) => <SpecItem {...m} />}</For>
        </SpecGrid>
      </SubSection>

      <SubSection id="run" title="two ways to run it">
        <SpecGrid cols={2}>
          <SpecItem title="on your own server" value="free" description="install zcli and zclid from the release and run the daemon. the modes marked available work today.">
            <CodeBlock code="zclid --view-only --fvk <viewing key hex> --listen 127.0.0.1:9067" caption="watch-only: no spending key on the server." />
          </SpecItem>
          <SpecItem title="we run it for you" upcoming description="the same agent on our servers, kept synced and looked after. which modes we host is still being decided.">
            <p class="mt-4 border border-dashed border-border-strong p-3 text-xs text-muted">pricing · to be decided</p>
          </SpecItem>
        </SpecGrid>
      </SubSection>

      <SubSection id="infra" title="what it runs on" lede="zidecar at zcash.rotko.net, the light server that zafu and zcli already sync from. pro members may prove membership anonymously with a ring VRF and get priority under load; free sync is never slowed down." />

      <SubSection id="talk" title="talk to us" lede="there is no sign-up yet. if you would use the agent, please tell us how, and which mode you would trust.">
        <LinkList items={SUPPORT_CHANNELS.slice(0, 2)} />
      </SubSection>
    </Page>
  );
}
