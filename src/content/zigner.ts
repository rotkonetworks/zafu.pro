import type { PageContent } from "./types";
import { SUPPORT_CHANNELS } from "./support";

export const zignerSecurity: PageContent = {
  title: "Zigner Security",
  heading: "Security",
  stamp: "印",
  lede: "Zigner is an air-gapped signer for a dedicated Android phone. Keys are wrapped by hardware-backed keystores, and the only I/O channel is the camera and screen.",
  sections: [
    {
      id: "key-storage",
      title: "Hardware Key Storage",
      blocks: [
        {
          kind: "specs",
          entries: [
            {
              title: "Pixel 8+",
              value: "StrongBox / Titan M2",
              description:
                "The master wrapping key lives in the discrete Titan M2 security chip, isolated from the main SoC.",
            },
            {
              title: "Other devices",
              value: "TEE keystore",
              description:
                "Devices without StrongBox fall back to keys held in the Trusted Execution Environment.",
            },
            {
              title: "Data at rest",
              value: "AES-256-GCM",
              description:
                "Seed and key material are encrypted under the hardware master key, which never leaves the secure hardware.",
            },
            {
              title: "Preferences",
              value: "AES-256-SIV",
              description:
                "Misuse-resistant authenticated encryption for settings; nonce reuse cannot leak plaintext.",
            },
          ],
        },
      ],
    },
    {
      id: "air-gap",
      title: "Air Gap & QR Protocol",
      lede: "Zigner is intended to run on a device with radios permanently disabled. All communication with the online wallet is camera-in, screen-out.",
      blocks: [
        {
          kind: "specs",
          entries: [
            {
              title: "Transport",
              value: "RaptorQ + UR",
              description:
                "Large payloads stream as animated QR frames; the receiver reconstructs from any sufficient subset, tolerating missed frames without a back-channel.",
            },
            {
              title: "Display",
              value: "animated APNG",
              description: "QR sequences render as animated APNG on the signer's screen.",
            },
            {
              title: "Review before sign",
              value: "on-device",
              description:
                "The signer decodes and shows the full transaction effects on its own screen; the user confirms on the air-gapped device, not the online one.",
            },
          ],
        },
      ],
    },
    {
      id: "frost",
      title: "FROST",
      blocks: [
        {
          kind: "specs",
          entries: [
            {
              title: "Key generation",
              value: "3-round DKG",
              description:
                "Dealerless; each signer holds only a share and no device ever contains the full spending key.",
            },
            {
              title: "Signing",
              value: "2-round, t-of-n",
              description: "Threshold signing over the QR channel.",
            },
            {
              title: "Nonce reuse detection",
              value: "SHA-256 fingerprints",
              description:
                "Every session's nonce commitments are fingerprinted with SHA-256 and checked against history; a repeat aborts before any signature share is produced, preventing key extraction via nonce reuse.",
            },
          ],
        },
      ],
    },
    {
      id: "android",
      title: "Android Hardening",
      blocks: [
        {
          kind: "specs",
          entries: [
            {
              title: "Minimum SDK",
              value: "23",
              description:
                "Android 6.0 — the floor for the hardware-backed keystore guarantees the app relies on.",
            },
            {
              title: "Target SDK",
              value: "35",
              description: "Built against current Android platform security defaults.",
            },
            {
              title: "ABIs",
              value: "arm64-v8a, armeabi-v7a",
              description: "Native builds for 64-bit and 32-bit ARM.",
            },
            {
              title: "Network",
              value: "none",
              description:
                "Recommended deployment: factory-reset device, airplane mode, radios never re-enabled.",
            },
          ],
        },
      ],
    },
  ],
};

