'use server'
import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { enviarEmailGuiaAtribuido } from '@/lib/emails'

export async function atribuirGuia(pedidoId: string, guiaId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { error } = await supabase.from('pedidos').update({ guia_id: guiaId, estado: 'atribuido' }).eq('id', pedidoId)
  if (error) throw new Error(error.message)

  const { data: pedido } = await supabase
    .from('pedidos')
    .select('codigo, servico, data_pedido, utente:utentes(nome), instituicao:instituicoes(nome, email), guia:guias(nome, zona, telefone)')
    .eq('id', pedidoId)
    .single()

  if (pedido?.instituicao?.email) {
    try {
      await enviarEmailGuiaAtribuido({
        para: pedido.instituicao.email, codigo: pedido.codigo,
        servico: pedido.servico, utente: pedido.utente?.nome ?? '—',
        guia: pedido.guia?.nome ?? '—', guiaZona: pedido.guia?.zona ?? undefined,
        guiaTelefone: pedido.guia?.telefone ?? undefined,
        data: new Date(pedido.data_pedido).toLocaleDateString('pt-PT'),
      })
    } catch (e) { console.error('Erro ao enviar email:', e) }
  }

  revalidatePath('/pedidos')
  revalidatePath(`/pedidos/${pedidoId}`)
}

export async function removerGuia(pedidoId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { error } = await supabase.from('pedidos').update({ guia_id: null, estado: 'pendente' }).eq('id', pedidoId)
  if (error) throw new Error(error.message)

  revalidatePath('/pedidos')
  revalidatePath(`/pedidos/${pedidoId}`)
}