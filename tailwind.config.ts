import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'btype-neon-cyan': '#22eaff',
        'btype-neon-fuchsia': '#ff3cf6',
        'btype-glass-dark': 'rgba(24,31,42,0.7)',
        'btype-glass-neon': 'rgba(34,234,255,0.12)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fadeIn": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fadeInUp": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fadeInLeft": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fadeInRight": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "subtle-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.95", transform: "scale(1.01)" },
        },
        "slide-pattern": {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "100% 100%" },
        },
        'btype-glow-pulse': {
          '0%, 100%': { filter: 'drop-shadow(0 0 8px #22eaff) drop-shadow(0 0 16px #22eaff)' },
          '50%': { filter: 'drop-shadow(0 0 16px #22eaff) drop-shadow(0 0 32px #22eaff)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fadeIn": "fadeIn 0.7s ease-in-out forwards",
        "subtle-pulse": "subtle-pulse 4s ease-in-out infinite",
        "slide-pattern": "slide-pattern 30s linear infinite",
        "fadeInUp": "fadeInUp 0.7s ease-out forwards",
        "fadeInLeft": "fadeInLeft 0.7s ease-out forwards",
        "fadeInRight": "fadeInRight 0.7s ease-out forwards",
        "pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 5s ease-in-out infinite",
        'btype-glow-pulse': 'btype-glow-pulse 2s ease-in-out infinite',
      },
      dropShadow: {
        'btype-neon-cyan': '0 0 8px #22eaff, 0 0 16px #22eaff',
        'btype-neon-fuchsia': '0 0 8px #ff3cf6, 0 0 16px #ff3cf6',
      },
      boxShadow: {
        'btype-neon-cyan': '0 0 12px 2px #22eaff44',
        'btype-neon-fuchsia': '0 0 12px 2px #ff3cf644',
      },
      backdropBlur: {
        'btype-lg': '16px',
      },
      borderColor: {
        'btype-neon-cyan': '#22eaff',
        'btype-neon-fuchsia': '#ff3cf6',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config

