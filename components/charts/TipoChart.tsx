'use client'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { useEffect, useState } from 'react'
import { getPedidosPorTipo } from '@/lib/data'

ChartJS.register(ArcElement, Tooltip, Legend)

const COLORS = ['#1D9E75', '#185FA5', '#EF9F27', '#7F77DD', '#D85A30']
const LABELS: Record<string, string> = {
  consulta_externa:       'Consulta ext.',
  transporte_consulta:    'Transporte',
  passeio:                'Passeio',
  recolha_pos_alta:       'Pós-alta',
  acompanhamento_exame:   'Exame',
}

export default function TipoChart() {
  const [data, setData] = useState<{ tipo_servico: string; total: number; percentagem: number }[]>([])

  useEffect(() => {
    getPedidosPorTipo().then(setData as any)
  }, [])

  const chartData = {
    labels: data.map(d => LABELS[d.tipo_servico] ?? d.tipo_servico),
    datasets: [{
      data: data.map(d => d.total),
      backgroundColor: COLORS.slice(0, data.length),
      borderWidth: 0,
      hoverOffset: 4,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` ${ctx.label}: ${ctx.raw} (${data[ctx.dataIndex]?.percentagem}%)`,
        },
      },
    },
  }

  return (
    <div>
      <div style={{ position: 'relative', height: 160 }}>
        <Doughnut data={chartData} options={options} aria-label="Distribuição por tipo de serviço VEM" />
      </div>
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {data.map((d, i) => (
          <div key={d.tipo_servico} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#374151' }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i], flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{LABELS[d.tipo_servico] ?? d.tipo_servico}</span>
            <span style={{ color: '#6b7280' }}>{d.percentagem}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
