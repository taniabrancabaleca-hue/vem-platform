'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const SERVICOS = ['consulta', 'passeio', 'consulta_externa']

type Pedido = {
  id: string
  codigo: string
  estado: string
  data_pedido: string
  servico: string
  origem: string
  destino: string
  utente_nome_livre: string
  notas: string
}

export default function EditarPedidoPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState(false)

  const [form, setForm] = useState({
    data_pedido: '',
    servico: '',
    origem: '',
    destino: '',
    utente_nome_livre: '',
    notas: '',
  })

  useEffect(() => {
    async function fetchPedido() {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('pedidos')
        .select('id, codigo, estado, data_pedido, servico, origem, destino, utente_nome_livre, notas')
        .eq('id', id)
        .single()

      if (error || !data) {
        setErro('Pedido não encontrado.')
      } else {
        setPedido(data)
        setForm({
          data_pedido: data.data_pedido ? data.data_pedido.slice(0, 16) : '',
          servico: data.servico || '',
          origem: data.origem || '',
          destino: data.destino || '',
          utente_nome_livre: data.utente_nome_livre || '',
          notas: data.notas || '',
        })
      }
      setLoading(false)
    }
    if (id) fetchPedido()
  }, [id])

  async function handleSave() {
    setSaving(true)
    setErro(null)
    const supabase = createClient()
    const { error } = await supabase
      .from('pedidos')
      .update({
        data_pedido: form.data_pedido ? new Date(form.data_pedido).toISOString() : null,
        servico: form.servico,
        origem: form.origem,
        destino: form.destino,
        utente_nome_livre: form.utente_nome_livre,
        notas: form.notas,
      })
      .eq('id', id)

    if (error) {
      setErro('Erro ao guardar: ' + error.message)
    } else {
      setSucesso(true)
      setTimeout(() => router.push('/parceiro'), 1500)
    }
    setSaving(false)
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #EBF2FA', borderTopColor: '#1B65B2', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (erro && !pedido) return (
    <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: 16, color: '#991b1b', fontSize: 13 }}>{erro}</div>
  )

  const editavel = pedido?.estado === 'pendente'

  return (
    <div className="fade-in">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => router.push('/parceiro')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}
        >
          ← Voltar
        </button>
        <div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 24, fontWeight: 400, color: '#1B65B2', margin: 0 }}>
            Editar pedido <span style={{ color: '#9ca3af' }}>#{pedido?.codigo}</span>
          </h1>
          {!editavel && (
            <p style={{ fontSize: 12, color: '#854d0e', background: '#fef9c3', padding: '2px 10px', borderRadius: 20, display: 'inline-block', marginTop: 6 }}>
              Este pedido já não pode ser editado (estado: {pedido?.estado})
            </p>
          )}
        </div>
      </div>

      {/* Formulário */}
      <div style={{ background: 'white', borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)', padding: 32, maxWidth: 640 }}>

        {/* Utente */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Utente</label>
          <input
            value={form.utente_nome_livre}
            onChange={e => setForm(f => ({ ...f, utente_nome_livre: e.target.value }))}
            disabled={!editavel}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13, color: '#1a1a18', background: editavel ? 'white' : '#f9fafb', boxSizing: 'border-box' }}
          />
        </div>

        {/* Serviço */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Serviço</label>
          <select
            value={form.servico}
            onChange={e => setForm(f => ({ ...f, servico: e.target.value }))}
            disabled={!editavel}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13, color: '#1a1a18', background: editavel ? 'white' : '#f9fafb', boxSizing: 'border-box' }}
          >
            {SERVICOS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
        </div>

        {/* Data */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Data do serviço</label>
          <input
            type="datetime-local"
            value={form.data_pedido}
            onChange={e => setForm(f => ({ ...f, data_pedido: e.target.value }))}
            disabled={!editavel}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13, color: '#1a1a18', background: editavel ? 'white' : '#f9fafb', boxSizing: 'border-box' }}
          />
        </div>

        {/* Origem / Destino */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Origem</label>
            <input
              value={form.origem}
              onChange={e => setForm(f => ({ ...f, origem: e.target.value }))}
              disabled={!editavel}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13, color: '#1a1a18', background: editavel ? 'white' : '#f9fafb', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Destino</label>
            <input
              value={form.destino}
              onChange={e => setForm(f => ({ ...f, destino: e.target.value }))}
              disabled={!editavel}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13, color: '#1a1a18', background: editavel ? 'white' : '#f9fafb', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Notas */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Notas</label>
          <textarea
            value={form.notas}
            onChange={e => setForm(f => ({ ...f, notas: e.target.value }))}
            disabled={!editavel}
            rows={3}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13, color: '#1a1a18', background: editavel ? 'white' : '#f9fafb', boxSizing: 'border-box', resize: 'vertical' }}
          />
        </div>

        {/* Erro */}
        {erro && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: 12, color: '#991b1b', fontSize: 13, marginBottom: 16 }}>{erro}</div>
        )}

        {/* Sucesso */}
        {sucesso && (
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: 12, color: '#15803d', fontSize: 13, marginBottom: 16 }}>Pedido guardado com sucesso! A redirecionar...</div>
        )}

        {/* Botões */}
        {editavel && (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button
              onClick={() => router.push('/parceiro')}
              style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #e5e7eb', background: 'white', fontSize: 13, color: '#6b7280', cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#1B65B2', color: 'white', fontSize: 13, fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
            >
              {saving ? 'A guardar...' : 'Guardar alterações'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}