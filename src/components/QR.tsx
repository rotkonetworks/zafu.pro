import qrcode from "qrcode-generator";

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
