import { useContext, useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { RevealContext } from './PopIn'

// ─────────────────────────────────────────────────────────────
// TableTennisStage — a ball is served, bounces over a table-tennis table,
// flies up to the middle, pops, and the word ("Table Tennis") bursts out
// of it letter by letter. Afterwards a small rally keeps going.
//
// The drawing is an SVG with its own coordinates (600 × 220), so it
// scales to any card width. The ball moves with Framer Motion keyframes:
// `cx` / `cy` are lists of positions, `times` says when each is reached,
// and the `ease` per step makes it fall faster (easeIn) and rise slower
// (easeOut), like a real bounce.
//
// Phases: waiting → serve → burst → rally
// ─────────────────────────────────────────────────────────────

const TABLE_Y = 170 // the table surface
const BALL_R = 8
const ON_TABLE = TABLE_Y - BALL_R // ball touching the table

// The serve: in from the top left → bounce → over the net → bounce → up to the middle
const SERVE_X = [24, 170, 300, 430, 300]
const SERVE_Y = [20, ON_TABLE, 88, ON_TABLE, 64]
const SERVE_TIMES = [0, 0.27, 0.5, 0.74, 1]
const SERVE_SECONDS = 2.1
const FALL = 'easeIn'
const RISE = 'easeOut'

// The rally afterwards: left bounce → over the net → right bounce → back
const RALLY_X = [170, 300, 430, 300, 170]
const RALLY_Y = [ON_TABLE, 116, ON_TABLE, 116, ON_TABLE]

/** A short flash ring where the ball hits the table */
function BounceRing({ x, at }) {
  return (
    <motion.ellipse
      cx={x}
      cy={TABLE_Y}
      ry={3}
      className="fill-none stroke-accent"
      strokeWidth="1.5"
      initial={{ rx: 0, opacity: 0 }}
      animate={{ rx: [0, 0, 22], opacity: [0, 0.9, 0] }}
      transition={{ duration: 0.45, delay: at, times: [0, 0.05, 1], ease: 'easeOut' }}
    />
  )
}

/** The ball's soft shadow on the table: small when high, bigger when low */
function BallShadow({ xs, ys, transition }) {
  const widths = ys.map((y) => 3 + ((y - 20) / (ON_TABLE - 20)) * 7)
  return (
    <motion.ellipse
      cy={TABLE_Y + 2}
      ry={1.6}
      className="fill-ink"
      initial={false}
      animate={{ cx: xs, rx: widths, opacity: ys.map((y) => (y > 120 ? 0.25 : 0.1)) }}
      transition={transition}
    />
  )
}

export default function TableTennisStage({ word }) {
  const stageRef = useRef(null)
  const isRevealed = useContext(RevealContext)
  const isInView = useInView(stageRef, { once: true, margin: '0px 0px -10% 0px' })
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState('waiting')

  // Start once the AI answer is typed and the stage is on screen
  useEffect(() => {
    if (phase !== 'waiting' || !isRevealed || !isInView) return
    setPhase(reduceMotion ? 'rally' : 'serve')
  }, [phase, isRevealed, isInView, reduceMotion])

  // After the pop, start the rally
  useEffect(() => {
    if (phase !== 'burst') return
    const timer = setTimeout(() => setPhase('rally'), 900)
    return () => clearTimeout(timer)
  }, [phase])

  const serveTransition = {
    duration: SERVE_SECONDS,
    times: SERVE_TIMES,
    cx: { duration: SERVE_SECONDS, times: SERVE_TIMES, ease: 'linear' },
    cy: { duration: SERVE_SECONDS, times: SERVE_TIMES, ease: [FALL, RISE, FALL, RISE] },
  }
  const rallyTransition = {
    duration: 1.8,
    repeat: Infinity,
    cx: { duration: 1.8, repeat: Infinity, ease: 'linear' },
    cy: { duration: 1.8, repeat: Infinity, ease: [RISE, FALL, RISE, FALL] },
  }

  const letters = Array.from(word)
  const middle = (letters.length - 1) / 2
  const isWordVisible = phase === 'burst' || phase === 'rally'

  return (
    <div ref={stageRef} className="relative overflow-hidden rounded-2xl border border-line bg-surface">
      {/* Small terminal-style label, like the rest of the site (hidden on phones, where the word needs the room) */}
      <span className="absolute left-4 top-3 hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted sm:block" aria-hidden="true">
        TM / RALLY_01
      </span>

      <svg viewBox="0 0 600 220" className="block w-full" aria-hidden="true">
        {/* The table: surface, legs and the net */}
        <line x1="60" x2="540" y1={TABLE_Y} y2={TABLE_Y} className="stroke-line-strong" strokeWidth="3" strokeLinecap="round" />
        <line x1="120" x2="120" y1={TABLE_Y + 2} y2="206" className="stroke-line" strokeWidth="2" strokeLinecap="round" />
        <line x1="480" x2="480" y1={TABLE_Y + 2} y2="206" className="stroke-line" strokeWidth="2" strokeLinecap="round" />
        <line x1="300" x2="300" y1="138" y2={TABLE_Y} className="stroke-muted" strokeWidth="2" strokeLinecap="round" />
        <line x1="294" x2="306" y1="138" y2="138" className="stroke-muted" strokeWidth="2" strokeLinecap="round" />

        {phase === 'serve' && (
          <>
            <BallShadow xs={SERVE_X} ys={SERVE_Y} transition={serveTransition} />
            <BounceRing x={170} at={SERVE_SECONDS * SERVE_TIMES[1]} />
            <BounceRing x={430} at={SERVE_SECONDS * SERVE_TIMES[3]} />
            <motion.circle
              r={BALL_R}
              className="fill-accent"
              initial={{ cx: SERVE_X[0], cy: SERVE_Y[0] }}
              animate={{ cx: SERVE_X, cy: SERVE_Y }}
              transition={serveTransition}
              onAnimationComplete={() => setPhase('burst')}
            />
          </>
        )}

        {/* The pop: the ball grows and fades while the word appears */}
        {phase === 'burst' && (
          <motion.circle
            cx={300}
            cy={64}
            className="fill-accent"
            initial={{ r: BALL_R, opacity: 1 }}
            animate={{ r: 26, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        )}

        {/* The rally that keeps going under the word */}
        {phase === 'rally' &&
          (reduceMotion ? (
            <circle cx={430} cy={ON_TABLE} r={BALL_R} className="fill-accent" />
          ) : (
            <>
              <BallShadow xs={RALLY_X} ys={RALLY_Y} transition={rallyTransition} />
              <motion.circle
                r={BALL_R * 0.8}
                className="fill-accent"
                initial={{ cx: RALLY_X[0], cy: RALLY_Y[0] }}
                animate={{ cx: RALLY_X, cy: RALLY_Y }}
                transition={rallyTransition}
              />
            </>
          ))}
      </svg>

      {/* The word bursts out of the ball: every letter starts at the middle
          (where the ball popped) and springs out to its place — the letters
          nearest the middle first. */}
      <p className="sr-only">{word}</p>
      {isWordVisible && (
        <div className="pointer-events-none absolute inset-x-0 top-[29%] flex -translate-y-1/2 justify-center" aria-hidden="true">
          <p className="flex font-display text-[26px] font-medium tracking-[-0.03em] text-ink sm:text-[46px]">
            {letters.map((letter, index) => (
              <motion.span
                key={`${word}-${index}`}
                className="inline-block whitespace-pre"
                initial={{ opacity: 0, scale: 0.2, x: `${(middle - index) * 0.6}em` }}
                animate={{ opacity: 1, scale: 1, x: '0em' }}
                transition={{
                  type: 'spring',
                  stiffness: 360,
                  damping: 20,
                  delay: reduceMotion ? 0 : Math.abs(index - middle) * 0.035,
                }}
              >
                {letter}
              </motion.span>
            ))}
            <motion.span
              className="inline-block text-accent"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: reduceMotion ? 0 : 0.45, type: 'spring', stiffness: 420, damping: 18 }}
            >
              .
            </motion.span>
          </p>
        </div>
      )}
    </div>
  )
}
