import { For, Show, createMemo, createSignal, onMount } from "solid-js";
import Page from "../components/Page";
import { StaticQR } from "../components/AnimatedQR";
import {
  ed25519Supported,
  loadOrCreateIdentity,
  login,
  type ZidIdentity,
} from "../lib/zid";
import {
  PAYLOAD_BSDIFF_ZSTD,
  assemble,
  grouped,
  parsePrefix,
  parseSignature,
  prefixToQrPayload,
  sha256Hex,
  transferEstimate,
  type Prefix,
} from "../lib/release";

/**
 * Coordinator for a zigner module release.
 *
 * It holds no key material and is not trusted. The release keys live on three
 * zigner devices; this page shows them what to sign and staples the results
 * together. A compromised page cannot forge a package - it has no keys - and
 * cannot cause a holder to sign something they were not shown, because the
 * device parses the manifest itself and renders the version, hash and
 * changelog from the bytes it actually received.
 *
 * That guarantee only reaches the human if they compare the hash against a
 * module they built. So this page shows the hash it computed as something to
 * check its own work against, never as the authority.
 *
 * Login gates who can drive this UI. It is NOT what authorises a release -
 * two of three device signatures are. Worth being explicit about, because a
 * login prompt is exactly the sort of thing that gets mistaken for security.
 */

async function readFile(f: File): Promise<Uint8Array> {
  return new Uint8Array(await f.arrayBuffer());
}

