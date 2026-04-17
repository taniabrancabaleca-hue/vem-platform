'use server'
import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function atualizarGuia(id: string, input: {
  nome: string; email: string; telefone?: string; zona?: string; estado: string
}) {
  const supabase = createClient()
  const { error } = await supabase
    .from('guias')
    .update({
      nome: input.nome,
      email: input.email,
      telefone: input.telefone || null,
      zona: input.zona || null,
      estado: input.estado,
    })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/guias')
  revalidatePath(`/guias/${id}`)
}