import { AuthProvider } from "@/auth/AuthContext";
import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "react-native-paper";
import { AppThemeProvider } from "../theme/provider";
import { FabProvider } from "../context/FabContext";

function ThemedShell() {
  const theme = useTheme();
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <FabProvider>
          <StatusBar
            style={theme.dark ? "light" : "dark"}
            translucent={false}
            backgroundColor={theme.colors.background}
          />
          <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
            edges={["top", "left", "right"]}
          >
            <Stack screenOptions={{ headerShown: false }} />
          </SafeAreaView>
        </FabProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <ThemedShell />
    </AppThemeProvider>
  );
}
