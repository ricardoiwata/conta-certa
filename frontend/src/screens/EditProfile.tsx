import { useAuth } from "@/auth/AuthContext";
import { updateMyProfile } from "@/services/api";
import { modernStyles } from "@/styles/modern.styles";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  Appbar,
  Button,
  Card,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { maskCEP, maskCPF, maskPhone } from "@/utils/masks";

export default function EditProfileScreen() {
  const { profile, refreshProfile } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cep, setCep] = useState("");

  useEffect(() => {
    if (profile) {
      setNome(profile.nome || "");
      setCpf(maskCPF(profile.cpf || ""));
      setTelefone(maskPhone(profile.telefone || ""));
      setEndereco(profile.endereco || "");
      setCidade(profile.cidade || "");
      setEstado(profile.estado || "");
      setCep(maskCEP(profile.cep || ""));
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!nome.trim()) {
      Alert.alert("Erro", "Nome é obrigatório");
      return;
    }

    setLoading(true);
    try {
      // Remove formatting before sending
      const cleanCpf = cpf.replace(/\D/g, "");
      const cleanTelefone = telefone.replace(/\D/g, "");
      const cleanCep = cep.replace(/\D/g, "");

      await updateMyProfile({
        nome,
        cpf: cleanCpf || undefined,
        telefone: cleanTelefone || undefined,
        endereco: endereco || undefined,
        cidade: cidade || undefined,
        estado: estado || undefined,
        cep: cleanCep || undefined,
      });

      await refreshProfile();

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      router.back();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      Alert.alert(
        "Erro",
        error instanceof Error ? error.message : "Erro ao atualizar perfil"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <View style={{ flex: 1 }}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="Editar Perfil" />
        </Appbar.Header>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 16, marginBottom: 16, textAlign: "center" }}>
            Perfil não encontrado
          </Text>
          <Text style={{ fontSize: 14, color: "#666", marginBottom: 24, textAlign: "center" }}>
            Você precisa completar seu perfil primeiro
          </Text>
          <Button
            mode="contained"
            onPress={() => router.push("/complete-profile")}
          >
            Completar Perfil
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Editar Perfil" />
      </Appbar.Header>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          modernStyles.modernContainer,
          { paddingTop: 16 },
        ]}
      >
        <Card style={modernStyles.modernCard}>
          <Card.Content style={modernStyles.modernCardContent}>
            <Text
              style={[
                modernStyles.modernTitle,
                {
                  color: theme.colors.onSurface,
                  marginBottom: 16,
                  fontSize: 18,
                },
              ]}
            >
              Informações Pessoais
            </Text>

            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                marginBottom: 8,
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
                color: theme.colors.onSurface,
              }}
            >
              CPF
            </Text>
            <TextInput
              label="CPF"
              value={cpf}
              onChangeText={(text) => setCpf(maskCPF(text))}
              disabled={loading}
              keyboardType="numeric"
              mode="outlined"
              placeholder="XXX.XXX.XXX-XX"
              style={{ marginBottom: 16 }}
              maxLength={14}
            />

            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                marginBottom: 8,
                color: theme.colors.onSurface,
              }}
            >
              Telefone
            </Text>
            <TextInput
              label="Telefone"
              value={telefone}
              onChangeText={(text) => setTelefone(maskPhone(text))}
              disabled={loading}
              keyboardType="numeric"
              mode="outlined"
              placeholder="(11) 99999-9999"
              style={{ marginBottom: 16 }}
              maxLength={15}
            />
          </Card.Content>
        </Card>

        <Card style={modernStyles.modernCard}>
          <Card.Content style={modernStyles.modernCardContent}>
            <Text
              style={[
                modernStyles.modernTitle,
                {
                  color: theme.colors.onSurface,
                  marginBottom: 16,
                  fontSize: 18,
                },
              ]}
            >
              Endereço
            </Text>

            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                marginBottom: 8,
                color: theme.colors.onSurface,
              }}
            >
              Endereço
            </Text>
            <TextInput
              label="Endereço"
              value={endereco}
              onChangeText={setEndereco}
              disabled={loading}
              mode="outlined"
              placeholder="Rua, número, complemento"
              style={{ marginBottom: 16 }}
            />

            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                marginBottom: 8,
                color: theme.colors.onSurface,
              }}
            >
              Cidade
            </Text>
            <TextInput
              label="Cidade"
              value={cidade}
              onChangeText={setCidade}
              disabled={loading}
              mode="outlined"
              placeholder="São Paulo"
              style={{ marginBottom: 16 }}
            />

            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    marginBottom: 8,
                    color: theme.colors.onSurface,
                  }}
                >
                  Estado
                </Text>
                <TextInput
                  label="Estado"
                  value={estado}
                  onChangeText={(value) =>
                    setEstado(value.toUpperCase().slice(0, 2))
                  }
                  disabled={loading}
                  mode="outlined"
                  placeholder="SP"
                  maxLength={2}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    marginBottom: 8,
                    color: theme.colors.onSurface,
                  }}
                >
                  CEP
                </Text>
                <TextInput
                  label="CEP"
                  value={cep}
                  onChangeText={(text) => setCep(maskCEP(text))}
                  disabled={loading}
                  keyboardType="numeric"
                  mode="outlined"
                  placeholder="01234-567"
                  maxLength={9}
                />
              </View>
            </View>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleSaveProfile}
          loading={loading}
          disabled={loading}
          style={[modernStyles.modernButton, { marginTop: 8 }]}
          labelStyle={{ fontSize: 16, fontWeight: "600" }}
        >
          Salvar Alterações
        </Button>

        <Text
          style={{
            fontSize: 12,
            color: theme.colors.onSurface,
            marginTop: 12,
            textAlign: "center",
            opacity: 0.6,
          }}
        >
          * Campo obrigatório
        </Text>
      </ScrollView>
    </View>
  );
}
