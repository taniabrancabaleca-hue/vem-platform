import { createClient } from '@/lib/supabase'
import type { Guia } from '@/types/database'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const frac = rating - full
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="none">
          <polygon
            points="6,1 7.5,4.5 11,4.8 8.5,7 9.3,10.5 6,8.7 2.7,10.5 3.5,7 1,4.8 4.5,4.5"
            fill={i <= full ? '#0F6E56' : i === full + 1 && frac >= 0.5 ? '#0F6E56' : '#e5e7eb'}
            opacity={i === full + 1 && frac > 0 && frac < 0.5 ? 0.4 : 1}
          />
        </svg>
      ))}
      <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 4 }}>{Number(rating).toFixed(1)}</span>
    </span>
  )
}

function GuiaInitials({ nome }: { nome: string }) {
  const parts = nome.trim().split(' ')
  const initials = parts.length >= 2
    ? parts[0][0] + parts[parts.length - 1][0]
    : parts[0].slice(0, 2)
  return <>{initials.toUpperCase()}</>
}

const ZONA_COLORS: Record<string, { bg: string; color: string }> = {
  Lisboa:    { bg: '#E6F1FB', color: '#0C447C' },
  Porto:     { bg: '#EEEDFE', color: '#3C3489' },
  Coimbra:   { bg: '#E1F5EE', color: '#085041' },
  'Setúbal': { bg: '#FAEEDA', color: '#633806' },
  Braga:     { bg: '#FAECE7', color: '#712B13' },
}

function zonaColor(zona?: string) {
  if (!zona) return { bg: '#f3f4f6', color: '#6b7280' }
  return ZONA_COLORS[zona] ?? { bg: '#f3f4f6', color: '#6b7280' }
}

export default async function GuiasPage() {
  const supabase = createClient()
  const { data: guias, error } = await supabase
    .from('guias')
    .select('*')
    .order('rating', { ascending: false })

  if (error) return (
    <div style={{ padding: 40, color: '#dc2626', fontSize: 14 }}>
      Erro ao carregar guias: {error.message}
    </div>
  )

  const disponiveis = guias?.filter(g => g.estado === 'disponivel').length ?? 0
  const ocupados    = guias?.filter(g => g.estado === 'ocupado').length ?? 0
  const inativos    = guias?.filter(g => g.estado === 'inativo').length ?? 0

  return (
    <div className="fade-in">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 400, color: '#0F6E56', margin: 0 }}>
            Guias VEM
          </h1>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
            {disponiveis} disponíveis · {ocupados} ocupados · {inativos} inativos
          </p>
        </div>
        <a href="/guias/novo" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
          + Adicionar guia
        </a>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="kpi-card">
          <p style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>Total de guias</p>
          <p style={{ fontSize: 28, fontWeight: 400, fontFamily: 'Fraunces, serif', color: '#0F6E56', margin: 0 }}>{guias?.length ?? 0}</p>
        </div>
        <div className="kpi-card">
          <p style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>Disponíveis agora</p>
          <p style={{ fontSize: 28, fontWeight: 400, fontFamily: 'Fraunces, serif', color: '#0F6E56', margin: 0 }}>{disponiveis}</p>
        </div>
        <div className="kpi-card">
          <p style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>Rating médio</p>
          <p style={{ fontSize: 28, fontWeight: 400, fontFamily: 'Fraunces, serif', color: '#0F6E56', margin: 0 }}>
            {guias && guias.length > 0
              ? (guias.reduce((s, g) => s + Number(g.rating), 0) / guias.length).toFixed(1)
              : '—'}
          </p>
        </div>
      </div>

      {/* Tabela */}
      <div className="data-card">
        <table className="vem-table">
          <thead>
            <tr>
              <th>Guia</th>
              <th>Zona</th>
              <th>Contacto</th>
              <th>Rating</th>
              <th>Horas totais</th>
              <th>Estado</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {guias && guias.length > 0 ? guias.map((g: Guia) => {
              const zc = zonaColor(g.zona ?? undefined)
              return (
                <tr key={g.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: '#E1F5EE', color: '#0F6E56',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 600, flexShrink: 0,
                      }}>
                        <GuiaInitials nome={g.nome} />
                      </div>
                      <span style={{ fontWeight: 500, color: '#111827', fontSize: 13 }}>{g.nome}</span>
                    </div>
                  </td>
                  <td>
                    {g.zona
                      ? <span style={{ fontSize: 12, background: zc.bg, color: zc.color, padding: '2px 10px', borderRadius: 20, fontWeight: 500 }}>{g.zona}</span>
                      : <span style={{ color: '#9ca3af', fontSize: 12 }}>—</span>
                    }
                  </td>
                  <td style={{ fontSize: 12, color: '#6b7280' }}>
                    <div>{g.email}</div>
                    {g.telefone && <div style={{ marginTop: 2 }}>{g.telefone}</div>}
                  </td>
                  <td>
                    <StarRating rating={Number(g.rating)} />
                  </td>
                  <td style={{ fontSize: 13, color: '#374151' }}>
                    {g.total_horas ?? 0}h
                  </td>
                  <td>
                    <span className={`badge badge-${g.estado}`}>
                      {g.estado === 'disponivel' ? 'Disponível'
                        : g.estado === 'ocupado' ? 'Ocupado'
                        : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <a href={`/guias/${g.id}`} className="btn-secondary" style={{ padding: '4px 12px', fontSize: 12, textDecoration: 'none' }}>Ver</a>
                      <button className="btn-secondary" style={{ padding: '4px 12px', fontSize: 12 }}>Editar</button>
                    </div>
                  </td>
                </tr>
              )
            }) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: '#9ca3af', padding: 48 }}>
                  Nenhum guia registado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}