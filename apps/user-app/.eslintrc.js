/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/next.js"],  // Adjust based on your repo's eslint config
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  rules: process.env.VERCEL ? { "all": "off" } : {
    "react/no-unescaped-entities": "off",
    "@next/next/no-page-custom-font": "off"
  }
};
