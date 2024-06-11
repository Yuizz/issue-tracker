import { nextui } from "@nextui-org/react";
import { type Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        "responsive-300": "repeat(auto-fit, minmax(300px, 1fr))"
      }
    },
  },
  darkMode: "class",
  plugins: [nextui(), require("tailwindcss-animate")],
} satisfies Config;
