'use client'

import { useState } from 'react'
import { salvarPerfil } from './actions'

interface PerfilFormProps {
  userId: string
  email: string
  perfilExistente?: {
    full_name: string
    nickname: string | null
    position: string
    avatar_url: string | null
  } | null
}

export function PerfilForm({ userId, email, perfilExistente }: PerfilFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(false)

    const result = await salvarPerfil(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
      <form action={handleSubmit} className="space-y-6">
        <input type="hidden" name="userId" value={userId} />

        {/* Email (read-only) */}
        <div>
          <label className="block text-sm font-medium text-zinc-300">
            Email
          </label>
          <input
            type="text"
            value={email}
            disabled
            className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-500 cursor-not-allowed"
          />
        </div>

        {/* Nome Completo */}
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-zinc-300">
            Nome Completo *
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            required
            defaultValue={perfilExistente?.full_name}
            className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            placeholder="João Silva"
          />
        </div>

        {/* Apelido */}
        <div>
          <label htmlFor="apelido" className="block text-sm font-medium text-zinc-300">
            Apelido (opcional)
          </label>
          <input
            id="apelido"
            name="apelido"
            type="text"
            defaultValue={perfilExistente?.nickname || ''}
            className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            placeholder="Neymar Jr"
          />
        </div>

        {/* Campo de posição removido */}

        {/* URL da Foto */}
        <div>
          <label htmlFor="foto_url" className="block text-sm font-medium text-zinc-300">
            URL da Foto (opcional)
          </label>
          <input
            id="foto_url"
            name="foto_url"
            type="url"
            defaultValue={perfilExistente?.avatar_url || ''}
            className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            placeholder="https://..."
          />
          <p className="mt-1 text-xs text-zinc-500">
            Cole o link de uma imagem (ex: do Instagram, Imgur, etc)
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="rounded-lg border border-green-500/50 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            ✅ Perfil salvo com sucesso!
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition-all hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Salvando...' : perfilExistente ? 'Atualizar Perfil' : 'Criar Perfil'}
        </button>
      </form>
    </div>
  )
}
