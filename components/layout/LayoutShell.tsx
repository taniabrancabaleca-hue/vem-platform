'use client'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const isLoginPage = path === '/login' || path === '/'

  if (isLoginPage) return <>{children}</>

  return (
    <>
      <Sidebar />
      <main className="main-content">{children}</main>
    </>
  )
}