export default function Release() {
  const [identity, setIdentity] = createSignal<ZidIdentity | null>(null);
  const [supported, setSupported] = createSignal(true);
  const [status, setStatus] = createSignal("");

  const [prefixBytes, setPrefixBytes] = createSignal<Uint8Array | null>(null);
  const [payloadBytes, setPayloadBytes] = createSignal<Uint8Array | null>(null);
  const [prefix, setPrefix] = createSignal<Prefix | null>(null);
  const [prefixError, setPrefixError] = createSignal("");
  const [payloadSha, setPayloadSha] = createSignal("");
  const [sigInputs, setSigInputs] = createSignal<string[]>(["", ""]);
  const [built, setBuilt] = createSignal<Uint8Array | null>(null);

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

  async function onPrefix(f: File | undefined) {
    if (!f) return;
    setBuilt(null);
    try {
      const b = await readFile(f);
      setPrefix(parsePrefix(b));
      setPrefixBytes(b);
      setPrefixError("");
    } catch (e) {
      setPrefix(null);
      setPrefixBytes(null);
      setPrefixError(e instanceof Error ? e.message : String(e));
    }
  }

  async function onPayload(f: File | undefined) {
    if (!f) return;
    setBuilt(null);
    const b = await readFile(f);
    setPayloadBytes(b);
    setPayloadSha(await sha256Hex(b));
  }

  /**
   * The signed manifest commits to the payload's exact length, so a mismatch
   * means the two files did not come from the same `modpack prepare` run.
   * Catching it here saves a ceremony that would end in a device rejection.
   */
  const lengthMismatch = createMemo(() => {
    const p = prefix();
    const pay = payloadBytes();
    if (!p || !pay) return null;
    return pay.length === p.payloadLen
      ? null
      : `payload is ${pay.length} bytes but the signed manifest commits to ${p.payloadLen} — these files are from different runs`;
  });

  const ready = createMemo(() => prefix() !== null && payloadBytes() !== null && !lengthMismatch());

  function build() {
    const p = prefixBytes();
    const pay = payloadBytes();
    if (!p || !pay) return;
    try {
      const sigs = sigInputs()
        .filter((s) => s.trim() !== "")
        .map(parseSignature);
      setBuilt(assemble(p, sigs, pay));
      setStatus("");
    } catch (e) {
      setBuilt(null);
      setStatus(`error: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  function download() {
    const b = built();
    const p = prefix();
    if (!b || !p) return;
    const url = URL.createObjectURL(new Blob([b as BlobPart], { type: "application/octet-stream" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `module${p.moduleVersion}.zmod`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Page
      title="Release"
      heading="Module release"
      lede="Coordinates a 2-of-3 module signing. The keys stay on the devices; this page never sees one."
    >
      <Show
        when={supported()}
        fallback={<p class="text-sm text-[var(--color-text-muted)]">This browser lacks the Web Crypto API required for ZID.</p>}
      >
        <Show
          when={identity()}
          fallback={
            <div class="max-w-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <p class="mb-4 text-sm text-[var(--color-text-muted)]">
                Sign in with your ZID to use the coordinator. This controls who can
                drive the page — it is not what authorises a release. Two of three
                device signatures are.
              </p>
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
            {/* 1 — inputs */}
            <section>
              <h2 class="mb-2 text-sm font-semibold">1 · Load what modpack produced</h2>
              <p class="mb-4 max-w-2xl text-sm text-[var(--color-text-muted)]">
                <code>modpack prepare --module module0.wasm --version N --changelog NOTES.md</code>
                {" "}on the build host. The manifest is built there, in the same code the
                device verifies with, rather than reimplemented in a browser.
              </p>
              <div class="flex flex-col gap-3 text-sm">
                <label class="flex items-center gap-3">
                  <span class="w-28 text-[var(--color-text-muted)]">prefix.bin</span>
                  <input type="file" onChange={(e) => onPrefix(e.currentTarget.files?.[0])} />
                </label>
                <label class="flex items-center gap-3">
                  <span class="w-28 text-[var(--color-text-muted)]">payload.bin</span>
                  <input type="file" onChange={(e) => onPayload(e.currentTarget.files?.[0])} />
                </label>
              </div>
              <Show when={prefixError()}>
                <p class="mt-3 text-sm text-red-500">{prefixError()}</p>
              </Show>
              <Show when={lengthMismatch()}>
                <p class="mt-3 text-sm text-red-500">{lengthMismatch()}</p>
              </Show>
            </section>

            {/* 2 — what is being signed */}
            <Show when={prefix()}>
              {(p) => (
                <section>
                  <h2 class="mb-2 text-sm font-semibold">2 · Check before anyone signs</h2>
                  <div class="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 text-sm">
                    <dl class="grid grid-cols-[10rem_1fr] gap-y-2">
                      <dt class="text-[var(--color-text-muted)]">Module version</dt>
                      <dd>{p().moduleVersion}</dd>
                      <dt class="text-[var(--color-text-muted)]">Minimum app version</dt>
                      <dd>{p().minKernelVersion}</dd>
                      <dt class="text-[var(--color-text-muted)]">Payload</dt>
                      <dd>
                        {p().payloadKind === PAYLOAD_BSDIFF_ZSTD ? "bsdiff+zstd delta" : "full module"}
                        {" · "}
                        {p().payloadLen.toLocaleString()} bytes
                      </dd>
                      <dt class="text-[var(--color-text-muted)]">QR transfer</dt>
                      <dd>{transferEstimate(p().payloadLen)}</dd>
                      <dt class="text-[var(--color-text-muted)]">Payload sha256</dt>
                      <dd class="break-all font-mono text-xs">{payloadSha()}</dd>
                    </dl>

                    <p class="mt-5 mb-1 text-[var(--color-text-muted)]">Module hash</p>
                    <p class="break-all font-mono text-xs leading-relaxed">
                      {grouped(p().moduleHashHex)}
                    </p>
                    <p class="mt-2 text-xs text-[var(--color-text-muted)]">
                      Each device will show this. Compare it against{" "}
                      <code>sha256sum</code> of the module you built — not against this
                      page, which could be lying to you as easily as it could be right.
                    </p>

                    <Show when={p().description}>
                      <p class="mt-5 mb-1 text-[var(--color-text-muted)]">Changelog (inside the signed bytes)</p>
                      <pre class="whitespace-pre-wrap text-xs">{p().description}</pre>
                    </Show>
                  </div>
                </section>
              )}
            </Show>

            {/* 3 — the QR the holders scan */}
            <Show when={ready()}>
              <section>
                <h2 class="mb-2 text-sm font-semibold">3 · Have two holders scan this</h2>
                <p class="mb-4 max-w-2xl text-sm text-[var(--color-text-muted)]">
                  Two of three, each on a different device. A holder elsewhere can scan
                  this off a screen share and send back the 128-character signature —
                  nothing secret crosses the wire.
                </p>
                <div class="inline-block border border-[var(--color-border)] bg-white p-4">
                  <StaticQR data={prefixToQrPayload(prefixBytes()!)} size={320} light="#fff" />
                </div>
              </section>

              {/* 4 — collect */}
              <section>
                <h2 class="mb-2 text-sm font-semibold">4 · Paste the signatures</h2>
                <p class="mb-4 text-sm text-[var(--color-text-muted)]">
                  Each device shows its signature as bare hex. Any two from different
                  keys - order does not matter, the app matches them to the pinned set.
                </p>
                <div class="flex max-w-2xl flex-col gap-2">
                  <For each={sigInputs()}>
                    {(val, i) => (
                      <input
                        class="border border-[var(--color-border)] bg-transparent px-3 py-2 font-mono text-xs"
                        placeholder="0:9f3a…"
                        value={val}
                        onInput={(e) => {
                          const next = [...sigInputs()];
                          next[i()] = e.currentTarget.value;
                          setSigInputs(next);
                        }}
                      />
                    )}
                  </For>
                  <div class="flex gap-2">
                    <button
                      class="border border-[var(--color-border)] px-3 py-1 text-xs"
                      onClick={() => setSigInputs([...sigInputs(), ""])}
                    >
                      Add a third
                    </button>
                    <button class="border border-[var(--color-border)] px-4 py-1 text-xs" onClick={build}>
                      Assemble
                    </button>
                  </div>
                </div>
                <Show when={status()}>
                  <p class="mt-3 text-sm text-red-500">{status()}</p>
                </Show>
              </section>
            </Show>

            {/* 5 — result */}
            <Show when={built()}>
              {(b) => (
                <section>
                  <h2 class="mb-2 text-sm font-semibold">5 · Verify, then ship</h2>
                  <p class="mb-3 text-sm text-[var(--color-text-muted)]">
                    {b().length.toLocaleString()} bytes. Run the real device verifier over
                    it before it goes anywhere:
                  </p>
                  <pre class="mb-4 overflow-x-auto border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 text-xs">
{`modpack verify --package module${prefix()!.moduleVersion}.zmod \\
  --key 0:HEX --key 1:HEX --key 2:HEX`}
                  </pre>
                  <button class="border border-[var(--color-border)] px-4 py-2 text-sm" onClick={download}>
                    Download .zmod
                  </button>
                </section>
              )}
            </Show>
          </div>
        </Show>
      </Show>
    </Page>
  );
}
