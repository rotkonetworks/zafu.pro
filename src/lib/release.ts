/**
 * Zigner module release coordination.
 *
 * This file deliberately does NOT build manifests. `modpack prepare` does
 * that, on the build host, in the same Rust that the device verifies with.
 * Reimplementing the wire format here would put a third independent copy of
 * it in a third language - and the whole reason `parse_signing_prefix` was
 * factored out of the verifier was to stop the signer drifting from it.
 *
 * What this file does is coordination: read what modpack produced, show the
 * operator what they are about to have signed, collect signatures from the
 * key holders, and concatenate the result. Assembly is pure concatenation,
 * so there is nothing here that can silently disagree with the device.
 *
 * Nothing here is trusted. The device parses the prefix itself and renders
 * the version, hash and changelog from the bytes it actually received, so a
 * compromised page cannot cause a holder to sign something they were not
 * shown. That guarantee only reaches the human if they compare the hash
 * against a module they built themselves - which is why the UI says so
 * rather than presenting its own hash as authoritative.
 */

/** Layout of the signed region. Mirrors rust/module_host/src/manifest.rs. */
const MAGIC = "ZIGM";
const MANIFEST_VERSION = 2;

// Fixed offsets within the prefix, in the order the Rust builder writes them:
// magic(4) ver(1) module_version(4) min_kernel(4) module_hash(32)
// payload_kind(1) base_hash(32) payload_len(4) desc_len(2) desc(desc_len)
const OFF_VERSION = 4;
const OFF_MODULE_VERSION = 5;
const OFF_MIN_KERNEL = 9;
const OFF_MODULE_HASH = 13;
const OFF_PAYLOAD_KIND = 45;
const OFF_BASE_HASH = 46;
const OFF_PAYLOAD_LEN = 78;
const OFF_DESC_LEN = 82;
const OFF_DESC = 84;

export const PAYLOAD_FULL = 0;
export const PAYLOAD_BSDIFF_ZSTD = 1;

/** Two of three. Matches REQUIRED_SIGS on the device. */
export const REQUIRED_SIGS = 2;

export interface Prefix {
  moduleVersion: number;
  minKernelVersion: number;
  moduleHashHex: string;
  payloadKind: number;
  baseHashHex: string;
  payloadLen: number;
  description: string;
}

function hex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Group a digest so a human can actually compare it against a terminal. */
export function grouped(hexStr: string, size = 8): string {
  return (hexStr.match(new RegExp(`.{1,${size}}`, "g")) ?? []).join(" ").toUpperCase();
}

export async function sha256Hex(bytes: Uint8Array): Promise<string> {
  const copy = new Uint8Array(bytes.length);
  copy.set(bytes);
  return hex(new Uint8Array(await crypto.subtle.digest("SHA-256", copy)));
}

/**
 * Read a prefix produced by `modpack prepare`, for display only.
 *
 * Read-only on purpose: getting this wrong shows the operator the wrong
 * thing, which is bad, but it cannot produce a package the device accepts.
 * The device does its own parse and is the authority.
 */
export function parsePrefix(bytes: Uint8Array): Prefix {
  const ascii = String.fromCharCode(...bytes.slice(0, 4));
  if (ascii !== MAGIC) {
    throw new Error(`not a module manifest (magic is "${ascii}", expected "${MAGIC}")`);
  }
  if (bytes.length < OFF_DESC) {
    throw new Error("manifest is truncated");
  }
  const v = bytes[OFF_VERSION];
  if (v !== MANIFEST_VERSION) {
    throw new Error(`manifest version ${v}, this page understands ${MANIFEST_VERSION}`);
  }
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const descLen = dv.getUint16(OFF_DESC_LEN, true);
  if (bytes.length !== OFF_DESC + descLen) {
    // The prefix must be EXACTLY the signed region. Trailing bytes would mean
    // the page is describing one thing while the holder signs another.
    throw new Error(
      `manifest is ${bytes.length} bytes but its fields account for ${OFF_DESC + descLen} - ` +
        `this is not exactly a signing prefix`,
    );
  }
  return {
    moduleVersion: dv.getUint32(OFF_MODULE_VERSION, true),
    minKernelVersion: dv.getUint32(OFF_MIN_KERNEL, true),
    moduleHashHex: hex(bytes.slice(OFF_MODULE_HASH, OFF_MODULE_HASH + 32)),
    payloadKind: bytes[OFF_PAYLOAD_KIND],
    baseHashHex: hex(bytes.slice(OFF_BASE_HASH, OFF_BASE_HASH + 32)),
    payloadLen: dv.getUint32(OFF_PAYLOAD_LEN, true),
    description: new TextDecoder().decode(bytes.slice(OFF_DESC, OFF_DESC + descLen)),
  };
}

export interface Signature {
  index: number;
  bytes: Uint8Array;
}

/**
 * Parse `index:hex` - the exact string the device shows after signing, both
 * as a QR and as selectable text, so a remote holder can paste it in.
 */
