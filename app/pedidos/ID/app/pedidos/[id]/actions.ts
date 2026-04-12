'use server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

export async function atribuirGuia({
  pedidoId, guiaId, notas,
}: {
  pedidoId: string
  guiaId: string
  notas?: string
}) {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase
    .from('pedidos')
    .update({
      guia_id: guiaId,
      estado: 'atribuido',
      ...(notas ? { notas } : {}),
    })
    .eq('id', pedidoId)

  if (error) throw new Error(error.message)

  revalidatePath('/pedidos')
  revalidatePath(`/pedidos/${pedidoId}`)
}