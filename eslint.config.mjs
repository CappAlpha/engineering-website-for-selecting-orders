// eslint.config.mjs
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";
import tsEslint from "typescript-eslint";

export default tsEslint.config(
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "prisma/generated/**",
      "prisma/**/client/*.d.ts", 
    ],
  },

  {
    plugins: {
      "react-hooks": reactHooks,
      "@next/next": nextPlugin,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/consistent-type-imports": "warn",
    },
  },

  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs", "**/*.d.ts"],
    ...tsEslint.configs.disableTypeChecked,
  },

  js.configs.recommended,
  ...tsEslint.configs.recommendedTypeChecked,
);