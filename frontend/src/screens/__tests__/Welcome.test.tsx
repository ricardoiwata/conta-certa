import { render, screen } from "@testing-library/react-native";
import React from "react";
import { AppThemeProvider } from "../../theme/provider";
import Welcome from "../Welcome";

function renderWithProviders(ui: React.ReactElement) {
  return render(<AppThemeProvider>{ui}</AppThemeProvider>);
}

describe("Welcome screen", () => {
  it("renders call-to-actions", () => {
    renderWithProviders(<Welcome />);
    expect(screen.getByText("Login")).toBeTruthy();
    expect(screen.getByText("Crie uma conta")).toBeTruthy();
  });
});
