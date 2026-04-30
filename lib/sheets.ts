export interface LinkItem {
  title: string
  url: string
}

// Fetches from a Google Sheet using CSV export
// Uses gid (sheetId) when available so tab name changes don't break things
async function fetchSheetCSV(sheetId: string, options: { sheetName?: string; gid?: number }): Promise<string> {
  // Prefer gid, fall back to sheetName
  const param = options.gid !== undefined ? String(options.gid) : encodeURIComponent(options.sheetName || 'Sheet1')
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&sheet=${param}`

  const response = await fetch(csvUrl)

  if (!response.ok) {
    throw new Error(`Failed to fetch sheet (gid=${options.gid}, name=${options.sheetName}): ${response.status}`)
  }

  return response.text()
}

function parseCSV(csvText: string): string[][] {
  const lines = csvText.split('\n')
  const result: string[][] = []

  for (const line of lines) {
    if (!line.trim()) continue
    const cells: string[] = []
    let cell = ''
    let inQuote = false

    for (const char of line) {
      if (char === '"') {
        inQuote = !inQuote
      } else if (char === ',' && !inQuote) {
        cells.push(cell.trim())
        cell = ''
      } else {
        cell += char
      }
    }
    cells.push(cell.trim())
    result.push(cells)
  }

  return result
}

export async function getLinks(sheetId: string): Promise<LinkItem[]> {
  // gid=0 = "Links" sheet
  const csvText = await fetchSheetCSV(sheetId, { gid: 0 })
  const rows = parseCSV(csvText)

  // Skip header row
  const dataRows = rows.slice(1)

  return dataRows
    .filter((row) => row.length >= 2 && row[0] && row[1])
    .map((row) => ({
      title: row[0]?.trim() || '',
      url: row[1]?.trim() || '',
    }))
}

export async function getTagline(sheetId: string): Promise<string> {
  // gid=2033498538 = "About Text" sheet
  const csvText = await fetchSheetCSV(sheetId, { gid: 2033498538 })
  const rows = parseCSV(csvText)

  // Return the first cell of the first row
  if (rows.length > 0 && rows[0].length > 0) {
    return rows[0][0].trim()
  }

  return ''
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