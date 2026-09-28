import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default [
  ...tseslint.configs.recommended,
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**'],
  },
];