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
        body: pedidos.map(p => [
          p.codigo,
          SERVICO_LABEL[p.servico] ?? p.servico,
          p.utente?.nome ?? '-',
          p.guia?.nome ?? '-',
          new Date(p.data_pedido).toLocaleDateString('pt-PT'),
          ESTADO_LABEL[p.estado] ?? p.estado,
        ]),
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: {
          fillColor: AZUL,
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: { fillColor: [249, 250, 251] },
        columnStyles: {
          0: { cellWidth: 22 },
          1: { cellWidth: 38 },
          2: { cellWidth: 38 },
          3: { cellWidth: 38 },
          4: { cellWidth: 24 },
          5: { cellWidth: 26 },
        },
      })

      const pageCount = (doc as any).internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(156, 163, 175)
        doc.text(
          'VEM Platform  |  Pagina ' + i + ' de ' + pageCount,
          105,
          290,
          { align: 'center' }
        )
      }

      const nomeFicheiro = `relatorio-${instituicaoNome.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 7)}.pdf`
      doc.save(nomeFicheiro)
    } catch (err) {
      console.error('Erro ao gerar PDF:', err)
      alert('Erro ao gerar PDF. Tenta novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={gerarPDF}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
    >
      {loading ? (
        <>
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          A gerar PDF...
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          Exportar PDF
        </>
      )}
    </button>
  )
}
