/* eslint-disable import/no-unresolved */
import path from 'path';
import { fileURLToPath } from 'url';

import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import pluginJs from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
  recommendedConfig: pluginJs.configs.recommended,
  allConfig: pluginJs.configs.all,
});

export default [
  {
    ignores: ['**/node_modules', '**/dist', './bundle.html'],
    languageOptions: { globals: globals.browser },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...fixupConfigRules(pluginReactConfig),
  ...compat.extends('plugin:import/typescript'),
  ...compat.extends('plugin:import/errors'),
  ...compat.config({
    plugins: ['react-hooks'],
    rules: eslintPluginReactHooks.configs.recommended.rules,
  }),
  ...compat.config({
    plugins: ['css-modules'],
    extends: 'plugin:css-modules/recommended',
    rules: {
      'css-modules/no-undef-class': 2,
      'css-modules/no-unused-class': 2,
    },
  }),
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: { ecmaFeatures: { tsx: true } },
    },
    rules: {
      'react/react-in-jsx-scope': 0,
      'no-console': 2,
      'no-var': 'error',
      'prefer-const': 'error',
      'object-curly-spacing': ['error', 'always'],
      camelcase: 0,
      'operator-linebreak': 0,
      'object-shorthand': ['error', 'always'],
      'prefer-promise-reject-errors': 2,
      'jsx-quotes': [2, 'prefer-double'],
      'react/self-closing-comp': 2,
      'react/sort-comp': 2,
      'react/prop-types': 0,
      'react/display-name': 0,
      'react/prefer-stateless-function': 2,
      'react/no-unknown-property': 2,
      'react/no-unescaped-entities': 2,
      'react/jsx-closing-bracket-location': 2,
      'react/jsx-tag-spacing': 2,
      'react/jsx-curly-spacing': 2,
      'no-case-declarations': 'off',
      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: 'return',
        },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Side effect imports.
            ['^\\u0000'],
            // Node.js builtins. You could also generate this regex if you use a `.js` config.
            [
              '^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)',
            ],
            // Packages. `react` related packages come first.
            ['^react', '^@?\\w'],
            // Internal packages. `lib` come first
            [
              '^(lib)(/.*|$)',
              '^(accounting|carriers|carrier-portal|equipment|shippers|shipper-portal|freight)(/.*|$)',
            ],
            // Parent imports. Put `..` last. Other relative imports. Put same-folder imports and `.` last.
            ['^\\.\\.(?!/?$)', '^\\.\\./?$', '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // assets and css imports.
            ['^(assets)(/.*|$)', '^.+\\.s?css$'],
          ],
        },
      ],
    },
  },
];
