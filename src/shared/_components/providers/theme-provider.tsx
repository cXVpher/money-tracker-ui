"use client";

import * as React from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = React.PropsWithChildren<{
  attribute?: "class" | "data-theme";
  defaultTheme?: Theme;
  disableTransitionOnChange?: boolean;
  enableSystem?: boolean;
}>;

type ThemeContextValue = {
  resolvedTheme: "dark" | "light";
  setTheme: (theme: Theme) => void;
  theme: Theme;
};

const STORAGE_KEY = "duitku:theme";
const THEME_CHANGE_EVENT = "duitku-theme-change";

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  attribute = "class",
  children,
  defaultTheme = "dark",
  disableTransitionOnChange = false,
  enableSystem = true,
}: ThemeProviderProps) {
  const theme = React.useSyncExternalStore<Theme>(
    subscribeToThemePreference,
    () => getThemePreferenceSnapshot(defaultTheme),
    () => defaultTheme
  );
  const systemTheme = React.useSyncExternalStore<"dark" | "light">(
    subscribeToSystemTheme,
    getSystemThemeSnapshot,
    () => "dark"
  );

  const resolvedTheme: "dark" | "light" =
    theme === "system" && enableSystem ? systemTheme : theme === "light" ? "light" : "dark";

  React.useEffect(() => {
    const root = document.documentElement;
    const cleanupTransition = disableTransitionOnChange
      ? disableTransitionsTemporarily()
      : null;

    if (attribute === "class") {
      root.classList.remove("light", "dark");
      root.classList.add(resolvedTheme);
    } else {
      root.setAttribute(attribute, resolvedTheme);
    }

    return () => {
      cleanupTransition?.();
    };
  }, [attribute, disableTransitionOnChange, resolvedTheme]);

  const setTheme = React.useCallback((nextTheme: Theme) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {}

    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      resolvedTheme,
      setTheme,
      theme,
    }),
    [resolvedTheme, setTheme, theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider.");
  }

  return context;
}

function disableTransitionsTemporarily() {
  const style = document.createElement("style");

  style.appendChild(
    document.createTextNode(
      "*{transition:none!important;-webkit-transition:none!important}"
    )
  );
  document.head.appendChild(style);

  return () => {
    window.getComputedStyle(document.body);
    setTimeout(() => {
      style.remove();
    }, 0);
  };
}

function subscribeToThemePreference(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
  };
}

function getThemePreferenceSnapshot(defaultTheme: Theme): Theme {
  try {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY);

    if (
      storedTheme === "dark" ||
      storedTheme === "light" ||
      storedTheme === "system"
    ) {
      return storedTheme;
    }
  } catch {}

  return defaultTheme;
}

function subscribeToSystemTheme(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  mediaQuery.addEventListener("change", onStoreChange);
  return () => {
    mediaQuery.removeEventListener("change", onStoreChange);
  };
}

function getSystemThemeSnapshot(): "dark" | "light" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
