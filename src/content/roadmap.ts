import type { PageContent } from "./types";

/** One roadmap for everything. Keep it short; the github milestones hold the detail. */
export const roadmap: PageContent = {
  title: "roadmap",
  heading: "road to 1.0",
  lede: "the wallet is complete in q4 2026. this is what shipped and what is left.",
  sections: [
    {
      id: "shipped",
      title: "shipped",
      blocks: [
        {
          kind: "specs",
          cols: 3,
          entries: [
            { title: "ironwood", value: "zcash NU6.3", description: "shielded sends, shielding and migration out of orchard, proved on your device." },
            { title: "fresh receive addresses", value: "zafu 28.3", description: "a new shielded address each time you show or copy one." },
            { title: "FROST multisig", value: "room codes", description: "key generation and signing over a relay, with a sealed chat per group." },
            { title: "private contacts", value: "zafu 28.0", description: "ZID contacts, blind-relay discovery and messages with hybrid post-quantum encryption." },
            { title: "cold signing", value: "zigner · keystone · ledger", description: "zigner or keystone over qr, watch-only wallets, ledger for transparent zec." },
            { title: "zcli 0.9", value: "cli + daemon", description: "json output, watch-only mode, dry runs, FROST and the zclid daemon." },
          ],
        },
      ],
    },
    {
      id: "finishing",
      title: "finishing for 1.0 · q4 2026",
      lede: "in progress now. the list may still change.",
      blocks: [
        {
          kind: "specs",
          cols: 3,
          entries: [
            { title: "the new design", value: "zafu · zigner", description: "the calmer screens shown on this site, in both apps." },
            { title: "groups", value: "zafu", description: "multisig payments that wait for co-signers, so no one needs to be online together." },
            { title: "pockets", value: "zafu", description: "named accounts inside one wallet, each with its own addresses." },
            { title: "ledger shielded signing", value: "zafu", description: "shielded signing through the ledger zcash app, once it is tested on real devices." },
            { title: "private voting", value: "zafu", description: "governance voting where the backend cannot see which proposals you read." },
          ],
        },
      ],
    },
    {
      id: "after",
      title: "after 1.0",
      blocks: [
        {
          kind: "specs",
          cols: 3,
          entries: [
            { title: "zcli cloud agent", upcoming: true, description: "zcli as an always-on agent, hosted by us or on your own server." },
            { title: "updates over qr", upcoming: true, description: "wallet logic updates for zigner over the qr channel, so network upgrades need not wait for a store." },
            { title: "stronger header proofs", upcoming: true, description: "a constraint system for the ligerito header proof, tying proven roots to the headers." },
          ],
        },
      ],
    },
  ],
};
