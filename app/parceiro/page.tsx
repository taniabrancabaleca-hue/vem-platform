import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import PedidosParceiroList from './PedidosParceiroList'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ParceiroPage() {
  const supabase = createClient()

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return <PedidosParceiroList />
}