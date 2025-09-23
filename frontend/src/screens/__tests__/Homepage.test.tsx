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

describe("Homepage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders main cards and greeting", () => {
    const { getByText } = renderWithProviders(<Homepage />);

    expect(getByText("Bem-vindo(a) de volta")).toBeTruthy();
    expect(getByText("Saldo atual")).toBeTruthy();
    expect(getByText("Resumo do mês")).toBeTruthy();
    expect(getByText("Receita x Despesa")).toBeTruthy();
  });

  it("navigates when tapping summary card", () => {
    const { getByTestId } = renderWithProviders(<Homepage />);

    fireEvent.press(getByTestId("summary-card"));
    expect(mockRouter.push).toHaveBeenCalledWith("/details/summary");
  });
});
