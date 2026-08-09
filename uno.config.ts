import { defineConfig, presetUno, presetWebFonts } from "unocss";
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
    presetWebFonts({
      fonts: {
        mono: "JetBrains Mono:400;600",
      },
    }),
  ],
  theme: {
    colors: {
      bg: "#0a0a0f",
      surface: "#0f0f17",
      border: "#1e1e2e",
      accent: "#8888cc",
      text: "#c8c8d8",
      "text-em": "#e8e8f0",
      dim: "#6a6a80",
      dim2: "#4a4a60",
    },
  },
  shortcuts: {
    "section-container": "max-w-3xl mx-auto px-6",
    "accent-link": "text-accent hover:text-text-em transition-colors",
    "card": "bg-surface border border-border p-6",
    "btn": "inline-flex items-center gap-2 text-sm px-6 py-3 font-semibold transition-opacity hover:opacity-85",
    "btn-primary": "btn bg-accent text-bg",
    "btn-outline": "btn border border-border text-text hover:text-text-em",
  },
});
