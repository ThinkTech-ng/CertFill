import type { Config } from "tailwindcss";
const plugin = require("tailwindcss/plugin");

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      // Add your custom fonts with fallback
      generalSans: ["var(--font-generalSans)"],
      ttNorms: ["var(--font-ttNorms)"],
      inter: ["var(--font-inter)"],
      roboto: ["var(--font-roboto)"],
      lora: ["var(--font-lora)"],
      poppins: ["var(--font-poppins)"],
      "dancing-script": ["var(--font-dancing)"],
      montserrat: ["var(--font-montserrat)"],
    },

    extend: {
      colors: {
        colors: {
          certFillBlue: "#011520",
          certFillLightBlue: "#00A2B9",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
