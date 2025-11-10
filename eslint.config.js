import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import * as parserVue from 'vue-eslint-parser'
import configPrettier from 'eslint-config-prettier'
import pluginPrettier from 'eslint-plugin-prettier'
import tseslint from '@typescript-eslint/eslint-plugin'
import * as parserTs from '@typescript-eslint/parser'

export default [
  {
    ignores: ['node_modules', 'dist', '.husky'],
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        ecmaVersion: 'latest',
        parser: parserTs,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        navigator: 'readonly',
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        HTMLElement: 'readonly',
        File: 'readonly',
        FormData: 'readonly',
        FileReader: 'readonly',
        Blob: 'readonly',
        HTMLDivElement: 'readonly',
        KeyboardEvent: 'readonly',
        Symbol: 'readonly',
        NodeJS: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: pluginPrettier,
    },
    rules: {
      ...configPrettier.rules,
      'prettier/prettier': 'error',
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/no-unused-vars': 'off',
      'vue/no-v-html': 'off',
      'vue/no-dupe-v-else-if': 'off',
      'vue/no-required-prop-with-default': 'off',
      'vue/valid-v-model': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-undef': 'off',
      'no-redeclare': 'off',
      'no-control-regex': 'off',
      'no-useless-escape': 'off',
      'no-useless-catch': 'off',
      // Facade规则：禁止直接导入API客户端和SDK
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/services/api/AdminApiClient'],
              message:
                '❌ 禁止直接使用API客户端！请使用Facade: import { ... } from "@/services/api/facade"',
            },
            {
              group: ['@/services/api/_sdk'],
              message:
                '❌ 禁止直接使用SDK！请使用Facade: import { ... } from "@/services/api/facade"',
            },
            {
              group: [
                '@/services/api/users',
                '@/services/api/orders',
                '@/services/api/assets',
                '@/services/api/kyc',
                '@/services/api/config*',
                '@/services/api/risk',
                '@/services/api/ops',
                '@/services/api/settings',
              ],
              message:
                '❌ 禁止直接使用旧API服务！请使用Facade: import { ... } from "@/services/api/facade"',
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      'scripts/**/*.{js,ts,mjs,cjs}',
      '*.config.{js,ts}',
      'test*.{js,mjs}',
      'vite.config.ts',
      'vitest.config.ts',
    ],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
]
