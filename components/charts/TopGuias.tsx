'use client'
import { useEffect, useState } from 'react'
import { getTopGuias } from '@/lib/data'

export default function TopGuias() {
  const [guias, setGuias] = useState<any[]>([])

  useEffect(() => {
    getTopGuias(5).then(setGuias)
  }, [])

  const max = guias[0]?.total_acompanhamentos ?? 1

  const avatarColors = [
    { bg: '#E1F5EE', color: '#144D87' },
    { bg: '#FAEEDA', color: '#633806' },
    { bg: '#EEEDFE', color: '#3C3489' },
    { bg: '#FBEAF0', color: '#72243E' },
    { bg: '#FCEBEB', color: '#791F1F' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {guias.map((g, i) => {
        const initials = g.nome.split(' ').slice(0, 2).map((w: string) => w[0]).join('')
        const pct = Math.round((g.total_acompanhamentos / max) * 100)
        const ac = avatarColors[i % avatarColors.length]
        return (
          <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: ac.bg, color: ac.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 500, flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#111827' }}>{g.nome}</span>
                <span style={{ fontSize: 11, color: '#BA7517' }}>★ {Number(g.rating).toFixed(1)}</span>
              </div>
              <div style={{ height: 4, background: '#f3f4f6', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: '#1D9E75', borderRadius: 2, transition: 'width 0.6s ease' }} />
              </div>
              <span style={{ fontSize: 11, color: '#9ca3af', marginTop: 2, display: 'block' }}>
                {g.total_acompanhamentos} acomp. · {g.horas_mes ?? 0}h
              </span>
            </div>
          </div>
        )
      })}
      {guias.length === 0 && (
        <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', padding: '20px 0' }}>
          Sem dados disponíveis
        </p>
      )}
    </div>
  )
}
