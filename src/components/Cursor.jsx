// A thin blinking caret shown while the AI is "typing".
// The blink is a pure CSS animation (see tailwind.config.js → keyframes.blink),
// so it costs nothing in React re-renders.
export default function Cursor({ className = 'bg-accent' }) {
  return (
    <span
      aria-hidden="true"
      className={`ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.15em] animate-blink rounded-full ${className}`}
    />
  )
}
