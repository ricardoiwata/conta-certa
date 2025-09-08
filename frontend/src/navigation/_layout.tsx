import { AuthProvider } from "@/auth/AuthContext";
import { Stack } from "expo-router";
import { AppThemeProvider } from "../theme/provider";

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </AppThemeProvider>
  );
}
