import React, { useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import {
  Appbar,
  Card,
  Text,
  TextInput,
  Button,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";
import { useAuth } from "../auth/AuthContext";
import { createUserProfile } from "../services/api";
import { modernStyles } from "../styles/modern.styles";

export default function CompleteProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { user, refreshProfile } = useAuth();
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async () => {
    if (!nome.trim()) {
      Alert.alert("Erro", "Nome é obrigatório");
      return;
    }

    setLoading(true);
    try {
      await createUserProfile({
        nome,
        cpf: cpf || undefined,
        telefone: telefone || undefined,
        endereco: endereco || undefined,
        cidade: cidade || undefined,
        estado: estado || undefined,
        cep: cep || undefined,
      });

      await refreshProfile();

      Alert.alert("Sucesso", "Perfil criado com sucesso!");
      router.replace("/homepage");
    } catch (error) {
      console.error("Erro ao criar perfil:", error);
      Alert.alert(
        "Erro",
        error instanceof Error ? error.message : "Erro ao criar perfil"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Completar Perfil" />
      </Appbar.Header>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          modernStyles.modernContainer,
          { paddingTop: 16, paddingBottom: 32 },
        ]}
      >
        <Card style={modernStyles.modernCard}>
          <Card.Content style={modernStyles.modernCardContent}>
            <Text
              style={[
                modernStyles.modernTitle,
                { color: theme.colors.onSurface, marginBottom: 8 },
              ]}
            >
              Vamos completar suas informações
            </Text>
            <Text
              style={[
                modernStyles.modernSubtitle,
                { color: theme.colors.onSurface, marginBottom: 16 },
              ]}
            >
              Preencha os dados abaixo
            </Text>

            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                marginBottom: 8,
                marginTop: 16,
                color: theme.colors.onSurface,
              }}
            >
              Nome *
            </Text>
            <TextInput
              label="Nome completo"
              value={nome}
              onChangeText={setNome}
              disabled={loading}
              mode="outlined"
              style={{ marginBottom: 16 }}
            />

            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                marginBottom: 8,
                marginTop: 12,
                color: theme.colors.onSurface,
              }}
            >
              CPF
            </Text>
            <TextInput
              label="XXX.XXX.XXX-XX"
              value={cpf}
              onChangeText={setCpf}
              disabled={loading}
              mode="outlined"
              keyboardType="numeric"
              style={{ marginBottom: 16 }}
            />

            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                marginBottom: 8,
                marginTop: 12,
                color: theme.colors.onSurface,
              }}
            >
              Telefone
            </Text>
            <TextInput
              label="(11) 99999-9999"
              value={telefone}
              onChangeText={setTelefone}
              disabled={loading}
              mode="outlined"
              keyboardType="phone-pad"
              style={{ marginBottom: 16 }}
            />

            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                marginBottom: 8,
                marginTop: 12,
                color: theme.colors.onSurface,
              }}
            >
              Endereço
            </Text>
            <TextInput
              label="Rua, número, complemento"
              value={endereco}
              onChangeText={setEndereco}
              disabled={loading}
              mode="outlined"
              style={{ marginBottom: 16 }}
            />

            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                marginBottom: 8,
                marginTop: 12,
                color: theme.colors.onSurface,
              }}
            >
              Cidade
            </Text>
            <TextInput
              label="São Paulo"
              value={cidade}
              onChangeText={setCidade}
              disabled={loading}
              mode="outlined"
              style={{ marginBottom: 16 }}
            />

            <View
              style={{
                flexDirection: "row",
                gap: 12,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    marginBottom: 8,
                    marginTop: 12,
                    color: theme.colors.onSurface,
                  }}
                >
                  Estado
                </Text>
                <TextInput
                  label="SP"
                  value={estado}
                  onChangeText={(value) =>
                    setEstado(value.toUpperCase().slice(0, 2))
                  }
                  disabled={loading}
                  mode="outlined"
                  maxLength={2}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    marginBottom: 8,
                    marginTop: 12,
                    color: theme.colors.onSurface,
                  }}
                >
                  CEP
                </Text>
                <TextInput
                  label="01234-567"
                  value={cep}
                  onChangeText={setCep}
                  disabled={loading}
                  mode="outlined"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Button
              mode="contained"
              onPress={handleSaveProfile}
              loading={loading}
              disabled={loading}
              style={{ marginTop: 32 }}
            >
              Salvar Perfil
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}
