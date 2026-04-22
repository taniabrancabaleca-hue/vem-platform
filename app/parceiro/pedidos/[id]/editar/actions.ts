'use server'
import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function editarPedidoParceiro(pedidoId: string, input: any) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Nao autenticado')

  const { data: perfil } = await supabase
    .from('perfis')
    .select('role, instituicao_id')
    .eq('id', user.id)
    .single()

  if (!perfil || perfil.role !== 'parceiro') throw new Error('Sem permissão')

  const { data: pedido } = await supabase
    .from('pedidos')
    .select('estado, instituicao_id')
    .eq('id', pedidoId)
    .single()

  if (!pedido) throw new Error('Pedido não encontrado')
  if (pedido.estado !== 'pendente') throw new Error('Só é possível editar pedidos pendentes')
  if (pedido.instituicao_id !== perfil.instituicao_id) throw new Error('Sem permissão')

  const { error } = await supabase
    .from('pedidos')
    .update({
      utente_nome_livre: input.utente_nome,
      servico: input.tipo_servico,
      data_pedido: input.data_servico,
      origem: input.origem ?? null,
      destino: input.destino ?? null,
      urgente: input.urgente ?? false,
      notas: input.notas ?? null,
    })
    .eq('id', pedidoId)

  if (error) throw new Error(error.message)
  revalidatePath('/parceiro')
}
