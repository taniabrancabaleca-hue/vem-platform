import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function GuiasPage() {
  const supabase = createClient()
  const { data: guias, error } = await supabase.from('guias').select('*').order('rating', { ascending: false })

  if (error) return <div style={{padding:40}}>Erro: {error.message}</div>

  return (
    <div style={{padding:40}}>
      <h1 style={{fontSize:28,color:'#0F6E56',marginBottom:20}}>Guias VEM</h1>
      <p style={{marginBottom:20}}>{guias?.length ?? 0} guias registados</p>
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {guias?.map(g => (
          <div key={g.id} style={{background:'white',border:'1px solid #e5e7eb',borderRadius:12,padding:'14px 18px'}}>
            <strong>{g.nome}</strong> — {g.zona} — ★ {String(g.rating)}
          </div>
        ))}
      </div>
    </div>
  )
}