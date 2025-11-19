import React, { useMemo, useState } from "react";
import { View, Pressable } from "react-native";
import { Portal, Dialog, Button, Text, useTheme, IconButton } from "react-native-paper";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: (dateBR: string) => void;
  initialDate?: string; // dd/mm/yyyy or ISO
  title?: string;
};

function toISO(date: Date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function toBR(date: Date) {
  const d = `${date.getDate()}`.padStart(2, "0");
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

function parseInitial(dateStr?: string): Date | null {
  if (!dateStr) return null;
  try {
    if (dateStr.includes("/")) {
      const [dd, mm, yyyy] = dateStr.split("/");
      const dt = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      return isNaN(dt.getTime()) ? null : dt;
    }
    const dt = new Date(dateStr);
    return isNaN(dt.getTime()) ? null : dt;
  } catch {
    return null;
  }
}

export default function DatePickerModal({ visible, onDismiss, onConfirm, initialDate, title }: Props) {
  const theme = useTheme();
  const [cursor, setCursor] = useState(() => {
    const init = parseInitial(initialDate);
    const base = init || new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const [selected, setSelected] = useState<string | null>(() => {
    const init = parseInitial(initialDate);
    return init ? toISO(init) : null;
  });

  const days = useMemo(() => {
    const firstDay = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const lastDay = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    const firstWeekday = (firstDay.getDay() + 6) % 7; // week starts Mon
    const total = firstWeekday + lastDay.getDate();
    const rows = [] as Array<Array<{ day: number | null; iso?: string }>>;
    let row = [] as Array<{ day: number | null; iso?: string }>;
    for (let i = 0; i < firstWeekday; i++) row.push({ day: null });
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(cursor.getFullYear(), cursor.getMonth(), d);
      row.push({ day: d, iso: toISO(date) });
      if (row.length === 7) {
        rows.push(row);
        row = [];
      }
    }
    if (row.length) {
      while (row.length < 7) row.push({ day: null });
      rows.push(row);
    }
    return rows;
  }, [cursor]);

  const handleConfirm = () => {
    if (selected) {
      // Parse ISO date string directly without timezone conversion
      const [year, month, day] = selected.split('-').map(Number);
      const dt = new Date(year, month - 1, day);
      onConfirm(toBR(dt));
      onDismiss();
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{title || "Selecionar data"}</Dialog.Title>
        <Dialog.Content>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <IconButton icon="chevron-left" onPress={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} />
            <Text style={{ fontWeight: "700" }}>
              {cursor.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
            </Text>
            <IconButton icon="chevron-right" onPress={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
            {["S", "T", "Q", "Q", "S", "S", "D"].map((h, idx) => (
              <Text key={`header-${idx}`} style={{ width: 32, textAlign: "center", opacity: 0.6 }}>{h}</Text>
            ))}
          </View>
          {days.map((row, idx) => (
            <View key={idx} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
              {row.map((cell, cidx) => {
                const active = cell.iso && selected === cell.iso;
                return (
                  <Pressable
                    key={cidx}
                    style={{ width: 32, height: 32, alignItems: "center", justifyContent: "center", borderRadius: 16, backgroundColor: active ? theme.colors.primary : "transparent" }}
                    disabled={!cell.day}
                    onPress={() => setSelected(cell.iso || null)}
                  >
                    <Text style={{ color: active ? theme.colors.onPrimary : theme.colors.onSurface, opacity: cell.day ? 1 : 0 }}>
                      {cell.day || ""}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancelar</Button>
          <Button onPress={handleConfirm} disabled={!selected}>
            Confirmar
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
