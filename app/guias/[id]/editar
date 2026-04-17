import { createClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import EditarGuiaForm from '../EditarGuiaForm'

export const dynamic = 'force-dynamic'

export default async function EditarGuiaPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: guia } = await supabase.from('guias').select('*').eq('id', params.id).single()
  if (!guia) notFound()

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 32 }}>
        <a href={`/guias/${params.id}`} style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>← Perfil do guia</a>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 400, color: '#0F6E56', margin: '4px 0 0' }}>
          Editar — {guia.nome}
        </h1>
      </div>
      <EditarGuiaForm guia={guia} />
    </div>
  )
}