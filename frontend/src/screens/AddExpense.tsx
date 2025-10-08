import React, { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import {
  Appbar,
  Button,
  HelperText,
  Snackbar,
  Switch,
  Text,
  TextInput,
  Menu,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { parseDateFromInput, parseValorFromInput } from "@/domain/Transacao";
import { useAuth } from "@/auth/AuthContext";
import { createDespesa } from "@/services/despesas";
import { CATEGORIAS_GASTOS } from "@/domain/categorias";

export default function AddExpense() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [categoriaOpen, setCategoriaOpen] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [dataCompetencia, setDataCompetencia] = useState("");
  const [ehRecorrente, setEhRecorrente] = useState(false);
  const [observacao, setObservacao] = useState("");
  const [realizada, setRealizada] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [snack, setSnack] = useState<string | null>(null);
  const disableSubmit = useMemo(
    () => !descricao || !valor || !data || categoriaId == null,
    [descricao, valor, data, categoriaId]
  );

  async function handleSave() {
    try {
      setError(null);
      const v = parseValorFromInput(valor);
      const d1 = parseDateFromInput(data);
      if (!Number.isFinite(v) || v <= 0)
        throw new Error("Informe um valor válido (> 0)");
      if (!d1) throw new Error("Data inválida (use AAAA-MM-DD)");

      const idUsuario = user?.uid || "";
      await createDespesa({
        descricao,
        valor: v,
        data: data,
        formaPagamento: "Pix",
        recorrentePai: !!ehRecorrente,
        recorrentePaiId: 0,
        realizada: !!realizada,
        usuarioUid: idUsuario,
        categoriaId: categoriaId || 1,
      });
      setSnack("Despesa cadastrada!");
      setTimeout(() => router.back(), 600);
    } catch (e: any) {
      setError(e?.message || "Erro ao salvar");
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Nova Despesa" />
      </Appbar.Header>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <ScrollView
          contentContainerStyle={{
            padding: 16,
            paddingBottom: insets.bottom + 32,
            gap: 12,
          }}
        >
          <TextInput
            label="Descrição"
            value={descricao}
            onChangeText={setDescricao}
            mode="outlined"
            returnKeyType="next"
          />
          <HelperText type="info">
            Ex.: Mercado, transporte, moradia…
          </HelperText>

          <TextInput
            label="Valor"
            value={valor}
            onChangeText={setValor}
            mode="outlined"
            keyboardType="decimal-pad"
            returnKeyType="next"
          />
          <HelperText type="info">Use ponto ou vírgula. Ex.: 89,90</HelperText>

          <TextInput
            label="Data (AAAA-MM-DD)"
            value={data}
            onChangeText={setData}
            mode="outlined"
            returnKeyType="next"
          />
          <TextInput
            label="Competência (AAAA-MM-DD)"
            value={dataCompetencia}
            onChangeText={setDataCompetencia}
            mode="outlined"
            returnKeyType="next"
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text>É recorrente?</Text>
            <Switch value={ehRecorrente} onValueChange={setEhRecorrente} />
          </View>

          <TextInput
            label="Observação (opcional)"
            value={observacao}
            onChangeText={setObservacao}
            mode="outlined"
            multiline
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text>Marcada como realizada</Text>
            <Switch value={realizada} onValueChange={setRealizada} />
          </View>

          <Menu
            visible={categoriaOpen}
            onDismiss={() => setCategoriaOpen(false)}
            anchor={
              <Button mode="outlined" onPress={() => setCategoriaOpen(true)}>
                {categoriaId == null
                  ? "Selecionar categoria (gasto)"
                  : `Categoria: ${
                      CATEGORIAS_GASTOS.find((c) => c.id === categoriaId)?.nome
                    }`}
              </Button>
            }
          >
            {CATEGORIAS_GASTOS.map((c) => (
              <Menu.Item
                key={c.id}
                onPress={() => {
                  setCategoriaId(c.id);
                  setCategoriaOpen(false);
                }}
                title={c.nome}
              />
            ))}
          </Menu>
          <HelperText type="info">
            Categorias de gastos (pré-definidas)
          </HelperText>

          {!!error && (
            <HelperText type="error" visible>
              {error}
            </HelperText>
          )}

          <Button
            mode="contained"
            onPress={handleSave}
            disabled={disableSubmit}
          >
            Salvar
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>

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
