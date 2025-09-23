import React from "react";
import { fireEvent, waitFor } from "@testing-library/react-native";
import Profile from "../Profile";
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
  useAuth: () => ({ user: { displayName: "Teste", email: "test@example.com" } }),
}));

jest.mock("@/services/auth", () => ({
  __esModule: true,
  signOutUser: jest.fn(),
}));

const mockSignOutUser = jest.requireMock("@/services/auth").signOutUser as jest.Mock;

describe("Profile screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSignOutUser.mockResolvedValue(undefined);
  });

  it("shows user data and signs out on press", async () => {
    const { getByText } = renderWithProviders(<Profile />);

    expect(getByText("Teste")).toBeTruthy();
    expect(getByText("test@example.com")).toBeTruthy();

    fireEvent.press(getByText("Sair da conta"));

    await waitFor(() => {
      expect(mockSignOutUser).toHaveBeenCalled();
      expect(mockRouter.replace).toHaveBeenCalledWith("/login");
    });
  });
});
