import { dashboardData } from "@/data/dashboard";
import DetailScaffold from "./DetailScaffold";
import React, { useMemo, useState } from "react";
import { Dimensions, View } from "react-native";
import { Card, SegmentedButtons, Text, useTheme } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";

const chartHorizontalPadding = 16;
const chartWidth = Dimensions.get("window").width - chartHorizontalPadding * 2;

export default function IncomeVsExpenseDetailScreen() {
  const theme = useTheme();
  const { incomeVsExpenseDetail } = dashboardData;
  const [selectedPeriod, setSelectedPeriod] = useState<string>(
    incomeVsExpenseDetail.defaultPeriod,
  );

  const periodOptions = incomeVsExpenseDetail.periods;

  const activePeriod = useMemo(() => {
    return (
      periodOptions.find((option) => option.id === selectedPeriod) ||
      periodOptions[0]
    );
  }, [periodOptions, selectedPeriod]);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
    [],
  );

  const receitaTotal = useMemo(
    () => activePeriod.receita.reduce((acc, value) => acc + value, 0),
    [activePeriod],
  );

  const despesaTotal = useMemo(
    () => activePeriod.despesa.reduce((acc, value) => acc + value, 0),
    [activePeriod],
  );

  const saldoTotal = useMemo(
    () => receitaTotal - despesaTotal,
    [receitaTotal, despesaTotal],
  );

  const previousReceitaTotal = activePeriod.previousTotals?.receita;
  const previousDespesaTotal = activePeriod.previousTotals?.despesa;
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

  const highestExpenseIndex = useMemo(() => {
    return activePeriod.despesa.reduce((maxIndex, value, index, array) => {
      if (array[maxIndex] >= value) return maxIndex;
      return index;
    }, 0);
  }, [activePeriod]);

  const highestExpenseLabel = activePeriod.labels[highestExpenseIndex];
  const highestExpenseValue = activePeriod.despesa[highestExpenseIndex];

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

  const receitaTrendSentence = buildTrendSentence(
    "As receitas",
    activePeriod.receita[0],
    activePeriod.receita[activePeriod.receita.length - 1],
  );
  const despesaTrendSentence = buildTrendSentence(
    "As despesas",
    activePeriod.despesa[0],
    activePeriod.despesa[activePeriod.despesa.length - 1],
  );

  return (
    <DetailScaffold
      title="Receita x Despesa"
      description="Visualize a evolução mensal do seu orçamento."
    >
      <Card>
        <Card.Content style={{ gap: 16 }}>
          <SegmentedButtons
            value={activePeriod.id}
            onValueChange={(value) => setSelectedPeriod(value)}
            buttons={periodOptions.map((option) => ({
              value: option.id,
              label: option.label,
            }))}
            density="small"
            style={{ alignSelf: "center" }}
          />

          <LineChart
            data={{
              labels: activePeriod.labels,
              datasets: [
                {
                  data: activePeriod.receita,
                  color: () => theme.colors.primary,
                  strokeWidth: 2,
                },
                {
                  data: activePeriod.despesa,
                  color: () => theme.colors.error,
                  strokeWidth: 2,
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
              propsForLabels: { fontSize: 10 },
              propsForDots: { r: "3", strokeWidth: "1.5" },
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
              {["Receitas no período", "Despesas no período", "Saldo acumulado"].map(
                (label, index) => {
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
                    saldoTotal >= 0 ? theme.colors.primary : theme.colors.error,
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
                },
              )}
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <Text variant="titleSmall" style={{ opacity: 0.7 }}>
              Insights rápidos
            </Text>
            <Text>{activePeriod.insight}</Text>
            <Text style={{ opacity: 0.7 }}>
              Maior gasto: {highestExpenseLabel} ({currencyFormatter.format(
                highestExpenseValue,
              )})
            </Text>
            <Text style={{ opacity: 0.7 }}>{receitaTrendSentence}</Text>
            <Text style={{ opacity: 0.7 }}>{despesaTrendSentence}</Text>
          </View>
        </Card.Content>
      </Card>
    </DetailScaffold>
  );
}
