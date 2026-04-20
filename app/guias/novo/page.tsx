'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function NovoGuiaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nome: '', email: '', telefone: '', zona: '', nif: '', notas: ''
  })

  function handle(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.from('guias').insert([{ ...form, estado: 'disponivel', rating: 0, total_horas: 0 }])
    router.push('/guias')
  }

  return (
   <div className="fade-in" style={{ maxWidth: 560 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 400, color: '#1B65B2', margin: 0 }}>Novo Guia</h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Adicionar um novo guia à plataforma</p>
      </div>

      <div style={{ background: 'white', borderRadius: 16, border: '1px solid rgba(0,0,0,0.06)', padding: 32 }}>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Nome completo</label>
            <input className="form-input" name="nome" value={form.nome} onChange={handle} required placeholder="Ana Lima" />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" name="email" type="email" value={form.email} onChange={handle} required placeholder="ana@vem.pt" />
          </div>
          <div className="form-group">
            <label className="form-label">Telefone</label>
            <input className="form-input" name="telefone" value={form.telefone} onChange={handle} placeholder="912 345 678" />
          </div>
          <div className="form-group">
            <label className="form-label">Zona</label>
            <select className="form-input" name="zona" value={form.zona} onChange={handle} required>
              <option value="">Selecionar zona</option>
              <option value="Lisboa">Lisboa</option>
              <option value="Porto">Porto</option>
              <option value="Setúbal">Setúbal</option>
              <option value="Évora">Évora</option>
              <option value="Faro">Faro</option>
              <option value="Coimbra">Coimbra</option>
              <option value="Braga">B
