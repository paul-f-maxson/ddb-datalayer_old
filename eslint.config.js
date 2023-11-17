import typescriptParser from "@typescript-eslint/parser";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    languageOptions: {
      parser: typescriptParser,
    },
    plugins: { typescriptEslint },
  },
  eslintConfigPrettier,
];
