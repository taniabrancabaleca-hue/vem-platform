'use client'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import SidebarParceiro from './SidebarParceiro'
import BottomNavParceiro from './BottomNavParceiro'

export default function LayoutShell({ children, role }: { children: React.ReactNode, role?: string }) {
  const path = usePathname()
  const isLoginPage = path === '/login' || path === '/'
  const isParceiro = path.startsWith('/parceiro')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (isLoginPage) return <>{children}</>

  if (isParceiro) {
    if (isMobile) {
      return (
        <div style={{ minHeight: '100vh', paddingBottom: 70 }}>
          <header style={{
            background: '#1B65B2', padding: '12px 16px',
            display: 'flex', alignItems: 'center',
            position: 'sticky', top: 0, zIndex: 50,
          }}>
            <img src="/logo.png" alt="VEM" style={{ height: 32, objectFit: 'contain' }} />
          </header>
          <main style={{ padding: '16px' }}>{children}</main>
          <BottomNavParceiro />
        </div>
      )
    }
    return (
      <>
        <SidebarParceiro />
        <main className="main-content">{children}</main>
      </>
    )
  }

  if (isMobile) {
    return (
      <div style={{ minHeight: '100vh', paddingBottom: 70 }}>
        <header style={{
          background: '#1B65B2', padding: '12px 16px',
          display: 'flex', alignItems: 'center',
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <img src="/logo.png" alt="VEM" style={{ height: 32, objectFit: 'contain' }} />
        </header>
        <main style={{ padding: '16px' }}>{children}</main>
        <BottomNav />
      </div>
    )
  }

  return (
    <>
      <Sidebar />
      <main className="main-content">{children}</main>
    </>
  )
}
