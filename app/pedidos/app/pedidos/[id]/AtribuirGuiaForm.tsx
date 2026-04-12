'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { atribuirGuia } from './actions'

interface Guia {
  id: string
  nome: string
  zona?: string
  rating: number
  telefone?: string
  estado: string
}

interface Props {
  pedidoId: string
  guiaAtualId: string | null
  guias: Guia[]
}

export default function AtribuirGuiaForm({ pedidoId, guiaAtualId, guias }: Props) {
  const router = useRouter()
  const [guiaId, setGuiaId] = useState(guiaAtualId ?? '')
  const [notas, setNotas] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!guiaId) { setErro('Seleciona um guia.'); return }
    setLoading(true)
    setErro('')
    try {
      await atribuirGuia({ pedidoId, guiaId, notas })
      setSucesso(true)
      setTimeout(() => router.push('/pedidos'), 1200)
    } catch (err: any) {
      setErro('Erro: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div className="data-card" style={{ padding: 24 }}>
      <p style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 16px' }}>
        Atribuir guia
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {guias.length === 0 ? (
            <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Nenhum guia disponível de momento.</p>
          ) : guias.map(g => (
            <label key={g.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
              border: `1.5px solid ${guiaId === g.id ? '#0F6E56' : '#e5e7eb'}`,
              background: guiaId === g.id ? '#E1F5EE' : 'white',
              transition: 'all 0.15s',
            }}>
              <input type="radio" name="guia" value={g.id} checked={guiaId === g.id}
                onChange={() => setGuiaId(g.id)} style={{ accentColor: '#0F6E56', width: 15, height: 15 }} />
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E1F5EE', color: '#0F6E56', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
                {g.nome.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 500, margin: 0, color: '#111827' }}>{g.nome}</p>
                <p style={{ fontSize: 11, color: '#6b7280', margin: '1px 0 0' }}>
                  {g.zona ?? '—'} · ★ {Number(g.rating).toFixed(1)}
                  {g.telefone && ` · ${g.telefone}`}
                </p>
              </div>
              <span className="badge badge-disponivel" style={{ fontSize: 10 }}>Disponível</span>
            </label>
          ))}
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
            Notas para o guia
          </label>
          <textarea className="form-input" rows={3}
            placeholder="Instruções específicas, detalhes do utente, acesso ao local…"
            value={notas} onChange={e => setNotas(e.target.value)}
            style={{ resize: 'none', fontFamily: 'inherit' }} />
        </div>

        {erro && <div style={{ background: '#FEE2E2', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#991B1B' }}>{erro}</div>}
        {sucesso && <div style={{ background: '#E1F5EE', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#085041' }}>✓ Guia atribuído! A redirecionar…</div>}

        <button type="submit" className="btn-primary"
          style={{ opacity: loading || sucesso ? 0.7 : 1 }}
          disabled={loading || sucesso || !guiaId}>
          {loading ? 'A atribuir…' : 'Confirmar atribuição'}
        </button>

      </form>
    </div>
  )
}