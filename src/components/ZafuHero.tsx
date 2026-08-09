export default function ZafuHero() {
  return (
    <section style={{
      padding: "80px 0 72px",
      "border-bottom": "1px solid #1e1e2e",
      "max-width": "760px",
      margin: "0 auto",
      padding: "0 24px",
    }}>
      <div style={{
        "font-family": "JetBrains Mono, monospace",
        "font-size": "0.75rem",
        "font-weight": "500",
        "letter-spacing": "0.12em",
        color: "#5a5a99",
        "text-transform": "uppercase",
        "margin-bottom": "20px",
      }}>
        Privacy-first browser wallet
      </div>
      <h1 style={{
        "font-size": "clamp(2rem, 5vw, 3rem)",
        "font-weight": "700",
        "letter-spacing": "-0.02em",
        color: "#e8e8f0",
        "line-height": "1.15",
        "margin-bottom": "20px",
      }}>
        <span style={{ color: "#8888cc" }}>Zafu</span> Wallet
      </h1>
      <p style={{
        "font-size": "1.05rem",
        color: "#6a6a80",
        "max-width": "580px",
        "margin-bottom": "40px",
      }}>
        Shielded transactions on Zcash and Penumbra.
        Air-gapped cold signing, FROST threshold multisig, and watch-only mode
        — in a single Chrome extension.
      </p>
      <div style={{ display: "flex", gap: "12px", "flex-wrap": "wrap" }}>
        <a href="https://chromewebstore.google.com/detail/zafu" style={{
          display: "inline-block",
          padding: "11px 24px",
          "font-size": "0.9rem",
          "font-weight": "600",
          background: "#8888cc",
          color: "#0a0a0f",
          "text-decoration": "none",
          border: "none",
          cursor: "pointer",
          transition: "opacity 0.12s",
        }}>
          Install from Chrome Web Store
        </a>
        <a href="https://github.com/rotkonetworks/zafu/releases" style={{
          display: "inline-block",
          padding: "11px 24px",
          "font-size": "0.9rem",
          "font-weight": "600",
          background: "transparent",
          color: "#c8c8d8",
          border: "1px solid #2a2a3e",
          "text-decoration": "none",
          cursor: "pointer",
          transition: "opacity 0.12s",
        }}>
          GitHub Releases
        </a>
      </div>
    </section>
  );
}
