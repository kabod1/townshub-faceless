import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ["var(--font-syne)", "sans-serif"],
        dm: ["var(--font-dm-sans)", "sans-serif"],
      },
      colors: {
        navy: {
          950: "#04080F",
          900: "#080D1A",
          800: "#0C1526",
          700: "#111E35",
          600: "#172645",
        },
        cyan: {
          glow: "#00D4FF",
          soft: "#7DE8FF",
          dim: "#00A8CC",
        },
        coral: {
          glow: "#FF6B35",
          soft: "#FF9166",
          dim: "#CC5528",
        },
        surface: {
          1: "#0F1829",
          2: "#162035",
          3: "#1E2D47",
          4: "#263858",
        },
        border: {
          subtle: "rgba(0, 212, 255, 0.12)",
          medium: "rgba(0, 212, 255, 0.25)",
          strong: "rgba(0, 212, 255, 0.45)",
        },
      },
      backgroundImage: {
        "grid-navy": "radial-gradient(rgba(0,212,255,0.06) 1px, transparent 1px)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-glow": "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,212,255,0.15), transparent)",
        "card-shine": "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 60%)",
      },
      backgroundSize: {
        "grid": "28px 28px",
      },
      boxShadow: {
        "cyan-sm": "0 0 12px rgba(0,212,255,0.2)",
        "cyan-md": "0 0 24px rgba(0,212,255,0.3)",
        "cyan-lg": "0 0 48px rgba(0,212,255,0.25)",
        "coral-sm": "0 0 12px rgba(255,107,53,0.2)",
        "coral-md": "0 0 24px rgba(255,107,53,0.3)",
        "card": "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.5), 0 0 20px rgba(0,212,255,0.1)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "shimmer": "shimmer 2s linear infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to: { backgroundPosition: "200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
