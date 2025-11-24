import React, { useState, useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Appbar,
  TextInput,
  Button,
  Text,
  useTheme,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "../auth/AuthContext";
import { useFab } from "../context/FabContext";
import { listDespesas } from "../services/despesas";
import { listReceitas } from "../services/receitas";

import { GoogleGenAI } from "@google/genai"; 

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("A variável EXPO_PUBLIC_GEMINI_API_KEY não está definida.");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY }); 

type Message = {
  sender: "user" | "bot";
  text: string;
};

export default function ChatbotScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const { setFabVisible, setFabCrudVisible } = useFab();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Olá! 👋 Sou seu assistente financeiro. Como posso ajudar hoje?" },
  ]);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setFabVisible(false);
    setFabCrudVisible(false);
    return () => {
      setFabVisible(true);
      setFabCrudVisible(true);
    };
  }, [setFabVisible, setFabCrudVisible]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const despesas = await listDespesas();
      const receitas = await listReceitas();

      const context = `
        Despesas recentes:
        ${JSON.stringify(despesas.slice(0, 5))}
        Receitas recentes:
        ${JSON.stringify(receitas.slice(0, 5))}
      `;

      const prompt = `
        Você é um assistente financeiro do conta certa, um aplicativo de gerenciamento financeiro. Responda de forma simples e direta.
        Use o contexto abaixo para ajudar o usuário com suas finanças. Não mande o contexto inteiro, apenas utilize as informações relevantes para responder à pergunta do usuário.
        não coloque ** nos textos pois para renderizar no app isso pode causar problemas.r
        ${context}
        ---
        Pergunta: ${userMessage.text}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text =
        response.text?.trim() ||
        "Desculpe, não consegui gerar uma resposta agora.";

      setMessages((prev) => [...prev, { sender: "bot", text } as Message]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Ocorreu um erro ao processar sua mensagem." } as Message,
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Stack.Screen options={{ title: "Chat Financeiro" }} />
        <Appbar.Header>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="Chat Financeiro" />
        </Appbar.Header>

        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1, padding: 12 }}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {messages.map((msg, index) => (
            <View
              key={index}
              style={{
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                backgroundColor:
                  msg.sender === "user"
                    ? theme.colors.primaryContainer
                    : theme.colors.surfaceVariant,
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 12,
                marginVertical: 4,
                maxWidth: "80%",
                elevation: 1,
              }}
            >
              <Text style={{ color: theme.colors.onSurfaceVariant }}>
                {msg.text}
              </Text>
            </View>
          ))}

          {loading && (
            <ActivityIndicator
              animating
              size="small"
              style={{ marginTop: 8, alignSelf: "center" }}
            />
          )}
        </ScrollView>

        <View
          style={{
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
            borderTopWidth: 0.5,
            borderTopColor: theme.colors.outlineVariant,
            backgroundColor: theme.colors.surface,
          }}
        >
          <TextInput
            style={{ flex: 1, marginRight: 10 }}
            value={input}
            onChangeText={setInput}
            placeholder="Digite sua pergunta..."
            disabled={loading}
            mode="outlined"
          />

          <IconButton
            icon="send"
            size={24}
            onPress={handleSend}
            disabled={loading || !input.trim()}
            iconColor={theme.colors.primary}
            style={{
              margin: 0,
              marginTop: 6,
            }}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}