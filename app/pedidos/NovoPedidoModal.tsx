'use client'
import { useState, useEffect } from 'react'
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
  const [sidebarW, setSidebarW] = useState(220)
  const [form, setForm] = useState({
    utente_id: '', instituicao_id: '', tipo_servico: '',
    data_servico: '', hora_servico: '09:00',
    origem: '', destino: '', urgente: false, notas: '',
  })

  useEffect(() => {
    const sidebar = document.querySelector('aside')
    if (sidebar) setSidebarW(sidebar.getBoundingClientRect().width)
  }, [])

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
        position: 'fixed',
        top: 0, bottom: 0,
        left: sidebarW, right: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{
        background: 'white', borderRadius: 16,
        width: '100%', maxWidth: 520,
        boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
        display: 'flex', flexDirection: 'column',
        maxHeight: 'calc(100vh - 48px)',
      }}>
        {/* Header */}
        <div style={{ padding: '22px 28px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0ee', flexShrink: 0 }}>
          <div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 400, color: '#0F6E56', margin: 0 }}>Novo pedido</h2>
            <p s