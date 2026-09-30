import { For, Show, type JSX } from "solid-js";
import { StaticQR } from "./QR";

/**
 * Product screens, rebuilt as static markup from the zafu and zigner design
 * canvases (claude.ai/artifact/52UFVApDmqt1Q4BR2E4bgi and
 * claude.ai/artifact/3gj8Tj5sWvTjD5sV2hr58J). Each one is a still of the app,
 * with example data. Styling lives in the `.app` block of styles/index.css.
 */

const PATHS = {
  down: "M12 5v14M19 12l-7 7-7-7",
  up: "m5 12 7-7 7 7M12 19V5",
  swap: "M8 3 4 7l4 4M4 7h16m-4 14 4-4-4-4M20 17H4",
  chev: "m6 9 6 6 6-6",
  next: "m9 6 6 6-6 6",
  back: "m15 18-6-6 6-6",
  close: "M6 6l12 12M18 6 6 18",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  recv: "M17 7 7 17M17 17H7V7",
  sent: "M7 17 17 7M7 7h10v10",
  scan: "M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5",
  check: "M20 6 9 17l-5-5",
  plus: "M12 5v14M5 12h14",
  copy: "M8 8h12v12H8zM4 16V4h12",
  eye: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7ZM12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6",
  person: "M12 4a4 4 0 1 0 0 8 4 4 0 1 0 0-8M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1",
  qr: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM18 18h3v3h-3z",
  sliders: "M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1M15 4v4M9 10v4M17 16v4",
  msg: "M4 5h16v11H9l-5 4z",
  wallet: "M12 3.2a8.8 8.8 0 1 0 8.6 6.9M9.2 9.2h5.6v5.6H9.2z",
  people: "M3.5 6.5h17v11h-17zM3.8 6.8 12 12.6l8.2-5.8",
  tools: "M2.8 5.6C6 4.4 18 4.4 21.2 5.6M4.6 8.9h14.8M6.5 5.4l.6 15M17.5 5.4l-.6 15M12 5v3.9",
  settings: "M4 3.5h16v17H4zM4 9.2h16M4 14.8h16M9.3 3.5v17M14.7 3.5v17",
  enso: "M14.9 4.1A8.8 8.8 0 1 0 19.4 8.3",
} as const;

export function Icon(props: { d: keyof typeof PATHS; size?: number; color?: string; width?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={props.size ?? 15}
      height={props.size ?? 15}
      viewBox="0 0 24 24"
      fill="none"
      stroke={props.color ?? "currentColor"}
      stroke-width={props.width ?? 2}
      stroke-linecap="square"
      style={{ "flex-shrink": 0 }}
    >
      <path d={PATHS[props.d]} />
    </svg>
  );
}

const Mark = (p: { size?: number }) => (
  <span
    class="mincho"
    style={{
      width: `${p.size ?? 26}px`,
      height: `${p.size ?? 26}px`,
      background: "#c73e3a",
      color: "#f2ecdf",
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
      "font-size": `${(p.size ?? 26) * 0.58}px`,
      "font-weight": 600,
      "flex-shrink": 0,
    }}
  >
    秘
  </span>
);

const Done = (p: { size: number }) => (
  <span
    class="mincho red"
    style={{
      width: `${p.size}px`,
      height: `${p.size}px`,
      border: `${Math.round(p.size / 26)}px solid #c73e3a`,
      transform: "rotate(-6deg)",
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
      "font-size": `${p.size * 0.52}px`,
      "font-weight": 600,
      background: "#0c0a08",
    }}
  >
    済
  </span>
);

const Head = (p: { title: string; meta?: JSX.Element; back?: boolean; close?: boolean }) => (
  <header class="app-head">
    <Show when={p.back || p.close}>
      <span style={{ width: "32px", display: "flex", "justify-content": "center" }} class="mu">
        <Icon d={p.close ? "close" : "back"} size={18} />
      </span>
    </Show>
    <h1 class="app-title">{p.title}</h1>
    <span class="app-meta">{p.meta}</span>
  </header>
);

const Row = (p: { k: string; v: string }) => (
  <div class="app-row" style={{ "justify-content": "space-between" }}>
    <span class="mu" style={{ "font-size": "12px" }}>{p.k}</span>
    <span class="hi">{p.v}</span>
  </div>
);

