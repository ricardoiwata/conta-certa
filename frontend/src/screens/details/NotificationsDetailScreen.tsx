import { modernStyles } from "@/styles/modern.styles";
import DetailScaffold from "./DetailScaffold";
import React, { useEffect, useState } from "react";
import { Card, List, Text, useTheme, Badge } from "react-native-paper";
import { View } from "react-native";
import { getDashboardData } from "@/services/dashboard";

export default function NotificationsDetailScreen() {
  const theme = useTheme();
  const [notificacoes, setNotificacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getDashboardData();
        setNotificacoes(data.notificacoes || []);
      } catch (e) {
        console.error("Erro ao carregar notificações:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <DetailScaffold title="Notificações" description="Gerencie os avisos recebidos recentemente.">
      <Card style={modernStyles.modernCard}>
        <Card.Content style={modernStyles.modernCardContent}>
          <View style={[modernStyles.modernRow, { marginBottom: 16 }]}>
            <Text style={[modernStyles.modernTitle, { color: theme.colors.onSurface, fontSize: 16 }]}>
              Todas as notificações
            </Text>
            {notificacoes.length > 0 && (
              <View style={[modernStyles.modernBadge, { backgroundColor: '#FF6B6B' }]}>
                <Text style={modernStyles.modernBadgeText}>
                  {notificacoes.length}
                </Text>
              </View>
            )}
          </View>
          
          {notificacoes.length > 0 ? (
            notificacoes.map((notificacao) => (
              <List.Item 
                key={notificacao.id} 
                title={notificacao.texto}
                titleStyle={{ fontSize: 14, fontWeight: '500' }}
                left={(props) => <List.Icon {...props} icon="bell" color="#FF6B6B" />}
                style={{ paddingHorizontal: 0, marginVertical: 4 }}
              />
            ))
          ) : (
            <Text style={{ 
              opacity: 0.6, 
              textAlign: 'center', 
              paddingVertical: 32,
              fontSize: 16
            }}>
              Nenhuma notificação no momento
            </Text>
          )}
        </Card.Content>
      </Card>
      
      <Text style={{ 
        opacity: 0.6, 
        fontSize: 14,
        lineHeight: 20,
        marginTop: 8
      }}>
        Ajuste as preferências de notificação para receber apenas o que for relevante para o seu dia a dia.
      </Text>
    </DetailScaffold>
  );
}
