import type { LinkEntry } from "./types";

/**
 * Support channels, in the order a user should try them.
 *
 * Two distinct things live here, and the copy must keep them distinct:
 *
 *  - Zafu/Zigner issues belong to us, and go to our GitHub tracker.
 *  - The Zcash and Penumbra Discords are upstream *protocol* communities.
 *    They are not Zafu support, and asking wallet bugs there is a good way
 *    to get no answer. Say so rather than implying they will help.
 *
 * Invite URLs are taken from the upstream projects' own repositories
 * (github.com/zcash/zcash and github.com/penumbra-zone/penumbra), not from
 * link aggregators -- a wrong invite in this space leads people to scams.
 */
export const SUPPORT_CHANNELS: LinkEntry[] = [
  {
    title: "Zafu issue tracker",
    value: "github",
    href: "https://github.com/rotkonetworks/zafu/issues",
    description:
      "Bugs, feature requests and questions about Zafu or Zigner. This is the channel we watch — start here.",
  },
  {
    title: "Zcash Discord",
    value: "protocol",
    href: "https://discord.com/invite/zcash",
    description:
      "Upstream Zcash community: shielded pools, addresses, and network questions. Not Zafu support.",
  },
  {
    title: "Penumbra Discord",
    value: "protocol",
    href: "https://discord.gg/hKvkrqa3zC",
    description:
      "Upstream Penumbra community: shielded swaps, staking, governance and IBC. Not Zafu support.",
  },
  {
    title: "Zcash Community Forum",
    value: "forum",
    href: "https://forum.zcashcommunity.com/",
    description:
      "Longer-form discussion and searchable history for Zcash ecosystem topics.",
  },
];

/** Compact subset for the site footer. */
export const FOOTER_CHANNELS = SUPPORT_CHANNELS.filter(
  (c) => c.value !== "forum",
);
