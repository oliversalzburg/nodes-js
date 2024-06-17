/** @type {import("prettier").Config} */
export default {
  printWidth: 100,
  arrowParens: "avoid",
  plugins: ["prettier-plugin-organize-imports"],
  overrides: [
    {
      files: "*.md",
      options: {
        tabWidth: 2,
      },
    },
  ],
};
