import {
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  useContext,
  type Accessor,
  type ParentComponent,
} from "solid-js";

export type Theme = "sumi" | "washi" | "terminal";

export const THEMES: readonly Theme[] = ["sumi", "washi", "terminal"] as const;

const STORAGE_KEY = "zafu-theme";

interface ThemeContextValue {
  theme: Accessor<Theme>;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
  isDark: Accessor<boolean>;
}

const ThemeContext = createContext<ThemeContextValue>();

function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (THEMES as readonly string[]).includes(value);
}

/** Stored preference wins; otherwise follow system light/dark. */
function resolveInitialTheme(): Theme {
  if (typeof window === "undefined") return "sumi";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isTheme(stored)) return stored;
  } catch {
    /* storage unavailable (private mode etc.) */
  }
  if (window.matchMedia?.("(prefers-color-scheme: light)").matches) {
    return "washi";
  }
  return "sumi";
}

export const ThemeProvider: ParentComponent = (props) => {
  const [theme, setThemeSignal] = createSignal<Theme>(resolveInitialTheme());
  const [hasExplicitChoice, setHasExplicitChoice] = createSignal(
    typeof window !== "undefined" &&
      (() => {
        try {
          return isTheme(localStorage.getItem(STORAGE_KEY));
        } catch {
          return false;
        }
      })()
  );

  // Reflect theme on <html> so CSS variables apply globally.
  createEffect(() => {
    document.documentElement.setAttribute("data-theme", theme());
  });

  // Follow system preference until the user makes an explicit choice.
  if (typeof window !== "undefined" && window.matchMedia) {
    const mql = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = (e: MediaQueryListEvent) => {
      if (!hasExplicitChoice()) {
        setThemeSignal(e.matches ? "washi" : "sumi");
      }
    };
    mql.addEventListener("change", onChange);
    onCleanup(() => mql.removeEventListener("change", onChange));
  }

  const setTheme = (next: Theme) => {
    setThemeSignal(next);
    setHasExplicitChoice(true);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  };

  const cycleTheme = () => {
    const idx = THEMES.indexOf(theme());
    setTheme(THEMES[(idx + 1) % THEMES.length]);
  };

  const isDark = () => theme() !== "washi";

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme, isDark }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a <ThemeProvider>");
  }
  return ctx;
}
