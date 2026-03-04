import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import { jsdoc } from "eslint-plugin-jsdoc";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-require-imports": "off", // TTP uses commonjs
      "@typescript-eslint/no-unused-vars": [
        "error",
        { args: "none", varsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_" },
      ],
      "@typescript-eslint/ban-ts-comment": ["error", { "ts-nocheck": "allow-with-description" }],
    },
  },
  {
    files: ["src/**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: 2023,
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": "off",
      "no-redeclare": [
        "error",
        {
          // avoids error when importing the TTP globals
          builtinGlobals: false,
        },
      ],
    },
  },
  jsdoc({
    config: "flat/recommended-typescript-flavor",
    settings: {
      structuredTags: {
        remarks: { type: false },
      },
    },
    rules: {
      "jsdoc/tag-lines": "off",
      "jsdoc/require-jsdoc": "off",
      "jsdoc/require-returns": "off",
      "jsdoc/no-undefined-types": ["warn", { disableReporting: true }],
      "jsdoc/require-param-description": "off",
      "jsdoc/require-returns-description": "off",
    },
  }),
  eslintConfigPrettier,
]);
