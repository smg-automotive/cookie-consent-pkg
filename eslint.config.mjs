import globals from 'globals';
// eslint-disable-next-line import/no-unresolved
import reactConfig from '@smg-automotive/eslint-config/react';

export default [
  ...reactConfig,
  {
    ignores: ['!/.jest', '!.prettierrc.mjs'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.es2021,
      },
    },
  },
];
