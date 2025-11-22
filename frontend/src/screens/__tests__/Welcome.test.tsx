import { render, screen } from "@testing-library/react-native";
import React from "react";
import { AppThemeProvider } from "../../theme/provider";
import Welcome from "../Welcome";

function renderWithProviders(ui: React.ReactElement) {
  return render(<AppThemeProvider>{ui}</AppThemeProvider>);
}

jest.mock("@react-native-async-storage/async-storage", () => ({
  AsyncStorage: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: jest.fn(), push: jest.fn() }),
}));

describe("Welcome screen", () => {
  it("renders call-to-actions", () => {
    renderWithProviders(<Welcome />);
    expect(screen.getByText("Login")).toBeTruthy();
    expect(screen.getByText("Crie uma conta")).toBeTruthy();
  });
});
