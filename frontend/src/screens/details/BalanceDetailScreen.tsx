import { dashboardData } from "@/data/dashboard";
import DetailScaffold from "./DetailScaffold";
import { formatCurrency } from "@/utils/formatCurrency";
import React from "react";
import { View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";

export default function BalanceDetailScreen() {
  const theme = useTheme();
  const projecaoSaldoFinal = dashboardData.balance + dashboardData.receitasPendentes - dashboardData.despesasPendentes;

  return (
    <DetailScaffold title="Saldo atual" description="Detalhes do fluxo de caixa previsto para o mês.">
      <Card>
        <Card.Content style={{ gap: 16 }}>
          <View>
            <Text variant="titleSmall" style={{ opacity: 0.7 }}>
              Saldo atual
            </Text>
            <Text variant="displaySmall" style={{ fontWeight: "800" }}>
              {formatCurrency(dashboardData.balance)}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ opacity: 0.7 }}>Receitas pendentes</Text>
              <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: "700" }}>
                {formatCurrency(dashboardData.receitasPendentes)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ opacity: 0.7 }}>Despesas pendentes</Text>
              <Text variant="titleMedium" style={{ color: theme.colors.error, fontWeight: "700" }}>
                {formatCurrency(dashboardData.despesasPendentes)}
              </Text>
            </View>
          </View>
          <View>
            <Text style={{ opacity: 0.7 }}>Projeção de saldo ao fim do mês</Text>
            <Text variant="headlineMedium" style={{ fontWeight: "700" }}>
              {formatCurrency(projecaoSaldoFinal)}
            </Text>
            <Text style={{ opacity: 0.6, marginTop: 4 }}>
              Considerando receitas e despesas já cadastradas para este período.
            </Text>
          </View>
        </Card.Content>
      </Card>
    </DetailScaffold>
  );
}
