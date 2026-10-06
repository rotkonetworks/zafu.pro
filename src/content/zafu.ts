import type { PageContent } from "./types";
import { SUPPORT_CHANNELS } from "./support";
import { RAMP_LINKS, RAMPS_NOTE } from "./ramps";

export const zafuSecurity: PageContent = {
  title: "Zafu Security",
  heading: "security",
  lede: "a hot/cold key split. with a cold signer, zafu holds viewing keys and builds transactions; spending keys stay on the signer. zero-knowledge proving runs on your device.",
  sections: [
    {
      id: "cold-signing",
      title: "cold signing",
      lede: "zafu pairs with zigner or keystone over a camera-only channel: the unsigned transaction goes out as animated QR codes and the signatures come back the same way. no USB, bluetooth or network path joins the two devices. ledger connects over USB and signs transparent zec only.",
      blocks: [
        {
          kind: "specs",
          entries: [
            {
              title: "Transaction format",
              value: "PCZT v2",
              description:
                "Partially Created Zcash Transactions carry the unsigned transaction, proofs, and signatures between devices. The signer decodes the full effects of what it signs.",
            },
            {
              title: "QR transport",
              value: "RaptorQ + UR",
              description:
                "Fountain coding lets the receiver reconstruct the payload from any sufficient subset of frames - no frame ordering, no retransmission back-channel.",
            },
            {
              title: "Key separation",
              value: "viewing / spending",
              description:
                "With a cold signer, zafu holds viewing keys only: a compromised online wallet exposes your history, never spend authority. A watch-only wallet can also be added by pasting a viewing key.",
            },
          ],
        },
      ],
    },
    {
      id: "frost",
      title: "FROST threshold signing",
      lede: "With FROST, a single spending key never needs to exist on any one device. Key generation is distributed and signing requires a threshold of participants.",
      blocks: [
        {
          kind: "specs",
          entries: [
            {
              title: "Ciphersuites",
              value: "RedPallas / decaf377",
              description:
                "RedPallas for Zcash Orchard spend authorization; decaf377 for Penumbra.",
            },
            {
              title: "Key generation",
              value: "3-round DKG",
              description:
                "Dealerless distributed key generation. The full spending key is never assembled on any device at any point in its lifecycle.",
            },
            {
              title: "Nonce reuse detection",
              value: "commitment fingerprints",
              description:
                "Signing nonce commitments are fingerprinted and checked across sessions; a repeated nonce aborts the session before any signature share is produced.",
            },
          ],
        },
      ],
    },
    {
      id: "key-storage",
      title: "keys, proving and encryption",
      blocks: [
        {
          kind: "specs",
          entries: [
            {
              title: "Proving",
              value: "in-browser",
              description:
                "Zero-knowledge proofs for shielded transactions are generated locally. No transaction plaintext, key material, or witness data leaves the device.",
            },
            {
              title: "Server trust",
              value: "minimized",
              description:
                "Remote infrastructure only ever sees fully-formed shielded transactions for broadcast. Query-side trust in Zidecar/lightwalletd is minimized - see below.",
            },
            {
              title: "ZID identity keys",
              value: "ed25519",
              description:
                "Per-site and per-contact key derivation prevents cross-context linkability. Identity and signatures stay classical.",
            },
            {
              title: "Post-quantum encryption",
              value: "X25519 + ML-KEM-768",
              description:
                "Direct messages between ZIDs (hybrid Noise IK) and the app-facing sealed box (zafu_encrypt, X-Wing) are hybrid post-quantum, so traffic recorded today stays confidential. The multisig group chat is not post-quantum.",
            },
            {
              title: "Outbound requests",
              value: "one gate",
              description:
                "Every request passes one gate in the wallet. Your own device, shipped endpoints for networks you enabled and endpoints you typed pass silently; any other host asks you once.",
            },
          ],
        },
      ],
    },
    {
      id: "backend-trust",
      title: "backend trust",
      lede: "the server (zidecar, lightwalletd or pd) is not trusted with your notes. zafu scans on your device and tells the server as little as it can. it still trusts the server for the chain itself. or run your own.",
      blocks: [
        {
          kind: "specs",
          entries: [
            {
              title: "Scanning on your device",
              value: "every block",
              description:
                "zafu downloads every compact block since your wallet's birthday and finds your orchard and ironwood notes on this device: payments by trial decryption, spends by matching each block's nullifiers against your own notes. The server only sees which blocks you download, the same blocks every wallet downloads.",
            },
            {
              title: "What the server still learns",
              value: "transparent and history",
              description:
                "Transparent addresses are public by design: to show their balance, zafu asks your node for the coins of your account's t-addresses while the zcash home is open, and again when you shield, swap or add liquidity. Transaction history, off by default, asks for their history too. On penumbra, zafu fetches the full transactions of the blocks where it found your activity, which shows those heights to the node. Shielded funds leave nothing to ask about.",
            },
            {
              title: "Memo fetching",
              value: "bucket + decoy",
              description:
                "On zidecar, memos are fetched block by block in buckets, with twice as many random decoy buckets mixed in and shuffled, so the server cannot tell which blocks hold your notes. A lightwalletd node is asked for your transactions by id instead, so zidecar is the private choice.",
            },
            {
              title: "Tree checks",
              value: "roots must match",
              description:
                "zafu builds its own note commitment tree from the blocks and checks its root, and each spend's anchor, against the node. A mismatch that holds is treated as a reorg: the wallet rewinds and scans again.",
            },
            {
              title: "Honest limits",
              value: "the chain is trusted",
              description:
                "zafu does not yet prove the chain it is shown: there is no proof-of-work or header check, so the node is trusted for what is on chain. A dishonest node cannot learn which notes are yours, but it can hide a payment or a spend until you switch nodes. An optional tip check compares heights with a second operator's node. Checking the chain against Zcash's own proof of work (FlyClient over the ZIP-221 history tree) is in progress.",
            },
            {
              title: "Self-hosting",
              value: "your own node",
              description:
                "Every endpoint is a setting: point zafu at your own zidecar, lightwalletd (grpc-web) or pd, and no provider sees even which blocks you download. zafu tells which kind of node it is talking to on its own.",
            },
          ],
        },
      ],
    },
  ],
};

