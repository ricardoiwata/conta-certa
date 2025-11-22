import React from "react";
import { fireEvent } from "@testing-library/react-native";
import Homepage from "../Homepage";
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
    user: { uid: "user-1", displayName: "Teste" },
    loading: false,
  }),
}));

jest.mock("@/services/dashboard", () => ({
  getDashboardData: jest.fn().mockResolvedValue({
    balance: 1000,
    labels: [],
    receita: [],
    despesa: [],
    totalReceitasRecebidas: 5000,
    totalDespesasPagas: 4000,
    receitasPendentes: 500,
    despesasPendentes: 200,
    proximos7Dias: [],
    alertas: [],
    categorias: [],
    notificacoes: [],
    dica: '',
  }),
}));

jest.mock("@/services/receitas", () => ({
  listReceitas: jest.fn().mockResolvedValue([]),
}));

jest.mock("@/context/FabContext", () => ({
  useFab: () => ({ setIsOpen: jest.fn(), setFabVisible: jest.fn() }),
}));

jest.mock("@/theme/ThemeContext", () => ({
  useThemePreference: () => ({ themePreference: 'auto' }),
}));

describe("Homepage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders homepage successfully", () => {
    const { getByText } = renderWithProviders(<Homepage />);

    expect(getByText(/Bem-vindo|Welcome/i)).toBeTruthy();
  });
});
