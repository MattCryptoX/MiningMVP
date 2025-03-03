module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier"],
  ignorePatterns: ["/dist/*"],
  rules: {
    "react-hooks/exhaustive-deps": "off",
    "prettier/prettier": "error",
    quotes: ["error", "double"],
    "object-curly-spacing": ["error", "always"],
  },
};
