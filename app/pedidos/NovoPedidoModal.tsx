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
    <>
      {/* Overlay escuro cobre tudo incluindo sidebar */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.45)' }} />

      {/* Modal centrado na área de conteúdo */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(calc(-50% + 110px), -50%)',
        zIndex: 9999,
        background: 'white', borderRadius: 16,
        width: 'calc(100vw - 280px)', maxWidth: 520,
        boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
        maxHeight: '85vh',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ padding: '22px 28px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0ee', flexShrink: 0 }}>
          <div>
            <h2 style={{ fontFamily: 'Frau