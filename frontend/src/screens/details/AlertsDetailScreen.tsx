import { dashboardData } from "@/data/dashboard";
import DetailScaffold from "./DetailScaffold";
import React from "react";
import { Card, List, Text, useTheme } from "react-native-paper";

export default function AlertsDetailScreen() {
  const theme = useTheme();

  return (
    <DetailScaffold title="Alertas" description="Ajuste seus alertas de limite e vencimentos.">
      <Card>
        <Card.Content style={{ gap: 8 }}>
          {dashboardData.alertas.map((alerta) => (
            <List.Item
              key={alerta.id}
              title={alerta.texto}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={alerta.tipo === "warning" ? "alert" : "bell-alert"}
                  color={alerta.tipo === "warning" ? theme.colors.tertiary : theme.colors.error}
                />
              )}
            />
          ))}
        </Card.Content>
      </Card>
      <Text style={{ opacity: 0.6 }}>
        Configure lembretes personalizados para ser avisado quando um limite for atingido ou uma conta
        estiver próxima do vencimento.
      </Text>
    </DetailScaffold>
  );
}
