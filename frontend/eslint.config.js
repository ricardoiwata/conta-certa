// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  // Base Expo + React Native + TS rules
  ...expoConfig,

  // Project-specific settings
  {
    ignores: [
      'dist/**',
      'build/**',
      'coverage/**',
      '.expo/**',
    ],
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // CLI scripts can use console freely
  {
    files: ['scripts/**/*.js'],
    rules: {
      'no-console': 'off',
    },
  },
]);
