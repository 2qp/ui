import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextJsConfig,
  {
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double"],
      // "comma-dangle": ["error", "always-multiline"],
      "no-unused-vars": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "react/jsx-uses-react": "off",
      "react/jsx-indent": ["error", 2],
      "react/jsx-indent-props": ["error", 2],
      "react/jsx-curly-brace-presence": ["error", "never"],
      // "sort-imports": [
      //   "error",
      //   {
      //     ignoreCase: false,
      //     ignoreDeclarationSort: false,
      //     ignoreMemberSort: false,
      //   },
      // ],
      "turbo/no-undeclared-env-vars": "warn",
      "react/react-in-jsx-scope": "off",
    },
  },
];
