import type { LinkEntry } from "./types";

/**
 * Fiat on/off ramps. These are third-party services, not part of zafu: the
 * wallet never holds or routes your funds through them.
 *
 * Peer referral: six-char code the buyer redeems in their Peer account (Peer
 * records it as a peer-ref- marker). Peer's own referral page applies it, so
 * every "buy on peer" link goes there first. Change the code here only.
 */
export const PEER_REFERRAL_CODE = "L59SD4";
export const PEER_REFERRAL_URL = `https://app.peer.xyz/referrals?referralCode=${PEER_REFERRAL_CODE}`;

export const ZCASHTOCASH_URL = "https://zcashto.cash/";
export const ZCASHTOCASH_BUY_URL = "https://zcashto.cash/buy";

export const RAMPS_NOTE =
  "third-party services, not run by zafu. zafu stays non-custodial and never sees these trades; check each service before you send money.";

export const RAMP_LINKS: LinkEntry[] = [
  {
    title: "buy zec",
    value: "zcashto.cash/buy",
    href: ZCASHTOCASH_BUY_URL,
    description: "pay with revolut, wise and others. built on peer.",
  },
  {
    title: "buy stablecoins",
    value: "peer",
    href: PEER_REFERRAL_URL,
    description: `buy usdc with revolut, wise, venmo and more, swap it for zec, then shield it in zafu. referral ${PEER_REFERRAL_CODE}.`,
  },
  {
    title: "cash out",
    value: "zcashto.cash",
    href: ZCASHTOCASH_URL,
    description: "sell zec to revolut and other payment apps.",
  },
];
