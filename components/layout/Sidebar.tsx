'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, ClipboardList, Users, Building2,
  UserCheck, BarChart3, Settings, LogOut
} from 'lucide-react'

const nav = [
  { href: '/dashboard',     label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/pedidos',       label: 'Pedidos',        icon: ClipboardList },
  { href: '/guias',         label: 'Guias VEM',      icon: UserCheck },
  { href: '/instituicoes',  label: 'Instituições',   icon: Building2 },
]

export default function Sidebar() {
  const path = usePathname()

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <p style={{ fontFamily: 'Fraunces, serif', fontSize: 22, color: 'white', fontWeight: 400, letterSpacing: '0.02em' }}>
          VEM
        </p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
          Plataforma B2B
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = path === href || path.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: active ? 500 : 400,
                color: active ? 'white' : 'rgba(255,255,255,0.65)',
                background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s',
              }}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link href="/settings" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>
          <Settings size={16} />
          Definições
        </Link>
        <button style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, fontSize: 13, color: 'rgba(255,255,255,0.55)', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}>
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  )
}
