// eslint-disable-next-line import/no-unresolved
import tseslint from 'typescript-eslint';
import globals from 'globals';
import unicorn from 'eslint-plugin-unicorn';
import testingLibrary from 'eslint-plugin-testing-library';
import sonarjs from 'eslint-plugin-sonarjs';
import hooks from 'eslint-plugin-react-hooks';
import react from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier/recommended';
import jest from 'eslint-plugin-jest';
import importPlugin from 'eslint-plugin-import';
import js from '@eslint/js';
import { fixupPluginRules } from '@eslint/compat';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  sonarjs.configs.recommended,
  {
    ignores: ['dist', 'coverage/*', 'package-lock.json'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2020,
        ...globals.builtin,
      },
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      import: fixupPluginRules(importPlugin),
      jest: fixupPluginRules(jest),
      unicorn: fixupPluginRules(unicorn),
    },
    settings: {
      'import/external-module-folders': ['node_modules'],
    },
    rules: {
      'sonarjs/max-switch-cases': ['error', 15],
      'sonarjs/no-empty-function': 'off',
      'sonarjs/no-unused-expressions': 'off',
      'sonarjs/todo-tag': 'warn',
      'sonarjs/fixme-tag': 'warn',
      'sonarjs/unused-import': 'off',
      'sonarjs/no-unused-vars': 'off',
      'no-console': 'error',
      'import/order': [
        'error',
        {
          'newlines-between': 'always-and-inside-groups',
          groups: [
            ['builtin', 'external'],
            'internal',
            ['parent', 'sibling'],
            ['index', 'object'],
          ],
          alphabetize: {
            order: 'desc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-unresolved': 'error',
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'single', 'all', 'multiple'],
          allowSeparatedGroups: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'no-shadow': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../../*'],
              message: 'Usage of relative parent imports is not allowed.',
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/locales/**',
      '**/__tests__/**/*.{js,jsx,ts,tsx}',
      '**/?(*.)+(spec|test).{js,jsx,ts,tsx}',
      'package-lock.json',
      '**/*.json',
      '**/config/**',
    ],
    rules: {
      'sonarjs/no-duplicate-string': 'off',
      'import/no-named-as-default': 'off',
    },
  },
  {
    files: ['**/*.json'],
    rules: { '@typescript-eslint/no-unused-expressions': 'off' },
  },
  {
    files: ['**/__tests__/**/*.[jt]s?(x)'],
    rules: {
      'sonarjs/no-nested-functions': 'off',
      'sonarjs/jsx-no-useless-fragment': 'off',
      'sonarjs/no-clear-text-protocols': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.js'],
    rules: {
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            camelCase: true,
          },
          checkDirectories: false,
        },
      ],
    },
  },
  {
    files: ['**/*.{ts,tsx,mts}'],
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          noWarnOnMultipleProjects: true,
          project: ['./tsconfig.json'],
        },
      },
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        warnOnUnsupportedTypeScriptVersion: true,
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-shadow': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-redeclare': 'error',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'memberLike',
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'variableLike',
          format: ['camelCase', 'PascalCase', 'snake_case'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'property',
          format: ['camelCase', 'snake_case', 'PascalCase', 'UPPER_CASE'],
          leadingUnderscore: 'allowSingleOrDouble',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          // Ignore properties that require quotes
          selector: [
            'classProperty',
            'objectLiteralProperty',
            'typeProperty',
            'classMethod',
            'objectLiteralMethod',
            'typeMethod',
            'accessor',
            'enumMember',
          ],
          format: null,
          modifiers: ['requiresQuotes'],
        },
      ],
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      react: fixupPluginRules(react),
      'react-hooks': fixupPluginRules(hooks),
      'testing-library': fixupPluginRules(testingLibrary),
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react-hooks/exhaustive-deps': 'error',
      'react/react-in-jsx-scope': 0,
      'react/jsx-uses-react': 0,
      'react/jsx-no-constructed-context-values': 'warn',
      'react/no-array-index-key': 'warn',
      'testing-library/no-await-sync-events': [
        'error',
        { eventModules: ['fire-event'] },
      ],
      'react/no-unknown-property': ['error', { ignore: ['global', 'jsx'] }],
    },
  },
  {
    files: ['**/*.jsx'],
    rules: {
      'react/prop-types': ['error'],
    },
  },
  {
    files: ['**/*.tsx', '**/*.jsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "JSXOpeningElement[name.name='form']:not(:has(JSXAttribute[name.name='method']))",
          message:
            'Forms must explicitly set method="post" to avoid the native browser GET fallback.',
        },
        {
          selector:
            "JSXOpeningElement[name.name='form'] > JSXAttribute[name.name='method']:not([value.type='Literal'][value.value='post'])",
          message:
            'Forms must explicitly set method="post" to avoid the native browser GET fallback.',
        },
      ],
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            pascalCase: true,
          },
          multipleFileExtensions: false,
          ignore: ['index.(j|t)sx'],
          checkDirectories: false,
        },
      ],
    },
  },
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
  prettier,
];
