import { useAuth } from "@/auth/AuthContext";
import { signOutUser } from "@/services/auth";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Appbar, Avatar, Button, Card, Text } from "react-native-paper";

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();

  const name = user?.displayName || "Usuário";
  const email = user?.email || "";

  async function handleLogout() {
    await signOutUser();
    router.replace("/login");
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Perfil" />
      </Appbar.Header>

      <View style={{ padding: 16, gap: 12 }}>
        <Card>
          <Card.Content style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 }}>
            <Avatar.Icon size={56} icon="account" />
            <View style={{ flex: 1 }}>
              <Text variant="titleMedium" style={{ fontWeight: "700" }}>{name}</Text>
              {!!email && (
                <Text variant="bodyMedium" style={{ opacity: 0.7 }}>{email}</Text>
              )}
            </View>
          </Card.Content>
        </Card>

        <Button mode="contained" onPress={handleLogout}>
          Sair da conta
        </Button>
      </View>
    </View>
  );
}