export const zafuSpecs: PageContent = {
  title: "Zafu Specs",
  heading: "specs",
  lede: "protocol support, cryptography and identity.",
  sections: [
    {
      id: "architecture",
      title: "architecture",
      blocks: [
        {
          kind: "specs",
          entries: [
            {
              title: "Lineage",
              value: "Prax fork",
              description:
                "Zafu is forked from Prax Wallet (Penumbra Labs), extending it with Zcash support, cold signing, FROST, and ZID.",
            },
            {
              title: "Local-first",
              value: "on-device",
              description:
                "Encryption, proof generation and balance sync run on your own device.",
            },
            {
              title: "Custody",
              value: "non-custodial",
              description:
                "You are the only one who holds your keys; in the recommended setup, spending keys live on an air-gapped signer.",
            },
          ],
        },
      ],
    },
    {
      id: "zcash",
      title: "zcash",
      blocks: [
        {
          kind: "specs",
          entries: [
            {
              title: "Pools",
              value: "Ironwood / Orchard / Transparent",
              description:
                "Ironwood is the active shielded pool. Orchard is legacy: migrate-only through the NU6.3 one-way turnstile. Transparent funds can be shielded on receipt.",
            },
            {
              title: "Spend authorization",
              value: "RedPallas",
              description: "Signature scheme for Orchard spend authorization.",
            },
            {
              title: "Cold signing format",
              value: "PCZT v2",
              description:
                "Partially Created Zcash Transactions carry unsigned transaction data between wallet and signer.",
            },
            {
              title: "Proving",
              value: "client-side",
              description:
                "Proofs for shielded actions are generated in the browser; no external proving service is used.",
            },
            {
              title: "Receive addresses",
              value: "single-use",
              description:
                "Every time you open, copy or share your shielded address it rotates to a fresh random diversifier, so no address is handed to two senders.",
            },
            {
              title: "Fees",
              value: "ZIP-317",
              description:
                "One flat standard fee. Zcash has no fee auction, so paying more would only link your transactions.",
            },
            {
              title: "Payment requests",
              value: "ZIP 321",
              description: "Payment requests as zcash: links, switchable in privacy settings.",
            },
          ],
        },
      ],
    },
    {
      id: "penumbra",
      title: "penumbra",
      blocks: [
        {
          kind: "specs",
          entries: [
            {
              title: "Signatures",
              value: "decaf377",
              description: "Penumbra's native signature scheme over the decaf377 group.",
            },
            {
              title: "Swaps",
              value: "DEX",
              description: "Shielded batch swaps on the Penumbra DEX.",
            },
            {
              title: "Staking",
              value: "delegate / undelegate",
              description: "Delegation and undelegation via delegation tokens.",
            },
            {
              title: "Governance",
              value: "voting",
              description: "On-chain governance voting.",
            },
            {
              title: "IBC",
              value: "transfers",
              description:
                "Deposit and withdraw over the IBC channels your Penumbra node reports as live: noble, cosmos hub, injective, osmosis.",
            },
            {
              title: "USDC ramp",
              value: "injective",
              description:
                "Receive Circle-native USDC on Injective and shield it into Penumbra, or withdraw it back to an exchange. Noble USDC is being wound down by Circle.",
            },
          ],
        },
      ],
    },
    {
      id: "frost",
      title: "FROST multisig",
      blocks: [
        {
          kind: "specs",
          entries: [
            {
              title: "Ciphersuites",
              value: "RedPallas / decaf377",
              description: "RedPallas for Zcash, decaf377 for Penumbra.",
            },
            {
              title: "Key generation",
              value: "3-round DKG",
              description:
                "Dealerless; each participant holds only a key share. Rounds run over a frostd relay, sealed end to end.",
            },
            {
              title: "Room codes",
              value: "number + two words",
              description:
                "Co-signers join a key-generation or signing session with a short code instead of scanning each other's QR codes.",
            },
            {
              title: "Group chat",
              value: "per multisig",
              description:
                "Each multisig gets a sealed coordination thread in the inbox; messages wait for an offline co-signer. Not post-quantum, no forward secrecy.",
            },
            {
              title: "Signing",
              value: "2-round, t-of-n",
              description:
                "Any t of n participants produce a signature; round one exchanges nonce commitments, round two signature shares.",
            },
            {
              title: "Nonce safety",
              value: "reuse detection",
              description:
                "Commitment fingerprints are tracked across signing sessions; reuse aborts before any share is emitted.",
            },
          ],
        },
      ],
    },
    {
      id: "zid",
      title: "ZID identity",
      lede: "off-chain identity. your own social graph: no KYC, no registry, no linkable global identifier.",
      blocks: [
        {
          kind: "specs",
          entries: [
            {
              title: "Key type",
              value: "ed25519",
              description: "Identity keys for authentication and messaging.",
            },
            {
              title: "Derivation",
              value: "per-site / per-contact",
              description:
                "Independent keys per context; no shared identifier links activity across sites or contacts.",
            },
            {
              title: "Social graph",
              value: "self-sovereign",
              description:
                "Contacts are anchored to ZIDs, not just addresses. Your graph lives with you, encrypted - not on a server, not on a chain.",
            },
            {
              title: "Contact discovery",
              value: "blind relay",
              description:
                "Two people who already know each other find each other through per-epoch rendezvous tags. Whole-bucket reads and padded publishes keep who you look up, and how many friends you have, off the relay.",
            },
            {
              title: "Encryption",
              value: "hybrid post-quantum",
              description:
                "Direct messages use hybrid X25519 + ML-KEM-768 (Noise IK). Apps can seal to a ZID with zafu_encrypt (X-Wing) when the recipient advertises a post-quantum key.",
            },
            {
              title: "zcash.me directory",
              value: "opt-in, off by default",
              description:
                "Look up and pay a /username. Live lookups can be covered by decoy names; an address is only ever labelled from a verified profile.",
            },
          ],
        },
      ],
    },
  ],
};

