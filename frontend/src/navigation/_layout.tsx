import { Stack } from "expo-router";
import { AppThemeProvider } from "../theme/provider";

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AppThemeProvider>
  );
}
