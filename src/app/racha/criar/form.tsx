'use client'

import { criarRacha } from './actions'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function CriarRachaForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const result = await criarRacha(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
    // Se não houver erro, o redirect automático da server action vai levar para /racha/[id]
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Local */}
      <div>
        <label htmlFor="local" className="block text-sm font-medium text-zinc-300">
          Local do Racha *
        </label>
        <input
          id="local"
          name="local"
          type="text"
          required
          className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
          placeholder="ex: Campo da Vila Maria"
        />
      </div>

      {/* Data */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="data" className="block text-sm font-medium text-zinc-300">
            Data *
          </label>
          <input
            id="data"
            name="data"
            type="date"
            required
            className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
          />
        </div>

        <div>
          <label htmlFor="hora" className="block text-sm font-medium text-zinc-300">
            Horário *
          </label>
          <input
            id="hora"
            name="hora"
            type="time"
            required
            className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
          />
        </div>
      </div>

      {/* Aluguel - Valor da hora e quantidade de horas */}
      <div>
        <p className="block text-sm font-medium text-zinc-300 mb-4">Aluguel do Campo/Quadra</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="valor_hora_aluguel" className="block text-sm font-medium text-zinc-300">
              Valor da Hora (R$) *
            </label>
            <input
              id="valor_hora_aluguel"
              name="valor_hora_aluguel"
              type="number"
              required
              min="0"
              step="0.50"
              className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              placeholder="ex: 100.00"
            />
          </div>

          <div>
            <label htmlFor="quantidade_horas" className="block text-sm font-medium text-zinc-300">
              Quantidade de Horas *
            </label>
            <input
              id="quantidade_horas"
              name="quantidade_horas"
              type="number"
              required
              min="0.5"
              step="0.5"
              className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              placeholder="ex: 2"
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-zinc-400">
          Custo total: (Valor da Hora × Quantidade de Horas)
        </p>
      </div>

      {/* Chave Pix */}
      <div>
        <label htmlFor="pix_key" className="block text-sm font-medium text-zinc-300">
          Chave Pix (opcional)
        </label>
        <input
          id="pix_key"
          name="pix_key"
          type="text"
          className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
          placeholder="ex: seu@email.com ou CPF ou telefone"
        />
        <p className="mt-1 text-xs text-zinc-500">
          Deixe em branco para configurar depois
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition-all hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Criando racha...' : '🏟️ Criar Racha'}
      </button>
    </form>
  )
}
