import { useAuth } from "@/auth/AuthContext";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  ScrollView,
  View,
  Pressable,
  StyleSheet,
  Animated,
  LayoutChangeEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
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
  Icon,
} from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';
import { modernStyles } from "@/styles/modern.styles";
import { listReceitas, listReceitasRecorrentes } from "@/services/receitas";
import { listDespesas, listDespesasRecorrentes } from "@/services/despesas";
import { useFab } from "@/context/FabContext";
import { getDashboardData, type DashboardData } from "@/services/dashboard";

export default function Homepage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setFabVisible } = useFab();

  useEffect(() => {
    setFabVisible(true);
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router, setFabVisible]);


  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const theme = useTheme();
  const [fabOpen, setFabOpen] = useState(false);
  const { fabVisible } = useFab();
  const [chooseType, setChooseType] = useState<null | "income" | "expense">(
    null
  );
  const [chooseRecurringStep, setChooseRecurringStep] = useState<null | "income" | "expense">(
    null
  );
  const [hasIncomeRecurringParents, setHasIncomeRecurringParents] = useState<
    boolean | null
  >(null);
  const [hasExpenseRecurringParents, setHasExpenseRecurringParents] = useState<
    boolean | null
  >(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  
  // Animação para o card de saldo
  const balanceAnimation = useState(new Animated.Value(0))[0];
  const scaleAnimation = useState(new Animated.Value(0.95))[0];
  const pulseAnimation = useState(new Animated.Value(1))[0];
  const shineAnimation = useState(new Animated.Value(-100))[0];

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );

  const displayName = user?.displayName || user?.email || "Usuário";

  const {
    balance = 0,
    labels = [],
    receita = [],
    despesa = [],
    totalReceitasRecebidas = 0,
    totalDespesasPagas = 0,
    receitasPendentes = 0,
    despesasPendentes = 0,
    proximos7Dias = [],
    alertas = [],
    categorias = [],
    notificacoes = [],
    dica = "Mantenha o controle de suas despesas.",
  } = dashboardData || {};

  const screenWidth = Dimensions.get("window").width;
  const horizontalPadding = 16;
  const cardPadding = 16; // Padding interno do Card.Content
  const [incomeChartWidth, setIncomeChartWidth] = useState(() =>
    Math.max(220, screenWidth - horizontalPadding * 2 - cardPadding * 2 - 12),
  );
  const handleIncomeChartLayout = useCallback((event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    if (width <= 0) return;
    const nextWidth = Math.max(220, width - 8);
    setIncomeChartWidth((previous) =>
      Math.abs(previous - nextWidth) < 1 ? previous : nextWidth,
    );
  }, []);

  const projecaoSaldoFinal = balance + receitasPendentes - despesasPendentes;

  const totalCategorias = categorias.reduce((acc, c) => acc + c.valor, 0) || 1;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(balanceAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnimation, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Animação de pulso sutil
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    
    const timer = setTimeout(() => {
      pulseLoop.start();
    }, 1000);

    // Efeito de brilho ocasional
    const shineLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shineAnimation, {
          toValue: screenWidth + 100,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.delay(5000),
        Animated.timing(shineAnimation, {
          toValue: -100,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    const shineTimer = setTimeout(() => {
      shineLoop.start();
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(shineTimer);
      pulseLoop.stop();
      shineLoop.stop();
    };
  }, [balance, screenWidth, balanceAnimation, scaleAnimation, pulseAnimation, shineAnimation]);

  // Recarrega resumo ao focar
  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        try {
          setSummaryError(null);
          setSummaryLoading(true);
          const data = await getDashboardData();
          setDashboardData(data);
        } catch (e: any) {
          setSummaryError(e?.message || "Falha ao carregar resumo");
        } finally {
          setSummaryLoading(false);
        }
      })();
      return () => {};
    }, [])
  );

  useEffect(() => {
    (async () => {
      if (chooseRecurringStep != null) {
        try {
          const [rPais, dPais] = await Promise.all([
            listReceitasRecorrentes().catch(() => []),
            listDespesasRecorrentes().catch(() => []),
          ]);
          setHasIncomeRecurringParents((rPais || []).length > 0);
          setHasExpenseRecurringParents((dPais || []).length > 0);
        } catch {
          setHasIncomeRecurringParents(null);
          setHasExpenseRecurringParents(null);
        }
      }
    })();
  }, [chooseRecurringStep]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: 12,
          paddingBottom: insets.bottom + 96,
          ...modernStyles.modernContainer,
        }}
      >
        <View style={[modernStyles.modernRow, modernStyles.modernHeader]}>
          <View style={modernStyles.modernColumn}>
            <Text style={[modernStyles.modernHeaderTitle, { color: theme.colors.onBackground }]}>
              {greeting}, {displayName.split(" ")[0]}!
            </Text>
            <Text style={[modernStyles.modernHeaderSubtitle, { color: theme.colors.onBackground }]}>
              Aqui está o resumo das suas finanças
            </Text>
          </View>
          {/** Removed quick access to Receitas to restrict access via "Receita x Despesa" */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ position: 'relative' }}>
              <IconButton
                icon="bell"
                size={24}
                mode="contained"
                onPress={() => router.push("/details/notifications")}
                containerColor={theme.colors.elevation.level2}
              />
              {notificacoes.length > 0 && (
                <View style={[
                  modernStyles.modernBadge,
                  {
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    backgroundColor: '#FF6B6B',
                  }
                ]}>
                  <Text style={modernStyles.modernBadgeText}>
                    {notificacoes.length}
                  </Text>
                </View>
              )}
            </View>
            <IconButton
              icon="account-circle"
              size={28}
              mode="contained"
              onPress={() => router.push("/profile")}
              containerColor={theme.colors.elevation.level2}
            />
          </View>
        </View>
        <Pressable
          testID="balance-card"
          onPress={() => router.push("/details/balance")}
          style={modernStyles.balanceCard}
        >
          <LinearGradient
            colors={balance >= 0 ? ['#4CAF50', '#45a049', '#2E7D32'] : ['#f44336', '#e53935', '#c62828']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={modernStyles.balanceGradient}
          >
            <View style={modernStyles.balanceCardContent}>
              <View style={modernStyles.balanceIcon}>
                <Icon
                  source="wallet"
                  size={32}
                  color="rgba(255, 255, 255, 0.3)"
                />
              </View>
              
              <Text style={[modernStyles.balanceLabel, { color: 'white' }]}>
                Saldo Atual
              </Text>
              
              <Text style={[modernStyles.balanceValue, { color: 'white' }]}>
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(balance)}
              </Text>
              
              <View style={modernStyles.balanceIndicator}>
                <Icon
                  source={balance >= 0 ? "trending-up" : "trending-down"}
                  size={16}
                  color="white"
                />
                <Text style={modernStyles.balanceIndicatorText}>
                  {balance >= 0 ? "Saldo Positivo" : "Saldo Negativo"}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Pressable>

        <Card
          testID="summary-card"
          onPress={() => router.push("/details/summary")}
          style={modernStyles.modernCard}
        >
          <Card.Content style={[modernStyles.modernCardContent, modernStyles.modernGap]}>
            <Text style={[modernStyles.modernTitle, { color: theme.colors.onSurface }]}>
              Resumo do mês
            </Text>
            <View style={[modernStyles.modernRow, modernStyles.modernGapSmall]}>
              <View style={modernStyles.modernColumn}>
                <Text style={[modernStyles.modernSubtitle, { color: theme.colors.onSurface }]}>
                  Receitas recebidas
                </Text>
                <Text style={[modernStyles.modernValue, { 
                  color: theme.colors.primary,
                  fontSize: 18
                }]}>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(totalReceitasRecebidas)}
                </Text>
              </View>
              <View style={modernStyles.modernColumn}>
                <Text style={[modernStyles.modernSubtitle, { color: theme.colors.onSurface }]}>
                  Despesas pagas
                </Text>
                <Text style={[modernStyles.modernValue, { 
                  color: theme.colors.error,
                  fontSize: 18
                }]}>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(totalDespesasPagas)}
                </Text>
              </View>
            </View>
            <View>
              <Text style={{ 
                opacity: 0.7, 
                fontSize: 13,
                fontWeight: '500'
              }}>
                Projeção do saldo final
              </Text>
              <Text variant="headlineMedium" style={{ 
                fontWeight: "700",
                fontSize: 20
              }}>
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
          <Card.Content>
            <Text 
              variant="titleMedium" 
              style={{ 
                fontWeight: '600', 
                fontSize: 16,
                marginBottom: 8,
                marginTop: 4,
                textAlign: 'left',
                paddingHorizontal: 4
              }}
            >
              Receita x Despesa
            </Text>
            <View style={{ width: "100%", marginTop: 4 }} onLayout={handleIncomeChartLayout}>
              <LineChart
                data={{
                  labels: [...labels],
                  datasets: [
                    {
                      data: [...receita],
                      color: () => theme.colors.primary,
                      strokeWidth: 3,
                    },
                    {
                      data: [...despesa],
                      color: () => theme.colors.error,
                      strokeWidth: 3,
                    },
                  ],
                  legend: ["Receita", "Despesa"],
                }}
                width={incomeChartWidth}
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
                  propsForLabels: {
                    fontSize: 12,
                    fontWeight: '600',
                    fontFamily: 'System',
                    fill: theme.colors.onSurface
                  },
                  propsForDots: { r: "3", strokeWidth: "1.5" },
                  propsForBackgroundLines: {
                    stroke: theme.colors.outline + '40',
                    strokeDasharray: "2 4",
                  },
                  useShadowColorFromDataset: false,
                }}
                bezier
                withShadow={false}
                withVerticalLines={false}
                withHorizontalLines={true}
                withInnerLines={false}
                withOuterLines={false}
                style={{ marginVertical: 8, borderRadius: 8 }}
              />
            </View>
          </Card.Content>
        </Card>

        <Card
          testID="upcoming-card"
          onPress={() => router.push("/details/upcoming")}
        >
          <Card.Content>
            <Text 
              variant="titleMedium" 
              style={{ 
                fontWeight: '600', 
                fontSize: 16,
                marginBottom: 8,
                marginTop: 4,
                textAlign: 'left',
                paddingHorizontal: 4
              }}
            >
              Próximos 7 dias
            </Text>
            {proximos7Dias.map((item) => (
              <List.Item
                key={item.id}
                title={`${item.titulo}     ${new Intl.NumberFormat("pt-BR", {
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
          <Card.Content>
            <Text 
              variant="titleMedium" 
              style={{ 
                fontWeight: '600', 
                fontSize: 16,
                marginBottom: 8,
                marginTop: 4,
                textAlign: 'left',
                paddingHorizontal: 4
              }}
            >
              Alertas
            </Text>
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
          <Card.Content style={{ gap: 8 }}>
            <Text 
              variant="titleMedium" 
              style={{ 
                fontWeight: '600', 
                fontSize: 16,
                marginBottom: 8,
                marginTop: 4,
                textAlign: 'left',
                paddingHorizontal: 4
              }}
            >
              Top categorias de gastos
            </Text>
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
                    <Text style={{ 
                      fontSize: 14,
                      fontWeight: '500'
                    }}>
                      {c.nome}
                    </Text>
                    <Text style={{ 
                      opacity: 0.7,
                      fontSize: 14,
                      fontWeight: '600'
                    }}>
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


        <Card testID="tip-card" onPress={() => router.push("/details/tip")}>
          <Card.Content>
            <Text 
              variant="titleMedium" 
              style={{ 
                fontWeight: '600', 
                fontSize: 16,
                marginBottom: 8,
                marginTop: 4,
                textAlign: 'left',
                paddingHorizontal: 4
              }}
            >
              Dica financeira
            </Text>
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
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: "rgba(0,0,0,0.82)" },
              ]}
            />
          )}
          <FAB
            icon="brain"
            onPress={() => {
              router.push("/chatbot");
            }}
            color={theme.colors.primary}
            style={{
              position: "absolute",
              bottom: Math.max(insets.bottom + 16, 16),
              left: 16,
            }}
          />
          <FAB.Group
            open={fabOpen}
            visible
            icon={fabOpen ? "close" : "plus"}
            actions={[
              {
                icon: "cash-plus",
                label: "Receita",
                onPress: () => {
                  setFabOpen(false);
                  setChooseType("income");
                },
                color: theme.colors.primary,
                labelStyle: {
                  color: "#FFFFFF",
                  fontWeight: "700",
                  fontSize: 16,
                },
              },
              {
                icon: "cash-minus",
                label: "Despesa",
                onPress: () => {
                  setFabOpen(false);
                  setChooseType("expense");
                },
                color: theme.colors.primary,
                labelStyle: {
                  color: "#FFFFFF",
                  fontWeight: "700",
                  fontSize: 16,
                },
              },
            ]}
            color={theme.colors.primary}
            onStateChange={({ open }) => setFabOpen(open)}
            backdropColor="transparent"
            style={{
              position: "absolute",
              bottom: Math.max(insets.bottom - 4, 0),
              right: 16,
            }}
          />
        </Portal>
      )}
      <Portal>
        {chooseType && (
          <>
            <Pressable
              onPress={() => {
                setChooseType(null);
                setChooseRecurringStep(null);
              }}
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: "rgba(0,0,0,0.82)" },
              ]}
            />
            <View
              style={{
                position: "absolute",
                left: 16,
                right: 16,
                top: 0,
                bottom: 0,
                justifyContent: "center",
              }}
            >
              <Card>
                <Card.Content style={{ gap: 10, paddingVertical: 16 }}>
                  <Text style={{ fontWeight: "700", padding: 20 }}>
                    Como deseja cadastrar?
                  </Text>
                  <Button
                    mode="contained"
                    onPress={() => {
                      setChooseType(null);
                      if (chooseType === "income")
                        router.push("/add-income-one-time");
                      else router.push("/add-expense-one-time");
                    }}
                  >
                    Não recorrente
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => {
                      setChooseRecurringStep(chooseType as any);
                      setChooseType(null);
                    }}
                  >
                    Recorrente
                  </Button>
                  <Button
                    onPress={() => {
                      setChooseType(null);
                      setChooseRecurringStep(null);
                    }}
                  >
                    Cancelar
                  </Button>
                </Card.Content>
              </Card>
            </View>
          </>
        )}
      </Portal>
      <Portal>
        {chooseRecurringStep != null && (
          <>
            <Pressable
              onPress={() => setChooseRecurringStep(null)}
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: "rgba(0,0,0,0.82)" },
              ]}
            />
            <View
              style={{
                position: "absolute",
                left: 16,
                right: 16,
                top: 0,
                bottom: 0,
                justifyContent: "center",
              }}
            >
              <Card>
                <Card.Content style={{ gap: 10, paddingVertical: 16 }}>
                  <Text style={{ fontWeight: "700", padding: 20 }}>
                    Recorrente
                  </Text>
                  <Button
                    mode="contained"
                    onPress={() => {
                      const t = chooseRecurringStep;
                      setChooseRecurringStep(null);
                      if (t === "income") router.push("/add-income-recurring");
                      else router.push("/add-expense-recurring");
                    }}
                  >
                    Recorrente nova
                  </Button>
                  <Button
                    mode="outlined"
                    disabled={
                      chooseRecurringStep === "income"
                        ? hasIncomeRecurringParents === false
                        : hasExpenseRecurringParents === false
                    }
                    onPress={() => {
                      const t = chooseRecurringStep;
                      setChooseRecurringStep(null);
                      if (t === "income")
                        router.push("/add-income-recurring-child");
                      else router.push("/add-expense-recurring-child");
                    }}
                  >
                    Recorrente existente
                  </Button>
                  <Button onPress={() => setChooseRecurringStep(null)}>
                    Voltar
                  </Button>
                </Card.Content>
              </Card>
            </View>
          </>
        )}
      </Portal>
    </View>
  );
}
