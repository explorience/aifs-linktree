export interface LinkItem {
  title: string
  url: string
}

async function fetchSheetCSV(sheetId: string, sheetName: string): Promise<string> {
  const encodedSheetName = encodeURIComponent(sheetName)
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&sheet=${encodedSheetName}`

  const response = await fetch(csvUrl)

  if (!response.ok) {
    throw new Error(`Failed to fetch sheet "${sheetName}": ${response.status}`)
  }

  return response.text()
}

function parseCSV(csvText: string): string[][] {
  const rows: string[][] = []
  let current = ''
  let inQuotes = false

  for (const char of csvText) {
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === '\n' && !inQuotes) {
      // Don't process newlines inside quotes
      // Actually, check if we're at a row boundary
      if (current.trim() || rows.length > 0) {
        rows.push(current.split(',').map(c => c.trim()))
        current = ''
      }
    } else if (char === ',' && !inQuotes) {
      rows.push([current.trim()])
      current = ''
    } else {
      current += char
    }
  }
  if (current.trim()) {
    rows.push(current.split(',').map(c => c.trim()))
  }

  // Proper CSV parsing
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

export async function getLinks(sheetId: string, sheetName = 'Sheet1'): Promise<LinkItem[]> {
  const csvText = await fetchSheetCSV(sheetId, sheetName)
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

export async function getTagline(sheetId: string, sheetName = 'Sheet2'): Promise<string> {
  const csvText = await fetchSheetCSV(sheetId, sheetName)
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