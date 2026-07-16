// Maps a category slug to one of four brand accent colors (defined in globals.css
// as --tag-1..4). Deterministic (same slug always gets the same color, on server
// and client) rather than random, so the color is doing real information work —
// it's a stable visual identifier for that category, not decoration.
const ACCENTS = ['var(--tag-1)', 'var(--tag-2)', 'var(--tag-3)', 'var(--tag-4)']

export function getCategoryAccent(slug?: string | null): string {
  if (!slug) return ACCENTS[0]

  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0
  }

  return ACCENTS[hash % ACCENTS.length]
}