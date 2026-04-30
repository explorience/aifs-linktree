import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'All In For Sport',
  description: 'Connect with All In For Sport — links to our website, projects, and community.',
  openGraph: {
    title: 'All In For Sport',
    description: 'Connect with All In For Sport',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
