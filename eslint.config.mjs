import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import reactHooks from 'eslint-plugin-react-hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    plugins: { 'react-hooks': reactHooks },
    extends: compat.extends("next/core-web-vitals", "next/typescript"),
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]);
