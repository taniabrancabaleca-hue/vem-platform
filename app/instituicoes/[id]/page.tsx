import { createClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import RelatorioPDFButton from './RelatorioPDFButton'

export const dynamic = 'force-dynamic'

const TIPO_LABEL: Record<string, string> = {
  hospital: 'Hospital', clinica: 'Clínica', residencia: 'Residência'
}
const TIPO_COLORS: Record<string, { bg: string; color: string }> = {
  hospital:   { bg: '#E6F1FB', color: '#0C447C' },
  clinica:    { bg: '#EEEDFE', color: '#3C3489' },
  residencia: { bg: '#FAEEDA', color: '#633806' },
}

export default async function InstituicaoPerfilPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const [{ data: inst }, { data: pedidos }] = await Promise.all([
    supabase.from('instituicoes').select('*').eq('id', params.id).single(),
    supabase
      .from('pedidos')
      .select('*, utente:utentes(nome), guia:guias(nome)')
      .eq('instituicao_id', params.id)
      .order('data_pedido', { ascending: false })
      .limit(50),
  ])

  if (!inst) notFound()

  const tc = TIPO_COLORS[inst.tipo] ?? { bg: '#f3f4f6', color: '#6b7280' }
  const concluidos = pedidos?.filter(p => p.estado === 'concluido').length ?? 0
  const pendentes  = pedidos?.filter(p => p.estado === 'pendente').length ?? 0
  const emCurso    = pedidos?.filter(p => ['atribuido', 'guia_a_caminho', 'em_curso'].includes(p.estado)).length ?? 0

  const agora = new Date()
  const pedidosMes = pedidos?.filter(p => {
    if (!p.data_pedido) return false
    const d = new Date(p.data_pedido)
    return d.getMonth() === agora.getMonth() && d.getFullYear() === agora.getFullYear()
  }) ?? []

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 32 }}>
        <a href="/instituicoes" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>← Instituições</a>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: tc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🏥</div>
            <div>
              <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 400, color: '#0F6E56', margin: 0 }}>{inst.nome}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <span style={{ fontSize: 12, background: tc.bg, color: tc.color, padding: '2px 10px', borderRadius: 20, fontWeight: 500 }}>{TIPO_LABEL[inst.tipo]}</span>
                <span className={`badge badge-${inst.estado === 'ativa' ? 'concluido' : inst.estado === 'pendente' ? 'pendente' : 'cancelado'}`}>
                  {inst.estado === 'ativa' ? 'Ativa' : inst.estado === 'pendente' ? 'Pendente' : 'Suspensa'}
                </span>
              </div>
            </div>
          </div>
          <RelatorioPDFButton instituicaoId={inst.id} instituicaoNome={inst.nome} pedidos={pedidosMes} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total pedidos', value: pedidos?.length ?? 0 },
          { label: 'Concluídos', value: concluidos },
          { label: 'Pendentes', value: pendentes },
          { label: 'Em curso', value: emCurso },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <p style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>{k.label}</p>
            <p style={{ fontSize: 28, fontWeight: 400, fontFamily: 'Fraunces, serif', color: '#0F6E56', margin: 0 }}>{k.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, height: 'fit-content' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Contacto</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Email', value: inst.email },
              { label: 'Telefone', value: inst.telefone ?? '—' },
              { label: 'Morada', value: inst.morada ?? '—' },
              { label: 'Cidade', value: inst.cidade ?? '—' },
              { label: 'NIF', value: inst.nif ?? '—' },
            ].map(r => (
              <div key={r.label}>
                <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 2px' }}>{r.label}</p>
                <p style={{ fontSize: 13, color: '#111827', margin: 0 }}>{r.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Pedidos recentes</p>
          {pedidos && pedidos.length > 0 ? (
            <table className="vem-table">
              <thead>
                <tr><th>Código</th><th>Utente</th><th>Guia</th><th>Data</th><th>Estado</th></tr>
              </thead>
              <tbody>
                {pedidos.slice(0, 15).map((p: any) => (
                  <tr key={p.id}>
                    <td><a href={`/pedidos/${p.id}`} style={{ fontSize: 13, color: '#0F6E56', textDecoration: 'none', fontWeight: 500 }}>#{p.codigo}</a></td>
                    <td style={{ fontSize: 13, color: '#374151' }}>{p.utente?.nome ?? '—'}</td>
                    <td style={{ fontSize: 12, color: '#6b7280' }}>{p.guia?.nome ?? '—'}</td>
                    <td style={{ fontSize: 12, color: '#6b7280' }}>{p.data_pedido ? new Date(p.data_pedido).toLocaleDateString('pt-PT') : '—'}</td>
                    <td><span className={`badge badge-${p.estado}`}>{p.estado === 'concluido' ? 'Concluído' : p.estado === 'pendente' ? 'Pendente' : p.estado === 'cancelado' ? 'Cancelado' : p.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', padding: '32px 0' }}>Sem pedidos registados</p>
          )}
        </div>
      </div>
    </div>
  )
}