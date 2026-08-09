/**
 * Hanko — vermillion seal stamp, the ink-stamp motif used across the
 * Zafu extension. Traditional shu-iro ink; deliberately NOT themed via
 * CSS variables so it reads as real stamped ink on every theme.
 */

interface HankoProps {
  /** Kanji to stamp, top-to-bottom. Default 座蒲 (zafu). */
  text?: string;
  /** Rendered size in px. Default 56. */
  size?: number;
  /** Degrees of imperfect-stamp rotation. Default -6. */
  tilt?: number;
  class?: string;
}

export default function Hanko(props: HankoProps) {
  const chars = () => [...(props.text ?? "座蒲")];
  const size = () => props.size ?? 56;
  const step = () => 84 / chars().length;
  return (
    <svg
      viewBox="0 0 100 100"
      width={size()}
      height={size()}
      class={props.class ?? ""}
      style={{
        transform: `rotate(${props.tilt ?? -6}deg)`,
        opacity: "0.9",
        "flex-shrink": "0",
      }}
      aria-hidden="true"
    >
      {/* ink-bleed under-layer */}
      <rect
        x="7"
        y="6"
        width="88"
        height="89"
        rx="14"
        fill="none"
        stroke="#c0392b"
        stroke-width="5"
        opacity="0.35"
      />
      {/* main seal border */}
      <rect
        x="5"
        y="5"
        width="90"
        height="90"
        rx="12"
        fill="none"
        stroke="#c0392b"
        stroke-width="6"
      />
      {chars().map((ch, i) => (
        <text
          x="50"
          y={8 + step() * (i + 0.5) + step() * 0.32}
          text-anchor="middle"
          font-size={String(Math.min(step() * 0.92, 44))}
          font-weight="700"
          fill="#c0392b"
          font-family="'Hiragino Mincho ProN','Yu Mincho','Noto Serif JP',serif"
        >
          {ch}
        </text>
      ))}
    </svg>
  );
}
