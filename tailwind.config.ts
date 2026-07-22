import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./config/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Xanh rừng sâu — tông thiền/dưỡng sinh
        brand: {
          50: "#f2f6f3",
          100: "#e0ebe3",
          200: "#c2d7c9",
          300: "#98bba4",
          400: "#6b9a7b",
          500: "#4a7c5d",
          600: "#386249",
          700: "#2d4e3b",
          800: "#263f30",
          900: "#1f3327",
        },
        // Vàng đồng — nhấn sang trọng
        gold: {
          50: "#faf6ee",
          100: "#f3e9d3",
          200: "#e7d2a7",
          300: "#d8b673",
          400: "#cca154",
          500: "#b8863c",
          600: "#9e6d31",
          700: "#7e532a",
          800: "#6a4527",
          900: "#5a3b24",
        },
        // Nền kem ấm
        cream: "#f7f3ec",
        ink: "#26312b",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Vòng sáng lan tỏa quanh nút CTA
        glow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(204, 161, 84, 0.55)" },
          "50%": { boxShadow: "0 0 0 12px rgba(204, 161, 84, 0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
        glow: "glow 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
