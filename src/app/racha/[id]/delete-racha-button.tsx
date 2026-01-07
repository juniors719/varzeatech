'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deletarRacha } from './actions'

interface DeleteRachaButtonProps {
  rachaId: string
  isCreator: boolean
}

export function DeleteRachaButton({ rachaId, isCreator }: DeleteRachaButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isCreator) {
    return null
  }

  async function handleDelete() {
    setIsLoading(true)
    setError(null)

    const result = await deletarRacha(rachaId)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      // Se não houver erro, aguarda um pouco e redireciona manualmente
      setTimeout(() => {
        router.push('/meus-rachas')
      }, 500)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-lg bg-red-900/30 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-900/50 transition-colors"
      >
        🗑️ Deletar Racha
      </button>

      {/* Modal/Dialog de Confirmação */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Deletar Racha?</h3>
            <p className="text-zinc-400 mb-6">
              Esta ação é irreversível. Todos os dados do racha e confirmações de presença serão perdidos.
            </p>

            {error && (
              <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/50 p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsOpen(false)
                  setError(null)
                }}
                disabled={isLoading}
                className="flex-1 rounded-lg bg-zinc-800 px-4 py-2 text-white hover:bg-zinc-700 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors disabled:opacity-50 font-semibold"
              >
                {isLoading ? 'Deletando...' : 'Deletar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