const Dot = (p: { color: string; size?: number }) => (
  <span style={{ width: `${p.size ?? 8}px`, height: `${p.size ?? 8}px`, background: p.color, "flex-shrink": 0 }} />
);

/* ------------------------------------------------------------------ */
/* zafu (browser extension popup, 400 x 628)                           */
/* ------------------------------------------------------------------ */

const WalletHead = () => (
  <header class="app-head" style={{ gap: "10px" }}>
    <Mark />
    <span style={{ display: "flex", "flex-direction": "column", "flex-grow": 1 }}>
      <span class="hi" style={{ "font-size": "14px" }}>wallet 1</span>
      <span class="app-meta">main pocket</span>
    </span>
    <span class="app-btn" style={{ flex: "none", height: "32px", "background-color": "#131009" }}>
      <Dot color="#f4b728" /> zcash <Icon d="chev" size={12} color="#948a79" />
    </span>
  </header>
);

const TABS = [
  ["wallet", "wallet"],
  ["people", "people"],
  ["tools", "tools"],
  ["settings", "settings"],
] as const;

export function ZafuHome() {
  return (
    <div class="app" role="img" aria-label="zafu wallet home: balance, send and receive, recent activity">
      <WalletHead />
      <main class="app-main" style={{ gap: "24px", "padding-top": "24px" }}>
        <section style={{ position: "relative", display: "flex", "flex-direction": "column", gap: "18px" }}>
          <span style={{ position: "absolute", right: "-54px", top: "-46px", opacity: 0.09 }}>
            <Icon d="enso" size={210} color="#f4b728" width={1.1} />
          </span>
          <div style={{ display: "flex", "flex-direction": "column", gap: "6px" }}>
            <span class="app-label" style={{ display: "flex", gap: "6px", "align-items": "center" }}>
              total balance <Icon d="eye" size={14} color="#948a79" />
            </span>
            <span style={{ display: "flex", "align-items": "baseline", gap: "10px" }}>
              <span class="app-big">12.4081</span>
              <span class="gold" style={{ "font-size": "18px" }}>zec</span>
            </span>
            <span class="mu">≈ $1,418.30</span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <span class="app-btn"><Icon d="down" /> receive</span>
            <span class="app-btn"><Icon d="swap" /> swap</span>
            <span class="app-btn pri"><Icon d="up" /> send</span>
          </div>
        </section>
        <section style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
          <h2 class="app-label">balances</h2>
          <div class="app-list">
            <div class="app-row" style={{ height: "58px" }}>
              <span class="app-ico" style={{ background: "#f4b728", color: "#141008", border: "0" }}>z</span>
              <span class="grow">
                <span class="hi" style={{ "font-size": "14px" }}>shielded</span>
                <span class="app-meta" style={{ display: "flex", gap: "4px" }}><Icon d="shield" size={11} /> private</span>
              </span>
              <span class="hi">12.4001</span>
            </div>
            <div class="app-row" style={{ height: "58px" }}>
              <span class="app-ico warn" style={{ "border-color": "#d9773f", background: "transparent" }}>t</span>
              <span class="grow">
                <span class="hi" style={{ "font-size": "14px" }}>transparent</span>
                <span class="warn" style={{ "font-size": "11px" }}>public</span>
              </span>
              <span class="hi">0.0080</span>
              <span class="app-btn gold" style={{ flex: "none", height: "28px", "font-size": "12px", "border-color": "#322a21" }}>shield</span>
            </div>
          </div>
        </section>
        <section style={{ display: "flex", "flex-direction": "column", gap: "4px" }}>
          <span style={{ display: "flex", "justify-content": "space-between" }}>
            <h2 class="app-label">activity</h2>
            <span class="gold" style={{ "font-size": "12px" }}>see all</span>
          </span>
          <For
            each={[
              { icon: "recv", color: "#8fbf73", what: "received", meta: "from alice · 14:02", amt: "+1.2500", cls: "ok" },
              { icon: "sent", color: "#948a79", what: "sent", meta: "to bob · yesterday", amt: "−0.5000", cls: "" },
              { icon: "shield", color: "#948a79", what: "shielded", meta: "from transparent · sep 28", amt: "0.2000", cls: "" },
            ] as const}
          >
            {(a) => (
              <div class="app-row" style={{ padding: "0 4px", height: "52px" }}>
                <span class="app-ico"><Icon d={a.icon} size={14} color={a.color} /></span>
                <span class="grow">
                  <span class="hi">{a.what}</span>
                  <span class="app-meta">{a.meta}</span>
                </span>
                <span class={a.cls || "hi"}>{a.amt}</span>
              </div>
            )}
          </For>
        </section>
      </main>
      <nav class="app-tabs">
        <For each={TABS}>
          {([d, label], i) => (
            <span style={i() === 0 ? { color: "#f4b728" } : undefined}>
              <Icon d={d} size={20} width={1.5} />
              {label}
            </span>
          )}
        </For>
      </nav>
    </div>
  );
}

