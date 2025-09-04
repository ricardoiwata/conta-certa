import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';

// Mock Reanimated (v3 compatible)
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// Silence React Native warnings that are noisy in tests
const originalWarn = global.console.warn;
global.console.warn = (...args: any[]) => {
  const message = args[0] ?? '';
  if (typeof message === 'string' && (
    message.includes('useNativeDriver') ||
    message.includes('Non-serializable values were found in the navigation state')
  )) {
    return;
  }
  originalWarn(...args);
};

