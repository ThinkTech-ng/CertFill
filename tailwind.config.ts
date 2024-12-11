import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      generalSans: ["var(--font-generalSans)"],
      ttNorms: ["var(--font-ttNorms)"],
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
