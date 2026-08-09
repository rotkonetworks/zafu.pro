import { Show, createSignal, onMount } from "solid-js";
import Page from "../components/Page";
import {
  ed25519Supported,
  hasIdentity,
  loadOrCreateIdentity,
  destroyIdentity,
  login,
  encryptVault,
  decryptVault,
  saveVault,
  loadVault,
  type ZidIdentity,
} from "../lib/zid";

/**
 * End-to-end encrypted dashboard.
 * Login is ZID challenge-response (ed25519); vault contents are encrypted
 * with AES-256-GCM client-side, so the server only ever stores ciphertext.
 */
export default function Dashboard() {
  const [identity, setIdentity] = createSignal<ZidIdentity | null>(null);
  const [session, setSession] = createSignal<string | null>(null);
  const [mode, setMode] = createSignal<"server" | "local">("local");
  const [note, setNote] = createSignal("");
  const [status, setStatus] = createSignal("");
  const [supported, setSupported] = createSignal(true);
  const [existing, setExisting] = createSignal(false);

  onMount(() => {
    setSupported(ed25519Supported());
    setExisting(hasIdentity());
  });

  async function connect() {
    setStatus("connecting…");
    try {
      const id = await loadOrCreateIdentity();
      const { session: s, mode: m } = await login(id);
      setIdentity(id);
      setSession(s);
      setMode(m);
      const blob = await loadVault(s);
      if (blob) setNote(await decryptVault(blob));
      setStatus("");
    } catch (e) {
      setStatus(`error: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  async function save() {
    const s = session();
    if (!s) return;
    setStatus("encrypting…");
    const blob = await encryptVault(note());
    const where = await saveVault(blob, s);
    setStatus(`saved (ciphertext → ${where})`);
  }

  function disconnect() {
    setIdentity(null);
    setSession(null);
    setNote("");
    setExisting(hasIdentity());
  }

  function wipe() {
    destroyIdentity();
    disconnect();
    setStatus("identity and vault destroyed on this device");
  }

  return (
    <Page
      title="Dashboard"
      heading="Dashboard"
      lede="End-to-end encrypted. Login is a ZID signature — no email, no password, no KYC. The server only ever sees your public key and ciphertext."
    >
      <Show
        when={supported()}
        fallback={
          <p class="text-sm text-[var(--color-text-muted)]">
            This browser does not support the Web Crypto API required for ZID.
          </p>
        }
      >
        <Show
          when={identity()}
          fallback={
            <div class="max-w-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <h2 class="m-0 text-lg font-semibold text-[var(--color-text)]">
                {existing() ? "Unlock with ZID" : "Create a ZID"}
              </h2>
              <p class="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                {existing()
                  ? "A ZID exists on this device. Signing a server challenge with it logs you in."
                  : "An ed25519 keypair is generated on this device. Its public key is your account — nothing else is collected."}
              </p>
              <button
                class="mt-4 border border-[var(--color-accent)] px-4 py-2 font-mono text-sm text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)]"
                onClick={connect}
              >
                {existing() ? "unlock" : "create + connect"}
              </button>
              <p class="mt-4 text-xs text-[var(--color-text-muted)]">
                Zafu-wallet login (per-site derived ZID approved in your wallet) replaces this
                device-local key once wallet connect ships.
              </p>
            </div>
          }
        >
          <div class="grid max-w-2xl gap-6">
            <div class="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <div class="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
                    zid
                  </div>
                  <div class="mt-1 break-all font-mono text-xs text-[var(--color-text-muted)]">
                    {identity()!.publicKeyHex}
                  </div>
                </div>
                <span class="shrink-0 font-mono text-xs text-[var(--color-text-muted)]">
                  {mode() === "server" ? "synced" : "local-only (backend offline)"}
                </span>
              </div>
            </div>

            <div class="border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
              <h2 class="m-0 text-sm font-semibold text-[var(--color-text)]">Encrypted vault</h2>
              <p class="mt-1 text-xs text-[var(--color-text-muted)]">
                Encrypted with AES-256-GCM under a key derived from your ZID before it leaves
                this page. Stored as ciphertext only.
              </p>
              <textarea
                class="mt-3 h-40 w-full resize-y border border-[var(--color-border)] bg-transparent p-3 font-mono text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
                value={note()}
                onInput={(e) => setNote(e.currentTarget.value)}
                placeholder="Anything typed here is encrypted client-side before storage."
              />
              <div class="mt-3 flex items-center gap-3">
                <button
                  class="border border-[var(--color-accent)] px-4 py-2 font-mono text-sm text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)]"
                  onClick={save}
                >
                  encrypt + save
                </button>
                <button
                  class="border border-[var(--color-border)] px-4 py-2 font-mono text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-border-strong)]"
                  onClick={disconnect}
                >
                  lock
                </button>
                <button
                  class="ml-auto border border-[var(--color-border)] px-4 py-2 font-mono text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-border-strong)]"
                  onClick={wipe}
                >
                  destroy identity
                </button>
              </div>
            </div>
          </div>
        </Show>
      </Show>
      <Show when={status()}>
        <p class="mt-4 font-mono text-xs text-[var(--color-text-muted)]">{status()}</p>
      </Show>
    </Page>
  );
}
