import { createSignal, Show, For } from "solid-js";
import AnimatedQR, { StaticQR } from "./AnimatedQR";
import { DONATION_ADDRESS } from "../content/donation";

/**
 * Interactive wallet demo for the lander — the real Zafu look, clickable.
 * receive → donation address + QR · swap → cross-chain demo · send → saved
 * shielded addresses + a demo proof where recipient and amount visibly encrypt.
 *
 * The receive address is the real donation address. Balances, swap rates and
 * saved recipients are fake; the AES-GCM encryption in the send flow is real.
 * Payments always target a shielded address — ZID is off-chain identity and is
 * never a payment destination.
 */

const T = {
  canvas: "#0c0a08",
  elev1: "#131009",
  elev2: "#1a1611",
  borderSoft: "#241f18",
  border: "#322a21",
  fgHigh: "#f2ecdf",
  fg: "#ded5c4",
  fgMuted: "#948a79",
  fgDim: "#625a4d",
  gold: "#f4b728",
  goldFg: "#141008",
  hanko: "#c73e3a",
};
const mono = "'JetBrains Mono', monospace";

/** Real Zafu donation address — the receive QR below is live, not a mockup. */
const ADDRESS = DONATION_ADDRESS;

/**
 * Saved recipients are a local label attached to a shielded address. ZID is an
 * off-chain identity system and is never a payment destination, so it must not
 * appear as one here — funds always go to a shielded address.
 */
const CONTACTS = [
  { name: "tommi", addr: "u1qz8k…4mre" },
  { name: "alice", addr: "u1m4vd…q7xs" },
  { name: "satoshi", addr: "u1t0rp…9hkc" },
];

const SWAP_TARGETS = [
  { sym: "BTC", label: "bitcoin", rate: "0.00052" },
  { sym: "USDC", label: "ethereum", rate: "38.42" },
  { sym: "ATOM", label: "cosmos hub", rate: "8.91" },
];

type View = "home" | "receive" | "swap" | "send";

function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function Kicker(props: { children: string }) {
  return (
    <div
      style={{
        "font-family": mono,
        "font-size": "11px",
        color: T.fgMuted,
        "text-transform": "lowercase",
        "letter-spacing": "0.06em",
      }}
    >
      <span style={{ color: T.hanko, "font-size": "7px", "vertical-align": "2px" }}>◆ </span>
      {props.children}
    </div>
  );
}

function BackRow(props: { title: string; onBack: () => void }) {
  return (
    <div style={{ display: "flex", "align-items": "center", gap: "8px" }}>
      <button
        onClick={props.onBack}
        aria-label="back"
        style={{
          background: T.elev2,
          border: "none",
          "border-radius": "4px",
          color: T.fg,
          width: "26px",
          height: "26px",
          display: "flex",
          "align-items": "center",
          "justify-content": "center",
        }}
      >
        <span class="i-lucide-arrow-left" style={{ width: "14px", height: "14px" }} />
      </button>
      <Kicker>{props.title}</Kicker>
    </div>
  );
}

const inputStyle = {
  background: T.elev2,
  border: `1px solid ${T.border}`,
  "border-radius": "4px",
  color: T.fgHigh,
  "font-family": mono,
  "font-size": "12px",
  padding: "7px 9px",
  width: "100%",
  outline: "none",
} as const;

const goldBtn = {
  background: T.gold,
  color: T.goldFg,
  border: "none",
  "border-radius": "6px",
  padding: "8px 0",
  "font-family": mono,
  "font-size": "12px",
  "font-weight": "600",
  "text-transform": "lowercase",
  width: "100%",
} as const;

