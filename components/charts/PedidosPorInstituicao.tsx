'use client'
import { useEffect, useState } from 'react'
import { getPedidosPorInstituicao } from '@/lib/data'

export default function PedidosPorInstituicao() {
  const [data, setData] = useState<{ nome: string; total: number }[]>([])

  useEffect(() => {
    getPedidosPorInstituicao().then(setData)
  }, [])

  const max = data[0]?.total ?? 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: '#374151', minWidth: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {d.nome}
          </span>
          <div style={{ width: 80, height: 4, background: '#f3f4f6', borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
            <div style={{
              height: '100%',
              width: `${Math.round((d.total / max) * 100)}%`,
              background: '#185FA5',
              borderRadius: 2,
              transition: 'width 0.6s ease',
            }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 500, color: '#111827', minWidth: 24, textAlign: 'right' }}>
            {d.total}
          </span>
        </div>
      ))}
      {data.length === 0 && (
        <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', padding: '20px 0' }}>
          Sem dados disponíveis
        </p>
      )}
    </div>
  )
}
