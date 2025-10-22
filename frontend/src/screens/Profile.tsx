import { useAuth } from "@/auth/AuthContext";
import { signOutUser } from "@/services/auth";
import { useThemePreference, type ThemePreference } from "@/theme/ThemeContext";
import { dashboardData } from "@/data/dashboard";
import { modernStyles } from "@/styles/modern.styles";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { Appbar, Avatar, Button, Card, Text, Menu, IconButton, List, Badge, useTheme } from "react-native-paper";

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();
  const { themePreference, setThemePreference } = useThemePreference();
  const [menuVisible, setMenuVisible] = useState(false);

  const name = user?.displayName || "Usuário";
  const email = user?.email || "";
  const { notificacoes } = dashboardData;
  const theme = useTheme();

  async function handleLogout() {
    await signOutUser();
    router.replace("/login");
  }

  const getThemeLabel = (preference: ThemePreference) => {
    switch (preference) {
      case 'light':
        return 'Claro';
      case 'dark':
        return 'Escuro';
      case 'system':
        return 'Sistema';
      default:
        return 'Sistema';
    }
  };

  const getThemeIcon = (preference: ThemePreference) => {
    switch (preference) {
      case 'light':
        return 'white-balance-sunny';
      case 'dark':
        return 'moon-waning-crescent';
      case 'system':
        return 'theme-light-dark';
      default:
        return 'theme-light-dark';
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Perfil" />
      </Appbar.Header>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={[modernStyles.modernContainer, { paddingTop: 16 }]}>
        <Card style={modernStyles.modernCard}>
          <Card.Content style={[modernStyles.modernCardContent, { flexDirection: "row", alignItems: "center", gap: 16 }]}>
            <Avatar.Icon size={64} icon="account" />
            <View style={{ flex: 1 }}>
              <Text style={[modernStyles.modernTitle, { color: theme.colors.onSurface, marginBottom: 4 }]}>
                {name}
              </Text>
              {!!email && (
                <Text style={[modernStyles.modernSubtitle, { color: theme.colors.onSurface }]}>
                  {email}
                </Text>
              )}
            </View>
          </Card.Content>
        </Card>

        <Card style={modernStyles.modernCard}>
          <Card.Content style={modernStyles.modernCardContent}>
            <View style={modernStyles.modernRow}>
              <View style={modernStyles.modernColumn}>
                <Text style={[modernStyles.modernTitle, { color: theme.colors.onSurface, fontSize: 16 }]}>
                  Tema
                </Text>
                <Text style={[modernStyles.modernSubtitle, { color: theme.colors.onSurface }]}>
                  {getThemeLabel(themePreference)}
                </Text>
              </View>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <IconButton
                    icon={getThemeIcon(themePreference)}
                    size={24}
                    onPress={() => setMenuVisible(true)}
                  />
                }
              >
                <Menu.Item
                  onPress={() => {
                    setThemePreference('system');
                    setMenuVisible(false);
                  }}
                  title="Sistema"
                  leadingIcon="theme-light-dark"
                  trailingIcon={themePreference === 'system' ? 'check' : undefined}
                />
                <Menu.Item
                  onPress={() => {
                    setThemePreference('light');
                    setMenuVisible(false);
                  }}
                  title="Claro"
                  leadingIcon="white-balance-sunny"
                  trailingIcon={themePreference === 'light' ? 'check' : undefined}
                />
                <Menu.Item
                  onPress={() => {
                    setThemePreference('dark');
                    setMenuVisible(false);
                  }}
                  title="Escuro"
                  leadingIcon="moon-waning-crescent"
                  trailingIcon={themePreference === 'dark' ? 'check' : undefined}
                />
              </Menu>
            </View>
          </Card.Content>
        </Card>

        <Card style={modernStyles.modernCard}>
          <Card.Content style={modernStyles.modernCardContent}>
            <View style={[modernStyles.modernRow, { marginBottom: 12 }]}>
              <Text style={[modernStyles.modernTitle, { color: theme.colors.onSurface, fontSize: 16 }]}>
                Notificações
              </Text>
              {notificacoes.length > 0 && (
                <View style={[modernStyles.modernBadge, { backgroundColor: '#FF6B6B' }]}>
                  <Text style={modernStyles.modernBadgeText}>
                    {notificacoes.length}
                  </Text>
                </View>
              )}
            </View>
            {notificacoes.length > 0 ? (
              notificacoes.map((notificacao) => (
                <List.Item
                  key={notificacao.id}
                  title={notificacao.texto}
                  titleStyle={{ fontSize: 14, fontWeight: '500' }}
                  left={(props) => <List.Icon {...props} icon="bell" color="#FF6B6B" />}
                  style={{ paddingHorizontal: 0 }}
                />
              ))
            ) : (
              <Text style={{ opacity: 0.6, textAlign: 'center', paddingVertical: 16 }}>
                Nenhuma notificação no momento
              </Text>
            )}
          </Card.Content>
        </Card>

        <Button 
          mode="contained" 
          onPress={handleLogout}
          style={[modernStyles.modernButton, { marginTop: 8 }]}
          labelStyle={{ fontSize: 16, fontWeight: '600' }}
        >
          Sair da conta
        </Button>
      </ScrollView>
    </View>
  );
}

