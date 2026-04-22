import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ParceiroPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('perfis')
    .select('role, instituicao_id, instituicoes(nome)')
    .eq('id', user.id)
    .single()

  if (!perfil || perfil.role !== 'parceiro') redirect('/dashboard')

  const instituicaoId = perfil.instituicao_id
  const instituicaoNome = (perfil.instituicoes as any)?.nome ?? 'Instituição'

  const { data: pedidos } = await supabase
    .from('pedidos')
    .select('id, codigo, servico, data_pedido, estado, urgente, utente_nome_livre, utente:utentes(nome)')
    .eq('instituicao_id', instituicaoId)
    .order('created_at', { ascending: false })
    .limit(20)

  const { data: packs } = await supabase
    .from('packs_horas')
    .select('horas_contratadas, horas_usadas')
    .eq('instituicao_id', instituicaoId)
    .eq('ativo', true)
    .limit(1)

  const pack = packs?.[0] ?? null
  const horasContratadas = pack?.horas_contratadas ?? 0
  const horasUsadas = pack?.horas_usadas ?? 0
  const horasDisponiveis = horasContratadas - horasUsadas
  const percentagem = horasContratadas > 0 ? Math.round((horasUsadas / horasContratadas) * 100) : 0

  const ESTADO_LABEL: Record<string, string> = {
    pendente: 'Pendente', atribuido: 'Atribuído', guia_a_caminho: 'A caminho',
    em_curso: 'Em curso', concluido: 'Concluído', cancelado: 'Cancelado',
  }

  const ESTADO_COR: Record<string, { bg: string, color: string }> = {
    pendente:       { bg: '#fef9c3', color: '#854d0e' },
    atribuido:      { bg: '#dcfce7', color: '#15803d' },
    guia_a_caminho: { bg: '#dbeafe', color: '#1d4ed8' },
    em_curso:       { bg: '#ede9fe', color: '#6d28d9' },
    concluido:      { bg: '#d1fae5', color: '#065f46' },
    cancelado:      { bg: '#fee2e2', color: '#dc2626' },
  }

  const SERVICO_LABEL: Record<string, string> = {
    consulta_externa: 'Consulta externa', transporte_consulta: 'Transporte consulta',
    passeio: 'Passeio', recolha_pos_alta: 'Recolha pós-alta',
    acompanhamento_exame: 'Acomp. exame',
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 400, color: '#1B65B2', margin: 0 }}>
          {instituicaoNome}
        </h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Portal do parceiro</p>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        <div className="kpi-card">
          <p style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>Horas Contratadas</p>
          <p style={{ fontSize: 32, fontWeight: 400, fontFamily: 'Fraunces, serif', color: '#1B65B2', margin: '0 0 4px' }}>{horasContratadas}h</p>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>pack atual</p>
        </div>
        <div className="kpi-card">
          <p style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>Horas Disponíveis</p>
          <p style={{ fontSize: 32, fontWeight: 400, fontFamily: 'Fraunces, serif', color: horasDisponiveis > 5 ? '#15803d' : '#dc2626', margin: '0 0 4px' }}>{horasDisponiveis}h</p>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>para usar</p>
        </div>
        <div className="kpi-card">
          <p style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>Horas Usadas</p>
          <p style={{ fontSize: 32, fontWeight: 400, fontFamily: 'Fraunces, serif', color: '#1B65B2', margin: '0 0 4px' }}>{horasUsadas}h</p>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>{percentagem}% do pack</p>
        </div>
      </div>

      {horasContratadas > 0 && (
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e5e7eb', padding: 20, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>Utilização do pack</span>
            <span style={{ fontSize: 13, color: '#6b7280' }}>{horasUsadas}h / {horasContratadas}h</span>
          </div>
          <div style={{ background: '#e5e7eb', borderRadius: 999, height: 8 }}>
            <div style={{ background: percentagem > 80 ? '#dc2626' : '#1B65B2', borderRadius: 999, height: 8, width: `${Math.min(percentagem, 100)}%` }} />
          </div>
          {horasDisponiveis <= 5 && horasDisponiveis > 0 && (
            <p style={{ fontSize: 12, color: '#dc2626', marginTop: 8 }}>⚠️ Pack quase esgotado — contacte a VEM para renovar.</p>
          )}
          {horasDisponiveis <= 0 && (
            <p style={{ fontSize: 12, color: '#dc2626', marginTop: 8 }}>❌ Pack esgotado — contacte a VEM para renovar.</p>
          )}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#374151', margin: 0 }}>Os meus pedidos</h2>
        <a href="/parceiro/pedidos/novo" className="btn-primary" style={{ fontSize: 13, textDecoration: 'none', padding: '8px 16px' }}>
          + Novo pedido
        </a>
      </div>

      {/* Mobile: cards */}
      <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(pedidos ?? []).length > 0 ? (pedidos ?? []).map((p: any) => {
          const cor = ESTADO_COR[p.estado] ?? { bg: '#f3f4f6', color: '#374151' }
          const nomeUtente = (p.utente as any)?.nome ?? p.utente_nome_livre ?? '—'
          return (
            <div key={p.id} style={{ background: 'white', borderRadius: 12, border: '1px solid #e5e7eb', padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#1B65B2', fontWeight: 600 }}>#{p.codigo}</span>
                <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: cor.bg, color: cor.color }}>
                  {ESTADO_LABEL[p.estado] ?? p.estado}
                </span>
              </div>
              <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 500, color: '#111827' }}>{nomeUtente}</p>
              <p style={{ margin: '0 0 8px', fontSize: 12, color: '#9ca3af' }}>
                {SERVICO_LABEL[p.servico] ?? p.servico ?? '—'}
                {p.data_pedido ? ` · ${new Date(p.data_pedido).toLocaleDateString('pt-PT')}` : ''}
              </p>
              {p.estado === 'pendente' && (
                <a href={`/parceiro/pedidos/${p.id}/editar`} style={{ fontSize: 12, color: '#1B65B2', textDecoration: 'none', padding: '5px 12px', borderRadius: 8, border: '1px solid #1B65B2', display: 'inline-block' }}>
                  ✏️ Editar
                </a>
              )}
            </div>
          )
        }) : (
          <div style={{ textAlign: 'center', color: '#9ca3af', padding: 48 }}>Nenhum pedido ainda</div>
        )}
      </div>

      {/* Desktop: tabela */}
      <div className="data-card desktop-only">
        <table className="vem-table">
          <thead>
            <tr>
              <th>Código</th><th>Utente</th><th>Serviço</th><th>Data</th><th>Estado</th><th></th>
            </tr>
          </thead>
          <tbody>
            {(pedidos ?? []).length > 0 ? (pedidos ?? []).map((p: any) => {
              const cor = ESTADO_COR[p.estado] ?? { bg: '#f3f4f6', color: '#374151' }
              const nomeUtente = (p.utente as any)?.nome ?? p.utente_nome_livre ?? '—'
              return (
                <tr key={p.id}>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 12, color: '#1B65B2', fontWeight: 500 }}>#{p.codigo}</span></td>
                  <td style={{ fontWeight: 500, fontSize: 13 }}>{nomeUtente}</td>
                  <td style={{ fontSize: 13, color: '#374151' }}>{SERVICO_LABEL[p.servico] ?? p.servico ?? '—'}</td>
                  <td style={{ fontSize: 12, color: '#6b7280' }}>{p.data_pedido ? new Date(p.data_pedido).toLocaleDateString('pt-PT') : '—'}</td>
                  <td>
                    <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: cor.bg, color: cor.color }}>
                      {ESTADO_LABEL[p.estado] ?? p.estado}
                    </span>
                  </td>
                  <td>
                    {p.estado === 'pendente' && (
                      <a href={`/parceiro/pedidos/${p.id}/editar`} style={{ fontSize: 12, color: '#1B65B2', textDecoration: 'none', padding: '4px 10px', borderRadius: 6, border: '1px solid #1B65B2' }}>
                        ✏️ Editar
                      </a>
                    )}
                  </td>
                </tr>
              )
            }) : (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#9ca3af', padding: 48 }}>Nenhum pedido ainda</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
