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
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email ou palavra-passe incorretos.')
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F6F4' }}>
      <div style={{ width: 380, background: 'white', borderRadius: 16, border: '1px solid rgba(0,0,0,0.06)', padding: '40px 36px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Image
            src="/logo.png"
            alt="VEM - Mobilidade com Dignidade"
            width={160}
            height={70}
            priority
            style={{ margin: '0 auto 8px' }}
          />
        </div>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="nome@instituicao.pt" required />
          </div>
          <div>
            <label className="form-label">Palavra-passe</label>
            <input ty
git add .
git commit -m "Add logo to login page"
git push origin main
