import DetailScaffold from "./DetailScaffold";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Card, List, Text, useTheme } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { getDashboardData } from "@/services/dashboard";

export default function TipDetailScreen() {
  const theme = useTheme();
  const [dica, setDica] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const containerColor = theme.colors.secondaryContainer || theme.colors.elevation?.level1 || theme.colors.surface;
  const onContainerColor = theme.colors.onSecondaryContainer || theme.colors.onSurface;
  const labelBaseColor = theme.colors.onSecondaryContainer || theme.colors.onSurfaceVariant || onContainerColor;
  const labelColor = error ? theme.colors.error : labelBaseColor;
  const titleColor = error ? theme.colors.error : onContainerColor;
  const iconColor = error ? theme.colors.error : onContainerColor;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDashboardData();
        setDica(data.dica || "Mantenha o controle de suas despesas para não ultrapassar o orçamento.");
      } catch (e) {
        console.error("Erro ao carregar dica:", e);
        setError("Não foi possível carregar a dica agora.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return (
    <DetailScaffold title="Dica financeira" description="Insights personalizados para melhorar sua saúde financeira.">
      <Card>
        <Card.Content style={{ gap: 12 }}>
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator />
            </View>
          ) : (
            <List.Item
              title={error ? error : dica}
              titleNumberOfLines={0}
              titleStyle={[styles.tipText, { color: titleColor }]}
              description={error ? "Tente novamente mais tarde" : "Dica do dia"}
              descriptionNumberOfLines={2}
              descriptionStyle={[styles.tipLabel, { color: labelColor }]}
              style={[styles.tipContainer, { backgroundColor: containerColor }]}
              left={() => <List.Icon icon="lightbulb-on-outline" color={iconColor} />}
            />
          )}
        </Card.Content>
      </Card>
      <Text style={{ opacity: 0.6 }}>
        Explore mais recomendações personalizadas e acompanhe como pequenas mudanças de hábito impactam o seu planejamento financeiro.
      </Text>
    </DetailScaffold>
  );
}

const styles = StyleSheet.create({
  loadingRow: {
    alignItems: "center",
    paddingVertical: 12,
  },
  tipContainer: {
    borderRadius: 12,
    paddingRight: 12,
    minHeight: 80,
  },
  tipLabel: {
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontSize: 12,
  },
  tipText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "500",
  },
});
