'use client'

import Link from 'next/link'

interface RachaCardProps {
  match: any
  userId: string
  isCreator: boolean
}

export function RachaCard({ match, userId, isCreator }: RachaCardProps) {
  const matchDate = new Date(match.match_date)
  const now = new Date()
  const isUpcoming = matchDate > now
  const isToday = matchDate.toDateString() === now.toDateString()

  const statusColor = {
    scheduled: 'bg-blue-500/10 border-blue-500/50 text-blue-400',
    in_progress: 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400',
    finished: 'bg-purple-500/10 border-purple-500/50 text-purple-400',
  }[match.status as string] || 'bg-zinc-800 border-zinc-700 text-zinc-400'

  const statusLabel = {
    scheduled: '📅 Agendado',
    in_progress: '🔴 Em Andamento',
    finished: '✅ Finalizado',
  }[match.status as string] || 'Desconhecido'

  const numParticipants = match.match_players?.[0]?.count || 0
  const pricePerPerson = match.rental_cost && numParticipants > 0
    ? Math.ceil((match.rental_cost / numParticipants) * 100) / 100
    : match.rental_cost || 0

  const isDateSoon = isUpcoming && matchDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000

  return (
    <Link href={`/racha/${match.id}`}>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all cursor-pointer h-full flex flex-col">
        {/* Badge Status */}
        <div className={`inline-block rounded-lg border px-3 py-1 text-xs font-medium w-fit mb-4 ${statusColor}`}>
          {statusLabel}
        </div>

        {/* Local */}
        <h3 className="text-lg font-bold mb-4 line-clamp-2">{match.location}</h3>

        {/* Data e Hora */}
        <div className="space-y-2 mb-4 text-sm">
          <p className={isToday ? 'text-yellow-400 font-semibold' : 'text-zinc-400'}>
            {isToday ? '🔥 Hoje' : matchDate.toLocaleDateString('pt-BR', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}
          </p>
          <p className="text-zinc-300 font-semibold">
            {matchDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
          {isDateSoon && (
            <p className="text-orange-400 text-xs font-semibold">⚡ Em breve!</p>
          )}
        </div>

        {/* Badge Creator */}
        {isCreator && (
          <div className="inline-block bg-green-500/20 border border-green-500/50 text-green-400 rounded px-2 py-1 text-xs font-medium w-fit mb-4">
            👑 Você é o organizador
          </div>
        )}

        {/* Participantes */}
        <div className="mb-4 p-3 rounded-lg bg-zinc-800/50 text-sm">
          <p className="text-zinc-400">Participantes</p>
          <p className="text-xl font-bold text-zinc-100">{numParticipants}</p>
        </div>

        {/* Valor */}
        <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
          <p className="text-xs text-zinc-400">Valor por Pessoa</p>
          <p className="text-2xl font-bold text-green-400">R$ {pricePerPerson.toFixed(2)}</p>
        </div>

        {/* Footer - Info de Aluguel */}
        {match.rental_cost && (
          <div className="mt-auto pt-4 border-t border-zinc-800 text-xs text-zinc-500">
            <p>
              R$ {match.rental_hour_value?.toFixed(2)} × {match.rental_hours}h = R$ {match.rental_cost.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </Link>
  )
}
