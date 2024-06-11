import { fixupConfigRules } from '@eslint/compat';
import pluginJs from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['**/node_modules', '**/dist', './bundle.html'],
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...fixupConfigRules(pluginReactConfig),
  {
    files: ['**/*.tsx'],
    languageOptions: { parserOptions: { ecmaFeatures: { tsx: true } } },
    rules: {
      'react/react-in-jsx-scope': 0,
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
  eslintPluginPrettierRecommended,
];
