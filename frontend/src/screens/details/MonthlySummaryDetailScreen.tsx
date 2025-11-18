import DetailScaffold from "./DetailScaffold";
import { formatCurrency } from "@/utils/formatCurrency";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Card,
  Chip,
  Icon,
  IconButton,
  Text,
  useTheme,
} from "react-native-paper";
import { listReceitas, marcarReceitaRealizada } from "@/services/receitas";
import { listDespesas, marcarDespesaRealizada } from "@/services/despesas";

function parseDate(value: any): Date | null {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) return parsed;

  if (typeof value === "string" && value.includes("/")) {
    const [day, month, year] = value.split("/").map(Number);
    if (day && month && year) {
      const date = new Date(year, month - 1, day);
      return Number.isNaN(date.getTime()) ? null : date;
    }
  }

  return null;
}

function formatDateLabel(value: any): string {
  const date = parseDate(value);
  if (!date) return "Data indisponível";
  return date.toLocaleDateString("pt-BR");
}

export default function MonthlySummaryDetailScreen() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [receitas, setReceitas] = useState<any[]>([]);
  const [despesas, setDespesas] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchData();
  }, []);

  async function fetchData(options: { showSpinner?: boolean } = {}) {
    const { showSpinner = true } = options;

    try {
      setError(null);
      if (showSpinner) {
        setLoading(true);
      }

      const [receitasResponse, despesasResponse] = await Promise.all([
        listReceitas(),
        listDespesas(),
      ]);

      setReceitas(receitasResponse || []);
      setDespesas(despesasResponse || []);
    } catch (e: any) {
      setError(e?.message || "Falha ao carregar resumo");
    } finally {
      if (showSpinner) {
        setLoading(false);
      }
    }
  }

  async function handleToggleReceita(id: number, atual: boolean) {
    try {
      setMutating(true);
      await marcarReceitaRealizada(id, !atual);
      await fetchData({ showSpinner: false });
    } catch (e: any) {
      setError(e?.message || "Falha ao atualizar receita");
    } finally {
      setMutating(false);
    }
  }

  async function handleToggleDespesa(id: number, atual: boolean) {
    try {
      setMutating(true);
      await marcarDespesaRealizada(id, !atual);
      await fetchData({ showSpinner: false });
    } catch (e: any) {
      setError(e?.message || "Falha ao atualizar despesa");
    } finally {
      setMutating(false);
    }
  }

  const now = useMemo(() => new Date(), []);
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const receitasDoMes = useMemo(
    () =>
      receitas.filter((item) => {
        const date = parseDate(item.data);
        return date && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      }),
    [receitas, currentMonth, currentYear],
  );

  const despesasDoMes = useMemo(
    () =>
      despesas.filter((item) => {
        const date = parseDate(item.data);
        return date && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      }),
    [despesas, currentMonth, currentYear],
  );

  const totalReceitasRecebidas = receitasDoMes
    .filter((item) => item.realizada)
    .reduce((acc, item) => acc + Number(item.valor || 0), 0);
  const totalDespesasPagas = despesasDoMes
    .filter((item) => item.realizada)
    .reduce((acc, item) => acc + Number(item.valor || 0), 0);

  return (
    <DetailScaffold
      title="Resumo do mês"
      description="Acompanhe o progresso das receitas e despesas consolidadas."
    >
      <Card mode="contained" style={styles.wrapperCard}>
        <Card.Content style={styles.detailContent}>
          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator />
              {!!error && <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>}
            </View>
          ) : (
            <>
              {!!error && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
              )}

              <View style={styles.summaryRow}>
                <Card
                  mode="contained"
                  style={[styles.summaryCard, { backgroundColor: theme.colors.primaryContainer }]}
                >
                  <Card.Content style={styles.summaryContent}>
                    <View style={[styles.summaryIcon, { backgroundColor: theme.colors.primary }]}>
                      <Icon source="cash-plus" size={18} color={theme.colors.onPrimary} />
                    </View>
                    <View style={styles.summaryTextBlock}>
                      <Text
                        style={[styles.summaryLabel, { color: theme.colors.onPrimaryContainer }]}
                      >
                        Receitas recebidas
                      </Text>
                      <Text
                        style={[styles.summaryValue, { color: theme.colors.onPrimaryContainer }]}
                      >
                        {formatCurrency(totalReceitasRecebidas)}
                      </Text>
                    </View>
                  </Card.Content>
                </Card>

                <Card
                  mode="contained"
                  style={[styles.summaryCard, { backgroundColor: theme.colors.errorContainer }]}
                >
                  <Card.Content style={[styles.summaryContent, styles.summaryContentCentered]}>
                    <View style={[styles.summaryIcon, { backgroundColor: theme.colors.error }]}> 
                      <Icon source="cash-minus" size={18} color={theme.colors.onError} />
                    </View>
                    <View style={[styles.summaryTextBlock, styles.summaryTextBlockCentered]}>
                      <Text
                        style={[styles.summaryLabel, styles.summaryLabelCentered, { color: theme.colors.onErrorContainer }]}
                      >
                        Despesas pagas
                      </Text>
                      <Text
                        style={[styles.summaryValue, styles.summaryValueCentered, { color: theme.colors.onErrorContainer }]}
                      >
                        {formatCurrency(totalDespesasPagas)}
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Receitas do mês</Text>
                {receitasDoMes.length === 0 ? (
                  <Text style={styles.emptyText}>Nenhuma receita encontrada.</Text>
                ) : (
                  receitasDoMes.map((item) => (
                    <FinanceItemCard
                      key={`r-${item.id}`}
                      item={item}
                      isIncome
                      onToggle={handleToggleReceita}
                      disabled={mutating}
                    />
                  ))
                )}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Despesas do mês</Text>
                {despesasDoMes.length === 0 ? (
                  <Text style={styles.emptyText}>Nenhuma despesa encontrada.</Text>
                ) : (
                  despesasDoMes.map((item) => (
                    <FinanceItemCard
                      key={`d-${item.id}`}
                      item={item}
                      isIncome={false}
                      onToggle={handleToggleDespesa}
                      disabled={mutating}
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

type FinanceItemCardProps = {
  item: any;
  isIncome: boolean;
  onToggle: (id: number, atual: boolean) => void;
  disabled: boolean;
};

function FinanceItemCard({ item, isIncome, onToggle, disabled }: FinanceItemCardProps) {
  const theme = useTheme();
  const realized = !!item.realizada;

  const containerColor = isIncome
    ? theme.colors.primaryContainer
    : theme.colors.secondaryContainer ?? theme.colors.surfaceVariant ?? theme.colors.surface;
  const onContainerColor = isIncome
    ? theme.colors.onPrimaryContainer
    : theme.colors.onSecondaryContainer ?? theme.colors.onSurface;
  const accentColor = isIncome ? theme.colors.primary : theme.colors.error;
  const pendingBackground = theme.colors.secondaryContainer ?? theme.colors.surfaceVariant ?? theme.colors.surface;
  const pendingTextColor = theme.colors.onSecondaryContainer ?? theme.colors.onSurface;

  const statusLabel = realized ? (isIncome ? "Recebido" : "Pago") : "Pendente";
  const statusBackground = realized ? accentColor : pendingBackground;
  const statusTextColor = realized
    ? isIncome
      ? theme.colors.onPrimary
      : theme.colors.onError
    : pendingTextColor;

  const iconName = isIncome ? "arrow-down-bold-circle" : "arrow-up-bold-circle";
  const toggleIcon = realized ? "check-circle" : "clock-outline";

  return (
    <Card
      mode="contained"
      style={[
        styles.itemCard,
        {
          backgroundColor: containerColor,
          borderColor: realized ? accentColor : theme.colors.outlineVariant ?? theme.colors.outline,
        },
        disabled && styles.itemCardDisabled,
      ]}
      onPress={() => !disabled && onToggle(item.id, realized)}
    >
      <Card.Content style={styles.itemCardContent}>
        <View style={styles.itemInfo}>
          <View style={styles.itemHeaderRow}>
            <View style={[styles.iconBubble, { backgroundColor: accentColor }]}>
              <Icon source={iconName} size={18} color={theme.colors.onPrimary} />
            </View>
            <Text style={[styles.itemTitle, { color: onContainerColor }]} numberOfLines={1}>
              {item.descricao}
            </Text>
          </View>
          <Text style={[styles.itemDate, { color: onContainerColor }]}>
            {formatDateLabel(item.data)}
          </Text>
        </View>

        <View style={styles.itemMeta}>
          <Text style={[styles.itemValue, { color: accentColor }]}>
            {formatCurrency(Number(item.valor || 0))}
          </Text>
          <Chip
            mode="flat"
            compact
            style={[styles.statusChip, { backgroundColor: statusBackground }]}
            textStyle={[styles.statusChipText, { color: statusTextColor }]}
          >
            {statusLabel}
          </Chip>
          <IconButton
            icon={toggleIcon}
            size={20}
            mode="contained-tonal"
            onPress={() => onToggle(item.id, realized)}
            disabled={disabled}
          />
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  wrapperCard: {
    borderRadius: 24,
  },
  detailContent: {
    gap: 20,
  },
  loadingBox: {
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  errorText: {
    fontWeight: "600",
    textAlign: "center",
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 20,
  },
  summaryContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  summaryContentCentered: {
    justifyContent: "center",
  },
  summaryIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryTextBlock: {
    flex: 1,
    gap: 4,
  },
  summaryTextBlockCentered: {
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    opacity: 0.9,
  },
  summaryLabelCentered: {
    textAlign: "center",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "700",
  },
  summaryValueCentered: {
    textAlign: "center",
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  emptyText: {
    opacity: 0.6,
    fontStyle: "italic",
  },
  itemCard: {
    borderRadius: 18,
    borderWidth: 1,
  },
  itemCardDisabled: {
    opacity: 0.75,
  },
  itemCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  itemInfo: {
    flex: 1,
    gap: 6,
  },
  itemHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBubble: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: "700",
  },
  itemDate: {
    fontSize: 11,
    opacity: 0.7,
  },
  itemMeta: {
    alignItems: "flex-end",
    gap: 6,
  },
  itemValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  statusChip: {
    borderRadius: 18,
  },
  statusChipText: {
    fontWeight: "700",
    fontSize: 10,
  },
});
