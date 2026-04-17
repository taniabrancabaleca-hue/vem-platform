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
  consulta_externa: 'Consulta externa',
  transporte_consulta: 'Transporte consulta',
  passeio: 'Passeio',
  recolha_pos_alta: 'Recolha pos-alta',
  acompanhamento_exame: 'Acomp. exame',
}

const ESTADO_LABEL: Record<string, string> = {
  pendente: 'Pendente',
  atribuido: 'Atribuido',
  guia_a_caminho: 'A caminho',
  em_curso: 'Em curso',
  concluido: 'Concluido',
  cancelado: 'Cancelado',
}

export default function RelatorioPDFButton({ instituicaoNome, pedidos }: Props) {
  const [loading, setLoading] = useState(false)

  async function gerarPDF() {
    setLoading(true)
    try {
      const { default: jsPDF } = await import('jspdf')
      const { default: autoTable } = await import('jspdf-autotable')

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const mes = new Date().toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })
      const agora = new Date().toLocaleDateString('pt-PT')

      const AZUL: [number, number, number] = [27, 101, 178]

      doc.setFillColor(27, 101, 178)
      doc.rect(0, 0, 210, 32, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text('VEM Platform', 14, 13)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text('Plataforma B2B de acompanhamento', 14, 20)
      doc.text('Gerado em ' + agora, 14, 27)

      doc.setTextColor(27, 101, 178)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('Relatorio Mensal - ' + mes, 14, 44)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(107, 114, 128)
      doc.text(instituicaoNome, 14, 52)

      const concluidos = pedidos.filter(p => p.estado === 'concluido').length
      const cancelados = pedidos.filter(p => p.estado === 'cancelado').length
      const totalHoras = pedidos.reduce((s, p) => s + (p.duracao_horas ?? 0), 0)
      const guiasUnicos = new Set(pedidos.map(p => p.guia?.nome).filter(Boolean)).size

      const kpis = [
        { label: 'Total pedidos', value: String(pedidos.length) },
        { label: 'Concluidos', value: String(concluidos) },
        { label: 'Cancelados', value: String(cancelados) },
        { label: 'Total horas', value: totalHoras + 'h' },
        { label: 'Guias usados', value: String(guiasUnicos) },
      ]

      let x = 14
      kpis.forEach(k => {
        doc.setFillColor(249, 250, 251)
        doc.roundedRect(x, 62, 36, 18, 2, 2, 'F')
        doc.setDrawColor(229, 231, 235)
        doc.roundedRect(x, 62, 36, 18, 2, 2, 'S')
        doc.setFontSize(7)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(107, 114, 128)
        doc.text(k.label.toUpperCase(), x + 3, 68)
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(AZUL[0], AZUL[1], AZUL[2])
        doc.text(k.value, x + 3, 76)
        x += 39
      })

      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(17, 24, 39)
      doc.text('Pedidos do mes', 14, 92)

      autoTable(doc, {
        startY: 96,
        head: [['Codigo', 'Servico', 'Utente', 'Guia', 'Data', 'Estado']],
        body: pedi