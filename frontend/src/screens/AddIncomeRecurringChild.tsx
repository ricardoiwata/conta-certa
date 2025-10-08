import React, { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Appbar, Button, HelperText, Menu, Snackbar, Switch, Text, TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/auth/AuthContext";
import { createReceita, listReceitasRecorrentes } from "@/services/receitas";
import DatePickerModal from "@/components/DatePickerModal";

function todayBR() {
  const dt = new Date();
  const dd = `${dt.getDate()}`.padStart(2, "0");
  const mm = `${dt.getMonth() + 1}`.padStart(2, "0");
  const yyyy = dt.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

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

export default function AddIncomeRecurringChild() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [descricao, setDescricao] = useState("");
  const [valorMasked, setValorMasked] = useState("R$ 0,00");
  const [data, setData] = useState(todayBR());
  const [dataCompetencia, setDataCompetencia] = useState(todayBR());
  const [realizada, setRealizada] = useState(false);

  const [pais, setPais] = useState<Array<any>>([]);
  const [paiOpen, setPaiOpen] = useState(false);
  const [paiId, setPaiId] = useState<number | null>(null);
  const [paiLabel, setPaiLabel] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [snack, setSnack] = useState<string | null>(null);
  const [dp1Open, setDp1Open] = useState(false);
  const [dp2Open, setDp2Open] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const lista = await listReceitasRecorrentes();
        setPais(lista || []);
      } catch (e: any) {
        setError(e?.message || "Falha ao carregar recorrentes");
      }
    })();
  }, []);

  const disableSubmit = useMemo(
    () => !descricao || !data || !dataCompetencia || paiId == null,
    [descricao, data, dataCompetencia, paiId]
  );

  async function handleSave() {
    try {
      setError(null);
      const v = parseMaskedBRToNumber(valorMasked);
      if (!Number.isFinite(v) || v <= 0) throw new Error("Informe um valor válido (> 0)");
      if (paiId == null) throw new Error("Selecione uma recorrente existente");

      const idUsuario = user?.uid || "";
      await createReceita({
        descricao,
        valor: v,
        data,
        dataCompetencia,
        origem: "Fixo",
        recorrentePai: false,
        recorrentePaiId: paiId,
        realizada: !!realizada,
        usuarioUid: idUsuario,
      });
      setSnack("Receita filha cadastrada!");
      setTimeout(() => router.back(), 600);
    } catch (e: any) {
      setError(e?.message || "Erro ao salvar");
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Receita (recorrente existente)" />
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

          <TextInput label="Data" value={data} mode="outlined" right={<TextInput.Icon icon="calendar" onPress={() => setDp1Open(true)} />} editable={false} />
          <TextInput label="Competência" value={dataCompetencia} mode="outlined" right={<TextInput.Icon icon="calendar" onPress={() => setDp2Open(true)} />} editable={false} />

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text>Marcada como realizada</Text>
            <Switch value={realizada} onValueChange={setRealizada} />
          </View>

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

      <DatePickerModal visible={dp1Open} onDismiss={() => setDp1Open(false)} onConfirm={(iso) => setData(iso)} title="Selecionar data" initialDate={data} />
      <DatePickerModal visible={dp2Open} onDismiss={() => setDp2Open(false)} onConfirm={(iso) => setDataCompetencia(iso)} title="Selecionar competência" initialDate={dataCompetencia} />
    </View>
  );
}
