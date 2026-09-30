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

export const RAMPS_NOTE =
  "both are outside services, not run by zafu. zafu never holds or sees these trades, so please look over each service before you send money.";

export const RAMP_LINKS: LinkEntry[] = [
  {
    title: "buy",
    value: "peer",
    href: PEER_REFERRAL_URL,
    description: `peer matches you with a seller. you pay them in an app you already use, such as revolut, wise or venmo, and usdc is released to you. swap it for zec and shield it in zafu. referral code ${PEER_REFERRAL_CODE}.`,
  },
  {
    title: "cash out",
    value: "zcashto.cash",
    href: ZCASHTOCASH_URL,
    description: "sell zec and receive the money in revolut and other payment apps. it is built on peer.",
  },
];
