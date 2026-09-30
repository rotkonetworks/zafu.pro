import { defineConfig, presetUno } from "unocss";
import presetIcons from "@unocss/preset-icons";

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      cdn: "https://esm.sh/",
      extraProperties: {
        display: "inline-block",
        "vertical-align": "middle",
      },
    }),
  ],
  theme: {
    // Colors are backed by CSS variables (src/styles/index.css) so the
    // sumi/washi themes switch at runtime via data-theme on <html>.
    colors: {
      bg: "var(--color-bg)",
      surface: "var(--color-bg-elevated)",
      "surface-2": "var(--color-bg-elevated-2)",
      hanko: "var(--color-hanko)",
      border: "var(--color-border)",
      "border-strong": "var(--color-border-strong)",
      accent: "var(--color-accent)",
      "accent-contrast": "var(--color-accent-contrast)",
      text: "var(--color-text)",
      "text-em": "var(--color-text)",
      body: "var(--color-text-body)",
      muted: "var(--color-text-muted)",
      dim: "var(--color-text-muted)",
      dim2: "var(--color-text-dim)",
      ok: "var(--color-ok)",
      warn: "var(--color-warn)",
      cold: "var(--color-cold)",
    },
    fontFamily: {
      sans: "var(--font-sans)",
      mono: "var(--font-mono)",
      display: "var(--font-display)",
    },
  },
  shortcuts: {
    "accent-link": "text-accent hover:text-text-em transition-colors",
    "card": "bg-surface border border-border p-6",
    "btn": "inline-flex items-center justify-center gap-2 h-12 px-6 text-sm border border-transparent",
    "btn-primary": "btn bg-accent text-accent-contrast hover:bg-[var(--color-accent-hover)]",
    "btn-outline": "btn bg-surface-2 border-border text-text hover:border-border-strong",
  },
});
