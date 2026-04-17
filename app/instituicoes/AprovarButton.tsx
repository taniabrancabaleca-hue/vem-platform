'use client'
import { useState } from 'react'
import { aprovarInstituicao } from './actions'
import { useRouter } from 'next/navigation'

export default function AprovarButton({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleAprovar() {
    setLoading(true)
    try {
      await aprovarInstituicao(id)
      router.refresh()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      className="btn-primary"
      style={{ padding: '4px 12px', fontSize: 12, opacity: loading ? 0.7 : 1 }}
      onClick={handleAprovar}
      disabled={loading}
    >
      {loading ? '…' : 'Aprovar'}
    </button>
  )
}
