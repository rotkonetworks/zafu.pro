import type { LinkEntry } from "./types";

/**
 * Fiat on/off ramps. These are third-party services, not part of zafu: the
 * wallet never holds or routes your funds through them.
 *
 * Peer referral: L59SD4 is a seller (maker) referral. It earns only when a
 * referred person sells, and only Peer's referrals page applies it, so only
 * the cash-out link carries it. Buying links to Peer's plain buy page: there
 * is no buy-side referral. Change the code here only.
 */
export const PEER_REFERRAL_CODE = "L59SD4";
export const PEER_SELL_URL = `https://app.peer.xyz/referrals?referralCode=${PEER_REFERRAL_CODE}`;
export const PEER_BUY_URL = "https://app.peer.xyz/swap";

export const RAMPS_NOTE =
  "peer is an outside service, not run by zafu. zafu never holds or sees these trades, so please look it over before you send money.";

export const RAMP_LINKS: LinkEntry[] = [
  {
    title: "buy",
    value: "peer",
    href: PEER_BUY_URL,
    description: "open buy in zafu, pick an amount and pay a seller in an app you already use, such as revolut, wise, zelle or monzo. peer releases usdc and zafu swaps it to zec in your wallet.",
  },
  {
    title: "cash out",
    value: "peer",
    href: PEER_SELL_URL,
    description: `swap zec into usdc on base in zafu, then list it on peer with your payment details. buyers pay you in revolut, wise and other apps as they take it. referral code ${PEER_REFERRAL_CODE}.`,
  },
];
