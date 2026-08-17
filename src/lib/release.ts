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
  bytes: Uint8Array;
}

/**
 * Parse a signature the device shows after signing - bare 128-hex, no slot tag
 * (signatures are untagged; the verifier matches each against the pinned keys).
 * A legacy `index:` prefix is tolerated and stripped.
 */
export function parseSignature(input: string): Signature {
  const raw = input.trim().replace(/\s+/g, "");
  const hexPart = raw.includes(":") ? raw.slice(raw.indexOf(":") + 1) : raw;
  if (!/^[0-9a-fA-F]{128}$/.test(hexPart)) {
    throw new Error(`a signature is 64 bytes / 128 hex characters, got ${hexPart.length}`);
  }
  const bytes = new Uint8Array(64);
  for (let i = 0; i < 64; i++) bytes[i] = parseInt(hexPart.substr(i * 2, 2), 16);
  return { bytes };
}

/**
 * prefix || sig_count | (key_index | sig)* || payload
 *
 * Pure concatenation - there is no format decision being made here that the
 * device could disagree with.
 */
export function assemble(prefix: Uint8Array, sigs: Signature[], payload: Uint8Array): Uint8Array {
  const seen = new Set<string>();
  for (const s of sigs) {
    // ed25519 is deterministic, so one key signing the same prefix twice yields
    // identical bytes. Two identical signatures are one key, not 2-of-3.
    const key = Array.from(s.bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
    if (seen.has(key)) {
      throw new Error("the same signature was given twice - 2-of-3 needs two DIFFERENT keys");
    }
    seen.add(key);
  }
  if (sigs.length < REQUIRED_SIGS) {
    throw new Error(`${sigs.length} signature(s), ${REQUIRED_SIGS} required`);
  }

  // Untagged: sig_count | sig[64] * count. Order does not matter.
  const out = new Uint8Array(prefix.length + 1 + sigs.length * 64 + payload.length);
  let at = 0;
  out.set(prefix, at);
  at += prefix.length;
  out[at++] = sigs.length;
  for (const s of sigs) {
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
  hex: string;
}

/**
 * Parse a public key from the device's Release key screen. Two encodings:
 *  - the QR carries the 32 raw bytes as base64 (44 chars) - half the payload
 *    of the hex string, so a poor webcam can lock it;
 *  - the screen also prints the 64-hex for manual entry.
 * Both resolve to the same 32-byte key. A legacy `index:` prefix is stripped.
 */
export function parseReleaseKey(input: string): ReleaseKey {
  const raw = input.trim().replace(/\s+/g, "");
  const body = raw.includes(":") ? raw.slice(raw.indexOf(":") + 1) : raw;

  // 64-hex: manual entry or legacy QR. Case-insensitive.
  if (/^[0-9a-fA-F]{64}$/.test(body)) {
    return { hex: body.toLowerCase() };
  }

  // base64 of the 32 raw bytes (the device QR). Case-SENSITIVE - decode as-is.
  if (/^[A-Za-z0-9+/]{43}=$|^[A-Za-z0-9+/]{44}$/.test(body)) {
    let bin: string;
    try {
      bin = atob(body);
    } catch {
      throw new Error("looks like base64 but did not decode");
    }
    if (bin.length !== 32) {
      throw new Error(`a public key is 32 bytes; base64 decoded to ${bin.length}`);
    }
    return {
      hex: Array.from(bin, (c) => c.charCodeAt(0).toString(16).padStart(2, "0")).join(""),
    };
  }

  throw new Error(
    `expected a 32-byte key: 64 hex chars, or 44-char base64 from the QR; got ${body.length} chars`,
  );
}

/**
 * Emit the Rust constant from the three collected keys, in entry order. Order
 * carries no meaning now - the verifier matches each signature against the whole
 * set - so any arrangement of the same three keys is the same trust root.
 */
export function formatReleaseKeyBytes(keys: ReleaseKey[]): string {
  const rows = keys.map((k, i) => {
    const bytes = (k.hex.match(/.{2}/g) ?? []).map((b) => `0x${b}`);
    const lines: string[] = [];
    for (let j = 0; j < bytes.length; j += 8) {
      lines.push("        " + bytes.slice(j, j + 8).join(", ") + ",");
    }
    return `    // key ${i}\n    [\n${lines.join("\n")}\n    ],`;
  });
  return `pub const RELEASE_KEY_BYTES: [[u8; 32]; 3] = [\n${rows.join("\n")}\n];`;
}
