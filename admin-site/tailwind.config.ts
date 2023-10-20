import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        backdrop: "#202023",
        card: "#353535",
        white: "#F7F7F7",
        grey: "#4D4D4F",
        accent: "#505050",
      },
      fontFamily: {
        sans: ["var(--font-mont)"],
        serif: ["var(--font-abril)"],
      },
    },
  },
  plugins: [
    require("tw-elements/dist/plugin"),
    require("tailwind-scrollbar-hide"),
  ],
} satisfies Config;
