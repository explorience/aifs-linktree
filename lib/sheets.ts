export interface LinkItem {
  title: string
  url: string
}

export async function getLinks(sheetId: string, sheetName = 'Sheet1'): Promise<LinkItem[]> {
  // Public sheet: use CSV export endpoint (no auth required)
  const encodedSheetName = encodeURIComponent(sheetName)
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&sheet=${encodedSheetName}`

  const response = await fetch(csvUrl)

  if (!response.ok) {
    throw new Error(`Failed to fetch sheet: ${response.status}`)
  }

  const csvText = await response.text()
  const rows = csvText.split('\n').map((row) => {
    const cells: string[] = []
    let current = ''
    let inQuotes = false
    for (const char of row) {
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        cells.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    cells.push(current.trim())
    return cells
  })

  // Skip header row
  const dataRows = rows.slice(1)

  return dataRows
    .filter((row) => row.length >= 2 && row[0] && row[1])
    .map((row) => ({
      title: row[0]?.trim() || '',
      url: row[1]?.trim() || '',
    }))
}

// Map link titles to emoji icons
const ICON_MAP: Record<string, string> = {
  website: '🌐',
  site: '🌐',
  blog: '✍️',
  donate: '💜',
  donation: '💜',
  twitter: '𝕏',
  x: '𝕏',
  instagram: '📸',
  'instagram /': '📸',
  discord: '💬',
  youtube: '▶️',
  linkedin: '💼',
  facebook: '👥',
  podcast: '🎙️',
  email: '✉️',
  newsletter: '🗞️',
  shop: '🛍️',
  store: '🛍️',
  github: '⚙️',
  substack: '📬',
  telegram: '✈️',
  whatsapp: '📱',
  tiktok: '🎵',
  medium: '📝',
  linktree: '🔗',
  'qr code': '📱',
  scan: '📱',
}

export function getIconForTitle(title: string): string {
  const lower = title.toLowerCase()
  for (const [keyword, icon] of Object.entries(ICON_MAP)) {
    if (lower.includes(keyword)) return icon
  }
  return '➡️'
}