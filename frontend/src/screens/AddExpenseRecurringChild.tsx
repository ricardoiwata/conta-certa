import React, { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Appbar, Button, HelperText, Menu, Snackbar, Switch, Text, TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/auth/AuthContext";
import { createDespesa, listDespesasRecorrentes } from "@/services/despesas";
import DatePickerModal from "@/components/DatePickerModal";
import { CATEGORIAS_GASTOS } from "@/domain/categorias";

function formatCurrencyMaskBR(input: string) {
  const digits = input.replace(/\D+/g, "");
  const int = digits === "" ? 0 : parseInt(digits, 10);
  const value = (int / 100).toFixed(2);
  const [i, f] = value.split(".");
  const iFmt = i.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `R$ ${iFmt},${f}`;
}

function parseMaskedBRToNumber(masked: string) {
  const digits = masked.replace(/\D+/g, "");
  const int = digits === "" ? 0 : parseInt(digits, 10);
  return int / 100;
}

export default function AddExpenseRecurringChild() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [categoriaOpen, setCategoriaOpen] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [valorMasked, setValorMasked] = useState("R$ 0,00");
  const [data, setData] = useState(() => {
    const dt = new Date();
    const dd = `${dt.getDate()}`.padStart(2, "0");
    const mm = `${dt.getMonth() + 1}`.padStart(2, "0");
    const yyyy = dt.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  });
  const [realizada, setRealizada] = useState(false);

  const [pais, setPais] = useState<Array<any>>([]);
  const [paiOpen, setPaiOpen] = useState(false);
  const [paiId, setPaiId] = useState<number | null>(null);
  const [paiLabel, setPaiLabel] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [snack, setSnack] = useState<string | null>(null);
  const [dpOpen, setDpOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const lista = await listDespesasRecorrentes();
        setPais(lista || []);
      } catch (e: any) {
        setError(e?.message || "Falha ao carregar recorrentes");
      }
    })();
  }, []);

  const disableSubmit = useMemo(
    () => !descricao || !data || categoriaId == null || paiId == null,
    [descricao, data, categoriaId, paiId]
  );

  async function handleSave() {
    try {
      setError(null);
      const v = parseMaskedBRToNumber(valorMasked);
      if (!Number.isFinite(v) || v <= 0) throw new Error("Informe um valor válido (> 0)");
      if (paiId == null) throw new Error("Selecione uma recorrente existente");
      const idUsuario = user?.uid || "";
      await createDespesa({
        descricao,
        valor: v,
        data,
        formaPagamento: "Pix",
        recorrentePai: false,
        recorrentePaiId: paiId,
        realizada: !!realizada,
        usuarioUid: idUsuario,
        categoriaId: categoriaId || 1,
      });
      setSnack("Despesa filha cadastrada!");
      setTimeout(() => router.back(), 600);
    } catch (e: any) {
      setError(e?.message || "Erro ao salvar");
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Despesa (recorrente existente)" />
      </Appbar.Header>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: "padding", android: undefined })}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32, gap: 12 }}>
          <Menu
            visible={paiOpen}
            onDismiss={() => setPaiOpen(false)}
            anchor={<Button mode="outlined" onPress={() => setPaiOpen(true)}>{paiId == null ? "Selecionar recorrente pai" : `Recorrente pai: ${paiLabel || paiId}`}</Button>}
          >
            {pais.map((p) => (
              <Menu.Item key={p.id} onPress={() => { setPaiId(p.id); setPaiLabel(p.descricao || `#${p.id}`); setPaiOpen(false); if (!descricao) setDescricao(p.descricao || ""); }} title={`${p.descricao || "(sem descrição)"}`} />
            ))}
          </Menu>

          <TextInput label="Descrição" value={descricao} onChangeText={setDescricao} mode="outlined" returnKeyType="next" />

          <TextInput
            label="Valor"
            value={valorMasked}
            onChangeText={(t) => setValorMasked(formatCurrencyMaskBR(t))}
            mode="outlined"
            keyboardType="numeric"
            returnKeyType="next"
          />

          <TextInput label="Data" value={data} mode="outlined" right={<TextInput.Icon icon="calendar" onPress={() => setDpOpen(true)} />} editable={false} />

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text>Marcada como realizada</Text>
            <Switch value={realizada} onValueChange={setRealizada} />
          </View>

          <Menu
            visible={categoriaOpen}
            onDismiss={() => setCategoriaOpen(false)}
            anchor={<Button mode="outlined" onPress={() => setCategoriaOpen(true)}>{categoriaId == null ? "Selecionar categoria" : `Categoria: ${CATEGORIAS_GASTOS.find((c) => c.id === categoriaId)?.nome}`}</Button>}
          >
            {CATEGORIAS_GASTOS.map((c) => (
              <Menu.Item key={c.id} onPress={() => { setCategoriaId(c.id); setCategoriaOpen(false); }} title={c.nome} />
            ))}
          </Menu>

          {!!error && (
            <HelperText type="error" visible>
              {error}
            </HelperText>
          )}

          <Button mode="contained" onPress={handleSave} disabled={disableSubmit}>
            Salvar
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>

      <Snackbar visible={!!snack} onDismiss={() => setSnack(null)} duration={2000}>
        {snack}
      </Snackbar>

      <DatePickerModal visible={dpOpen} onDismiss={() => setDpOpen(false)} onConfirm={(iso) => setData(iso)} title="Selecionar data" initialDate={data} />
    </View>
  );
}
