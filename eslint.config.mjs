import tseslint from 'typescript-eslint';
import globals from 'globals';
import react from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier/recommended';
import js from '@eslint/js';

const javascriptFiles = ['**/*.{js,mjs,cjs,jsx,ts,tsx}'];
const reactFiles = ['**/*.{jsx,tsx}'];
const testFiles = [
  '**/__tests__/**/*.{js,jsx,ts,tsx}',
  '**/*.{spec,test}.{js,jsx,ts,tsx}',
];

export default [
  {
    ignores: ['coverage/**', 'dist/**', 'package-lock.json'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: javascriptFiles,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: testFiles,
    languageOptions: {
      globals: globals.jest,
    },
  },
  {
    ...react.configs.flat.recommended,
    files: reactFiles,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    ...react.configs.flat['jsx-runtime'],
    files: reactFiles,
  },
  {
    files: ['**/*.tsx'],
    rules: {
      'react/prop-types': 'off',
    },
  },
  prettier,
];
