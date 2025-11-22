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
import { ThemePreferenceProvider, useThemePreference } from "./ThemeContext";

type AppTheme = { mode: "light" | "dark"; colors: ColorTokens };
const ThemeCtx = createContext<AppTheme>({
  mode: "light",
  colors: lightColors,
});

function ThemeProviderInner({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const { themePreference, isLoading } = useThemePreference();
  
  const mode: "light" | "dark" = useMemo(() => {
    if (isLoading) return "light"; 
    
    switch (themePreference) {
      case 'light':
        return 'light';
      case 'dark':
        return 'dark';
      case 'system':
      default:
        return systemScheme === "dark" ? "dark" : "light";
    }
  }, [themePreference, systemScheme, isLoading]);
  
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

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemePreferenceProvider>
      <ThemeProviderInner>{children}</ThemeProviderInner>
    </ThemePreferenceProvider>
  );
}

export function useAppTheme() {
  return useContext(ThemeCtx);
}
