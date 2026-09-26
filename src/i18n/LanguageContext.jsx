import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { createPortfolioData } from '../data/portfolioData'
import uiText from './uiText'

const STORAGE_KEY = 'portfolio-language'
const LanguageContext = createContext(null)

// Remember the visitor's language between visits (if the browser allows it)
function readSavedLanguage() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'de' ? 'de' : 'en'
  } catch {
    return 'en'
  }
}

/**
 * LanguageProvider — wraps the whole app (see App.jsx) and shares:
 *  - language     'en' or 'de'
 *  - setLanguage  switch the whole website
 *  - data         the résumé data in the current language (portfolioData.js)
 *  - t(key, …)    a small interface word in the current language (uiText.js)
 *
 * When `language` changes, every component that uses useLanguage()
 * re-renders with the new texts — that is the whole translation.
 */
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(readSavedLanguage)

  // The data is rebuilt only when the language changes
  const data = useMemo(() => createPortfolioData(language), [language])

  const t = useCallback(
    (key, ...args) => {
      const value = uiText[language][key] ?? uiText.en[key] ?? key
      return typeof value === 'function' ? value(...args) : value
    },
    [language],
  )

  // Keep <html lang>, the tab title and the saved choice in sync
  useEffect(() => {
    document.documentElement.lang = language
    document.title = uiText[language].pageTitle
    try {
      localStorage.setItem(STORAGE_KEY, language)
    } catch {
      // Storage can be blocked (private mode) — the site still works.
    }
  }, [language])

  const value = useMemo(() => ({ language, setLanguage, data, t }), [language, data, t])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

/** Use inside any component:  const { data, t, language } = useLanguage() */
export function useLanguage() {
  return useContext(LanguageContext)
}
