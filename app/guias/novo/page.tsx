'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function NovoGuiaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', zona: '', nif: '', notas: '' })

  function handle(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function submit(e: any) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.from('guias').insert([{ ...form, estado: 'disponivel', rating: 0, total_horas: 0 }])
    router.push('/guias')
  }

  return (
    <div className="fade-in" style={{maxWidth: 560}}>
      <h1 style={{fontFamily: 'Fraunces, serif', fontSize: 28, color: '#1B65B2'}}>Novo Guia</h1>
      <form onSubmit={submit} style={{display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24}}>
        <input className="form-input" name="nome" value={form.nome} onChange={handle} required placeholder="Nome completo" />
        <input className="form-input" name="email" type="email" value={form.email} onChange={handle} required placeholder="Email" />
        <input className="form-input" name="telefone" value={form.telefone} onChange={handle} placeholder="Telefone" />
        <select className="form-input" name="zona" value={form.zona} onChange={handle} required>
          <option value="">Selecionar zona</option>
          <option>Lisboa</option>
          <option>Porto</option>
          <option>Coimbra</option>
          <option>Braga</option>
          <option>Faro</option>
        </select>
        <input className="form-input" name="nif" value={form.nif} onChange={handle} placeholder="NIF" />
        <textarea className="form-input" name="notas" value={form.notas} onChange={handle} rows={3} placeholder="Notas" />
        <div style={{display: 'flex', gap: 12}}>
          <button type="button" className="btn-secondary" onClick={() => router.back()}>Cancelar</button>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'A guardar...' : 'Guardar'}</button>
        </div>
      </form>
    </div>
  )
}
