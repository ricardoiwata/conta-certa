import { dashboardData } from "@/data/dashboard";
import DetailScaffold from "./DetailScaffold";
import { formatCurrency } from "@/utils/formatCurrency";
import React from "react";
import { View } from "react-native";
import { Card, List, Text, useTheme } from "react-native-paper";

export default function MonthlySummaryDetailScreen() {
  const theme = useTheme();

  return (
    <DetailScaffold title="Resumo do mês" description="Acompanhe o progresso das receitas e despesas consolidadas.">
      <Card>
        <Card.Content style={{ gap: 16 }}>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ opacity: 0.7 }}>Receitas recebidas</Text>
              <Text variant="headlineSmall" style={{ color: theme.colors.primary, fontWeight: "700" }}>
                {formatCurrency(dashboardData.totalReceitasRecebidas)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ opacity: 0.7 }}>Despesas pagas</Text>
              <Text variant="headlineSmall" style={{ color: theme.colors.error, fontWeight: "700" }}>
                {formatCurrency(dashboardData.totalDespesasPagas)}
              </Text>
            </View>
          </View>
          <View style={{ gap: 8 }}>
            <Text style={{ opacity: 0.7 }}>Resumo rápido</Text>
            <List.Item
              title="Você está com 65% das receitas esperadas já recebidas"
              left={(props) => <List.Icon {...props} icon="trending-up" color={theme.colors.primary} />}
            />
            <List.Item
              title="55% das despesas previstas já foram pagas"
              left={(props) => <List.Icon {...props} icon="trending-down" color={theme.colors.error} />}
            />
          </View>
        </Card.Content>
      </Card>
    </DetailScaffold>
  );
}
