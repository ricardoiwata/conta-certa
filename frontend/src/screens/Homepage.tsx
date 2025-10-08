import { useAuth } from "@/auth/AuthContext";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Dimensions, ScrollView, View, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LineChart } from "react-native-chart-kit";
import {
  ActivityIndicator,
  Card,
  IconButton,
  List,
  ProgressBar,
  Button,
  Text,
  useTheme,
  FAB,
  Portal,
} from "react-native-paper";
import { dashboardData } from "@/data/dashboard";

export default function Homepage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const theme = useTheme();
  const [fabVisible] = useState(true);
  const [fabOpen, setFabOpen] = useState(false);

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );

  const displayName = user?.displayName || user?.email || "Usuário";

  const {
    balance,
    labels,
    receita,
    despesa,
    totalReceitasRecebidas,
    totalDespesasPagas,
    receitasPendentes,
    despesasPendentes,
    proximos7Dias,
    alertas,
    categorias,
    notificacoes,
    dica,
  } = dashboardData;

  const screenWidth = Dimensions.get("window").width;
  const horizontalPadding = 16;

  const projecaoSaldoFinal = balance + receitasPendentes - despesasPendentes;

  const totalCategorias = categorias.reduce((acc, c) => acc + c.valor, 0) || 1;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: 12,
          paddingBottom: insets.bottom + 96,
          paddingHorizontal: horizontalPadding,
          gap: 12,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <Text variant="titleLarge" style={{ fontWeight: "700" }}>
              {greeting}, {displayName}
            </Text>
            <Text variant="bodyMedium" style={{ opacity: 0.7 }}>
              Bem-vindo(a) de volta
            </Text>
          </View>
          <IconButton
            icon="cash-multiple"
            size={28}
            mode="contained"
            onPress={() => router.push("/receitas")}
            containerColor={theme.colors.elevation.level2}
          />
          <IconButton
            icon="account-circle"
            size={28}
            mode="contained"
            onPress={() => router.push("/profile")}
            containerColor={theme.colors.elevation.level2}
          />
        </View>
        <Card
          testID="balance-card"
          onPress={() => router.push("/details/balance")}
        >
          <Card.Content>
            <Text variant="titleSmall" style={{ opacity: 0.7 }}>
              Saldo atual
            </Text>
            <Text variant="displaySmall" style={{ fontWeight: "800" }}>
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(balance)}
            </Text>
          </Card.Content>
        </Card>

        <Card
          testID="summary-card"
          onPress={() => router.push("/details/summary")}
        >
          <Card.Title title="Resumo do mês" titleVariant="titleMedium" />
          <Card.Content style={{ gap: 12 }}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ opacity: 0.7 }}>Receitas recebidas</Text>
                <Text
                  variant="titleLarge"
                  style={{ color: theme.colors.primary, fontWeight: "700" }}
                >
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(totalReceitasRecebidas)}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ opacity: 0.7 }}>Despesas pagas</Text>
                <Text
                  variant="titleLarge"
                  style={{ color: theme.colors.error, fontWeight: "700" }}
                >
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(totalDespesasPagas)}
                </Text>
              </View>
            </View>
            <View>
              <Text style={{ opacity: 0.7 }}>Projeção do saldo final</Text>
              <Text variant="headlineMedium" style={{ fontWeight: "700" }}>
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(projecaoSaldoFinal)}
              </Text>
              <Text style={{ opacity: 0.6, marginTop: 4 }}>
                Considerando receitas/ despesas pendentes deste mês
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card
          testID="income-vs-expense-card"
          onPress={() => router.push("/details/income-vs-expense")}
        >
          <Card.Title title="Receita x Despesa" titleVariant="titleMedium" />
          <Card.Content>
            <LineChart
              data={{
                labels,
                datasets: [
                  {
                    data: receita,
                    color: () => theme.colors.primary,
                    strokeWidth: 2,
                  },
                  {
                    data: despesa,
                    color: () => theme.colors.error,
                    strokeWidth: 2,
                  },
                ],
                legend: ["Receita", "Despesa"],
              }}
              width={screenWidth - horizontalPadding * 2}
              height={180}
              yAxisLabel="R$ "
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: theme.colors.surface,
                backgroundGradientFrom: theme.colors.surface,
                backgroundGradientTo: theme.colors.surface,
                decimalPlaces: 0,
                color: () => theme.colors.onSurface,
                labelColor: () => theme.colors.onSurface,
                propsForLabels: { fontSize: 10 },
                propsForDots: { r: "2", strokeWidth: "1" },
                propsForBackgroundLines: {
                  stroke: "rgba(0,0,0,0.08)",
                  strokeDasharray: "3 6",
                },
                useShadowColorFromDataset: false,
              }}
              bezier
              withShadow={false}
              withVerticalLines={false}
              style={{ marginVertical: 4 }}
            />
          </Card.Content>
        </Card>

        <Card
          testID="upcoming-card"
          onPress={() => router.push("/details/upcoming")}
        >
          <Card.Title title="Próximos 7 dias" titleVariant="titleMedium" />
          <Card.Content>
            {proximos7Dias.map((item) => (
              <List.Item
                key={item.id}
                title={`${item.titulo} · ${new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(item.valor)}`}
                description={item.data}
                left={(props) => (
                  <List.Icon
                    {...props}
                    color={
                      item.tipo === "Receita"
                        ? theme.colors.primary
                        : theme.colors.error
                    }
                    icon={item.tipo === "Receita" ? "cash-plus" : "cash-minus"}
                  />
                )}
              />
            ))}
          </Card.Content>
        </Card>

        <Card
          testID="alerts-card"
          onPress={() => router.push("/details/alerts")}
        >
          <Card.Title title="Alertas" titleVariant="titleMedium" />
          <Card.Content>
            {alertas.map((a) => (
              <List.Item
                key={a.id}
                title={a.texto}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon={a.tipo === "warning" ? "alert" : "bell-alert"}
                    color={
                      a.tipo === "warning"
                        ? theme.colors.tertiary
                        : theme.colors.error
                    }
                  />
                )}
              />
            ))}
          </Card.Content>
        </Card>

        <Card
          testID="categories-card"
          onPress={() => router.push("/details/categories")}
        >
          <Card.Title
            title="Top categorias de gastos"
            titleVariant="titleMedium"
          />
          <Card.Content style={{ gap: 8 }}>
            {categorias.map((c) => {
              const pct = c.valor / totalCategorias;
              return (
                <View key={c.nome} style={{ gap: 4 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text>{c.nome}</Text>
                    <Text style={{ opacity: 0.7 }}>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(c.valor)}
                    </Text>
                  </View>
                  <ProgressBar progress={pct} color={theme.colors.error} />
                </View>
              );
            })}
          </Card.Content>
        </Card>

        <Card
          testID="notifications-card"
          onPress={() => router.push("/details/notifications")}
        >
          <Card.Title title="Notificações" titleVariant="titleMedium" />
          <Card.Content>
            {notificacoes.slice(0, 3).map((n) => (
              <List.Item
                key={n.id}
                title={n.texto}
                left={(props) => <List.Icon {...props} icon="bell" />}
              />
            ))}
          </Card.Content>
        </Card>

        <Card testID="tip-card" onPress={() => router.push("/details/tip")}>
          <Card.Title title="Dica financeira" titleVariant="titleMedium" />
          <Card.Content>
            <List.Item
              title={dica}
              left={(props) => (
                <List.Icon {...props} icon="lightbulb-on-outline" />
              )}
            />
          </Card.Content>
        </Card>

        <View style={{ height: 8 }} />
      </ScrollView>

      {fabVisible && (
        <Portal>
          {fabOpen && (
            <Pressable
              onPress={() => setFabOpen(false)}
              style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.82)" }]}
            />
          )}
          <FAB.Group
            open={fabOpen}
            visible
            icon={fabOpen ? "close" : "plus"}
            actions={[
              {
                icon: "cash-plus",
                label: "Receita",
                onPress: () => router.push("/add-income"),
                color: theme.colors.primary,
                labelStyle: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
              },
              {
                icon: "cash-minus",
                label: "Despesa",
                onPress: () => router.push("/add-expense"),
                color: theme.colors.primary,
                labelStyle: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
              },
            ]}
            color={theme.colors.primary}
            onStateChange={({ open }) => setFabOpen(open)}
            backdropColor="transparent"
            style={{ position: "absolute", bottom: Math.max(insets.bottom - 4, 0), right: 16 }}
          />
        </Portal>
      )}
    </View>
  );
}
