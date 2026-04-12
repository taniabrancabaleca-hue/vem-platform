'use client'
import { useRouter } from 'next/navigation'

const SERVICO_LABEL: Record<string, string> = {
  consulta_externa:     'Consulta externa',
  transporte_consulta:  'Transporte consulta',
  passeio:              'Passeio',
  recolha_pos_alta:     'Recolha pós-alta',
  acompanhamento_exame: 'Acomp. exame',
}

const ESTADO_LABEL: Record<string, string> = {
  pendente:        'Pendente',
  atribuido:       'Atribuído',
  guia_a_caminho:  'A caminho',
  em_curso:        'Em curso',
  concluido:       'Concluído',
  cancelado:       'Cancelado',
}

interface Props {
  pedidos: any[]
  utentes: { id: string; nome: string; condicao?: string }[]
  instituicoes: { id: string; nome: string }[]
}

export default function PedidosClient({ pedidos, utentes, instituicoes }: Props) {
  const router = useRouter()

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 400, color: '#0F6E56', margin: 0 }}>Pedidos</h1>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{pedidos.length} pedidos registados</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => router.push('/pedidos/novo')}>
          + Novo pedido
        </button>
      </div>

      <div className="data-card">
        <table className="vem-table">
          <thead>
            <tr>
              <th>Código</th><th>Utente</th><th>Instituição</th>
              <th>Serviço</th><th>Data</th><th>Guia</th><th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.length > 0 ? pedidos.map((p: any) => (
              <tr key={p.id}>
                <td>
                  <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#0F6E56', fontWeight: 500 }}>#{p.codigo}</span>
                  {p.urgente && <span className="badge badge-urgente" style={{ marginLeft: 6, fontSize: 10 }}>Urgente</span>}
                </td>
                <td style={{ fontWeight: 500, fontSize: 13 }}>{p.utente?.nome ?? '—'}</td>
                <td style={{ color: '#6b7280', fontSize: 13 }}>{p.instituicao?.nome ?? '—'}</td>
                <td style={{ color: '#6b7280', fontSize: 13 }}>{SERVICO_LABEL[p.tipo_servico] ?? p.tipo_servico}</td>
                <td style={{ color: '#6b7280', fontSize: 12 }}>
                  {p.data_servico ? new Date(p.data_servico).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'}
                </td>
                <td style={{ color: '#6b7280', fontSize: 13 }}>{p.guia?.nome ?? '—'}</td>
                <td><span className={`badge badge-${p.estado}`}>{ESTADO_LABEL[p.estado] ?? p.estado}</span></td>
              </tr>
            )) : (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: '#9ca3af', padding: 48 }}>Nenhum pedido ainda</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}