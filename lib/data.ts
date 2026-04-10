import { createClient } from './supabase'
import type { StatsGeral, Pedido, StatsMensais } from '@/types/database'

const sb = () => createClient()

// ─── Dashboard stats ───────────────────────────────────────────────
export async function getStatsGeral(): Promise<StatsGeral> {
  const client = sb()
  const now = new Date()
  const mesAtual = now.toISOString().slice(0, 7)        // "2024-07"
  const mesAnterior = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    .toISOString().slice(0, 7)

  const [pedidosMes, pedidosAnt, guias, instituicoes, stats] = await Promise.all([
    client.from('pedidos').select('id, duracao_horas, feedback_rating', { count: 'exact' })
      .gte('data_servico', mesAtual + '-01'),
    client.from('pedidos').select('id', { count: 'exact' })
      .gte('data_servico', mesAnterior + '-01')
      .lt('data_servico', mesAtual + '-01'),
    client.from('guias').select('id', { count: 'exact' }).eq('estado', 'disponivel'),
    client.from('instituicoes').select('id', { count: 'exact' }).eq('estado', 'ativa'),
    client.from('pedidos').select('feedback_rating')
      .not('feedback_rating', 'is', null)
      .gte('data_servico', mesAtual + '-01'),
  ])

  const totalMes = pedidosMes.count ?? 0
  const totalAnt = pedidosAnt.count ?? 1
  const crescimento = Math.round(((totalMes - totalAnt) / totalAnt) * 100)

  const horas = (pedidosMes.data ?? []).reduce((s, p) => s + (p.duracao_horas ?? 0), 0)
  const ratings = (stats.data ?? []).map(p => p.feedback_rating).filter(Boolean) as number[]
  const satisfacao = ratings.length
    ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
    : 4.8

  return {
    totalMes,
    horasMes: Math.round(horas),
    satisfacaoMedia: satisfacao,
    guiasAtivos: guias.count ?? 0,
    instituicoesAtivas: instituicoes.count ?? 0,
    crescimento,
  }
}

// ─── Pedidos recentes ──────────────────────────────────────────────
export async function getPedidosRecentes(limit = 10): Promise<Pedido[]> {
  const { data } = await sb()
    .from('pedidos')
    .select(`*, utente:utentes(nome, condicao), guia:guias(nome), instituicao:instituicoes(nome)`)
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data as Pedido[]) ?? []
}

// ─── Stats mensais (gráfico) ───────────────────────────────────────
export async function getStatsMensais(meses = 8): Promise<StatsMensais[]> {
  const { data } = await sb()
    .from('v_stats_mensais')
    .select('*')
    .order('mes', { ascending: false })
    .limit(meses)
  return ((data ?? []) as StatsMensais[]).reverse()
}

// ─── Pedidos por tipo (doughnut) ───────────────────────────────────
export async function getPedidosPorTipo() {
  const { data } = await sb().from('v_pedidos_por_tipo').select('*')
  return data ?? []
}

// ─── Top guias ─────────────────────────────────────────────────────
export async function getTopGuias(limit = 5) {
  const { data } = await sb().from('v_top_guias').select('*').limit(limit)
  return data ?? []
}

// ─── Pedidos por instituição ───────────────────────────────────────
export async function getPedidosPorInstituicao() {
  const { data } = await sb()
    .from('pedidos')
    .select('instituicao:instituicoes(nome)')
    .eq('estado', 'concluido')
  if (!data) return []
  const counts: Record<string, number> = {}
  for (const p of data as any[]) {
    const nome = p.instituicao?.nome ?? 'Desconhecida'
    counts[nome] = (counts[nome] ?? 0) + 1
  }
  return Object.entries(counts)
    .map(([nome, total]) => ({ nome, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6)
}

// ─── Criar pedido ──────────────────────────────────────────────────
export async function criarPedido(pedido: {
  instituicao_id: string
  utente_id: string
  tipo_servico: string
  origem?: string
  destino?: string
  data_servico: string
  duracao_horas?: number
  urgente?: boolean
  notas?: string
}) {
  const { data, error } = await sb().from('pedidos').insert(pedido as any).select().single()
  if (error) throw error
  return data
}

// ─── Atualizar estado pedido ───────────────────────────────────────
export async function atualizarEstadoPedido(id: string, estado: string, guia_id?: string) {
  const update: any = { estado, updated_at: new Date().toISOString() }
  if (guia_id) update.guia_id = guia_id
  const { error } = await sb().from('pedidos').update(update).eq('id', id)
  if (error) throw error
}

// ─── Utentes por instituição ───────────────────────────────────────
export async function getUtentesPorInstituicao(instituicao_id: string) {
  const { data } = await sb()
    .from('utentes')
    .select('*')
    .eq('instituicao_id', instituicao_id)
    .eq('ativo', true)
  return data ?? []
}

// ─── Guias disponíveis ─────────────────────────────────────────────
export async function getGuiasDisponiveis() {
  const { data } = await sb()
    .from('guias')
    .select('*')
    .eq('estado', 'disponivel')
    .order('rating', { ascending: false })
  return data ?? []
}