export const zafuDocs: PageContent = {
  title: "Zafu Docs",
  heading: "docs",
  lede: "install, set up, get zec, sign cold, run a multisig.",
  sections: [
    {
      id: "install",
      title: "install",
      lede: "two routes to the same wallet, easiest first. store releases wait on review, so while one is pending the newest build is on github.",
      blocks: [
        {
          kind: "tabs",
          tabs: [
            {
              label: "Chrome Web Store",
              note: "recommended",
              blocks: [
                {
                  kind: "steps",
                  steps: [
                    {
                      title: "Install",
                      body: "Open the listing and click Add to Chrome. Chrome keeps it updated from then on - there is nothing else to do.",
                      link: {
                        href: "https://chromewebstore.google.com/detail/zafu-wallet-beta/bhlogefpcebekhjpomlodifcelldoimn",
                        text: "Zafu on the Chrome Web Store →",
                      },
                    },
                    {
                      title: "Pin it",
                      body: "Click the puzzle-piece icon in the toolbar and pin Zafu, so the popup is one click away.",
                    },
                  ],
                },
              ],
            },
            {
              label: "GitHub",
              note: "newest beta",
              blocks: [
                {
                  kind: "steps",
                  steps: [
                    {
                      title: "Download",
                      body: "Grab zafu-beta-*.zip (or .crx) from the latest release and unzip it.",
                      link: {
                        href: "https://github.com/rotkonetworks/zafu/releases/latest",
                        text: "download latest zafu-beta (.zip / .crx) →",
                      },
                    },
                    {
                      title: "Enable developer mode",
                      body: "Open chrome://extensions and toggle Developer mode on (top right).",
                    },
                    {
                      title: "Load unpacked",
                      body: "Click Load unpacked and pick the unzipped folder.",
                    },
                    {
                      title: "Reload",
                      body: "Reload any open dapp pages so they see the new wallet version.",
                    },
                    {
                      title: "Updating",
                      body: "This route does not update itself. Download the new zip and Load unpacked again each time - or switch to the store build once your release has cleared review.",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "setup",
      title: "set up",
      blocks: [
        {
          kind: "steps",
          steps: [
            {
              title: "Open zafu",
              body: "Click the zafu icon in the toolbar. You can also keep it in Chrome's side panel.",
            },
            {
              title: "Create or restore",
              body: "Generate a new recovery phrase, or restore one. A restore asks for the wallet birthday so the first scan starts in the right place; an unknown birthday falls back to Orchard activation.",
            },
            {
              title: "Zcash first",
              body: "A new wallet starts with Zcash only. Turn on Penumbra and the transparent chains later in Settings > Networks.",
            },
            {
              title: "Choose a security posture",
              body: "Hot wallet: keys stay in the browser. Recommended: pair a cold signer (Zigner or Keystone) so zafu holds viewing keys only. Ledger can be added for transparent zec (experimental). A watch-only wallet can be added from a viewing key.",
            },
            {
              title: "Sync",
              body: "The wallet trial-decrypts compact blocks with your viewing keys to discover notes. Scanning happens locally; the server learns nothing about which notes are yours.",
            },
          ],
        },
      ],
    },
    {
      id: "zcash-transactions",
      title: "zcash transactions",
      blocks: [
        {
          kind: "specs",
          entries: [
            {
              title: "Shielded send",
              value: "Ironwood → Ironwood",
              description:
                "Default Zcash transaction type. Amounts, sender, and receiver are hidden.",
            },
            {
              title: "Shielding",
              value: "Transparent → Ironwood",
              description: "Moves transparent funds into the active shielded pool.",
            },
            {
              title: "Deshielding",
              value: "Ironwood → Transparent",
              description:
                "For paying transparent-only addresses. Reveals the amount and destination.",
            },
            {
              title: "Migration",
              value: "Orchard → Ironwood",
              description:
                "One-way turnstile. NU6.3 makes Orchard migrate-only; legacy funds stay safe until you move them through.",
            },
          ],
        },
      ],
    },
    {
      id: "penumbra-transactions",
      title: "penumbra transactions",
      blocks: [
        {
          kind: "specs",
          entries: [
            {
              title: "Swap",
              value: "DEX",
              description: "Shielded batch swap on the Penumbra DEX.",
            },
            {
              title: "Staking",
              value: "delegate / undelegate",
              description: "Stake to and unstake from Penumbra validators.",
            },
            {
              title: "Voting",
              value: "governance",
              description: "On-chain governance votes.",
            },
            {
              title: "IBC transfer",
              value: "deposit / withdraw",
              description: "Move assets between Penumbra and IBC-connected chains.",
            },
          ],
        },
      ],
    },
    {
      id: "get-zec",
      title: "swap, buy and sell",
      lede: RAMPS_NOTE,
      blocks: [
        { kind: "links", links: RAMP_LINKS },
        {
          kind: "specs",
          cols: 2,
          entries: [
            { title: "swap zec", value: "near intents · thorchain", description: "open swap, pick a coin and an amount, and confirm. zec swaps to and from btc, eth, usdc, sol and more go through near intents or thorchain, outside services zafu does not run. they may delay or hold funds for their own checks, and zafu cannot recover them. zafu charges no fee of its own during the beta; every fee is shown before you confirm." },
            { title: "swap on penumbra", value: "penumbra dex", description: "swaps between penumbra assets run on penumbra's own exchange. your trades stay private, and no outside service is involved." },
          ],
        },
      ],
    },
    {
      id: "cold-signing-flow",
      title: "sign with zigner",
      lede: "with a cold signer, every spend is a two-device round trip over QR codes.",
      blocks: [
        {
          kind: "steps",
          steps: [
            {
              title: "Build",
              body: "Zafu constructs the unsigned transaction (PCZT v2 for Zcash) and generates proofs locally.",
            },
            {
              title: "Display",
              body: "The payload is UR-encoded, fountain-coded with RaptorQ, and shown as an animated QR sequence.",
            },
            {
              title: "Sign",
              body: "Zigner scans the sequence, displays the transaction for review on its own screen, and signs with the spending key after confirmation.",
            },
            {
              title: "Return & broadcast",
              body: "Zigner displays the signatures as QR codes; Zafu scans them, finalizes the transaction, and broadcasts it.",
            },
          ],
        },
      ],
    },
    {
      id: "frost-setup",
      title: "FROST multisig",
      lede: "co-signers meet in a room named by a short code: a number and two words. rounds travel over a frostd relay, sealed end to end.",
      blocks: [
        {
          kind: "steps",
          steps: [
            {
              title: "Pick parameters",
              body: "Choose threshold t and participant count n, and the ciphersuite: RedPallas for Zcash, decaf377 for Penumbra.",
            },
            {
              title: "Run DKG",
              body: "One participant opens a room and shares its code; the others join with it. The distributed key generation runs over the relay, and each device ends with a key share. The full key never exists anywhere.",
            },
            {
              title: "Verify",
              body: "Confirm every participant derived the same group verification key before sending funds to the multisig address.",
            },
            {
              title: "Sign",
              body: "Any t participants join a signing room by code and run the 2-round protocol. Each co-signer signs only the transaction it reviewed.",
            },
          ],
        },
      ],
    },
    {
      id: "support",
      title: "support",
      lede: "zafu bugs and feature requests go to our issue tracker - that is the channel we watch - and we post progress in our zcash forum thread. the zcash and penumbra discords are upstream protocol communities: ask there about the chains, not the wallet.",
      blocks: [
        {
          kind: "links",
          links: SUPPORT_CHANNELS,
        },
      ],
    },
  ],
};

