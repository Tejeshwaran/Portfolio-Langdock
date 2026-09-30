import { createContext, useContext } from 'react'
import usePortfolioChat from '../hooks/usePortfolioChat'

// ─────────────────────────────────────────────────────────────
// HomeChat — the ONE main chat of the page, shared by several places:
//  - the home screen (Hero.jsx) shows it and has its prompt box
//  - the sidebar lists it under "Today" and has "New chat"
//  - the top bar uses its first question as the title
//
// So the chat state lives here, above all of them:
//   const chat = useHomeChat()   → messages, ask(), reset(), …
// (The small chat in the contact card keeps its own state.)
// ─────────────────────────────────────────────────────────────

const HomeChatContext = createContext(null)

export function HomeChatProvider({ children }) {
  const chat = usePortfolioChat()
  return <HomeChatContext.Provider value={chat}>{children}</HomeChatContext.Provider>
}

export function useHomeChat() {
  return useContext(HomeChatContext)
}

/** The chat's title: its first question (like a chat app names a chat) */
export function getChatTitle(messages) {
  return messages.find((message) => message.role === 'user')?.text || ''
}
