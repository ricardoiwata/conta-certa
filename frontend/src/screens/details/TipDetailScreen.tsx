import { dashboardData } from "@/data/dashboard";
import DetailScaffold from "./DetailScaffold";
import React from "react";
import { Card, List, Text } from "react-native-paper";

export default function TipDetailScreen() {
  return (
    <DetailScaffold title="Dica financeira" description="Insights personalizados para melhorar sua saúde financeira.">
      <Card>
        <Card.Content style={{ gap: 12 }}>
          <List.Item
            title={dashboardData.dica}
            left={(props) => <List.Icon {...props} icon="lightbulb-on-outline" />}
          />
        </Card.Content>
      </Card>
      <Text style={{ opacity: 0.6 }}>
        Explore mais recomendações personalizadas e acompanhe como pequenas mudanças de hábito impactam o seu planejamento financeiro.
      </Text>
    </DetailScaffold>
  );
}
