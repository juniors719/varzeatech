import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { CriarRachaForm } from './form'
import Link from 'next/link'

export default async function CriarRachaPage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Criar Novo Racha 🏟️</h1>
            <Link
              href="/dashboard"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              ← Voltar
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
          <p className="text-zinc-400 mb-8">
            Configure os detalhes do seu racha. Você poderá convidar jogadores após criar.
          </p>
          <CriarRachaForm />
        </div>
      </main>
    </div>
  )
}
