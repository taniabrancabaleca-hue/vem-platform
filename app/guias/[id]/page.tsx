import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

const SERVICO_LABEL: Record<string, string> = {
  consulta_externa:     'Consulta externa',
  transporte_consulta:  'Transporte para consulta',
  passeio:              'Passeio',
  recolha_pos_alta:     'Recolha pós-alta',
  acompanhamento_exame: 'Acompanhamento a exame',
}

const ESTADO_LABEL: Record<string, string> = {
  pendente:       'Pendente',
  atribuido:      'Atribuído',
  guia_a_caminho: 'A caminho',
  em_curso:       'Em curso',
  concluido:      'Concluído',
  cancelado:      'Cancelado',
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

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const frac = rating - full
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="16" height="16" viewBox="0 0 12 12" fill="none">
          <polygon
            points="6,1 7.5,4.5 11,4.8 8.5,7 9.3,10.5 6,8.7 2.7,10.5 3.5,7 1,4.8 4.5,4.5"
            fill={i <= full ? '#0F6E56' : i === full + 1 && frac >= 0.5 ? '#0F6E56' : '#e5e7eb'}
            opacity={i === full + 1 && frac > 0 && frac < 0.5 ? 0.4 : 1}
          />
        </svg>
      ))}
      <span style={{ fontSize: 14, color: '#374151', marginLeft: 6, fontWeight: 500 }}>
        {Number(rating).toFixed(1)}
      </span>
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

export default async function GuiaPerfilPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const [{ data: guia }, { data: pedidos }] = await Promise.all([
    supabase.from('guias').select('*').eq('id', params.id).single(),
    supabase
      .from('pedidos')
      .select('*, utente:utentes(nome), instituicao:instituicoes(nome)')
      .eq('guia_id', params.id)
      .order('data_servico', { ascending: false })
      .limit(20),
  ])

  if (!guia) notFound()

  const zc = zonaColor(guia.zona ?? undefined)
  const concluidos = pedidos?.filter(p => p.estado === 'concluido').length ?? 0
  const emCurso    = pedidos?.filter(p => ['atribuido', 'guia_a_caminho', 'em_curso'].includes(p.estado)).length ?? 0

  return (
    <div className="fade-in">

      <div style={{ marginBottom: 32 }}>
        <a href="/guias" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>← Guias</a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: '#E1F5EE', color: '#0F6E56',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 600, flexShrink: 0,
          }}>
            <GuiaInitials nome={guia.nome} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 400, color: '#0F6E56', margin: 0 }}>
              {guia.nome}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
              {guia.zona && (
                <span style={{ fontSize: 12, background: zc.bg, color: zc.color, padding: '2px 10px', borderRadius: 20, fontWeight: 500 }}>
                  {guia.zona}
                </span>
              )}
              <span className={`badge badge-${guia.estado}`}>
                {guia.estado === 'disponivel' ? 'Disponível' : guia.estado === 'ocupado' ? 'Ocupado' : 'Inativo'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="kpi-card">
          <p style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>Rating</p>
          <StarRating rating={Number(guia.rating)} />
        </div>
        <div className="kpi-card">
          <p style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>Total horas</p>
          <p style={{ fontSize: 28, fontWeight: 400, fontFamily: 'Fraunces, serif', color: '#0F6E56', margin: 0 }}>{guia.total_horas ?? 0}h</p>
        </div>
        <div className="kpi-card">
          <p style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>Concluídos</p>
          <p style={{ fontSize: 28, fontWeight: 400, fontFamily: 'Fraunces, serif', color: '#0F6E56', margin: 0 }}>{concluidos}</p>
        </div>
        <div className="kpi-card">
          <p style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>Em curso</p>
          <p style={{ fontSize: 28, fontWeight: 400, fontFamily: 'Fraunces, serif', color: '#0F6E56', margin: 0 }}>{emCurso}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>

        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, height: 'fit-content' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Contacto</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 2px' }}>Email</p>
              <p style={{ fontSize: 13, color: '#111827', margin: 0 }}>{guia.email}</p>
            </div>
            {guia.telefone && (
              <div>
                <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 2px' }}>Telefone</p>
                <p style={{ fontSize: 13, color: '#111827', margin: 0 }}>{guia.telefone}</p>
              </div>
            )}
            <div>
              <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 2px' }}>Zona de cobertura</p>
              <p style={{ fontSize: 13, color: '#111827', margin: 0 }}>{guia.zona ?? '—'}</p>
            </div>
            <div>
              <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 2px' }}>Membro desde</p>
              <p style={{ fontSize: 13, color: '#111827', margin: 0 }}>
                {new Date(guia.created_at).toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Historial de pedidos</p>
          {pedidos && pedidos.length > 0 ? (
            <table className="vem-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Utente</th>
                  <th>Serviço</th>
                  <th>Data</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p: any) => (
                  <tr key={p.id}>
                    <td>
                      <a href={`/pedidos/${p.id}`} style={{ fontSize: 13, color: '#0F6E56', textDecoration: 'none', fontWeight: 500 }}>
                        #{p.codigo}
                      </a>
                    </td>
                    <td style={{ fontSize: 13, color: '#374151' }}>{p.utente?.nome ?? '—'}</td>
                    <td style={{ fontSize: 12, color: '#6b7280' }}>{SERVICO_LABEL[p.servico] ?? p.servico}</td>
                    <td style={{ fontSize: 12, color: '#6b7280' }}>
                      {p.data_pedido ? new Date(p.data_pedido).toLocaleDateString('pt-PT') : '—'}
                    </td>
                    <td>
                      <span className={`badge badge-${p.estado}`}>
                        {ESTADO_LABEL[p.estado] ?? p.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', padding: '32px 0' }}>
              Sem pedidos registados
            </p>
          )}
        </div>

      </div>
    </div>
  )
}
