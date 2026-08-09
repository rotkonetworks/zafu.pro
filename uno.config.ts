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
    // sumi/washi/terminal themes switch at runtime via data-theme on <html>.
    colors: {
      bg: "var(--color-bg)",
      surface: "var(--color-bg-elevated)",
      border: "var(--color-border)",
      "border-strong": "var(--color-border-strong)",
      accent: "var(--color-accent)",
      "accent-contrast": "var(--color-accent-contrast)",
      text: "var(--color-text)",
      "text-em": "var(--color-text)",
      muted: "var(--color-text-muted)",
      // Legacy aliases used by early components.
      dim: "var(--color-text-muted)",
      dim2: "var(--color-text-dim)",
    },
    fontFamily: {
      sans: "var(--font-sans)",
      mono: "var(--font-mono)",
    },
  },
  shortcuts: {
    "section-container": "max-w-3xl mx-auto px-6",
    "accent-link": "text-accent hover:text-text-em transition-colors",
    "card": "bg-surface border border-border p-6",
    "btn": "inline-flex items-center gap-2 text-sm px-6 py-3 font-semibold transition-opacity hover:opacity-85",
    "btn-primary": "btn bg-accent text-accent-contrast",
    "btn-outline": "btn border border-border text-text hover:text-text-em",
  },
});
