cat > app\pedidos\NovoPedidoModal.tsx << 'ENDOFFILE'
'use client'
import { useState } from 'react'
import { criarPedido } from './actions'

interface Props {
  utentes: { id: string; nome: string; condicao?: string }[]
  instituicoes: { id: string; nome: string }[]
  onClose: () => void
}

const SERVICOS = [
  { value: 'consulta_externa', label: 'Consulta externa' },
  { value: 'transporte_consulta', label: 'Transporte para consulta' },
  { value: 'passeio', label: 'Passeio' },
  { value: 'recolha_pos_alta', label: 'Recolha pós-alta' },
  { value: 'acompanhamento_exame', label: 'Acompanhamento a exame' },
]

export default function NovoPedidoModal({ utentes, instituicoes, onClose }: Props) {
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [form, setForm] = useState({
    utente_id: '', instituicao_id: '', tipo_servico: '',
    data_servico: '', hora_servico: '09:00',
    origem: '', destino: '', urgente: false, notas: '',
  })

  function set(field, value) { setForm(f => ({ ...f, [field]: value })) }

  async function handleSubmit(e) {
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
        data_servico: form.data_servico + 'T' + form.hora_servico + ':00',
        origem: form.origem || undefined, destino: form.destino || undefined,
        urgente: form.urgente, notas: form.notas || undefined,
      })
      onClose()
    } catch (err) { setErro('Erro: ' + err.message) }
    setLoading(false)
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.45)' }} />
      <div style={{ position: 'fixed', top: 0, left: '220px', right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 500, boxShadow: '0 8px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
          <div style={{ padding: '20px 24px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0ee', flexShrink: 0 }}>
            <div>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 400, color: '#0F6E56', margin: 0 }}>Novo pedido</h2>
              <p style={{ fontSize: 12, color: '#6b7280', marginTop: 2, marginBottom: 0 }}>Preenche os dados do acompanhamento</p>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#9ca3af' }}>✕</button>
          </div>
          <form onSubmit={handleSubmit} style={{ padding: '16px 24px 20px', display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
            <div><label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 4 }}>Utente <span style={{ color: '#dc2626' }}>*</span></label>
              <select className="form-input" value={form.utente_id} onChange={e => set('utente_id', e.target.value)} required>
                <option value="">Selecionar utente…</option>
                {utentes.map(u => <option key={u.id} value={u.id}>{u.nome}{u.condicao ? ' — ' + u.condicao : ''}</option>)}
              </select></div>
            <div><label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 4 }}>Instituição <span style={{ color: '#dc2626' }}>*</span></label>
              <select className="form-input" value={form.instituicao_id} onChange={e => set('instituicao_id', e.target.value)} required>
                <option value="">Selecionar instituição…</option>
                {instituicoes.map(i => <option key={i.id} value={i.id}>{i.nome}</option>)}
              </select></div>
            <div><label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 4 }}>Tipo de serviço <span style={{ color: '#dc2626' }}>*</span></label>
              <select className="form-input" value={form.tipo_servico} onChange={e => set('tipo_servico', e.target.value)} required>
                <option value="">Selecionar serviço…</option>
                {SERVICOS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div><label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 4 }}>Data <span style={{ color: '#dc2626' }}>*</span></label>
                <input type="date" className="form-input" value={form.data_servico} onChange={e => set('data_servico', e.target.value)} required /></div>
              <div><label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 4 }}>Hora</label>
                <input type="time" className="form-input" value={form.hora_servico} onChange={e => set('hora_servico', e.target.value)} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div><label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 4 }}>Origem</label>
                <input type="text" className="form-input" placeholder="Hospital de Santa Maria" value={form.origem} onChange={e => set('origem', e.target.value)} /></div>
              <div><label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 4 }}>Destino</label>
                <input type="text" className="form-input" placeholder="Residência do utente" value={form.destino} onChange={e => set('destino', e.target.value)} /></div>
            </div>
            <div><label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 4 }}>Notas</label>
              <textarea className="form-input" rows={2} placeholder="Instruções especiais…" value={form.notas} onChange={e => set('notas', e.target.value)} style={{ resize: 'none', fontFamily: 'inherit' }} /></div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#374151' }}>
              <input type="checkbox" checked={form.urgente} onChange={e => set('urgente', e.target.checked)} style={{ width: 15, height: 15, accentColor: '#dc2626' }} />
              Pedido urgente
            </label>
            {erro && <div style={{ background: '#FEE2E2', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#991B1B' }}>{erro}</div>}
            <div style={{ borderTop: '1px solid #f0f0ee', paddingTop: 14, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>Cancelar</button>
              <button type="submit" className="btn-primary" style={{ minWidth: 110, opacity: loading ? 0.7 : 1 }} disabled={loading}>{loading ? 'A criar…' : 'Criar pedido'}</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}