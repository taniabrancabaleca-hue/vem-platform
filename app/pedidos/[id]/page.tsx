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