export function ZafuWelcome() {
  return (
    <div class="app" role="img" aria-label="zafu welcome screen: create wallet, import, or connect zigner">
      <div style={{ position: "relative", height: "330px", overflow: "hidden" }}>
        <img
          src="/media/hero/samurai-crop-800.webp"
          alt=""
          style={{ width: "100%", height: "100%", "object-fit": "cover", "object-position": "38% 40%", display: "block" }}
        />
      </div>
      <div style={{ padding: "22px 28px 0", display: "flex", "flex-direction": "column", gap: "12px", "flex-grow": 1 }}>
        <span style={{ display: "flex", "align-items": "center", gap: "12px" }}>
          <Mark size={34} />
          <span class="mincho hi" style={{ "font-size": "26px", "font-weight": 600 }}>zafu</span>
        </span>
        <h1 class="mincho" style={{ "font-size": "28px", "line-height": 1.25 }}>
          shielded money,
          <br />
          held in your own hands.
        </h1>
        <span class="app-label">zcash · penumbra · private by default</span>
      </div>
      <div style={{ padding: "18px 20px", display: "flex", "flex-direction": "column", gap: "10px" }}>
        <span class="app-btn pri" style={{ flex: "none", height: "48px" }}>create wallet</span>
        <span class="app-btn" style={{ flex: "none", height: "48px" }}>import recovery phrase</span>
        <span class="mu" style={{ display: "flex", "justify-content": "center", gap: "18px", "font-size": "12px", "padding-top": "6px" }}>
          <span>connect zigner</span>
          <span>ledger / keystone</span>
        </span>
      </div>
    </div>
  );
}

export function ZafuSend() {
  return (
    <div class="app" role="img" aria-label="zafu send form: recipient, amount and private memo">
      <Head title="send zec" meta="1 / 2" back />
      <main class="app-main">
        <div style={{ display: "flex", "flex-direction": "column", gap: "6px" }}>
          <span class="app-label">to</span>
          <div style={{ display: "flex", gap: "6px" }}>
            <span class="app-field" style={{ "flex-grow": 1 }}>alice</span>
            <span class="app-field mu" style={{ width: "48px", "justify-content": "center" }}><Icon d="person" size={16} /></span>
            <span class="app-field mu" style={{ width: "48px", "justify-content": "center" }}><Icon d="scan" size={16} /></span>
          </div>
          <span class="app-meta">u1v9ga…qrdva · shielded</span>
        </div>
        <div style={{ display: "flex", "flex-direction": "column", gap: "6px" }}>
          <span style={{ display: "flex", "justify-content": "space-between" }}>
            <span class="app-label">amount</span>
            <span class="app-meta">available 12.4001</span>
          </span>
          <span class="app-field mincho" style={{ height: "56px", "font-size": "24px", gap: "10px" }}>
            <span style={{ "flex-grow": 1 }}>1.25</span>
            <span class="mu" style={{ "font-family": "var(--font-mono)", "font-size": "13px" }}>zec</span>
            <span class="app-btn gold" style={{ flex: "none", height: "32px", "font-size": "12px", "font-family": "var(--font-mono)", "border-color": "#322a21" }}>max</span>
          </span>
          <span class="app-meta">≈ $142.88</span>
        </div>
        <div style={{ display: "flex", "flex-direction": "column", gap: "6px" }}>
          <span class="app-label">memo</span>
          <span class="app-field" style={{ color: "#625a4d" }}>optional, only alice can read it</span>
        </div>
      </main>
      <footer class="app-foot"><span class="app-btn pri" style={{ height: "48px" }}>review</span></footer>
    </div>
  );
}

