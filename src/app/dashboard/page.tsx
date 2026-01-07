import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { logout } from '../login/actions'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Verificar se o perfil existe
  const { data: perfil, error: perfilError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Se deu erro ou não tem perfil, redireciona
  if (perfilError || !perfil) {
    redirect('/perfil')
  }

  const getPositionEmoji = (position: string) => {
    const emojis: Record<string, string> = {
      goleiro: '🧤',
      zagueiro: '🛡️',
      lateral: '↔️',
      meia: '🎯',
      atacante: '⚡',
    }
    return emojis[position] || '⚽'
  }

  const getPositionLabel = (position: string) => {
    const labels: Record<string, string> = {
      goleiro: 'Goleiro',
      zagueiro: 'Zagueiro',
      lateral: 'Lateral',
      meia: 'Meia',
      atacante: 'Atacante',
    }
    return labels[position] || 'Jogador'
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">VárzeaTech ⚽</h1>
              <p className="text-sm text-zinc-400">Seu gerenciador de rachas</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/perfil"
                className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium hover:bg-zinc-700 transition-colors"
              >
                ⚙️ Perfil
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-lg bg-red-900/30 px-4 py-2 text-sm font-medium hover:bg-red-900/50 transition-colors text-red-400"
                >
                  Sair
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Greeting Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">
            Bem-vindo de volta, {perfil.full_name.split(' ')[0]}! 👋
          </h2>
          <p className="text-zinc-400">Acompanhe sua carreira no society</p>
        </div>

        {/* Hero Card - Perfil */}
        <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 mb-8 shadow-2xl">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {perfil.avatar_url ? (
                  <img
                    src={perfil.avatar_url}
                    alt={perfil.full_name}
                    className="h-32 w-32 rounded-full object-cover border-4 border-green-500 shadow-lg"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-5xl font-bold shadow-lg">
                    {perfil.full_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-4xl font-bold">{perfil.full_name}</h2>
                </div>
                {perfil.nickname && (
                  <p className="text-zinc-400 text-xl mb-4">&quot;{perfil.nickname}&quot;</p>
                )}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{getPositionEmoji(perfil.position)}</span>
                  <span className="text-lg font-semibold">{getPositionLabel(perfil.position)}</span>
                </div>
                <Link
                  href="/perfil"
                  className="inline-block text-sm text-green-400 hover:text-green-300 transition-colors underline"
                >
                  ✏️ Editar perfil
                </Link>
              </div>
            </div>

            {/* Rating Badge */}
            <div className="text-center">
              <div className="rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 p-6">
                <p className="text-sm text-zinc-400 mb-2">Rating</p>
                <p className="text-5xl font-bold text-yellow-400">{perfil.rating}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 hover:border-zinc-700 transition-colors">
            <p className="text-sm text-zinc-400 mb-2">Partidas Jogadas</p>
            <p className="text-3xl font-bold text-blue-400">{perfil.total_matches}</p>
            <p className="text-xs text-zinc-500 mt-2">
              {perfil.total_matches === 0 ? 'Comece agora!' : ''}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 hover:border-zinc-700 transition-colors">
            <p className="text-sm text-zinc-400 mb-2">Vitórias</p>
            <p className="text-3xl font-bold text-green-400">{perfil.total_wins}</p>
            {perfil.total_matches > 0 && (
              <p className="text-xs text-zinc-500 mt-2">
                {Math.round((perfil.total_wins / perfil.total_matches) * 100)}% de aproveitamento
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 hover:border-zinc-700 transition-colors">
            <p className="text-sm text-zinc-400 mb-2">Gols</p>
            <p className="text-3xl font-bold text-purple-400">{perfil.total_goals}</p>
            {perfil.total_matches > 0 && (
              <p className="text-xs text-zinc-500 mt-2">
                {(perfil.total_goals / perfil.total_matches).toFixed(1)} gols por jogo
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 hover:border-zinc-700 transition-colors">
            <p className="text-sm text-zinc-400 mb-2">Nível</p>
            <p className="text-3xl font-bold text-cyan-400">
              {perfil.rating >= 1500 ? '⭐ Ouro' : perfil.rating >= 1250 ? '🥈 Prata' : '🥉 Bronze'}
            </p>
            <p className="text-xs text-zinc-500 mt-2">Ranking do servidor</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/racha/criar"
              className="rounded-2xl border-2 border-dashed border-green-500/50 bg-green-500/5 p-6 hover:border-green-500 hover:bg-green-500/10 transition-all group"
            >
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🏟️</div>
              <p className="font-bold text-green-400">+ Criar Racha</p>
              <p className="text-xs text-zinc-400 mt-1">Organize uma partida</p>
            </Link>

            <button className="rounded-2xl border-2 border-dashed border-blue-500/50 bg-blue-500/5 p-6 hover:border-blue-500 hover:bg-blue-500/10 transition-all group">
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">📋</div>
              <p className="font-bold text-blue-400">Meus Rachas</p>
              <p className="text-xs text-zinc-400 mt-1">Veja seus eventos</p>
            </button>

            <button className="rounded-2xl border-2 border-dashed border-purple-500/50 bg-purple-500/5 p-6 hover:border-purple-500 hover:bg-purple-500/10 transition-all group">
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🏆</div>
              <p className="font-bold text-purple-400">Rankings</p>
              <p className="text-xs text-zinc-400 mt-1">Veja o placar geral</p>
            </button>
          </div>
        </div>

        {/* Histórico de Partidas */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
          <h3 className="text-xl font-bold mb-6">📅 Histórico de Partidas</h3>
          
          {perfil.total_matches === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">⚽</div>
              <p className="text-zinc-400 mb-4">Você ainda não jogou nenhuma partida</p>
              <button className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-500 transition-colors">
                Criar seu primeiro racha
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Placeholder para partidas futuras */}
              <p className="text-zinc-400">Suas partidas aparecerão aqui...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
