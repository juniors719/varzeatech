import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ConfirmarPresencaButton } from './confirmar-presenca'
import { CopyPixButton } from './copy-pix-button'

interface RachaPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function RachaPage({ params }: RachaPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  // Buscar racha
  const { data: racha, error: rachaError } = await supabase
    .from('matches')
    .select('*')
    .eq('id', id)
    .single()

  if (rachaError || !racha) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Racha não encontrado</h1>
          <Link href="/dashboard" className="text-green-400 hover:text-green-300">
            ← Voltar ao dashboard
          </Link>
        </div>
      </div>
    )
  }

  // Buscar criador do racha
  const { data: creator } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', racha.created_by)
    .single()

  // Buscar participantes
  const { data: participants } = await supabase
    .from('match_players')
    .select('*, profiles:user_id(*)')
    .eq('match_id', id)

  // Verificar se usuário já confirmou presença
  const userConfirmed = participants?.some(p => p.user_id === user.id)

  // Calcular valor por jogador com arredondamento para cima
  const numParticipants = (participants?.length || 0) + (userConfirmed ? 0 : 1) // +1 se o usuário vai confirmar
  const pricePerPerson = numParticipants > 0 
    ? Math.ceil((racha.rental_cost / numParticipants) * 100) / 100
    : racha.rental_cost

  const matchDate = new Date(racha.match_date)
  const isUpcoming = matchDate > new Date()

  const statusColor = {
    scheduled: 'bg-blue-500/10 border-blue-500/50 text-blue-400',
    in_progress: 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400',
    finished: 'bg-purple-500/10 border-purple-500/50 text-purple-400',
  }[racha.status as string] || 'bg-zinc-800 border-zinc-700 text-zinc-400'

  const statusLabel = {
    scheduled: '📅 Agendado',
    in_progress: '🔴 Em Andamento',
    finished: '✅ Finalizado',
  }[racha.status as string] || 'Desconhecido'

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Racha 🏟️</h1>
              <p className="text-sm text-zinc-400">
                {matchDate.toLocaleDateString('pt-BR')} às{' '}
                {matchDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
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
        {/* Detalhes do Racha */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Info Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className={`rounded-2xl border-2 p-6 ${statusColor}`}>
              <p className="text-sm font-medium opacity-75">Status</p>
              <p className="text-2xl font-bold mt-1">{statusLabel}</p>
            </div>

            {/* Detalhes */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-4">
              <div>
                <p className="text-sm text-zinc-400">Local</p>
                <p className="text-xl font-bold">{racha.location}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-zinc-400">Data</p>
                  <p className="font-semibold">
                    {matchDate.toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Horário</p>
                  <p className="font-semibold">
                    {matchDate.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Organizador */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-sm text-zinc-400 mb-4">Organizador</p>
              <div className="flex items-center gap-4">
                {creator?.avatar_url ? (
                  <img
                    src={creator.avatar_url}
                    alt={creator.full_name}
                    className="h-12 w-12 rounded-full object-cover border-2 border-green-500"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center font-bold">
                    {creator?.full_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-bold">{creator?.full_name}</p>
                  {creator?.nickname && <p className="text-sm text-zinc-400">&ldquo;{creator.nickname}&rdquo;</p>}
                </div>
              </div>
            </div>

            {/* Chave Pix */}
            {racha.pix_key && (
              <div className="rounded-2xl border border-green-500/50 bg-green-500/10 p-6">
                <p className="text-sm text-zinc-400 mb-2">Chave Pix para Pagamento</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-black/30 rounded px-3 py-2 text-sm font-mono break-all">
                    {racha.pix_key}
                  </code>
                  <CopyPixButton pixKey={racha.pix_key} />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Finanzas e CTA */}
          <div className="space-y-6">
            {/* Valor */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center">
              <p className="text-sm text-zinc-400 mb-2">Valor por Pessoa</p>
              <p className="text-4xl font-bold text-green-400">
                R$ {pricePerPerson.toFixed(2)}
              </p>
              <p className="text-xs text-zinc-500 mt-2">
                Total: R$ {racha.rental_cost?.toFixed(2)} ÷ {numParticipants} jogador{numParticipants !== 1 ? 'es' : ''}
              </p>
            </div>

            {/* Participantes */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-sm text-zinc-400 mb-4">Participantes</p>
              <p className="text-3xl font-bold mb-4">
                {participants?.length || 0}
                <span className="text-sm text-zinc-400 ml-2">confirmados</span>
              </p>

              {/* CTA Confirmar Presença */}
              {isUpcoming && !userConfirmed ? (
                <ConfirmarPresencaButton rachaId={id} />
              ) : userConfirmed ? (
                <div className="rounded-lg bg-green-500/10 border border-green-500/50 p-3 text-center text-green-400 text-sm font-medium">
                  ✅ Você confirmou presença!
                </div>
              ) : (
                <div className="rounded-lg bg-zinc-800 p-3 text-center text-zinc-400 text-sm">
                  Racha finalizado
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lista de Participantes */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
          <h2 className="text-2xl font-bold mb-6">Lista de Presença</h2>

          {participants && participants.length > 0 ? (
            <div className="space-y-3">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {participant.profiles?.avatar_url ? (
                      <img
                        src={participant.profiles.avatar_url}
                        alt={participant.profiles.full_name}
                        className="h-10 w-10 rounded-full object-cover border-2 border-green-500"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center font-bold text-sm">
                        {participant.profiles?.full_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-bold">{participant.profiles?.full_name}</p>
                      <p className="text-xs text-zinc-400">
                        {participant.profiles?.position === 'goleiro' && '🧤 Goleiro'}
                        {participant.profiles?.position === 'zagueiro' && '🛡️ Zagueiro'}
                        {participant.profiles?.position === 'lateral' && '↔️ Lateral'}
                        {participant.profiles?.position === 'meia' && '🎯 Meia'}
                        {participant.profiles?.position === 'atacante' && '⚡ Atacante'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {participant.has_paid ? '💚 Pago' : '⏳ Pendente'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-zinc-400 py-8">
              Nenhum participante confirmado ainda. Seja o primeiro! ⚽
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
