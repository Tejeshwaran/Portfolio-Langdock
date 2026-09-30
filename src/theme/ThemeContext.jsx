import { createContext, useContext, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

// ─────────────────────────────────────────────────────────────
// ThemeContext — dark or light look.
//
// The colours themselves are CSS variables in src/index.css. This file
// only switches <html data-theme="dark|light">, remembers the choice in
// localStorage and gives components:
//
//   const { theme, toggleTheme } = useTheme()
//
// A tiny script in index.html sets the saved look before React starts,
// so the page never flashes in the wrong colours. Default: dark.
// ─────────────────────────────────────────────────────────────

const STORAGE_KEY = 'portfolio-theme'
// Colour of the phone's browser bar for each look
const BROWSER_BAR_COLORS = { dark: '#1F2026', light: '#F4F4F5' }

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} })

export function useTheme() {
  return useContext(ThemeContext)
}

function readInitialTheme() {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readInitialTheme)

  // Apply + remember the look whenever it changes
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', BROWSER_BAR_COLORS[theme])
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Private mode or blocked storage: the look still works, it is just not remembered
    }
  }, [theme])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    const apply = () => {
      document.documentElement.dataset.theme = next
      flushSync(() => setTheme(next)) // update React in the same moment
    }

    // Where the browser supports it, the whole page cross-fades between the
    // two looks (View Transitions API). Otherwise it switches instantly.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (document.startViewTransition && !reduceMotion) document.startViewTransition(apply)
    else apply()
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}
