import React from "react";
import { render, RenderOptions } from "@testing-library/react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";

const fallbackMetrics = {
  frame: { x: 0, y: 0, width: 320, height: 640 },
  insets: { top: 0, bottom: 0, left: 0, right: 0 },
};

export function renderWithProviders(ui: React.ReactElement, options?: RenderOptions) {
  return render(
    <PaperProvider>
      <SafeAreaProvider initialMetrics={initialWindowMetrics ?? fallbackMetrics}>
        {ui}
      </SafeAreaProvider>
    </PaperProvider>,
    options,
  );
}
