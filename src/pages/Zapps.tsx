import { For } from "solid-js";
import { A } from "@solidjs/router";
import Page from "../components/Page";

/**
 * Index of the ZID-authenticated tools.
 *
 * Kept honest about status on purpose. A tools page that lists things which
 * do not work yet, without saying so, costs more than it saves - someone
 * turns up mid-release expecting a working button.
 */

type Status = "live" | "partial" | "planned";

interface Zapp {
  name: string;
  href?: string;
  blurb: string;
  status: Status;
  /** What is actually missing. Shown for anything not live. */
  gap?: string;
}

const ZAPPS: Zapp[] = [
  {
    name: "Key ceremony",
    href: "/ceremony",
    blurb:
      "Collect three release public keys from three devices and emit the constant they get baked into. Checks that the keys are actually independent.",
    status: "live",
  },
  {
    name: "Module release",
    href: "/release",
    blurb:
      "Coordinate a 2-of-3 signing over a module manifest, then assemble the package. Keys stay on the devices; this never sees one.",
    status: "partial",
    gap:
      "Signatures paste in fine. Scanning them from the device needs a camera route on the zigner that is not written yet.",
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    blurb:
      "End-to-end encrypted notes. Login is a ZID signature; the server only ever holds ciphertext.",
    status: "partial",
    gap: "Runs locally. The server half of the API is a contract, not yet an implementation.",
  },
  {
    name: "Encrypted pastes",
    blurb:
      "Share a secret with a ZID contact, optionally on a delay. Encrypted to the recipient, so the host holds ciphertext and nothing else.",
    status: "planned",
    gap:
      "Two unsolved pieces. Contact discovery: ZID is ed25519, so encrypting to someone needs an X25519 conversion and a way to look their key up. Time-release: releasing on a schedule means either a party trusted to hold the key until then — which gives away the point — or a threshold beacon like drand. Worth costing before promising the feature.",
  },
  {
    name: "ZID messaging",
    blurb: "Talk to other ZIDs without an account, a phone number, or a directory.",
    status: "planned",
    gap:
      "The largest item here by a wide margin, and the one most likely to eat the project. Worth being clear that a signer that ships late because it grew a chat app is a worse outcome than no chat app.",
  },
];

const BADGE: Record<Status, string> = {
  live: "border-[var(--color-border)]",
  partial: "border-[var(--color-border)] opacity-70",
  planned: "border-[var(--color-border)] opacity-40",
};

const SUGGEST =
  "https://github.com/rotkonetworks/zafu.pro/issues/new?labels=zapp&title=ZAPP%20idea%3A%20";

export default function Zapps() {
  return (
    <Page
      title="ZAPPs"
      heading="ZAPPs"
      lede="Small tools behind a ZID login. No accounts, no email, no KYC — you sign in with a key you already hold."
    >
      <div class="flex flex-col gap-10">
        <section class="flex flex-col gap-4">
          <For each={ZAPPS}>
            {(z) => (
              <div class={`border ${BADGE[z.status]} bg-[var(--color-bg-elevated)] p-5`}>
                <div class="mb-2 flex items-baseline justify-between gap-4">
                  <h2 class="text-sm font-semibold">
                    {z.href ? (
                      <A href={z.href} class="underline underline-offset-4">
                        {z.name}
                      </A>
                    ) : (
                      z.name
                    )}
                  </h2>
                  <span class="shrink-0 text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                    {z.status}
                  </span>
                </div>
                <p class="text-sm text-[var(--color-text-muted)]">{z.blurb}</p>
                {z.gap && (
                  <p class="mt-3 border-l-2 border-[var(--color-border)] pl-3 text-xs text-[var(--color-text-muted)]">
                    {z.gap}
                  </p>
                )}
              </div>
            )}
          </For>
        </section>

        <section class="max-w-2xl border border-[var(--color-border)] p-5">
          <h2 class="mb-2 text-sm font-semibold">Suggest one</h2>
          <p class="mb-4 text-sm text-[var(--color-text-muted)]">
            Ideas go in the issue tracker rather than a form here — that way the
            discussion is public, versioned, and does not need a backend to exist.
          </p>
          <a
            class="inline-block border border-[var(--color-border)] px-4 py-2 text-sm"
            href={SUGGEST}
            target="_blank"
            rel="noreferrer noopener"
          >
            Open an issue
          </a>
        </section>

        <section class="max-w-2xl text-sm text-[var(--color-text-muted)]">
          <p>
            What makes something a good ZAPP here: it should hold no secrets it does
            not have to, work without trusting this site, and be small enough that
            you could read it. The release tools qualify because the keys live on
            devices and the signatures are checked somewhere else — the page being
            wrong is an inconvenience, not a compromise.
          </p>
        </section>
      </div>
    </Page>
  );
}
