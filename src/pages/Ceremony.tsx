import { For, Show, createMemo, createSignal, onMount } from "solid-js";
import Page from "../components/Page";
import QrScanner from "../components/QrScanner";
import { ed25519Supported, loadOrCreateIdentity, login, type ZidIdentity } from "../lib/zid";
import { formatReleaseKeyBytes, parseReleaseKey, type ReleaseKey } from "../lib/release";

/**
 * Slot layout for the 2-of-3 release trust root:
 *   slot 0  GitHub / CI  - a software key (modpack keygen --count 1), age-
 *                          encrypted, signs in CI with `modpack sign`.
 *   slot 1  zigner A      - a device key derived from an existing seed.
 *   slot 2  zigner B      - a second device key, different seed, different holder.
 * Any two authorise a release, so a normal release is one zigner + CI, and a
 * fully-offline release is the two zigners.
 */
const SLOTS = [
  { kind: "ci" as const, name: "GitHub / CI", how: "modpack keygen --count 1, then read off slot 0's verifying key" },
  { kind: "device" as const, name: "zigner A", how: "on the device: Release key → slot 1 → read off slot:hex" },
  { kind: "device" as const, name: "zigner B", how: "on the device: Release key → slot 2 → read off slot:hex" },
];

/**
 * Step zero of the key ceremony: collect three release public keys and emit
 * the constant they get baked into.
 *
 * Public keys only - nothing here is secret, and nothing here is trusted.
 * A wrong key produces a kernel that rejects that holder's signatures, which
 * is loud and harmless. The failure that is NOT loud is three keys that are
 * not actually independent, so that is what the page pushes on.
 *
 * The output goes into an APK. That is the part people get surprised by:
 * module updates cannot work until a build carrying these keys has been
 * installed the ordinary way, because a module must never be able to grant
 * itself new trust anchors.
 */
