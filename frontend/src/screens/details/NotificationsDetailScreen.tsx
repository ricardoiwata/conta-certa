import { dashboardData } from "@/data/dashboard";
import DetailScaffold from "./DetailScaffold";
import React from "react";
import { Card, List, Text } from "react-native-paper";

export default function NotificationsDetailScreen() {
  return (
    <DetailScaffold title="Notificações" description="Gerencie os avisos recebidos recentemente.">
      <Card>
        <Card.Content style={{ gap: 8 }}>
          {dashboardData.notificacoes.map((notificacao) => (
            <List.Item key={notificacao.id} title={notificacao.texto} left={(props) => <List.Icon {...props} icon="bell" />} />
          ))}
        </Card.Content>
      </Card>
      <Text style={{ opacity: 0.6 }}>
        Ajuste as preferências de notificação para receber apenas o que for relevante para o seu dia a dia.
      </Text>
    </DetailScaffold>
  );
}
