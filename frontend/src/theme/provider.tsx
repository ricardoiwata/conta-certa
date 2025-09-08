import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavTheme,
} from "@react-navigation/native";
import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { makePaperTheme } from "./adapters/paper";
import { darkColors, lightColors, type ColorTokens } from "./scheme";

type AppTheme = { mode: "light" | "dark"; colors: ColorTokens };
const ThemeCtx = createContext<AppTheme>({
  mode: "light",
  colors: lightColors,
});

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const mode: "light" | "dark" = scheme === "dark" ? "dark" : "light";
  const tokens = mode === "dark" ? darkColors : lightColors;

  const navTheme = useMemo(
    () => ({
      ...(mode === "dark" ? DarkTheme : DefaultTheme),
      colors: {
        ...(mode === "dark" ? DarkTheme.colors : DefaultTheme.colors),
        background: tokens.background,
        card: tokens.surface,
        text: tokens.text,
        border: tokens.border,
        primary: tokens.primary,
        notification: tokens.error,
      },
    }),
    [mode, tokens]
  );

  const paperTheme = useMemo(
    () => makePaperTheme(mode, tokens),
    [mode, tokens]
  );
  const value = useMemo(() => ({ mode, colors: tokens }), [mode, tokens]);

  return (
    <ThemeCtx.Provider value={value}>
      <PaperProvider theme={paperTheme}>
        <NavTheme value={navTheme}>{children}</NavTheme>
      </PaperProvider>
    </ThemeCtx.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeCtx);
}
