/** @type {import('tailwindcss').Config} */

// ─────────────────────────────────────────────────────────────
// COLORS: change the whole look of the site here.
// Theme: "Concept B — Command Prompt" (UI Ideas/) — warm near-black,
// warm white, one orange accent.
// Every component uses these names (bg-canvas, text-ink, border-line,
// text-accent ...) instead of raw hex values.
// ─────────────────────────────────────────────────────────────
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#121214', // page background (warm near-black)
        surface: '#1A191E', // cards and panels
        subtle: '#211F25', // quiet fills (chips, skeletons)
        composer: '#1D1C21', // the prompt bar ("Ask anything")
        bubble: '#26252B', // user chat bubbles
        line: '#2A292F', // default borders
        'line-strong': '#3B3A41', // hovered borders
        ink: '#F0EFEA', // headings and main text (warm white)
        body: '#C9C6C0', // paragraph text
        muted: '#8F8D88', // labels, placeholders, secondary text
        accent: {
          DEFAULT: '#E0935F', // the orange accent (text, icons, cursor)
          strong: '#F0B18B', // accent text on accent backgrounds / hover
          soft: '#2A201A', // accent backgrounds (a dark orange tint)
          fill: '#E0935F', // solid accent buttons (the voice button)
        },
        success: '#7FBF8F', // "online" dots, "copied" ticks
        // The intro pages use the same values under their own names (src/onboarding/)
        term: {
          bg: '#121214', // warm near-black
          panel: '#1A191E', // terminal panels
          line: '#2A292F', // borders
          ink: '#F0EFEA', // warm white text
          muted: '#8F8D88', // secondary text
          accent: '#E0935F', // the orange prompt colour
          green: '#7FBF8F', // "online" dot and "ok"
        },
      },
      fontFamily: {
        // Concept B fonts: IBM Plex Sans for text, IBM Plex Mono for the
        // "terminal" details, Fraunces (a serif) for big headlines
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        display: ['Fraunces', 'Georgia', 'serif'],
        code: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        plex: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: 'inset 0 1px 0 rgba(255,255,255,0.03)',
        lift: '0 18px 40px -16px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.04)',
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