export default function Ceremony() {
  const [identity, setIdentity] = createSignal<ZidIdentity | null>(null);
  const [supported, setSupported] = createSignal(true);
  const [status, setStatus] = createSignal("");
  const [inputs, setInputs] = createSignal<string[]>(["", "", ""]);
  const [scanning, setScanning] = createSignal<number | null>(null);

  onMount(() => setSupported(ed25519Supported()));

  function setSlot(i: number, value: string) {
    const next = [...inputs()];
    next[i] = value;
    setInputs(next);
  }

  async function connect() {
    setStatus("connecting…");
    try {
      const id = await loadOrCreateIdentity();
      await login(id);
      setIdentity(id);
      setStatus("");
    } catch (e) {
      setStatus(`error: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  const parsed = createMemo(() => {
    const keys: ReleaseKey[] = [];
    const errors: string[] = [];
    for (const raw of inputs()) {
      if (raw.trim() === "") continue;
      try {
        keys.push(parseReleaseKey(raw));
      } catch (e) {
        errors.push(e instanceof Error ? e.message : String(e));
      }
    }
    return { keys, errors };
  });

  /**
   * The check that matters. Everything else here is transcription; this is
   * the one mistake that produces a kernel which looks like 2-of-3 and is
   * not, and it is invisible once the APK ships.
   */
  const independence = createMemo(() => {
    const { keys } = parsed();
    const problems: string[] = [];
    const slots = new Set<number>();
    const seen = new Map<string, number>();
    for (const k of keys) {
      if (slots.has(k.index)) problems.push(`slot #${k.index} was given twice`);
      slots.add(k.index);
      const prev = seen.get(k.hex);
      if (prev !== undefined) {
        problems.push(
          `slots #${prev} and #${k.index} are the SAME key — that is 1-of-2, not 2-of-3. ` +
            `Two devices sharing a seed, or one device read twice.`,
        );
      }
      seen.set(k.hex, k.index);
      if (/^0+$/.test(k.hex)) {
        problems.push(
          `slot #${k.index} is all zero — the kernel refuses placeholder slots individually, ` +
            `because an all-zero encoding decodes to a valid small-order point whose ` +
            `signatures are forgeable.`,
        );
      }
    }
    return problems;
  });

  const complete = createMemo(() => parsed().keys.length === 3 && independence().length === 0);

  return (
    <Page
      title="Key ceremony"
      heading="Release key ceremony"
      lede="Collect three release public keys and produce the constant they are baked into."
    >
      <Show
        when={supported()}
        fallback={<p class="text-sm text-[var(--color-text-muted)]">This browser lacks the Web Crypto API required for ZID.</p>}
      >
        <Show
          when={identity()}
          fallback={
            <div class="max-w-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <button class="border border-[var(--color-border)] px-4 py-2 text-sm" onClick={connect}>
                Connect ZID
              </button>
              <Show when={status()}>
                <p class="mt-3 text-xs text-[var(--color-text-muted)]">{status()}</p>
              </Show>
            </div>
          }
        >
          <div class="flex flex-col gap-8">
            <section class="max-w-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 text-sm">
              <p class="mb-3 font-semibold">Before you start</p>
              <p class="mb-3 text-[var(--color-text-muted)]">
                Three slots, 2-of-3: <strong>slot 0</strong> is a GitHub/CI software key,
                <strong> slots 1 and 2</strong> are two zigner devices. A release needs any
                two — normally one zigner plus CI, or the two zigners fully offline.
              </p>
              <ul class="flex list-disc flex-col gap-2 pl-5 text-[var(--color-text-muted)]">
                <li>
                  The two device keys are <em>derived</em> from each zigner's existing seed
                  (domain <code>zigner-release</code>) — nothing is stored on the device,
                  and a release signature can never move funds. Two <em>different</em> seeds,
                  or it is 1-of-2, not 2-of-3.
                </li>
                <li>
                  The CI key is minted once, offline (<code>modpack keygen --count 1</code>),
                  kept age-encrypted; CI only ever holds this one key and signs with{" "}
                  <code>modpack sign</code>. It cannot reach the 2-of-3 alone.
                </li>
                <li>
                  Keep the two zigners apart, ideally with different people. Two devices in
                  one drawer survive nothing one device would not.
                </li>
                <li>
                  Seed backups count as keys. A backup card next to the other zigner undoes
                  the distribution you just did.
                </li>
              </ul>
            </section>

            <section>
              <h2 class="mb-2 text-sm font-semibold">Collect the keys</h2>
              <p class="mb-4 max-w-2xl text-sm text-[var(--color-text-muted)]">
                Public keys, so they travel over any channel. Scan the QR the device shows,
                or paste <code>index:hex</code> by hand.
              </p>
              <div class="flex max-w-3xl flex-col gap-4">
                <For each={inputs()}>
                  {(val, i) => (
                    <div class="flex flex-col gap-2">
                      <div class="flex items-baseline justify-between">
                        <span class="text-xs font-semibold">
                          slot {i()} — {SLOTS[i()].name}
                          <span class="ml-2 font-normal text-[var(--color-text-muted)]">
                            {SLOTS[i()].kind === "ci" ? "software key" : "device"}
                          </span>
                        </span>
                        <span class="font-mono text-[10px] text-[var(--color-text-muted)]">
                          {SLOTS[i()].how}
                        </span>
                      </div>
                      <div class="flex gap-2">
                        <input
                          class="flex-1 border border-[var(--color-border)] bg-transparent px-3 py-2 font-mono text-xs"
                          placeholder={`${i()}:…64 hex characters…`}
                          value={val}
                          onInput={(e) => setSlot(i(), e.currentTarget.value)}
                        />
                        <Show when={SLOTS[i()].kind === "device"}>
                          <button
                            class="border border-[var(--color-border)] px-3 py-2 text-xs"
                            onClick={() => setScanning(scanning() === i() ? null : i())}
                          >
                            {scanning() === i() ? "Cancel" : "Scan"}
                          </button>
                        </Show>
                      </div>
                      <Show when={scanning() === i()}>
                        <QrScanner
                          label={`Scan slot ${i()} (${SLOTS[i()].name})`}
                          onClose={() => setScanning(null)}
                          onScan={(text) => {
                            setSlot(i(), text.trim());
                            setScanning(null);
                          }}
                        />
                      </Show>
                    </div>
                  )}
                </For>
              </div>
              <Show when={parsed().errors.length > 0}>
                <ul class="mt-3 flex flex-col gap-1">
                  <For each={parsed().errors}>
                    {(e) => <li class="text-sm text-red-500">{e}</li>}
                  </For>
                </ul>
              </Show>
              <Show when={independence().length > 0}>
                <ul class="mt-3 flex flex-col gap-2">
                  <For each={independence()}>
                    {(e) => <li class="text-sm text-red-500">{e}</li>}
                  </For>
                </ul>
              </Show>
            </section>

            <Show when={complete()}>
              <section>
                <h2 class="mb-2 text-sm font-semibold">Bake it in</h2>
                <p class="mb-3 max-w-2xl text-sm text-[var(--color-text-muted)]">
                  Replace <code>RELEASE_KEY_BYTES</code> in{" "}
                  <code>rust/module_host/src/lib.rs</code>, bump{" "}
                  <code>BAKED_MODULE_VERSION</code> if the module changed, and build.
                </p>
                <pre class="overflow-x-auto border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 text-xs">
{formatReleaseKeyBytes(parsed().keys)}
                </pre>
                <div class="mt-5 border-l-2 border-[var(--color-border)] pl-4 text-sm text-[var(--color-text-muted)]">
                  <p class="mb-2">
                    <strong>Module updates do not work until this ships in an APK.</strong>{" "}
                    The keys live in the kernel, so a build carrying them has to be
                    installed the ordinary way first — USB, store or F-Droid. The first
                    APK with real keys cannot arrive by module update, by design: a module
                    must never be able to grant itself new trust anchors.
                  </p>
                  <p>
                    Until then the kernel fails closed and refuses every package, which is
                    the correct state rather than a bug to work around.
                  </p>
                </div>
              </section>
            </Show>
          </div>
        </Show>
      </Show>
    </Page>
  );
}
