import { createClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import AtribuirGuiaForm from './AtribuirGuiaForm'

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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      <span style={{ fontSize: 12, color: '#6b7280', width: 110, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, color: '#111827' }}>{value}</span>
    </div>
  )
}

export default async function PedidoDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const [{ data: pedido }, { data: guias }] = await Promise.all([
    supabase
      .from('pedidos')
      .select('*, utente:utentes(nome, condicao, notas_clinicas), guia:guias(nome, zona, rating, telefone), instituicao:instituicoes(nome)')
      .eq('id', params.id)
      .single(),
    supabase
      .from('guias')
      .select('id, nome, zona, rating, telefone, estado')
      .eq('estado', 'disponivel')
      .order('rating', { ascending: false }),
  ])

  if (!pedido) notFound()

  const podeAtribuir = ['pendente', 'atribuido'].includes(pedido.estado)

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <a href="/pedidos" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>← Pedidos</a>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 400, color: '#0F6E56', margin: '4px 0 0' }}>
            #{pedido.codigo}
          </h1>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
            {pedido.utente?.nome} · {SERVICO_LABEL[pedido.tipo_servico] ?? pedido.tipo_servico}
          </p>
        </div>
        <span className={`badge badge-${pedido.estado}`} style={{ fontSize: 13, padding: '4px 14px' }}>
          {ESTADO_LABEL[pedido.estado] ?? pedido.estado}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        <div className="data-card" style={{ padding: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 16px' }}>
            Detalhes do pedido
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Row label="Utente" value={pedido.utente?.nome ?? '—'} />
            <Row label="Condição" value={pedido.utente?.condicao ?? '—'} />
            <Row label="Instituição" value={pedido.instituicao?.nome ?? '—'} />
            <Row label="Tipo de serviço" value={SERVICO_LABEL[pedido.tipo_servico] ?? pedido.tipo_servico} />
            <Row label="Data" value={new Date(pedido.data_servico).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })} />
            {pedido.origem && <Row label="Origem" value={pedido.origem} />}
            {pedido.destino && <Row label="Destino" value={pedido.destino} />}
          </div>
          {pedido.utente?.notas_clinicas && (
            <div style={{ marginTop: 20, background: '#FAEEDA', border: '1px solid #FAC775', borderRadius: 8, padding: '12px 14px' }}>
              <p style={{ fontSize: 11, fontWeight: 500, color: '#633806', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>Notas clínicas</p>
              <p style={{ fontSize: 13, color: '#633806', margin: 0, lineHeight: 1.6 }}>{pedido.utente.notas_clinicas}</p>
            </div>
          )}
          {pedido.notas && (
            <div style={{ marginTop: 12, background: '#f9f9f7', borderRadius: 8, padding: '12px 14px' }}>
              <p style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>Notas</p>
              <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.6 }}>{pedido.notas}</p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="data-card" style={{ padding: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 16px' }}>
              Guia atribuído
            </p>
            {pedido.guia ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E1F5EE', color: '#0F6E56', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, flexShrink: 0 }}>
                  {pedido.guia.nome.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <p style={{ fontWeight: 500, fontSize: 14, margin: 0 }}>{pedido.guia.nome}</p>
                  <p style={{ fontSize: 12, color: '#6b7280', margin: '2px 0 0' }}>
                    {pedido.guia.zona} · ★ {Number(pedido.guia.rating).toFixed(1)}
                  </p>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Nenhum guia atribuído ainda</p>
            )}
          </div>

          {podeAtribuir && (
            <AtribuirGuiaForm
              pedidoId={pedido.id}
              guiaAtualId={pedido.guia_id ?? null}
              guias={guias ?? []}
            />
          )}
        </div>
      </div>
    </div>
  )
}