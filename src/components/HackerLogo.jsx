// ─────────────────────────────────────────────────────────────
// HackerLogo — a small dotted ("halftone") hooded figure behind a laptop
// that shows >_ . Drawn as an SVG on a 40 × 40 grid, in the orange accent.
//
// How it is built: the page places a dot every STEP units. A dot is drawn
// only if it lies inside the hood and NOT inside the face or the laptop
// screen — so the face and the screen appear as dark cut-outs.
// The dots are calculated once, when the file loads.
// ─────────────────────────────────────────────────────────────

const VIEW = 40 // the drawing is 40 × 40 units
const STEP = 2.15 // distance between dots
const DOT_RADIUS = 0.64

/** Hood: a round dome on top of shoulders that get wider towards the bottom */
function isInHood(x, y) {
  const inDome = (x - 20) ** 2 + (y - 15) ** 2 <= 12.5 ** 2
  const shoulderHalfWidth = 12 + ((y - 22) / 16) * 6.5
  const inShoulders = y >= 22 && y <= 38.6 && Math.abs(x - 20) <= shoulderHalfWidth
  return inDome || inShoulders
}

/** Face: an oval that narrows to a pointed chin */
function isInFace(x, y) {
  const inOval = ((x - 20) / 7.6) ** 2 + ((y - 16.2) / 6.6) ** 2 <= 1
  const inChin = y >= 16.2 && y <= 25.2 && Math.abs(x - 20) <= 7.6 * ((25.2 - y) / 9)
  return inOval || inChin
}

/**
 * Laptop screen: wider at the top, like the reference picture.
 * The cut-out is a little bigger than the drawn outline (GAP), so no dot
 * touches the outline, and it reaches the bottom edge (no dots under it).
 */
const GAP = 0.9
function isInScreen(x, y) {
  if (y < 26.4 - GAP) return false
  const halfWidth = 11.6 - (Math.min(y - 26.4, 11) / 11) * 1.6 + GAP
  return Math.abs(x - 20) <= halfWidth
}

const DOTS = []
for (let y = STEP / 2; y < VIEW; y += STEP) {
  for (let x = STEP / 2; x < VIEW; x += STEP) {
    if (isInHood(x, y) && !isInFace(x, y) && !isInScreen(x, y)) DOTS.push([x, y])
  }
}

export default function HackerLogo({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className={className} aria-hidden="true" focusable="false">
      {/* The dotted hood */}
      <g className="fill-accent">
        {DOTS.map(([x, y], index) => (
          <circle key={index} cx={x} cy={y} r={DOT_RADIUS} />
        ))}
      </g>

      <g className="stroke-accent" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Two slanted, dashed eyes */}
        <path d="M13.9 15.9 L18.1 17.3" strokeWidth="1.05" strokeDasharray="1.05 0.75" />
        <path d="M21.9 17.3 L26.1 15.9" strokeWidth="1.05" strokeDasharray="1.05 0.75" />

        {/* The laptop screen outline */}
        <path d="M8.4 26.4 H31.6 L30 37.4 H10 Z" strokeWidth="0.6" opacity="0.85" />

        {/* >_ on the screen; the underscore blinks like a cursor */}
        <path d="M16.3 29.6 L19 31.6 L16.3 33.6" strokeWidth="1.1" />
        <path d="M20.4 33.7 H23.8" strokeWidth="1.1" className="animate-blink" />
      </g>
    </svg>
  )
}
