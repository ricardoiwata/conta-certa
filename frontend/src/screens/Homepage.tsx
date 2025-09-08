import { useAuth } from "@/auth/AuthContext";
import { signOutUser } from "@/services/auth";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";

export default function Homepage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  async function handleLogout() {
    await signOutUser();
    router.replace("/login");
  }

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );

  const displayName = user?.displayName || user?.email || "Usuário";

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        gap: 16,
      }}
    >
      <Text variant="headlineMedium" style={{ fontWeight: "700" }}>
        {displayName}
      </Text>
      <Button mode="contained" onPress={handleLogout}>
        Sair
      </Button>
    </View>
  );
}
