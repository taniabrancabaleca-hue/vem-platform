'use client'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend
} from 'chart.js'
import { useEffect, useState } from 'react'
import { getStatsMensais } from '@/lib/data'
import type { StatsMensais } from '@/types/database'
import { format, parseISO } from 'date-fns'
import { pt } from 'date-fns/locale'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function WeeklyChart() {
  const [data, setData] = useState<StatsMensais[]>([])

  useEffect(() => {
    getStatsMensais(8).then(setData)
  }, [])

  const labels = data.map(d => format(parseISO(d.mes), 'MMM', { locale: pt }))

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Concluídos',
        data: data.map(d => d.concluidos),
        backgroundColor: '#1D9E75',
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: 'Total',
        data: data.map(d => d.total_pedidos - d.concluidos),
        backgroundColor: '#E1F5EE',
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.dataset.label}: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { color: '#9ca3af', font: { size: 11 } },
      },
      y: {
        stacked: true,
        grid: { color: 'rgba(0,0,0,0.04)' },
        ticks: { color: '#9ca3af', font: { size: 11 }, stepSize: 10 },
      },
    },
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6b7280' }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: '#1D9E75', display: 'inline-block' }} />
          Concluídos
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6b7280' }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: '#E1F5EE', border: '1px solid #9FE1CB', display: 'inline-block' }} />
          Em curso / agendados
        </span>
      </div>
      <div style={{ position: 'relative', height: 200 }}>
        <Bar
          data={chartData}
          options={options}
          aria-label="Gráfico de acompanhamentos mensais VEM"
        />
      </div>
    </div>
  )
}
