'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ClipboardList, UserCheck, Building2 } from 'lucide-react'

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pedidos', label: 'Pedidos', icon: ClipboardList },
  { href: '/guias', label: 'Guias', icon: UserCheck },
  { href: '/instituicoes', label: 'Instituições', icon: Building2 },
]

export default function BottomNav() {
  const path = usePathname()
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#1B65B2', borderTop: '1px solid rgba(255,255,255,0.1)',
      display: 'flex', zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {nav.map(({ href, label, icon: Icon }) => {
        const active = path === href || path.startsWith(href + '/')
        return (
          <Link key={href} href={href} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '10px 0', textDecoration: 'none', gap: 3,
            color: active ? 'white' : 'rgba(255,255,255,0.55)',
          }}>
            <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
            <span style={{ fontSize: 10, fontWeight: active ? 600 : 400 }}>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
