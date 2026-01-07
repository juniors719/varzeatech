import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { RachaCard } from './racha-card'

// Desabilitar cache para sempre ter dados frescos
export const revalidate = 0

export default async function MeusRachasPage() {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  // Buscar rachas criados pelo usuário
  const { data: createdMatches } = await supabase
    .from('matches')
    .select(`
      id,
      location,
      match_date,
      pix_key,
      rental_cost,
      rental_hours,
      rental_hour_value,
      status,
      created_by,
      created_at,
      match_players(count)
    `)
    .eq('created_by', user.id)
    .order('match_date', { ascending: false })

  // Buscar rachas que o usuário confirmou presença
  const { data: joinedMatches } = await supabase
    .from('match_players')
    .select(`
      match_id,
      matches!inner(
        id,
        location,
        match_date,
        pix_key,
        rental_cost,
        rental_hours,
        rental_hour_value,
        status,
        created_by,
        created_at,
        match_players(count)
      )
    `)
    .eq('user_id', user.id)
    .order('matches(match_date)', { ascending: false })

  // Combinar resultados evitando duplicatas
  const createdIds = new Set(createdMatches?.map(m => m.id) || [])
  const allMatches = [
    ...(createdMatches || []),
    ...(joinedMatches?.flatMap(j => j.matches).filter(m => !createdIds.has(m.id)) || [])
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Meus Rachas 🏟️</h1>
              <p className="text-sm text-zinc-400 mt-1">
                {allMatches.length} racha{allMatches.length !== 1 ? 's' : ''} encontrado{allMatches.length !== 1 ? 's' : ''}
              </p>
            </div>
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
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {allMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allMatches.map((match) => (
              <RachaCard 
                key={match.id} 
                match={match}
                userId={user.id}
                isCreator={match.created_by === user.id}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-12 text-center">
            <p className="text-lg text-zinc-400 mb-4">Nenhum racha encontrado</p>
            <p className="text-sm text-zinc-500 mb-6">
              Você ainda não criou ou se confirmou em nenhum racha
            </p>
            <Link
              href="/racha/criar"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Criar um Racha
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
