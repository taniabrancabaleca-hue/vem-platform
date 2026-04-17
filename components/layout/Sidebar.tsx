'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { LayoutDashboard, ClipboardList, UserCheck, Building2, Settings, LogOut } from 'lucide-react'
import { logout } from '@/app/actions'

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pedidos', label: 'Pedidos', icon: ClipboardList },
  { href: '/guias', label: 'Guias VEM', icon: UserCheck },
  { href: '/instituicoes', label: 'Instituições', icon: Building2 },
]

export default function Sidebar() {
  const path = usePathname()
  return (
    <aside className="sidebar">
      <div className="px-6 py-5 border-b border-white/10">
        <Image
          src="/logo.png"
          alt="VEM - Mobilidade com Dignidade"
          width={120}
          height={52}
          priority
        />
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = path === href || path.startsWith(href + '/')
          return (
            <Link key={href} href={href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, fontSize: 13, fontWeight: active ? 500 : 400, color: active ? 'white' : 'rgba(255,255,255,0.65)', background: active ? 'rgba(255,255,255,0.15)' : 'transparent', textDecoration: 'none' }}>
              <Icon size={16} />{label}
            </Link>
          )
        })}
      </nav>
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link href="/definicoes" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>
          <Settings size={16} />Definições
        </Link>
        <form action={logout}>
          <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, fontSize: 13, color: 'rgba(255,255,255,0.55)', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}>
            <LogOut size={16} />Sair
          </button>
        </form>
      </div>
    </aside>
  )
}
