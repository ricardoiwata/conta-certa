import React from "react";
import { renderWithProviders } from "@/test-utils/render";
import BalanceDetailScreen from "../details/BalanceDetailScreen";
import MonthlySummaryDetailScreen from "../details/MonthlySummaryDetailScreen";
import IncomeVsExpenseDetailScreen from "../details/IncomeVsExpenseDetailScreen";
import UpcomingEventsDetailScreen from "../details/UpcomingEventsDetailScreen";
import AlertsDetailScreen from "../details/AlertsDetailScreen";
import CategoriesDetailScreen from "../details/CategoriesDetailScreen";
import NotificationsDetailScreen from "../details/NotificationsDetailScreen";
import TipDetailScreen from "../details/TipDetailScreen";

const mockRouter = {
  back: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
};

jest.mock("expo-router", () => ({
  useRouter: () => mockRouter,
}));

jest.mock("@/services/dashboard", () => {
  const actual = jest.requireActual("@/services/dashboard");
  const { dashboardData } = jest.requireActual("@/data/dashboard");
  return {
    ...actual,
    getIncomeVsExpenseDetail: jest
      .fn()
      .mockResolvedValue(dashboardData.incomeVsExpenseDetail),
  };
});

describe("Dashboard detail screens", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders balance detail content", () => {
    const { getByText } = renderWithProviders(<BalanceDetailScreen />);
    expect(getByText("Detalhes do fluxo de caixa previsto para o mês.")).toBeTruthy();
    expect(getByText("Receitas pendentes")).toBeTruthy();
  });

  it("renders monthly summary content", () => {
    const { getByText } = renderWithProviders(<MonthlySummaryDetailScreen />);
    expect(getByText("Resumo do mês")).toBeTruthy();
    expect(getByText(/Receitas recebidas/)).toBeTruthy();
  });

  it("renders income vs expense chart", () => {
    const { getAllByLabelText } = renderWithProviders(<IncomeVsExpenseDetailScreen />);
    expect(getAllByLabelText("line-chart")).toHaveLength(1);
  });

  it("lists upcoming events", () => {
    const { getByText } = renderWithProviders(<UpcomingEventsDetailScreen />);
    expect(getByText(/Conta de Luz/)).toBeTruthy();
  });

  it("lists alerts", () => {
    const { getByText } = renderWithProviders(<AlertsDetailScreen />);
    expect(getByText("Você atingiu 80% do orçamento de Lazer")).toBeTruthy();
  });

  it("lists categories", () => {
    const { getByText } = renderWithProviders(<CategoriesDetailScreen />);
    expect(getByText("Alimentação")).toBeTruthy();
  });

  it("lists notifications", () => {
    const { getByText } = renderWithProviders(<NotificationsDetailScreen />);
    expect(getByText("Cashback de R$ 15 disponível")).toBeTruthy();
  });

  it("shows financial tip", () => {
    const { getByText } = renderWithProviders(<TipDetailScreen />);
    expect(getByText(/Este mês você gastou 18%/)).toBeTruthy();
  });
});
