import type { Metadata } from 'next'
import './globals.css'
import LayoutShell from '@/components/layout/LayoutShell'

export const metadata: Metadata = {
  title: 'VEM Platform - B2B',
  description: 'Plataforma de gestao de acompanhamentos VEM para instituicoes de saude',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1B65B2" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="VEM" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
              })
            }
          `
        }} />
      </head>
      <body>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  )
}
