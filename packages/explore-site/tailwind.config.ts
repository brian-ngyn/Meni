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
      },
      fontFamily: {
        sans: ["var(--font-body)", ...fontFamily.sans],
        serif: ["var(--font-header)", ...fontFamily.sans],
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
    require("tailwindcss-animate"),
    require("@tailwindcss/forms"),
  ],
} satisfies Config;
