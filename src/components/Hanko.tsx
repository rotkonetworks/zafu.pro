/**
 * Hanko - the red seal stamp used across the Zafu extension. Square, like a
 * carved seal. Hanko red is the only red on the site and is used for nothing
 * else; it comes from --color-hanko so washi can deepen it for paper.
 */

interface HankoProps {
  /** Kanji to stamp, top-to-bottom. Default 秘 (the zafu seal). */
  text?: string;
  /** Rendered size in px. Default 56. */
  size?: number;
  /** Degrees of imperfect-stamp rotation. Default -6. */
  tilt?: number;
  class?: string;
}

export default function Hanko(props: HankoProps) {
  const chars = () => [...(props.text ?? "秘")];
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
        rx="1"
        fill="none"
        style={{ stroke: "var(--color-hanko, #c73e3a)" }}
        stroke-width="5"
        opacity="0.35"
      />
      {/* main seal border */}
      <rect
        x="5"
        y="5"
        width="90"
        height="90"
        rx="0"
        fill="none"
        style={{ stroke: "var(--color-hanko, #c73e3a)" }}
        stroke-width="6"
      />
      {chars().map((ch, i) => (
        <text
          x="50"
          y={8 + step() * (i + 0.5) + step() * 0.32}
          text-anchor="middle"
          font-size={String(Math.min(step() * 0.92, 44))}
          font-weight="600"
          style={{ fill: "var(--color-hanko, #c73e3a)" }}
          font-family="'Shippori Mincho','Hiragino Mincho ProN','Yu Mincho','Noto Serif JP',serif"
        >
          {ch}
        </text>
      ))}
    </svg>
  );
}
