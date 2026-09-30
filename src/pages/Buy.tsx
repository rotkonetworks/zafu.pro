import Page from "../components/Page";
import { LinkList } from "../components/PageKit";
import { RAMP_LINKS, RAMPS_NOTE } from "../content/ramps";

export default function Buy() {
  return (
    <Page title="get zec, or cash out" heading="get zec, or cash out" lede="with the payment apps you already use.">
      <LinkList items={RAMP_LINKS} />
      <p class="mt-6 max-w-2xl text-sm text-muted">{RAMPS_NOTE}</p>
    </Page>
  );
}
