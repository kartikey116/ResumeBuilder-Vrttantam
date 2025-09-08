// tailwind.config.js
const { default: flattenColorPalette } = require("tailwindcss/lib/util/flattenColorPalette");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#9333ea",
        accent: "#f43f5e",
        neutral: "#64748b",
      },
    },
  },
  plugins: [
    function ({ addBase, theme }) {
      const colors = flattenColorPalette(theme("colors"));
      const safeColors = {};

      Object.entries(colors).forEach(([key, val]) => {
        safeColors[`--tw-color-${key}`] =
          typeof val === "string" && (val.includes("oklch(") || val.includes("lab("))
            ? "#000000"
            : val;
      });

      addBase({
        ":root": safeColors,
      });
    },
  ],
};
