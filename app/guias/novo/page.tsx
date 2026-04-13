import NovoGuiaForm from '../NovoGuiaForm'

export default function NovoGuiaPage() {
  return (
    <div className="fade-in">
      <div style={{ marginBottom: 32 }}>
        <a href="/guias" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>← Guias</a>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 400, color: '#0F6E56', margin: '4px 0 0' }}>
          Novo guia
        </h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Regista um novo guia na plataforma</p>
      </div>
      <NovoGuiaForm />
    </div>
  )
}