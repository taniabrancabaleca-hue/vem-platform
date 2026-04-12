'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { atribuirGuia, removerGuia } from './actions'

interface Guia {
  id: string
  nome: string
  zona: string
  rating?: number
  telefone?: string
}

interface Props {
  pedidoId: string
  guias: Guia[]
  guiaAtualId?: string
}

export default function AtribuirGuiaForm({ pedidoId, guias, guiaAtualId }: Props) {
  const router = useRouter()
  const [guiaId, setGuiaId] = useState(guiaAtualId ?? '')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  async function handleAtribuir() {
    if (!guiaId) { setErro('Seleciona um guia.'); return }
    setErro(''); setSucesso(''); setLoading(true)
    try {
      await atribuirGuia(pedidoId, guiaId)
      setSucesso('Guia atribuído com sucesso!')
      router.refresh()
    } catch (err: any) {
      setErro('Erro: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleRemover() {
    setErro(''); setSucesso(''); setLoading(true)
    try {
      await removerGuia(pedidoId)
      setGuiaId('')
      setSucesso('Guia removido.')
      router.refresh()
    } catch (err: any) {
      setErro('Erro: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (guias.length === 0) {
    return (
      <p style={{ fontSize: 13, color: '#6b7280' }}>
        Não há guias disponíveis de momento.
      </p>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label className="form-label">Guia disponível</label>
        <select
          className="form-input"
          value={guiaId}
          onChange={e => setGuiaId(e.target.value)}
          style={{ maxWidth: 400 }}
        >
          <option value="">Selecionar guia…</option>
          {guias.map(g => (
            <option key={g.id} value={g.id}>
              {g.nome} — {g.zona}{g.rating ? ` · ★ ${g.rating}` : ''}
            </option>
          ))}
        </select>
      </div>

      {erro && (
        <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#991B1B' }}>
          {erro}
        </div>
      )}

      {sucesso && (
        <div style={{ background: '#D1FAE5', border: '1px solid #A7F3D0', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#065F46' }}>
          {sucesso}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          className="btn-primary"
          onClick={handleAtribuir}
          disabled={loading || !guiaId}
          style={{ opacity: (loading || !guiaId) ? 0.7 : 1 }}
        >
          {loading ? 'A guardar…' : 'Atribuir guia'}
        </button>
        {guiaAtualId && (
          <button className="btn-secondary" onClick={handleRemover} disabled={loading}>
            Remover guia
          </button>
        )}
      </div>
    </div>
  )
}