'use client'
import { useState } from 'react'
import { criarPedido } from './actions'

interface Props {
  utentes: { id: string; nome: string; condicao?: string }[]
  instituicoes: { id: string; nome: string }[]
  onClose: () => void
}

const SERVICOS = [
  { value: 'consulta_externa',      label: 'Consulta externa' },
  { value: 'transporte_consulta',   label: 'Transporte para consulta' },
  { value: 'passeio',               label: 'Passeio' },
  { value: 'recolha_pos_alta',      label: 'Recolha pós-alta' },
  { value: 'acompanhamento_exame',  label: 'Acompanhamento a exame' },
]

export default function NovoPedidoModal({ utentes, instituicoes, onClose }: Props) {
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [form, setForm] = useState({
    utente_id: '', instituicao_id: '', tipo_servico: '',
    data_servico: '', hora_servico: '09:00',
    origem: '', destino: '', urgente: false, notas: '',
  })

  function set(field: string, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    if (!form.utente_id || !form.instituicao_id || !form.tipo_servico || !form.data_servico) {
      setErro('Preenche todos os campos obrigatórios.')
      return
    }
    setLoading(true)
    try {
      await criarPedido({
        utente_id: form.utente_id, instituicao_id: form.instituicao_id,
        tipo_servico: form.tipo_servico,
        data_servico: `${form.data_servico}T${form.hora_servico}:00`,
        origem: form.origem || undefined, destino: form.destino || undefined,
        urgente: form.urgente, notas: form.notas || undefined,
      })
      onClose()
    } catch (err: any) {
      setErro('Erro: ' + err.message)
    }
    setLoading(false)
  }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 9999, background: 'rgba(0,0,0,0.5)',
        display: 'flex', justifyContent: 'center',
        alignItems: 'center', padding: '20px 24px 20px 244px',
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{
        background: 'white', borderRadius: 16, width: '100%', maxWidth: 520,
        boxShadow: '0 8px 40px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ padding: '24px 28px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 400, color: '#0F6E56', margin: 0 }}>Novo pedido</h2>
            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Preenche os dados do acompanhamento</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#9ca3af', padding: 4 }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px 28px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Utente <span style={{ color: '#dc2626' }}>*</span></label>
            <select className="form-input" value={form.utente_id} onChange={e => set('utente_id', e.target.value)} required>
              <option value="">Selecionar utente…</option>
              {utentes.map(u => <option key={u.id} value={u.id}>{u.nome}{u.condicao ? ` — ${u.condicao}` : ''}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Instituição <span style={{ color: '#dc2626' }}>*</span></label>
            <select className="form-input" value={form.instituicao_id} onChange={e => set('instituicao_id', e.target.value)} required>
              <option value="">Selecionar instituição…</option>
              {instituicoes.map(i => <option key={i.id} value={i.id}>{i.nome}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Tipo de serviço <span style={{ color: '#dc2626' }}>*</span></label>
            <select className="form-input" value={form.tipo_servico} onChange={e => set('tipo_servico', e.target.value)} required>
              <option value="">Selecionar serviço…</option>
              {SERVICOS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Data <span style={{ color: '#dc2626' }}>*</span></label>
              <input type="date" className="form-input" value={form.data_servico} onChange={e => set('data_servico', e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Hora</label>
              <input type="time" className="form-input" value={form.hora_servico} onChange={e => set('hora_servico', e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Origem</label>
              <input type="text" className="form-input" placeholder="Ex: Hospital de Santa Maria" value={form.origem} onChange={e => set('origem', e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Destino</label>
              <input type="text" className="form-input" placeholder="Ex: Residência do utente" value={form.destino} onChange={e => set('destino', e.target.value)} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Notas / informações adicionais</label>
            <textarea className="form-input" rows={3} placeholder="Instruções especiais, necessidades do utente…"
              value={form.notas} onChange={e => set('notas', e.target.value)}
              style={{ resize: 'vertical', fontFamily: 'inherit' }} />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.urgente} onChange={e => set('urgente', e.target.checked)}
              style={{ width: 16, height: 16, accentColor: '#dc2626', cursor: 'pointer' }} />
            <span style={{ fontSize: 13, color: '#374151' }}>Pedido urgente</span>
            {form.urgente && <span className="badge badge-urgente" style={{ marginLeft: 4 }}>Urgente</span>}
          </label>

          {erro && (
            <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#991B1B' }}>{erro}</div>
          )}

          <div style={{ borderTop: '1px solid #f0f0ee', marginTop: 4 }} />

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>Cancelar</button>
            <button type="submit" className="btn-primary" style={{ minWidth: 120, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? 'A criar…' : 'Criar pedido'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}