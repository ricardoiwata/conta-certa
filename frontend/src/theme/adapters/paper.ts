import type { ColorTokens } from "@/theme/scheme";
import type { MD3Theme } from "react-native-paper";
import {
  configureFonts,
  MD3DarkTheme,
  MD3LightTheme,
} from "react-native-paper";

const fontConfig = {
  displayLarge: {
    fontFamily: "System",
    fontWeight: "700" as const,
    fontSize: 57,
    lineHeight: 64,
  },
  headlineLarge: {
    fontFamily: "System",
    fontWeight: "700" as const,
    fontSize: 32,
    lineHeight: 40,
  },
  titleLarge: {
    fontFamily: "System",
    fontWeight: "700" as const,
    fontSize: 22,
    lineHeight: 28,
  },
  bodyLarge: {
    fontFamily: "System",
    fontWeight: "400" as const,
    fontSize: 16,
    lineHeight: 24,
  },
  labelLarge: {
    fontFamily: "System",
    fontWeight: "700" as const,
    fontSize: 14,
    lineHeight: 20,
  },
};

export function makePaperTheme(
  mode: "light" | "dark",
  c: ColorTokens
): MD3Theme {
  const base = mode === "dark" ? MD3DarkTheme : MD3LightTheme;

  const colors: MD3Theme["colors"] = {
    ...base.colors,
    primary: c.primary,
    onPrimary: c.textOnPrimary,
    primaryContainer: c.primaryContainer,
    onPrimaryContainer: c.text,
    secondary: c.primaryContainer,
    onSecondary: c.text,
    secondaryContainer: c.surfaceAlt,
    onSecondaryContainer: c.text,
    error: c.error,
    onError: c.textOnPrimary,
    errorContainer: base.colors.errorContainer,
    onErrorContainer: base.colors.onErrorContainer,

    background: c.background,
    onBackground: c.text,
    surface: c.surface,
    onSurface: c.text,
    surfaceVariant: c.surfaceAlt,
    onSurfaceVariant: base.colors.onSurfaceVariant ?? c.text,
    outline: c.border,
    outlineVariant: base.colors.outlineVariant ?? c.border,
    shadow: base.colors.shadow,
    scrim: base.colors.scrim,
    inverseSurface: base.colors.inverseSurface,
    inverseOnSurface: base.colors.inverseOnSurface,
    inversePrimary: base.colors.inversePrimary,

    elevation: {
      level0: "transparent",
      level1: c.surface,
      level2: c.surfaceAlt,
      level3: c.surfaceAlt,
      level4: c.surfaceAlt,
      level5: c.surfaceAlt,
    } as MD3Theme["colors"]["elevation"],
  };

  return {
    ...base,
    version: 3,
    isV3: true,
    dark: mode === "dark",
    mode: "exact",
    roundness: 10,
    colors,
    fonts: configureFonts({ config: fontConfig }),
    animation: { scale: 1.0 },
  };
}
