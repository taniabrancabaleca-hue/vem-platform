import { getStatsGeral } from '@/lib/data'
import { TrendingUp, TrendingDown, Clock, Star, Building2, Users } from 'lucide-react'

export default async function KpiCards() {
  const stats = await getStatsGeral()

  const cards = [
    {
      label: 'Acompanhamentos',
      value: stats.totalMes,
      sub: `${stats.crescimento > 0 ? '+' : ''}${stats.crescimento}% vs mês ant.`,
      trend: stats.crescimento >= 0 ? 'up' : 'down',
      icon: TrendingUp,
      accent: '#1B65B2',
    },
    {
      label: 'Horas de serviço',
      value: `${stats.horasMes}h`,
      sub: 'Este mês',
      trend: 'up',
      icon: Clock,
      accent: '#185FA5',
    },
    {
      label: 'Satisfação média',
      value: `${stats.satisfacaoMedia} ★`,
      sub: 'Avaliações utentes',
      trend: 'up',
      icon: Star,
      accent: '#BA7517',
    },
    {
      label: 'Guias ativos',
      value: stats.guiasAtivos,
      sub: 'Disponíveis agora',
      trend: 'neutral',
      icon: Users,
      accent: '#7F77DD',
    },
    {
      label: 'Instituições',
      value: stats.instituicoesAtivas,
      sub: 'Parceiros ativos',
      trend: 'up',
      icon: Building2,
      accent: '#D85A30',
    },
  ]

  return (
    <div className="grid grid-cols-5 gap-4">
      {cards.map((c, i) => (
        <div key={i} className="kpi-card" style={{ animationDelay: `${i * 60}ms` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {c.label}
            </p>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: c.accent + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <c.icon size={14} color={c.accent} />
            </div>
          </div>
          <p style={{ fontSize: 26, fontWeight: 600, color: '#111827', lineHeight: 1 }}>
            {c.value}
          </p>
          <p style={{ fontSize: 11, color: c.trend === 'up' ? '#1B65B2' : c.trend === 'down' ? '#dc2626' : '#6b7280', marginTop: 6 }}>
            {c.sub}
          </p>
        </div>
      ))}
    </div>
  )
}