const PROVING = [
  ["picking notes", "done"],
  ["building witnesses", "done"],
  ["zero-knowledge proof", "12s of ~18s"],
  ["signing", "your key"],
  ["sending", "zidecar"],
] as const;

/** Send in progress: the proof is built on this computer, step by step. */
export function ZafuProving() {
  return (
    <div class="app" role="img" aria-label="zafu sending: the proof is built on this computer, step by step">
      <Head title="sending" meta="1.25 zec to alice" />
      <main class="app-main" style={{ "padding-top": "22px" }}>
        <div style={{ height: "132px", display: "flex", "align-items": "center", "justify-content": "center", position: "relative" }}>
          <span style={{ transform: "rotate(40deg)", display: "flex" }}>
            <Icon d="enso" size={120} color="#f4b728" width={1.2} />
          </span>
          <span class="mincho hi" style={{ position: "absolute", "font-size": "28px" }}>14s</span>
        </div>
        <ol class="app-list" style={{ margin: 0, padding: 0, "list-style": "none" }}>
          <For each={PROVING}>
            {([name, meta], i) => (
              <li class="app-row" style={{ height: "44px" }}>
                <span
                  style={{
                    width: "14px",
                    height: "14px",
                    "flex-shrink": 0,
                    background: i() < 2 ? "#f4b728" : "transparent",
                    border: i() === 2 ? "2px solid #f4b728" : i() > 2 ? "1px solid #322a21" : "0",
                  }}
                />
                <span class={i() > 2 ? "mu" : "hi"} style={{ "flex-grow": 1 }}>{name}</span>
                <span class="app-meta">{meta}</span>
              </li>
            )}
          </For>
        </ol>
        <div class="app-slot" style={{ "flex-direction": "column", "align-items": "stretch", "border-color": "#3a2f14", background: "#1f1a0f" }}>
          <span class="hi">your computer proves the payment is valid. the network learns nothing about sender, amount or memo.</span>
          <span style={{ height: "3px", background: "#241f18", display: "block" }}>
            <span style={{ width: "66%", height: "3px", background: "#f4b728", display: "block" }} />
          </span>
        </div>
      </main>
      <footer class="app-foot" style={{ "flex-direction": "column" }}>
        <span class="app-meta" style={{ "text-align": "center" }}>you can close this · it keeps going and shows on home</span>
        <span class="app-btn" style={{ flex: "none" }}>back to wallet</span>
      </footer>
    </div>
  );
}

export function ZafuReceive() {
  return (
    <div class="app" role="img" aria-label="zafu receive: a fresh shielded address with its qr code">
      <Head title="receive" back />
      <main class="app-main" style={{ "align-items": "center" }}>
        <div style={{ display: "flex", width: "100%", border: "1px solid #241f18" }}>
          <span class="app-btn pri" style={{ border: "0", height: "36px" }}>shielded</span>
          <span class="app-btn mu" style={{ border: "0", background: "transparent", height: "36px" }}>transparent</span>
        </div>
        <div style={{ position: "relative", padding: "12px", background: "#f2ecdf" }}>
          <StaticQR data="zafu.pro - example screen, not an address" size={184} dark="#141008" />
          <span style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", padding: "4px", background: "#f2ecdf" }}>
            <Mark size={30} />
          </span>
        </div>
        <span style={{ display: "flex", "flex-direction": "column", "align-items": "center", gap: "4px", "text-align": "center" }}>
          <span class="hi">shielded address</span>
          <span class="app-meta">a fresh one each time you show it · amount and memo stay private</span>
        </span>
        <span class="app-field" style={{ width: "100%", "font-size": "12px", "justify-content": "center" }}>u1v9ga8lsuhn6y7k2q0xw3…qrdva</span>
      </main>
      <footer class="app-foot">
        <span class="app-btn">request amount</span>
        <span class="app-btn pri"><Icon d="copy" /> copy</span>
      </footer>
    </div>
  );
}

