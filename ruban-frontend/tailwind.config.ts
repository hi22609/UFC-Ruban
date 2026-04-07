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
        'void': '#0a0a0f',
        'card': '#141419',
        'elevated': '#1a1a20',
        'accent': '#6366f1',
        'accent-glow': 'rgba(99, 102, 241, 0.15)',
        'signal-green': '#10b981',
        'signal-red': '#ef4444',
        'gold': '#fbbf24',
        'muted': '#9ca3af',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
