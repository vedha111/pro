const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand: colors.violet,
      },
    },
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        "@font-face": {
          fontFamily: "Inter var",
          fontStyle: "normal",
          fontWeight: "100 900",
          fontDisplay: "swap",
          src: "url('/fonts/Inter-roman.var.woff2') format('woff2')",
          fontNamedInstance: "Regular",
        },
      });
    }),
    require("@tailwindcss/forms"),
  ],
};
