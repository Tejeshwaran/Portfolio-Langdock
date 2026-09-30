/**
 * AssistantMark — the small solid mark of "Tejeshwaran AI": a hooded
 * figure (the same idea as the dotted HackerLogo, drawn as one simple
 * shape so it stays clear at 16px). It uses the current text colour
 * (`currentColor`), so it is white in the dark look and near-black in
 * the light look.
 *
 * Used in the round avatar next to every AI answer and in the prompt
 * box's answer-mode button.
 */
export default function AssistantMark({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      {/* Hood with the face opening cut out (evenodd = the inner shape becomes a hole) */}
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 2.5C7.3 2.5 4.5 6.2 4.5 10.8V21.5h15V10.8c0-4.6-2.8-8.3-7.5-8.3Zm-3.6 9.9a3.6 4.4 0 1 0 7.2 0a3.6 4.4 0 1 0-7.2 0Z"
      />
      {/* The ">_" prompt inside the face, as in the logo */}
      <path d="M10.3 11.1l1.5 1.2-1.5 1.2" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.6 13.6h1.3" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}
