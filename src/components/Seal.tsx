/**
 * The zafu brand mark. Every hand-drawn seal square or "zafu" wordmark on
 * the site routes through here, so it can never again match its background.
 *
 * Seal   - the filled 匿 square. Hanko red is used for nothing else. The
 *          glyph is a hard cream (#f2ecdf), fixed - never a theme token,
 *          like real ink on a real hanko's paper.
 * Mono   - the glyph alone, or the "zafu" wordmark, in `text-text` - the
 *          site's highest-contrast token, so it flips with the theme.
 * Lockup - Seal to the left of the (always-mono) wordmark.
 */
export function Seal(props: { size?: number }) {
  const size = () => props.size ?? 26;
  return (
    <span
      aria-hidden="true"
      class="inline-flex shrink-0 items-center justify-center bg-hanko font-display text-[#f2ecdf]"
      style={{ width: `${size()}px`, height: `${size()}px`, "font-size": `${size() * 0.58}px`, "font-weight": 600 }}
    >
      匿
    </span>
  );
}

export function Mono(props: { size?: number; content?: "glyph" | "wordmark" }) {
  const size = () => props.size ?? 26;
  const content = () => props.content ?? "glyph";
  return (
    <span
      aria-hidden={content() === "glyph" ? "true" : undefined}
      class="inline-flex shrink-0 items-center font-display font-semibold text-text"
      style={{ "font-size": `${size() * (content() === "glyph" ? 0.75 : 0.68)}px` }}
    >
      {content() === "glyph" ? "匿" : "zafu"}
    </span>
  );
}

export function Lockup(props: { size?: number; slogan?: boolean }) {
  const size = () => props.size ?? 26;
  return (
    <span class="inline-flex flex-col gap-1">
      <span class="inline-flex items-center gap-2.5">
        <Seal size={size()} />
        <Mono size={size()} content="wordmark" />
      </span>
      {props.slogan && <span class="text-xs text-muted">shielded signing</span>}
    </span>
  );
}
