import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        btt: {
          bg: "var(--btt-bg)",
          elevated: "var(--btt-elevated)",
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
        glow: "var(--btt-glow)",
      },
      borderRadius: {
        btt: "var(--btt-radius)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "cart-pop": {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "scale-in": "scale-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        float: "float 5s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        "cart-pop": "cart-pop 0.45s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
