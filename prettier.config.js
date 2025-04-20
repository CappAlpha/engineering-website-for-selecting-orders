module.exports = {
  sortingMethod: "lineLength",
  plugins: ["./node_modules/prettier-plugin-sort-imports/dist/index.js"],
  overrides: [
    {
      files: ["*.json", "*.md", "*.scss", "*.yml", "*.yaml"],
      options: {
        singleQuote: false,
      },
    },
    {
      files: ["*.ts", "*.tsx"],
      options: {
        arrowParens: "always",
      },
    },
  ],
};
