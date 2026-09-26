// Shared Framer Motion "variants" (named animation states).

// The "pop": an item fades in, rises a little and grows from 97% to 100%.
// `shown` is a function so every item can get its own delay (the `custom`
// prop on the element). A spring gives the small, natural settle at the end.
export const popVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  shown: (delay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay,
      type: 'spring',
      stiffness: 300,
      damping: 26,
      mass: 0.8,
      opacity: { delay, duration: 0.3, ease: 'easeOut' },
    },
  }),
}
