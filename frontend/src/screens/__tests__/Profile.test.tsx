import React from "react";
import { fireEvent, waitFor } from "@testing-library/react-native";
import Profile from "../Profile";
import { renderWithProviders } from "@/test-utils/render";

const mockRouter = {
  back: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
};

jest.mock("expo-router", () => ({
  useRouter: () => mockRouter,
}));

jest.mock("@/auth/AuthContext", () => ({
  useAuth: () => ({
    user: { displayName: "Teste", email: "test@example.com" },
    profile: { nome: "Teste", email: "test@example.com", cpf: null, telefone: null },
    loading: false,
  }),
}));

jest.mock("@/services/auth", () => ({
  __esModule: true,
  signOutUser: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/services/dashboard", () => ({
  getDashboardData: jest.fn().mockResolvedValue({
    balance: 0,
    labels: [],
    receita: [],
    despesa: [],
    totalReceitasRecebidas: 0,
    totalDespesasPagas: 0,
    receitasPendentes: 0,
    despesasPendentes: 0,
    proximos7Dias: [],
    alertas: [],
    categorias: [],
    notificacoes: [],
    dica: '',
  }),
}));

jest.mock("@/services/despesas", () => ({
  listDespesas: jest.fn().mockResolvedValue([]),
}));

jest.mock("@/services/receitas", () => ({
  listReceitas: jest.fn().mockResolvedValue([]),
}));

jest.mock("@/services/reportPdf", () => ({
  generateCompleteReport: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/context/FabContext", () => ({
  useFab: () => ({ setIsOpen: jest.fn(), setFabVisible: jest.fn(), setFabCrudVisible: jest.fn() }),
}));

jest.mock("@/theme/ThemeContext", () => ({
  useThemePreference: () => ({
    themePreference: 'auto',
    setThemePreference: jest.fn(),
  }),
}));

describe("Profile screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows user data and signs out on press", async () => {
    const { getByText } = renderWithProviders(<Profile />);

    await waitFor(() => {
      expect(getByText("Teste")).toBeTruthy();
    });

    const signOutButton = getByText("Sair da conta");
    fireEvent.press(signOutButton);

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith("/login");
    });
  });
});
