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

export type SectionBlock =
  | { kind: "specs"; cols?: 1 | 2 | 3; entries: SpecEntry[] }
  | { kind: "steps"; steps: StepEntry[] }
  | { kind: "code"; code: string; caption?: string };

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
