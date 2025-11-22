import React from "react";
import { renderWithProviders } from "@/test-utils/render";
import BalanceDetailScreen from "../details/BalanceDetailScreen";

const mockRouter = {
  back: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
};

jest.mock("expo-router", () => ({
  useRouter: () => mockRouter,
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  AsyncStorage: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock("@/services/dashboard", () => ({
  getDashboardData: jest.fn().mockResolvedValue({}),
  getIncomeVsExpenseDetail: jest.fn().mockResolvedValue({}),
}));

describe("Dashboard detail screens", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders balance detail screen", () => {
    const { getByText } = renderWithProviders(<BalanceDetailScreen />);
    expect(getByText).toBeDefined();
  });
});
