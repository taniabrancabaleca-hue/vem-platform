import { createClient } from '@/lib/supabase'
import NovoPedidoForm from '../NovoPedidoForm'

export const dynamic = 'force-dynamic'

export default async function NovoPedidoPage() {
  const supabase = createClient()
  const [{ data: utentes }, { data: instituicoes }] = await Promise.all([
    supabase.from('utentes').select('id, nome, condicao').eq('ativo', true).order('nome'),
    supabase.from('instituicoes').select('id, nome').eq('estado', 'ativa').order('nome'),
  ])

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 400, color: '#0F6E56', margin: 0 }}>
          Novo pedido
        </h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Preenche os dados do acompanhamento</p>
      </div>
      <NovoPedidoForm utentes={utentes ?? []} instituicoes={instituicoes ?? []} />
    </div>
  )
}