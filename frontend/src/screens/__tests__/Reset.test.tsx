import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import ResetScreen from "../Reset";

import { resetPassword } from "@/services/auth";

jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: jest.fn(), push: jest.fn(), back: jest.fn() }),
}));

jest.mock("@/auth/AuthContext", () => ({
  useAuth: () => ({ user: null, loading: false }),
}));
jest.mock("@/services/auth", () => ({
  resetPassword: jest.fn(),
}));

describe("ResetScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("envia email de reset e mostra confirmação", async () => {
    (resetPassword as jest.Mock).mockResolvedValueOnce(undefined);

    const { getByTestId, findByText } = render(<ResetScreen />);
    fireEvent.changeText(getByTestId("reset-email"), "  user@example.com  ");
    fireEvent.press(getByTestId("reset-submit"));

    expect(resetPassword).toHaveBeenCalledWith("user@example.com");
    expect(
      await findByText("E-mail enviado! Verifique sua caixa de entrada.")
    ).toBeTruthy();
  });
});
