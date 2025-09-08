import { signUpEmail } from "@/services/auth";
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
import Animated, { ZoomIn } from "react-native-reanimated";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  const emailInvalid = !!email && !/^\S+@\S+\.\S+$/.test(email);
  const passWeak = !!password && password.length < 6;
  const passMismatch =
    !!password && !!confirmPassword && password !== confirmPassword;

  const allFieldsFilled = Boolean(name && email && password && confirmPassword);
  const hasErrors = emailInvalid || passWeak || passMismatch;
  const canSubmit = allFieldsFilled && !hasErrors && !submitting;

  async function handleRegister() {
    setError(null);
    try {
      setSubmitting(true);
      await signUpEmail(email.trim(), password, name.trim());
      router.replace("/");
    } catch (e: any) {
      const code = e?.code as string | undefined;
      const message = e?.message as string | undefined;
      if (
        code === "auth/email-already-in-use" ||
        message?.toLowerCase()?.includes("auth/email-already-in-use")
      ) {
        setError("O e-mail já está cadastrado");
      } else {
        setError(message ?? "Não foi possível cadastrar.");
      }
    } finally {
      setSubmitting(false);
    }
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
          <Animated.Image
            source={require("../assets/images/logo.png")}
            style={{
              width: 120,
              height: 120,
              alignSelf: "center",
              marginBottom: 8,
              resizeMode: "contain",
            }}
            entering={ZoomIn.duration(600)}
          />
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
            Criar conta
          </Text>

          <TextInput
            label="Nome"
            value={name}
            onChangeText={setName}
            left={<TextInput.Icon icon="account-outline" />}
            style={{ width: "100%" }}
            testID="register-name"
          />

          <TextInput
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            left={<TextInput.Icon icon="email-outline" />}
            error={emailInvalid}
            style={{ width: "100%" }}
            testID="register-email"
          />
          {emailInvalid && (
            <HelperText
              type="error"
              visible={emailInvalid}
              style={{ width: "100%" }}
            >
              E-mail inválido
            </HelperText>
          )}

          <TextInput
            label="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass}
            left={<TextInput.Icon icon="lock-outline" />}
            right={
              <TextInput.Icon
                icon={showPass ? "eye-off" : "eye"}
                onPress={() => setShowPass((v) => !v)}
              />
            }
            error={passWeak}
            style={{ width: "100%" }}
            testID="register-password"
          />
          {passWeak && (
            <HelperText type="error" visible style={{ width: "100%" }}>
              Mínimo de 6 caracteres
            </HelperText>
          )}

          <TextInput
            label="Confirme sua senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPass}
            left={<TextInput.Icon icon="lock-outline" />}
            right={
              <TextInput.Icon
                icon={showConfirmPass ? "eye-off" : "eye"}
                onPress={() => setShowConfirmPass((v) => !v)}
              />
            }
            error={passMismatch}
            style={{ width: "100%" }}
            testID="register-confirm"
          />
          {passMismatch && (
            <HelperText type="error" visible style={{ width: "100%" }}>
              As senhas não coincidem
            </HelperText>
          )}
          {error && (
            <HelperText type="error" visible style={{ width: "100%" }}>
              {error}
            </HelperText>
          )}
          <Button
            mode="contained"
            onPress={handleRegister}
            loading={submitting}
            disabled={!canSubmit}
            style={{ width: "100%", marginTop: 24 }}
            testID="register-submit"
          >
            Cadastrar
          </Button>

          <Button
            mode="text"
            onPress={() => router.back()}
            style={{ width: "100%" }}
          >
            Já tem conta? Faça login
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
