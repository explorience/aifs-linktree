# AIFS Linktree

A link-in-bio page for All In For Sport, powered by Google Sheets as a CMS.

**Live:** https://aifs-linktree.vercel.app

## Setup

### 1. Google Cloud Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/iam-admin/serviceaccounts) and create a new project (or use an existing one)
2. Create a **Service Account**
3. Generate a **JSON key** — download it, you'll paste it into Vercel as an environment variable
4. Share your Google Sheet with the service account email (`...@....iam.gserviceaccount.com`)

### 2. Deploy to Vercel

```bash
npm install
npm run build
vercel deploy
```

Or connect the GitHub repo to Vercel and set environment variables in the Vercel dashboard.

### 3. Environment Variables (Vercel)

| Variable | Value |
|----------|-------|
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Paste the full JSON as a single line (no newlines) |
| `SHEET_ID` | The ID from your Google Sheet URL |

### 4. Google Sheet Format

The sheet should have a header row with `Title` and `URL` columns:

| Title | URL |
|-------|-----|
| All In For Sport website | https://allinforsport.org |
| Sarreya website | https://sarreya.org |

Add/edit/reorder rows — the page updates automatically every 5 minutes (or trigger a revalidation by redeploying).

## Sharing

Point a QR code at the deployed URL. Suggested URL: `https://aifs-linktree.vercel.app`

## Development

```bash
npm install
npm run dev
```

For local dev, copy `.env.local.example` to `.env.local` and fill in the values.
