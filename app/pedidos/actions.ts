'use server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
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
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase.from('pedidos').insert({
    ...formData,
    estado: 'pendente',
  })

  if (error) throw new Error(error.message)

  revalidatePath('/pedidos')
}