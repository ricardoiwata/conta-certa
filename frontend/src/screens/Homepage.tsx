import { useAuth } from "@/auth/AuthContext";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
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
} from "react-native-paper";

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

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );

  const displayName = user?.displayName || user?.email || "Usuário";

  const balance = 1520.75;
  const labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
  const receita = [1200, 1350, 1100, 1600, 1450, 1700];
  const despesa = [800, 950, 900, 1000, 1100, 1200];

  const screenWidth = Dimensions.get("window").width;
  const horizontalPadding = 16; // tighter horizontal padding

  // Mock domain data (replace with real queries later)
  const totalReceitasRecebidas = 8450;
  const totalDespesasPagas = 5120;
  const receitasPendentes = 1550;
  const despesasPendentes = 2300;
  const projecaoSaldoFinal = balance + receitasPendentes - despesasPendentes;

  const proximos7Dias = [
    { id: "1", tipo: "Despesa", titulo: "Conta de Luz", data: "Amanhã", valor: 120.4 },
    { id: "2", tipo: "Despesa", titulo: "Internet", data: "Em 2 dias", valor: 99.9 },
    { id: "3", tipo: "Receita", titulo: "Salário", data: "Em 5 dias", valor: 3200 },
  ];

  const alertas = [
    { id: "a1", tipo: "warning", texto: "Você atingiu 80% do orçamento de Lazer" },
    { id: "a2", tipo: "alert", texto: "Conta de internet vence em 2 dias" },
  ];

  const categorias = [
    { nome: "Alimentação", valor: 860 },
    { nome: "Transporte", valor: 420 },
    { nome: "Moradia", valor: 1450 },
    { nome: "Lazer", valor: 310 },
    { nome: "Saúde", valor: 220 },
  ];
  const totalCategorias = categorias.reduce((acc, c) => acc + c.valor, 0) || 1;

  const notificacoes = [
    { id: "n1", texto: "Você atingiu 80% do orçamento de lazer" },
    { id: "n2", texto: "Conta de luz vence amanhã" },
    { id: "n3", texto: "Cashback de R$ 15 disponível" },
  ];

  const dica = "Este mês você gastou 18% a mais em transporte que no anterior.";

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 96,
          paddingHorizontal: horizontalPadding,
          gap: 12,
        }}
      >
        {/* Top bar: greeting + profile button */}
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
            icon="account-circle"
            size={28}
            mode="contained"
            onPress={() => router.push("/profile")}
            containerColor={theme.colors.elevation.level2}
          />
        </View>

        {/* Saldo atual */}
        <Card>
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

        {/* Resumo rápido do mês */}
        <Card>
          <Card.Title title="Resumo do mês" titleVariant="titleMedium" />
          <Card.Content style={{ gap: 12 }}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ opacity: 0.7 }}>Receitas recebidas</Text>
                <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: "700" }}>
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalReceitasRecebidas)}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ opacity: 0.7 }}>Despesas pagas</Text>
                <Text variant="titleLarge" style={{ color: theme.colors.error, fontWeight: "700" }}>
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalDespesasPagas)}
                </Text>
              </View>
            </View>
            <View>
              <Text style={{ opacity: 0.7 }}>Projeção do saldo final</Text>
              <Text variant="headlineMedium" style={{ fontWeight: "700" }}>
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(projecaoSaldoFinal)}
              </Text>
              <Text style={{ opacity: 0.6, marginTop: 4 }}>
                Considerando receitas/ despesas pendentes deste mês
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Receita x Despesa (linha) */}
        <Card>
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

        {/* Próximos eventos financeiros (7 dias) */}
        <Card>
          <Card.Title title="Próximos 7 dias" titleVariant="titleMedium" />
          <Card.Content>
            {proximos7Dias.map((item) => (
              <List.Item
                key={item.id}
                title={`${item.titulo} · ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.valor)}`}
                description={item.data}
                left={(props) => (
                  <List.Icon
                    {...props}
                    color={item.tipo === "Receita" ? theme.colors.primary : theme.colors.error}
                    icon={item.tipo === "Receita" ? "cash-plus" : "cash-minus"}
                  />
                )}
              />
            ))}
          </Card.Content>
        </Card>

        {/* Alertas de contas/limite */}
        <Card>
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
                    color={a.tipo === "warning" ? theme.colors.tertiary : theme.colors.error}
                  />
                )}
              />
            ))}
          </Card.Content>
        </Card>

        {/* Top categorias de gastos (ranking) */}
        <Card>
          <Card.Title title="Top categorias de gastos" titleVariant="titleMedium" />
          <Card.Content style={{ gap: 8 }}>
            {categorias.map((c) => {
              const pct = c.valor / totalCategorias;
              return (
                <View key={c.nome} style={{ gap: 4 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text>{c.nome}</Text>
                    <Text style={{ opacity: 0.7 }}>
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(c.valor)}
                    </Text>
                  </View>
                  <ProgressBar progress={pct} color={theme.colors.error} />
                </View>
              );
            })}
          </Card.Content>
        </Card>

        {/* Notificações recentes */}
        <Card>
          <Card.Title title="Notificações" titleVariant="titleMedium" />
          <Card.Content>
            {notificacoes.slice(0, 3).map((n) => (
              <List.Item key={n.id} title={n.texto} left={(props) => <List.Icon {...props} icon="bell" />} />
            ))}
          </Card.Content>
        </Card>

        {/* Dicas financeiras */}
        <Card>
          <Card.Title title="Dica financeira" titleVariant="titleMedium" />
          <Card.Content>
            <List.Item
              title={dica}
              left={(props) => <List.Icon {...props} icon="lightbulb-on-outline" />}
            />
          </Card.Content>
        </Card>

        {/* Espaço extra para não colidir com FABs */}
        <View style={{ height: 8 }} />
      </ScrollView>

      {/* Fixed CTA FABs */}
      {fabVisible && (
        <View
          pointerEvents="box-none"
          style={{
            position: "absolute",
            bottom: insets.bottom + 16,
            left: horizontalPadding,
            right: horizontalPadding,
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <Button
            mode="contained"
            icon="cash-plus"
            onPress={() => router.push("/add-income")}
            style={{ flex: 1 }}
          >
            + Receita
          </Button>
          <Button
            mode="contained"
            icon="cash-minus"
            onPress={() => router.push("/add-expense")}
            style={{ flex: 1 }}
          >
            + Despesa
          </Button>
        </View>
      )}
    </View>
  );
}
