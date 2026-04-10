import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PedidosPage() {
  const supabase = createClient()
  const { data: pedidos } = await supabase
    .from('pedidos')
    .select('*, utente:utentes(nome, condicao), guia:guias(nome), instituicao:instituicoes(nome)')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 400, color: '#0F6E56', margin: 0 }}>Pedidos</h1>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{pedidos?.length ?? 0} pedidos registados</p>
        </div>
        <button className="btn-primary">+ Novo pedido</button>
      </div>

      <div className="data-card">
        <table className="vem-table">
          <thead>
            <tr><th>Código</th><th>Utente</th><th>Instituição</th><th>Serviço</th><th>Guia</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {pedidos && pedidos.length > 0 ? pedidos.map((p: any) => (
              <tr key={p.id}>
                <td><span style={{ fontFamily: 'monospace', fontSize: 12, color: '#0F6E56', fontWeight: 500 }}>#{p.codigo}</span></td>
                <td style={{ fontWeight: 500 }}>{p.utente?.nome ?? '—'}</td>
                <td style={{ color: '#6b7280' }}>{p.instituicao?.nome ?? '—'}</td>
                <td style={{ color: '#6b7280' }}>{p.tipo_servico}</td>
                <td style={{ color: '#6b7280' }}>{p.guia?.nome ?? '—'}</td>
                <td><span className={`badge badge-${p.estado}`}>{p.estado}</span></td>
              </tr>
            )) : (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#9ca3af', padding: 48 }}>Nenhum pedido ainda</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}