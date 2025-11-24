import React from "react";
import { render } from "@testing-library/react-native";
import Homepage from "../Homepage";

// Mock Firebase before other imports
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
}));

jest.mock("firebase/auth", () => ({
  initializeAuth: jest.fn(),
  getReactNativePersistence: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

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
  useFab: () => ({ setIsOpen: jest.fn(), setFabVisible: jest.fn(), setFabCrudVisible: jest.fn() }),
}));

jest.mock("@/theme/ThemeContext", () => ({
  useThemePreference: () => ({ themePreference: 'auto' }),
}));

jest.mock("@react-navigation/core", () => ({
  useNavigation: jest.fn().mockReturnValue({
    addListener: jest.fn(),
  }),
  useFocusEffect: jest.fn(),
}));

describe("Homepage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    // Just verify the component exists and can be imported
    expect(Homepage).toBeDefined();
  });
});
