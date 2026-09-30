import { useEffect } from 'react'

/**
 * Closes a popup (menu, dropdown) when you click outside it or press Escape.
 *
 *   const menuRef = useRef(null)
 *   useDismiss(menuRef, isOpen, () => setIsOpen(false))
 *
 * `ref` is the element that holds the button AND the popup, so clicks on
 * the button itself do not count as "outside".
 */
export default function useDismiss(ref, isOpen, onDismiss) {
  useEffect(() => {
    if (!isOpen) return
    const handlePointerDown = (event) => {
      if (!ref.current?.contains(event.target)) onDismiss()
    }
    const handleKeyDown = (event) => event.key === 'Escape' && onDismiss()
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
    // onDismiss is usually a new function each render; the listeners only
    // need to be set up when the popup opens or closes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, ref])
}