/** A group (2 of 3 multisig) thread: chat and a payment proposal together. */
export function ZafuGroup() {
  return (
    <div class="app" role="img" aria-label="zafu group thread: a 2 of 3 treasury with chat and a payment proposal">
      <header class="app-head" style={{ gap: "10px" }}>
        <span class="mu"><Icon d="back" size={18} /></span>
        <span class="mincho gold" style={{ "font-size": "20px" }}>蔵</span>
        <span style={{ display: "flex", "flex-direction": "column", "flex-grow": 1 }}>
          <span class="mincho hi" style={{ "font-size": "18px" }}>treasury</span>
          <span class="app-meta">2 of 3 · bob, alice, you</span>
        </span>
        <span style={{ "text-align": "right" }}>
          <span class="hi" style={{ display: "block" }}>84.20</span>
          <span class="app-meta">zec shared</span>
        </span>
      </header>
      <main class="app-main" style={{ gap: "12px" }}>
        <span class="app-meta" style={{ "text-align": "center" }}>today</span>
        <div style={{ "max-width": "80%", padding: "10px 12px", background: "#131009", border: "1px solid #241f18" }}>
          <span class="app-meta" style={{ display: "block" }}>bob</span>
          alice sent the final logo files. paying her today?
        </div>
        <div style={{ "align-self": "flex-end", "max-width": "80%", padding: "10px 12px", background: "#1a1611", border: "1px solid #322a21" }}>
          proposing it now
        </div>
        <div class="app-list" style={{ "border-color": "#3a2f14" }}>
          <div class="app-row" style={{ "justify-content": "space-between", height: "40px" }}>
            <span class="app-meta">proposal · by bob</span>
            <span class="app-meta">open 22h</span>
          </div>
          <div style={{ padding: "12px 14px", display: "flex", "flex-direction": "column", gap: "4px" }}>
            <span><span class="mincho hi" style={{ "font-size": "30px" }}>1.25</span> <span class="gold">zec</span></span>
            <span class="hi">to alice · logo design</span>
            <span class="app-meta">fee up to 0.0002 · shielded</span>
          </div>
          <div class="app-row" style={{ gap: "8px" }}>
            <span class="mincho red" style={{ border: "1.5px solid #c73e3a", width: "22px", height: "22px", display: "flex", "align-items": "center", "justify-content": "center", "font-size": "13px" }}>判</span>
            <span class="grow"><span class="hi">1 of 2 seals</span><span class="app-meta">any 2 of 3 can send it</span></span>
          </div>
          <div style={{ padding: "12px 14px", display: "flex", gap: "8px" }}>
            <span class="app-btn" style={{ flex: "none", width: "96px" }}>decline</span>
            <span class="app-btn pri">review and seal</span>
          </div>
        </div>
        <span class="app-meta" style={{ display: "flex", gap: "6px", "align-items": "center" }}>
          <Icon d="check" size={12} color="#8fbf73" /> bob sealed · 14:20
        </span>
      </main>
      <footer class="app-foot">
        <span class="app-field" style={{ "flex-grow": 1, color: "#625a4d", "font-size": "13px" }}>message</span>
      </footer>
    </div>
  );
}

