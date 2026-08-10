import { For } from "solid-js";
import Page from "./Page";
import SpecItem from "./SpecItem";
import { SubSection, SpecGrid, Steps, LinkList, CodeBlock } from "./PageKit";
import type { PageContent, SectionBlock } from "../content/types";

// Content is static data, so plain narrowing (no reactive tracking) is fine here.
function Block(props: { block: SectionBlock }) {
  const b = props.block;
  if (b.kind === "specs") {
    return (
      <SpecGrid cols={b.cols}>
        <For each={b.entries}>
          {(e) => (
            <SpecItem
              title={e.title}
              value={e.value}
              description={e.description}
              upcoming={e.upcoming}
            />
          )}
        </For>
      </SpecGrid>
    );
  }
  if (b.kind === "steps") {
    return <Steps items={b.steps.map((s) => ({ ...s }))} />;
  }
  if (b.kind === "links") {
    return <LinkList items={b.links.map((l) => ({ ...l }))} />;
  }
  return <CodeBlock code={b.code} caption={b.caption} />;
}

/** Generic renderer: turns a PageContent data object into a full page. */
export default function ContentPage(props: { content: PageContent }) {
  return (
    <Page
      title={props.content.title}
      heading={props.content.heading}
      lede={props.content.lede}
      stamp={props.content.stamp}
    >
      <For each={props.content.sections}>
        {(section) => (
          <SubSection id={section.id} title={section.title} lede={section.lede}>
            <div class="space-y-6">
              <For each={section.blocks}>{(block) => <Block block={block} />}</For>
            </div>
          </SubSection>
        )}
      </For>
    </Page>
  );
}
