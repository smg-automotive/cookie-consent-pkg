module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: ['@smg-automotive/eslint-config/react'],
  parser: '@typescript-eslint/parser',
  rules: {
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
  },
};
