import DetailScaffold from "./DetailScaffold";
import { formatCurrency } from "@/utils/formatCurrency";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import {
  Card,
  List,
  Text,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";
import { listReceitas } from "@/services/receitas";
import { listDespesas } from "@/services/despesas";

export default function MonthlySummaryDetailScreen() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [receitas, setReceitas] = useState<any[]>([]);
  const [despesas, setDespesas] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        setLoading(true);
        const [r, d] = await Promise.all([listReceitas(), listDespesas()]);
        setReceitas(r || []);
        setDespesas(d || []);
      } catch (e: any) {
        setError(e?.message || "Falha ao carregar resumo");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalReceitasRecebidas = receitas
    .filter((x) => x.realizada)
    .reduce((acc, x) => acc + Number(x.valor || 0), 0);
  const totalDespesasPagas = despesas
    .filter((x) => x.realizada)
    .reduce((acc, x) => acc + Number(x.valor || 0), 0);

  return (
    <DetailScaffold
      title="Resumo do mês"
      description="Acompanhe o progresso das receitas e despesas consolidadas."
    >
      <Card>
        <Card.Content style={{ gap: 16 }}>
          {loading ? (
            <View style={{ padding: 16, alignItems: "center" }}>
              <ActivityIndicator />
              {!!error && <Text style={{ marginTop: 8 }}>{error}</Text>}
            </View>
          ) : (
            <>
              <View style={{ flexDirection: "row", gap: 16 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ opacity: 0.7 }}>Receitas recebidas</Text>
                  <Text
                    variant="headlineSmall"
                    style={{ color: theme.colors.primary, fontWeight: "700" }}
                  >
                    {formatCurrency(totalReceitasRecebidas)}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ opacity: 0.7 }}>Despesas pagas</Text>
                  <Text
                    variant="headlineSmall"
                    style={{ color: theme.colors.error, fontWeight: "700" }}
                  >
                    {formatCurrency(totalDespesasPagas)}
                  </Text>
                </View>
              </View>

              <View style={{ gap: 8 }}>
                <Text style={{ opacity: 0.7 }}>Receitas</Text>
                {receitas.length === 0 ? (
                  <Text style={{ opacity: 0.6 }}>
                    Nenhuma receita encontrada.
                  </Text>
                ) : (
                  receitas.map((r) => (
                    <List.Item
                      key={`r-${r.id}`}
                      title={r.descricao}
                      description={new Date(r.data).toLocaleDateString("pt-BR")}
                      left={(props) => (
                        <List.Icon
                          {...props}
                          icon="cash-plus"
                          color={theme.colors.primary}
                        />
                      )}
                      right={() => (
                        <Text
                          style={{
                            fontWeight: "700",
                            color: theme.colors.primary,
                          }}
                        >
                          {formatCurrency(Number(r.valor || 0))}
                        </Text>
                      )}
                    />
                  ))
                )}
              </View>

              <View style={{ gap: 8 }}>
                <Text style={{ opacity: 0.7 }}>Despesas</Text>
                {despesas.length === 0 ? (
                  <Text style={{ opacity: 0.6 }}>
                    Nenhuma despesa encontrada.
                  </Text>
                ) : (
                  despesas.map((r) => (
                    <List.Item
                      key={`d-${r.id}`}
                      title={r.descricao}
                      description={new Date(r.data).toLocaleDateString("pt-BR")}
                      left={(props) => (
                        <List.Icon
                          {...props}
                          icon="cash-minus"
                          color={theme.colors.error}
                        />
                      )}
                      right={() => (
                        <Text
                          style={{
                            fontWeight: "700",
                            color: theme.colors.error,
                          }}
                        >
                          {formatCurrency(Number(r.valor || 0))}
                        </Text>
                      )}
                    />
                  ))
                )}
              </View>
            </>
          )}
        </Card.Content>
      </Card>
    </DetailScaffold>
  );
}
