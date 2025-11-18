import DetailScaffold from "./DetailScaffold";
import { formatCurrency } from "@/utils/formatCurrency";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Card, ProgressBar, Text, useTheme } from "react-native-paper";
import { getDashboardData } from "@/services/dashboard";

export default function CategoriesDetailScreen() {
  const theme = useTheme();
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getDashboardData();
        setCategorias(data.categorias || []);
      } catch (e) {
        console.error("Erro ao carregar categorias:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalCategorias = categorias.reduce((acc, categoria) => acc + categoria.valor, 0) || 1;

  return (
    <DetailScaffold title="Top categorias" description="Veja onde seus gastos se concentram.">
      <Card>
        <Card.Content style={{ gap: 12 }}>
          {categorias.map((categoria) => {
            const progress = categoria.valor / totalCategorias;
            return (
              <View key={categoria.nome} style={{ gap: 4 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text>{categoria.nome}</Text>
                  <Text style={{ opacity: 0.7 }}>{formatCurrency(categoria.valor)}</Text>
                </View>
                <ProgressBar progress={progress} color={theme.colors.error} />
              </View>
            );
          })}
        </Card.Content>
      </Card>
      <Text style={{ opacity: 0.6 }}>
        Mantenha o controle do quanto cada categoria consome do orçamento para evitar surpresas ao fim
        do mês.
      </Text>
    </DetailScaffold>
  );
}
