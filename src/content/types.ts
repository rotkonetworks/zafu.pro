/**
 * Typed content model for technical pages.
 * Pages are generic renderers; all copy lives in src/content/*.ts
 * so it can later be sourced from MDX, a CMS, or an API without
 * touching components.
 */

export interface SpecEntry {
  title: string;
  /** Short mono value shown right of the title (e.g. "PCZT v2"). */
  value?: string;
  description?: string;
  /** Not yet supported: rendered grayed out with an "upcoming" tag. */
  upcoming?: boolean;
}

export interface StepEntry {
  title: string;
  body: string;
  /** Optional call-to-action link rendered after the body. */
  link?: { href: string; text: string };
}

export interface LinkEntry {
  title: string;
  href: string;
  /** Short mono label shown right of the title (e.g. "discord"). */
  value?: string;
  description?: string;
}

export type SectionBlock =
  | { kind: "specs"; cols?: 1 | 2 | 3; entries: SpecEntry[] }
  | { kind: "steps"; steps: StepEntry[] }
  /** Unordered set of destinations. Use instead of `steps` when there is no sequence. */
  | { kind: "links"; links: LinkEntry[] }
  | { kind: "code"; code: string; caption?: string }
  /**
   * Alternative routes to the same outcome — e.g. three ways to install.
   * Order them easiest-first: the first tab is the one shown by default, and
   * most readers never open the others.
   */
  | { kind: "tabs"; tabs: TabEntry[] };

export interface TabEntry {
  label: string;
  /** Short mono caption under the tab strip, e.g. "recommended". */
  note?: string;
  blocks: SectionBlock[];
}

export interface SectionContent {
  id: string;
  title: string;
  lede?: string;
  blocks: SectionBlock[];
}

export interface PageContent {
  /** Browser tab title (suffixed with site name by Page). */
  title: string;
  heading: string;
  lede?: string;
  /** Kanji for the header hanko stamp (e.g. 座蒲 for Zafu, 印 for Zigner). */
  stamp?: string;
  sections: SectionContent[];
}
