/** The filled 秘 square: the zafu mark. Hanko red is used for nothing else. */
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
