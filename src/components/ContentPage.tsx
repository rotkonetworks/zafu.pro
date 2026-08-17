import { For, Show } from "solid-js";
import Page from "./Page";
import SpecItem from "./SpecItem";
import { SubSection, SpecGrid, Steps, LinkList, CodeBlock, Tabs, DocsToc } from "./PageKit";
import type { PageContent, SectionBlock, SectionContent } from "../content/types";

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
  if (b.kind === "tabs") {
    return (
      <Tabs
        tabs={b.tabs.map((t) => ({
          label: t.label,
          note: t.note,
          panel: (
            <div class="space-y-6">
              <For each={t.blocks}>{(block) => <Block block={block} />}</For>
            </div>
          ),
        }))}
      />
    );
  }
  return <CodeBlock code={b.code} caption={b.caption} />;
}

function Sections(props: { sections: SectionContent[] }) {
  return (
    <For each={props.sections}>
      {(section) => (
        <SubSection id={section.id} title={section.title} lede={section.lede}>
          <div class="space-y-6">
            <For each={section.blocks}>{(block) => <Block block={block} />}</For>
          </div>
        </SubSection>
      )}
    </For>
  );
}

/**
 * Generic renderer: turns a PageContent data object into a full page.
 * Pass `toc` to render a sticky in-page table of contents beside the sections
 * (docs layout); without it the sections render single-column.
 */
export default function ContentPage(props: { content: PageContent; toc?: boolean }) {
  return (
    <Page
      title={props.content.title}
      heading={props.content.heading}
      lede={props.content.lede}
      stamp={props.content.stamp}
    >
      <Show
        when={props.toc}
        fallback={<Sections sections={props.content.sections} />}
      >
        <div class="lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
          <DocsToc
            items={props.content.sections.map((s) => ({
              id: s.id,
              title: s.title,
            }))}
          />
          <div class="min-w-0">
            <Sections sections={props.content.sections} />
          </div>
        </div>
      </Show>
    </Page>
  );
}
