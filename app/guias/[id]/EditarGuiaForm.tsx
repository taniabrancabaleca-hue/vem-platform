'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { atualizarGuia } from './actions'

const ZONAS = ['Lisboa', 'Porto', 'Coimbra', 'Setúbal', 'Braga', 'Évora', 'Faro', 'Aveiro']
const ESTADOS = [
  { value: 'disponivel', label: 'Disponível' },
  { value: 'ocupado', label: 'Ocupado' },
  { value: 'inativo', label: 'Inativo' },
]

interface Props {
  guia: { id: string; nome: string; email: string; telefone?: string; zona?: string; estado: string }
}

export default function EditarGuiaForm({ guia }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [form, setForm] = useState({
    nome: guia.nome,
    email: guia.email,
    telefone: guia.telefone ?? '',
    zona: guia.zona ?? '',
    estado: guia.estado,
  })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(''); setSucesso('')
    setLoading(true)
    try {
      await atualizarGuia(guia.id, form)
      setSucesso('Guia atualizado com sucesso!')
      router.refresh()
    } catch (err: any) {
      setErro('Erro: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24 }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>Editar informação</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label className="form-label">Nome <span style={{ color: '#dc2626' }}>*</span></label>
            <input type="text" className="form-input" value={form.nome} onChange={e => set('nome', e.target.value)} required />
          </div>
          <div>
            <label className="form-label">Email <span style={{ color: '#dc2626' }}>*</span></label>
            <input type="email" className="form-input" value={form.email} onChange={e => set('email', e.target.value)} required />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div>
            <label className="form-label">Telefone</label>
            <input type="tel" className="form-input" value={form.telefone} onChange={e => set('telefone', e.target.value)} />
          </div>
          <div>
            <label className="form-label">Zona</label>
            <select className="form-input" value={form.zona} onChange={e => set('zona', e.target.value)}>
              <option value="">Sem zona</option>
              {ZONAS.map(z => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Estado</label>
            <select className="form-input" value={form.estado} onChange={e => set('estado', e.target.value)}>
              {ESTADOS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
          </div>
        </div>

        {erro && <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#991B1B' }}>{erro}</div>}
        {sucesso && <div style={{ background: '#D1FAE5', border: '1px solid #A7F3D0', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#065F46' }}>{sucesso}</div>}

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" className="btn-primary" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? 'A guardar…' : 'Guardar alterações'}
          </button>
        </div>
      </form>
    </div>
  )
}