export const zignerSpecs: PageContent = {
  title: "Zigner Specs",
  heading: "Specifications",
  stamp: "印",
  lede: "Supported chains, cryptography, and platform architecture.",
  sections: [
    {
      id: "coins",
      title: "Supported Coins & Protocols",
      blocks: [
        {
          kind: "specs",
          cols: 3,
          entries: [
            {
              title: "Zcash",
              value: "Ironwood / Orchard",
              description:
                "Shielded signing with RedPallas spend authorization; transactions exchanged as PCZT v2. Ironwood active, Orchard legacy.",
            },
            {
              title: "Penumbra",
              value: "decaf377",
              description: "Transfers, swaps, staking, voting, IBC.",
            },
            {
              title: "Substrate",
              value: "Polkadot SDK",
              description: "Polkadot-ecosystem chains.",
              upcoming: true,
            },
            {
              title: "Cosmos",
              value: "Cosmos SDK",
              description: "Cosmos SDK chains.",
              upcoming: true,
            },
            {
              title: "Bitcoin",
              value: "optional",
              description: "Included via a build-time feature flag.",
              upcoming: true,
            },
            {
              title: "Nostr",
              value: "events",
              description: "Nostr event signing.",
              upcoming: true,
            },
            {
              title: "atproto",
              value: "identity",
              description: "AT Protocol identity operations.",
              upcoming: true,
            },
          ],
        },
      ],
    },
    {
      id: "crypto",
      title: "Cryptography",
      blocks: [
        {
          kind: "specs",
          entries: [
            {
              title: "Key wrapping",
              value: "AES-256-GCM",
              description:
                "Master key held in StrongBox (Titan M2 on Pixel 8+) or TEE-backed Android Keystore.",
            },
            {
              title: "Preferences",
              value: "AES-256-SIV",
              description: "Nonce-misuse-resistant AEAD for settings storage.",
            },
            {
              title: "FROST DKG",
              value: "3 rounds",
              description: "Dealerless distributed key generation.",
            },
            {
              title: "FROST signing",
              value: "2 rounds, t-of-n",
              description: "Threshold Schnorr signing.",
            },
            {
              title: "Nonce reuse detection",
              value: "SHA-256",
              description: "Fingerprints of nonce commitments tracked across sessions.",
            },
          ],
        },
      ],
    },
    {
      id: "qr",
      title: "QR Protocol",
      blocks: [
        {
          kind: "specs",
          entries: [
            {
              title: "Erasure coding",
              value: "RaptorQ",
              description:
                "Payloads split into fountain-coded frames, decodable from any sufficient subset — dropped frames cost nothing.",
            },
            {
              title: "Encoding",
              value: "UR",
              description: "Uniform Resources encoding for typed binary payloads in QR.",
            },
            {
              title: "Rendering",
              value: "animated APNG",
              description: "Multi-frame QR sequences displayed as animated APNG.",
            },
          ],
        },
      ],
    },
    {
      id: "platform",
      title: "Platform",
      blocks: [
        {
          kind: "specs",
          entries: [
            { title: "Min SDK", value: "23", description: "Android 6.0." },
            { title: "Target SDK", value: "35", description: "Current Android target." },
            {
              title: "ABIs",
              value: "arm64-v8a, armeabi-v7a",
              description: "64-bit and 32-bit ARM.",
            },
            {
              title: "Secure hardware",
              value: "StrongBox / TEE",
              description: "Titan M2 StrongBox on Pixel 8+; TEE-backed keystore elsewhere.",
            },
          ],
        },
      ],
    },
  ],
};

