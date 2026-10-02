// ─────────────────────────────────────────────────────────────
// onboarding.js — the intro pages shown before the portfolio.
//
// To remove the intro completely, set ONBOARDING_ENABLED = false.
//
// When is it shown? On EVERY page load: opening the link or reloading the
// page always starts with the intro. (Clicking "Skip intro" still works.)
// It lies above the chat: scrolling up on the first slide shows it again.
// For quick testing you can hide it with ?intro=0 at the end of the address.
// ─────────────────────────────────────────────────────────────

export const ONBOARDING_ENABLED = true

export function shouldShowOnboarding() {
  if (!ONBOARDING_ENABLED) return false
  try {
    return new URLSearchParams(window.location.search).get('intro') !== '0'
  } catch {
    return true
  }
}
