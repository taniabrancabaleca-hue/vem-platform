'use server'
import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function criarPedidoParceiroLivre(input: any) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Nao autenticado')

  const { data: perfil } = await supabase
    .from('perfis')
    .select('role, instituicao_id')
    .eq('id', user.id)
    .single()

  if (!perfil || perfil.role !== 'parceiro') throw new Error('Sem permissão')
  if (perfil.instituicao_id !== input.instituicao_id) throw new Error('Sem permissão para esta instituição')

  if (!input.urgente) {
    const dataServico = new Date(input.data_servico)
    const diffHoras = (dataServico.getTime() - Date.now()) / (1000 * 60 * 60)
    if (diffHoras < 24) throw new Error('O pedido tem de ser feito com pelo menos 24 horas de antecedência.')
  }

  const { count } = await supabase.from('pedidos').select('*', { count: 'exact', head: true })
  const codigo = 'PED-' + String((count ?? 0) + 1).padStart(4, '0')

  const { error } = await supabase.from('pedidos').insert({
    codigo,
    utente_nome_livre: input.utente_nome,
    instituicao_id: input.instituicao_id,
    servico: input.tipo_servico,
    data_pedido: input.data_servico,
    origem: input.origem ?? null,
    destino: input.destino ?? null,
    urgente: input.urgente ?? false,
    notas: input.notas ?? null,
    estado: 'pendente',
    criado_por: user.id,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/parceiro')
}
