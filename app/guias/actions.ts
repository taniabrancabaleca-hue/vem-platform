'use server'
import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

interface CriarGuiaInput {
  nome: string
  email: string
  telefone?: string
  zona?: string
}

export async function criarGuia(input: CriarGuiaInput) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { error } = await supabase.from('guias').insert({
    nome: input.nome,
    email: input.email,
    telefone: input.telefone || null,
    zona: input.zona || null,
    estado: 'disponivel',
    rating: 0,
    total_horas: 0,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/guias')
}