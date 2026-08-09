/**
 * ZID client: off-chain ed25519 identity + end-to-end encrypted vault.
 *
 * Model:
 * - Identity: an ed25519 keypair generated (or later: derived per-site by Zafu)
 *   on the client. The public key is the account identifier. No KYC, no email,
 *   no registry.
 * - Auth: challenge-response. The server issues a nonce; the client signs it;
 *   the server verifies against the public key. The private key never leaves
 *   the device.
 * - Vault: dashboard data is encrypted client-side with AES-256-GCM under a
 *   key derived from the identity. The server only ever stores ciphertext.
 *
 * Server endpoints (contract; served by the zafu.pro backend when live):
 *   POST /api/zid/challenge   { pubkey }            -> { nonce }
 *   POST /api/zid/login       { pubkey, signature } -> { session }
 *   GET  /api/vault           (session)             -> { ciphertext, iv }
 *   PUT  /api/vault           { ciphertext, iv }    -> 204
 *
 * Until the backend is deployed, vault sync falls back to localStorage —
 * still ciphertext-at-rest, same code path.
 */

const STORAGE_KEY_ID = "zid.keypair.v1";
const STORAGE_KEY_VAULT = "zid.vault.v1";

export interface ZidIdentity {
  publicKeyHex: string;
  /** CryptoKey handles; private key is non-extractable after first load. */
  keys: CryptoKeyPair;
}

function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

export function ed25519Supported(): boolean {
  return typeof crypto !== "undefined" && !!crypto.subtle;
}

/** Create a new ZID or load the one stored on this device. */
export async function loadOrCreateIdentity(): Promise<ZidIdentity> {
  const stored = localStorage.getItem(STORAGE_KEY_ID);
  if (stored) {
    const jwk = JSON.parse(stored) as { pub: JsonWebKey; priv: JsonWebKey };
    const publicKey = await crypto.subtle.importKey("jwk", jwk.pub, "Ed25519", true, ["verify"]);
    const privateKey = await crypto.subtle.importKey("jwk", jwk.priv, "Ed25519", false, ["sign"]);
    const raw = await crypto.subtle.exportKey("raw", publicKey);
    return { publicKeyHex: toHex(raw), keys: { publicKey, privateKey } };
  }

  const keys = (await crypto.subtle.generateKey("Ed25519", true, [
    "sign",
    "verify",
  ])) as CryptoKeyPair;
  const pub = await crypto.subtle.exportKey("jwk", keys.publicKey);
  const priv = await crypto.subtle.exportKey("jwk", keys.privateKey);
  localStorage.setItem(STORAGE_KEY_ID, JSON.stringify({ pub, priv }));
  const raw = await crypto.subtle.exportKey("raw", keys.publicKey);
  return { publicKeyHex: toHex(raw), keys };
}

export function hasIdentity(): boolean {
  return localStorage.getItem(STORAGE_KEY_ID) !== null;
}

export function destroyIdentity(): void {
  localStorage.removeItem(STORAGE_KEY_ID);
  localStorage.removeItem(STORAGE_KEY_VAULT);
  localStorage.removeItem("zid.dek.v1");
}

/** Sign a server-issued challenge nonce. */
export async function signChallenge(id: ZidIdentity, nonceHex: string): Promise<string> {
  const sig = await crypto.subtle.sign("Ed25519", id.keys.privateKey, fromHex(nonceHex).buffer as ArrayBuffer);
  return toHex(sig);
}

/**
 * Challenge-response login. Returns a session token from the server,
 * or "local" when the backend is not reachable (offline/dev mode).
 */
export async function login(id: ZidIdentity): Promise<{ session: string; mode: "server" | "local" }> {
  try {
    const c = await fetch("/api/zid/challenge", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ pubkey: id.publicKeyHex }),
    });
    if (!c.ok) throw new Error(`challenge: ${c.status}`);
    const { nonce } = (await c.json()) as { nonce: string };
    const signature = await signChallenge(id, nonce);
    const l = await fetch("/api/zid/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ pubkey: id.publicKeyHex, signature }),
    });
    if (!l.ok) throw new Error(`login: ${l.status}`);
    const { session } = (await l.json()) as { session: string };
    return { session, mode: "server" };
  } catch {
    // Backend not deployed yet: operate in local mode. Crypto is identical;
    // only the ciphertext storage location differs.
    return { session: "local", mode: "local" };
  }
}

