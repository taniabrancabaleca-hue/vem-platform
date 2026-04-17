'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { criarGuia } from './actions'

const ZONAS = ['Lisboa', 'Porto', 'Coimbra', 'Setúbal', 'Braga', 'Évora', 'Faro', 'Aveiro']

export default function NovoGuiaForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [form, setForm] = useState({
    nome: '', email: '', telefone: '', zona: '',
  })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    if (!form.nome || !form.email) {
      setErro('Nome e email são obrigatórios.')
      return
    }
    setLoading(true)
    try {
      await criarGuia(form)
      router.push('/guias')
    } catch (err: any) {
      setErro('Erro: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div className="data-card" style={{ maxWidth: 520, padding: 32 }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        <div>
          <label className="form-label">Nome <span style={{ color: '#dc2626' }}>*</span></label>
          <input
            type="text" className="form-input"
            placeholder="Ex: Ana Lima"
            value={form.nome} onChange={e => set('nome', e.target.value)} required
          />
        </div>

        <div>
          <label className="form-label">Email <span style={{ color: '#dc2626' }}>*</span></label>
          <input
            type="email" className="form-input"
            placeholder="Ex: ana.lima@vem.pt"
            value={form.email} onChange={e => set('email', e.target.value)} required
          />
        </div>

        <div>
          <label className="form-label">Telefone</label>
          <input
            type="tel" className="form-input"
            placeholder="Ex: 912 345 678"
            value={form.telefone} onChange={e => set('telefone', e.target.value)}
          />
        </div>

        <div>
          <label className="form-label">Zona de cobertura</label>
          <select className="form-input" value={form.zona} onChange={e => set('zona', e.target.value)}>
            <option value="">Selecionar zona…</option>
            {ZONAS.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>

        {erro && (
          <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#991B1B' }}>
            {erro}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, paddingTop: 8 }}>
          <button type="button" className="btn-secondary" onClick={() => router.push('/guias')} disabled={loading}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary" style={{ minWidth: 140, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? 'A criar…' : 'Criar guia'}
          </button>
        </div>

      </form>
    </div>
  )
}
