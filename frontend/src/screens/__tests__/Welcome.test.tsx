import { render, screen } from "@testing-library/react-native";
import React from "react";
import Welcome from "../Welcome";

jest.mock("@/theme/ThemeContext", () => ({
  useThemePreference: () => ({
    themePreference: 'auto',
    setThemePreference: jest.fn(),
  }),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: jest.fn(), push: jest.fn() }),
}));

describe("Welcome screen", () => {
  it("renders call-to-actions", () => {
    render(<Welcome />);
    expect(screen.getByText("Login")).toBeTruthy();
    expect(screen.getByText("Crie uma conta")).toBeTruthy();
  });
});
