'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function DefinicoesPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [loadingEmail, setLoadingEmail] = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)
  const [mensagemEmail, setMensagemEmail] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null)
  const [mensagemPassword, setMensagemPassword] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null)

  async function handleAlterarEmail() {
    if (!email) return
    setLoadingEmail(true)
    setMensagemEmail(null)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ email })
    if (error) {
      setMensagemEmail({ tipo: 'erro', texto: 'Erro ao alterar email: ' + error.message })
    } else {
      setMensagemEmail({ tipo: 'sucesso', texto: 'Email atualizado com sucesso!' })
      setEmail('')
    }
    setLoadingEmail(false)
  }

  async function handleAlterarPassword() {
    if (!password || !confirmarPassword) return
    if (password !== confirmarPassword) {
      setMensagemPassword({ tipo: 'erro', texto: 'As passwords não coincidem.' })
      return
    }
    if (password.length < 6) {
      setMensagemPassword({ tipo: 'erro', texto: 'A password deve ter pelo menos 6 caracteres.' })
      return
    }
    setLoadingPassword(true)
    setMensagemPassword(null)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setMensagemPassword({ tipo: 'erro', texto: 'Erro ao alterar password: ' + error.message })
    } else {
      setMensagemPassword({ tipo: 'sucesso', texto: 'Password alterada com sucesso!' })
      setPassword('')
      setConfirmarPassword('')
    }
    setLoadingPassword(false)
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 400, color: '#1B65B2', margin: 0 }}>Definições</h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Configurações da plataforma VEM</p>
      </div>

      {/* Alterar Email */}
      <div style={{ background: 'white', borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)', padding: 32, maxWidth: 560, marginBottom: 24 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: '#374151', margin: '0 0 4px' }}>Alterar email</h2>
        <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 20px' }}>Introduz o novo endereço de email.</p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Novo email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="novo@email.com"
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13, color: '#1a1a18', boxSizing: 'border-box' }}
          />
        </div>

        {mensagemEmail && (
          <div style={{ background: mensagemEmail.tipo === 'sucesso' ? '#dcfce7' : '#fee2e2', border: `1px solid ${mensagemEmail.tipo === 'sucesso' ? '#86efac' : '#fca5a5'}`, borderRadius: 8, padding: 12, color: mensagemEmail.tipo === 'sucesso' ? '#15803d' : '#991b1b', fontSize: 13, marginBottom: 16 }}>
            {mensagemEmail.texto}
          </div>
        )}

        <button
          onClick={handleAlterarEmail}
          disabled={loadingEmail || !email}
          style={{ background: '#1B65B2', color: 'white', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 500, cursor: loadingEmail || !email ? 'not-allowed' : 'pointer', opacity: loadingEmail || !email ? 0.6 : 1 }}
        >
          {loadingEmail ? 'A guardar...' : 'Guardar email'}
        </button>
      </div>

      {/* Alterar Password */}
      <div style={{ background: 'white', borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)', padding: 32, maxWidth: 560 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: '#374151', margin: '0 0 4px' }}>Alterar password</h2>
        <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 20px' }}>A password deve ter pelo menos 6 caracteres.</p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Nova password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13, color: '#1a1a18', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Confirmar password</label>
          <input
            type="password"
            value={confirmarPassword}
            onChange={e => setConfirmarPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13, color: '#1a1a18', boxSizing: 'border-box' }}
          />
        </div>

        {mensagemPassword && (
          <div style={{ background: mensagemPassword.tipo === 'sucesso' ? '#dcfce7' : '#fee2e2', border: `1px solid ${mensagemPassword.tipo === 'sucesso' ? '#86efac' : '#fca5a5'}`, borderRadius: 8, padding: 12, color: mensagemPassword.tipo === 'sucesso' ? '#15803d' : '#991b1b', fontSize: 13, marginBottom: 16 }}>
            {mensagemPassword.texto}
          </div>
        )}

        <button
          onClick={handleAlterarPassword}
          disabled={loadingPassword || !password || !confirmarPassword}
          style={{ background: '#1B65B2', color: 'white', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 500, cursor: loadingPassword || !password || !confirmarPassword ? 'not-allowed' : 'pointer', opacity: loadingPassword || !password || !confirmarPassword ? 0.6 : 1 }}
        >
          {loadingPassword ? 'A guardar...' : 'Guardar password'}
        </button>
      </div>
    </div>
  )
}