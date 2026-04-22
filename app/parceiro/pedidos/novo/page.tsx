import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import NovoPedidoParceiroForm from './NovoPedidoParceiroForm'

export const dynamic = 'force-dynamic'

export default async function NovoPedidoParceiroPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('perfis')
    .select('role, instituicao_id')
    .eq('id', user.id)
    .single()

  if (!perfil || perfil.role !== 'parceiro') redirect('/dashboard')

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 32 }}>
        <a href="/parceiro" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>← Portal</a>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 400, color: '#1B65B2', margin: '4px 0 0' }}>
          Novo pedido
        </h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Submeter um novo pedido de transporte</p>
      </div>
      <NovoPedidoParceiroForm instituicaoId={perfil.instituicao_id} />
    </div>
  )
}
