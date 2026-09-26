// Small pill used for technologies, topics and skill levels.
// tone="accent" is used sparingly to highlight important values.
export default function Badge({ children, tone = 'neutral' }) {
  const toneClasses =
    tone === 'accent'
      ? 'border-accent/20 bg-accent-soft text-accent-strong'
      : 'border-line bg-subtle text-body'

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${toneClasses}`}
    >
      {children}
    </span>
  )
}
