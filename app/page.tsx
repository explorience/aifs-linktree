import { getLinks, getIconForTitle } from '@/lib/sheets'

// Revalidate every 5 minutes
export const revalidate = 300

async function getData() {
  const sheetId = process.env.SHEET_ID
  if (!sheetId) {
    throw new Error('SHEET_ID environment variable is not set')
  }
  return getLinks(sheetId)
}

export default async function Home() {
  let links: Awaited<ReturnType<typeof getData>> = []

  try {
    links = await getData()
  } catch (err) {
    console.error('Failed to load links:', err)
  }

  return (
    <main className="page">
      <header className="header">
        <img src="/logo.jpg" alt="All In For Sport logo" className="logo" />
        <h1 className="site-name">All In For Sport</h1>
        <p className="tagline">
          Building a coordi-nation for grassroots sports communities worldwide.
        </p>
      </header>

      {links.length === 0 ? (
        <div className="loading">No links yet — check back soon.</div>
      ) : (
        <nav className="links" aria-label="Links">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              className="link-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="link-icon" aria-hidden="true">
                {getIconForTitle(link.title)}
              </div>
              <span className="link-title">{link.title}</span>
              <span className="link-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
      )}

      <footer className="footer">
        <p>
          <a href="https://allinforsport.org" target="_blank" rel="noopener noreferrer">
            allinforsport.org
          </a>
        </p>
      </footer>
    </main>
  )
}
