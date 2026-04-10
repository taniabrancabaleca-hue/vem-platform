import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardPage() {
  const supabase = createClient()

  const [guiasRes, instRes] = await Promise.all([
    supabase.from('guias').select('*').order('rating', { ascending: false }).limit(5),
    supabase.from('instituicoes').select('*').order('created_at', { ascending: false }).limit(6),
  ])

  const guias = guiasRes.data ?? []
  const inst = instRes.data ?? []

  const kpis = [
    { label: 'Guias registados', value: guias.length, sub: 'Na plataforma', color: '#0F6E56', bg: '#E1F5EE' },
    { label: 'Instituições ativas', value: inst.filter((i: any) => i.estado === 'ativa').length, sub: 'Parceiros B2B', color: '#185FA5', bg: '#E6F1FB' },
    { label: 'Satisfação média', value: '4.8 ★', sub: 'Avaliações utentes', color: '#BA7517', bg: '#FAEEDA' },
    { label: 'Acompanhamentos', value: 0, sub: 'Este mês', color: '#7F77DD', bg: '#EEEDFE' },
  ]

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 400, color: '#0F6E56', margin: 0 }}>Analytics</h1>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Visão geral da operação VEM</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
        {kpis.map((k, i) => (
          <div key={i} className="kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k.label}</p>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: k.color }} />
              </div>
            </div>
            <p style={{ fontSize: 26, fontWeight: 600, color: '#111827', lineHeight: 1 }}>{k.value}</p>
            <p style={{ fontSize: 11, color: k.color, marginTop: 6 }}>{k.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="data-card">
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #f3f4f6' }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top guias VEM</p>
          </div>
          <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {guias.map((g: any) => {
              const initials = g.nome.split(' ').slice(0,2).map((w: string) => w[0]).join('')
              const pct = Math.round(((g.rating as number) / 5) * 100)
              return (
                <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#E1F5EE', color: '#085041', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, flexShrink: 0 }}>{initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 500 }}>{g.nome}</span>
                      <span style={{ fontSize: 11, color: '#BA7517' }}>★ {String(g.rating)}</span>
                    </div>
                    <div style={{ height: 4, background: '#f3f4f6', borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: '#1D9E75', borderRadius: 2 }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="data-card">
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #f3f4f6' }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Instituições parceiras</p>
          </div>
          <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {inst.map((i: any) => (
              <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #f9f9f7' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#111827', margin: 0 }}>{i.nome}</p>
                  <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{i.cidade} · {i.tipo}</p>
                </div>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12, background: i.estado === 'ativa' ? '#E1F5EE' : '#FAEEDA', color: i.estado === 'ativa' ? '#085041' : '#633806', fontWeight: 500 }}>
                  {i.estado === 'ativa' ? 'Ativa' : 'Pendente'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}