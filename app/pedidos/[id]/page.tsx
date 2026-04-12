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
        </div>
        <span style={{ fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 20, background: '#f3f4f6', color: '#374151' }}>
          {ESTADO_LABEL[pedido.estado] ?? pedido.estado}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Utente</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Row label="Nome" value={pedido.utente?.nome ?? '—'} />
            <Row label="Condição" value={pedido.utente?.condicao ?? '—'} />
            {pedido.utente?.notas_clinicas && (
              <Row label="Notas clínicas" value={pedido.utente.notas_clinicas} />
            )}
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Pedido</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Row label="Serviço" value={SERVICO_LABEL[pedido.servico] ?? pedido.servico} />
            <Row label="Instituição" value={pedido.instituicao?.nome ?? '—'} />
            <Row label="Data" value={pedido.data_pedido ? new Date(pedido.data_pedido).toLocaleDateString('pt-PT') : '—'} />
            {pedido.notas && <Row label="Notas" value={pedido.notas} />}
          </div>
        </div>
      </div>

      {pedido.guia && (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Guia atribuído</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Row label="Nome" value={pedido.guia.nome} />
            <Row label="Zona" value={pedido.guia.zona} />
            <Row label="Telefone" value={pedido.guia.telefone ?? '—'} />
            <Row label="Rating" value={pedido.guia.rating?.toString() ?? '—'} />
          </div>
        </div>
      )}

      {podeAtribuir && (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Atribuir guia</p>
          <AtribuirGuiaForm pedidoId={pedido.id} guias={guias ?? []} guiaAtualId={pedido.guia_id ?? undefined} />
        </div>
      )}
    </div>
  )
}