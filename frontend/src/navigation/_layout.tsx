import { AuthProvider } from "@/auth/AuthContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppThemeProvider } from "../theme/provider";

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </AuthProvider>
      </SafeAreaProvider>
    </AppThemeProvider>
  );
}
