import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Text as PaperText, Button as PaperButton } from "react-native-paper";
import { useAppTheme } from "../theme/provider";

export default function NotFoundScreen() {
  const { colors } = useAppTheme();

  return (
    <>
      <Stack.Screen options={{ title: "Página não encontrada" }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <PaperText variant="titleLarge" style={{ color: colors.text }}>
          Ops! Página não encontrada
        </PaperText>
        <Link href="/" asChild>
          <PaperButton mode="contained" style={styles.button}>
            Voltar ao início
          </PaperButton>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 20,
  },
  button: {
    borderRadius: 10,
  },
});
