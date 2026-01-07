import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { PerfilForm } from './perfil-form'

export default async function PerfilPage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Buscar perfil existente
  const { data: perfil, error: perfilError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <h1 className="text-2xl font-bold">Meu Perfil ⚽</h1>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <PerfilForm 
          userId={user.id} 
          email={user.email!}
          perfilExistente={perfil}
        />
      </main>
    </div>
  )
}
