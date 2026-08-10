import { For, Show, createMemo, createSignal, onMount } from "solid-js";
import Page from "../components/Page";
import { ed25519Supported, loadOrCreateIdentity, login, type ZidIdentity } from "../lib/zid";
import { formatReleaseKeyBytes, parseReleaseKey, type ReleaseKey } from "../lib/release";

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

  onMount(() => setSupported(ed25519Supported()));

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
              <ul class="flex list-disc flex-col gap-2 pl-5 text-[var(--color-text-muted)]">
                <li>
                  Three <em>separate seeds</em> on three <em>separate devices</em>. Not three
                  slots derived from one seed — the threshold only buys something if the
                  keys can fail independently.
                </li>
                <li>
                  Dedicated devices holding no funds. A seed that signs releases and holds
                  money turns one theft into two incidents.
                </li>
                <li>
                  Kept apart, and ideally not all by the same person. Three devices in one
                  drawer survive nothing that one device would not.
                </li>
                <li>
                  Seed backups count as keys. Three backup cards in one place undoes the
                  distribution you just did.
                </li>
              </ul>
            </section>

            <section>
              <h2 class="mb-2 text-sm font-semibold">Collect the keys</h2>
              <p class="mb-4 max-w-2xl text-sm text-[var(--color-text-muted)]">
                On each device: Release key → pick a slot → read off{" "}
                <code>index:hex</code>. Public keys, so they can travel over any channel.
              </p>
              <div class="flex max-w-3xl flex-col gap-2">
                <For each={inputs()}>
                  {(val, i) => (
                    <input
                      class="border border-[var(--color-border)] bg-transparent px-3 py-2 font-mono text-xs"
                      placeholder={`${i()}:…64 hex characters…`}
                      value={val}
                      onInput={(e) => {
                        const next = [...inputs()];
                        next[i()] = e.currentTarget.value;
                        setInputs(next);
                      }}
                    />
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
