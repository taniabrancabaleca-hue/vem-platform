import { createClient } from '@/lib/supabase'
import PedidosClient from './PedidosClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PedidosPage() {
  const supabase = createClient()

  const [
    { data: pedidos },
    { data: utentes },
    { data: instituicoes },
  ] = await Promise.all([
    supabase
      .from('pedidos')
      .select('*, utente:utentes(nome, condicao), guia:guias(nome), instituicao:instituicoes(nome)')
      .order('created_at', { ascending: false })
      .limit(50),
    supabase
      .from('utentes')
      .select('id, nome, condicao')
      .eq('ativo', true)
      .order('nome'),
    supabase
      .from('instituicoes')
      .select('id, nome')
      .eq('estado', 'ativa')
      .order('nome'),
  ])

  return (
    <PedidosClient
      pedidos={pedidos ?? []}
      utentes={utentes ?? []}
      instituicoes={instituicoes ?? []}
    />
  )
}