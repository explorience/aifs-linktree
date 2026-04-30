import { google } from 'googleapis'

export interface LinkItem {
  title: string
  url: string
}

function getAuth() {
  const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_JSON

  if (!credentials) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON environment variable is not set')
  }

  const parsed = JSON.parse(credentials)
  return new google.auth.GoogleAuth({
    credentials: parsed,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })
}

export async function getLinks(sheetId: string, sheetName = 'Sheet1'): Promise<LinkItem[]> {
  const auth = getAuth()
  const sheets = google.sheets({ version: 'v4', auth })

  const range = `${sheetName}!A:B`
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
    valueRenderOption: 'FORMATTED_VALUE',
  })

  const rows = response.data.values || []

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
  donate: '💜',
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
