'use client'
import { useState } from 'react'

interface Pedido {
  codigo: string
  servico: string
  data_pedido: string
  estado: string
  utente?: { nome: string }
  guia?: { nome: string }
  duracao_horas?: number
}

interface Props {
  instituicaoId: string
  instituicaoNome: string
  pedidos: Pedido[]
}

const SERVICO_LABEL: Record<string, string> = {
  consulta_externa:     'Consulta externa',
  transporte_consulta:  'Transporte consulta',
  passeio:              'Passeio',
  recolha_pos_alta:     'Recolha pós-alta',
  acompanhamento_exame: 'Acomp. exame',
}

const ESTADO_LABEL: Record<string, string> = {
  pendente:       'Pendente',
  atribuido:      'Atribuído',
  guia_a_caminho: 'A caminho',
  em_curso:       'Em curso',
  concluido:      'Concluído',
  cancelado:      'Cancelado',
}

export default function RelatorioPDFButton({ instituicaoNome, pedidos }: Props) {
  const [loading, setLoading] = useState(false)

  async function gerarPDF() {
    setLoading(true)
    try {
      const { default: jsPDF } = await import('jspdf')
      const { default: autoTable } = await import('jspdf-autotable')

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      con