'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError('Email ou palavra-passe incorretos.')
      setLoading(false)
      return
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: perfil } = await supabase
        .from('perfis')
        .select('role')
        .eq('id', user.id)
        .single()
      if (perfil?.role === 'parceiro') {
        router.push('/parceiro')
      } else {
        router.push('/dashboard')
      }
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F6F4' }}>
      <div style={{ width: 380, background: 'white', borderRadius: 16, border: '1px solid rgba(0,0,0,0.06)', padding: '40px 36px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Image src="/logo.png" alt="VEM - Mobilidade com Dignidade" width={160} height={70} priority style={{ margin: '0 auto 8px' }} />
        </div>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="nome@instituicao.pt" required />
          </div>
          <div>
            <label className="form-label">Palavra-passe</label>
            <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          {error && <p style={{ fontSize: 13, color: '#dc2626', background: '#FEE2E2', padding: '8px 12px', borderRadius: 8, margin: 0 }}>{error}</p>}
          <button type="submit" className="btn-primary" style={{ padding: '11px', fontSize: 14, marginTop: 4, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? 'A entrar…' : 'Entrar'}
          </button>
        </form>
        <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 24 }}>vem.com.pt · Mobilidade com Dignidade</p>
      </div>
    </div>
  )
}
