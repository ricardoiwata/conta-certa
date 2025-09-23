import React from "react";
import { fireEvent, waitFor } from "@testing-library/react-native";
import AddIncome from "../AddIncome";
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

describe("AddIncome screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the income form and keeps submit disabled initially", () => {
    const { getByText, getByRole } = renderWithProviders(<AddIncome />);

    expect(getByText("Nova Receita")).toBeTruthy();
    const saveButton = getByRole("button", { name: "Salvar" });
    expect(saveButton.props.accessibilityState?.disabled).toBe(true);
  });

  it("shows snackbar after successful submission", async () => {
    const { getAllByTestId, getByRole, getByText, queryByText, findByText } =
      renderWithProviders(<AddIncome />);

    const textboxes = getAllByTestId("text-input-outlined");
    fireEvent.changeText(textboxes[0], "Salário");
    fireEvent.changeText(textboxes[1], "3200,00");
    fireEvent.changeText(textboxes[2], "2024-07-05");
    fireEvent.changeText(textboxes[3], "2024-07-01");

    fireEvent.press(getByText("Selecionar categoria (gasto)"));
    const categoriaOption = await findByText("Alimentação");
    fireEvent.press(categoriaOption);

    const saveButton = getByRole("button", { name: "Salvar" });
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(queryByText("Receita cadastrada (preview)")).toBeTruthy();
    });
  });
});
