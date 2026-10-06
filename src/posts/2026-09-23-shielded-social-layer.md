---
title: Primitives for the shielded social layer
date: 2026-09-21
description: The first zafu SDK for post-quantum end-to-end encryption, private contact discovery, and why we build it into a browser wallet.
author: hitch
tags:
  - encryption
  - post-quantum
  - zafu
---

We published the first pieces of zafu as standalone libraries: `@zafu/pq`, `@zafu/zid`, `@zafu/media` and `@zafu/service` are on npm. They do one thing: let any app keep its server-side data as ciphertext the server can't read.

Signal made that ordinary for messaging. We want it everywhere else your data lives in someone else's custody: [a poker table](https://zkbtc.org), a chat with [an LLM in a TEE](https://confer.to/blog/2026/01/private-inference/), a notes app, a file drop.

## Packages

[`@zafu/pq`](https://www.npmjs.com/package/@zafu/pq) is the key agreement layer: X25519 mixed with ML-KEM-768 ([X-Wing](https://datatracker.ietf.org/doc/draft-connolly-cfrg-xwing-kem/)), a sealed box on top, raw ML-KEM for protocols doing their own X25519. Every agreement is hybrid, so an attacker breaks both halves or opens nothing. Signatures stay plain ed25519, deliberately: a signature has nothing to harvest, it cannot be forged retroactively, and the day a quantum computer could mint new ones is the day the whole ecosystem rotates signature schemes together. So the post-quantum budget goes entirely where the clock is running - key agreement, where traffic recorded today is decrypted years later.

[`@zafu/zid`](https://www.npmjs.com/package/@zafu/zid) is the identity and transport layer for websites: site-scoped login by signing a server nonce, a sealed box for store-and-forward messages, a live hybrid Noise IK channel (`zafuNoise_IKhybrid_25519+MLKEM768_ChaChaPoly_SHA256`) that fails closed against classical-only peers, and a contact picker that returns opaque handles instead of a social graph. The wallet bridge speaks the message contract in [`@zafu/protocol`](https://www.npmjs.com/package/@zafu/protocol), so both sides compile against one definition of what crosses the wire. It works with no wallet at all: `zid.connect()` falls back to a guest identity, one in-page seed deriving the ed25519 identity and an X-Wing keypair, held in memory by default and burner-grade by design, so an app is usable before anyone installs anything.

[`@zafu/media`](https://www.npmjs.com/package/@zafu/media) is calls: peer-to-peer voice and video with perfect negotiation and optional background blur, written for the poker table and now its own package. SDP/ICE rides the encrypted zid channel; the media itself is direct WebRTC, which exposes each side's IP, so calls are opt-in.

[`@zafu/service`](https://www.npmjs.com/package/@zafu/service) is the layer the other three are wired through, and it is the answer to the question every SDK eventually faces: what changes when the backend does? A service is a function from request to response, a filter wraps one service in another, and a strategy is a named stack of filters the app binds to. Every seam here is injected - the wallet bridge, the presence relay, the socket a call negotiates over - so the same code runs against the extension, against in-page guest keys, or against a relay, and the cross-cutting parts (deadlines, retries, tracing, a feature that is switched off) are filters rather than branches at every call site.

## Finding a friend without a directory

Encrypting to a key you already have is easy; the hard part is finding a friend's key without uploading your contact list to a server. Signal's answer - an attested enclave with an oblivious-RAM layer - needs a directory to look names up in. ZID keys are random, so there is no such directory; the only handle on a friend's key is a secret the two of you already share.

Two people holding each other's contact card compute the same pairwise root secret locally, from their own private key and the other's public key, with nothing on the wire and neither side needing to be online at the same time. From it each derives the same rendezvous tags: HKDF-SHA256 over the secret, the app origin, the epoch, and the publisher's public key, so the two directions of a friendship are unlinkable. The epoch is [JAM common era](https://graypaper.fluffylabs.dev/#/07f041d?v=0.8.0): six-second slots from a fixed genesis bucketed into five-minute windows off each side's own clock, so there is nothing to negotiate - and because a slot is a u32 count of six-second ticks, the counter runs into the 2840s, with no 2038-style rollover to design around.

<svg viewBox="0 0 720 360" width="100%" role="img" aria-label="Alice and Bob each derive the same rendezvous tags from their own contact card and publish to a relay under their own tag; nothing passes between them.">
  <g font-family="var(--font-mono)">
    <rect x="6" y="30" width="300" height="236" rx="4" fill="var(--color-bg-elevated)" stroke="var(--color-border)"/>
    <rect x="414" y="30" width="300" height="236" rx="4" fill="var(--color-bg-elevated)" stroke="var(--color-border)"/>
    <text x="20" y="22" font-size="12.5" fill="var(--color-accent)">alice</text>
    <text x="428" y="22" font-size="12.5" fill="var(--color-accent)">bob</text>
    <rect x="20" y="44" width="272" height="34" rx="3" fill="var(--color-bg)" stroke="var(--color-border-strong)"/>
    <text x="34" y="65" font-size="11.5" fill="var(--color-text)">bob's contact card</text>
    <rect x="20" y="90" width="272" height="52" rx="3" fill="var(--color-bg)" stroke="var(--color-border-strong)"/>
    <text x="34" y="111" font-size="11.5" fill="var(--color-text)">root secret</text>
    <text x="34" y="129" font-size="10" fill="var(--color-text-muted)">X25519(my priv, their pub)</text>
    <rect x="20" y="154" width="272" height="52" rx="3" fill="var(--color-bg)" stroke="var(--color-border-strong)"/>
    <text x="34" y="175" font-size="11.5" fill="var(--color-text)">rendezvous tag</text>
    <text x="34" y="193" font-size="10" fill="var(--color-text-muted)">HKDF-SHA256(secret, app, epoch, pubkey)</text>
    <rect x="20" y="218" width="272" height="34" rx="3" fill="var(--color-bg)" stroke="var(--color-accent)"/>
    <text x="34" y="239" font-size="11.5" fill="var(--color-accent)">both tags, computed offline</text>
    <rect x="428" y="44" width="272" height="34" rx="3" fill="var(--color-bg)" stroke="var(--color-border-strong)"/>
    <text x="442" y="65" font-size="11.5" fill="var(--color-text)">alice's contact card</text>
    <rect x="428" y="90" width="272" height="52" rx="3" fill="var(--color-bg)" stroke="var(--color-border-strong)"/>
    <text x="442" y="111" font-size="11.5" fill="var(--color-text)">root secret</text>
    <text x="442" y="129" font-size="10" fill="var(--color-text-muted)">X25519(my priv, their pub)</text>
    <rect x="428" y="154" width="272" height="52" rx="3" fill="var(--color-bg)" stroke="var(--color-border-strong)"/>
    <text x="442" y="175" font-size="11.5" fill="var(--color-text)">rendezvous tag</text>
    <text x="442" y="193" font-size="10" fill="var(--color-text-muted)">HKDF-SHA256(secret, app, epoch, pubkey)</text>
    <rect x="428" y="218" width="272" height="34" rx="3" fill="var(--color-bg)" stroke="var(--color-accent)"/>
    <text x="442" y="239" font-size="11.5" fill="var(--color-accent)">both tags, computed offline</text>
    <path d="M156,252 V280 H276 V292" fill="none" stroke="var(--color-border-strong)"/>
    <polygon points="276,296 271,286 281,286" fill="var(--color-border-strong)"/>
    <text x="162" y="272" font-size="9.5" fill="var(--color-text-dim)">publish</text>
    <path d="M564,252 V280 H444 V292" fill="none" stroke="var(--color-border-strong)"/>
    <polygon points="444,296 439,286 449,286" fill="var(--color-border-strong)"/>
    <text x="570" y="272" font-size="9.5" fill="var(--color-text-dim)">publish</text>
    <line x1="306" y1="160" x2="414" y2="160" stroke="var(--color-border-strong)" stroke-dasharray="3 3"/>
    <line x1="352" y1="152" x2="368" y2="168" stroke="var(--color-accent)"/>
    <line x1="352" y1="168" x2="368" y2="152" stroke="var(--color-accent)"/>
    <text x="360" y="142" font-size="10" text-anchor="middle" fill="var(--color-text-muted)">nothing on the wire</text>
    <rect x="180" y="296" width="360" height="52" rx="4" fill="var(--color-bg-elevated)" stroke="var(--color-border-strong)"/>
    <text x="196" y="318" font-size="12" fill="var(--color-text)">dumb relay</text>
    <text x="196" y="336" font-size="10" fill="var(--color-text-muted)">tag → 64-byte AEAD blob, one bucket per app scope</text>
  </g>
</svg>

*Neither side ever messages the other: each computes both tags offline and looks for the other's.*

Presence goes into a dumb key-value relay under that tag as a 64-byte AEAD blob with the epoch as associated data, so a replay into a later epoch is rejected. Rotating the tag hides the value, not the traffic pattern: a relay serving one GET per tag and seeing one PUT per friend learns friend counts and can rebuild the edges. So the client never reads per tag: it downloads the whole bucket for the app scope and matches locally. Writes are padded to a constant too - 64 entries per epoch, real tags mixed with dummies and shuffled.

An app only sees the present intersection: a handle, an ephemeral session pubkey, and capability bits. Finding a friend in that bucket is a lookup, not a search: you compute the tag they would publish under - a function of your shared secret, the app scope, the epoch, and their card key - and check the bucket you already hold for it. Two people can derive that tag and nobody else can derive it at all, so a hit means "this friend is present" without the relay learning who was looking. The cost is linear, though: every publisher writes 64 entries per epoch, so 10,000 users in one app scope is a bucket of roughly 50 MB that each client downloads every five minutes. That is why the design targets thousands per app scope rather than millions, with prefix sharding as an opt-in that divides the bucket at the cost of leaking which prefix you touched. The wallet half exists too: the extension answers `zafu_discover_contacts` under app-scoped handles, off by default behind a privacy-settings toggle. What it points at is small enough to run yourself - two routes over SQLite, no crypto, [minirelay](https://github.com/rotkonetworks/zafu/tree/main/apps/minirelay) in the repo - so what is missing is a running endpoint, not the code.

## Limits

What this does not do, and where each gap is headed.

**The live channel.** Recording it today buys nothing: each session's ML-KEM key is fresh, so a future quantum computer cannot read what it captured now. Forward secrecy is partial - the handshake is throwaway, and the channel re-keys every 256 messages off the previous key, so a key stolen today cannot read the messages sent before the last re-key.

The gap is recovery from a break-in. Say malware reads your device's memory once and grabs the live session key. Forward secrecy still hides everything you sent before that moment - but from then on the attacker can decrypt the rest of that session, even after the malware is gone, because each new key is derived from the one they already hold. The channel never re-randomizes itself from a secret they didn't see. Closing that means periodically folding in fresh key material so a single break-in stops paying off, the way [Signal's SPQR](https://signal.org/blog/spqr/) does.

**Contact discovery.** It trades away forward secrecy on purpose, and its keys are not post-quantum yet. The secret behind a rendezvous is a static X25519 value - the price of a lookup that needs no round-trip - so someone who records the relay now and later gets your contact key (or a quantum computer with the two public keys) can reconstruct who was online when. That leaks metadata and the shape of your graph, never message contents - those ride the hybrid channel and sealed box. Both fixes are queued: rotate the contact keys and drop the old ones, and ship `xwing-v1` (the contact card already reserves its slot). X-Wing is a KEM rather than a NIKE, so it runs once when you add a contact and caches the result; the tag, blob, and relay never notice.

**Scaling the bucket.** The bucket is linear in publishers, so a big enough app scope will outgrow it. [Penumbra](https://protocol.penumbra.zone/main/crypto/fmd.html) already ships the escape hatch: FMD, fuzzy message detection. A detection key lets a scanner test an entry and answer "possibly yours" or "not yours", with false positives you choose and no false negatives - 16 bits of precision is about one entry in 65,000 - so a client downloads a sliver instead of the whole bucket. Penumbra's version is 68-byte clues against a public clue key, a 32-byte detection key, and a policy that sets the precision from the observed clue rate, so bandwidth is a knob rather than a constant.

Mapped onto this design, a presence entry would carry a clue computed against a clue key the friend publishes in their contact card, and the friend's own detection key would do the matching. Two costs come with that, and both are real: matching is a scan of every entry per query - that is what makes it fuzzy and unindexable - so the scanner has to be a per-user service (self-hostable, or the wallet itself) rather than a shared relay; and that scanner then learns a quantifiable sliver of your friend set, which is the one thing this design otherwise never concedes. So the bucket is the right answer at today's sizes, and FMD behind a per-user scanner is the planned answer when a single scope outgrows it.

**The network itself.** None of this hides who talks to whom - a relay still sees which addresses connect, when, and how much. [Nym's free mixnet SDK](https://zcash-sdk.nym.com/guidance/) (Zcash primitives, runs in the browser) is on the roadmap for the paths that can afford the latency. Calls stay direct on purpose: no middleman on the media means nothing in the middle to record it.

## Product-market fit in the shielded wallet space

None of this is Zcash, and that is deliberate. Zcash has good desktop and mobile wallets for what wallets are for: deposit, hold, withdraw. A browser extension is not going to out-secure or out-mobile them. What the browser has is a social layer and the ability to extend software people already use. That is why the spending keys live on Zigner, an air-gapped signer that talks to the wallet over animated QR codes and nothing else: with the keys cold, the hot extension can be a poker table with a friend, a client that talks to an LLM in a TEE (confer.to, Phala, Venice), or any app that would otherwise hand your data to a server, except the server holds ciphertext and the plaintext is decrypted on your side.

The same question decides whether multisigs and escrows are usable at all. FROST gives us the threshold math and zafu already signs with it, so a 2-of-3 spend never assembles a key anywhere, but it does not make people reachable: that is a networking problem, and the wallet is well placed to solve it. A ZID is an identity your contacts already hold, a contact card opens a private channel, an invite turns a stranger into a counterparty, and presence, once the discovery relay is wired, says who is online. With those, an escrow is a flow rather than a protocol project, and the signing still happens on the cold device.

Key custody is hard, it fails silently, and nobody whose business depends on reading the data has an incentive to make it easier. The pressure is going to increase: open models are approaching the point where they find and exploit software flaws on their own, so cloud services will be compromised at a much higher rate and the data will spill. So we need client-side encryption everywhere. Your data should never sit on someone else's server in plaintext: it is encrypted on your device, by default, before it leaves, so when a server spills, what spills is unreadable.
