'use server'
import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function criarPedido(formData: {
  utente_id: string
  instituicao_id: string
  tipo_servico: string
  data_servico: string
  origem?: string
  destino?: string
  urgente: boolean
  notas?: string
}) {
  const supabase = createClient()

  const { error } = await supabase.from('pedidos').insert({
    ...formData,
    estado: 'pendente',
  })

  if (error) throw new Error(error.message)

  revalidatePath('/pedidos')
}