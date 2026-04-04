import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        btt: {
          bg: "var(--btt-bg)",
          surface: "var(--btt-surface)",
          muted: "var(--btt-muted)",
          border: "var(--btt-border)",
          primary: "var(--btt-primary)",
          accent: "var(--btt-accent)",
        },
      },
      boxShadow: {
        btt: "var(--btt-shadow)",
        "btt-sm": "var(--btt-shadow-sm)",
      },
      borderRadius: {
        btt: "var(--btt-radius)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "cart-pop": {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.12)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out forwards",
        "cart-pop": "cart-pop 0.45s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
