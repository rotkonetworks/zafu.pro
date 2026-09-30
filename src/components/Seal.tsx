/**
 * The two marks from the app. Seal: the filled 秘 square that is the zafu
 * mark. Stamp: an outlined hanko with one kanji, set slightly askew, used for
 * page stamps and "done" states (済). Hanko red is used for nothing else.
 */
export function Seal(props: { size?: number }) {
  const size = () => props.size ?? 26;
  return (
    <span
      aria-hidden="true"
      class="inline-flex shrink-0 items-center justify-center bg-hanko font-display text-[#f2ecdf]"
      style={{ width: `${size()}px`, height: `${size()}px`, "font-size": `${size() * 0.58}px`, "font-weight": 600 }}
    >
      秘
    </span>
  );
}

export function Stamp(props: { text: string; size?: number; class?: string }) {
  const size = () => props.size ?? 44;
  return (
    <span
      aria-hidden="true"
      class={`inline-flex shrink-0 items-center justify-center border-hanko font-display text-hanko ${props.class ?? ""}`}
      style={{
        width: `${size()}px`,
        height: `${size()}px`,
        "border-width": `${Math.max(2, Math.round(size() / 24))}px`,
        "border-style": "solid",
        "font-size": `${size() * 0.55}px`,
        "font-weight": 600,
        transform: "rotate(-5deg)",
      }}
    >
      {props.text}
    </span>
  );
}
