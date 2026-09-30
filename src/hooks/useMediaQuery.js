import { useEffect, useState } from 'react'

/**
 * true while a CSS media query matches, e.g.
 *   const isDesktop = useMediaQuery('(min-width: 1024px)')
 * Re-renders when the window crosses the size.
 */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])

  return matches
}
