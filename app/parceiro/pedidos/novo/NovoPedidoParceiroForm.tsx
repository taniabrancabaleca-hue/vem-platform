'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { criarPedidoParceiro } from './actions'

const SERVICOS = [
  { value: 'consulta_externa', label: 'Consulta externa' },
  { value: 'transporte_consulta', label: 'Transporte para consulta' },
  { value: 'passeio', label: 'Passeio' },
  { value: 'recolha_pos_alta', label: 'Recolha pós-alta' },
  { value: 'acompanhamento_exame', label: 'Acompanhamento a exame' },
]

interface Props {
  utentes: { id: string; nome: string; condicao?: string }[]
  instituicaoId: string
}

export default function NovoPedidoParceiroForm({ utentes, instituicaoId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [form, setForm] = useState({
    utente_id: '', tipo_servico: '', data_servico: '',
    hora_servico: '09:00', origem: '', destino: '', urgente: false, notas: '',
  })

  function set(field: string, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    if (!form.utente_id || !form.tipo_servico || !form.data_servico) {
      setErro('Preenche todos os campos obrigatórios.')
      return
    }
    if (!form.urgente) {
      const dataServico = new Date(`${form.data_servico}T${form.hora_servico}:00`)
      const diffHoras = (dataServico.getTime() - Date.now()) / (1000 * 60 * 60)
      if (diffHoras < 24) {
        setErro('O pedido tem de ser feito com pelo menos 24 horas de antecedência. Para pedidos urgentes, assinala a opção "Pedido urgente".')
        return
      }
    }
    setLoading(true)
    try {
      await criarPedidoParceiro({
        utente_id: form.utente_id,
        instituicao_id: instituicaoId,
        tipo_servico: form.tipo_servico,
        data_servico: `${form.data_servico}T${form.hora_servico}:00`,
        origem: form.origem || undefined,
        destino: form.destino || undefined,
        urgente: form.urgente,
        notas: form.notas || undefined,
      })
      router.push('/parceiro')
    } catch (err: any) {
      setErro('Erro: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div className="data-card" style={{ maxWidth: 600, padding: 32 }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label className="form-label">Utente <span style={{ color: '#dc2626' }}>*</span></label>
          <select className="form-input" value={form.utente_id} onChange={e => set('utente_id', e.target.value)} required>
            <option value="">Selecionar utente…</option>
            {utentes.map(u => <option key={u.id} value={u.id}>{u.nome}{u.condicao ? ` — ${u.condicao}` : ''}</option>)}
          </select>
        </div>

        <div>
          <label className="form-label">Tipo de serviço <span style={{ color: '#dc2626' }}>*</span></label>
          <select className="form-input" value={form.tipo_servico} onChange={e => set('tipo_servico', e.target.value)} required>
            <option value="">Selecionar serviço…</option>
            {SERVICOS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label className="form-label">Data <span style={{ color: '#dc2626' }}>*</span></label>
            <input type="date" className="form-input" value={form.data_servico}
              onChange={e => set('data_servico', e.target.value)}
              min={(() => { const m = new Date(); if (!form.urgente) m.setDate(m.getDate() + 1); return m.toISOString().split('T')[0] })()}
              required />
          </div>
          <div>
            <label className="form-label">Hora</label>
            <input type="time" className="form-input" value={form.hora_servico} onChange={e => set('hora_servico', e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label className="form-label">Origem</label>
            <input type="text" className="form-input" placeholder="Ex: Hospital" value={form.origem} onChange={e => set('origem', e.target.value)} />
          </div>
          <div>
            <label className="form-label">Destino</label>
            <input type="text" className="form-input" placeholder="Ex: Residência" value={form.destino} onChange={e => set('destino', e.target.value)} />
          </div>
        </div>

        <div>
          <label className="form-label">Notas</label>
          <textarea className="form-input" rows={3} placeholder="Instruções especiais…"
            value={form.notas} onChange={e => set('notas', e.target.value)}
            style={{ resize: 'vertical', fontFamily: 'inherit' }} />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <input type="checkbox" checked={form.urgente} onChange={e => set('urgente', e.target.checked)}
            style={{ width: 16, height: 16, accentColor: '#dc2626' }} />
          <span style={{ fontSize: 13, color: '#374151' }}>Pedido urgente</span>
        </label>

        {erro && (
          <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#991B1B' }}>{erro}</div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" className="btn-secondary" onClick={() => router.push('/parceiro')} disabled={loading}>Cancelar</button>
          <button type="submit" className="btn-primary" style={{ minWidth: 140, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? 'A submeter…' : 'Submeter pedido'}
          </button>
        </div>
      </form>
    </div>
  )
}
