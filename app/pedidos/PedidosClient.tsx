'use client'
import { useRouter } from 'next/navigation'
import { aprovarPedido, rejeitarPedido } from './[id]/actions'

const SERVICO_LABEL: Record<string, string> = {
  consulta_externa: 'Consulta externa',
  transporte_consulta: 'Transporte consulta',
  passeio: 'Passeio',
  recolha_pos_alta: 'Recolha pós-alta',
  acompanhamento_exame: 'Acomp. exame',
}

const ESTADO_LABEL: Record<string, string> = {
  pendente: 'Pendente',
  atribuido: 'Atribuído',
  guia_a_caminho: 'A caminho',
  em_curso: 'Em curso',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
}

interface Props {
  pedidos: any[]
  utentes: { id: string; nome: string; condicao?: string }[]
  instituicoes: { id: string; nome: string }[]
}

export default function PedidosClient({ pedidos }: Props) {
  const router = useRouter()

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 400, color: '#1B65B2', margin: 0 }}>Pedidos</h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{pedidos.length} pedidos registados</p>
      </div>

      {/* Desktop: tabela */}
      <div className="data-card desktop-only">
        <table className="vem-table">
          <thead>
            <tr>
              <th>Código</th><th>Utente</th><th>Instituição</th>
              <th>Serviço</th><th>Data</th><th>Guia</th><th>Estado</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.length > 0 ? pedidos.map((p: any) => (
              <tr key={p.id} style={{ background: p.urgente ? '#fff7f7' : 'transparent' }}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span onClick={() => router.push(`/pedidos/${p.id}`)} style={{ fontFamily: 'monospace', fontSize: 12, color: '#1B65B2', fontWeight: 500, cursor: 'pointer' }}>#{p.codigo}</span>
                    {p.urgente && (
                      <span style={{ fontSize: 10, fontWeight: 600, background: '#fee2e2', color: '#991b1b', padding: '2px 6px', borderRadius: 20 }}>Urgente</span>
                    )}
                  </div>
                </td>
                <td style={{ fontWeight: 500, fontSize: 13 }}>{p.utente?.nome ?? p.utente_nome_livre ?? '—'}</td>
                <td style={{ color: '#6b7280', fontSize: 13 }}>{p.instituicao?.nome ?? '—'}</td>
                <td style={{ color: '#6b7280', fontSize: 13 }}>{SERVICO_LABEL[p.servico] ?? p.servico ?? '—'}</td>
                <td style={{ color: '#6b7280', fontSize: 12 }}>
                  {p.data_pedido ? new Date(p.data_pedido).toLocaleDateString('pt-PT') : '—'}
                </td>
                <td style={{ color: '#6b7280', fontSize: 13 }}>{p.guia?.nome ?? '—'}</td>
                <td><span className={`badge badge-${p.estado}`}>{ESTADO_LABEL[p.estado] ?? p.estado}</span></td>
                <td>
                  {p.estado === 'pendente' && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <form action={aprovarPedido.bind(null, p.id)}>
                        <button type="submit" style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: '#dcfce7', color: '#15803d', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                          ✓ Aprovar
                        </button>
                      </form>
                      <form action={rejeitarPedido.bind(null, p.id)}>
                        <button type="submit" style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: '#fee2e2', color: '#dc2626', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                          ✗ Rejeitar
                        </button>
                      </form>
                    </div>
                  )}
                </td>
              </tr>
            )) : (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: '#9ca3af', padding: 48 }}>Nenhum pedido ainda</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards */}
      <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {pedidos.length > 0 ? pedidos.map((p: any) => (
          <div key={p.id} style={{ background: 'white', borderRadius: 12, border: `1px solid ${p.urgente ? '#fca5a5' : '#e5e7eb'}`, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span onClick={() => router.push(`/pedidos/${p.id}`)} style={{ fontFamily: 'monospace', fontSize: 13, color: '#1B65B2', fontWeight: 600, cursor: 'pointer' }}>#{p.codigo}</span>
                {p.urgente && (
                  <span style={{ fontSize: 10, fontWeight: 600, background: '#fee2e2', color: '#991b1b', padding: '2px 6px', borderRadius: 20 }}>Urgente</span>
                )}
              </div>
              <span className={`badge badge-${p.estado}`}>{ESTADO_LABEL[p.estado] ?? p.estado}</span>
            </div>
            <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 500, color: '#111827' }}>{p.utente?.nome ?? p.utente_nome_livre ?? '—'}</p>
            <p style={{ margin: '0 0 4px', fontSize: 12, color: '#6b7280' }}>{p.instituicao?.nome ?? '—'}</p>
            <p style={{ margin: '0 0 12px', fontSize: 12, color: '#9ca3af' }}>
              {SERVICO_LABEL[p.servico] ?? p.servico ?? '—'}
              {p.data_pedido ? ` · ${new Date(p.data_pedido).toLocaleDateString('pt-PT')}` : ''}
            </p>
            {p.estado === 'pendente' && (
              <div style={{ display: 'flex', gap: 8 }}>
                <form action={aprovarPedido.bind(null, p.id)}>
                  <button type="submit" style={{ fontSize: 12, padding: '6px 14px', borderRadius: 8, background: '#dcfce7', color: '#15803d', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                    ✓ Aprovar
                  </button>
                </form>
                <form action={rejeitarPedido.bind(null, p.id)}>
                  <button type="submit" style={{ fontSize: 12, padding: '6px 14px', borderRadius: 8, background: '#fee2e2', color: '#dc2626', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                    ✗ Rejeitar
                  </button>
                </form>
              </div>
            )}
          </div>
        )) : (
          <div style={{ textAlign: 'center', color: '#9ca3af', padding: 48 }}>Nenhum pedido ainda</div>
        )}
      </div>
    </div>
  )
}