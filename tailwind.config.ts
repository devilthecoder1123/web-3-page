import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--h-bg) / <alpha-value>)",
        fg: "rgb(var(--h-fg) / <alpha-value>)",
        neon: "rgb(var(--h-neon) / <alpha-value>)",
        neon2: "rgb(var(--h-neon2) / <alpha-value>)",
        alert: "rgb(var(--h-alert) / <alpha-value>)",
        panel: "rgb(var(--h-panel) / <alpha-value>)",
      },
      boxShadow: {
        neon: "0 0 0.5rem rgb(var(--h-neon) / 0.35), 0 0 2.25rem rgb(var(--h-neon) / 0.15)",
        alert: "0 0 0.75rem rgb(var(--h-alert) / 0.35), 0 0 2.5rem rgb(var(--h-alert) / 0.12)",
      },
      keyframes: {
        glowPulse: {
          "0%, 100%": { opacity: "0.9", transform: "translateZ(0) scale(1)" },
          "50%": { opacity: "1", transform: "translateZ(0) scale(1.02)" },
        },
        crtFlicker: {
          "0%, 100%": { opacity: "1" },
          "7%": { opacity: "0.92" },
          "8%": { opacity: "0.98" },
          "15%": { opacity: "0.9" },
          "16%": { opacity: "1" },
          "55%": { opacity: "0.97" },
          "56%": { opacity: "0.9" },
          "57%": { opacity: "1" },
        },
        glitchShift: {
          "0%": { transform: "translate3d(0,0,0)" },
          "20%": { transform: "translate3d(-1px, 0, 0)" },
          "40%": { transform: "translate3d(1px, 0, 0)" },
          "60%": { transform: "translate3d(-2px, 0, 0)" },
          "80%": { transform: "translate3d(2px, 0, 0)" },
          "100%": { transform: "translate3d(0,0,0)" },
        },
      },
      animation: {
        glow: "glowPulse 1.4s ease-in-out infinite",
        flicker: "crtFlicker 6s steps(1) infinite",
        glitch: "glitchShift 240ms steps(2) infinite",
      },
    },
  },
  plugins: [],
};

export default config;

