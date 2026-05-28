// tailwind.config.reference.cjs
// NOTE: This project uses Tailwind CSS v4 with CSS-based configuration.
// The actual theme config is in client/src/index.css using @theme directive.
// This file is kept as a reference for the intended configuration.

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './client/src/**/*.{ts,tsx,js,jsx,html}',
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        // Mapped to CSS variables in index.css @theme block
        cyan: {
          bright: 'var(--color-cyan-bright)',
          light: 'var(--color-cyan-light)',
          neon: 'var(--color-cyan-neon)',
          deep: 'var(--color-cyan-deep)',
        },
        emerald: {
          bright: 'var(--color-emerald-bright)',
          light: 'var(--color-emerald-light)',
          neon: 'var(--color-emerald-neon)',
          deep: 'var(--color-emerald-deep)',
        },
        chrome: {
          light: 'var(--color-chrome-light)',
          mid: 'var(--color-chrome-mid)',
        },
        dark: {
          obsidian: 'var(--color-obsidian)',
          charcoal: 'var(--color-charcoal)',
          onyx: 'var(--color-onyx)',
        }
      },
      borderRadius: {
        'xl-2xl': '1.5rem',
        '3xl': '1.75rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(6,182,212,0.45), 0 0 40px rgba(6,182,212,0.25)',
        'glow-primary': '0 0 25px rgba(6,182,212,0.4), 0 0 50px rgba(16,185,129,0.25)',
        'glow-emerald': '0 0 20px rgba(16,185,129,0.45), 0 0 40px rgba(16,185,129,0.25)',
        'glass': '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      fontFamily: {
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [
    // Note: Tailwind v4 doesn't use JS plugins the same way
    // Form styles are built-in, typography via @tailwindcss/typography
  ],
}
