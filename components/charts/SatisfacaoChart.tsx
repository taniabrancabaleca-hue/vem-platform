'use client'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Filler, Tooltip
} from 'chart.js'
import { useEffect, useState } from 'react'
import { getStatsMensais } from '@/lib/data'
import { format, parseISO } from 'date-fns'
import { pt } from 'date-fns/locale'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

export default function SatisfacaoChart() {
  const [data, setData] = useState<{ mes: string; satisfacao_media: number }[]>([])

  useEffect(() => {
    getStatsMensais(6).then(d => setData(d as any))
  }, [])

  const labels = data.map(d => format(parseISO(d.mes), 'MMM', { locale: pt }))
  const valores = data.map(d => d.satisfacao_media)
  const media = valores.length ? (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(1) : '—'

  const chartData = {
    labels,
    datasets: [{
      label: 'Satisfação',
      data: valores,
      borderColor: '#1B65B2',
      backgroundColor: 'rgba(15, 110, 86, 0.07)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#1B65B2',
      borderWidth: 2,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (c: any) => `★ ${c.parsed.y.toFixed(1)}` } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 10 } } },
      y: {
        min: 4.0, max: 5.0,
        grid: { color: 'rgba(0,0,0,0.04)' },
        ticks: { color: '#9ca3af', font: { size: 10 }, stepSize: 0.2, callback: (v: any) => v.toFixed(1) },
      },
    },
  }

  return (
    <div>
      <div style={{ position: 'relative', height: 160 }}>
        <Line data={chartData} options={options} aria-label="Evolução da satisfação média VEM" />
      </div>
      <p style={{ textAlign: 'center', fontSize: 12, color: '#6b7280', marginTop: 10 }}>
        Média: <strong style={{ color: '#1B65B2' }}>{media} ★</strong>
      </p>
    </div>
  )
}
