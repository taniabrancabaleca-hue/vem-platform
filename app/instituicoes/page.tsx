import { createClient } from '@/lib/supabase'
import { Building2 } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const TIPO_LABEL: Record<string, string> = {
  hospital: 'Hospital', clinica: 'Clínica', residencia: 'Residência'
}
const TIPO_COLORS: Record<string, { bg: string; color: string }> = {
  hospital:   { bg: '#E6F1FB', color: '#0C447C' },
  clinica:    { bg: '#EEEDFE', color: '#3C3489' },
  residencia: { bg: '#FAEEDA', color: '#633806' },
}

export default async function InstituicoesPage() {
  const supabase = createClient()
  const { data: instituicoes } = await supabase.from('instituicoes').select('*').order('created_at', { ascending: false })

  const ativas = instituicoes?.filter(i => i.estado === 'ativa').length ?? 0
  const pendentes = instituicoes?.filter(i => i.estado === 'pendente').length ?? 0

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 400, color: '#0F6E56', margin: 0 }}>Instituições</h1>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{ativas} ativas · {pendentes} pendentes</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>+ Adicionar</button>
      </div>

      {pendentes > 0 && (
        <div style={{ background: '#FAEEDA', border: '1px solid #FAC775', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: '#633806' }}><strong>{pendentes}</strong> instituição(ões) aguardam aprovação</span>
        </div>
      )}

      <div className="data-card">
        <table className="vem-table">
          <thead>
            <tr><th>Nome</th><th>Tipo</th><th>Cidade</th><th>Email</th><th>Estado</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {instituicoes?.map(inst => {
              const tc = TIPO_COLORS[inst.tipo] ?? { bg: '#f3f4f6', color: '#6b7280' }
              return (
                <tr key={inst.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: tc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Building2 size={14} color={tc.color} />
                      </div>
                      <span style={{ fontWeight: 500, color: '#111827' }}>{inst.nome}</span>
                    </div>
                  </td>
                  <td><span style={{ fontSize: 12, background: tc.bg, color: tc.color, padding: '2px 10px', borderRadius: 20, fontWeight: 500 }}>{TIPO_LABEL[inst.tipo]}</span></td>
                  <td style={{ fontSize: 13, color: '#6b7280' }}>{inst.cidade ?? '—'}</td>
                  <td style={{ fontSize: 12, color: '#6b7280' }}>{inst.email}</td>
                  <td>
                    <span className={`badge badge-${inst.estado === 'ativa' ? 'concluido' : inst.estado === 'pendente' ? 'pendente' : 'cancelado'}`}>
                      {inst.estado === 'ativa' ? 'Ativa' : inst.estado === 'pendente' ? 'Pendente' : 'Suspensa'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <a href={`/instituicoes/${inst.id}`} className="btn-secondary" style={{ padding: '4px 12px', fontSize: 12, textDecoration: 'none' }}>Ver</a>
                      {inst.estado === 'pendente' && <button className="btn-primary" style={{ padding: '4px 12px', fontSize: 12 }}>Aprovar</button>}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}