import type { LinkEntry } from "./types";

/**
 * Support channels, in the order a user should try them.
 *
 * Two distinct things live here, and the copy must keep them distinct:
 *
 *  - Zafu/Zigner issues belong to us: the GitHub tracker and our development
 *    thread on the Zcash forum.
 *  - The Zcash and Penumbra Discords are upstream *protocol* communities.
 *    They are not Zafu support, and asking wallet bugs there is a good way
 *    to get no answer. Say so rather than implying they will help.
 *
 * Invite URLs are taken from the upstream projects' own repositories
 * (github.com/zcash/zcash and github.com/penumbra-zone/penumbra), not from
 * link aggregators -- a wrong invite in this space leads people to scams.
 */

const ZAFU_ISSUES: LinkEntry = {
  title: "Zafu issue tracker",
  value: "github",
  href: "https://github.com/rotkonetworks/zafu/issues",
  description:
    "Bugs, feature requests and questions about Zafu or Zigner. This is the channel we watch — start here.",
};

/** Our own thread in the forum's General category, not the forum root. */
const ZAFU_FORUM_THREAD: LinkEntry = {
  title: "Zafu development thread",
  value: "forum",
  href: "https://forum.zcashcommunity.com/t/zafu-client-development/54933",
  description:
    "Development in the open on the Zcash Community Forum: light-client work, Ligerito, Zigner and release notes.",
};

const ZCASH_DISCORD: LinkEntry = {
  title: "Zcash Discord",
  value: "protocol",
  href: "https://discord.com/invite/zcash",
  description:
    "Upstream Zcash community: shielded pools, addresses, and network questions. Not Zafu support.",
};

const PENUMBRA_DISCORD: LinkEntry = {
  title: "Penumbra Discord",
  value: "protocol",
  href: "https://discord.gg/hKvkrqa3zC",
  description:
    "Upstream Penumbra community: shielded swaps, staking, governance and IBC. Not Zafu support.",
};

/** Ours first, then upstream protocol communities. */
export const SUPPORT_CHANNELS: LinkEntry[] = [
  ZAFU_ISSUES,
  ZAFU_FORUM_THREAD,
  ZCASH_DISCORD,
  PENUMBRA_DISCORD,
];

export const FOOTER_CHANNELS: LinkEntry[] = SUPPORT_CHANNELS;
