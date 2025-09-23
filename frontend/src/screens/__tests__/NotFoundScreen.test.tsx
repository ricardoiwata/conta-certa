import React from "react";
import { fireEvent } from "@testing-library/react-native";
import NotFoundScreen from "../NotFoundScreen";
import { renderWithProviders } from "@/test-utils/render";

const mockRouter = {
  back: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
};

const mockReact = React;

jest.mock("expo-router", () => {
  return {
    useRouter: () => mockRouter,
    Link: ({ href, children }: any) =>
      mockReact.cloneElement(children, {
        onPress: () => mockRouter.push(href),
      }),
    Stack: { Screen: () => null },
  };
});

jest.mock("@/theme/provider", () => ({
  useAppTheme: () => ({ colors: { background: "#fff", text: "#000" } }),
}));

describe("NotFoundScreen", () => {
  it("renders message and allows navigation", () => {
    const { getByText } = renderWithProviders(<NotFoundScreen />);

    expect(getByText("Ops! Página não encontrada")).toBeTruthy();

    fireEvent.press(getByText("Voltar ao início"));
    expect(mockRouter.push).toHaveBeenCalledWith("/");
  });
});
