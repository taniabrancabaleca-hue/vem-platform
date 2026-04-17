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
      <body>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  )
}