export default function WalletDemo(props: { class?: string }) {
  const [view, setView] = createSignal<View>("home");
  const [copied, setCopied] = createSignal(false);
  const [swapTo, setSwapTo] = createSignal(SWAP_TARGETS[0]);
  const [swapAmt, setSwapAmt] = createSignal("0.5");
  const [swapDone, setSwapDone] = createSignal(false);
  const [contact, setContact] = createSignal<(typeof CONTACTS)[0] | null>(null);
  const [sendAmt, setSendAmt] = createSignal("0.1");
  const [proving, setProving] = createSignal(false);
  const [proof, setProof] = createSignal<{
    anchor: string;
    nullifier: string;
    enc: string;
    pi: string;
  } | null>(null);

  async function copyAddr() {
    try {
      await navigator.clipboard.writeText(ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 900);
    } catch {
      /* clipboard unavailable */
    }
  }

  function go(v: View) {
    setSwapDone(false);
    setProof(null);
    setContact(null);
    setView(v);
  }

  /** Demo proof: really AES-GCM-encrypts `${name}+${amount} ZEC` client-side. */
  async function prove() {
    const c = contact();
    if (!c || proving()) return;
    setProving(true);
    const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, [
      "encrypt",
    ]);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      new TextEncoder().encode(`${c.addr}+${sendAmt()} ZEC`),
    );
    const rnd = (n: number) => toHex(crypto.getRandomValues(new Uint8Array(n)).buffer);
    // brief beat so "proving…" is legible, but never slow
    await new Promise((r) => setTimeout(r, 350));
    setProof({
      anchor: rnd(8),
      nullifier: rnd(8),
      enc: toHex(enc).slice(0, 48),
      pi: rnd(12),
    });
    setProving(false);
  }

  const field = (label: string, value: string, red?: boolean) => (
    <div style={{ display: "flex", gap: "6px", "min-width": "0" }}>
      <span
        style={{
          "font-family": mono,
          "font-size": "10px",
          color: red ? T.hanko : T.fgDim,
          "flex-shrink": "0",
          width: "62px",
        }}
      >
        {label}
      </span>
      <span
        style={{
          "font-family": mono,
          "font-size": "10px",
          color: T.fgMuted,
          overflow: "hidden",
          "text-overflow": "ellipsis",
          "white-space": "nowrap",
        }}
      >
        {value}
      </span>
    </div>
  );

  return (
    <div
      class={props.class ?? ""}
      style={{
        border: "1px solid var(--color-border)",
        "border-radius": "10px",
        overflow: "hidden",
        background: "var(--color-bg-elevated)",
        "box-shadow": "0 12px 32px -16px rgba(0,0,0,0.5)",
      }}
    >
      {/* browser chrome */}
      <div
        style={{
          display: "flex",
          "align-items": "center",
          gap: "8px",
          padding: "9px 14px",
          "border-bottom": "1px solid var(--color-border)",
        }}
      >
        {[0, 1, 2].map(() => (
          <span
            style={{
              width: "9px",
              height: "9px",
              "border-radius": "50%",
              background: "var(--color-border)",
              display: "inline-block",
            }}
          />
        ))}
        <span
          style={{
            margin: "0 auto",
            "font-family": mono,
            "font-size": "11px",
          }}
          class="text-muted"
        >
          zafu.pro — live demo, click around
        </span>
        <span style={{ width: "43px" }} />
      </div>

      {/* wallet body */}
      <div style={{ background: T.canvas, padding: "16px", "min-height": "300px" }}>
        {/* ---------------- home ---------------- */}
        <Show when={view() === "home"}>
          <div style={{ display: "grid", "grid-template-columns": "1fr auto", gap: "14px" }}>
            <div style={{ display: "flex", "flex-direction": "column", gap: "10px", "min-width": "0" }}>
              <div style={{ padding: "0 2px" }}>
                <div style={{ "font-family": mono, "font-size": "11px", color: T.fgDim, "letter-spacing": "0.05em" }}>
                  your address
                </div>
                <div style={{ display: "flex", "align-items": "center", gap: "6px", "margin-top": "3px" }}>
                  <span style={{ background: "rgba(244,183,40,0.15)", color: T.gold, "font-family": mono, "font-size": "10px", padding: "2px 6px", "border-radius": "3px", "line-height": "1" }}>
                    m/0
                  </span>
                  <span style={{ "font-family": mono, "font-size": "11px", color: T.fg, overflow: "hidden", "text-overflow": "ellipsis", "white-space": "nowrap" }}>
                    u1zafu9qxt…h3kfe0
                  </span>
                </div>
              </div>

              <div style={{ background: T.elev1, border: `1px solid ${T.borderSoft}`, "border-radius": "6px", padding: "14px" }}>
                <Kicker>total balance</Kicker>
                <div style={{ "margin-top": "5px", "font-family": mono, "font-size": "26px", "line-height": "1", color: T.gold, "font-variant-numeric": "tabular-nums" }}>
                  12.4501 ZEC
                </div>
                <div style={{ "margin-top": "5px", "font-family": mono, "font-size": "11px", color: T.fgDim, "font-variant-numeric": "tabular-nums" }}>
                  synced · block 2,845,120
                </div>
              </div>

              <div style={{ background: T.elev1, border: `1px solid ${T.borderSoft}`, "border-radius": "6px", padding: "10px 14px", display: "flex", "align-items": "center", gap: "8px" }}>
                <span style={{ "font-family": mono, "font-size": "12px", color: T.fgHigh }}>multisig wallets</span>
                <span style={{ background: "rgba(244,183,40,0.15)", color: T.gold, "font-family": mono, "font-size": "10px", padding: "2px 6px", "border-radius": "9px", "line-height": "1" }}>2/3</span>
                <span style={{ "margin-left": "auto", "font-family": mono, "font-size": "12px", color: T.fgMuted, "font-variant-numeric": "tabular-nums" }}>3.2000 ZEC</span>
              </div>

              <div style={{ display: "grid", "grid-template-columns": "1fr 1fr 1fr", gap: "8px" }}>
                <button title="receive" aria-label="receive" onClick={() => go("receive")}
                  style={{ height: "40px", background: T.elev2, color: T.fg, border: "none", "border-radius": "6px", display: "flex", "align-items": "center", "justify-content": "center" }}>
                  <span class="i-lucide-arrow-down" style={{ width: "18px", height: "18px" }} />
                </button>
                <button title="swap" aria-label="swap" onClick={() => go("swap")}
                  style={{ height: "40px", background: T.elev2, color: T.fg, border: "none", "border-radius": "6px", display: "flex", "align-items": "center", "justify-content": "center" }}>
                  <span class="i-lucide-arrow-left-right" style={{ width: "18px", height: "18px" }} />
                </button>
                <button title="send" aria-label="send" onClick={() => go("send")}
                  style={{ height: "40px", background: T.gold, color: T.goldFg, border: "none", "border-radius": "6px", display: "flex", "align-items": "center", "justify-content": "center" }}>
                  <span class="i-lucide-arrow-up" style={{ width: "18px", height: "18px" }} />
                </button>
              </div>
            </div>

            <div style={{ background: T.elev1, border: `1px solid ${T.borderSoft}`, "border-radius": "6px", padding: "12px", display: "flex", "flex-direction": "column", "align-items": "center", gap: "8px" }}>
              <Kicker>sign via qr</Kicker>
              <div style={{ background: T.fgHigh, padding: "8px", "border-radius": "4px" }}>
                <AnimatedQR size={116} dark={T.canvas} light={T.fgHigh} />
              </div>
            </div>
          </div>
        </Show>

        {/* ---------------- receive ---------------- */}
        <Show when={view() === "receive"}>
          <div style={{ display: "flex", "flex-direction": "column", gap: "12px" }}>
            <BackRow title="receive · zafu donations" onBack={() => go("home")} />
            <div style={{ display: "grid", "grid-template-columns": "auto 1fr", gap: "14px", "align-items": "start" }}>
              <div style={{ background: T.fgHigh, padding: "10px", "border-radius": "4px", width: "fit-content" }}>
                <StaticQR data={ADDRESS} size={150} dark={T.canvas} light={T.fgHigh} />
              </div>
              <div style={{ display: "flex", "flex-direction": "column", gap: "10px", "min-width": "0" }}>
                <div style={{ background: T.elev1, border: `1px solid ${T.borderSoft}`, "border-radius": "6px", padding: "12px" }}>
                  <Kicker>zafu donation address · unified</Kicker>
                  <div style={{ "margin-top": "6px", "font-family": mono, "font-size": "11px", color: T.fg, "word-break": "break-all", "line-height": "1.6" }}>
                    {ADDRESS}
                  </div>
                </div>
                <button onClick={copyAddr} style={goldBtn}>
                  {copied() ? "copied ✓" : "copy address"}
                </button>
                <div style={{ "font-family": mono, "font-size": "10px", color: T.fgDim }}>
                  real address — donations to zafu land here. receives to the shielded pool;
                  sender, amount and memo are hidden on-chain.
                </div>
              </div>
            </div>
          </div>
        </Show>

        {/* ---------------- swap ---------------- */}
        <Show when={view() === "swap"}>
          <div style={{ display: "flex", "flex-direction": "column", gap: "12px" }}>
            <BackRow title="swap · cross-chain" onBack={() => go("home")} />
            <div style={{ background: T.elev1, border: `1px solid ${T.borderSoft}`, "border-radius": "6px", padding: "12px", display: "flex", "flex-direction": "column", gap: "10px" }}>
              <div style={{ display: "flex", gap: "8px", "align-items": "center" }}>
                <input
                  value={swapAmt()}
                  onInput={(e) => setSwapAmt(e.currentTarget.value)}
                  style={{ ...inputStyle, width: "90px", "text-align": "right" }}
                />
                <span style={{ "font-family": mono, "font-size": "12px", color: T.fgHigh }}>ZEC</span>
                <span class="i-lucide-arrow-right" style={{ width: "14px", height: "14px", color: T.fgDim }} />
                <div style={{ display: "flex", gap: "6px" }}>
                  <For each={SWAP_TARGETS}>
                    {(t) => (
                      <button
                        onClick={() => { setSwapTo(t); setSwapDone(false); }}
                        style={{
                          background: swapTo().sym === t.sym ? "rgba(244,183,40,0.15)" : T.elev2,
                          color: swapTo().sym === t.sym ? T.gold : T.fgMuted,
                          border: `1px solid ${swapTo().sym === t.sym ? T.gold : T.border}`,
                          "border-radius": "4px",
                          padding: "5px 8px",
                          "font-family": mono,
                          "font-size": "11px",
                        }}
                      >
                        {t.sym}
                      </button>
                    )}
                  </For>
                </div>
              </div>
              <div style={{ "font-family": mono, "font-size": "10px", color: T.fgDim, "line-height": "1.7" }}>
                route: ZEC → shielded batch swap (penumbra dex) → IBC → {swapTo().label}
                <br />
                receive ≈ {(parseFloat(swapAmt() || "0") * parseFloat(swapTo().rate)).toFixed(swapTo().sym === "BTC" ? 6 : 2)}{" "}
                {swapTo().sym} · no price discovery to validators · MEV-free
              </div>
              <button onClick={() => setSwapDone(true)} style={goldBtn}>
                {swapDone() ? "swap submitted — output shielded ✓" : `swap to ${swapTo().sym}`}
              </button>
            </div>
          </div>
        </Show>

        {/* ---------------- send ---------------- */}
        <Show when={view() === "send"}>
          <div style={{ display: "flex", "flex-direction": "column", gap: "12px" }}>
            <BackRow title="send · saved addresses" onBack={() => go("home")} />
            <Show
              when={proof()}
              fallback={
                <div style={{ display: "grid", "grid-template-columns": "1fr 1fr", gap: "10px" }}>
                  <div style={{ display: "flex", "flex-direction": "column", gap: "6px" }}>
                    <For each={CONTACTS}>
                      {(c) => (
                        <button
                          onClick={() => setContact(c)}
                          style={{
                            background: contact()?.name === c.name ? "rgba(244,183,40,0.12)" : T.elev1,
                            border: `1px solid ${contact()?.name === c.name ? T.gold : T.borderSoft}`,
                            "border-radius": "6px",
                            padding: "9px 11px",
                            display: "flex",
                            "align-items": "center",
                            gap: "8px",
                            "text-align": "left",
                          }}
                        >
                          <span style={{ "font-family": mono, "font-size": "12px", color: T.fgHigh }}>{c.name}</span>
                          <span style={{ "margin-left": "auto", "font-family": mono, "font-size": "10px", color: T.fgDim }}>
                            {c.addr}
                          </span>
                        </button>
                      )}
                    </For>
                  </div>
                  <div style={{ background: T.elev1, border: `1px solid ${T.borderSoft}`, "border-radius": "6px", padding: "12px", display: "flex", "flex-direction": "column", gap: "9px" }}>
                    <Kicker>amount</Kicker>
                    <div style={{ display: "flex", gap: "6px", "align-items": "center" }}>
                      <input value={sendAmt()} onInput={(e) => setSendAmt(e.currentTarget.value)} style={{ ...inputStyle, "text-align": "right" }} />
                      <span style={{ "font-family": mono, "font-size": "12px", color: T.fgHigh }}>ZEC</span>
                    </div>
                    <button onClick={prove} disabled={!contact() || proving()} style={{ ...goldBtn, opacity: contact() ? "1" : "0.4" }}>
                      {proving() ? "proving… (halo 2)" : "prove + send"}
                    </button>
                    <div style={{ "font-family": mono, "font-size": "10px", color: T.fgDim }}>
                      {contact()
                        ? `to ${contact()!.addr} — recipient & amount will be encrypted into the proof`
                        : "pick a saved address"}
                    </div>
                  </div>
                </div>
              }
            >
              <div style={{ background: T.elev1, border: `1px solid ${T.borderSoft}`, "border-radius": "6px", padding: "12px", display: "flex", "flex-direction": "column", gap: "7px" }}>
                <Kicker>shielded transaction · proof</Kicker>
                {field("anchor", proof()!.anchor)}
                {field("nullifier", proof()!.nullifier)}
                {field("enc_note", `${proof()!.enc}…`, true)}
                {field("π (halo2)", `${proof()!.pi}…`)}
                <div style={{ "margin-top": "4px", "font-family": mono, "font-size": "10px", color: T.fgDim, "line-height": "1.7" }}>
                  <span style={{ color: T.hanko }}>enc_note</span> is "{contact()!.addr}+{sendAmt()} ZEC" — really AES-GCM
                  encrypted in your browser just now. the chain sees only this. ✓ verified,
                  nothing revealed.
                </div>
                <button onClick={() => go("home")} style={goldBtn}>
                  broadcast · done
                </button>
              </div>
            </Show>
          </div>
        </Show>
      </div>
    </div>
  );
}
