import { resetPassword } from "@/services/auth";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import {
  Button,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

export default function ResetScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const emailInvalid =
    !!email && (!email.includes("@") || !email.includes("."));
  const theme = useTheme();

  async function handleReset() {
    await resetPassword(email.trim());
    setSent(true);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <View style={{ width: "100%", maxWidth: 480, gap: 12 }}>
          <Text
            variant="headlineMedium"
            style={{
              fontWeight: "700",
              marginBottom: 8,
              textAlign: "center",
              width: "100%",
              color: theme.colors.primary,
            }}
          >
            Recuperar senha
          </Text>
          <TextInput
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            left={<TextInput.Icon icon="email-outline" />}
            error={emailInvalid}
            style={{ width: "100%" }}
          />
          <HelperText
            type="error"
            visible={emailInvalid}
            style={{ width: "100%" }}
          >
            E-mail inválido
          </HelperText>
          <Button
            mode="contained"
            onPress={handleReset}
            disabled={emailInvalid || !email}
            style={{ width: "100%" }}
          >
            Enviar
          </Button>
          <View style={{ height: 8 }} />
          <Button
            mode="text"
            onPress={() => router.replace("/login")}
            style={{ width: "100%" }}
          >
            Voltar para o login
          </Button>
          {sent && (
            <HelperText type="info" visible style={{ width: "100%" }}>
              E-mail enviado! Verifique sua caixa de entrada.
            </HelperText>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
