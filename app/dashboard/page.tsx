
import { createClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardPage() {
  const supabase = createClient()

  const [
    { data: pedidos },
    { data: guias },
    { data: instituicoes },
    { data: utentes },
  ] = await Promise.all([
    supabase.from('pedidos').select('id, estado, created_at'),
    supabase.from('guias').select('id, estado'),
    supabase.from('instituicoes').select('id, estado'),
    supabase.from('utentes').select('id'),
  ])

  const totalPedidos = pedidos?.length ?? 0
  const pedidosPendentes = pedidos?.filter(p => p.estado === 'pendente').length ?? 0
  const pedidosConcluidos = pedidos?.filter(p => p.estado === 'concluido').length ?? 0
  const guiasDisponiveis = guias?.filter(g => g.estado === 'disponivel').length ?? 0
  const totalGuias = guias?.length ?? 0
  const totalInstituicoes = instituicoes?.filter(i => i.estado === 'ativa').length ?? 0
  const totalUtentes = utentes?.length ?? 0

  const kpis = [
    { label: 'Total Pedidos', value: totalPedidos, sub: `${pedidosPendentes} pendentes` },
    { label: 'Concluídos', value: pedidosConcluidos, sub: 'este mês' },
    { label: 'Guias Disponíveis', value: guiasDisponiveis, sub: `de ${totalGuias} total` },
    { label: 'Instituições Ativas', value: totalInstituicoes, sub: `${totalUtentes} utentes` },
  ]

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 400, color: '#1B65B2', margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Visão geral da plataforma VEM</p>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        {kpis.map(k => (
          <div key={k.label} className="kpi-card">
            <p style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>{k.label}</p>
            <p style={{ fontSize: 32, fontWeight: 400, fontFamily: 'Fraunces, serif', color: '#1B65B2', margin: '0 0 4px' }}>{k.value}</p>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)', padding: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 16 }}>Acesso rápido</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { href: '/pedidos/novo', label: '+ Novo pedido' },
              { href: '/pedidos', label: 'Ver todos os pedidos' },
              { href: '/guias', label: 'Gerir guias' },
              { href: '/instituicoes', label: 'Ver instituições' },
            ].map(item => (
              <a key={item.href} href={item.href} style={{ fontSize: 13, color: '#1B65B2', textDecoration: 'none', padding: '8px 12px', borderRadius: 8, background: '#EBF2FA' }}>
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)', padding: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 16 }}>Estado dos pedidos</p>
          {[
            { label: 'Pendentes', value: pedidosPendentes, color: '#854d0e', bg: '#fef9c3' },
            { label: 'Concluídos', value: pedidosConcluidos, color: '#15803d', bg: '#dcfce7' },
            { label: 'Total', value: totalPedidos, color: '#1B65B2', bg: '#EBF2FA' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f9fafb' }}>
              <span style={{ fontSize: 13, color: '#374151' }}>{item.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, background: item.bg, color: item.color, padding: '2px 10px', borderRadius: 20 }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
