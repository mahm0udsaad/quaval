/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          dark: "var(--color-primary-dark)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          light: "var(--color-secondary-light)",
        },
        accent: "var(--color-accent)",
        background: "var(--color-background)",
        text: {
          DEFAULT: "var(--color-text)",
          light: "var(--color-text-light)",
        },
        // Add these shadcn/ui required colors
        border: "hsl(214.3 31.8% 91.4%)",
        input: "hsl(214.3 31.8% 91.4%)",
        ring: "var(--color-primary)",
        foreground: "var(--color-text)",
        popover: {
          DEFAULT: "white", // This fixes your transparent dropdown
          foreground: "var(--color-text)",
        },
        card: {
          DEFAULT: "white",
          foreground: "var(--color-text)",
        },
        muted: {
          DEFAULT: "hsl(210 40% 96.1%)",
          foreground: "hsl(215.4 16.3% 46.9%)",
        },
        accent: {
          DEFAULT: "hsl(210 40% 96.1%)",
          foreground: "var(--color-text)",
        },
        destructive: {
          DEFAULT: "var(--color-accent)",
          foreground: "white",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}