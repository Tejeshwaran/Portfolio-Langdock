/** @type {import('tailwindcss').Config} */

// ─────────────────────────────────────────────────────────────
// COLORS: the site has a DARK and a LIGHT look (the sun/moon button in
// the top bar switches, see src/theme/ThemeContext.jsx).
//
// The real colour values live in src/index.css as CSS variables, once
// for light (:root) and once for dark ([data-theme='dark']). Here every
// name only points at its variable, so one class like `bg-canvas` works
// in both looks. `<alpha-value>` keeps opacity classes working
// (e.g. `bg-ink/5`).
//
// Layout and feel follow the Langdock app (sidebar + chat), but with
// Tejeshwaran's own logo, words and colours — nothing is copied.
// ─────────────────────────────────────────────────────────────

/** 'canvas' → 'rgb(var(--c-canvas) / <alpha-value>)' */
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: token('canvas'), // main background
        sidebar: token('sidebar'), // the left sidebar
        surface: token('surface'), // cards and panels
        subtle: token('subtle'), // quiet fills (chips, hovers)
        composer: token('composer'), // the prompt box
        bubble: token('bubble'), // visitor chat bubbles
        line: token('line'), // default borders
        'line-strong': token('line-strong'), // hovered borders
        ink: token('ink'), // headings, main text, the pill buttons
        body: token('body'), // paragraph text
        muted: token('muted'), // labels, placeholders, secondary text
        accent: {
          DEFAULT: token('accent'), // the accent (icons, cursor, progress)
          strong: token('accent-strong'), // accent text on accent backgrounds
          soft: token('accent-soft'), // accent backgrounds (a tint)
          fill: token('accent-fill'), // solid accent buttons (the voice button)
        },
        success: token('success'), // "online" dots, "copied" ticks
        // The intro pages use the same values under their own names (src/onboarding/)
        term: {
          bg: token('canvas'),
          panel: token('surface'),
          line: token('line'),
          ink: token('ink'),
          muted: token('muted'),
          accent: token('accent'),
          green: token('success'),
        },
      },
      fontFamily: {
        // Geist (free, Google Fonts) for text and headlines — a clean
        // grotesque close to Langdock's style — and Geist Mono for the
        // small "terminal" details. Headlines get tight letter spacing.
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        display: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        code: ['"Geist Mono"', 'ui-monospace', 'monospace'],
        plex: ['Geist', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        // Flat design: almost no shadows, only a soft lift for floating things
        card: '0 1px 2px rgb(0 0 0 / 0.04)',
        lift: '0 16px 40px -18px rgb(0 0 0 / 0.35)',
      },
      keyframes: {
        // Voice button bars while listening
        voiceBar: {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1)' },
        },
        // Shimmering "Thinking" text
        shimmer: {
          '0%': { backgroundPosition: '100% 0' },
          '100%': { backgroundPosition: '-100% 0' },
        },
        // Blinking text cursor while the AI "types"
        blink: {
          '0%, 45%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        // The three "thinking" dots
        pulseDot: {
          '0%, 80%, 100%': { transform: 'translateY(0)', opacity: '0.35' },
          '40%': { transform: 'translateY(-3px)', opacity: '1' },
        },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        'pulse-dot': 'pulseDot 1.1s ease-in-out infinite',
        'voice-bar': 'voiceBar 0.9s ease-in-out infinite',
        shimmer: 'shimmer 1.8s linear infinite',
      },
    },
  },
  plugins: [],
}
