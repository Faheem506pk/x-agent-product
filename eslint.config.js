import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginTypescript from '@typescript-eslint/eslint-plugin';
import eslintPluginReactRefresh from 'eslint-plugin-react-refresh';
import eslintPluginImport from 'eslint-plugin-import';

export default [
  {
    // Flat config: ignore patterns
    ignores: [
      "node_modules",
      "scripts/*",
      "config/*",
      "pnpm-lock.yaml",
      "pnpm-workspace.yaml",
      ".DS_Store",
      "package.json",
      "tsconfig.json",
      "**/*.md",
      "build",
      ".eslintrc.cjs",
      "eslint.config.js",
      "**/.*" // Ignore all dotfiles (like .gitignore)
    ],
  },
  {
    // Language options (ES Modules, JSX)
    languageOptions: {
      ecmaVersion: 2021,  // ES2021 syntax support
      sourceType: 'module',
      globals: {
        window: 'readonly', // For browser-based globals
        document: 'readonly',
        Edit: 'writable',
        console: 'writable',
        _: 'writable',
        $: 'writable',
      },
      ecmaFeatures: {
        jsx: true, // Enable JSX parsing
      },
    },
    
    // Plugins to be used
    plugins: {
      react: eslintPluginReact,
      'react-hooks': eslintPluginReactHooks,
      prettier: eslintPluginPrettier,
      '@typescript-eslint': eslintPluginTypescript,
      'react-refresh': eslintPluginReactRefresh,
      import: eslintPluginImport,
    },
    
    // ESLint rule configurations (extends equivalent in Flat Config)
    rules: {
      ...eslintPluginReact.configs.recommended.rules,
      ...eslintPluginReactHooks.configs.recommended.rules,
      ...eslintPluginTypescript.configs.recommended.rules,
      ...eslintPluginPrettier.configs.recommended.rules,
      'prettier/prettier': 'error', // Prettier formatting as an ESLint rule
    },
    
    settings: {
      react: {
        version: 'detect',  // Automatically detect the React version
      },
    },
  },
];
