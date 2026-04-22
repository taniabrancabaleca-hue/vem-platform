'use server'
import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function atribuirGuia(pedidoId: string, guiaId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')
  const { error } = await supabase
    .from('pedidos')
    .update({ guia_id: guiaId, estado: 'atribuido' })
    .eq('id', pedidoId)
  if (error) throw new Error(error.message)
  revalidatePath('/pedidos')
  revalidatePath(`/pedidos/${pedidoId}`)
}

export async function removerGuia(pedidoId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')
  const { error } = await supabase
    .from('pedidos')
    .update({ guia_id: null, estado: 'pendente' })
    .eq('id', pedidoId)
  if (error) throw new Error(error.message)
  revalidatePath('/pedidos')
  revalidatePath(`/pedidos/${pedidoId}`)
}

export async function aprovarPedido(pedidoId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')
  const { error } = await supabase
    .from('pedidos')
    .update({ estado: 'atribuido' })
    .eq('id', pedidoId)
  if (error) throw new Error(error.message)
  revalidatePath('/pedidos')
  revalidatePath(`/pedidos/${pedidoId}`)
}

export async function rejeitarPedido(pedidoId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')
  const { error } = await supabase
    .from('pedidos')
    .update({ estado: 'cancelado' })
    .eq('id', pedidoId)
  if (error) throw new Error(error.message)
  revalidatePath('/pedidos')
  revalidatePath(`/pedidos/${pedidoId}`)
}
