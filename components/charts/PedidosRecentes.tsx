import { getPedidosRecentes } from '@/lib/data'
import { format, parseISO } from 'date-fns'
import { pt } from 'date-fns/locale'
import type { EstadoPedido, TipoServico } from '@/types/database'

const ESTADO_LABEL: Record<EstadoPedido, string> = {
  pendente:        'Pendente',
  atribuido:       'Atribuído',
  guia_a_caminho:  'A caminho',
  em_curso:        'Em curso',
  concluido:       'Concluído',
  cancelado:       'Cancelado',
}

const TIPO_LABEL: Record<TipoServico, string> = {
  consulta_externa:      'Consulta ext.',
  transporte_consulta:   'Transporte',
  passeio:               'Passeio',
  recolha_pos_alta:      'Pós-alta',
  acompanhamento_exame:  'Exame',
}

export default async function PedidosRecentes() {
  const pedidos = await getPedidosRecentes(8)

  return (
    <table className="vem-table">
      <thead>
        <tr>
          <th>Código</th>
          <th>Utente</th>
          <th>Instituição</th>
          <th>Tipo</th>
          <th>Data</th>
          <th>Guia</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {pedidos.map(p => (
          <tr key={p.id}>
            <td>
              <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#1B65B2', fontWeight: 500 }}>
                #{p.codigo}
              </span>
              {p.urgente && (
                <span className="badge badge-urgente" style={{ marginLeft: 6 }}>Urgente</span>
              )}
            </td>
            <td style={{ fontWeight: 500, color: '#111827' }}>
              {(p as any).utente?.nome ?? '—'}
              {(p as any).utente?.condicao && (
                <span style={{ display: 'block', fontSize: 11, color: '#9ca3af', fontWeight: 400 }}>
                  {(p as any).utente.condicao}
                </span>
              )}
            </td>
            <td style={{ color: '#6b7280' }}>{(p as any).instituicao?.nome ?? '—'}</td>
            <td style={{ color: '#6b7280' }}>{TIPO_LABEL[p.tipo_servico]}</td>
            <td style={{ color: '#6b7280', fontSize: 12 }}>
              {format(parseISO(p.data_servico), "dd MMM · HH'h'mm", { locale: pt })}
            </td>
            <td style={{ color: '#6b7280' }}>{(p as any).guia?.nome ?? <span style={{ color: '#d1d5db' }}>—</span>}</td>
            <td>
              <span className={`badge badge-${p.estado}`}>
                {ESTADO_LABEL[p.estado]}
              </span>
            </td>
          </tr>
        ))}
        {pedidos.length === 0 && (
          <tr>
            <td colSpan={7} style={{ textAlign: 'center', color: '#9ca3af', padding: 32 }}>
              Sem pedidos registados
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