export const zignerDocs: PageContent = {
  title: "Zigner Docs",
  heading: "Documentation",
  stamp: "印",
  lede: "Building the APK, preparing a dedicated device, and using the QR signing and FROST workflows.",
  sections: [
    {
      id: "requirements",
      title: "Device Requirements",
      blocks: [
        {
          kind: "specs",
          entries: [
            {
              title: "Android version",
              value: "6.0+ (SDK 23)",
              description: "Minimum supported Android version.",
            },
            {
              title: "Architecture",
              value: "arm64-v8a / armeabi-v7a",
              description: "64-bit and 32-bit ARM builds are produced.",
            },
            {
              title: "Recommended device",
              value: "Pixel 8+",
              description:
                "StrongBox key storage backed by the Titan M2 chip. Other devices use the TEE-backed keystore.",
            },
            {
              title: "Camera",
              value: "required",
              description: "Used to scan animated QR payloads from the online wallet.",
            },
          ],
        },
      ],
    },
    {
      id: "installing",
      title: "Installing",
      lede: "Three routes to the same APK, easiest first. Once it is on the phone the app walks you through the rest — taking the device offline, and generating or restoring a seed.",
      blocks: [
        {
          kind: "tabs",
          tabs: [
            {
              label: "F-Droid",
              note: "recommended",
              blocks: [
                {
                  kind: "steps",
                  steps: [
                    {
                      title: "Add the repository",
                      body: "In F-Droid: Settings → Repositories → +, then enter https://foss.rotko.net/fdroid/repo. Compare the fingerprint it shows against the one published on foss.rotko.net before accepting — that fingerprint is what pins the repository to us.",
                    },
                    {
                      title: "Install Zigner",
                      body: "Search for Zigner and install. Updates appear as soon as a release is tagged, and F-Droid will tell you when one is waiting.",
                    },
                  ],
                },
                {
                  kind: "links",
                  links: [
                    {
                      title: "Our F-Droid repository",
                      href: "https://foss.rotko.net",
                      value: "foss.rotko.net",
                      description:
                        "The APKs here are the signed artifacts from the release workflow — the same builds, under the same signing key, as the GitHub releases. Switching between the two sources never forces a reinstall.",
                    },
                  ],
                },
              ],
            },
            {
              label: "GitHub release",
              blocks: [
                {
                  kind: "steps",
                  steps: [
                    {
                      title: "Download",
                      body: "Take zigner-vX.Y.Z.apk plus SHA256SUMS and SHA256SUMS.sig from the release page.",
                    },
                    {
                      title: "Verify",
                      body: "Check the APK against SHA256SUMS, and check SHA256SUMS itself against its ssh signature. Verifying the checksum without verifying its signature only proves the file downloaded intact.",
                    },
                    {
                      title: "Sideload",
                      body: "adb install -r the APK while the device is still trusted, then take it offline.",
                    },
                  ],
                },
                {
                  kind: "code",
                  code: "sha256sum -c SHA256SUMS\nssh-keygen -Y verify -f allowed_signers -I release@rotko.net \\\n  -n file -s SHA256SUMS.sig < SHA256SUMS\nadb install -r zigner-vX.Y.Z.apk",
                  caption:
                    "allowed_signers is a file you create: one line reading `release@rotko.net ssh-ed25519 AAAA...`, holding the release signing key. Get that key from a channel you already trust — a signature that carries its own key proves only that the file was signed by whoever signed it.",
                },
                {
                  kind: "links",
                  links: [
                    {
                      title: "GitHub releases",
                      href: "https://github.com/rotkonetworks/zigner/releases",
                      value: "apk + checksums",
                      description: "Signed APK, SHA256SUMS, and the ssh-signed checksum file.",
                    },
                  ],
                },
              ],
            },
            {
              label: "From source",
              note: "advanced",
              blocks: [
                {
                  kind: "code",
                  code: "git clone https://github.com/rotkonetworks/zigner\ncd zigner\n./gradlew :android:assembleRelease\n# APK output: android/build/outputs/apk/release/",
                  caption:
                    "Release builds target SDK 35. The Rust signer compiles to both a native library and a WebAssembly module during the build, so the first build takes a while. Cargo.lock is committed, so the dependency set is pinned.",
                },
                {
                  kind: "steps",
                  steps: [
                    {
                      title: "Build",
                      body: "A local build is signed with your own key, not ours — it will not upgrade an install that came from F-Droid or a GitHub release, and vice versa. Pick one source and stay on it.",
                    },
                    {
                      title: "Sideload",
                      body: "adb install -r the APK you built while the device is still trusted.",
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
      id: "qr",
      title: "QR Signing Protocol",
      lede: "All communication is one-directional per leg: camera in, screen out. Payloads are UR-encoded, fountain-coded with RaptorQ, and displayed as animated APNG QR sequences reconstructible from any sufficient subset of frames.",
      blocks: [
        {
          kind: "steps",
          steps: [
            {
              title: "Scan the request",
              body: "Point Zigner's camera at the wallet's animated QR. Progress accumulates as frames arrive; frame order and drops don't matter.",
            },
            {
              title: "Review",
              body: "Zigner decodes the transaction (e.g. a Zcash PCZT v2) and displays its full effects on the air-gapped screen.",
            },
            {
              title: "Sign",
              body: "Confirm on-device. Signing uses the chain's native scheme: RedPallas for Zcash Orchard, decaf377 for Penumbra. Support for Substrate, Cosmos, Bitcoin, Nostr, and atproto is upcoming.",
            },
            {
              title: "Return the response",
              body: "Signatures are displayed back as an animated QR sequence for the wallet to scan and broadcast.",
            },
          ],
        },
      ],
    },
    {
      id: "frost",
      title: "FROST Setup",
      lede: "FROST distributes a spending key across n devices with a t-of-n signing threshold. All rounds run over the same QR channel.",
      blocks: [
        {
          kind: "steps",
          steps: [
            {
              title: "Distributed key generation",
              body: "All n participants complete the 3-round DKG, exchanging round packages via QR. No dealer exists; each device ends up with only its own share.",
            },
            {
              title: "Verify",
              body: "Every participant checks that all devices derived the same group verification key before any funds are sent to it.",
            },
            {
              title: "Threshold signing",
              body: "Any t participants run the 2-round signing protocol: round one exchanges nonce commitments, round two exchanges signature shares.",
            },
            {
              title: "Nonce safety",
              body: "Zigner fingerprints nonce commitments with SHA-256 and stores them; if a commitment ever repeats, the session aborts before any signature share is emitted.",
            },
          ],
        },
      ],
    },
    {
      id: "support",
      title: "Support & Community",
      lede: "Zigner bugs and feature requests belong on our issue tracker — that is the channel we watch — and we post progress in our Zcash forum development thread. The Zcash and Penumbra Discords are upstream protocol communities: the right place for questions about the chains themselves, not about the signer.",
      blocks: [
        {
          kind: "links",
          links: SUPPORT_CHANNELS,
        },
      ],
    },
  ],
};

export const zignerRoadmap: PageContent = {
  title: "Zigner Roadmap",
  heading: "Roadmap",
  stamp: "印",
  lede: "Where Zigner is headed. Android is the present; radio-free signing hardware is the through-line.",
  sections: [
    {
      id: "high-priority",
      title: "High Priority",
      blocks: [
        {
          kind: "specs",
          entries: [
            {
              title: "Post-quantum encryption",
              value: "PQ migration",
              description:
                "Move key wrapping and the QR channel to post-quantum schemes, matching Zafu's PQ migration — captured QR frames or extracted storage today must not be decryptable later.",
            },
          ],
        },
      ],
    },
    {
      id: "near",
      title: "Near Term",
      blocks: [
        {
          kind: "specs",
          entries: [
            {
              title: "Store distribution",
              value: "Google Play / F-Droid",
              description:
                "Signed builds in both stores so provisioning a signer does not require sideloading. GitHub releases stay the canonical source.",
            },
          ],
        },
      ],
    },
    {
      id: "distant",
      title: "Distant",
      blocks: [
        {
          kind: "specs",
          entries: [
            {
              title: "iOS support",
              value: "old iPhones",
              description:
                "Turns a spare iPhone into a signer with Secure Enclave key storage.",
            },
            {
              title: "iPod touch 6",
              value: "radio-free target",
              description:
                "No cellular radio at all makes it a near-perfect dedicated signer — camera, screen, Wi-Fi off and it is dark. Increasingly hard to find, but worth supporting.",
            },
          ],
        },
      ],
    },
  ],
};
