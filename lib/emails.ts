import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'VEM Platform <onboarding@resend.dev>'

const SERVICO_LABEL: Record<string, string> = {
  consulta_externa:     'Consulta externa',
  transporte_consulta:  'Transporte para consulta',
  passeio:              'Passeio',
  recolha_pos_alta:     'Recolha pós-alta',
  acompanhamento_exame: 'Acompanhamento a exame',
}

function baseStyle() {
  return `font-family: Georgia, serif; background: #f9fafb; padding: 40px 20px;`
}

function card(content: string) {
  return `
    <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden;">
      <div style="background: #0F6E56; padding: 24px 32px;">
        <h1 style="margin: 0; font-family: Georgia, serif; font-size: 22px; font-weight: 400; color: #ffffff;">VEM Platform</h1>
        <p style="margin: 4px 0 0; font-size: 13px; color: #a7f3d0;">Plataforma B2B de acompanhamento</p>
      </div>
      <div style="padding: 32px;">${content}</div>
      <div style="background: #f3f4f6; padding: 16px 32px; font-size: 12px; color: #9ca3af; text-align: center;">
        VEM Platform · Este é um email automático, não responda.
      </div>
    </div>`
}

function row(label: string, value: string) {
  return `<div style="display: flex; gap: 8px; margin-bottom: 8px;">
    <span style="font-size: 12px; color: #6b7280; width: 120px; flex-shrink: 0;">${label}</span>
    <span style="font-size: 13px; color: #111827;">${value}</span>
  </div>`
}

export async function enviarEmailPedidoCriado({ para, codigo, servico, utente, instituicao, data, urgente }: {
  para: string; codigo: string; servico: string; utente: string; instituicao: string; data: string; urgente: boolean
}) {
  await resend.emails.send({
    from: FROM, to: para,
    subject: `Pedido ${codigo} criado${urgente ? ' 🚨 URGENTE' : ''}`,
    html: `<div style="${baseStyle()}">${card(`
      <h2 style="margin: 0 0 8px; font-size: 20px; font-weight: 400; color: #0F6E56;">Pedido criado</h2>
      <p style="margin: 0 0 24px; font-size: 13px; color: #6b7280;">O pedido <strong>${codigo}</strong> foi registado com sucesso.</p>
      ${urgente ? `<div style="background: #FEE2E2; border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #991B1B; margin-bottom: 20px;">⚠️ Pedido marcado como URGENTE</div>` : ''}
      <div style="background: #f9fafb; border-radius: 8px; padding: 16px;">
        ${row('Código', codigo)}${row('Serviço', SERVICO_LABEL[servico] ?? servico)}${row('Utente', utente)}${row('Instituição', instituicao)}${row('Data', data)}${row('Estado', 'Pendente')}
      </div>`)}</div>`,
  })
}

export async function enviarEmailGuiaAtribuido({ para, codigo, servico, utente, guia, guiaZona, guiaTelefone, data }: {
  para: string; codigo: string; servico: string; utente: string; guia: string; guiaZona?: string; guiaTelefone?: string; data: string
}) {
  await resend.emails.send({
    from: FROM, to: para,
    subject: `Guia atribuído ao pedido ${codigo}`,
    html: `<div style="${baseStyle()}">${card(`
      <h2 style="margin: 0 0 8px; font-size: 20px; font-weight: 400; color: #0F6E56;">Guia atribuído</h2>
      <p style="margin: 0 0 24px; font-size: 13px; color: #6b7280;">Um guia foi atribuído ao pedido <strong>${codigo}</strong>.</p>
      <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        ${row('Código', codigo)}${row('Serviço', SERVICO_LABEL[servico] ?? servico)}${row('Utente', utente)}${row('Data', data)}
      </div>
      <div style="background: #E1F5EE; border-radius: 8px; padding: 16px;">
        <p style="margin: 0 0 12px; font-size: 11px; font-weight: 600; color: #0F6E56; text-transform: uppercase;">Guia</p>
        ${row('Nome', guia)}${guiaZona ? row('Zona', guiaZona) : ''}${guiaTelefone ? row('Telefone', guiaTelefone) : ''}
      </div>`)}</div>`,
  })
}