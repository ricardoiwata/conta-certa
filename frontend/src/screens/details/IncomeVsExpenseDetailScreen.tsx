import DetailScaffold from "./DetailScaffold";
import React, { useMemo, useState } from "react";
import { Dimensions, LayoutChangeEvent, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Card,
  SegmentedButtons,
  Text,
  useTheme,
} from "react-native-paper";
import { LineChart } from "react-native-chart-kit";
import { useFocusEffect } from "@react-navigation/native";
import { dashboardData } from "@/data/dashboard";
import {
  getIncomeVsExpenseDetail,
  type IncomeVsExpenseDetail,
} from "@/services/dashboard";

const chartHorizontalPadding = 16;
const cardPadding = 16; // Padding interno do Card.Content

const fallbackIncomeVsExpenseDetail: IncomeVsExpenseDetail =
  dashboardData.incomeVsExpenseDetail ?? {
    defaultPeriod: "6m",
    periods: [],
  };

export default function IncomeVsExpenseDetailScreen() {
  const theme = useTheme();
  const [detail, setDetail] = useState<IncomeVsExpenseDetail | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>(
    fallbackIncomeVsExpenseDetail.defaultPeriod,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartWidth, setChartWidth] = useState(() =>
    Math.max(
      220,
      Dimensions.get("window").width - chartHorizontalPadding * 2 - cardPadding * 2 - 12,
    ),
  );

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      (async () => {
        try {
          setError(null);
          setLoading(true);
          const response = await getIncomeVsExpenseDetail();
          if (!isActive) return;
          setDetail(response);
          setSelectedPeriod(response.defaultPeriod);
        } catch (e: any) {
          if (!isActive) return;
          setError(e?.message || "Falha ao carregar gráfico");
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      })();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const dataset: IncomeVsExpenseDetail = detail ?? fallbackIncomeVsExpenseDetail;
  const periodOptions = dataset?.periods ?? [];

  const activePeriod = useMemo(() => {
    if (!periodOptions.length) return null;
    return (
      periodOptions.find((option) => option.id === selectedPeriod) ||
      periodOptions[0]
    );
  }, [periodOptions, selectedPeriod]);

  const chartLabels = useMemo(() => {
    if (!activePeriod) return [];
    if (activePeriod.labels.length <= 6) {
      return activePeriod.labels;
    }
    return activePeriod.labels.map((label, index) => (index % 2 === 0 ? label : " "));
  }, [activePeriod]);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
    [],
  );

  const receitaTotal = useMemo(() => {
    if (!activePeriod) return 0;
    return activePeriod.receita.reduce((acc, value) => acc + value, 0);
  }, [activePeriod]);

  const despesaTotal = useMemo(() => {
    if (!activePeriod) return 0;
    return activePeriod.despesa.reduce((acc, value) => acc + value, 0);
  }, [activePeriod]);

  const saldoTotal = useMemo(
    () => receitaTotal - despesaTotal,
    [receitaTotal, despesaTotal],
  );

  const previousReceitaTotal = activePeriod?.previousTotals?.receita;
  const previousDespesaTotal = activePeriod?.previousTotals?.despesa;
  const previousSaldoTotal =
    previousReceitaTotal !== undefined && previousDespesaTotal !== undefined
      ? previousReceitaTotal - previousDespesaTotal
      : undefined;

  const formatComparison = (current: number, previous?: number) => {
    if (!previous || previous === 0) return "Sem histórico comparável";
    const variation = (current - previous) / previous;
    const percentage = (variation * 100).toFixed(1);
    const prefix = variation > 0 ? "+" : "";
    return `${prefix}${percentage}% vs período anterior`;
  };

  const receitaComparisonText = formatComparison(
    receitaTotal,
    previousReceitaTotal,
  );
  const despesaComparisonText = formatComparison(
    despesaTotal,
    previousDespesaTotal,
  );
  const saldoComparisonText = formatComparison(saldoTotal, previousSaldoTotal);

  const highestExpenseInfo = useMemo(() => {
    if (!activePeriod || activePeriod.despesa.length === 0) {
      return { label: "-", value: 0 };
    }
    const index = activePeriod.despesa.reduce((maxIndex, value, currentIndex, array) => {
      if (array[maxIndex] >= value) return maxIndex;
      return currentIndex;
    }, 0);
    return {
      label: activePeriod.labels[index] ?? "-",
      value: activePeriod.despesa[index] ?? 0,
    };
  }, [activePeriod]);

  const buildTrendSentence = (
    label: string,
    firstValue: number,
    lastValue: number,
  ) => {
    const difference = lastValue - firstValue;
    if (Math.abs(difference) < 1) {
      return `${label} mantiveram-se estáveis ao longo do período.`;
    }
    const direction = difference > 0 ? "aumentaram" : "diminuíram";
    const base = firstValue !== 0 ? Math.abs((difference / firstValue) * 100) : 0;
    const percentageText = base > 0 ? ` em ${base.toFixed(1)}%` : "";
    return `${label} ${direction}${percentageText} do início ao fim do período.`;
  };

  const receitaTrendSentence = activePeriod
    ? buildTrendSentence(
        "As receitas",
        activePeriod.receita[0] ?? 0,
        activePeriod.receita[activePeriod.receita.length - 1] ?? 0,
      )
    : "Sem dados de tendência para receitas.";

  const despesaTrendSentence = activePeriod
    ? buildTrendSentence(
        "As despesas",
        activePeriod.despesa[0] ?? 0,
        activePeriod.despesa[activePeriod.despesa.length - 1] ?? 0,
      )
    : "Sem dados de tendência para despesas.";

  const handleChartLayout = React.useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      const width = nativeEvent.layout.width;
      if (width <= 0) return;
      const nextWidth = Math.max(220, width - 8);
      setChartWidth((previous) => (Math.abs(previous - nextWidth) < 1 ? previous : nextWidth));
    },
    [],
  );

  return (
    <DetailScaffold
      title="Receita x Despesa"
      description="Visualize a evolução mensal do seu orçamento."
    >
      <Card>
        <Card.Content style={{ gap: 16 }}>
          {loading && (
            <View style={{ alignItems: "center", paddingVertical: 8 }}>
              <ActivityIndicator />
            </View>
          )}

          {!!error && (
            <Text style={{ textAlign: "center", color: theme.colors.error }}>
              {error}. Exibindo dados de referência.
            </Text>
          )}

          {periodOptions.length > 0 ? (
            <>
              <SegmentedButtons
                value={activePeriod?.id ?? selectedPeriod}
                onValueChange={(value) => setSelectedPeriod(value)}
                buttons={periodOptions.map((option) => ({
                  value: option.id,
                  label: option.label,
                  style: styles.segmentedButton,
                  labelStyle: styles.segmentedButtonLabel,
                }))}
                density="small"
                style={styles.segmentedGroup}
              />

              {activePeriod ? (
                <>
                  <View style={{ width: "100%", marginTop: 4 }} onLayout={handleChartLayout}>
                    <LineChart
                      data={{
                        labels: chartLabels,
                        datasets: [
                          {
                            data: [...activePeriod.receita],
                            color: () => theme.colors.primary,
                            strokeWidth: 3,
                          },
                          {
                            data: [...activePeriod.despesa],
                            color: () => theme.colors.error,
                            strokeWidth: 3,
                          },
                        ],
                        legend: ["Receita", "Despesa"],
                      }}
                      width={chartWidth}
                      height={220}
                      yAxisLabel="R$ "
                      chartConfig={{
                        backgroundColor: theme.colors.surface,
                        backgroundGradientFrom: theme.colors.surface,
                        backgroundGradientTo: theme.colors.surface,
                        decimalPlaces: 0,
                        color: () => theme.colors.onSurface,
                        labelColor: () => theme.colors.onSurface,
                        propsForLabels: {
                          fontSize: 12,
                          fontWeight: "600",
                          fontFamily: "System",
                          fill: theme.colors.onSurface,
                        },
                        propsForDots: { r: "4", strokeWidth: "2" },
                        propsForBackgroundLines: {
                          stroke: theme.colors.outline + "40",
                          strokeDasharray: "2 4",
                        },
                        useShadowColorFromDataset: false,
                      }}
                      bezier
                      withShadow={false}
                      withVerticalLines={false}
                      withHorizontalLines
                      withInnerLines={false}
                      withOuterLines={false}
                      style={{ borderRadius: 8, marginVertical: 8 }}
                    />
                  </View>

                  <View style={{ gap: 12 }}>
                    <Text variant="titleSmall" style={{ opacity: 0.7 }}>
                      Resumo do período
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 12,
                      }}
                    >
                      {[
                        "Receitas no período",
                        "Despesas no período",
                        "Saldo acumulado",
                      ].map((label, index) => {
                        const value = [
                          currencyFormatter.format(receitaTotal),
                          currencyFormatter.format(despesaTotal),
                          currencyFormatter.format(saldoTotal),
                        ][index];
                        const comparison = [
                          receitaComparisonText,
                          despesaComparisonText,
                          saldoComparisonText,
                        ][index];
                        const color = [
                          theme.colors.primary,
                          theme.colors.error,
                          saldoTotal >= 0
                            ? theme.colors.primary
                            : theme.colors.error,
                        ][index];

                        return (
                          <View
                            key={label}
                            style={{
                              flexBasis: "48%",
                              flexGrow: 1,
                              padding: 12,
                              borderRadius: 12,
                              backgroundColor: theme.colors.elevation.level1,
                              gap: 4,
                            }}
                          >
                            <Text style={{ opacity: 0.7 }}>{label}</Text>
                            <Text
                              variant="titleMedium"
                              style={{ fontWeight: "700", color }}
                            >
                              {value}
                            </Text>
                            <Text style={{ opacity: 0.6 }}>{comparison}</Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>

                  <View style={{ gap: 8 }}>
                    <Text variant="titleSmall" style={{ opacity: 0.7 }}>
                      Insights rápidos
                    </Text>
                    <Text>{activePeriod.insight}</Text>
                    <Text style={{ opacity: 0.7 }}>
                      Maior gasto: {highestExpenseInfo.label} (
                      {currencyFormatter.format(highestExpenseInfo.value)})
                    </Text>
                    <Text style={{ opacity: 0.7 }}>{receitaTrendSentence}</Text>
                    <Text style={{ opacity: 0.7 }}>{despesaTrendSentence}</Text>
                  </View>
                </>
              ) : (
                <Text style={{ textAlign: "center", opacity: 0.6 }}>
                  Nenhum dado disponível para exibir.
                </Text>
              )}
            </>
          ) : (
            <Text style={{ textAlign: "center", opacity: 0.6 }}>
              Nenhum dado disponível para exibir.
            </Text>
          )}
        </Card.Content>
      </Card>
    </DetailScaffold>
  );
}

const styles = StyleSheet.create({
  segmentedGroup: {
    alignSelf: "stretch",
    marginHorizontal: 4,
  },
  segmentedButton: {
    flex: 1,
    minWidth: 0,
  },
  segmentedButtonLabel: {
    fontSize: 12,
  },
});
