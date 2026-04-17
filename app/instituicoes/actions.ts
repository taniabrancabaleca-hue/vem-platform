'use server'
import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function aprovarInstituicao(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('instituicoes')
    .update({ estado: 'ativa' })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/instituicoes')
}

export async function criarInstituicao(input: {
  nome: string; tipo: string; email: string
  telefone?: string; morada?: string; cidade?: string; nif?: string
}) {
  const supabase = createClient()
  const { error } = await supabase.from('instituicoes').insert({
    ...input,
    estado: 'pendente',
  })
  if (error) throw new Error(error.message)
  revalidatePath('/instituicoes')
}
