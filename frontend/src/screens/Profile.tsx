import { useAuth } from "@/auth/AuthContext";
import { signOutUser } from "@/services/auth";
import { useThemePreference, type ThemePreference } from "@/theme/ThemeContext";
import { modernStyles } from "@/styles/modern.styles";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, ScrollView, Alert } from "react-native";
import { Appbar, Avatar, Button, Card, Text, Menu, IconButton, List, Badge, useTheme, Modal, Portal } from "react-native-paper";
import { useFab } from "@/context/FabContext";
import { getDashboardData } from "@/services/dashboard";
import { listDespesas } from "@/services/despesas";
import { listReceitas } from "@/services/receitas";
import DatePickerModal from "@/components/DatePickerModal";
import { generateCompleteReport } from "@/services/reportPdf";

export default function Profile() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const { themePreference, setThemePreference } = useThemePreference();
  const { setFabVisible, setFabCrudVisible } = useFab();
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificacoes, setNotificacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [dataInicio, setDataInicio] = useState<string | null>(null);
  const [dataFim, setDataFim] = useState<string | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [showDatePickerInicio, setShowDatePickerInicio] = useState(false);
  const [showDatePickerFim, setShowDatePickerFim] = useState(false);

  const name = profile?.nome || user?.displayName || "Usuário";
  const email = profile?.email || user?.email || "";
  const cpf = profile?.cpf;
  const telefone = profile?.telefone;
  const theme = useTheme();

  useEffect(() => {
    setFabVisible(false);
    setFabCrudVisible(false);
    return () => {
      setFabVisible(true);
      setFabCrudVisible(true);
    };
  }, [setFabVisible, setFabCrudVisible]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getDashboardData();
        setNotificacoes(data.notificacoes || []);
      } catch (e) {
        console.error("Erro ao carregar notificações:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleLogout() {
    await signOutUser();
    router.replace("/login");
  }

  async function handleGenerateReport() {
    if (!dataInicio || !dataFim) {
      Alert.alert("Erro", "Por favor, preencha as datas de início e fim");
      return;
    }

    setGeneratingReport(true);
    try {
      const despesas = await listDespesas();
      const receitas = await listReceitas();
      
      // Converter formato dd/mm/yyyy para Date
      const [diaI, mesI, anoI] = dataInicio.split("/");
      const [diaF, mesF, anoF] = dataFim.split("/");
      
      const inicio = new Date(parseInt(anoI), parseInt(mesI) - 1, parseInt(diaI));
      const fim = new Date(parseInt(anoF), parseInt(mesF) - 1, parseInt(diaF));
      fim.setHours(23, 59, 59, 999);

      if (inicio > fim) {
        Alert.alert("Erro", "A data de início não pode ser maior que a data de fim");
        setGeneratingReport(false);
        return;
      }

      const despesasFiltradas = despesas.filter((d: any) => {
        const dataDespesa = new Date(d.data);
        return dataDespesa >= inicio && dataDespesa <= fim;
      });

      const receitasFiltradas = receitas.filter((r: any) => {
        const dataReceita = new Date(r.data);
        return dataReceita >= inicio && dataReceita <= fim;
      });

      const despesasMap = despesasFiltradas.map((d: any) => {
        let categoria = "Sem categoria";
        
        if (d.categoria) {
          if (typeof d.categoria === 'string') {
            categoria = d.categoria;
          } else if (d.categoria.nome) {
            categoria = d.categoria.nome;
          } else if (typeof d.categoria === 'object') {
            categoria = Object.values(d.categoria).find((v: any) => typeof v === 'string') as string || "Sem categoria";
          }
        }

        // Converter data para string se necessário
        let dataStr = d.data;
        if (typeof d.data === 'object' && d.data !== null) {
          if ('_seconds' in d.data) {
            dataStr = d.data._seconds;
          } else if ('toDate' in d.data) {
            dataStr = d.data.toDate().toISOString();
          } else {
            dataStr = String(d.data);
          }
        }

        return {
          id: d.id,
          descricao: d.descricao,
          valor: d.valor,
          data: dataStr,
          categoria: categoria
        };
      });

      const receitasMap = receitasFiltradas.map((r: any) => {
        let origem = "Sem origem";
        
        // Tenta diferentes formas de acessar a origem
        if (r.origem) {
          if (typeof r.origem === 'string') {
            origem = r.origem;
          } else if (typeof r.origem === 'object') {
            origem = Object.values(r.origem).find((v: any) => typeof v === 'string') as string || "Sem origem";
          }
        }

        // Converter data para string se necessário
        let dataStr = r.data;
        if (typeof r.data === 'object' && r.data !== null) {
          if ('_seconds' in r.data) {
            dataStr = r.data._seconds;
          } else if ('toDate' in r.data) {
            dataStr = r.data.toDate().toISOString();
          } else {
            dataStr = String(r.data);
          }
        }

        return {
          id: r.id,
          descricao: r.descricao,
          valor: r.valor,
          data: dataStr,
          origem: origem
        };
      });

      const totalDespesas = despesasMap.reduce((sum: number, d: any) => sum + (d.valor || 0), 0);
      const totalReceitas = receitasMap.reduce((sum: number, r: any) => sum + (r.valor || 0), 0);

      // Verificar se há dados
      if ((despesasMap?.length ?? 0) === 0 && (receitasMap?.length ?? 0) === 0) {
        Alert.alert(
          "Sem dados",
          "Não há receitas ou despesas cadastradas no período selecionado para gerar o relatório."
        );
        setGeneratingReport(false);
        return;
      }

      await generateCompleteReport(
        despesasMap,
        receitasMap,
        dataInicio,
        dataFim,
        name
      );

      Alert.alert(
        "Sucesso",
        `Relatório gerado!\n\n💰 Receitas: R$ ${totalReceitas.toFixed(2)}\n💸 Despesas: R$ ${totalDespesas.toFixed(2)}\n📊 Saldo: R$ ${(totalReceitas - totalDespesas).toFixed(2)}`,
        [
          { text: "OK", onPress: () => {
            setShowReportModal(false);
            setDataInicio(null);
            setDataFim(null);
          }}
        ]
      );
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      Alert.alert("Erro", "Não foi possível gerar o relatório");
    } finally {
      setGeneratingReport(false);
    }
  }

  const getThemeLabel = (preference: ThemePreference) => {
    switch (preference) {
      case 'light':
        return 'Claro';
      case 'dark':
        return 'Escuro';
      case 'system':
        return 'Sistema';
      default:
        return 'Sistema';
    }
  };

  const getThemeIcon = (preference: ThemePreference) => {
    switch (preference) {
      case 'light':
        return 'white-balance-sunny';
      case 'dark':
        return 'moon-waning-crescent';
      case 'system':
        return 'theme-light-dark';
      default:
        return 'theme-light-dark';
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Perfil" />
      </Appbar.Header>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={[modernStyles.modernContainer, { paddingTop: 16 }]}>
        {!profile ? (
          <>
            <Card style={modernStyles.modernCard}>
              <Card.Content style={modernStyles.modernCardContent}>
                <Text style={[modernStyles.modernTitle, { color: theme.colors.onSurface, marginBottom: 16 }]}>
                  Perfil Incompleto
                </Text>
                <Text style={[modernStyles.modernSubtitle, { color: theme.colors.onSurface, marginBottom: 16 }]}>
                  Complete seu perfil para acessar todas as funcionalidades
                </Text>
                <Button
                  mode="contained"
                  onPress={() => router.push("/complete-profile")}
                  style={{ marginBottom: 8 }}
                >
                  Completar Perfil
                </Button>
              </Card.Content>
            </Card>
          </>
        ) : (
          <>
            <Card style={modernStyles.modernCard}>
              <Card.Content style={[modernStyles.modernCardContent, { flexDirection: "row", alignItems: "center", gap: 16 }]}>
                <Avatar.Icon size={64} icon="account" />
                <View style={{ flex: 1 }}>
                  <Text style={[modernStyles.modernTitle, { color: theme.colors.onSurface, marginBottom: 4 }]}>
                    {name}
                  </Text>
                  {!!email && (
                    <Text style={[modernStyles.modernSubtitle, { color: theme.colors.onSurface }]}>
                      {email}
                    </Text>
                  )}
                  {cpf && (
                    <Text style={[modernStyles.modernSubtitle, { color: theme.colors.onSurface, fontSize: 12 }]}>
                      CPF: {cpf}
                    </Text>
                  )}
                </View>
                <IconButton
                  icon="pencil"
                  size={24}
                  onPress={() => router.push("/edit-profile")}
                />
              </Card.Content>
            </Card>
          </>
        )}

        <Card style={modernStyles.modernCard}>
          <Card.Content style={modernStyles.modernCardContent}>
            <View style={modernStyles.modernRow}>
              <View style={modernStyles.modernColumn}>
                <Text style={[modernStyles.modernTitle, { color: theme.colors.onSurface, fontSize: 16 }]}>
                  Tema
                </Text>
                <Text style={[modernStyles.modernSubtitle, { color: theme.colors.onSurface }]}>
                  {getThemeLabel(themePreference)}
                </Text>
              </View>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <IconButton
                    icon={getThemeIcon(themePreference)}
                    size={24}
                    onPress={() => setMenuVisible(true)}
                  />
                }
              >
                <Menu.Item
                  onPress={() => {
                    setThemePreference('system');
                    setMenuVisible(false);
                  }}
                  title="Sistema"
                  leadingIcon="theme-light-dark"
                  trailingIcon={themePreference === 'system' ? 'check' : undefined}
                />
                <Menu.Item
                  onPress={() => {
                    setThemePreference('light');
                    setMenuVisible(false);
                  }}
                  title="Claro"
                  leadingIcon="white-balance-sunny"
                  trailingIcon={themePreference === 'light' ? 'check' : undefined}
                />
                <Menu.Item
                  onPress={() => {
                    setThemePreference('dark');
                    setMenuVisible(false);
                  }}
                  title="Escuro"
                  leadingIcon="moon-waning-crescent"
                  trailingIcon={themePreference === 'dark' ? 'check' : undefined}
                />
              </Menu>
            </View>
          </Card.Content>
        </Card>

        <Card style={modernStyles.modernCard}>
          <Card.Content style={modernStyles.modernCardContent}>
            <View style={[modernStyles.modernRow, { marginBottom: 12 }]}>
              <Text style={[modernStyles.modernTitle, { color: theme.colors.onSurface, fontSize: 16 }]}>
                Notificações
              </Text>
              {notificacoes.length > 0 && (
                <View style={[modernStyles.modernBadge, { backgroundColor: '#FF6B6B' }]}>
                  <Text style={modernStyles.modernBadgeText}>
                    {notificacoes.length}
                  </Text>
                </View>
              )}
            </View>
            {notificacoes.length > 0 ? (
              notificacoes.map((notificacao) => (
                <List.Item
                  key={notificacao.id}
                  title={notificacao.texto}
                  titleStyle={{ fontSize: 14, fontWeight: '500' }}
                  left={(props) => <List.Icon {...props} icon="bell" color="#FF6B6B" />}
                  style={{ paddingHorizontal: 0 }}
                />
              ))
            ) : (
              <Text style={{ opacity: 0.6, textAlign: 'center', paddingVertical: 16 }}>
                Nenhuma notificação no momento
              </Text>
            )}
          </Card.Content>
        </Card>

        <Card style={modernStyles.modernCard}>
          <Card.Content style={modernStyles.modernCardContent}>
            <Text style={[modernStyles.modernTitle, { color: theme.colors.onSurface, fontSize: 16, marginBottom: 12 }]}>
              Relatório de Gastos
            </Text>
            <Text style={[modernStyles.modernSubtitle, { color: theme.colors.onSurface, marginBottom: 16 }]}>
              Gere um relatório PDF com seus gastos em um período específico
            </Text>
            <Button
              mode="contained"
              onPress={() => setShowReportModal(true)}
              icon="file-pdf-box"
            >
              Gerar Relatório
            </Button>
          </Card.Content>
        </Card>

        <Button 
          mode="contained" 
          onPress={handleLogout}
          style={[modernStyles.modernButton, { marginTop: 8 }]}
          labelStyle={{ fontSize: 16, fontWeight: '600' }}
        >
          Sair da conta
        </Button>

        <Portal>
          <Modal 
            visible={showReportModal} 
            onDismiss={() => {
              setShowReportModal(false);
              setDataInicio(null);
              setDataFim(null);
            }}
            contentContainerStyle={{
              backgroundColor: theme.colors.surface,
              margin: 16,
              borderRadius: 12,
              padding: 20
            }}
          >
            <Text style={[modernStyles.modernTitle, { color: theme.colors.onSurface, marginBottom: 16 }]}>
              Gerar Relatório de Gastos
            </Text>
            
            <Text style={{ fontSize: 12, fontWeight: '600', marginBottom: 8, color: theme.colors.onSurface }}>
              Data de Início
            </Text>
            <DatePickerModal
              visible={showDatePickerInicio}
              onDismiss={() => setShowDatePickerInicio(false)}
              onConfirm={(date) => setDataInicio(date)}
              title="Selecione a data de início"
            />
            <Button
              mode="outlined"
              onPress={() => setShowDatePickerInicio(true)}
              style={{ marginBottom: 16 }}
            >
              {dataInicio || "Selecione a data inicial"}
            </Button>

            <Text style={{ fontSize: 12, fontWeight: '600', marginBottom: 8, color: theme.colors.onSurface }}>
              Data de Fim
            </Text>
            <DatePickerModal
              visible={showDatePickerFim}
              onDismiss={() => setShowDatePickerFim(false)}
              onConfirm={(date) => setDataFim(date)}
              title="Selecione a data de fim"
            />
            <Button
              mode="outlined"
              onPress={() => setShowDatePickerFim(true)}
              style={{ marginBottom: 20 }}
            >
              {dataFim || "Selecione a data final"}
            </Button>

            <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'flex-end' }}>
              <Button
                mode="outlined"
                onPress={() => {
                  setShowReportModal(false);
                  setDataInicio(null);
                  setDataFim(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                mode="contained"
                onPress={handleGenerateReport}
                loading={generatingReport}
                disabled={generatingReport}
              >
                Gerar
              </Button>
            </View>
          </Modal>
        </Portal>
      </ScrollView>
    </View>
  );
}