export function parseSignature(input: string): Signature {
  const trimmed = input.trim();
  const at = trimmed.indexOf(":");
  if (at < 0) {
    throw new Error(`expected "index:hex", got "${trimmed.slice(0, 24)}…"`);
  }
  const index = Number(trimmed.slice(0, at));
  if (!Number.isInteger(index) || index < 0 || index > 2) {
    throw new Error(`key index must be 0, 1 or 2 - got "${trimmed.slice(0, at)}"`);
  }
  const hexPart = trimmed.slice(at + 1).replace(/\s+/g, "");
  if (!/^[0-9a-fA-F]{128}$/.test(hexPart)) {
    throw new Error(`a signature is 64 bytes / 128 hex characters, got ${hexPart.length}`);
  }
  const bytes = new Uint8Array(64);
  for (let i = 0; i < 64; i++) bytes[i] = parseInt(hexPart.substr(i * 2, 2), 16);
  return { index, bytes };
}

/**
 * prefix || sig_count | (key_index | sig)* || payload
 *
 * Pure concatenation - there is no format decision being made here that the
 * device could disagree with.
 */
export function assemble(prefix: Uint8Array, sigs: Signature[], payload: Uint8Array): Uint8Array {
  const seen = new Set<number>();
  for (const s of sigs) {
    if (seen.has(s.index)) {
      // The device rejects duplicate indices, and two signatures from one key
      // are not 2-of-3 in any case. Fail here rather than ship a package that
      // is guaranteed to be refused.
      throw new Error(`key #${s.index} signed twice - 2-of-3 needs two DIFFERENT keys`);
    }
    seen.add(s.index);
  }
  if (sigs.length < REQUIRED_SIGS) {
    throw new Error(`${sigs.length} signature(s), ${REQUIRED_SIGS} required`);
  }

  const out = new Uint8Array(prefix.length + 1 + sigs.length * 65 + payload.length);
  let at = 0;
  out.set(prefix, at);
  at += prefix.length;
  out[at++] = sigs.length;
  for (const s of sigs) {
    out[at++] = s.index;
    out.set(s.bytes, at);
    at += 64;
  }
  out.set(payload, at);
  return out;
}

/** Frames and wall-clock for an animated UR transfer, matching the device. */
export function transferEstimate(bytes: number): string {
  const frames = Math.ceil((Math.ceil(bytes / 600) * 13) / 10);
  const secs = (ms: number) => {
    const s = Math.round((frames * ms) / 1000);
    return `${Math.floor(s / 60)}m${String(s % 60).padStart(2, "0")}s`;
  };
  return `${frames} frames — fast ${secs(60)}, default ${secs(350)}`;
}

/**
 * The prefix as base64, for display in a single QR.
 *
 * CONTRACT WITH THE DEVICE: the zigner release-signing scan route must accept
 * base64 of the raw signing prefix. This is not UR - the prefix is a few
 * hundred bytes, so fountain framing would be overhead for no benefit - but it
 * does mean both sides have to agree, and the device half is not written yet.
 *
 * Chunked rather than spread: `String.fromCharCode(...bytes)` overflows the
 * call stack once a changelog makes the prefix large enough, and it would do
 * so only for the releases with the most to say.
 */
export function prefixToQrPayload(bytes: Uint8Array): string {
  let s = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    s += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(s);
}

export interface ReleaseKey {
  index: number;
  hex: string;
}

/** Parse `index:hex` as emitted by the device's Release key screen. */
export function parseReleaseKey(input: string): ReleaseKey {
  const trimmed = input.trim();
  const at = trimmed.indexOf(":");
  if (at < 0) throw new Error(`expected "index:hex", got "${trimmed.slice(0, 24)}…"`);
  const index = Number(trimmed.slice(0, at));
  if (!Number.isInteger(index) || index < 0 || index > 2) {
    throw new Error(`key slot must be 0, 1 or 2 - got "${trimmed.slice(0, at)}"`);
  }
  const hex = trimmed.slice(at + 1).replace(/\s+/g, "").toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(hex)) {
    throw new Error(`a public key is 32 bytes / 64 hex characters, got ${hex.length}`);
  }
  return { index, hex };
}

/**
 * Emit the Rust constant. Ordered by slot rather than by entry order, because
 * position in this array IS the key index the manifest refers to - pasting
 * them in the order they were typed would silently rename the keys.
 */
export function formatReleaseKeyBytes(keys: ReleaseKey[]): string {
  const bySlot = [0, 1, 2].map((i) => keys.find((k) => k.index === i));
  const rows = bySlot.map((k, i) => {
    if (!k) return `    // slot ${i}: MISSING`;
    const bytes = (k.hex.match(/.{2}/g) ?? []).map((b) => `0x${b}`);
    const lines: string[] = [];
    for (let j = 0; j < bytes.length; j += 8) {
      lines.push("        " + bytes.slice(j, j + 8).join(", ") + ",");
    }
    return `    // slot ${i}\n    [\n${lines.join("\n")}\n    ],`;
  });
  return `pub const RELEASE_KEY_BYTES: [[u8; 32]; 3] = [\n${rows.join("\n")}\n];`;
}
