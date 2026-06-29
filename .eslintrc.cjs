module.exports = {
  root: true,
  extends: ["expo", "prettier"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/consistent-type-imports": "error"
  },
  ignorePatterns: ["node_modules", ".expo", "dist"]
};
