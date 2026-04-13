'use server'
import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { enviarEmailPedidoCriado } from '@/lib/emails'

interface CriarPedidoInput {
  utente_id: string
  instituicao_id: string
  tipo_servico: string
  data_servico: string
  origem?: string
  destino?: string
  urgente?: boolean
  notas?: string
}

export async function criarPedido(input: CriarPedidoInput) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { count } = await supabase.from('pedidos').select('*', { count: 'exact', head: true })
  const codigo = `PED-${String((count ?? 0) + 1).padStart(4, '0')}`

  const [{ data: utente }, { data: instituicao }] = await Promise.all([
    supabase.from('utentes').select('nome').eq('id', input.utente_id).single(),
    supabase.from('instituicoes').select('nome, email').eq('id', input.instituicao_id).single(),
  ])

  const { error } = await supabase.from('pedidos').insert({
    codigo, utente_id: input.utente_id, instituicao_id: input.instituicao_id,
    servico: input.tipo_servico, data_pedido: input.data_servico,
    origem: input.origem ?? null, destino: input.destino ?? null,
    urgente: input.urgente ?? false, notas: input.notas ?? null,
    estado: 'pendente', criado_por: user.id,
  })

  if (error) throw new Error(error.message)

  if (instituicao?.email) {
    try {
      await enviarEmailPedidoCriado({
        para: instituicao.email, codigo, servico: input.tipo_servico,
        utente: utente?.nome ?? '—', instituicao: instituicao.nome,
        data: new Date(input.data_servico).toLocaleDateString('pt-PT'),
        urgente: input.urgente ?? false,
      })
    } catch (e) { console.error('Erro ao enviar email:', e) }
  }

  revalidatePath('/pedidos')
}

export async function atualizarEstadoPedido(pedidoId: string, estado: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { error } = await supabase.from('pedidos').update({ estado }).eq('id', pedidoId)
  if (error) throw new Error(error.message)

  revalidatePath('/pedidos')
  revalidatePath(`/pedidos/${pedidoId}`)
}