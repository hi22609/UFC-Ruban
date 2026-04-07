import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'void': '#06070b',
        'bg-soft': '#0b0d14',
        'panel': 'rgba(14,17,27,0.88)',
        'panel-solid': '#10131c',
        'card': '#10131c',
        'elevated': '#0b0d14',
        'purple': '#8b5cf6',
        'magenta': '#d946ef',
        'indigo': '#4f46e5',
        'accent': '#8b5cf6',
        'gold': '#fbbf24',
        'green': '#10b981',
        'signal-green': '#10b981',
        'red': '#ef4444',
        'signal-red': '#ef4444',
        'muted': '#9ca3af',
        'line': 'rgba(255,255,255,0.08)',
        'line-strong': 'rgba(139,92,246,0.28)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['"Bebas Neue"', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
