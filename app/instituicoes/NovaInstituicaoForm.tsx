'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { criarInstituicao } from './actions'

const TIPOS = [
  { value: 'hospital', label: 'Hospital' },
  { value: 'clinica', label: 'Clínica' },
  { value: 'residencia', label: 'Residência' },
]

export default function NovaInstituicaoForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [form, setForm] = useState({
    nome: '', tipo: '', email: '', telefone: '', morada: '', cidade: '', nif: '',
  })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    if (!form.nome || !form.tipo || !form.email) {
      setErro('Nome, tipo e email são obrigatórios.')
      return
    }
    setLoading(true)
    try {
      await criarInstituicao(form)
      router.push('/instituicoes')
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
          <input type="text" className="form-input" placeholder="Ex: Hospital Santa Maria"
            value={form.nome} onChange={e => set('nome', e.target.value)} required />
        </div>
        <div>
          <label className="form-label">Tipo <span style={{ color: '#dc2626' }}>*</span></label>
          <select className="form-input" value={form.tipo} onChange={e => set('tipo', e.target.value)} required>
            <option value="">Selecionar tipo…</option>
            {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Email <span style={{ color: '#dc2626' }}>*</span></label>
          <input type="email" className="form-input" placeholder="Ex: geral@hospital.pt"
            value={form.email} onChange={e => set('email', e.target.value)} required />
        </div>
        <div>
          <label className="form-label">Telefone</label>
          <input type="tel" className="form-input" placeholder="Ex: 213 456 789"
            value={form.telefone} onChange={e => set('telefone', e.target.value)} />
        </div>
        <div>
          <label className="form-label">Morada</label>
          <input type="text" className="form-input" placeholder="Ex: Av. Prof. Egas Moniz"
            value={form.morada} onChange={e => set('morada', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label className="form-label">Cidade</label>
            <input type="text" className="form-input" placeholder="Ex: Lisboa"
              value={form.cidade} onChange={e => set('cidade', e.target.value)} />
          </div>
          <div>
            <label className="form-label">NIF</label>
            <input type="text" className="form-input" placeholder="Ex: 500000000"
              value={form.nif} onChange={e => set('nif', e.target.value)} />
          </div>
        </div>
        {erro && (
          <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#991B1B' }}>
            {erro}
          </div>
        )}
        <div style={{ display: 'flex', gap: 10, paddingTop: 8 }}>
          <button type="button" className="btn-secondary" onClick={() => router.push('/instituicoes')} disabled={loading}>Cancelar</button>
          <button type="submit" className="btn-primary" style={{ minWidth: 160, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? 'A criar…' : 'Criar instituição'}
          </button>
        </div>
      </form>
    </div>
  )
}