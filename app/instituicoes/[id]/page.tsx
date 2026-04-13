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
            <div style={{ width: 48, height: 48, bo