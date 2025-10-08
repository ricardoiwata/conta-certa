import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import {
  Appbar,
  List,
  Text,
  ActivityIndicator,
  Snackbar,
  useTheme,
  IconButton,
  Button,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  listReceitas,
  marcarReceitaRealizada,
  deleteReceita,
} from "@/services/receitas";
import { formatCurrency } from "@/utils/formatCurrency";

type Receita = {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  realizada: boolean;
};

export default function ReceitasList() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snack, setSnack] = useState<string | null>(null);
  const [items, setItems] = useState<Receita[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    try {
      setError(null);
      setLoading(true);
      const data = await listReceitas();
      setItems(
        (data || []).map((r: any) => ({
          id: r.id,
          descricao: r.descricao,
          valor: Number(r.valor),
          data: r.data,
          realizada: !!r.realizada,
        }))
      );
    } catch (e: any) {
      setError(e?.message || "Falha ao carregar receitas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  async function toggleRealizada(id: number, current: boolean) {
    try {
      await marcarReceitaRealizada(id, !current);
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, realizada: !current } : it))
      );
    } catch (e: any) {
      setSnack(e?.message || "Erro ao atualizar");
    }
  }

  async function remove(id: number) {
    try {
      await deleteReceita(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
      setSnack("Receita removida");
    } catch (e: any) {
      setSnack(e?.message || "Erro ao remover");
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Receitas" />
        <Appbar.Action icon="plus" onPress={() => router.push("/add-income")} />
      </Appbar.Header>

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator />
          {!!error && <Text style={{ marginTop: 8 }}>{error}</Text>}
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            padding: 12,
            paddingBottom: insets.bottom + 24,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {items.length === 0 ? (
            <View style={{ marginTop: 24, alignItems: "center", gap: 12 }}>
              <Text style={{ opacity: 0.7 }}>Nenhuma receita encontrada.</Text>
              <Button
                mode="contained"
                onPress={() => router.push("/add-income")}
              >
                Adicionar receita
              </Button>
            </View>
          ) : (
            items.map((r) => (
              <List.Item
                key={r.id}
                title={r.descricao}
                description={new Date(r.data).toLocaleDateString("pt-BR")}
                right={() => (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        marginRight: 8,
                        fontWeight: "700",
                        color: theme.colors.primary,
                      }}
                    >
                      {formatCurrency(r.valor)}
                    </Text>
                    <IconButton
                      icon={
                        r.realizada
                          ? "check-circle"
                          : "checkbox-blank-circle-outline"
                      }
                      onPress={() => toggleRealizada(r.id, r.realizada)}
                      accessibilityLabel="Alternar realizada"
                    />
                    <IconButton
                      icon="delete"
                      onPress={() => remove(r.id)}
                      accessibilityLabel="Remover"
                    />
                  </View>
                )}
              />
            ))
          )}
        </ScrollView>
      )}

      <Snackbar
        visible={!!snack}
        onDismiss={() => setSnack(null)}
        duration={2000}
      >
        {snack}
      </Snackbar>
    </View>
  );
}
