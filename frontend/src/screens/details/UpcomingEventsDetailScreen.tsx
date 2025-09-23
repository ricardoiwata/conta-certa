import { dashboardData } from "@/data/dashboard";
import DetailScaffold from "./DetailScaffold";
import { formatCurrency } from "@/utils/formatCurrency";
import React from "react";
import { Card, List, Text, useTheme } from "react-native-paper";

export default function UpcomingEventsDetailScreen() {
  const theme = useTheme();

  return (
    <DetailScaffold title="Próximos 7 dias" description="Eventos financeiros programados para a próxima semana.">
      <Card>
        <Card.Content style={{ gap: 8 }}>
          {dashboardData.proximos7Dias.map((item) => (
            <List.Item
              key={item.id}
              title={`${item.titulo} · ${formatCurrency(item.valor)}`}
              description={item.data}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={item.tipo === "Receita" ? "cash-plus" : "cash-minus"}
                  color={item.tipo === "Receita" ? theme.colors.primary : theme.colors.error}
                />
              )}
            />
          ))}
        </Card.Content>
      </Card>
      <Text style={{ opacity: 0.7 }}>
        Anote observações, confirme pagamentos e agende lembretes para manter o fluxo em dia.
      </Text>
    </DetailScaffold>
  );
}
