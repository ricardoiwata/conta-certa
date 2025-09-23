import React from "react";
import { fireEvent, waitFor } from "@testing-library/react-native";
import AddExpense from "../AddExpense";
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
  useAuth: () => ({ user: { uid: "user-1" } }),
}));

describe("AddExpense screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the expense form and keeps submit disabled initially", () => {
    const { getByText, getByRole } = renderWithProviders(<AddExpense />);

    expect(getByText("Nova Despesa")).toBeTruthy();
    const saveButton = getByRole("button", { name: "Salvar" });
    expect(saveButton.props.accessibilityState?.disabled).toBe(true);
  });

  it("allows submitting when fields are valid", async () => {
    const { getByRole, getAllByTestId, getByText, queryByText, findByText } =
      renderWithProviders(<AddExpense />);

    const textboxes = getAllByTestId("text-input-outlined");
    fireEvent.changeText(textboxes[0], "Mercado do mês");
    fireEvent.changeText(textboxes[1], "150,90");
    fireEvent.changeText(textboxes[2], "2024-07-10");
    fireEvent.changeText(textboxes[3], "2024-07-01");

    fireEvent.press(getByText("Selecionar categoria (gasto)"));
    const categoriaOption = await findByText("Alimentação");
    fireEvent.press(categoriaOption);

    const saveButton = getByRole("button", { name: "Salvar" });
    expect(saveButton.props.accessibilityState?.disabled).toBe(false);

    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(queryByText("Despesa cadastrada (preview)")).toBeTruthy();
    });
  });
});