/* ---------------- E2EE vault (AES-256-GCM) ----------------
 *
 * Key indirection: vault data is encrypted with a random DEK; the DEK is
 * wrapped under a KEK derived from the (rotatable) identity. Rotating the
 * identity only requires re-wrapping 32 bytes — ciphertext stays valid,
 * and the server sees a brand-new account (new pubkey, same blob shape).
 * The identity itself never holds funds; ZID keys are never spending keys.
 */

const STORAGE_KEY_DEK = "zid.dek.v1";

/** Derive the KEK from the identity (HKDF over the private-key JWK seed). */
async function vaultKey(): Promise<CryptoKey> {
  const stored = localStorage.getItem(STORAGE_KEY_ID);
  if (!stored) throw new Error("no identity");
  const { priv } = JSON.parse(stored) as { priv: JsonWebKey };
  // JWK "d" is the ed25519 seed; feed it through HKDF to a distinct AES key.
  const seed = Uint8Array.from(atob(priv.d!.replace(/-/g, "+").replace(/_/g, "/")), (ch) =>
    ch.charCodeAt(0),
  );
  const ikm = await crypto.subtle.importKey("raw", seed.buffer as ArrayBuffer, "HKDF", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: new TextEncoder().encode("zid-vault-v1"),
      info: new TextEncoder().encode("aes-256-gcm"),
    },
    ikm,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export interface VaultBlob {
  iv: string;
  ciphertext: string;
}

/** Load the DEK (unwrapping with the identity KEK), creating it on first use. */
async function getOrCreateDEK(): Promise<CryptoKey> {
  const kek = await vaultKey();
  const stored = localStorage.getItem(STORAGE_KEY_DEK);
  if (stored) {
    const { iv, wrapped } = JSON.parse(stored) as { iv: string; wrapped: string };
    const raw = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromHex(iv).buffer as ArrayBuffer },
      kek,
      fromHex(wrapped).buffer as ArrayBuffer,
    );
    return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
  }
  const raw = crypto.getRandomValues(new Uint8Array(32));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const wrapped = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    kek,
    raw.buffer as ArrayBuffer,
  );
  localStorage.setItem(
    STORAGE_KEY_DEK,
    JSON.stringify({ iv: toHex(iv.buffer), wrapped: toHex(wrapped) }),
  );
  return crypto.subtle.importKey("raw", raw.buffer as ArrayBuffer, "AES-GCM", false, [
    "encrypt",
    "decrypt",
  ]);
}

/**
 * Rotate the identity without losing the vault: unwrap the DEK under the
 * old KEK before replacing the identity, then re-wrap under the new one.
 * (Exposed for the future rotation UI; ciphertext is untouched.)
 */
export async function rewrapDEK(unwrappedRaw: ArrayBuffer): Promise<void> {
  const kek = await vaultKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const wrapped = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, kek, unwrappedRaw);
  localStorage.setItem(
    STORAGE_KEY_DEK,
    JSON.stringify({ iv: toHex(iv.buffer), wrapped: toHex(wrapped) }),
  );
}

export async function encryptVault(plaintext: string): Promise<VaultBlob> {
  const key = await getOrCreateDEK();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plaintext),
  );
  return { iv: toHex(iv.buffer), ciphertext: toHex(ct) };
}

export async function decryptVault(blob: VaultBlob): Promise<string> {
  const key = await getOrCreateDEK();
  const pt = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromHex(blob.iv).buffer as ArrayBuffer },
    key,
    fromHex(blob.ciphertext).buffer as ArrayBuffer,
  );
  return new TextDecoder().decode(pt);
}

/** Persist ciphertext: server when available, localStorage otherwise. */
export async function saveVault(blob: VaultBlob, session: string): Promise<"server" | "local"> {
  if (session !== "local") {
    try {
      const r = await fetch("/api/vault", {
        method: "PUT",
        headers: { "content-type": "application/json", authorization: `Bearer ${session}` },
        body: JSON.stringify(blob),
      });
      if (r.ok) return "server";
    } catch {
      /* fall through to local */
    }
  }
  localStorage.setItem(STORAGE_KEY_VAULT, JSON.stringify(blob));
  return "local";
}

export async function loadVault(session: string): Promise<VaultBlob | null> {
  if (session !== "local") {
    try {
      const r = await fetch("/api/vault", {
        headers: { authorization: `Bearer ${session}` },
      });
      if (r.ok) return (await r.json()) as VaultBlob;
    } catch {
      /* fall through to local */
    }
  }
  const stored = localStorage.getItem(STORAGE_KEY_VAULT);
  return stored ? (JSON.parse(stored) as VaultBlob) : null;
}
