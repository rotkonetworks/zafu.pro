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
  title: "issue tracker",
  value: "github",
  href: "https://github.com/rotkonetworks/zafu/issues",
  description:
    "bugs, requests and questions about zafu, zigner or zcli. this is the place we watch most closely, so please start here.",
};

/** Our own thread in the forum's General category, not the forum root. */
const ZAFU_FORUM_THREAD: LinkEntry = {
  title: "development thread",
  value: "forum",
  href: "https://forum.zcashcommunity.com/t/zafu-client-development/54933",
  description:
    "development in the open on the zcash community forum: light-client work, ligerito, zigner and release notes.",
};

const ZCASH_DISCORD: LinkEntry = {
  title: "zcash discord",
  value: "protocol",
  href: "https://discord.com/invite/zcash",
  description:
    "the upstream zcash community, for questions about the network itself. not zafu support.",
};

const PENUMBRA_DISCORD: LinkEntry = {
  title: "penumbra discord",
  value: "protocol",
  href: "https://discord.gg/hKvkrqa3zC",
  description:
    "the upstream penumbra community, for questions about the chain itself. not zafu support.",
};

/** Ours first, then upstream protocol communities. */
export const SUPPORT_CHANNELS: LinkEntry[] = [
  ZAFU_ISSUES,
  ZAFU_FORUM_THREAD,
  ZCASH_DISCORD,
  PENUMBRA_DISCORD,
];
