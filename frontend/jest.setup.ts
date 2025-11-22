import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
    multiGet: jest.fn().mockResolvedValue([]),
    multiSet: jest.fn().mockResolvedValue(undefined),
    getAllKeys: jest.fn().mockResolvedValue([]),
  },
}));

// Mock Reanimated (v3 compatible)
// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// Simplify chart-kit components for tests
jest.mock('react-native-chart-kit', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  const MockLineChart = (props: any) => React.createElement(View, { accessibilityLabel: 'line-chart', ...props });
  MockLineChart.displayName = 'MockLineChart';
  return {
    LineChart: MockLineChart,
  };
});

// Avoid async icon font loading during tests
jest.mock('@expo/vector-icons/MaterialCommunityIcons', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  const MockIcon = () => React.createElement(View, { accessibilityLabel: 'icon' });
  MockIcon.displayName = 'MockMaterialCommunityIcon';
  return MockIcon;
});

// Silence React Native warnings that are noisy in tests
const originalWarn = global.console.warn;
global.console.warn = (...args: any[]) => {
  const message = args[0] ?? '';
  if (typeof message === 'string' && (
    message.includes('useNativeDriver') ||
    message.includes('Non-serializable values were found in the navigation state') ||
    message.includes('Tried to use the icon')
  )) {
    return;
  }
  originalWarn(...args);
};
