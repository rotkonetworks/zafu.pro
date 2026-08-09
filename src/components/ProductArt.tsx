import AnimatedQR from "./AnimatedQR";

/**
 * Landing-page product mockups, built with the REAL Zafu wallet design
 * tokens (packages/tailwind-config + ui/styles/globals.css in the zafu
 * repo): dark terminal theme, warm ink, zigner-gold accents, hanko
 * vermillion kicker tick, 28px tabular hero balance, lowercase labels.
 * The QR is a genuine scannable QR cycling UR fountain frames.
 */

// Zafu dark-theme tokens (the app's default look; the mockup is a
// "screenshot", so these stay fixed regardless of site theme).
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
      <span style={{ color: T.hanko, "font-size": "7px", "vertical-align": "2px" }}>
        ◆{" "}
      </span>
      {props.children}
    </div>
  );
}

function HankoStamp(props: { text: string; size: number; tilt: number }) {
  return (
    <div
      style={{
        transform: `rotate(${props.tilt}deg)`,
        border: `3px solid ${T.hanko}`,
        "border-radius": "7px",
        width: `${props.size}px`,
        height: `${props.size}px`,
        display: "flex",
        "flex-direction": "column",
        "align-items": "center",
        "justify-content": "center",
        color: T.hanko,
        "font-family": "'Hiragino Mincho ProN','Yu Mincho','Noto Serif JP',serif",
        "font-weight": "700",
        "font-size": `${props.size * 0.38}px`,
        "line-height": "1.05",
        opacity: "0.92",
      }}
      aria-hidden="true"
    >
      {[...props.text].map((ch) => (
        <span>{ch}</span>
      ))}
    </div>
  );
}

/** Zafu: the actual wallet home surface in a browser window. */
export function ZafuArt(props: { class?: string }) {
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
            "margin-left": "auto",
            "margin-right": "auto",
            "font-family": mono,
            "font-size": "11px",
          }}
          class="text-muted"
        >
          zafu.pro
        </span>
        <span style={{ width: "43px" }} />
      </div>

      {/* wallet popup — real app tokens from here down */}
      <div
        style={{
          background: T.canvas,
          padding: "16px",
          display: "grid",
          "grid-template-columns": "1fr auto",
          gap: "14px",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", "flex-direction": "column", gap: "10px", "min-width": "0" }}>
          {/* address row */}
          <div style={{ padding: "0 2px" }}>
            <div
              style={{
                "font-family": mono,
                "font-size": "11px",
                color: T.fgDim,
                "text-transform": "lowercase",
                "letter-spacing": "0.05em",
              }}
            >
              your address
            </div>
            <div style={{ display: "flex", "align-items": "center", gap: "6px", "margin-top": "3px" }}>
              <span
                style={{
                  background: "rgba(244,183,40,0.15)",
                  color: T.gold,
                  "font-family": mono,
                  "font-size": "10px",
                  padding: "2px 6px",
                  "border-radius": "3px",
                  "line-height": "1",
                }}
              >
                m/0
              </span>
              <span
                style={{
                  "font-family": mono,
                  "font-size": "11px",
                  color: T.fg,
                  overflow: "hidden",
                  "text-overflow": "ellipsis",
                  "white-space": "nowrap",
                }}
              >
                u1zafu9qxt…h3kfe0
              </span>
            </div>
          </div>

          {/* total balance card */}
          <div
            style={{
              background: T.elev1,
              border: `1px solid ${T.borderSoft}`,
              "border-radius": "6px",
              padding: "14px",
            }}
          >
            <Kicker>total balance</Kicker>
            <div
              style={{
                "margin-top": "5px",
                "font-family": mono,
                "font-size": "26px",
                "line-height": "1",
                color: T.gold,
                "font-variant-numeric": "tabular-nums",
              }}
            >
              12.4501 ZEC
            </div>
            <div
              style={{
                "margin-top": "5px",
                "font-family": mono,
                "font-size": "11px",
                color: T.fgDim,
                "font-variant-numeric": "tabular-nums",
              }}
            >
              synced · block 2,845,120
            </div>
          </div>

          {/* multisig row */}
          <div
            style={{
              background: T.elev1,
              border: `1px solid ${T.borderSoft}`,
              "border-radius": "6px",
              padding: "10px 14px",
              display: "flex",
              "align-items": "center",
              gap: "8px",
            }}
          >
            <span style={{ "font-family": mono, "font-size": "12px", color: T.fgHigh }}>
              multisig wallets
            </span>
            <span
              style={{
                background: "rgba(244,183,40,0.15)",
                color: T.gold,
                "font-family": mono,
                "font-size": "10px",
                padding: "2px 6px",
                "border-radius": "9px",
                "line-height": "1",
              }}
            >
              2/3
            </span>
            <span
              style={{
                "margin-left": "auto",
                "font-family": mono,
                "font-size": "12px",
                color: T.fgMuted,
                "font-variant-numeric": "tabular-nums",
              }}
            >
              3.2000 ZEC
            </span>
          </div>

          {/* actions — receive / swap / send, icon-forward like the app */}
          <div style={{ display: "grid", "grid-template-columns": "1fr 1fr 1fr", gap: "8px" }}>
            <button
              title="receive"
              aria-label="receive"
              style={{
                height: "40px",
                background: T.elev2,
                color: T.fg,
                border: "none",
                "border-radius": "6px",
                display: "flex",
                "align-items": "center",
                "justify-content": "center",
              }}
            >
              <span class="i-lucide-arrow-down" style={{ width: "18px", height: "18px" }} />
            </button>
            <button
              title="swap"
              aria-label="swap"
              style={{
                height: "40px",
                background: T.elev2,
                color: T.fg,
                border: "none",
                "border-radius": "6px",
                display: "flex",
                "align-items": "center",
                "justify-content": "center",
              }}
            >
              <span class="i-lucide-arrow-left-right" style={{ width: "18px", height: "18px" }} />
            </button>
            <button
              title="send"
              aria-label="send"
              style={{
                height: "40px",
                background: T.gold,
                color: T.goldFg,
                border: "none",
                "border-radius": "6px",
                display: "flex",
                "align-items": "center",
                "justify-content": "center",
              }}
            >
              <span class="i-lucide-arrow-up" style={{ width: "18px", height: "18px" }} />
            </button>
          </div>
        </div>

        {/* sign-via-QR panel with a real animated QR */}
        <div
          style={{
            background: T.elev1,
            border: `1px solid ${T.borderSoft}`,
            "border-radius": "6px",
            padding: "12px",
            display: "flex",
            "flex-direction": "column",
            "align-items": "center",
            gap: "8px",
          }}
        >
          <Kicker>sign via qr</Kicker>
          <div
            style={{
              background: T.fgHigh,
              padding: "8px",
              "border-radius": "4px",
            }}
          >
            <AnimatedQR size={116} dark={T.canvas} light={T.fgHigh} />
          </div>
        </div>

        {/* hanko stamp */}
        <div style={{ position: "absolute", right: "10px", bottom: "8px" }}>
          <HankoStamp text="座蒲" size={44} tilt={-8} />
        </div>
      </div>
    </div>
  );
}

