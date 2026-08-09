import { createSignal, createMemo, onMount, onCleanup } from "solid-js";
import qrcode from "qrcode-generator";

/**
 * Real, scannable, animated QR — the UR fountain-code stream the wallet
 * and signer exchange. Each frame is an actual QR encoding of a
 * `ur:pczt/<seq>-<total>/...` style payload, cycled like the live app.
 */

/** Static single QR of arbitrary data, same path-based renderer. */
export function StaticQR(props: {
  data: string;
  size?: number;
  dark?: string;
  light?: string;
}) {
  const qr = qrcode(0, "L");
  qr.addData(props.data);
  qr.make();
  const n = qr.getModuleCount();
  let d = "";
  for (let y = 0; y < n; y++) {
    let x = 0;
    while (x < n) {
      if (qr.isDark(y, x)) {
        const s = x;
        while (x < n && qr.isDark(y, x)) x++;
        d += `M${s} ${y}h${x - s}v1h-${x - s}z`;
      } else {
        x++;
      }
    }
  }
  return (
    <svg
      width={props.size ?? 120}
      height={props.size ?? 120}
      viewBox={`0 0 ${n} ${n}`}
      shape-rendering="crispEdges"
      style={{ background: props.light ?? "transparent", display: "block" }}
    >
      <path d={d} fill={props.dark ?? "#0c0a08"} />
    </svg>
  );
}

interface AnimatedQRProps {
  /** Total frames in the simulated fountain stream. Default 40. */
  frames?: number;
  /** ms per frame. Default 300 (matches a comfortable scan rate). */
  interval?: number;
  /** Rendered size in px (square). Default 120. */
  size?: number;
  /** Module color. Default near-black ink. */
  dark?: string;
  /** Background. Default transparent (parent supplies the quiet zone). */
  light?: string;
  class?: string;
}

/** Deterministic pseudo-random fragment so frames differ like fountain shards. */
function frag(i: number): string {
  let h = 0x811c9dc5 ^ i;
  const out: string[] = [];
  for (let n = 0; n < 24; n++) {
    h = Math.imul(h ^ (h >>> 15), 0x01000193) >>> 0;
    out.push("QPZRYGB0123456789ACDEFHJKLMNSTUVWX"[h % 34]);
  }
  return out.join("");
}

export default function AnimatedQR(props: AnimatedQRProps) {
  const total = () => props.frames ?? 40;
  const [frame, setFrame] = createSignal(1);

  onMount(() => {
    const t = setInterval(
      () => setFrame((f) => (f % total()) + 1),
      props.interval ?? 300,
    );
    onCleanup(() => clearInterval(t));
  });

  // One <path> for the whole matrix (h/v run-length encoded) instead of
  // hundreds of <rect> nodes — a single DOM mutation per frame.
  const modules = createMemo(() => {
    const qr = qrcode(0, "L");
    qr.addData(`UR:PCZT/${frame()}-${total()}/${frag(frame())}`);
    qr.make();
    const n = qr.getModuleCount();
    let d = "";
    for (let y = 0; y < n; y++) {
      let x = 0;
      while (x < n) {
        if (qr.isDark(y, x)) {
          const start = x;
          while (x < n && qr.isDark(y, x)) x++;
          d += `M${start} ${y}h${x - start}v1h-${x - start}z`;
        } else {
          x++;
        }
      }
    }
    return { n, d };
  });

  const size = () => props.size ?? 120;

  return (
    <div class={props.class ?? ""} style={{ "line-height": "0" }}>
      <svg
        width={size()}
        height={size()}
        viewBox={`0 0 ${modules().n} ${modules().n}`}
        shape-rendering="crispEdges"
        role="img"
        aria-label={`Animated QR, frame ${frame()} of ${total()}`}
        style={{ background: props.light ?? "transparent", display: "block" }}
      >
        <path d={modules().d} fill={props.dark ?? "#0c0a08"} fill-rule="evenodd" />
      </svg>
      <div
        style={{
          "font-family": "monospace",
          "font-size": "10px",
          "text-align": "center",
          "margin-top": "6px",
          "line-height": "1",
        }}
        class="text-muted"
      >
        frame {String(frame()).padStart(2, "0")}/{total()}
      </div>
    </div>
  );
}
