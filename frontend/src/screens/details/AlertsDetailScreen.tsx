import DetailScaffold from "./DetailScaffold";
import React, { useEffect, useState } from "react";
import { Card, List, Text, useTheme } from "react-native-paper";
import { getDashboardData } from "@/services/dashboard";

export default function AlertsDetailScreen() {
  const theme = useTheme();
  const [alertas, setAlertas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getDashboardData();
        setAlertas(data.alertas || []);
      } catch (e) {
        console.error("Erro ao carregar alertas:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <DetailScaffold title="Alertas" description="Ajuste seus alertas de limite e vencimentos.">
      <Card>
        <Card.Content style={{ gap: 8 }}>
          {alertas.map((alerta) => (
            <List.Item
              key={alerta.id}
              title={alerta.texto}
              titleNumberOfLines={0}
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