/** Zigner: air-gapped phone showing the review/sign screen. */
export function ZignerArt(props: { class?: string }) {
  return (
    <div
      class={props.class ?? ""}
      style={{
        display: "flex",
        "align-items": "center",
        "justify-content": "center",
        gap: "22px",
      }}
    >
      {/* no-radios annotation */}
      <div style={{ "text-align": "center" }}>
        <svg width="52" height="80" viewBox="0 0 52 80" aria-hidden="true">
          <g stroke="var(--color-text-muted)" stroke-width="2.5" fill="none" opacity="0.8">
            <path d="M18 22 a26 26 0 0 1 0 36" />
            <path d="M8 12 a42 42 0 0 1 0 56" />
          </g>
          <line x1="4" y1="14" x2="44" y2="66" stroke={T.hanko} stroke-width="3.5" />
        </svg>
        <div
          style={{ "font-family": mono, "font-size": "10px", "margin-top": "4px" }}
          class="text-muted"
        >
          no radios
        </div>
      </div>

      {/* phone */}
      <div
        style={{
          background: "#0a0a0a",
          border: "3px solid var(--color-border)",
          "border-radius": "22px",
          padding: "14px 10px",
          width: "196px",
          position: "relative",
          "box-shadow": "0 12px 32px -16px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            width: "6px",
            height: "6px",
            "border-radius": "50%",
            background: "#333",
            margin: "0 auto 8px",
          }}
        />
        {/* screen */}
        <div
          style={{
            background: T.canvas,
            border: `1px solid ${T.borderSoft}`,
            "border-radius": "8px",
            padding: "12px 10px",
          }}
        >
          <div
            style={{
              "font-family": mono,
              "font-size": "10px",
              color: T.fgMuted,
              "text-align": "center",
              "text-transform": "lowercase",
              "letter-spacing": "0.06em",
            }}
          >
            review · sign
          </div>
          <div style={{ height: "1px", background: T.borderSoft, margin: "8px 0" }} />
          <div
            style={{
              background: T.fgHigh,
              padding: "7px",
              "border-radius": "4px",
              width: "fit-content",
              margin: "0 auto",
            }}
          >
            <AnimatedQR size={124} dark={T.canvas} light={T.fgHigh} interval={280} />
          </div>
          {/* tx summary */}
          <div style={{ margin: "10px 4px 0", display: "grid", gap: "5px" }}>
            <div style={{ height: "7px", width: "82%", background: T.border, "border-radius": "2px", opacity: "0.8" }} />
            <div style={{ height: "7px", width: "60%", background: T.border, "border-radius": "2px", opacity: "0.55" }} />
          </div>
          <button
            style={{
              width: "100%",
              "margin-top": "12px",
              background: T.gold,
              color: T.goldFg,
              border: "none",
              "border-radius": "6px",
              padding: "8px 0",
              "font-family": mono,
              "font-size": "11px",
              "font-weight": "600",
              "text-transform": "lowercase",
            }}
          >
            confirm
          </button>
        </div>
        {/* hanko */}
        <div style={{ position: "absolute", top: "-14px", left: "-18px" }}>
          <HankoStamp text="印" size={40} tilt={7} />
        </div>
      </div>

      {/* camera-only annotation */}
      <div style={{ "text-align": "center" }}>
        <svg width="60" height="60" viewBox="0 0 60 60" aria-hidden="true">
          <g stroke="var(--color-accent)" stroke-width="2.5" fill="none" stroke-dasharray="5 5">
            <path d="M6 22 h48" />
            <path d="M6 38 h48" />
          </g>
        </svg>
        <div
          style={{ "font-family": mono, "font-size": "10px", "margin-top": "4px" }}
          class="text-muted"
        >
          camera only
        </div>
      </div>
    </div>
  );
}
