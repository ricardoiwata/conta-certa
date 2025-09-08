import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

import RegisterScreen from "../Register";

const mockReplace = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace, back: jest.fn() }),
}));

jest.mock("@/auth/AuthContext", () => ({
  useAuth: () => ({ user: null, loading: false }),
}));

const mockSignUpEmail = jest.fn();
jest.mock("@/services/auth", () => ({
  signUpEmail: (...args: any[]) => mockSignUpEmail(...args),
}));

describe("RegisterScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("mostra mensagem amigável quando email já existe", async () => {
    mockSignUpEmail.mockRejectedValueOnce({
      code: "auth/email-already-in-use",
      message: "Firebase: Error (auth/email-already-in-use).",
    });

    const { getByTestId, findAllByText } = render(<RegisterScreen />);

    fireEvent.changeText(getByTestId("register-name"), "Nome Usuário");
    fireEvent.changeText(getByTestId("register-email"), "user@example.com");
    fireEvent.changeText(getByTestId("register-password"), "123456");
    fireEvent.changeText(getByTestId("register-confirm"), "123456");
    fireEvent.press(getByTestId("register-submit"));

    const errs = await findAllByText("O e-mail já está cadastrado");
    expect(errs.length).toBeGreaterThan(0);
  });

  it("cadastro bem-sucedido navega para /", async () => {
    mockSignUpEmail.mockResolvedValueOnce({ uid: "x" });

    const { getByTestId } = render(<RegisterScreen />);

    fireEvent.changeText(getByTestId("register-name"), "Nome Usuário");
    fireEvent.changeText(getByTestId("register-email"), "user@example.com");
    fireEvent.changeText(getByTestId("register-password"), "123456");
    fireEvent.changeText(getByTestId("register-confirm"), "123456");
    fireEvent.press(getByTestId("register-submit"));

    await waitFor(() => {
      expect(mockSignUpEmail).toHaveBeenCalledWith(
        "user@example.com",
        "123456",
        "Nome Usuário"
      );
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });
});