/** An app asks zafu to sign in: a per-site identity, nothing else shared. */
export function ZafuSignIn() {
  return (
    <div class="app" role="img" aria-label="zafu sign-in request from zk.poker: a separate identity for this site only">
      <header class="app-head" style={{ gap: "10px" }}>
        <span class="app-ico hi">♠</span>
        <span style={{ display: "flex", "flex-direction": "column", "flex-grow": 1 }}>
          <span class="hi" style={{ "font-size": "14px" }}>zk.poker</span>
          <span class="app-meta">zkbtc.org · sign in</span>
        </span>
      </header>
      <main class="app-main" style={{ "align-items": "center", "justify-content": "center", "text-align": "center", gap: "14px" }}>
        <Mark size={56} />
        <h1 class="mincho" style={{ "font-size": "24px" }}>sign in to zk.poker</h1>
        <span class="mu">as player 7f3a</span>
        <div class="app-list" style={{ width: "100%", "text-align": "left" }}>
          <div class="app-row"><Icon d="person" size={14} color="#948a79" /><span class="hi">your identity for this site only</span></div>
          <div class="app-row"><Icon d="shield" size={14} color="#948a79" /><span>zk.poker learns nothing about your wallet or other sites</span></div>
        </div>
        <span class="app-meta" style={{ display: "flex", gap: "8px", "align-items": "center" }}>
          <span style={{ width: "14px", height: "14px", border: "1px solid #322a21" }} /> sign me in here without asking for 30 days
        </span>
      </main>
      <footer class="app-foot">
        <span class="app-btn" style={{ flex: "none", width: "110px", height: "48px" }}>not now</span>
        <span class="app-btn pri" style={{ height: "48px" }}>sign in</span>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* zigner (offline android phone, 390 wide)                            */
/* ------------------------------------------------------------------ */

const Offline = () => (
  <div class="app-bar">
    <span style={{ display: "flex", gap: "6px", "align-items": "center" }}>
      <span class="mincho cold" style={{ "font-size": "12px" }}>氷</span> offline
    </span>
    <span>6 of 6 checks</span>
  </div>
);

const Hanko = (p: { k: string; dark?: boolean }) => (
  <span
    class="mincho"
    style={{
      width: "22px",
      height: "22px",
      border: `1.5px solid ${p.dark ? "#141008" : "#c73e3a"}`,
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
      "font-size": "13px",
      "font-weight": 600,
    }}
  >
    {p.k}
  </span>
);

export function ZignerHome() {
  return (
    <div class="app phone" role="img" aria-label="zigner home: cold keys for zcash and penumbra, group seats, scan">
      <Offline />
      <header class="app-head" style={{ height: "64px", gap: "12px", padding: "0 12px 0 20px" }}>
        <Mark size={30} />
        <span style={{ display: "flex", "flex-direction": "column", gap: "2px", "flex-grow": 1 }}>
          <span class="mincho hi" style={{ "font-size": "21px" }}>cold keys</span>
          <span class="app-meta">zid z7k3…p2qd · checked</span>
        </span>
        <span class="mu"><Icon d="sliders" size={22} width={1.75} /></span>
      </header>
      <main class="app-main" style={{ padding: "22px 20px", gap: "22px" }}>
        <section style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
          <h2 class="app-label">networks</h2>
          <div class="app-list">
            <For each={[["zcash", "shielded · transparent", "#f4b728"], ["penumbra", "shielded", "#3fc1b0"]] as const}>
              {([n, sub, c]) => (
                <div class="app-row" style={{ height: "64px", gap: "14px" }}>
                  <Dot color={c} size={10} />
                  <span class="grow"><span class="hi" style={{ "font-size": "15px" }}>{n}</span><span class="app-meta" style={{ "font-size": "12px" }}>{sub}</span></span>
                  <span class="app-meta" style={{ "font-size": "12px" }}>account 0</span>
                  <Icon d="next" size={16} color="#948a79" />
                </div>
              )}
            </For>
          </div>
        </section>
        <section style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
          <h2 class="app-label">group seats</h2>
          <div class="app-list">
            <div class="app-row" style={{ height: "64px", gap: "14px" }}>
              <span class="mincho gold" style={{ "font-size": "20px" }}>蔵</span>
              <span class="grow"><span class="hi" style={{ "font-size": "15px" }}>cold vault</span><span class="app-meta" style={{ "font-size": "12px" }}>2 of 3 · zcash · seat backed up</span></span>
              <Icon d="next" size={16} color="#948a79" />
            </div>
            <div class="app-row" style={{ height: "52px", gap: "14px" }}>
              <Icon d="plus" size={18} color="#948a79" />
              <span>join a group</span>
            </div>
          </div>
        </section>
        <span class="app-btn" style={{ flex: "none", height: "52px", background: "transparent" }}><Icon d="qr" size={18} width={1.75} /> connect to zafu</span>
      </main>
      <footer class="app-foot" style={{ padding: "14px 20px 30px" }}>
        <span class="app-btn pri tall"><Icon d="scan" size={22} /> scan</span>
      </footer>
    </div>
  );
}

export function ZignerScan() {
  return (
    <div class="app phone" role="img" aria-label="zigner scanning an animated qr code from zafu, frame 5 of 8">
      <Offline />
      <Head title="scan" meta="cold keys" close />
      <main class="app-main" style={{ background: "#050403", "align-items": "center", "justify-content": "center", gap: "28px" }}>
        <div style={{ position: "relative", width: "240px", height: "240px" }}>
          <For each={["left:0;top:0", "right:0;top:0", "left:0;bottom:0", "right:0;bottom:0"]}>
            {(pos) => {
              const [x, y] = pos.split(";").map((s) => s.split(":")[0]);
              return (
                <span
                  style={{
                    position: "absolute",
                    [x]: 0,
                    [y]: 0,
                    width: "44px",
                    height: "44px",
                    [`border-${x}`]: "3px solid #f4b728",
                    [`border-${y}`]: "3px solid #f4b728",
                  }}
                />
              );
            }}
          </For>
        </div>
        <div style={{ display: "flex", "flex-direction": "column", "align-items": "center", gap: "10px" }}>
          <div style={{ display: "flex", gap: "4px" }}>
            <For each={[0, 1, 2, 3, 4, 5, 6, 7]}>{(i) => <span style={{ width: "24px", height: "4px", background: i < 5 ? "#f4b728" : "#241f18" }} />}</For>
          </div>
          <span class="app-meta" style={{ "font-size": "12px" }}>frame 5 of 8</span>
        </div>
      </main>
      <footer class="app-foot" style={{ padding: "14px 20px 30px" }}>
        <span class="app-slot mu" style={{ width: "100%", height: "56px", "font-size": "13px" }}>please hold steady · several frames are normal</span>
      </footer>
    </div>
  );
}

export function ZignerReview() {
  return (
    <div class="app phone" role="img" aria-label="zigner review: sign a shielded zcash send of 1.25 zec?">
      <Offline />
      <Head title="sign this?" back meta={<span style={{ display: "flex", gap: "8px", "align-items": "center" }}><Dot color="#f4b728" /> zcash</span>} />
      <main class="app-main" style={{ padding: "26px 20px", gap: "20px" }}>
        <div style={{ display: "flex", "flex-direction": "column", "align-items": "center", gap: "8px", padding: "12px 0" }}>
          <span class="mu">you send</span>
          <span class="mincho hi" style={{ "font-size": "48px", "line-height": 1.1 }}>1.2500 <span class="gold" style={{ "font-size": "20px" }}>zec</span></span>
          <span class="ok">shielded · amount and memo stay private</span>
        </div>
        <div class="app-list">
          <Row k="to" v="u1v9ga…qrdva" />
          <Row k="memo" v="logo design" />
          <Row k="fee" v="0.0001 zec" />
          <Row k="change" v="back to you · 11.1500" />
          <Row k="from" v="cold keys · account 0" />
        </div>
        <div class="app-slot" style={{ height: "56px", "font-size": "13px" }}>
          <Icon d="check" size={16} color="#8fbf73" /> checked against your keys · nothing hidden
        </div>
      </main>
      <footer class="app-foot" style={{ padding: "14px 20px 30px", gap: "10px" }}>
        <span class="app-btn tall" style={{ flex: "none", width: "118px" }}>don’t sign</span>
        <span class="app-btn pri tall"><Hanko k="判" dark /> hold to sign</span>
      </footer>
    </div>
  );
}

export function ZignerAnswer() {
  return (
    <div class="app phone" role="img" aria-label="zigner shows the signed answer as a qr code for zafu to scan">
      <Offline />
      <Head title="signed" meta="1.2500 zec · zcash" />
      <main class="app-main" style={{ padding: "34px 20px", "align-items": "center", gap: "20px" }}>
        <div style={{ position: "relative" }}>
          <div style={{ padding: "14px", background: "#f2ecdf" }}>
            <StaticQR data="zafu.pro - example screen, not a signature" size={220} dark="#141008" />
          </div>
          <span style={{ position: "absolute", right: "-14px", top: "-18px" }}><Done size={70} /></span>
        </div>
        <div style={{ display: "flex", "flex-direction": "column", "align-items": "center", gap: "10px" }}>
          <div style={{ display: "flex", gap: "4px" }}>
            <For each={[0, 1, 2, 3, 4, 5]}>{(i) => <span style={{ width: "24px", height: "4px", background: i === 2 ? "#f4b728" : i < 2 ? "#6b5a2a" : "#241f18" }} />}</For>
          </div>
          <span class="app-meta" style={{ "font-size": "12px" }}>frame 3 of 6 · it loops</span>
        </div>
        <div class="app-slot" style={{ width: "100%", height: "56px", "font-size": "13px" }}>
          <Icon d="scan" size={16} color="#7fb3d5" width={1.75} /> please show this to zafu · it sends from there
        </div>
      </main>
      <footer class="app-foot" style={{ padding: "14px 20px 30px" }}>
        <span class="app-btn pri tall">done</span>
      </footer>
    </div>
  );
}
