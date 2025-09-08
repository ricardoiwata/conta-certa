import { useAuth } from "@/auth/AuthContext";
import { signInEmail } from "@/services/auth";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import Animated, { ZoomIn } from "react-native-reanimated";

export default function LoginScreen() {
  const router = useRouter();
  const { loading } = useAuth();
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailInvalid =
    !!email && (!email.includes("@") || !email.includes("."));

  async function handleLogin() {
    setError(null);
    try {
      setSubmitting(true);
      await signInEmail(email.trim(), password);
      router.replace("/homepage");
    } catch (e: any) {
      setError(e?.message ?? "Falha ao entrar.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );

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
            Bem vindo de volta!
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
            testID="login-email"
          />
          {emailInvalid && (
            <HelperText type="error" style={{ width: "100%" }}>
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
            style={{ width: "100%" }}
            testID="login-password"
          />

          {error && (
            <HelperText type="error" visible style={{ width: "100%" }}>
              {error}
            </HelperText>
          )}

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={submitting}
            disabled={submitting || emailInvalid || !password}
            style={{ width: "100%" }}
            testID="login-submit"
          >
            Entrar
          </Button>

          <View style={{ height: 8 }} />
          <Button
            mode="text"
            onPress={() => router.push("/signup")}
            style={{ width: "100%" }}
          >
            Não tem conta? Cadastre-se
          </Button>
          <Button
            mode="text"
            onPress={() => router.push("/reset")}
            style={{ width: "100%" }}
          >
            Esqueci minha senha
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
