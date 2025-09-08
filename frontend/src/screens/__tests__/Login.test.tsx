import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import LoginScreen from "../Login";

const mockReplace = jest.fn();
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}));

jest.mock("@/auth/AuthContext", () => ({
  useAuth: () => ({ user: null, loading: false }),
}));

const mockSignInEmail = jest.fn();
jest.mock("@/services/auth", () => ({
  signInEmail: (...args: any[]) => mockSignInEmail(...args),
}));

describe("LoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("navega para /homepage após login bem-sucedido", async () => {
    mockSignInEmail.mockResolvedValueOnce({ uid: "123" });

    const { getByTestId } = render(<LoginScreen />);
    fireEvent.changeText(getByTestId("login-email"), "user@example.com");
    fireEvent.changeText(getByTestId("login-password"), "secret");
    fireEvent.press(getByTestId("login-submit"));

    await waitFor(() => {
      expect(mockSignInEmail).toHaveBeenCalledWith(
        "user@example.com",
        "secret"
      );
      expect(mockReplace).toHaveBeenCalledWith("/homepage");
    });
  });

  it("mostra erro quando login falha", async () => {
    mockSignInEmail.mockRejectedValueOnce(new Error("Falha ao entrar."));

    const { getByTestId, findByText } = render(<LoginScreen />);
    fireEvent.changeText(getByTestId("login-email"), "user@example.com");
    fireEvent.changeText(getByTestId("login-password"), "wrong");
    fireEvent.press(getByTestId("login-submit"));

    expect(await findByText("Falha ao entrar.")).toBeTruthy();
  });
});
